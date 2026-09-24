import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { hexToHsl } from "../src/utils/roxy-slideshow.mjs";
import {
	defaults,
	normalizeGroup,
	appearanceDataset,
	exportDefaults,
	exportCatalog,
	validateDefaults,
} from "../src/utils/roxy-defaults.mjs";
test("head bootstrap preserves legacy hue and wave choices without restoring temporary focus", () => {
	const layout = readFileSync(
		new URL("../src/layouts/RoxyLayout.astro", import.meta.url),
		"utf8",
	);
	const code = layout.match(
		/<script is:inline define:vars=\{\{publishedDefaults: appearanceDataset\(\)\}\}>([\s\S]*?)<\/script>/,
	)[1];
	const root = { dataset: {}, style: { setProperty() {} }, lang: "" };
	const saved = { hue: 123, waves: false, lang: "ja", focus: "true" };
	vm.runInNewContext(code, {
		document: { documentElement: root },
		publishedDefaults: appearanceDataset(),
		localStorage: { getItem: () => JSON.stringify(saved) },
	});
	assert.equal(hexToHsl(root.dataset.color).hue, 123);
	assert.equal(root.dataset.edge, "none");
	assert.equal(root.lang, "ja");
	assert.equal(root.dataset.focus, undefined);
});
test("published defaults validate unchanged; export isolates groups and temporary state", () => {
	for (const [group, value] of Object.entries(defaults))
		assert.deepEqual(normalizeGroup(group, value), value);
	const result = exportDefaults("appearance", {
		color: "#123456",
		focus: true,
		selected: ["private"],
		progress: 12,
	});
	assert.equal(result.appearance.color, "#123456");
	assert.deepEqual(result.background, defaults.background);
	assert.equal(JSON.stringify(result).includes("private"), false);
	assert.equal("focus" in appearanceDataset({ focus: "true" }), false);
	assert.deepEqual(exportDefaults("appearance", result.appearance), result);
	assert.doesNotThrow(() => validateDefaults(result));
	assert.throws(() => validateDefaults({ ...result, focus: true }));
	assert.throws(() =>
		validateDefaults({
			...result,
			background: { ...result.background, interval: 0 },
		}),
	);
});
test("legacy waves migrate without changing explicit choices; malformed preferences fall back", () => {
	assert.equal(normalizeGroup("background", { waves: false }).edge, "none");
	assert.equal(normalizeGroup("background", { waves: true }).edge, "soft");
	assert.equal(
		normalizeGroup("background", { edge: "clouds", waves: false }).edge,
		"clouds",
	);
	assert.equal(normalizeGroup("background", { interval: NaN }).interval, 15);
	assert.equal(normalizeGroup("appearance", { wide: "true" }).wide, true);
});
test("gallery export changes only ordered defaults and preserves other catalog data", () => {
	const source = readFileSync(
		new URL("../content/catalog.yaml", import.meta.url),
		"utf8",
	);
	const ids = ["makeine-classroom", "mushoku-meadow-hd"];
	const exported = exportCatalog(source, ids, ids);
	assert.match(
		exported,
		/defaultBackgrounds:\r?\n  - makeine-classroom\r?\n  - mushoku-meadow-hd/,
	);
	assert.equal(
		exported.split("defaultBackgrounds:")[0],
		source.split("defaultBackgrounds:")[0],
	);
	assert.equal(exported.split("music:")[1], source.split("music:")[1]);
	assert.throws(() => exportCatalog(source, [], ids));
});
