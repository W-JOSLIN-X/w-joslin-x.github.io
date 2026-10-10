import type { APIRoute } from "astro";
import { posts, postHref, slugOf } from "../../utils/roxy";

export async function getStaticPaths() {
	return (await posts()).map((entry) => ({
		params: { slug: slugOf(entry.id) },
		props: {
			title: entry.data.title,
			source: postHref(entry.id),
			text: entry.body || "",
		},
	}));
}

/** Published source only. No rendering, linked-resource traversal or third-party calls. */
export const GET: APIRoute = ({ props }) =>
	new Response(JSON.stringify(props), {
		headers: { "Content-Type": "application/json; charset=utf-8" },
	});
