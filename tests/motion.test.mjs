import test from "node:test";
import assert from "node:assert/strict";
import { decorationState } from "../src/utils/roxy-motion.mjs";
test("decorations stop for every suppression condition and edge is banner-only", () => {
	const base = {
		hidden: false,
		focus: false,
		saver: false,
		reduced: false,
		mode: "banner",
		atmosphere: "sakura",
		edge: "soft",
	};
	assert.deepEqual(decorationState(base), { atmosphere: true, edge: true });
	for (const key of ["hidden", "focus", "saver", "reduced"])
		assert.deepEqual(decorationState({ ...base, [key]: true }), {
			atmosphere: false,
			edge: false,
		});
	assert.deepEqual(decorationState({ ...base, mode: "none" }), {
		atmosphere: false,
		edge: false,
	});
	assert.deepEqual(decorationState({ ...base, mode: "overlay" }), {
		atmosphere: true,
		edge: false,
	});
	assert.deepEqual(
		decorationState({ ...base, atmosphere: "none", edge: "none" }),
		{ atmosphere: false, edge: false },
	);
});
