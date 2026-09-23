import { posts, postHref } from "../utils/roxy";
import { roxy } from "../config/roxy";
const esc = (s: string) =>
	s.replace(
		/[<>&"']/g,
		(c) =>
			({
				"<": "&lt;",
				">": "&gt;",
				"&": "&amp;",
				'"': "&quot;",
				"'": "&apos;",
			})[c]!,
	);
export async function GET() {
	const all = await posts();
	const site = "https://w-joslin-x.github.io";
	const updated = all.length
		? new Date(
				Math.max(
					...all.map((p) => (p.data.updated || p.data.published).valueOf()),
				),
			).toISOString()
		: new Date().toISOString();
	return new Response(
		`<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>${esc(roxy.title)}</title><id>${site}/</id><link href="${site}/"/><link href="${site}/atom.xml" rel="self"/><updated>${updated}</updated><author><name>${roxy.name}</name></author>${all.map((p) => `<entry><id>${site}${postHref(p.id)}</id><title>${esc(p.data.title)}</title><link href="${site}${postHref(p.id)}"/><published>${p.data.published.toISOString()}</published><updated>${(p.data.updated || p.data.published).toISOString()}</updated><summary>${esc(p.data.description || "")}</summary></entry>`).join("")}</feed>`,
		{ headers: { "Content-Type": "application/atom+xml; charset=utf-8" } },
	);
}
