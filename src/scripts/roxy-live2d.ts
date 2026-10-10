import { setChatCharacter, type ChatCharacter } from "./roxy-chat";
import { pageFeature } from "./core/page-scope";

type WidgetState = {
	modelId?: string;
	scale?: number;
	edge?: "left" | "right" | "top" | "bottom";
	hidden: boolean;
	position: { x: number; y: number };
};
type Widget = ChatCharacter & {
	ready: Promise<void>;
	getState(): WidgetState;
	pause(reason: string): void;
	resume(reason: string): void;
	destroy(): void;
};

if (import.meta.env.PUBLIC_LIVE2D_ENABLED === "true") {
	const desktop = matchMedia("(hover: hover) and (pointer: fine)");
	let widget: Widget | undefined;
	let saved: WidgetState | undefined;
	let loading = false;
	let revision = 0;
	const base = `${import.meta.env.BASE_URL}live2d/`;
	function sync() {
		const suppressed =
			document.documentElement.dataset.focus === "true" ||
			!!document.querySelector("#screensaver[open]");
		if (suppressed) widget?.pause("reading");
		else widget?.resume("reading");
	}
	async function mount() {
		if (!desktop.matches) {
			++revision;
			if (widget) {
				saved = widget.getState();
				setChatCharacter(undefined);
				widget.destroy();
				widget = undefined;
			}
			return;
		}
		if (widget || loading) {
			sync();
			return;
		}
		const host = document.getElementById("live2d-host");
		if (!host) return;
		const current = ++revision;
		loading = true;
		try {
			const url = new URL(`${base}lib/widget.js`, location.origin).href;
			const { mountCharacter } = await import(/* @vite-ignore */ url);
			if (current !== revision || !desktop.matches) return;
			const mounted = await mountCharacter({
				mount: host,
				initialState: saved ?? { modelId: "vivian", scale: 0.7 },
				base,
			});
			if (current !== revision || !desktop.matches) {
				mounted.destroy();
				await mounted.ready.catch(() => {});
				return;
			}
			widget = mounted as Widget;
			setChatCharacter(widget);
			sync();
			await widget.ready;
		} catch (error) {
			if (current === revision) console.error("Live2D:", error);
			// The widget owns its retry UI; article navigation remains independent.
		} finally {
			loading = false;
			if (current !== revision && desktop.matches && !widget) void mount();
		}
	}
	pageFeature((scope) => {
		scope.on(window, "roxy:focus", sync);
		scope.on(desktop, "change", () => void mount());
		void mount();
		sync();
	});
}
