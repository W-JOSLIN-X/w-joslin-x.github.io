import { pageFeature } from "./core/page-scope";
import { normalizeEffects } from "../utils/roxy-personalization.mjs";
let audio: AudioContext | undefined;
const buffers = new Map<string, Promise<AudioBuffer>>();
const sources = new Set<AudioBufferSourceNode>();
pageFeature((scope) => {
	const touch = matchMedia("(hover: none), (pointer: coarse)");
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const key = "roxy-effects-v1";
	let saved;
	try {
		saved = JSON.parse(localStorage.getItem(key) || "{}");
	} catch {}
	let prefs = normalizeEffects(saved, touch.matches);
	const $ = <T extends HTMLElement>(id: string) =>
		document.getElementById(id) as T;
	const suppressed = () =>
		document.hidden ||
		document.documentElement.dataset.focus === "true" ||
		!!document.querySelector("#screensaver[open]");
	function save() {
		try {
			localStorage.setItem(key, JSON.stringify(prefs));
		} catch {}
	}
	function sync() {
		for (const kind of ["move", "click", "sound"] as const) {
			$<HTMLSelectElement>(`effect-${kind}`).value = prefs[kind];
			$<HTMLInputElement>(`effect-${kind}-enabled`).checked =
				prefs[`${kind}Enabled` as const];
		}
		$<HTMLInputElement>("effect-volume").value = String(prefs.volume);
		$("effect-volume-value").textContent = prefs.volume + "%";
		$<HTMLInputElement>("effect-move-enabled").disabled = touch.matches;
	}
	for (const kind of ["move", "click", "sound"] as const) {
		$<HTMLSelectElement>(`effect-${kind}`).onchange = (e) => {
			prefs[kind] = (e.target as HTMLSelectElement).value;
			save();
		};
		$<HTMLInputElement>(`effect-${kind}-enabled`).onchange = (e) => {
			prefs[`${kind}Enabled` as const] = (e.target as HTMLInputElement).checked;
			save();
		};
	}
	$<HTMLInputElement>("effect-volume").oninput = (e) => {
		prefs.volume = Number((e.target as HTMLInputElement).value);
		save();
		sync();
	};
	let lastSound = -1000;
	async function sound(preview = false, soundId = prefs.sound) {
		if (
			suppressed() ||
			(!preview && !prefs.soundEnabled) ||
			prefs.volume === 0 ||
			performance.now() - lastSound < 65
		)
			return;
		lastSound = performance.now();
		try {
			audio ||= new AudioContext();
			await audio.resume();
			if (suppressed()) return;
			if (!buffers.has(soundId))
				buffers.set(
					soundId,
					fetch(`/audio/clicks/${soundId}.wav`)
						.then((response) => {
							if (!response.ok) throw Error("Sample unavailable");
							return response.arrayBuffer();
						})
						.then((bytes) => audio!.decodeAudioData(bytes)),
				);
			let buffer: AudioBuffer;
			try {
				buffer = await buffers.get(soundId)!;
			} catch (error) {
				buffers.delete(soundId);
				throw error;
			}
			if (suppressed()) return;
			const source = audio.createBufferSource(),
				gain = audio.createGain();
			source.buffer = buffer;
			gain.gain.value = prefs.volume / 100;
			source.connect(gain);
			gain.connect(audio.destination);
			sources.add(source);
			source.onended = () => {
				sources.delete(source);
				source.disconnect();
				gain.disconnect();
			};
			source.start();
		} catch {
			/* Unsupported/blocked audio must never block the activated control. */
		}
	}
	$("effect-preview").onclick = () => void sound(true);
	document
		.querySelectorAll<HTMLButtonElement>("[data-sound-preview]")
		.forEach(
			(button) =>
				(button.onclick = () => void sound(true, button.dataset.soundPreview)),
		);
	const layer = document.createElement("div");
	layer.className = "effect-layer";
	layer.setAttribute("aria-hidden", "true");
	document.body.append(layer);
	const animations = new Set<Animation>();
	const clear = () => {
		for (const a of animations) a.cancel();
		animations.clear();
		layer.replaceChildren();
	};
	scope.defer(() => {
		clear();
		layer.remove();
	});
	function particle(x: number, y: number, kind: string, moving = false) {
		if (suppressed() || reduced.matches || animations.size >= 40) return;
		const count = moving ? 1 : kind === "ripple" ? 1 : 7;
		for (let i = 0; i < count && animations.size < 40; i++) {
			const dot = document.createElement("span");
			dot.className = `effect-particle effect-${kind}`;
			dot.textContent =
				kind === "stars"
					? "✦"
					: kind === "hearts"
						? "♥"
						: kind === "petals"
							? "❀"
							: "";
			dot.style.left = x + "px";
			dot.style.top = y + "px";
			layer.append(dot);
			const angle = (i / count) * Math.PI * 2,
				distance = moving ? 18 : 32 + Math.random() * 22;
			const transform =
				kind === "ripple"
					? "translate(-50%,-50%) scale(3)"
					: `translate(calc(-50% + ${Math.cos(angle) * distance}px),calc(-50% + ${Math.sin(angle) * distance + (kind === "petals" ? 28 : 0)}px)) rotate(${kind === "petals" ? 100 : 20}deg) scale(.5)`;
			const a = dot.animate(
				[
					{ transform: "translate(-50%,-50%) scale(.7)", opacity: 0.65 },
					{ transform, opacity: 0 },
				],
				{ duration: moving ? 480 : 650, easing: "ease-out" },
			);
			animations.add(a);
			const done = () => {
				animations.delete(a);
				dot.remove();
			};
			a.onfinish = done;
			a.oncancel = done;
		}
	}
	let start:
			| { x: number; y: number; dragged: boolean; excluded: boolean }
			| undefined,
		lastMove = 0;
	const excluded = (target: EventTarget | null) =>
		target instanceof Element &&
		!!target.closest(
			'input,textarea,select,[contenteditable="true"],[role="slider"],audio,video,[data-no-effects],:disabled,[aria-disabled="true"],label:has(input),label:has(select)',
		);
	scope.on(document, "pointerdown", (e: PointerEvent) => {
		start =
			e.button === 0
				? {
						x: e.clientX,
						y: e.clientY,
						dragged: false,
						excluded: excluded(e.target),
					}
				: undefined;
	});
	scope.on(document, "pointercancel", () => {
		start = undefined;
	});
	scope.on(
		document,
		"pointermove",
		(e: PointerEvent) => {
			if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8)
				start.dragged = true;
			if (
				!prefs.moveEnabled ||
				touch.matches ||
				e.pointerType !== "mouse" ||
				e.buttons ||
				excluded(e.target) ||
				performance.now() - lastMove < 55
			)
				return;
			lastMove = performance.now();
			particle(e.clientX, e.clientY, prefs.move, true);
		},
		{ passive: true },
	);
	scope.on(document, "click", (e: MouseEvent) => {
		const down = start;
		start = undefined;
		if (
			excluded(e.target) ||
			e.button !== 0 ||
			String(getSelection() || "").trim() ||
			suppressed()
		)
			return;
		const drag =
			e.detail > 0 &&
			down &&
			(down.dragged ||
				down.excluded ||
				Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8);
		if (drag) return;
		if (prefs.clickEnabled && e.detail > 0)
			particle(e.clientX, e.clientY, prefs.click);
		const target = (e.target as Element).closest<HTMLElement>(
			'button,a[href],[role="button"]',
		);
		if (
			(e.detail > 0 || target) &&
			!target?.matches(':disabled,[aria-disabled="true"]') &&
			target?.id !== "effect-preview"
		)
			void sound();
	});
	for (const name of ["visibilitychange", "roxy:focus"])
		scope.on(name === "visibilitychange" ? document : window, name, () => {
			clear();
			if (suppressed()) for (const source of sources) source.stop();
		});
	scope.on(reduced, "change", clear);
	scope.on(touch, "change", sync);
	scope.on(window, "roxy:reset-group", (e: CustomEvent) => {
		if (["effects", "all"].includes(e.detail)) {
			prefs = normalizeEffects({}, touch.matches);
			save();
			clear();
			sync();
		}
	});
	sync();
});
