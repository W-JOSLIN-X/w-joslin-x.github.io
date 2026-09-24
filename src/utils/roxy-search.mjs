// Map normalized matches back to original text, including full-width forms.
function matchingRanges(text, query) {
	const terms = [
		...new Set(
			query
				.normalize("NFKC")
				.toLocaleLowerCase()
				.trim()
				.split(/\s+/)
				.filter(Boolean),
		),
	];
	let normalized = "",
		offset = 0;
	const positions = [];
	for (const character of text) {
		const part = character.normalize("NFKC").toLocaleLowerCase();
		normalized += part;
		for (let i = 0; i < part.length; i++)
			positions.push([offset, offset + character.length]);
		offset += character.length;
	}
	const ranges = [];
	for (const term of terms) {
		let from = 0,
			index;
		while ((index = normalized.indexOf(term, from)) >= 0) {
			ranges.push([positions[index][0], positions[index + term.length - 1][1]]);
			from = index + term.length;
		}
	}
	const merged = [];
	for (const range of ranges.sort((a, b) => a[0] - b[0])) {
		const last = merged.at(-1);
		if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
		else merged.push(range);
	}
	return merged;
}
export function excerpt(text, query, radius = 70) {
	const clean = text.replace(/\s+/g, " ").trim(),
		range = matchingRanges(clean, query)[0];
	if (!range) return "";
	const start = Math.max(0, range[0] - radius),
		end = Math.min(clean.length, range[1] + radius);
	return `${start ? "…" : ""}${clean.slice(start, end)}${end < clean.length ? "…" : ""}`;
}
// Plain segments: callers create text nodes and <mark>, never interpret HTML.
export function highlightSegments(text, query) {
	const result = [];
	let from = 0;
	for (const [start, end] of matchingRanges(text, query)) {
		if (start > from)
			result.push({ text: text.slice(from, start), match: false });
		result.push({ text: text.slice(start, end), match: true });
		from = end;
	}
	if (from < text.length) result.push({ text: text.slice(from), match: false });
	return result;
}
