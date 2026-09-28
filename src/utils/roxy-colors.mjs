import { hexToHsl, hslToHex } from "./roxy-slideshow.mjs";

// Actual hues, including fractional degrees, keep every published anchor exact.
export const baseColors = [
	"#DC2626",
	"#EA580C",
	"#CA8A04",
	"#16A34A",
	"#0891B2",
	"#2563EB",
	"#7C3AED",
	"#DB2777",
]
	.map((hex) => ({ hex, ...hexToHsl(hex, false) }))
	.sort((a, b) => a.hue - b.hue);

/** A hue always maps to the same base palette, independent of personal colors. */
export function baseColorAtHue(value) {
	const hue = Number.isFinite(value) ? ((value % 360) + 360) % 360 : 0;
	const end = { ...baseColors[0], hue: baseColors[0].hue + 360 };
	const anchors = [...baseColors, end];
	const position = hue < baseColors[0].hue ? hue + 360 : hue;
	const right = anchors.findIndex((color) => color.hue > position);
	const a = anchors[right - 1];
	const b = anchors[right];
	const fraction = (position - a.hue) / (b.hue - a.hue);
	return hslToHex(
		hue,
		a.saturation + (b.saturation - a.saturation) * fraction,
		a.lightness + (b.lightness - a.lightness) * fraction,
	);
}

// Dense stops approximate the same HSL curve in the CSS gradient's sRGB space.
export const hueGradient = `linear-gradient(90deg, ${[
	...new Set([
		...Array.from({ length: 361 }, (_, hue) => hue),
		...baseColors.map((color) => color.hue),
	]),
]
	.sort((a, b) => a - b)
	.map((hue) => `${baseColorAtHue(hue)} ${hue / 3.6}%`)
	.join(", ")})`;
