/** References that actually render as images, excluding code examples/frontmatter. */
export function imageReferences(body) {
	const mask = (value) => value.replace(/[^\r\n]/g, " ");
	const text = body
		.replace(/(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2[^\n]*(?=\n|$)/g, mask)
		.replace(/(`+)[\s\S]*?\1/g, mask);
	const references = [];
	for (const match of text.matchAll(
		/!\[[^\]]*\]\(<?([^\s)>]+)>?(?:\s+[^)]*)?\)/dg,
	))
		references.push({
			full: match[0],
			src: match[1],
			offset: match.indices[1][0],
		});
	for (const match of text.matchAll(
		/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/dgi,
	))
		references.push({
			full: match[0],
			src: match[1],
			offset: match.indices[1][0],
		});
	const labels = new Set(
		[...text.matchAll(/!\[([^\]]*)\](?:\[([^\]]*)\])?/g)].map((match) =>
			(match[2] || match[1]).toLowerCase(),
		),
	);
	for (const match of text.matchAll(/^\s*\[([^\]]+)\]:\s*<?([^\s>]+)>?.*$/dgm))
		if (labels.has(match[1].toLowerCase()))
			references.push({
				full: match[0],
				src: match[2],
				offset: match.indices[2][0],
			});
	return references;
}

/** Replace destinations from the end so source offsets and code samples stay intact. */
export function rewriteImageReferences(body, destination) {
	let result = body;
	const edits = imageReferences(body).map((ref) => ({
		...ref,
		replacement: destination(ref.src),
	}));
	for (const { src, offset, replacement } of edits.sort(
		(a, b) => b.offset - a.offset,
	)) {
		result =
			result.slice(0, offset) + replacement + result.slice(offset + src.length);
	}
	return result;
}
