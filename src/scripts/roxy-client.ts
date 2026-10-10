import { monthCells, shanghaiDay } from "../utils/roxy-calendar.mjs";
import { baseColorAtHue } from "../utils/roxy-colors.mjs";
import {
	appearanceDataset,
	defaults as siteDefaults,
} from "../utils/roxy-defaults.mjs";
import { language, localize, t } from "../utils/roxy-i18n";
import { hexToHsl, hslToHex } from "../utils/roxy-slideshow.mjs";
import { pageFeature } from "./core/page-scope";
import { confirmSettings, exportCurrentGroup } from "./settings-dialogs";
import "./core/navigation";

pageFeature((scope) => {
	const root = document.documentElement;
	Object.assign(root.dataset, appearanceDataset(root.dataset));
	const $ = <T extends HTMLElement = HTMLElement>(s: string) =>
		document.querySelector<T>(s)!;
	const settings = $("#appearance");
	const trigger = $("#appearance-open");
	const defaultHue = hexToHsl(siteDefaults.appearance.color, false).hue;
	const defaults: Record<string, string> = {
		...appearanceDataset(),
		waves: String(siteDefaults.background.edge !== "none"),
	};
	function applyColor(color: string) {
		const hsl = hexToHsl(color, false);
		root.dataset.color = color;
		root.style.setProperty("--hue", String(hsl.hue));
		root.style.setProperty("--accent", color);
		root.style.setProperty("--saturation", `${hsl.saturation}%`);
	}
	applyColor(
		root.dataset.color ||
			(root.style.getPropertyValue("--hue")
				? hslToHex(Number(root.style.getPropertyValue("--hue")), 78, 69)
				: siteDefaults.appearance.color),
	);
	function save() {
		try {
			localStorage.setItem(
				"roxy-appearance-v3",
				JSON.stringify({
					...appearanceDataset(root.dataset),
					hue: Number(root.style.getPropertyValue("--hue") || defaultHue),
				}),
			);
		} catch {}
	}
	function sync() {
		const savedTransparency = Number(
			root.dataset.overlayTransparency ?? defaults.overlayTransparency,
		);
		const transparency = Number.isFinite(savedTransparency)
			? Math.max(0, Math.min(100, savedTransparency))
			: Number(defaults.overlayTransparency);
		root.dataset.overlayTransparency = String(transparency);
		root.style.setProperty("--overlay-panel-opacity", `${100 - transparency}%`);
		$<HTMLInputElement>("#overlay-transparency").value = String(transparency);
		$("#overlay-transparency-value").textContent = `${transparency}%`;
		document
			.querySelectorAll<HTMLButtonElement>(
				"#appearance [data-mode],#appearance [data-layout],#appearance [data-lang]",
			)
			.forEach((b) => {
				const key = b.dataset.mode
					? "mode"
					: b.dataset.layout
						? "layout"
						: "lang";
				const active = (root.dataset[key] || defaults[key]) === b.dataset[key];
				b.classList.toggle("active", active);
				b.setAttribute("aria-pressed", String(active));
			});
		for (const name of ["soft", "wide"])
			$<HTMLInputElement>(`#setting-${name}`).checked =
				(root.dataset[name] || defaults[name as keyof typeof defaults]) ===
				"true";
		for (const name of ["edge", "atmosphere"])
			$<HTMLSelectElement>(`#setting-${name}`).value =
				root.dataset[name] || defaults[name];
		root.dataset.waves = String(root.dataset.edge !== "none");
		const hue = root.style.getPropertyValue("--hue") || String(defaultHue);
		$<HTMLInputElement>("#hue-slider").value = hue;
		$("#hue-value").textContent = Number(hue).toFixed(1);
		$<HTMLInputElement>("#color-picker").value =
			root.dataset.color || siteDefaults.appearance.color;
		$("#color-value").textContent =
			root.dataset.color || siteDefaults.appearance.color;
		root.classList.toggle("dark", root.dataset.theme === "dark");
		for (const image of document.querySelectorAll<HTMLImageElement>(
			".plantuml-image",
		)) {
			const source =
				root.dataset.theme === "dark"
					? image.dataset.darkSrc
					: image.dataset.lightSrc;
			if (source && image.getAttribute("src") !== source) image.src = source;
		}
		scrollNav();
	}
	function closeSettings() {
		if (!settings.hidden && settings.contains(document.activeElement))
			trigger.focus({ preventScroll: true });
		settings.hidden = true;
		trigger.setAttribute("aria-expanded", "false");
	}
	trigger.onclick = () => {
		settings.hidden = !settings.hidden;
		trigger.setAttribute("aria-expanded", String(!settings.hidden));
		sync();
	};
	scope.on(document, "click", (e) => {
		if (
			!(e.target as Element).closest(".settings-dialog") &&
			!settings.contains(e.target as Node) &&
			!trigger.contains(e.target as Node)
		)
			closeSettings();
	});
	$("#theme-toggle").onclick = () => {
		root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
		sync();
		save();
	};
	document
		.querySelectorAll<HTMLButtonElement>(
			"#appearance [data-mode],#appearance [data-layout],#appearance [data-lang]",
		)
		.forEach((b) => {
			b.onclick = () => {
				const key = b.dataset.mode
					? "mode"
					: b.dataset.layout
						? "layout"
						: "lang";
				root.dataset[key] = b.dataset[key];
				sync();
				save();
				if (key === "lang") localize();
			};
		});
	$<HTMLInputElement>("#hue-slider").oninput = (e) => {
		const hue = Number((e.target as HTMLInputElement).value);
		applyColor(baseColorAtHue(hue));
		// Preserve the control position rather than quantizing it through 8-bit RGB.
		root.style.setProperty("--hue", String(hue));
		sync();
		save();
	};
	$("#reset-color").onclick = () => {
		applyColor(siteDefaults.appearance.color);
		sync();
		save();
	};
	$<HTMLInputElement>("#color-picker").oninput = (e) => {
		applyColor((e.target as HTMLInputElement).value);
		sync();
		save();
	};
	$<HTMLInputElement>("#overlay-transparency").oninput = (e) => {
		root.dataset.overlayTransparency = (e.target as HTMLInputElement).value;
		sync();
		save();
	};
	for (const name of ["soft", "wide"])
		$<HTMLInputElement>(`#setting-${name}`).onchange = (e) => {
			root.dataset[name] = String((e.target as HTMLInputElement).checked);
			sync();
			save();
		};
	for (const name of ["edge", "atmosphere"])
		$<HTMLSelectElement>(`#setting-${name}`).onchange = (event) => {
			if (root.dataset.focus === "true") return;
			root.dataset[name] = (event.target as HTMLSelectElement).value;
			sync();
			save();
		};
	async function resetGroup(group: string) {
		if (root.dataset.focus === "true" && ["background", "all"].includes(group))
			return;
		if (!(await confirmSettings(t("resetConfirmation")))) return;
		const keys =
			group === "appearance"
				? ["theme", "layout", "wide"]
				: group === "background"
					? [
							"mode",
							"soft",
							"waves",
							"edge",
							"atmosphere",
							"overlayTransparency",
						]
					: group === "other"
						? ["lang"]
						: Object.keys(defaults);
		if (group !== "effects")
			for (const key of keys)
				root.dataset[key] = defaults[key as keyof typeof defaults];
		if (group === "appearance" || group === "all")
			applyColor(siteDefaults.appearance.color);
		sync();
		save();
		localize();
		window.dispatchEvent(
			new CustomEvent("roxy:reset-group", { detail: group }),
		);
	}
	$("#reset-current-group").onclick = () =>
		void resetGroup(settings.dataset.group || "appearance");
	$("#set-current-default").onclick = () =>
		void exportCurrentGroup(settings.dataset.group || "appearance");
	$("#reset-appearance").onclick = () => resetGroup("all");
	document
		.querySelectorAll<HTMLButtonElement>("[data-reset-group]")
		.forEach((b) => {
			b.onclick = () => resetGroup(b.dataset.resetGroup!);
		});

	function scrollNav() {
		const opacity =
			root.dataset.mode === "none" ? 1 : Math.min(1, window.scrollY / 160);
		$("#topbar").style.setProperty("--nav-opacity", String(opacity));
		$("#topbar").classList.toggle("scrolled", opacity > 0.4);
	}
	scope.on(window, "scroll", scrollNav, { passive: true });
	const menu = $("#links-menu");
	const menuButton = $("#links-toggle");
	function closeMenu() {
		menu.hidden = true;
		menuButton.setAttribute("aria-expanded", "false");
	}
	menuButton.onclick = () => {
		menu.hidden = !menu.hidden;
		menuButton.setAttribute("aria-expanded", String(!menu.hidden));
	};
	scope.on(document, "click", (e) => {
		if (!(e.target as Element).closest(".nav-dropdown")) closeMenu();
	});
	$("#search-mobile").onclick = () => {
		$(".nav-search").classList.toggle("search-open");
		$("#search-input").focus();
	};
	const params = new URLSearchParams(location.search);
	$<HTMLInputElement>("#search-input").value = params.get("q") || "";
	$<HTMLSelectElement>("#search-scope").value =
		params.get("scope") === "full" ? "full" : "title";
	let drawerTrigger: HTMLButtonElement | null = null;
	function closeDrawer() {
		document.querySelectorAll(".drawer-open").forEach((e) => {
			e.classList.remove("drawer-open");
		});
		document.body.style.overflow = "";
		document.body.classList.remove("music-expanded");
		drawerTrigger?.focus();
		drawerTrigger = null;
	}
	function openDrawer(
		id: string,
		trigger: HTMLButtonElement,
		musicOnly = false,
	) {
		closeDrawer();
		const drawer = document.getElementById(id);
		if (!drawer) return;
		drawerTrigger = trigger;
		drawer.classList.add("drawer-open");
		document.body.classList.toggle("music-expanded", musicOnly);
		document.body.style.overflow = "hidden";
		drawer.querySelector<HTMLButtonElement>(".drawer-close")?.focus();
	}
	scope.on(window, "roxy:music-drawer", () =>
		openDrawer("right-sidebar", $("#music-mini-expand"), true),
	);
	document.querySelectorAll<HTMLButtonElement>("[data-drawer]").forEach((b) => {
		b.onclick = () => {
			openDrawer(b.dataset.drawer!, b);
		};
	});
	document.querySelectorAll<HTMLButtonElement>(".drawer-close").forEach((b) => {
		b.onclick = closeDrawer;
	});
	scope.on(document, "keydown", (e) => {
		if (e.key === "Escape") {
			if (document.querySelector("dialog[open]")) return;
			closeDrawer();
			closeMenu();
			if (!settings.hidden) {
				closeSettings();
				trigger.focus();
			}
			$(".nav-search").classList.remove("search-open");
		}
		const drawer = document.querySelector(".drawer-open");
		if (drawer && e.key === "Tab") {
			const els = Array.from(
				drawer.querySelectorAll<HTMLElement>("button,a,input,select"),
			).filter(
				(el) => el.getClientRects().length && !el.hasAttribute("disabled"),
			);
			const first = els[0];
			const last = els.at(-1);
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last?.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first?.focus();
			}
		}
	});
	scope.on(window.matchMedia("(min-width:1101px)"), "change", closeDrawer);
	scope.on(window, "roxy:filters", closeDrawer);
	$("#back-top").onclick = () =>
		window.scrollTo({ top: 0, behavior: "smooth" });
	document.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((b) => {
		b.onclick = () => {
			document
				.querySelectorAll<HTMLButtonElement>("[data-tab]")
				.forEach((x) => {
					x.classList.toggle("active", x === b);
					x.setAttribute("aria-selected", String(x === b));
				});
			document
				.querySelectorAll<HTMLElement>("[data-tab-panel]")
				.forEach((p) => {
					p.hidden = p.dataset.tabPanel !== b.dataset.tab;
				});
		};
	});
	const records = JSON.parse($("#activity-data").textContent || "[]") as {
		date: string;
		message: string;
		url: string;
	}[];
	const today = shanghaiDay();
	let [year, month] = today.split("-").map(Number);
	month--;
	function calendar() {
		const locale = { zh: "zh-CN", en: "en-US", ja: "ja-JP" }[language()];
		$("#calendar-title").textContent = new Intl.DateTimeFormat(locale, {
			year: "numeric",
			month: "short",
			timeZone: "UTC",
		}).format(new Date(Date.UTC(year, month, 1)));
		const week = $("#calendar-week");
		week.replaceChildren();
		for (let i = 0; i < 7; i++) {
			const label = document.createElement("span");
			label.textContent = new Intl.DateTimeFormat(locale, {
				weekday: "short",
				timeZone: "UTC",
			}).format(new Date(Date.UTC(2026, 5, 1 + i)));
			week.append(label);
		}
		const grid = $("#calendar-grid");
		grid.replaceChildren();
		const selected = new URLSearchParams(location.search).get("date");
		for (const date of monthCells(year, month)) {
			if (!date) {
				grid.append(document.createElement("span"));
				continue;
			}
			const count = records.filter((r) => r.date === date).length;
			const a = document.createElement("a");
			a.textContent = String(Number(date.slice(-2)));
			const params = new URLSearchParams(
				location.pathname === "/browse/" ? location.search : "",
			);
			params.set("date", date);
			a.href = `/browse/?${params}`;
			a.dataset.calendarDate = date;
			a.dataset.level = String(Math.min(count, 4));
			a.setAttribute("aria-label", `${date} · ${count} ${t("commits")}`);
			a.title = `${date} · ${count}`;
			a.classList.toggle("today", date === today);
			a.classList.toggle("selected", date === selected);
			if (date === today) a.setAttribute("aria-current", "date");
			grid.append(a);
		}
	}
	$("#calendar-prev").onclick = () => {
		month--;
		if (month < 0) {
			month = 11;
			year--;
		}
		calendar();
	};
	$("#calendar-next").onclick = () => {
		month++;
		if (month > 11) {
			month = 0;
			year++;
		}
		calendar();
	};
	$("#calendar-today").onclick = () => {
		[year, month] = today.split("-").map(Number);
		month--;
		calendar();
	};
	scope.on(window, "roxy:language", calendar);
	scope.on(window, "roxy:filters", calendar);
	$("#running-days").textContent = String(
		Math.max(
			1,
			Math.floor(
				(Date.parse(today) - Date.parse($("#running-days").dataset.start!)) /
					86400000,
			) + 1,
		),
	);
	const last = [
		...records.map((r) => r.date),
		$("#last-activity").dataset.date || today,
	]
		.sort()
		.at(-1)!;
	$("#last-activity").textContent = String(
		Math.max(0, Math.floor((Date.parse(today) - Date.parse(last)) / 86400000)),
	);
	const headings = Array.from(
		document.querySelectorAll<HTMLElement>(".prose h2[id],.prose h3[id]"),
	);
	if (headings.length) {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const e of entries)
					if (e.isIntersecting)
						document
							.querySelectorAll<HTMLAnchorElement>(".toc a")
							.forEach((a) => {
								a.classList.toggle(
									"current",
									decodeURIComponent(a.hash.slice(1)) === e.target.id,
								);
							});
			},
			{ rootMargin: "-10% 0px -65% 0px" },
		);
		headings.forEach((h) => {
			observer.observe(h);
		});
		scope.defer(() => observer.disconnect());
	}
	document.querySelectorAll(".toc a").forEach((a) => {
		a.addEventListener("click", closeDrawer);
	});
	document
		.querySelectorAll<HTMLButtonElement>(".copy-btn")
		.forEach((button) => {
			const label = (key: "copyCode" | "copied" | "manualCopyCode") => {
				button.dataset.i18nLabel = key;
				button.setAttribute("aria-label", t(key));
			};
			label("copyCode");
			button.onclick = async () => {
				const code = button.closest("figure")?.querySelector("code");
				if (!code) return;
				const lines = Array.from(code.querySelectorAll(".ec-line .code"));
				const text = lines.length
					? lines
							.map((line) => (line.textContent || "").replace(/\n$/, ""))
							.join("\n")
					: code.textContent || "";
				try {
					await navigator.clipboard.writeText(text);
					label("copied");
					button.classList.add("copied");
					scope.timeout(() => {
						label("copyCode");
						button.classList.remove("copied");
					}, 1800);
				} catch {
					label("manualCopyCode");
					const selection = getSelection();
					const range = document.createRange();
					range.selectNodeContents(code);
					selection?.removeAllRanges();
					selection?.addRange(range);
				}
			};
		});
	sync();
	localize();
	calendar();
	scope.defer(() => {
		document.body.style.overflow = "";
	});
});
