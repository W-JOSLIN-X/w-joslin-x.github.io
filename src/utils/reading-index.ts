import { render } from "astro:content";
import { posts, slugOf, postHref } from "./roxy";
export type Section = { title: string; anchor: string; text: string };
export async function readingIndex() {
	return Promise.all(
		(await posts()).map(async (entry) => {
			const result = await render(entry);
			const sections: Section[] =
				result.remarkPluginFrontmatter.readingSections || [];
			return {
				id: entry.id,
				slug: slugOf(entry.id),
				href: postHref(entry.id),
				title: entry.data.title,
				sections,
				text: sections.map((s) => `${s.title} ${s.text}`).join(" "),
			};
		}),
	);
}
