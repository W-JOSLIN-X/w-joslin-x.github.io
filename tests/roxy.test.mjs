import test from "node:test";
import assert from "node:assert/strict";
import { matchesPost } from "../src/utils/roxy-filter.mjs";
import {
	nextTrack,
	readMusicPreferences,
	formatMusicTime,
} from "../src/utils/roxy-music.mjs";
const tracks = [
	{ id: "one", src: "/one.mp3" },
	{ id: "placeholder", src: "" },
	{ id: "two", src: "/two.wav" },
	{ id: "three", src: "/three.mp3" },
];
test("music queue skips placeholders and wraps in both directions", () => {
	assert.equal(nextTrack(tracks, "one"), "two");
	assert.equal(nextTrack(tracks, "one", { direction: -1 }), "three");
	assert.equal(nextTrack(tracks, "three"), "one");
	assert.equal(nextTrack([{ id: "placeholder", src: "" }], null), null);
	assert.equal(nextTrack([tracks[0], tracks[1]], "one"), "one");
});
test("single repeat only repeats on completion; shuffle excludes current and placeholders", () => {
	assert.equal(
		nextTrack(tracks, "one", { mode: "single", ended: true }),
		"one",
	);
	assert.equal(nextTrack(tracks, "one", { mode: "single" }), "two");
	for (const roll of [0, 0.3, 0.8, 1])
		assert.ok(
			["two", "three"].includes(
				nextTrack(tracks, "one", { mode: "shuffle", roll }),
			),
		);
});
test("removed music tracks and corrupted preferences cannot restore invalid playback state", () => {
	const defaults = { volume: 0.65, mode: "list" };
	assert.deepEqual(
		readMusicPreferences(
			{ id: "removed", time: 70, volume: 2, mode: "bad" },
			tracks,
			defaults,
		),
		{ id: "one", time: 0, volume: 1, mode: "list", muted: false },
	);
	assert.equal(
		readMusicPreferences({ id: "placeholder", time: 10 }, tracks, defaults).id,
		"one",
	);
	assert.equal(
		readMusicPreferences({ id: "two", time: 43, muted: true }, tracks, defaults)
			.time,
		43,
	);
	assert.equal(formatMusicTime(Infinity), "0:00");
	assert.equal(formatMusicTime(172.52), "2:52");
});
import {
	normalizeSlideshow,
	nextImage,
	shouldEnterScreensaver,
	hexToHsl,
	hslToHex,
} from "../src/utils/roxy-slideshow.mjs";
test("slideshow repairs stale selections without losing chosen order", () => {
	const ids = ["a", "b", "c"];
	assert.deepEqual(
		normalizeSlideshow({ selected: ["c", "deleted", "a", "c"] }, ids).selected,
		["c", "a"],
	);
	assert.deepEqual(
		normalizeSlideshow({ selected: ["deleted"] }, ids).selected,
		ids,
	);
	const repaired = normalizeSlideshow(
		{ interval: -20, idleMinutes: Infinity, auto: "false" },
		ids,
	);
	assert.equal(repaired.interval, 3);
	assert.equal(repaired.idleMinutes, 5);
	assert.equal(repaired.auto, true);
	assert.equal(
		normalizeSlideshow({ auto: false, enabled: false }, ids).auto,
		false,
	);
});
test("slideshow wraps selected order and shuffle never immediately repeats", () => {
	assert.equal(nextImage(["c", "a", "b"], "b"), "c");
	assert.equal(nextImage(["c", "a", "b"], "c", -1), "b");
	for (const roll of [0, 0.2, 0.5, 0.99, 1])
		assert.notEqual(nextImage(["a", "b", "c"], "b", 1, true, roll), "b");
	assert.equal(nextImage(["one"], "one", 1, true), "one");
});
test("automatic screensaver cannot interrupt an article, hidden tab or active form", () => {
	const state = {
		article: false,
		open: false,
		visible: true,
		busy: false,
		auto: true,
		idleMinutes: 5,
		elapsed: 300000,
	};
	assert.equal(shouldEnterScreensaver(state), true);
	for (const override of [
		{ article: true },
		{ open: true },
		{ visible: false },
		{ busy: true },
		{ auto: false },
		{ elapsed: 299999 },
	])
		assert.equal(shouldEnterScreensaver({ ...state, ...override }), false);
	assert.equal(shouldEnterScreensaver({ ...state, idleMinutes: 10 }), false);
});
test("color picker preserves neutral and saturated colors across hue conversion", () => {
	for (const [hex, expected] of [
		["#ff0000", 0],
		["#00ff00", 120],
		["#0000ff", 240],
	])
		assert.equal(hexToHsl(hex).hue, expected);
	for (const hex of ["#000000", "#ffffff", "#808080"]) {
		const hsl = hexToHsl(hex);
		assert.equal(hsl.saturation, 0);
		const result = hslToHex(hsl.hue, hsl.saturation, hsl.lightness);
		assert.ok(
			Math.abs(
				parseInt(result.slice(1, 3), 16) - parseInt(hex.slice(1, 3), 16),
			) <= 1,
		);
	}
});
import {
	monthCells,
	shanghaiDay,
	matchesDay,
} from "../src/utils/roxy-calendar.mjs";
test("calendar aligns Monday, includes leap day and handles year boundaries", () => {
	assert.equal(monthCells(2026, 8)[1], "2026-09-01");
	assert.equal(monthCells(2024, 1).filter(Boolean).length, 29);
	assert.ok(monthCells(2026, 11).includes("2026-12-31"));
	assert.equal(shanghaiDay(new Date("2026-09-22T17:00:00Z")), "2026-09-23");
});
test("date filter combines published, updated and content-resource commits", () => {
	const p = { slug: "one", published: "2026-09-01", updated: "2026-09-02" };
	const records = [{ date: "2026-09-03", posts: ["one"] }];
	for (const date of ["2026-09-01", "2026-09-02", "2026-09-03"])
		assert.equal(matchesDay(p, date, records), true);
	assert.equal(matchesDay(p, "2026-09-04", records), false);
	assert.equal(matchesDay({ ...p, slug: "two" }, "2026-09-03", records), false);
});
const post = {
	title: "Markdown 写作",
	text: "包含梯度下降与图片",
	category: "学习笔记",
	tags: ["Markdown", "写作"],
	moods: ["🤔 思考", "🌿 平静"],
};
test("title search excludes body-only hits; full text includes them", () => {
	assert.equal(matchesPost(post, { q: "梯度" }), false);
	assert.equal(matchesPost(post, { q: "梯度", scope: "full" }), true);
});
test("tags require AND while emotions use OR, combined with category", () => {
	assert.equal(matchesPost(post, { tags: ["Markdown", "数学"] }), false);
	assert.equal(
		matchesPost(post, {
			tags: ["Markdown", "写作"],
			moods: ["😊 愉快", "🤔 思考"],
			category: "学习笔记",
		}),
		true,
	);
	assert.equal(matchesPost(post, { moods: ["😊 愉快"] }), false);
	assert.equal(matchesPost(post, { category: "随笔" }), false);
});
test("search normalizes width and case and accepts empty filters", () => {
	assert.equal(matchesPost(post, { q: "ＭＡＲＫＤＯＷＮ" }), true);
	assert.equal(matchesPost(post, {}), true);
	assert.equal(matchesPost(post, { q: "Markdown 不存在" }), false);
});
