import { confirmSettings, showExport } from "./settings-dialogs";
import { exportCatalog } from "../utils/roxy-defaults.mjs";
import { gallery, defaultBackgrounds } from "../config/roxy-gallery";
import {
	normalizeSlideshow,
	nextImage,
	shouldEnterScreensaver,
} from "../utils/roxy-slideshow.mjs";
import { t } from "../utils/roxy-i18n";

import { pageFeature } from "./core/page-scope";
let retainedCurrent = "";
let retainedInput = Date.now();
pageFeature((scope) => {
	const key = "roxy-slideshow-v1";
	const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
		document.querySelector<T>(selector)!;
	let stored: unknown;
	try {
		stored = JSON.parse(localStorage.getItem(key) || "{}");
	} catch {
		stored = {};
	}
	let prefs = normalizeSlideshow(
		stored,
		gallery.map((image) => image.id),
	);
	if (!(stored as any)?.selected) prefs.selected = [...defaultBackgrounds];
	let current: string = prefs.selected.includes(retainedCurrent)
		? retainedCurrent
		: prefs.selected[0];
	let timer: number | undefined;
	let lastInput = retainedInput;
	let revision = 0;
	const failed = new Set<string>();
	const saver = $<HTMLDialogElement>("#screensaver");
	const staticBackground = document.body.dataset.staticBackground === "true";
	const article = document.body.dataset.article === "true";
	const focusLocked = () => document.documentElement.dataset.focus === "true";
	let saverEnabled = true;
	const playing = () => (saver.open ? saverEnabled : prefs.enabled);
	const normalSurfaces = Array.from(
		document.querySelectorAll<HTMLElement>(".hero-image,.wallpaper"),
	);
	const saverSurface = $(".screensaver-image");
	type Surface = {
		element: HTMLElement;
		layers: HTMLImageElement[];
		active: number;
	};
	const surfaces: Surface[] = [...normalSurfaces, saverSurface].map(
		(element) => {
			const layers = [0, 1].map(() => {
				const img = new Image();
				img.alt = "";
				img.className = "background-slide";
				img.decoding = "async";
				element.append(img);
				return img;
			});
			return { element, layers, active: 0 };
		},
	);

	function persist() {
		try {
			localStorage.setItem(key, JSON.stringify(prefs));
		} catch {}
	}
	function available(): string[] {
		return prefs.selected.filter((id: string) => !failed.has(id));
	}
	function sync() {
		$<HTMLInputElement>("#slideshow-enabled").checked = prefs.enabled;
		$<HTMLInputElement>("#slideshow-random").checked = prefs.random;
		$<HTMLInputElement>("#slideshow-interval").value = String(prefs.interval);
		$<HTMLInputElement>("#screensaver-auto").checked = prefs.auto;
		$<HTMLInputElement>("#screensaver-idle").value = String(prefs.idleMinutes);
		$<HTMLInputElement>("#screensaver-idle").disabled =
			focusLocked() || !prefs.auto;
		document
			.querySelectorAll<HTMLButtonElement>("[data-slide-pause]")
			.forEach((button) => {
				button.disabled = !saver.open && focusLocked();
				button.textContent = playing() ? "Ⅱ" : "▶";
				button.setAttribute("aria-label", t(playing() ? "pause" : "play"));
				button.setAttribute("aria-pressed", String(!playing()));
			});
		document
			.querySelectorAll<HTMLButtonElement>(
				"[data-slide-prev],[data-slide-next]",
			)
			.forEach((button) => {
				button.disabled =
					available().length < 2 ||
					(!saver.open && (staticBackground || focusLocked()));
			});
	}

	function schedule() {
		scope.clearTimeout(timer);
		if (document.hidden || !playing() || available().length < 2) return;
		if (
			!saver.open &&
			(staticBackground ||
				document.documentElement.dataset.mode === "none" ||
				document.documentElement.dataset.focus === "true")
		)
			return;
		timer = scope.timeout(() => {
			void step(1);
		}, prefs.interval * 1000);
	}

	async function paint(id: string) {
		const image = gallery.find((image) => image.id === id);
		if (!image) return;
		const token = ++revision;
		const loaded = new Image();
		const ok = await new Promise<boolean>((resolve) => {
			const timeout = scope.timeout(() => resolve(false), 12000);
			loaded.onload = () => {
				scope.clearTimeout(timeout);
				resolve(true);
			};
			loaded.onerror = () => {
				scope.clearTimeout(timeout);
				resolve(false);
			};
			loaded.src = imageSource(image);
		});
		if (token !== revision) return;
		if (!ok) {
			failed.add(id);
			sync();
			const fallback = available()[0];
			if (fallback) await paint(fallback);
			return;
		}
		current = id;
		if (!saver.open) retainedCurrent = id;
		if (saver.open)
			saverSurface.style.setProperty("--saver-blur", `url("${loaded.src}")`);
		for (const surface of surfaces) {
			if (
				surface.element === saverSurface
					? !saver.open
					: saver.open ||
						staticBackground ||
						document.documentElement.dataset.focus === "true"
			)
				continue;
			const next = 1 - surface.active;
			const layer = surface.layers[next];
			layer.src = loaded.src;
			layer.style.objectPosition =
				surface.element === saverSurface
					? "center"
					: matchMedia("(max-width: 700px)").matches
						? image.mobilePosition
						: image.position;
			surface.layers[surface.active].classList.remove("visible");
			layer.classList.add("visible");
			surface.active = next;
			surface.element.dataset.imageId = id;
		}
		const upcoming = gallery.find(
			(item) => item.id === nextImage(available(), current, 1, false),
		);
		if (upcoming && !prefs.random) {
			const preload = new Image();
			preload.src = imageSource(upcoming);
		}
		schedule();
	}

	async function step(direction: number) {
		if (focusLocked() && !saver.open) return;
		scope.clearTimeout(timer);
		const id = nextImage(available(), current, direction, prefs.random);
		if (id) await paint(id);
	}

	scope.on(window, "roxy:focus", () => {
		if (document.documentElement.dataset.focus === "true" && !saver.open)
			++revision;
		sync();
		schedule();
	});
	scope.on(window, "roxy:reset-group", (e: CustomEvent) => {
		if (focusLocked() || !["background", "all"].includes(e.detail)) return;
		const defaults = normalizeSlideshow(
			{},
			gallery.map((image) => image.id),
		);
		prefs = { ...defaults, selected: prefs.selected };
		change();
	});
	function change() {
		persist();
		sync();
		schedule();
		lastInput = Date.now();
	}
	for (const [id, field] of [
		["slideshow-enabled", "enabled"],
		["slideshow-random", "random"],
		["screensaver-auto", "auto"],
	] as const) {
		$<HTMLInputElement>(`#${id}`).onchange = (e) => {
			if (focusLocked()) return;
			prefs[field] = (e.target as HTMLInputElement).checked;
			change();
		};
	}
	for (const [id, field] of [
		["slideshow-interval", "interval"],
		["screensaver-idle", "idleMinutes"],
	] as const) {
		const input = $<HTMLInputElement>(`#${id}`);
		input.oninput = () => {
			if (focusLocked()) return;
			if (!input.validity.valid || input.value === "") return;
			prefs[field] = Number(input.value);
			persist();
			schedule();
			lastInput = Date.now();
		};
		input.onchange = (e) => {
			if (focusLocked()) return;
			prefs = normalizeSlideshow(
				{ ...prefs, [field]: Number((e.target as HTMLInputElement).value) },
				gallery.map((image) => image.id),
			);
			change();
		};
	}
	document.querySelectorAll<HTMLButtonElement>("[data-slide-prev]").forEach(
		(b) =>
			(b.onclick = () => {
				void step(-1);
			}),
	);
	document.querySelectorAll<HTMLButtonElement>("[data-slide-next]").forEach(
		(b) =>
			(b.onclick = () => {
				void step(1);
			}),
	);
	document.querySelectorAll<HTMLButtonElement>("[data-slide-pause]").forEach(
		(b) =>
			(b.onclick = () => {
				if (saver.open) {
					saverEnabled = !saverEnabled;
					sync();
					schedule();
					return;
				}
				if (focusLocked()) return;
				prefs.enabled = !prefs.enabled;
				change();
			}),
	);

	let controlsTimer: number | undefined;
	let returnFocus: HTMLElement | null = null;
	let savedScroll = 0;
	let savedImage = "";
	let savedOverflow = "";
	function showControls() {
		saver.classList.add("controls-visible");
		scope.clearTimeout(controlsTimer);
		controlsTimer = scope.timeout(
			() => saver.classList.remove("controls-visible"),
			3000,
		);
	}
	function enterScreensaver() {
		if (saver.open) return;
		savedImage = current;
		saverEnabled = prefs.enabled;
		savedScroll = window.scrollY;
		savedOverflow = document.body.style.overflow;
		returnFocus = document.activeElement as HTMLElement | null;
		$("#appearance").hidden = true;
		$("#appearance-open").setAttribute("aria-expanded", "false");
		saver.showModal();
		window.dispatchEvent(new Event("roxy:focus"));
		document.body.style.overflow = "hidden";
		showControls();
		sync();
		void paint(current);
	}
	document
		.querySelectorAll<HTMLButtonElement>("[data-saver-open]")
		.forEach((b) => (b.onclick = enterScreensaver));
	$("#screensaver-close").onclick = () => saver.close();
	saver.addEventListener("close", () => {
		++revision;
		current = savedImage;
		retainedCurrent = savedImage;
		window.dispatchEvent(new Event("roxy:focus"));
		scope.clearTimeout(controlsTimer);
		document.body.style.overflow = savedOverflow;
		(returnFocus?.getClientRects().length
			? returnFocus
			: $("#appearance-open")
		).focus({ preventScroll: true });
		window.scrollTo({ top: savedScroll, behavior: "instant" });
		lastInput = Date.now();
		sync();
		schedule();
	});
	saver.addEventListener("pointermove", showControls);
	saver.addEventListener("pointerdown", showControls);
	saver.addEventListener("keydown", (e) => {
		showControls();
		if (e.key === "ArrowLeft") {
			e.preventDefault();
			void step(-1);
		}
		if (e.key === "ArrowRight") {
			e.preventDefault();
			void step(1);
		}
	});
	for (const event of [
		"pointermove",
		"pointerdown",
		"keydown",
		"wheel",
		"touchstart",
	]) {
		scope.on(
			window,
			event,
			() => {
				lastInput = Date.now();
			},
			{ passive: true },
		);
	}
	scope.on(document, "visibilitychange", () => {
		lastInput = Date.now();
		schedule();
	});
	// Settings and text input must not be interrupted by an idle transition.
	scope.interval(() => {
		const active = document.activeElement;
		const busy =
			!$("#appearance").hidden ||
			!!document.querySelector(".drawer-open,.toc-drawer,dialog[open]") ||
			!!active?.matches("input,textarea,select,[contenteditable=true]") ||
			Array.from(document.querySelectorAll("audio,video")).some(
				(el) => !(el as HTMLMediaElement).paused,
			);
		if (
			shouldEnterScreensaver({
				article,
				open: saver.open,
				visible: !document.hidden,
				busy,
				auto: prefs.auto,
				idleMinutes: prefs.idleMinutes,
				elapsed: Date.now() - lastInput,
			})
		)
			enterScreensaver();
	}, 1000);
	const observer = new MutationObserver(schedule);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-mode"],
	});
	scope.on(window, "roxy:language", sync);

	const list = document.querySelector<HTMLElement>("#gallery-list");
	function renderGallery() {
		if (!list) return;
		const order = [
			...prefs.selected,
			...gallery
				.map((image) => image.id)
				.filter((id) => !prefs.selected.includes(id)),
		];
		for (const id of order) {
			const card = list.querySelector<HTMLElement>(`[data-image-id="${id}"]`)!;
			const index = prefs.selected.indexOf(id);
			card.querySelector<HTMLInputElement>("input")!.checked = index >= 0;
			card.querySelector<HTMLElement>(".image-order")!.textContent =
				index >= 0 ? String(index + 1) : "—";
			card.querySelector<HTMLButtonElement>('[data-move="-1"]')!.disabled =
				index <= 0;
			card.querySelector<HTMLButtonElement>('[data-move="1"]')!.disabled =
				index < 0 || index === prefs.selected.length - 1;
			card.classList.toggle("selected", index >= 0);
			list.append(card);
		}
	}
	list?.addEventListener("change", (e) => {
		const input = e.target as HTMLInputElement;
		if (input.type !== "checkbox") return;
		if (!input.checked && prefs.selected.length === 1) {
			input.checked = true;
			$("#gallery-status").textContent = t("keepOne");
			return;
		}
		prefs.selected = input.checked
			? [...prefs.selected, input.value]
			: prefs.selected.filter((id: string) => id !== input.value);
		$("#gallery-status").textContent = t("saved");
		change();
		renderGallery();
		if (!prefs.selected.includes(current)) void paint(prefs.selected[0]);
	});
	list?.addEventListener("click", (e) => {
		const button = (e.target as HTMLElement).closest<HTMLButtonElement>(
			"[data-move]",
		);
		if (!button) return;
		const id = button.closest<HTMLElement>("[data-image-id]")!.dataset.imageId!;
		const index = prefs.selected.indexOf(id),
			next = index + Number(button.dataset.move);
		if (index < 0 || next < 0 || next >= prefs.selected.length) return;
		[prefs.selected[index], prefs.selected[next]] = [
			prefs.selected[next],
			prefs.selected[index],
		];
		change();
		renderGallery();
		button.focus();
		$("#gallery-status").textContent = t("saved");
	});
	document
		.querySelector<HTMLButtonElement>("#gallery-reset")
		?.addEventListener("click", async () => {
			if (!(await confirmSettings(t("resetConfirmation")))) return;
			prefs.selected = [...defaultBackgrounds];
			failed.clear();
			change();
			renderGallery();
			void paint(prefs.selected[0]);
		});
	document
		.querySelector("#gallery-default")
		?.addEventListener("click", async () => {
			if (!(await confirmSettings(t("exportExplanation")))) return;
			const source = JSON.parse(
				document.querySelector("#catalog-source")!.textContent!,
			);
			const complete = exportCatalog(
				source,
				prefs.selected,
				gallery.map((image) => image.id),
			);
			showExport(
				"defaultBackgrounds:\n" +
					prefs.selected.map((id: string) => "  - " + id).join("\n"),
				complete,
				"content/catalog.yaml",
			);
		});
	sync();
	renderGallery();
	if (!staticBackground && document.documentElement.dataset.focus !== "true")
		void paint(current);

	function imageSource(image: (typeof gallery)[number]) {
		const desired =
			window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
		return (
			image.versions.find((v) => v.width >= desired) || image.versions.at(-1)!
		).src;
	}
	scope.defer(() => {
		++revision;
		scope.clearTimeout(timer);
		scope.clearTimeout(controlsTimer);
		observer.disconnect();
		retainedInput = lastInput;
		for (const surface of surfaces)
			for (const layer of surface.layers) layer.remove();
	});
});
