/** References that actually render as images, excluding code examples/frontmatter. */
export function imageReferences(body) {
	const text = body
		.replace(/(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2[^\n]*(?=\n|$)/g, "\n")
		.replace(/(`+)[\s\S]*?\1/g, "");
	const references = [];
	for (const match of text.matchAll(
		/!\[[^\]]*\]\(<?([^\s)>]+)>?(?:\s+[^)]*)?\)/g,
	))
		references.push({ full: match[0], src: match[1] });
	for (const match of text.matchAll(
		/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi,
	))
		references.push({ full: match[0], src: match[1] });
	const labels = new Set(
		[...text.matchAll(/!\[([^\]]*)\](?:\[([^\]]*)\])?/g)].map((match) =>
			(match[2] || match[1]).toLowerCase(),
		),
	);
	for (const match of text.matchAll(/^\s*\[([^\]]+)\]:\s*<?([^\s>]+)>?.*$/gm))
		if (labels.has(match[1].toLowerCase()))
			references.push({ full: match[0], src: match[2] });
	return references;
}
