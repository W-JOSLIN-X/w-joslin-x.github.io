// Capture the same heading IDs used in rendered articles, not a second slugger.
export function rehypeReadingIndex() {
	return (tree, file) => {
		const sections = [{ title: "", anchor: "", text: "" }];
		let current = sections[0];
		const ignored = (node) =>
			["script", "style", "button", "svg"].includes(node.tagName) ||
			(node.properties?.className || []).some?.((c) =>
				["anchor", "katex-html", "copy"].includes(c),
			);
		const text = (node) =>
			ignored(node)
				? ""
				: node.type === "text"
					? node.value
					: (node.children || []).map(text).join(" ");
		function walk(node) {
			if (ignored(node)) return;
			if (/^h[1-6]$/.test(node.tagName || "")) {
				current = {
					title: text(node).replace(/\s+/g, " ").trim(),
					anchor: String(node.properties?.id || ""),
					text: "",
				};
				sections.push(current);
			} else if (node.type === "text") current.text += node.value + " ";
			else for (const child of node.children || []) walk(child);
		}
		walk(tree);
		for (const section of sections)
			section.text = section.text.replace(/\s+/g, " ").trim();
		file.data.astro ||= {};
		file.data.astro.frontmatter ||= {};
		file.data.astro.frontmatter.readingSections = sections;
	};
}
