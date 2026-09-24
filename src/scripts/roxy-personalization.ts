import { defaults } from "../utils/roxy-defaults.mjs";
import { pageFeature } from "./core/page-scope";
import { fonts, fontStack } from "../config/roxy-fonts";
import { effectiveFont, fontId } from "../utils/roxy-personalization.mjs";
import { language } from "../utils/roxy-i18n";

const key = "roxy-fonts-v1";

let retryToken = "";
try {
	retryToken = localStorage.getItem("roxy-font-resource-revision") || "";
} catch {}
const read = () => {
	try {
		const s = JSON.parse(localStorage.getItem(key) || "{}");
		return {
			global: fontId(s.global ?? defaults.appearance.font),
			articles: s.articles && typeof s.articles === "object" ? s.articles : {},
		};
	} catch {
		return { global: defaults.appearance.font, articles: {} };
	}
};
function anchorPosition() {
	const nodes = [
		...document.querySelectorAll<HTMLElement>(
			".prose p,.prose h2,.prose h3,.prose li",
		),
	];
	const element = nodes.find((e) => e.getBoundingClientRect().bottom > 95);
	const offset = element?.getBoundingClientRect().top,
		start = scrollY;
	return () => {
		if (element?.isConnected && offset != null && Math.abs(scrollY - start) < 4)
			scrollBy(0, element.getBoundingClientRect().top - offset);
	};
}
pageFeature((scope) => {
	const root = document.documentElement;
	const articleId = document.body.dataset.articleId || "";
	const articleLang = document.body.dataset.articleLang || "zh-CN";
	let prefs = read(),
		revision = 0;
	const globalSelect =
		document.querySelector<HTMLSelectElement>("#global-font")!;
	const articleSelect =
		document.querySelector<HTMLSelectElement>("#article-font");
	const persist = () => {
		try {
			localStorage.setItem(key, JSON.stringify(prefs));
		} catch {}
	};
	async function sheet(name: string) {
		const existing = document.querySelector<HTMLLinkElement | HTMLStyleElement>(
			`[data-font-sheet="${name}"]`,
		);
		if (existing?.sheet) return;
		if (existing) existing.remove();
		let href = `/fonts/${name}.css`;
		if (retryToken) {
			const response = await fetch(href + "?retry=" + retryToken);
			if (!response.ok) throw Error("Font unavailable");
			const css = (await response.text()).replace(
				/(\/fonts\/[^"')\s]+\.woff2)/g,
				"$1?retry=" + retryToken,
			);
			if (!scope.active) return;
			const style = document.createElement("style");
			style.dataset.fontSheet = name;
			style.textContent = css;
			document.head.append(style);
			return;
		}
		await new Promise<void>((resolve, reject) => {
			const link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = href;
			link.dataset.fontSheet = name;
			const timer = scope.timeout(() => {
				link.remove();
				reject(Error("Font timeout"));
			}, 15000);
			link.onload = () => {
				scope.clearTimeout(timer);
				resolve();
			};
			link.onerror = () => {
				scope.clearTimeout(timer);
				link.remove();
				reject(Error("Font unavailable"));
			};
			document.head.append(link);
		});
	}
	async function applyFonts(preserve = false) {
		const token = ++revision,
			restore = preserve ? anchorPosition() : () => {};
		const selected = effectiveFont(prefs.global, prefs.articles[articleId]);
		globalSelect.value = prefs.global;
		if (articleSelect)
			articleSelect.value =
				prefs.articles[articleId] &&
				fonts.some((f) => f.id === prefs.articles[articleId])
					? prefs.articles[articleId]
					: "inherit";
		root.style.setProperty("--font-ui", fontStack(prefs.global, language()));
		root.style.setProperty("--font-article", fontStack(selected, articleLang));
		document
			.querySelectorAll<HTMLElement>("[data-font-sample]")
			.forEach((el) => {
				const id =
					el.dataset.fontSample === "article" ? selected : prefs.global;
				el.querySelectorAll<HTMLElement>("[lang]").forEach(
					(span) => (span.style.fontFamily = fontStack(id, span.lang)),
				);
			});
		document
			.querySelectorAll<HTMLElement>("[data-font-retry]")
			.forEach((el) => (el.hidden = true));
		const ids = new Set([prefs.global, ...(articleId ? [selected] : [])]);
		const sheets = new Set(
			[...ids].flatMap((id) => [
				...(fonts.find((f) => f.id === id)?.sheets || []),
			]),
		);
		try {
			await Promise.all([...sheets].map(sheet));
			await new Promise<void>((resolve) =>
				requestAnimationFrame(() => resolve()),
			);
			await document.fonts.ready;
			if (!scope.active || token !== revision) return;
			if ([...document.fonts].some((f) => f.status === "error"))
				throw Error("Font failed");
			document
				.querySelectorAll<HTMLElement>("[data-font-retry]")
				.forEach((el) => (el.hidden = true));
			restore();
		} catch {
			if (scope.active && token === revision)
				document
					.querySelectorAll<HTMLElement>("[data-font-retry]")
					.forEach((el) => (el.hidden = false));
		}
	}
	globalSelect.onchange = () => {
		prefs.global = fontId(globalSelect.value);
		persist();
		void applyFonts(true);
	};
	if (articleSelect)
		articleSelect.onchange = () => {
			if (articleSelect.value === "inherit") delete prefs.articles[articleId];
			else prefs.articles[articleId] = fontId(articleSelect.value);
			persist();
			void applyFonts(true);
		};
	document.querySelectorAll<HTMLButtonElement>("[data-font-retry]").forEach(
		(b) =>
			(b.onclick = () => {
				// Discard failed faces/styles so the next request is an actual retry.
				document
					.querySelectorAll("[data-font-sheet]")
					.forEach((e) => e.remove());
				retryToken = String(Date.now());
				try {
					localStorage.setItem("roxy-font-resource-revision", retryToken);
				} catch {}
				void applyFonts(true);
			}),
	);
	scope.on(window, "roxy:language", () => void applyFonts());
	scope.on(window, "roxy:reset-group", (e: CustomEvent) => {
		if (["appearance", "all"].includes(e.detail)) {
			prefs.global = defaults.appearance.font;
			persist();
			void applyFonts(true);
		}
	});
	scope.on(document.fonts, "loadingerror", () =>
		document
			.querySelectorAll<HTMLElement>("[data-font-retry]")
			.forEach((el) => (el.hidden = false)),
	);
	void applyFonts();

	const tabs = [
		...document.querySelectorAll<HTMLButtonElement>("[data-appearance-tab]"),
	];
	function activate(id: string) {
		document.querySelector<HTMLElement>("#appearance")!.dataset.group = id;
		window.dispatchEvent(new Event("roxy:settings-group"));
		tabs.forEach((b) => {
			b.setAttribute("aria-selected", String(b.dataset.appearanceTab === id));
			b.tabIndex = b.dataset.appearanceTab === id ? 0 : -1;
		});
		document
			.querySelectorAll<HTMLElement>("[data-appearance-panel]")
			.forEach((p) => (p.hidden = p.dataset.appearancePanel !== id));
	}
	tabs.forEach((b, i) => {
		b.onclick = () => activate(b.dataset.appearanceTab!);
		scope.on(b, "keydown", (e: KeyboardEvent) => {
			if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
			e.preventDefault();
			const n =
				e.key === "Home"
					? 0
					: e.key === "End"
						? tabs.length - 1
						: (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) %
							tabs.length;
			activate(tabs[n].dataset.appearanceTab!);
			tabs[n].focus();
		});
	});
	activate("appearance");
});
