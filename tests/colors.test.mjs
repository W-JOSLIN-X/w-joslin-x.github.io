import assert from "node:assert/strict";
import test from "node:test";
import {
	baseColorAtHue,
	baseColors,
	hueGradient,
} from "../src/utils/roxy-colors.mjs";
import {
	appearanceDataset,
	defaults,
	exportDefaults,
	validateDefaults,
} from "../src/utils/roxy-defaults.mjs";

test("base palette reproduces all eight exact anchors and wraps red", () => {
	assert.equal(baseColors.length, 8);
	for (const color of baseColors)
		assert.equal(baseColorAtHue(color.hue), color.hex.toLowerCase());
	assert.equal(baseColorAtHue(0), "#dc2626");
	assert.equal(baseColorAtHue(360), baseColorAtHue(0));
	assert.equal(baseColorAtHue(-1), baseColorAtHue(359));
	assert.equal(baseColorAtHue(Number.NaN), baseColorAtHue(0));
});

test("palette is continuous across hue steps, anchor boundaries and red seam", () => {
	const rgb = (hex) =>
		[1, 3, 5].map((n) => Number.parseInt(hex.slice(n, n + 2), 16));
	for (let h = 0; h <= 360; h += 0.1) {
		const before = rgb(baseColorAtHue(h));
		const after = rgb(baseColorAtHue(h + 0.1));
		assert.ok(before.every((value, i) => Math.abs(value - after[i]) <= 2));
	}
	for (const color of baseColors)
		assert.ok(
			hueGradient.includes(`${color.hex.toLowerCase()} ${color.hue / 3.6}%`),
		);
});

test("new purple defaults share initialization and export while saved colors survive", () => {
	assert.equal(defaults.appearance.color, "#7C3AED");
	assert.equal(appearanceDataset().color.toLowerCase(), "#7c3aed");
	assert.equal(appearanceDataset({ color: "#aabbcc" }).color, "#aabbcc");
	const exported = exportDefaults("background", defaults.background);
	assert.equal(exported.appearance.color, defaults.appearance.color);
	assert.deepEqual(validateDefaults(exported), exported);
});
