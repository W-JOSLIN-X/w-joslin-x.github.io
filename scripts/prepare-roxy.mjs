import fs from "node:fs";
import { defaults, validateDefaults } from "../src/utils/roxy-defaults.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
import matter from "gray-matter";
import sharp from "sharp";
import { loadLibrary, resource } from "./lib/library.mjs";
import { contentHistory } from "./lib/history.mjs";
import { zip } from "./lib/zip.mjs";
import { imageReferences } from "./lib/markdown-resources.mjs";

const generated = path.resolve(".generated");
validateDefaults(defaults);
const output = path.resolve(".generated/public");
if (
	!output.startsWith(process.cwd() + path.sep) ||
	path.dirname(output) !== generated
)
	throw Error("Invalid output directory");
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
fs.cpSync("public", output, { recursive: true });
const write = (file, data) => {
	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(file, data);
};
const json = (name, value) =>
	write(path.join(generated, name), JSON.stringify(value, null, 2) + "\n");
const walk = (dir) =>
	fs
		.readdirSync(dir, { withFileTypes: true })
		.flatMap((e) =>
			e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
		);
const library = loadLibrary();
const gallery = [];
for (const entry of library.backgrounds) {
	const source = resource(entry.folder, entry.image);
	const metadata = await sharp(source).metadata();
	const width = metadata.width;
	const widths = [
		...new Set(
			[480, 960, 1600, 2560]
				.filter((n) => n < width)
				.concat(Math.min(width, 2560)),
		),
	];
	const versions = [];
	for (const size of widths) {
		const hash = createHash("sha256")
			.update(fs.readFileSync(source))
			.update(String(size))
			.digest("hex");
		const cache = path.join(generated, "image-cache", `${hash}.webp`);
		if (!fs.existsSync(cache)) {
			fs.mkdirSync(path.dirname(cache), { recursive: true });
			await sharp(source)
				.rotate()
				.resize({ width: size, withoutEnlargement: true })
				.webp({ quality: 85 })
				.toFile(cache);
		}
		const url = `/media/backgrounds/${entry.id}/${size}.webp`;
		write(path.join(output, url), fs.readFileSync(cache));
		versions.push({ width: size, src: url });
	}
	if (entry.legacy) {
		if (!/^\/images\/roxy\/[a-z0-9-]+\.jpg$/.test(entry.legacy))
			throw Error(`Invalid legacy path: ${entry.legacy}`);
		write(path.join(output, entry.legacy), fs.readFileSync(source));
	}
	write(
		path.join(output, `/media/backgrounds/${entry.id}/image.webp`),
		fs.readFileSync(path.join(output, versions.at(-1).src)),
	);
	gallery.push({
		id: entry.id,
		title: entry.title,
		source: entry.source || "",
		src: versions.at(-1).src,
		thumbnail: versions[0].src,
		srcset: versions.map((v) => `${v.src} ${v.width}w`).join(", "),
		versions,
		width,
		height: metadata.height,
		position: entry.position || "50% 50%",
		mobilePosition: entry.mobilePosition || entry.position || "50% 50%",
	});
}
const music = library.music.map((entry) => {
	const urls = {};
	for (const field of ["audio", "cover"]) {
		const source = resource(entry.folder, entry[field], true);
		if (!source) {
			urls[field] = "";
			continue;
		}
		const url = `/music/${entry.id}/${path.basename(source)}`;
		write(path.join(output, url), fs.readFileSync(source));
		urls[field] = url;
	}
	return {
		id: entry.id,
		title: entry.title,
		artist: entry.artist,
		album: entry.album || "",
		src: urls.audio,
		cover: urls.cover,
	};
});
json("library.json", {
	gallery,
	music,
	defaultBackgrounds: library.defaultBackgrounds,
});

const base = path.resolve("content/posts");
const manifest = {},
	published = new Set();
for (const file of walk(base).filter((p) =>
	/^[^/]+\/index\.(md|mdx)$/.test(path.relative(base, p).replaceAll("\\", "/")),
)) {
	const raw = fs.readFileSync(file, "utf8"),
		{ data, content } = matter(raw);
	if (
		typeof data.title !== "string" ||
		!data.title.trim() ||
		!data.published ||
		Number.isNaN(new Date(data.published).valueOf())
	)
		throw Error(`${file}: title and valid published date required`);
	if (data.updated && Number.isNaN(new Date(data.updated).valueOf()))
		throw Error(`${file}: invalid updated date`);
	if (data.draft !== undefined && typeof data.draft !== "boolean")
		throw Error(`${file}: draft must be true or false`);
	if (data.draft) continue;
	for (const field of ["background", "image"]) {
		if (
			typeof data[field] === "string" &&
			data[field].startsWith("/") &&
			!fs.existsSync(path.join(output, data[field]))
		)
			throw Error(`${file}: missing ${field} ${data[field]}`);
	}
	const source = path.relative(base, file).replaceAll("\\", "/");
	const slug = source.replace(/\.(md|mdx)$/, "").replace(/\/index$/, "");
	if (published.has(slug)) throw Error(`Duplicate article URL: ${slug}`);
	published.add(slug);
	const flat = slug.replaceAll("/", "--");
	let rewritten = raw;
	const images = new Map();
	for (const { full, src } of imageReferences(content)) {
		if (/^(https?:|data:|\/\/)/.test(src)) continue;
		const decoded = decodeURIComponent(src.split(/[?#]/)[0]);
		const target = src.startsWith("/")
			? path.resolve(output, "." + decoded)
			: path.resolve(path.dirname(file), decoded);
		if (
			![base, output].some((root) => target.startsWith(root + path.sep)) ||
			!fs.existsSync(target)
		)
			throw Error(`${file}: missing or invalid image ${src}`);
		if (!images.has(target))
			images.set(target, `images/${images.size + 1}-${path.basename(target)}`);
		rewritten = rewritten.replace(full, full.replace(src, images.get(target)));
	}
	const localImages = path.join(path.dirname(file), "images");
	if (fs.existsSync(localImages))
		for (const asset of walk(localImages).filter(
			(p) => !path.basename(p).startsWith("."),
		)) {
			if (!images.has(asset))
				images.set(asset, `images/${images.size + 1}-${path.basename(asset)}`);
		}
	const localAttachments = path.join(path.dirname(file), "attachments");
	const attachments = fs.existsSync(localAttachments)
		? walk(localAttachments)
				.filter((p) => !path.basename(p).startsWith("."))
				.map((p) => [
					`attachments/${path.relative(localAttachments, p).replaceAll("\\", "/")}`,
					fs.readFileSync(p),
				])
		: [];
	const filename = `${flat}.${images.size ? "zip" : "md"}`;
	write(
		path.join(output, "downloads", filename),
		images.size
			? zip([
					[`${flat}.md`, Buffer.from(rewritten)],
					...[...images].map(([file, name]) => [name, fs.readFileSync(file)]),
					...attachments,
				])
			: raw,
	);
	manifest[slug] = { file: filename, source };
}
const activity = contentHistory(manifest);
const updates = {};
for (const item of activity)
	for (const slug of item.posts)
		if (!updates[slug] || updates[slug] < item.date) updates[slug] = item.date;
json("downloads.json", manifest);
json("activity.json", activity);
json("updates.json", updates);
// Full-text index is emitted from the rendered Markdown endpoint.
console.log(
	`Prepared ${published.size} articles, ${gallery.length} backgrounds, ${music.length} songs; ${activity.length} content commits.`,
);
