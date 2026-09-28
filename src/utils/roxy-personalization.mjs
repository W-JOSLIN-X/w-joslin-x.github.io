import { normalizeGroup } from "./roxy-defaults.mjs";
export const fontIds = [
	"original",
	"rounded",
	"handwritten",
	"sans",
	"serif",
	"system",
];
export function fontId(value) {
	return fontIds.includes(value) ? value : "original";
}
export function effectiveFont(global, article) {
	return article && fontIds.includes(article) ? article : fontId(global);
}
export function normalizeEffects(value) {
	const clean = normalizeGroup("effects", value);
	// Older browsers saved one explicit switch for both device types.
	if (
		typeof value?.touchClickEnabled !== "boolean" &&
		typeof value?.clickEnabled === "boolean"
	)
		clean.touchClickEnabled = value.clickEnabled;
	return clean;
}

export function rankRelated(posts, current, isLinked) {
	return posts
		.filter((p) => p.id !== current.id)
		.map((p) => ({
			p,
			link: Number(isLinked(p)),
			tags: new Set(p.data.tags.filter((t) => current.data.tags.includes(t)))
				.size,
		}))
		.filter((x) => x.link || x.tags)
		.sort(
			(a, b) =>
				b.link - a.link ||
				b.tags - a.tags ||
				new Date(b.p.data.published) - new Date(a.p.data.published) ||
				a.p.id.localeCompare(b.p.id),
		)
		.slice(0, 3)
		.map((x) => x.p);
}
