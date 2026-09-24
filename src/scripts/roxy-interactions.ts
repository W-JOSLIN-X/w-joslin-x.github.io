import { pageFeature } from "./core/page-scope";
import { t } from "../utils/roxy-i18n";
const previewCache = new Map<string, Promise<any>>();
pageFeature((scope) => {
	const input = document.querySelector<HTMLInputElement>("#search-input")!;
	let selected: HTMLAnchorElement | undefined;
	const clearSelection = () => {
		selected?.classList.remove("search-selected");
		selected = undefined;
		input.removeAttribute("aria-activedescendant");
	};
	scope.on(window, "roxy:filters", clearSelection);
	scope.on(input, "input", clearSelection);
	scope.on(document, "keydown", (event: KeyboardEvent) => {
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
			event.preventDefault();
			document.querySelector(".nav-search")?.classList.add("search-open");
			input.focus();
			input.select();
			return;
		}
		if (event.key === "Escape") {
			clearSelection();
			input.blur();
			return;
		}
		if (
			!(document.activeElement === input || document.activeElement === selected)
		)
			return;
		const links = [
			...document.querySelectorAll<HTMLAnchorElement>(
				".timeline-entry:not([hidden]) .timeline-title,.timeline-entry:not([hidden]) .section-result",
			),
		].filter((a) => a.getClientRects().length);
		if (["ArrowDown", "ArrowUp"].includes(event.key) && links.length) {
			event.preventDefault();
			const index = selected ? links.indexOf(selected) : -1;
			const next =
				links[
					(index +
						(event.key === "ArrowDown" ? 1 : index < 0 ? 0 : -1) +
						links.length) %
						links.length
				];
			clearSelection();
			selected = next;
			next.classList.add("search-selected");
			next.focus({ preventScroll: true });
			next.scrollIntoView({ block: "nearest" });
		} else if (event.key === "Enter" && selected) {
			event.preventDefault();
			selected.click();
		}
	});

	const notice = document.createElement("div");
	notice.className = "copy-feedback";
	notice.setAttribute("role", "status");
	notice.hidden = true;
	document.body.append(notice);
	scope.defer(() => notice.remove());
	let noticeTimer: number | undefined;
	scope.on(document, "click", async (e: MouseEvent) => {
		const element = (e.target as Element).closest<HTMLElement>(
			"[data-copy-article],.prose a.anchor",
		);
		if (!element) return;
		const href =
			element instanceof HTMLAnchorElement
				? element.href
				: location.origin + location.pathname;
		try {
			await navigator.clipboard.writeText(href);
			if (!scope.active) return;
			notice.textContent = t("copied");
		} catch {
			if (!scope.active) return;
			notice.textContent = t("copyFailed");
		}
		notice.hidden = false;
		scope.clearTimeout(noticeTimer);
		noticeTimer = scope.timeout(() => (notice.hidden = true), 1500);
	});

	const popover = document.createElement("aside");
	popover.id = "reference-preview";
	popover.className = "reference-preview";
	popover.hidden = true;
	popover.setAttribute("role", "tooltip");
	document.body.append(popover);
	let trigger: HTMLAnchorElement | undefined,
		timer: number | undefined,
		version = 0;
	function hide() {
		++version;
		scope.clearTimeout(timer);
		trigger?.removeAttribute("aria-describedby");
		trigger = undefined;
		popover.hidden = true;
	}
	scope.defer(() => {
		hide();
		popover.remove();
	});
	function position() {
		if (!trigger || popover.hidden) return;
		const rect = trigger.getBoundingClientRect(),
			box = popover.getBoundingClientRect();
		popover.style.left =
			Math.max(12, Math.min(innerWidth - box.width - 12, rect.left)) + "px";
		popover.style.top =
			Math.max(
				12,
				rect.bottom + box.height + 12 < innerHeight
					? rect.bottom + 8
					: rect.top - box.height - 8,
			) + "px";
	}
	function eligible(target: EventTarget | null) {
		const a =
			target instanceof Element
				? target.closest<HTMLAnchorElement>(".prose a[href],.backlinks a[href]")
				: null;
		if (
			!a ||
			a.classList.contains("anchor") ||
			!matchMedia("(hover:hover) and (pointer:fine)").matches
		)
			return;
		const url = new URL(a.href);
		if (url.origin !== location.origin || !url.pathname.startsWith("/posts/"))
			return;
		return a;
	}
	function open(a: HTMLAnchorElement) {
		if (trigger === a) return;
		hide();
		trigger = a;
		const token = version;
		timer = scope.timeout(async () => {
			const url = new URL(a.href),
				slug = url.pathname.replace(/^\/posts\//, "").replace(/\/$/, "");
			const endpoint = `/previews/${slug}.json`;
			try {
				if (!previewCache.has(endpoint)) {
					if (previewCache.size >= 40)
						previewCache.delete(previewCache.keys().next().value!);
					previewCache.set(
						endpoint,
						fetch(endpoint)
							.then((r) => {
								if (!r.ok) throw Error("Preview unavailable");
								return r.json();
							})
							.catch((e) => {
								previewCache.delete(endpoint);
								throw e;
							}),
					);
				}
				const data = await previewCache.get(endpoint);
				if (!scope.active || token !== version) return;
				let hash = "";
				try {
					hash = decodeURIComponent(url.hash.slice(1));
				} catch {}
				const section =
					(hash && data.sections.find((s: any) => s.anchor === hash)) ||
					data.sections.find((s: any) => s.text);
				const title = document.createElement("strong");
				title.textContent =
					data.title + (hash && section?.title ? " · " + section.title : "");
				const body = document.createElement("p");
				body.textContent = section?.text || "";
				popover.replaceChildren(title, body);
				popover.hidden = false;
				a.setAttribute("aria-describedby", popover.id);
				position();
			} catch {
				if (token === version) hide();
			}
		}, 300);
	}
	scope.on(document, "pointerover", (e: PointerEvent) => {
		const a = eligible(e.target);
		if (a) open(a);
	});
	scope.on(document, "focusin", (e: FocusEvent) => {
		const a = eligible(e.target);
		if (a) open(a);
	});
	const leave = (e: MouseEvent | FocusEvent) => {
		if (!trigger) return;
		const target = e.relatedTarget as Node | null;
		if (target && (trigger.contains(target) || popover.contains(target)))
			return;
		if (
			(e.target as Element).closest?.(".reference-preview") ||
			trigger.contains(e.target as Node)
		)
			hide();
	};
	scope.on(document, "pointerout", leave);
	scope.on(document, "focusout", leave);
	scope.on(document, "keydown", (e: KeyboardEvent) => {
		if (e.key === "Escape") hide();
	});
	scope.on(document, "click", hide);
	scope.on(window, "resize", hide);
	scope.on(window, "scroll", position, { passive: true });
});
