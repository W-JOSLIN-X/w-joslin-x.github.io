/** Repository defaults. Runtime changes remain inside the persistent chat instance. */
export const chatAppearance = {
	parts: {
		frame: "maid",
		messages: "maid",
		composer: "maid",
		controls: "maid",
		ornaments: "maid",
	},
	palettes: {
		light: { accent: "#526aa8", base: "#f4f7fd" },
		dark: { accent: "#9bb0e1", base: "#0c193c" },
	},
	background: { id: "maid-palace", enabled: true },
} as const;
export function chatBackgrounds(base: string) {
	return [
		{
			id: "maid-palace",
			name: "女仆工坊 · 日景宫殿",
			thumbnail: `${base}skins/maid-day.webp`,
			light: `${base}skins/maid-day.webp`,
		},
		{
			id: "maid-palace-night",
			name: "女仆工坊 · 夜景宫殿",
			thumbnail: `${base}skins/maid-night.webp`,
			light: `${base}skins/maid-night.webp`,
		},
		{
			id: "orca-scene",
			name: "虎鲸链路 · 海潮",
			thumbnail: `${base}skins/orca-scene.webp`,
			light: `${base}skins/orca-scene.webp`,
		},
	];
}
export function readChatHostPalette() {
	const style = getComputedStyle(document.documentElement);
	const canvas = document.createElement("canvas"),
		context = canvas.getContext("2d")!;
	const hex = (value: string) => {
		context.fillStyle = "#000000";
		context.fillStyle = value.trim();
		context.fillRect(0, 0, 1, 1);
		return (
			"#" +
			[...context.getImageData(0, 0, 1, 1).data]
				.slice(0, 3)
				.map((v) => v.toString(16).padStart(2, "0"))
				.join("")
		);
	};
	return {
		accent: hex(style.getPropertyValue("--accent")),
		base: hex(style.getPropertyValue("--panel")),
	};
}
