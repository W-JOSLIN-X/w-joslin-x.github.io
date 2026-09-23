import rss from "@astrojs/rss";
import { posts, postHref } from "../utils/roxy";
import { roxy } from "../config/roxy";
export async function GET() {
	return rss({
		title: roxy.title,
		description: roxy.subtitle,
		site: "https://w-joslin-x.github.io",
		items: (await posts()).map((p) => ({
			title: p.data.title,
			pubDate: p.data.published,
			description: p.data.description,
			link: postHref(p.id),
		})),
	});
}
