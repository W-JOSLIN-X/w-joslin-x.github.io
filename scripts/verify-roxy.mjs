import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { parse } from "node-html-parser";
const root = path.resolve("dist");
function walk(dir) {
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.flatMap((e) =>
			e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
		);
}
const html = walk(root).filter((p) => p.endsWith(".html"));
const pages = new Map(
	html.map((file) => [file, parse(fs.readFileSync(file, "utf8"))]),
);
let checked = 0;
for (const file of html) {
	const page = pages.get(file);
	for (const el of page.querySelectorAll("[href],[src],[data-track-src]")) {
		const ref =
			el.getAttribute("href") ||
			el.getAttribute("src") ||
			el.getAttribute("data-track-src");
		if (!ref || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(ref)) continue;
		const base = `https://local.invalid/${path.relative(root, file).replaceAll("\\", "/")}`;
		const link = new URL(ref, base.replace(/index\.html$/, ""));
		const relative = decodeURIComponent(link.pathname);
		let target = path.join(root, relative);
		if (fs.existsSync(target) && fs.statSync(target).isDirectory())
			target = path.join(target, "index.html");
		assert.ok(
			fs.existsSync(target),
			`Broken local asset/link in ${file}: ${ref}`,
		);
		if (link.hash && pages.has(target)) {
			const id = decodeURIComponent(link.hash.slice(1));
			assert.ok(
				pages
					.get(target)
					.querySelectorAll("[id]")
					.some((el) => el.id === id),
				`Broken anchor in ${file}: ${ref}`,
			);
		}
		checked++;
	}
}
assert.ok(
	!fs.existsSync("dist/archive"),
	"No archive route should be generated",
);
const manifest = JSON.parse(
	fs.readFileSync(".generated/downloads.json", "utf8"),
);
for (const item of Object.values(manifest)) {
	assert.ok(
		/\.(md|zip)$/.test(item.file),
		`Unexpected download format: ${item.file}`,
	);
	assert.ok(
		fs.existsSync(path.join(root, "downloads", item.file)),
		`Missing download: ${item.file}`,
	);
}
const search = JSON.parse(
	fs.readFileSync(path.join(root, "search/full.json"), "utf8"),
);
assert.deepEqual(
	Object.keys(search).sort(),
	Object.keys(manifest).sort(),
	"Search and downloads must contain the same published articles",
);
let sectionsChecked = 0;
for (const record of Object.values(search)) {
	const page = pages.get(
		path.join(root, decodeURIComponent(record.href), "index.html"),
	);
	assert.ok(page, `Missing search article: ${record.href}`);
	const ids = new Set(page.querySelectorAll("[id]").map((el) => el.id));
	for (const section of record.sections) {
		assert.ok(
			!section.anchor || ids.has(section.anchor),
			`Search anchor differs from HTML: ${record.slug}#${section.anchor}`,
		);
		sectionsChecked++;
	}
	const preview = JSON.parse(
		fs.readFileSync(path.join(root, "previews", record.slug + ".json"), "utf8"),
	);
	assert.equal(preview.title, record.title);
	assert.ok(preview.sections.every((section) => section.text.length <= 400));
}
let fontResources = 0;
for (const file of walk(path.join(root, "fonts")).filter((file) =>
	file.endsWith(".css"),
)) {
	for (const match of fs
		.readFileSync(file, "utf8")
		.matchAll(/url\(["']?(\/fonts\/[^"')]+)["']?\)/g)) {
		assert.ok(
			fs.existsSync(path.join(root, match[1])),
			`Missing font shard: ${match[1]}`,
		);
		fontResources++;
	}
}
console.log(
	`Verified ${sectionsChecked} rendered search anchors and ${fontResources} font resource references.`,
);
console.log(
	`Verified ${html.length} pages, ${checked} internal links/assets and download rules.`,
);
