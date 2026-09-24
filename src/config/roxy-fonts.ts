export const fonts = [
	{
		id: "original",
		key: "fontOriginal",
		families: {
			zh: "RoxyMaru,RoxyLoli",
			en: "RoxyMaru,RoxyLoli",
			ja: "RoxyMaru,RoxyLoli",
		},
		sheets: ["original"],
		weights: [400, 500],
		source:
			"public/fonts/zen-maru-OFL.txt; src/assets/fonts/loli.woff2 (existing)",
	},
	{
		id: "rounded",
		key: "fontRounded",
		families: {
			zh: "Nunito,RoxyRounded",
			en: "Nunito,RoxyRounded",
			ja: "Nunito,RoxyMaru,RoxyRounded",
		},
		sheets: ["rounded", "nunito", "original"],
		weights: [400, 500, 700],
		source:
			"https://github.com/CyanoHao/Resource-Han-Rounded; https://fonts.google.com/specimen/Nunito; https://fonts.google.com/specimen/Zen+Maru+Gothic",
	},
	{
		id: "handwritten",
		key: "fontHandwritten",
		families: {
			zh: "RoxyWenkai",
			en: "Klee One,RoxyWenkai",
			ja: "Klee One,RoxyWenkai",
		},
		sheets: ["wenkai", "klee-one"],
		weights: [400, 600],
		source:
			"https://github.com/lxgw/LxgwWenKai; https://fonts.google.com/specimen/Klee+One",
	},
	{
		id: "sans",
		key: "fontSans",
		families: {
			zh: "Noto Sans,Noto Sans SC",
			en: "Noto Sans,Noto Sans SC",
			ja: "Noto Sans,Noto Sans JP",
		},
		sheets: ["noto-sans", "noto-sans-sc", "noto-sans-jp"],
		weights: [400, 700],
		source: "https://github.com/notofonts",
	},
	{
		id: "serif",
		key: "fontSerif",
		families: {
			zh: "Noto Serif,Noto Serif SC",
			en: "Noto Serif,Noto Serif SC",
			ja: "Noto Serif,Noto Serif JP",
		},
		sheets: ["noto-serif", "noto-serif-sc", "noto-serif-jp"],
		weights: [400, 700],
		source: "https://github.com/notofonts",
	},
	{
		id: "system",
		key: "fontSystem",
		families: {
			zh: 'system-ui,"Microsoft YaHei"',
			en: "system-ui",
			ja: 'system-ui,"Yu Gothic"',
		},
		sheets: [],
		weights: [],
		source: "device",
	},
] as const;
export type FontId = (typeof fonts)[number]["id"];
export function fontStack(id: string, lang: string) {
	const font = fonts.find((f) => f.id === id) || fonts[0];
	return (
		font.families[
			lang.startsWith("ja") ? "ja" : lang.startsWith("en") ? "en" : "zh"
		] + ",sans-serif"
	);
}
