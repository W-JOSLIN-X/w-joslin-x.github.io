import { getCollection } from "astro:content";
export const day = (date: Date | string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(date));
export const slugOf = (id: string) => id.replace(/\.(md|mdx)$/, "").replace(/\/index$/, "");
export const postHref = (id: string) => `/posts/${slugOf(id).split('/').map(encodeURIComponent).join('/')}/`;
export function plainText(body: string) {
  return body.replace(/```[\s\S]*?```/g, " ").replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/<[^>]+>/g, " ").replace(/[#*_`>~]/g, " ");
}
export function wordCount(body: string) {
  const text = plainText(body);
  return (text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu)?.length || 0) + (text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length || 0);
}
export async function posts() {
  return (await getCollection("posts", ({data}) => !data.draft)).sort((a,b) => b.data.published.valueOf() - a.data.published.valueOf() || a.id.localeCompare(b.id));
}
export function referencesTo(body: string, currentId: string, targetId: string) {
  const target = postHref(targetId);
  const origin = `https://local.test${postHref(currentId)}`;
  const links = [...body.replace(/```[\s\S]*?```/g, "").matchAll(/(?<!!)\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)].map(x => x[1]);
  return links.some(href => {
    try { const parsed = new URL(href, origin); return ["local.test", "w-joslin-x.github.io"].includes(parsed.hostname) && decodeURIComponent(parsed.pathname).replace(/\/$/, "") === decodeURIComponent(target).replace(/\/$/, ""); } catch { return false; }
  }) || [...body.matchAll(/\[\[([^\]|#]+)(?:[^\]]*)\]\]/g)].some(x => x[1] === slugOf(targetId));
}
