import { pageFeature } from "./core/page-scope";
import { decorationState } from "../utils/roxy-motion.mjs";
pageFeature((scope) => {
	const root = document.documentElement,
		hero = document.querySelector<HTMLElement>(".hero")!;
	const reduced = matchMedia("(prefers-reduced-motion:reduce)"),
		mobile = matchMedia("(max-width:700px)");
	const canvas = document.createElement("canvas");
	canvas.className = "background-atmosphere";
	canvas.setAttribute("aria-hidden", "true");
	const context = canvas.getContext("2d");
	if (!context) return;
	let frame = 0,
		last = 0,
		clock = 0,
		w = 0,
		h = 0;
	let particles: {
		x: number;
		y: number;
		size: number;
		phase: number;
		speed: number;
	}[] = [];
	const state = () =>
		decorationState({
			hidden: document.hidden,
			focus: root.dataset.focus === "true",
			saver: !!document.querySelector("#screensaver[open]"),
			reduced: reduced.matches,
			mode: root.dataset.mode,
			atmosphere: root.dataset.atmosphere || "none",
			edge: root.dataset.edge || "soft",
		});
	function resize() {
		const banner = root.dataset.mode === "banner";
		(banner ? hero : document.body).append(canvas);
		canvas.classList.toggle("in-banner", banner);
		w = banner ? hero.clientWidth : innerWidth;
		h = banner ? hero.clientHeight : innerHeight;
		const ratio = Math.min(devicePixelRatio || 1, 1.5);
		canvas.width = Math.round(w * ratio);
		canvas.height = Math.round(h * ratio);
		context!.setTransform(ratio, 0, 0, ratio, 0, 0);
		const count =
			root.dataset.atmosphere === "ribbons"
				? mobile.matches
					? 2
					: 4
				: mobile.matches
					? 10
					: 26;
		particles = Array.from({ length: count }, () => ({
			x: Math.random() * w,
			y: Math.random() * h,
			size: 2 + Math.random() * 4,
			phase: Math.random() * Math.PI * 2,
			speed: 7 + Math.random() * 9,
		}));
	}
	function draw(time: number) {
		frame = 0;
		if (!state().atmosphere) return;
		if (time - last >= 1000 / 30) {
			const dt = Math.min(0.1, (time - last) / 1000 || 0);
			last = time;
			clock += dt;
			context!.clearRect(0, 0, w, h);
			const kind = root.dataset.atmosphere;
			particles.forEach((p, i) => {
				context!.save();
				if (kind === "ribbons") {
					context!.globalAlpha = 0.12;
					context!.strokeStyle = `hsl(${230 + i * 35} 65% 65%)`;
					context!.lineWidth = 10 + p.size;
					const y = (h * (i + 1)) / (particles.length + 1),
						drift = Math.sin(clock * 0.12 + p.phase) * h * 0.12;
					context!.beginPath();
					context!.moveTo(-20, y + drift);
					context!.bezierCurveTo(
						w * 0.3,
						y - h * 0.3 - drift,
						w * 0.65,
						y + h * 0.3 + drift,
						w + 20,
						y - drift,
					);
					context!.stroke();
				} else {
					p.y = (p.y + dt * p.speed) % (h + 20);
					p.x = (p.x + dt * 3 + w) % w;
					context!.translate(
						p.x + Math.sin(clock * 0.5 + p.phase) * 14,
						p.y - 10,
					);
					if (kind === "sakura") {
						context!.rotate(p.phase + clock * 0.3);
						context!.fillStyle = "#f4b5cd";
						context!.globalAlpha = 0.5;
						context!.beginPath();
						context!.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
						context!.fill();
					} else {
						context!.fillStyle = "#fff4c4";
						context!.globalAlpha =
							0.2 + Math.abs(Math.sin(clock * 0.4 + p.phase)) * 0.35;
						context!.beginPath();
						context!.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
						context!.fill();
					}
				}
				context!.restore();
			});
		}
		frame = requestAnimationFrame(draw);
	}
	function sync() {
		cancelAnimationFrame(frame);
		frame = 0;
		last = performance.now();
		const enabled = state();
		root.dataset.edgeRunning = String(enabled.edge);
		canvas.hidden = !enabled.atmosphere;
		context!.clearRect(0, 0, w, h);
		if (enabled.atmosphere) {
			resize();
			frame = requestAnimationFrame(draw);
		}
	}
	const observer = new MutationObserver(sync);
	observer.observe(root, {
		attributes: true,
		attributeFilter: [
			"data-mode",
			"data-edge",
			"data-atmosphere",
			"data-focus",
		],
	});
	scope.on(document, "visibilitychange", sync);
	scope.on(window, "roxy:focus", sync);
	scope.on(window, "resize", sync);
	scope.on(reduced, "change", sync);
	scope.defer(() => {
		observer.disconnect();
		cancelAnimationFrame(frame);
		canvas.remove();
	});
	sync();
});
