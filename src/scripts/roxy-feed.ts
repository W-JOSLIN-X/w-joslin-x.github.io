import { matchesPost } from "../utils/roxy-filter.mjs";
import { matchesDay } from "../utils/roxy-calendar.mjs";
import { excerpt, highlightSegments } from "../utils/roxy-search.mjs";
import { t } from "../utils/roxy-i18n";
import { pageFeature } from "./core/page-scope";
import { filterNavigation } from "./core/navigation";

type Post = {
	id: string;
	slug: string;
	title: string;
	href: string;
	published: string;
	updated: string;
	tags: string[];
	moods: string[];
	text: string;
	category: string;
};
type SearchRecord = {
	text: string;
	sections: { title: string; anchor: string; text: string }[];
};
let fullText: Promise<Record<string, SearchRecord>> | undefined;
let restoreSearchFocus = false;
function loadText() {
	return (fullText ||= fetch("/search/full.json", { cache: "no-cache" })
		.then((response) => {
			if (!response.ok) throw Error("Search unavailable");
			return response.json();
		})
		.catch((error) => {
			fullText = undefined;
			throw error;
		}));
}
function highlight(element: HTMLElement, text: string, query: string) {
	element.replaceChildren(
		...highlightSegments(text, query).map(
			(part: { text: string; match: boolean }) => {
				if (!part.match) return document.createTextNode(part.text);
				const mark = document.createElement("mark");
				mark.textContent = part.text;
				return mark;
			},
		),
	);
}
pageFeature((lifecycle) => {
	const root = document.querySelector<HTMLElement>("#feed-root");
	if (!root) return;
	const data: Post[] = JSON.parse(
		document.querySelector("#search-data")!.textContent!,
	);
	const records = JSON.parse(
		document.querySelector("#activity-data")!.textContent || "[]",
	);
	const input = document.querySelector<HTMLInputElement>("#search-input")!;
	const scope = document.querySelector<HTMLSelectElement>("#search-scope")!;
	const status = document.querySelector<HTMLElement>("#search-status")!;
	const retry = document.querySelector<HTMLButtonElement>("#search-retry")!;
	const browse = root.dataset.browse === "true";
	let sections: Record<string, SearchRecord> = {};
	let limit = 12,
		revision = 0;
	async function update() {
		const token = ++revision,
			params = new URLSearchParams(location.search);
		const q = params.get("q") || "",
			searchScope = params.get("scope") === "full" ? "full" : "title";
		input.value = q;
		scope.value = searchScope;
		if (restoreSearchFocus) {
			restoreSearchFocus = false;
			input.focus({ preventScroll: true });
		}
		retry.hidden = true;
		status.hidden = true;
		if (searchScope === "full" && q.trim()) {
			status.hidden = false;
			status.textContent = t("searchLoading");
			try {
				const texts = await loadText();
				if (!lifecycle.active || token !== revision) return;
				sections = texts;
				for (const post of data) post.text = texts[post.slug]?.text || "";
			} catch {
				if (lifecycle.active && token === revision) {
					status.textContent = t("searchFailed");
					document.querySelector<HTMLElement>(".result-heading")!.hidden = true;
					retry.hidden = false;
					document.querySelector<HTMLElement>("#timeline")!.hidden = true;
					document.querySelector<HTMLElement>("#post-feed")!.hidden = true;
					document.querySelector<HTMLElement>("#load-more")!.hidden = true;
				}
				return;
			}
			status.hidden = true;
		}
		if (!lifecycle.active || token !== revision) return;
		const category = params.get("type") || "",
			tags = params.getAll("tag"),
			moods = params.getAll("mood"),
			date = params.get("date") || "";
		const filtered = data.filter(
			(post) =>
				matchesPost(post, { q, scope: searchScope, category, tags, moods }) &&
				matchesDay(post, date, records),
		);
		const visible = new Set(filtered.slice(0, limit).map((post) => post.id));
		const timeline = browse || params.size > 0;
		document.querySelector<HTMLElement>("#post-feed")!.hidden = timeline;
		document.querySelector<HTMLElement>("#timeline")!.hidden =
			!timeline || !filtered.length;
		document.querySelector<HTMLElement>(".result-heading")!.hidden = !timeline;
		document.querySelector("#result-count")!.textContent = String(
			filtered.length,
		);
		for (const selector of [".feed-entry", ".timeline-entry"]) {
			let group = "";
			document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
				el.hidden = !visible.has(el.dataset.postId!);
				if (el.hidden) return;
				const key = el.dataset.month || el.dataset.year!,
					heading = el.querySelector<HTMLElement>("h2")!;
				heading.hidden = selector === ".timeline-entry" && group === key;
				heading.classList.toggle("group-repeat", group === key);
				group = key;
				if (selector === ".timeline-entry") {
					heading.querySelector("small")!.textContent =
						`${filtered.filter((p) => p.published.startsWith(key)).length} ${t("posts")}`;
					const post = data.find((p) => p.id === el.dataset.postId)!;
					highlight(
						el.querySelector<HTMLElement>(".timeline-title")!,
						post.title,
						q,
					);
					let summary = el.querySelector<HTMLElement>(".search-excerpt");
					if (!summary) {
						summary = document.createElement("div");
						summary.className = "search-excerpt";
						el.append(summary);
					}
					summary.replaceChildren();
					const matches =
						searchScope === "full" && q.trim()
							? (sections[post.slug]?.sections || [])
									.filter((section) =>
										excerpt(section.title + " " + section.text, q),
									)
									.slice(0, 2)
							: [];
					summary.hidden = !matches.length;
					for (const section of matches) {
						const link = document.createElement("a");
						link.className = "section-result";
						link.href =
							post.href +
							(section.anchor ? "#" + encodeURIComponent(section.anchor) : "");
						const heading = document.createElement("strong");
						highlight(heading, section.title || post.title, q);
						const snippet = document.createElement("span");
						highlight(
							snippet,
							excerpt(section.text, q) || section.text.slice(0, 140),
							q,
						);
						link.append(heading, snippet);
						summary.append(link);
					}
				}
			});
		}
		document.querySelector<HTMLElement>("#no-results")!.hidden =
			!!filtered.length;
		document.querySelector<HTMLElement>("#load-more")!.hidden =
			filtered.length <= limit;
		document
			.querySelectorAll<HTMLElement>(
				"[data-category],[data-filter-tag],[data-filter-mood]",
			)
			.forEach((el) => {
				const active =
					el.dataset.category !== undefined
						? category === el.dataset.category
						: el.dataset.filterTag !== undefined
							? tags.includes(el.dataset.filterTag)
							: moods.includes(el.dataset.filterMood!);
				el.classList.toggle("active", active);
				el.setAttribute("aria-current", active ? "true" : "false");
			});
		const chips = document.querySelector<HTMLElement>("#active-filters")!;
		chips.replaceChildren();
		for (const [key, value] of params) {
			if (key === "scope") continue;
			const button = document.createElement("button");
			button.className = "chip active";
			button.textContent = `${value} ×`;
			button.onclick = () => {
				const next = new URLSearchParams(location.search);
				next.delete(key, value);
				void filterNavigation(next);
			};
			chips.append(button);
		}
		chips.hidden = !chips.childElementCount;
		const commits = records.filter((r: any) => r.date === date),
			box = document.querySelector<HTMLElement>("#date-commits")!;
		box.hidden = !date || !commits.length;
		const list = box.querySelector("div")!;
		list.replaceChildren();
		for (const r of commits) {
			const a = document.createElement("a");
			a.href = r.url;
			a.target = "_blank";
			a.rel = "noopener";
			a.textContent = `${r.message} ↗`;
			list.append(a);
		}
		window.dispatchEvent(new Event("roxy:filters"));
	}
	if (browse) {
		lifecycle.on(
			document,
			"click",
			(e) => {
				const link = (e.target as Element).closest<HTMLAnchorElement>(
					"a[data-category],a[data-filter-tag],a[data-filter-mood],a[data-reset-filter],a[data-calendar-date]",
				);
				if (
					!link ||
					e.metaKey ||
					e.ctrlKey ||
					e.shiftKey ||
					e.altKey ||
					e.button !== 0
				)
					return;
				e.preventDefault();
				const params = new URLSearchParams(location.search);
				if (link.hasAttribute("data-reset-filter")) {
					void filterNavigation(new URLSearchParams());
					return;
				}
				const [key, value] =
					link.dataset.category !== undefined
						? ["type", link.dataset.category]
						: link.dataset.filterTag !== undefined
							? ["tag", link.dataset.filterTag]
							: link.dataset.filterMood !== undefined
								? ["mood", link.dataset.filterMood]
								: ["date", link.dataset.calendarDate!];
				if (key === "tag" || key === "mood") {
					params.getAll(key).includes(value!)
						? params.delete(key, value)
						: params.append(key, value!);
				} else if (value) params.set(key, value);
				else params.delete(key);
				void filterNavigation(params);
			},
			{ capture: true },
		);
		const form = document.querySelector<HTMLFormElement>(".nav-search")!;
		form.onsubmit = (e) => {
			e.preventDefault();
			const params = new URLSearchParams(location.search);
			input.value ? params.set("q", input.value) : params.delete("q");
			scope.value === "full"
				? params.set("scope", "full")
				: params.delete("scope");
			restoreSearchFocus = document.activeElement === input;
			void filterNavigation(params);
		};
		let timer: number | undefined;
		lifecycle.on(input, "input", () => {
			lifecycle.clearTimeout(timer);
			timer = lifecycle.timeout(() => form.requestSubmit(), 300);
		});
		lifecycle.on(scope, "change", () => form.requestSubmit());
	}
	retry.onclick = () => void update();
	lifecycle.on(window, "roxy:language", () => void update());
	document.querySelector<HTMLButtonElement>("#load-more")!.onclick = () => {
		limit += 12;
		void update();
	};
	void update();
});
