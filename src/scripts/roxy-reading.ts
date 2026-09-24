import { pageFeature } from "./core/page-scope";
import { t } from "../utils/roxy-i18n";

let traversing = false;
document.addEventListener("astro:before-preparation", (event: any) => {
	traversing = event.navigationType === "traverse";
});
pageFeature((scope) => {
	const prose = document.querySelector<HTMLElement>(".article .prose");
	if (!prose) return;
	const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
		document.querySelector<T>(selector)!;
	const root = document.documentElement;
	const defaults = { size: 0, line: 2, width: "standard" };
	let settings = { ...defaults };
	try {
		const saved = JSON.parse(localStorage.getItem("roxy-reading-v1") || "{}");
		settings = {
			size:
				Number.isFinite(saved.size) && saved.size >= 14 && saved.size <= 24
					? saved.size
					: 0,
			line:
				Number.isFinite(saved.line) && saved.line >= 1.6 && saved.line <= 2.4
					? saved.line
					: 2,
			width: ["compact", "standard", "wide"].includes(saved.width)
				? saved.width
				: "standard",
		};
	} catch {}
	function apply() {
		if (settings.size)
			root.style.setProperty("--reading-size", `${settings.size}px`);
		else root.style.removeProperty("--reading-size");
		root.style.setProperty("--reading-line", String(settings.line));
		root.style.setProperty(
			"--reading-width",
			(
				{
					compact: "min(38rem, 85%)",
					standard: "100%",
					wide: "100%",
				} as Record<string, string>
			)[settings.width],
		);
		document
			.querySelector(".article")!
			.classList.toggle("reading-wide", settings.width === "wide");
		$<HTMLInputElement>("#reading-size").value = String(
			settings.size || (matchMedia("(max-width:700px)").matches ? 15 : 16),
		);
		$<HTMLInputElement>("#reading-line").value = String(settings.line);
		$<HTMLSelectElement>("#reading-width").value = settings.width;
		$("#reading-size-value").textContent =
			`${$<HTMLInputElement>("#reading-size").value}px`;
		$("#reading-line-value").textContent = String(settings.line);
	}
	function saveSettings() {
		try {
			localStorage.setItem("roxy-reading-v1", JSON.stringify(settings));
		} catch {}
		apply();
	}
	$("#reading-open").onclick = () => {
		const panel = $("#reading-panel");
		panel.classList.remove("reading-floating");
		panel.hidden = !panel.hidden;
		$("#reading-open").setAttribute("aria-expanded", String(!panel.hidden));
		$("#floating-settings").setAttribute(
			"aria-expanded",
			String(!panel.hidden),
		);
	};
	$<HTMLInputElement>("#reading-size").oninput = (e) => {
		settings.size = Number((e.target as HTMLInputElement).value);
		saveSettings();
	};
	$<HTMLInputElement>("#reading-line").oninput = (e) => {
		settings.line = Number((e.target as HTMLInputElement).value);
		saveSettings();
	};
	$<HTMLSelectElement>("#reading-width").onchange = (e) => {
		settings.width = (e.target as HTMLSelectElement).value;
		saveSettings();
	};
	$("#reading-reset").onclick = () => {
		settings = { ...defaults };
		saveSettings();
	};
	apply();

	const key = `roxy-progress:${location.pathname}`;
	let previous:
		| { ratio: number; heading?: string; offset?: number }
		| undefined;
	try {
		previous = JSON.parse(localStorage.getItem(key) || "null") || undefined;
	} catch {}
	const resume = $("#reading-resume");
	resume.hidden =
		!!location.hash ||
		traversing ||
		!previous ||
		previous.ratio < 0.02 ||
		previous.ratio > 0.97;
	resume.onclick = () => {
		if (!previous) return;
		const heading = previous.heading
			? document.getElementById(previous.heading)
			: null;
		const target = heading
			? heading.getBoundingClientRect().top + scrollY + (previous.offset || 0)
			: prose!.getBoundingClientRect().top +
				scrollY +
				previous.ratio * prose!.offsetHeight;
		window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
		resume.hidden = true;
	};
	function record() {
		if (
			!prose?.isConnected ||
			$("#image-viewer").hasAttribute("open") ||
			$("#screensaver").hasAttribute("open")
		)
			return;
		const start = prose.getBoundingClientRect().top + scrollY;
		if (scrollY < start + 40) return;
		const headings = Array.from(
			prose.querySelectorAll<HTMLElement>("h2[id],h3[id]"),
		);
		const heading = headings
			.filter((el) => el.getBoundingClientRect().top <= 90)
			.at(-1);
		const ratio = Math.max(
			0,
			Math.min(1, (scrollY - start) / prose.offsetHeight),
		);
		try {
			localStorage.setItem(
				key,
				JSON.stringify({
					ratio,
					heading: heading?.id,
					offset: heading ? -heading.getBoundingClientRect().top : 0,
				}),
			);
		} catch {}
	}
	let timer: number | undefined;
	scope.on(
		window,
		"scroll",
		() => {
			scope.clearTimeout(timer);
			timer = scope.timeout(record, 350);
		},
		{ passive: true },
	);
	scope.on(window, "pagehide", record);
	scope.defer(record);

	const viewer = $<HTMLDialogElement>("#image-viewer"),
		image = viewer.querySelector("img")!;
	let focus: HTMLElement | null = null,
		overflow = "";
	function openImage(target: HTMLImageElement) {
		focus = target;
		overflow = document.body.style.overflow;
		image.src = target.currentSrc || target.src;
		image.alt = target.alt;
		viewer.querySelector("p")!.textContent = target.alt;
		viewer.showModal();
		document.body.style.overflow = "hidden";
	}
	prose.querySelectorAll("img").forEach((img) => {
		img.tabIndex = 0;
		img.setAttribute("role", "button");
		img.setAttribute("aria-label", `${t("imagePreview")} ${img.alt}`);
	});
	scope.on(prose, "click", (event) => {
		if (event.target instanceof HTMLImageElement) {
			event.preventDefault();
			openImage(event.target);
		}
	});
	scope.on(prose, "keydown", (event) => {
		if (
			event.target instanceof HTMLImageElement &&
			["Enter", " "].includes(event.key)
		) {
			event.preventDefault();
			openImage(event.target);
		}
	});
	$("#image-viewer-close").onclick = () => viewer.close();
	scope.on(viewer, "click", (event) => {
		if (event.target === viewer) viewer.close();
	});
	scope.on(viewer, "close", () => {
		document.body.style.overflow = overflow;
		focus?.focus({ preventScroll: true });
	});
	scope.defer(() => {
		if (viewer.open) viewer.close();
		document.body.style.overflow = "";
	});
});
