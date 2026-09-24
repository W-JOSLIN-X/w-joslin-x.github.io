import { pageFeature } from "./core/page-scope";
import { t } from "../utils/roxy-i18n";
// ClientRouter retains this module; a full reload deliberately starts unfocused.
let focused = false;
export function preserveReadingPosition() {
	const node = [
		...document.querySelectorAll<HTMLElement>(
			".prose p,.prose h2,.prose h3,.prose li",
		),
	].find((el) => el.getBoundingClientRect().bottom > 90);
	const top = node?.getBoundingClientRect().top;
	return () => {
		if (node?.isConnected && top != null)
			window.scrollBy({
				top: node.getBoundingClientRect().top - top,
				behavior: "instant",
			});
	};
}
pageFeature((scope) => {
	const root = document.documentElement;
	const article = document.querySelector<HTMLElement>(
		'body[data-article="true"] .article',
	);
	const sidebar = document.querySelector<HTMLElement>("#left-sidebar")!;
	const desktop = matchMedia("(min-width:1101px)");
	let toc = false,
		width = 960,
		drawerFocus: HTMLElement | null = null;
	try {
		const saved = Number(localStorage.getItem("roxy-focus-width"));
		if (saved >= 480 && saved <= 1440) width = saved;
	} catch {}
	const active = () => focused && !!article;
	function lockBackground() {
		const lock = active();
		document
			.querySelectorAll<
				HTMLInputElement | HTMLButtonElement | HTMLSelectElement
			>(
				"#appearance-panel-background input,#appearance-panel-background select,#appearance-panel-background button:not([data-saver-open]),#reset-appearance",
			)
			.forEach((el) => {
				el.disabled =
					lock ||
					(el.id === "screensaver-idle" &&
						!document.querySelector<HTMLInputElement>("#screensaver-auto")!
							.checked);
			});
		document.querySelector<HTMLButtonElement>(
			"#reset-current-group",
		)!.disabled =
			lock &&
			document.querySelector<HTMLElement>("#appearance")!.dataset.group ===
				"background";
		document.querySelector<HTMLElement>("#focus-background-hint")!.hidden =
			!lock;
		const galleryLink =
			document.querySelector<HTMLAnchorElement>(".slide-controls a");
		galleryLink?.setAttribute("aria-disabled", String(lock));
	}
	function apply(preserve = false) {
		const restore = preserve ? preserveReadingPosition() : () => {};
		root.dataset.focus = String(active());
		root.dataset.focusToc = String(active() && toc && desktop.matches);
		root.style.setProperty("--focus-width", width + "px");
		const drawerOpen = !!article && toc && !desktop.matches;
		sidebar.classList.toggle("toc-drawer", drawerOpen);
		if (drawerOpen) {
			sidebar.setAttribute("role", "dialog");
			sidebar.setAttribute("aria-modal", "true");
			sidebar.setAttribute("aria-label", t("toc"));
		} else {
			sidebar.removeAttribute("role");
			sidebar.removeAttribute("aria-modal");
			sidebar.removeAttribute("aria-label");
		}
		document
			.querySelectorAll<HTMLElement>("[data-focus-toggle],#reading-focus")
			.forEach((button) => {
				button.textContent = t(active() ? "exitFocus" : "focusReading");
				button.setAttribute("aria-pressed", String(active()));
			});
		document
			.querySelectorAll<HTMLElement>("[data-toc-toggle]")
			.forEach((button) =>
				button.setAttribute(
					"aria-expanded",
					String(toc || (!active() && desktop.matches)),
				),
			);
		const slider = document.querySelector<HTMLInputElement>("#focus-width");
		if (slider) slider.value = String(width);
		const output =
			document.querySelector<HTMLOutputElement>("#focus-width-value");
		if (output) output.value = width + "px";
		lockBackground();
		restore();
		window.dispatchEvent(new Event("roxy:focus"));
	}
	function closeToc(restoreFocus = true) {
		toc = false;
		apply();
		if (restoreFocus) drawerFocus?.focus({ preventScroll: true });
		drawerFocus = null;
	}
	scope.on(document, "click", (event) => {
		const target = event.target as Element;
		if (active() && target.closest(".slide-controls a")) event.preventDefault();
		const button = target.closest<HTMLElement>("[data-toc-toggle]");
		if (button && article) {
			drawerFocus = button;
			toc = !toc;
			apply(true);
			if (toc && !desktop.matches)
				sidebar
					.querySelector<HTMLButtonElement>(".drawer-close")
					?.focus({ preventScroll: true });
		}
		if (target.closest("[data-focus-toggle],#reading-focus")) {
			focused = !focused;
			toc = false;
			apply(true);
		}
		if (toc && !desktop.matches && target.closest(".article-toc a")) {
			const link = target.closest<HTMLAnchorElement>("a")!;
			event.preventDefault();
			closeToc(false);
			const heading = document.getElementById(
				decodeURIComponent(link.hash.slice(1)),
			);
			heading?.scrollIntoView({ behavior: "instant", block: "start" });
			if (heading) {
				heading.tabIndex = -1;
				heading.focus({ preventScroll: true });
			}
		} else if (toc && !desktop.matches && !sidebar.contains(target) && !button)
			closeToc();
	});
	if (article)
		sidebar.querySelector<HTMLButtonElement>(".drawer-close")!.onclick = () =>
			closeToc();
	scope.on(document, "keydown", (event) => {
		if (!toc || desktop.matches || document.querySelector("dialog[open]"))
			return;
		if (event.key === "Escape") {
			event.preventDefault();
			closeToc();
		}
		if (event.key === "Tab") {
			const items = [
				...sidebar.querySelectorAll<HTMLElement>("button,a[href]"),
			].filter((el) => el.getClientRects().length);
			if (event.shiftKey && document.activeElement === items[0]) {
				event.preventDefault();
				items.at(-1)?.focus();
			} else if (!event.shiftKey && document.activeElement === items.at(-1)) {
				event.preventDefault();
				items[0]?.focus();
			}
		}
	});
	const slider = document.querySelector<HTMLInputElement>("#focus-width");
	const saveWidth = () => {
		try {
			localStorage.setItem("roxy-focus-width", String(width));
		} catch {}
	};
	if (slider)
		slider.oninput = () => {
			width = Math.max(480, Math.min(1440, Number(slider.value)));
			apply(true);
			saveWidth();
		};
	if (article) {
		for (const side of [-1, 1]) {
			const handle = document.createElement("div");
			handle.className = "focus-resize";
			handle.dataset.side = String(side);
			handle.dataset.noEffects = "";
			handle.setAttribute("aria-hidden", "true");
			article.append(handle);
			let start: { x: number; width: number } | null = null;
			scope.on(handle, "pointerdown", (event) => {
				if (event.button !== 0) return;
				event.preventDefault();
				start = {
					x: event.clientX,
					width: article.getBoundingClientRect().width,
				};
				handle.setPointerCapture(event.pointerId);
			});
			scope.on(handle, "pointermove", (event) => {
				if (!start) return;
				const available = innerWidth - 48 - (toc ? 235 : 0);
				width = Math.round(
					Math.max(
						480,
						Math.min(
							1440,
							available,
							start.width + (event.clientX - start.x) * side * 2,
						),
					),
				);
				apply(true);
			});
			scope.on(handle, "pointerup", () => {
				start = null;
				saveWidth();
			});
			scope.on(handle, "pointercancel", () => {
				start = null;
			});
			scope.defer(() => handle.remove());
		}
		const floating = document.querySelector<HTMLElement>("#floating-reading")!;
		const observer = new IntersectionObserver(
			(entries) => {
				floating.hidden = entries[0].isIntersecting;
			},
			{ rootMargin: "-65px 0px 0px 0px" },
		);
		observer.observe(document.querySelector(".article-topline")!);
		scope.defer(() => observer.disconnect());
		document.querySelector<HTMLButtonElement>("#floating-settings")!.onclick =
			() => {
				const panel = document.querySelector<HTMLElement>("#reading-panel")!;
				panel.classList.add("reading-floating");
				panel.hidden = !panel.hidden;
				for (const id of ["reading-open", "floating-settings"])
					document
						.getElementById(id)
						?.setAttribute("aria-expanded", String(!panel.hidden));
			};
		scope.on(document, "keydown", (e) => {
			if (e.key === "Escape") {
				document.querySelector<HTMLElement>("#reading-panel")!.hidden = true;
				for (const id of ["reading-open", "floating-settings"])
					document.getElementById(id)?.setAttribute("aria-expanded", "false");
			}
		});
	}
	scope.on(desktop, "change", () => {
		toc = false;
		apply(true);
	});
	scope.on(window, "roxy:settings-group", lockBackground);
	scope.on(window, "roxy:language", () => apply());
	scope.defer(() => {
		sidebar.classList.remove("toc-drawer");
	});
	apply();
});
