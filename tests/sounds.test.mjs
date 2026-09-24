import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { normalizeEffects } from "../src/utils/roxy-personalization.mjs";
test("old sounds migrate while preserving volume and switch", () => {
	for (const [old, id] of [
		["tap", "mechanical"],
		["bell", "confirm"],
		["wood", "wood"],
		["bubble", "bubble"],
	]) {
		const result = normalizeEffects({
			sound: old,
			soundEnabled: true,
			volume: 37,
		});
		assert.equal(result.sound, id);
		assert.equal(result.soundEnabled, true);
		assert.equal(result.volume, 37);
	}
});
test("eight distinct local PCM samples match recorded processing hashes and headroom", () => {
	const report = JSON.parse(
		readFileSync(
			new URL(
				"../assets/audio/interface-sounds/processing.json",
				import.meta.url,
			),
			"utf8",
		),
	);
	assert.equal(report.length, 8);
	assert.equal(new Set(report.map((x) => x.sha256)).size, 8);
	for (const item of report) {
		const bytes = readFileSync(
			new URL(`../public/audio/clicks/${item.id}.wav`, import.meta.url),
		);
		assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
		assert.equal(bytes.toString("ascii", 8, 12), "WAVE");
		assert.equal(createHash("sha256").update(bytes).digest("hex"), item.sha256);
		assert.ok(item.durationMs > 20 && item.durationMs < 550);
		assert.ok(item.peakDb <= -3);
	}
});
