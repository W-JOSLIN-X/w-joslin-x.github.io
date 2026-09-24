import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { loadLibrary, resource } from "../scripts/lib/library.mjs";
import { contentHistory } from "../scripts/lib/history.mjs";
import { nextTrack } from "../src/utils/roxy-music.mjs";
import { excerpt, highlightSegments } from "../src/utils/roxy-search.mjs";

test("production catalog has preserved backgrounds, valid defaults and six pending album parts", () => {
	const library = loadLibrary();
	assert.ok(library.backgrounds.length >= 30);
	assert.ok(library.defaultBackgrounds.length > 0);
	const parts = library.music.filter((song) => song.id.startsWith("luv-sic-"));
	assert.deepEqual(
		parts.map((song) => song.id),
		Array.from({ length: 6 }, (_, i) => `luv-sic-${i + 1}`),
	);
	for (const song of parts) {
		assert.equal(song.audio, "");
		assert.ok(song.album);
		assert.ok(resource(song.folder, song.cover));
	}
	const queue = library.music.map((song) => ({ id: song.id, src: song.audio }));
	for (const mode of ["list", "shuffle", "single"])
		assert.equal(nextTrack(queue, "yanineko-op", { mode }), "yanineko-op");
	queue[1].src = "/test.mp3";
	assert.equal(nextTrack(queue, "yanineko-op"), "luv-sic-1");
});

test("library rejects duplicate IDs, unregistered directories and escaping resources", () => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "roxy-library-"));
	try {
		fs.mkdirSync(path.join(root, "backgrounds/one"), { recursive: true });
		fs.mkdirSync(path.join(root, "music/song"), { recursive: true });
		fs.writeFileSync(path.join(root, "backgrounds/one/image.jpg"), "fixture");
		fs.writeFileSync(
			path.join(root, "backgrounds/one/meta.yaml"),
			"title: Background\nimage: image.jpg",
		);
		fs.writeFileSync(
			path.join(root, "music/song/meta.yaml"),
			'title: Song\nartist: Author\naudio: ""\ncover: ""',
		);
		const catalog = (ids = "[one]") =>
			fs.writeFileSync(
				path.join(root, "catalog.yaml"),
				`backgrounds: ${ids}\nmusic: [song]\ndefaultBackgrounds: [one]`,
			);
		catalog();
		assert.equal(loadLibrary(root).music[0].audio, "");
		catalog("[one, one]");
		assert.throws(() => loadLibrary(root), /duplicate/);
		catalog();
		fs.mkdirSync(path.join(root, "music/forgotten"));
		assert.throws(() => loadLibrary(root), /not registered/);
		assert.throws(
			() => resource(path.join(root, "music/song"), "../../catalog.yaml"),
			/invalid resource/,
		);
		assert.throws(() => resource(root, "missing.mp3"), /invalid resource/);
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
});

test("history survives folder migration without turning maintenance into activity", () => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "roxy-history-"));
	const git = (args, date) =>
		execFileSync("git", args, {
			cwd: root,
			stdio: "pipe",
			env: {
				...process.env,
				...(date ? { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } : {}),
			},
		}).toString();
	const commit = (message, date) => {
		git(["add", "."]);
		git(["commit", "-m", message], date);
	};
	try {
		git(["init"]);
		git(["config", "user.name", "Fixture"]);
		git(["config", "user.email", "fixture@example.invalid"]);
		git(["config", "core.autocrlf", "false"]);
		assert.deepEqual(contentHistory({}, root), []);
		fs.mkdirSync(path.join(root, "src/content/posts/one/images"), {
			recursive: true,
		});
		fs.writeFileSync(
			path.join(root, "src/content/posts/one/index.md"),
			"Article",
		);
		fs.writeFileSync(
			path.join(root, "src/content/posts/one/images/a.jpg"),
			"image one",
		);
		commit("Publish", "2026-09-01T17:00:00Z");
		fs.mkdirSync(path.join(root, "content"), { recursive: true });
		fs.renameSync(
			path.join(root, "src/content/posts"),
			path.join(root, "content/posts"),
		);
		commit("Move folders", "2026-09-05T10:00:00Z");
		fs.writeFileSync(
			path.join(root, "content/posts/one/images/a.jpg"),
			"image two",
		);
		commit("Update illustration", "2026-09-10T17:00:00Z");
		fs.writeFileSync(path.join(root, "config.json"), "{}");
		commit("Theme only", "2026-09-12T10:00:00Z");
		const history = contentHistory({ one: { source: "one/index.md" } }, root);
		assert.deepEqual(
			history.map((item) => item.message),
			["Update illustration", "Publish"],
		);
		assert.deepEqual(
			history.map((item) => item.date),
			["2026-09-11", "2026-09-02"],
		);
		assert.deepEqual(
			history.map((item) => item.posts),
			[["one"], ["one"]],
		);
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
});

test("search excerpts find body context and highlighting never interprets markup", () => {
	const text = "前文".repeat(100) + "梯度下降" + "后文".repeat(100);
	const result = excerpt(text, "梯度", 20);
	assert.ok(result.startsWith("…") && result.endsWith("…"));
	assert.ok(result.includes("梯度下降"));
	assert.ok(result.length < 50);
	assert.equal(excerpt(text, "不存在"), "");
	const raw = "<img src=x onerror=alert(1)> Math math";
	const segments = highlightSegments(raw, "MATH");
	assert.equal(segments.filter((part) => part.match).length, 2);
	assert.equal(segments.map((part) => part.text).join(""), raw);
});

test("search highlights multiple terms and normalized width", () => {
	assert.deepEqual(
		highlightSegments("ＭＡＴＨ and Code", "math code")
			.filter((x) => x.match)
			.map((x) => x.text),
		["ＭＡＴＨ", "Code"],
	);
});

import { imageReferences } from "../scripts/lib/markdown-resources.mjs";
test("download image discovery skips code examples and handles Typora HTML/reference images", () => {
	const body =
		'`![example](./missing.jpg)`\n```md\n![sample](./missing2.jpg)\n```\n![real](./a.jpg)\n<img src="./b.jpg" width="300">\n![reference][pic]\n[pic]: ./c.jpg';
	assert.deepEqual(
		imageReferences(body).map((x) => x.src),
		["./a.jpg", "./b.jpg", "./c.jpg"],
	);
});
