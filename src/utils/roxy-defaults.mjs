import defaults from "../config/roxy-defaults.json" with { type: "json" };
export { defaults };
const choices = {
	theme: ["light", "dark"],
	layout: ["list", "grid"],
	font: ["original", "rounded", "handwritten", "sans", "serif", "system"],
	mode: ["banner", "fullscreen", "overlay", "none"],
	edge: ["none", "soft", "layered", "clouds"],
	atmosphere: ["none", "sakura", "stars", "ribbons"],
	lang: ["zh", "en", "ja"],
	move: ["stars", "glow", "petals"],
	click: ["ripple", "stars", "hearts", "petals"],
	sound: [
		"mechanical",
		"impact",
		"wood",
		"pluck",
		"bubble",
		"confirm",
		"energy",
		"arcade",
	],
};
const ranges = {
	overlayTransparency: [0, 100],
	interval: [3, 300],
	idleMinutes: [1, 60],
	volume: [0, 100],
};
const fields = {
	appearance: ["theme", "color", "layout", "wide", "font"],
	background: [
		"mode",
		"soft",
		"edge",
		"atmosphere",
		"overlayTransparency",
		"enabled",
		"interval",
		"random",
		"auto",
		"idleMinutes",
	],
	effects: [
		"move",
		"moveEnabled",
		"click",
		"clickEnabled",
		"touchClickEnabled",
		"sound",
		"soundEnabled",
		"volume",
	],
	other: ["lang"],
};
export function validateDefaults(config) {
	if (
		!config ||
		Object.keys(config).sort().join() !== Object.keys(fields).sort().join()
	)
		throw Error("Invalid defaults groups");
	for (const [group, keys] of Object.entries(fields)) {
		const value = config[group];
		if (!value || Object.keys(value).sort().join() !== [...keys].sort().join())
			throw Error(`Invalid defaults fields: ${group}`);
		for (const key of keys) {
			const v = value[key];
			const valid = choices[key]
				? choices[key].includes(v)
				: ranges[key]
					? typeof v === "number" &&
						Number.isFinite(v) &&
						v >= ranges[key][0] &&
						v <= ranges[key][1]
					: key === "color"
						? /^#[\da-f]{6}$/i.test(v)
						: typeof v === "boolean";
			if (!valid) throw Error(`Invalid default: ${group}.${key}`);
		}
	}
	return config;
}
validateDefaults(defaults);
/** Explicit schema: unknown, private and temporary fields never cross this boundary. */
export function normalizeGroup(group, input = {}) {
	if (!Object.hasOwn(defaults, group))
		throw new Error("Unknown settings group");
	const value = input && typeof input === "object" ? input : {};
	return Object.fromEntries(
		fields[group].map((key) => {
			const fallback = defaults[group][key];
			let v = value[key];
			if (key === "sound") v = { tap: "mechanical", bell: "confirm" }[v] || v;
			if (key === "edge" && v == null && value.waves != null)
				v = String(value.waves) === "true" ? "soft" : "none";
			if (
				group !== "effects" &&
				typeof fallback === "boolean" &&
				["true", "false"].includes(v)
			)
				v = v === "true";
			if (typeof fallback === "number" && typeof v === "string" && v.trim())
				v = Number(v);
			if (choices[key]) v = choices[key].includes(v) ? v : fallback;
			else if (key === "color")
				v = /^#[\da-f]{6}$/i.test(v || "") ? v : fallback;
			else if (ranges[key])
				v = Number.isFinite(v)
					? Math.max(ranges[key][0], Math.min(ranges[key][1], v))
					: fallback;
			else if (typeof v !== typeof fallback) v = fallback;
			return [key, v];
		}),
	);
}
export function appearanceDataset(input = {}) {
	const values = {
		...normalizeGroup("appearance", input),
		...normalizeGroup("background", input),
		...normalizeGroup("other", input),
	};
	const keys = [
		"theme",
		"color",
		"layout",
		"wide",
		"mode",
		"soft",
		"edge",
		"atmosphere",
		"overlayTransparency",
		"lang",
	];
	return Object.fromEntries(keys.map((key) => [key, String(values[key])]));
}
export function exportDefaults(group, values) {
	return Object.fromEntries(
		Object.keys(defaults).map((key) => [
			key,
			normalizeGroup(key, key === group ? values : defaults[key]),
		]),
	);
}
export function exportCatalog(source, selected, validIds) {
	const ids = [...new Set(selected)].filter((id) => validIds.includes(id));
	if (!ids.length) throw new Error("Select at least one image");
	const block = /^defaultBackgrounds:[^\r\n]*\r?\n(?:[ \t]+[^\r\n]*\r?\n)*/m;
	if (!block.test(source)) throw new Error("Missing defaultBackgrounds");
	const eol = source.includes("\r\n") ? "\r\n" : "\n";
	return source.replace(
		block,
		`defaultBackgrounds:${eol}${ids.map((id) => `  - ${id}${eol}`).join("")}`,
	);
}
