import test from "node:test";
import assert from "node:assert/strict";
import {
	effectiveFont,
	normalizeEffects,
	rankRelated,
} from "../src/utils/roxy-personalization.mjs";
import { rehypeReadingIndex } from "../src/plugins/rehype-reading-index.mjs";
import { excerpt, highlightSegments } from "../src/utils/roxy-search.mjs";
import { matchesPost } from "../src/utils/roxy-filter.mjs";

test("multilingual chapter text remains searchable with normalized width and code terms", () => {
	const post = {
		title: "Notes 中文 日本語",
		category: "笔记",
		tags: ["语言"],
		moods: [],
		text: "風と物語：日本語の検索。中文段落 const gradient_step = 1; ＡＳＴＲＯ",
	};
	for (const q of ["日本語", "中文", "gradient_step", "astro"]) {
		assert.equal(
			matchesPost(post, { q, scope: "full", tags: ["语言"], moods: [] }),
			true,
		);
		assert.ok(excerpt(post.text, q));
		assert.ok(highlightSegments(post.text, q).some((segment) => segment.match));
	}
});

test("article font override survives global changes; invalid and inherited values fall back", () => {
	assert.equal(effectiveFont("sans", "serif"), "serif");
	assert.equal(effectiveFont("rounded", "serif"), "serif");
	assert.equal(effectiveFont("rounded", "inherit"), "rounded");
	assert.equal(effectiveFont("deleted-font", "deleted-font"), "original");
});
test("touch defaults, disabled audio, and corrupt persisted effects are safe", () => {
	assert.equal(normalizeEffects({}, true).clickEnabled, false);
	assert.equal(normalizeEffects({}, false).clickEnabled, true);
	assert.equal(
		normalizeEffects({ soundEnabled: true }, true).soundEnabled,
		true,
	);
	const prefs = normalizeEffects({
		volume: 999,
		move: "arbitrary",
		soundEnabled: "true",
	});
	assert.equal(prefs.volume, 100);
	assert.equal(prefs.move, "stars");
	assert.equal(prefs.soundEnabled, false);
});
test("explicit references beat shared tags; ties preserve publication order, no unrelated padding", () => {
	const post = (id, tags, published) => ({ id, data: { tags, published } });
	const current = post("current", ["a", "b"], "2026-09-01");
	const items = [
		current,
		post("one", ["a"], "2026-09-04"),
		post("two", ["a", "b"], "2026-09-02"),
		post("three", ["a", "b"], "2026-09-03"),
		post("ref", [], "2020-01-01"),
		post("unrelated", [], "2027-01-01"),
	];
	assert.deepEqual(
		rankRelated(items, current, (p) => p.id === "ref").map((p) => p.id),
		["ref", "three", "two"],
	);
	assert.deepEqual(
		rankRelated([current, items.at(-1)], current, () => false),
		[],
	);
});
test("reading index uses rendered IDs and includes code, excluding controls and duplicate math presentation", () => {
	const text = (value) => ({ type: "text", value });
	const element = (tagName, children, properties = {}) => ({
		type: "element",
		tagName,
		children,
		properties,
	});
	const file = { data: { astro: { frontmatter: {} } } };
	const tree = {
		type: "root",
		children: [
			element("p", [text("Opening")]),
			element("h2", [text("标题")], { id: "existing-custom-id" }),
			element("p", [text("段落")]),
			element("pre", [element("code", [text("const keyword = 1")])]),
			element("button", [text("Copy")]),
			element("h2", [text("标题")], { id: "existing-custom-id-1" }),
			element("span", [text("duplicate")], { className: ["katex-html"] }),
		],
	};
	rehypeReadingIndex()(tree, file);
	const sections = file.data.astro.frontmatter.readingSections;
	assert.deepEqual(
		sections.map((s) => s.anchor),
		["", "existing-custom-id", "existing-custom-id-1"],
	);
	assert.match(sections[1].text, /keyword/);
	assert.doesNotMatch(sections[1].text, /Copy/);
	assert.equal(sections[2].text, "");
});
