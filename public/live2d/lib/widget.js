import { n as e, r as t, t as n } from "./profile-BUxoZEMg.js";
//#region src/widget-style.ts
var r = "\n:host{all:initial;position:fixed;display:block;z-index:var(--live2d-z-index,40);pointer-events:none;font:14px/1.5 var(--live2d-font,system-ui,sans-serif);color:var(--live2d-text,light-dark(#342a46,#f0eaf8));color-scheme:var(--live2d-color-scheme,light dark);--accent:var(--live2d-accent,light-dark(#8261b5,#bb9de5));--surface:var(--live2d-surface,light-dark(#fcf9ff,#282332));--muted:var(--live2d-muted,light-dark(#70617f,#bfb1ce));--line:var(--live2d-border,color-mix(in srgb,var(--accent) 24%,var(--surface)));--shadow:var(--live2d-shadow,0 12px 36px #21133224,0 2px 6px #21133212)}\n*{box-sizing:border-box}[hidden]{display:none!important}\ncanvas{width:100%;height:100%;display:block;pointer-events:none;touch-action:none;cursor:grab}canvas:active{cursor:grabbing}\n:where(button,select,input,summary):focus-visible{outline:2px solid var(--accent);outline-offset:3px}\ncanvas:focus{outline:none}\n#character-focus{display:none;position:absolute;pointer-events:none;border:2px solid var(--accent);border-radius:2px}\ncanvas:focus-visible:not([hidden]) + #character-focus{display:block}\nbutton,select,input{font:inherit;color:inherit}button,select,summary{cursor:pointer}\nbutton{border:1px solid var(--line);border-radius:12px;padding:8px 12px;background:color-mix(in srgb,var(--accent) 9%,var(--surface));pointer-events:auto;transition:background 150ms,border-color 150ms}\nbutton:hover{background:color-mix(in srgb,var(--accent) 18%,var(--surface));border-color:var(--accent)}\nbutton:disabled,select:disabled{opacity:.6;cursor:wait}\n.bubble{position:fixed;width:232px;max-width:calc(100vw - 16px);border:1px solid var(--line);border-radius:20px;background:color-mix(in srgb,var(--surface) 96%,transparent);box-shadow:var(--shadow);backdrop-filter:blur(12px);pointer-events:auto;animation:appear 150ms ease-out}\n.bubble::after{content:\"\";position:absolute;width:12px;height:12px;left:calc(var(--tail,50%) - 6px);bottom:-7px;background:var(--surface);border-right:1px solid var(--line);border-bottom:1px solid var(--line);transform:rotate(45deg);pointer-events:none}\n.bubble[data-side=\"below\"]::after{top:-7px;bottom:auto;transform:rotate(225deg)}\n.content{padding:16px;max-height:calc(100vh - 18px);overflow:auto;overscroll-behavior:contain;border-radius:inherit}\n.heading{display:flex;align-items:center;gap:8px;margin:0 0 15px;font-size:15px;font-weight:650;letter-spacing:.03em}.spark{color:var(--accent);font-size:19px;font-weight:400}\nlabel{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;color:var(--muted);margin:0 0 7px}\n.select-wrap{position:relative;margin-bottom:17px}.select-wrap::after{content:\"\";position:absolute;right:14px;top:15px;width:7px;height:7px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg);pointer-events:none;color:var(--muted)}\nselect{appearance:none;display:block;width:100%;min-height:40px;padding:8px 32px 8px 12px;border:1px solid var(--line);border-radius:12px;background:color-mix(in srgb,var(--accent) 6%,var(--surface));text-overflow:ellipsis;transition:border-color 150ms}\nselect:hover{border-color:var(--accent)}option{background:var(--surface);color:inherit}\noutput{font-size:12px;font-variant-numeric:tabular-nums;color:inherit;border:1px solid var(--line);border-radius:8px;padding:2px 7px;background:color-mix(in srgb,var(--accent) 8%,var(--surface))}\ninput[type=range]{appearance:none;width:100%;height:24px;margin:0;background:transparent;cursor:pointer;accent-color:var(--accent)}\ninput::-webkit-slider-runnable-track{height:5px;border-radius:5px;background:linear-gradient(to right,var(--accent) var(--fill,50%),var(--line) var(--fill,50%))}\ninput::-webkit-slider-thumb{appearance:none;width:17px;height:17px;margin-top:-6px;border:3px solid var(--surface);border-radius:50%;background:var(--accent);box-shadow:0 0 0 1px var(--line),0 2px 5px #21133230}\ninput::-moz-range-track{height:5px;border-radius:5px;background:var(--line)}input::-moz-range-progress{height:5px;border-radius:5px;background:var(--accent)}input::-moz-range-thumb{width:11px;height:11px;border:3px solid var(--surface);border-radius:50%;background:var(--accent)}\n.range-ends{display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-top:1px}\n.note{color:var(--muted);font-size:12px;margin:12px 0 0;padding-top:10px;border-top:1px solid var(--line)}\n#loading{width:auto;max-width:232px}.loading-text{display:flex;align-items:center;gap:9px;margin:0;font-size:13px}.dot{width:7px;height:7px;flex:none;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 12%,transparent)}\n#error p{margin:0 0 12px;font-size:13px}#error .heading{margin-bottom:8px}.actions{display:flex;flex-wrap:wrap;gap:7px}.actions button{font-size:12px;padding:7px 9px}#retry{background:color-mix(in srgb,var(--accent) 20%,var(--surface));border-color:var(--accent)}\ndetails{font-size:11px;color:var(--muted);margin-top:12px}summary{width:fit-content}#error-detail{margin-top:8px;overflow-wrap:anywhere;white-space:pre-wrap}\n#restore{position:fixed;display:flex;align-items:center;gap:7px;min-height:34px;padding:6px 12px;border-radius:16px;background:var(--surface);box-shadow:var(--shadow)}\n#restore[data-edge=left]{border-radius:0 16px 16px 0}#restore[data-edge=right]{border-radius:16px 0 0 16px}#restore[data-edge=top]{border-radius:0 0 16px 16px}#restore[data-edge=bottom]{border-radius:16px 16px 0 0}\n#restore::before{content:\"✦\";color:var(--accent);font-size:15px}\n@keyframes appear{from{opacity:0;translate:0 3px}to{opacity:1;translate:0 0}}\n@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}\n";
//#endregion
//#region src/widget.ts
function i(n) {
	if (!n.model && !n.modelId) throw Error("Provide a model or a catalog modelId.");
	let i = new EventTarget(), a = document.createElement("div");
	a.dataset.live2dWidget = "", a.dataset.noEffects = "";
	let o = a.attachShadow({ mode: "open" });
	o.innerHTML = `<style>${r}</style>
  <canvas tabindex="0" role="button" aria-label="角色：回车互动，方向键移动，Shift+F10 打开角色设置，Escape 收起"></canvas>
  <div id="character-focus" aria-hidden="true"></div>
  <div id="size" class="bubble" role="dialog" aria-label="角色设置" hidden><div class="content">
    <div class="heading"><span class="spark" aria-hidden="true">✦</span>角色设置</div>
    <div id="choices"><label for="model-choice">当前角色</label><div class="select-wrap"><select id="model-choice"><option value="" hidden>自定义角色</option></select></div></div>
    <label for="scale">人物大小<output>100%</output></label><input id="scale" type="range" min="50" max="150" step="5" value="100" /><div class="range-ends" aria-hidden="true"><span>50%</span><span>150%</span></div>
    <p id="busy-note" class="note" role="status" hidden>正在加载角色…</p>
  </div></div>
  <div id="loading" class="bubble" role="status" hidden><div class="content"><p class="loading-text"><span class="dot" aria-hidden="true"></span>正在加载角色…</p></div></div>
  <button id="restore" aria-label="显示角色" hidden>角色</button>
  <div id="error" class="bubble" hidden><div class="content"><div class="heading">暂时无法显示角色</div><p role="status">可以重试，或选择另一个角色。</p><div class="actions"><button id="retry">重试</button><button id="choose">选择其他角色</button><button id="dismiss">隐藏</button></div><details><summary>诊断信息</summary><div id="error-detail"></div></details></div></div>`, n.mount.append(a);
	let s = o.querySelector("canvas"), c = o.querySelector("#character-focus"), l = o.querySelector("#size"), u = o.querySelector("#model-choice"), d = n.choices ?? [];
	for (let e of d) u.add(new Option(e.name, e.id));
	o.querySelector("#choices").hidden = !d.length, o.querySelector("#choose").hidden = !d.length;
	let f = n.modelId, p = 0, m = !0, h = o.querySelector("#scale"), g = o.querySelector("#restore"), _ = o.querySelector("#error"), v = o.querySelector("#loading"), y = new AbortController(), b = { signal: y.signal }, x = /* @__PURE__ */ new Set(), S = /* @__PURE__ */ new Set(), C = matchMedia("(prefers-reduced-motion: reduce)"), w = n.initialState?.hidden ?? !1, T = n.initialState?.scale ?? 1, E = n.initialState?.edge ?? "left", ee = n.width ?? 280, te = n.height ?? 420;
	L();
	let D = n.initialState?.position ?? {
		x: 16,
		y: innerHeight - a.offsetHeight - 16
	}, O, k = !1, A = 0, j = n.model, M = !1, N = {
		left: 0,
		top: 0,
		right: 1,
		bottom: 1
	}, P, F = 0, ne = 0, I;
	function L() {
		let e = Math.min(T, innerWidth / ee, innerHeight / te);
		a.style.width = `${ee * e}px`, a.style.height = `${te * e}px`, h.value = String(Math.round(T * 100)), h.style.setProperty("--fill", `${(T - .5) * 100}%`), o.querySelector("output").textContent = `${h.value}%`;
	}
	function R() {
		c.style.inset = `${N.top * 100}% ${(1 - N.right) * 100}% ${(1 - N.bottom) * 100}% ${N.left * 100}%`;
		let e = D.x, t = D.y, n = e + (N.left + N.right) * a.offsetWidth / 2, r = t + N.top * a.offsetHeight, i = t + N.bottom * a.offsetHeight;
		for (let e of [
			l,
			_,
			v
		]) {
			if (e.hidden) continue;
			let t = r - e.offsetHeight - 14, a = i + 14, o = t >= 8 || r > innerHeight - i ? "above" : "below", s = Math.max(8, Math.min(innerWidth - e.offsetWidth - 8, n - e.offsetWidth / 2));
			e.style.left = `${s}px`, e.style.top = `${Math.max(8, Math.min(innerHeight - e.offsetHeight - 8, o === "above" ? t : a))}px`, e.dataset.side = o, e.style.setProperty("--tail", `${Math.max(20, Math.min(e.offsetWidth - 20, n - s))}px`);
		}
		g.dataset.edge = E, g.style.left = `${E === "left" ? 0 : E === "right" ? Math.max(0, innerWidth - g.offsetWidth) : Math.max(0, Math.min(innerWidth - g.offsetWidth, e + a.offsetWidth / 2))}px`, g.style.top = `${E === "top" ? 0 : E === "bottom" ? Math.max(0, innerHeight - g.offsetHeight) : Math.max(0, Math.min(innerHeight - g.offsetHeight, t + a.offsetHeight / 2))}px`;
	}
	function re(e) {
		Z(), T = Math.max(.5, Math.min(1.5, e)), L(), Q();
	}
	function z() {
		Z(), l.hidden = !1, G(), (d.length && !m ? u : h).focus({ preventScroll: !0 });
	}
	function ie() {
		(M ? o.querySelector("#retry") : s).focus({ preventScroll: !0 });
	}
	function B(e = !0) {
		l.hidden = !0, G(), e && ie();
	}
	function V(e) {
		return j?.interactionRegions?.find(({ bounds: [t, n, r, i] }) => e.x >= t && e.x <= r && e.y >= n && e.y <= i);
	}
	function H(e, t) {
		let n = V(t), r = n?.actions[e];
		r ? (O?.events.dispatchEvent(new CustomEvent("hit", { detail: {
			area: n.id,
			gesture: e,
			...t
		} })), O?.playMotion(r).catch(K)) : e === "click" && O?.tap(t.x, t.y).catch(K);
	}
	function U() {
		clearTimeout(F), clearTimeout(ne), I = void 0;
	}
	function W(e, t) {
		D = {
			x: Math.max(-N.left * a.offsetWidth, Math.min(innerWidth - N.right * a.offsetWidth, e)),
			y: Math.max(-N.top * a.offsetHeight, Math.min(innerHeight - N.bottom * a.offsetHeight, t))
		}, a.style.left = `${D.x}px`, a.style.top = `${D.y}px`, R();
	}
	function G() {
		a.style.visibility = x.size ? "hidden" : "visible", s.hidden = w || M, (w || x.size) && (l.hidden = !0), m && o.activeElement === u && h.focus({ preventScroll: !0 }), u.disabled = m, u.value = f ?? "", o.querySelector("#busy-note").hidden = !m, v.hidden = !m || w || M || !l.hidden, a.setAttribute("aria-busy", String(m)), g.hidden = !w, _.hidden = w || !M || !l.hidden, R(), w ? O?.pause("hidden") : O?.resume("hidden");
	}
	function K(e) {
		if (k) return;
		let t = !!o.activeElement;
		M = !0, l.hidden = !0, Z(), s.style.pointerEvents = "none", _.querySelector("#error-detail").textContent = `角色加载失败：${e instanceof Error ? e.message : String(e)}`, O?.pause("failed"), G(), t && o.querySelector("#retry").focus({ preventScroll: !0 });
	}
	async function ae(e) {
		let r = ++A, a = p, c = !!o.activeElement?.closest("#error");
		O?.destroy(), O = void 0;
		let l = s.cloneNode(!1);
		s.replaceWith(l), s = l, M = !1, G(), c && s.focus({ preventScroll: !0 });
		try {
			O = t({
				...n,
				model: e,
				canvas: s
			});
			for (let e of [
				"ready",
				"error",
				"hit",
				"motionstart",
				"motionend",
				"expressionchange",
				"unavailable"
			]) O.events.addEventListener(e, (t) => {
				r === A && i.dispatchEvent(new CustomEvent(e, { detail: t.detail }));
			}, b);
			O.events.addEventListener("error", (e) => {
				r === A && K(e.detail);
			}, b), O.setReducedMotion(C.matches);
			for (let e of S) O.pause(e);
			if (G(), await O.ready, k || r !== A || a !== p) return;
			N = O.getVisibleBounds() ?? N, W(D.x, D.y), O.resize();
		} catch (e) {
			throw !k && r === A && a === p && K(e), e;
		}
	}
	async function oe(e) {
		if (j = e, Z(), !O || M) return ae(e);
		O.resume("failed"), G(), await O.loadModel(e), N = O.getVisibleBounds() ?? N, W(D.x, D.y);
	}
	async function q(t) {
		if (k) throw Error("Widget has been destroyed.");
		let n = d.find((e) => e.id === t);
		if (!n) throw Error(`Character is not in catalog: ${t}`);
		let r = ++p;
		f = t, m = !0, Z(), G();
		try {
			let a = await e(n.url, y.signal);
			if (k || r !== p) return;
			await oe(a), !k && r === p && i.dispatchEvent(new CustomEvent("modelchange", { detail: { id: t } }));
		} catch (e) {
			if (!k && r === p) throw K(e), e;
		} finally {
			!k && r === p && (m = !1, G());
		}
	}
	async function J(e) {
		if (k) throw Error("Widget has been destroyed.");
		let t = ++p;
		f = void 0, m = !0, G();
		try {
			await oe(e);
		} finally {
			!k && t === p && (m = !1, G());
		}
	}
	u.addEventListener("change", () => void q(u.value).catch(() => {}), b);
	function se() {
		w = !1, G(), Q(), ie();
	}
	function Y() {
		Z(), w = !0, G(), g.focus({ preventScroll: !0 });
	}
	function ce() {
		W(16, innerHeight - a.offsetHeight - 16);
	}
	function X(e) {
		let t = s.getBoundingClientRect();
		return {
			x: (e.clientX - t.left) / t.width * 2 - 1,
			y: 1 - (e.clientY - t.top) / t.height * 2
		};
	}
	function le() {
		if (!m) {
			if (!j?.actions.tap) {
				i.dispatchEvent(new CustomEvent("unavailable", { detail: {
					action: "tap",
					reason: "No tap action configured"
				} }));
				return;
			}
			O?.playAction("tap").catch(K);
		}
	}
	o.addEventListener("click", (e) => {
		let t = e.target.id;
		t === "dismiss" && Y(), t === "restore" && se(), t === "retry" && (f ? q(f) : J(j)).catch(() => {}), t === "choose" && z();
	}, b), h.addEventListener("input", () => re(Number(h.value) / 100), b), document.addEventListener("pointerdown", (e) => {
		!l.hidden && !e.composedPath().includes(l) && B(!1);
	}, b), o.addEventListener("focusin", (e) => {
		e.target !== s || w || M || (N = O?.getVisibleBounds() ?? N, R());
	}, b), o.addEventListener("focusout", (e) => {
		let t = e.relatedTarget;
		!l.hidden && t instanceof Node && !o.contains(t) && B(!1);
	}, b), o.addEventListener("contextmenu", (e) => {
		let t = e;
		if (t.target !== s || w || M) return;
		let n = X(t);
		O?.containsPoint(n.x, n.y) && (t.preventDefault(), z());
	}, b), o.addEventListener("pointerdown", (e) => {
		let t = e;
		if (t.target !== s || t.button !== 0 || t.pointerType !== "mouse") return;
		let n = X(t);
		if (w || m || M || S.size || !O?.containsPoint(n.x, n.y)) return;
		t.preventDefault(), s.focus({ preventScroll: !0 }), s.setPointerCapture(t.pointerId), N = O.getVisibleBounds() ?? N;
		let r = !!I && I.region === V(n)?.id && Math.hypot(I.point.x - n.x, I.point.y - n.y) < .15;
		I && !r && H("click", I.point), U(), P = {
			pointer: t.pointerId,
			x: t.clientX,
			y: t.clientY,
			origin: { ...D },
			moved: !1,
			held: !1,
			double: r,
			point: n
		}, F = window.setTimeout(() => {
			P && !P.moved && (P.held = !0, H("hold", P.point));
		}, 600), O.lookAt(0, 0);
	}, b), document.addEventListener("pointermove", (e) => {
		if (!(w || S.size || M || e.pointerType !== "mouse")) if (P) {
			let t = e.clientX - P.x, n = e.clientY - P.y;
			P.moved ||= Math.hypot(t, n) > 8, P.moved && (U(), W(P.origin.x + t, P.origin.y + n));
		} else {
			O?.lookAt(e.clientX / innerWidth * 2 - 1, 1 - e.clientY / innerHeight * 2);
			let t = X(e);
			s.style.pointerEvents = O?.containsPoint(t.x, t.y) ? "auto" : "none";
		}
	}, b), document.addEventListener("pointerup", (e) => {
		if (!P || e.pointerId !== P.pointer) return;
		clearTimeout(F);
		let t = P;
		if (t.moved) {
			N = O?.getVisibleBounds() ?? N, W(t.origin.x + e.clientX - t.x, t.origin.y + e.clientY - t.y);
			let n = [
				["left", D.x + N.left * a.offsetWidth],
				["right", innerWidth - D.x - N.right * a.offsetWidth],
				["top", D.y + N.top * a.offsetHeight],
				["bottom", innerHeight - D.y - N.bottom * a.offsetHeight]
			];
			n.sort((e, t) => e[1] - t[1]), n[0][1] <= 1 && (E = n[0][0], Y());
		} else t.held || (t.double ? H("doubleClick", t.point) : (I = {
			point: t.point,
			region: V(t.point)?.id
		}, ne = window.setTimeout(() => {
			let e = I;
			I = void 0, e && H("click", e.point);
		}, 250)));
		s.hasPointerCapture(e.pointerId) && s.releasePointerCapture(e.pointerId), P = void 0;
	}, b);
	function Z() {
		U(), P && s.hasPointerCapture(P.pointer) && s.releasePointerCapture(P.pointer), P = void 0, O?.lookAt(0, 0), s.style.pointerEvents = "none";
	}
	document.addEventListener("pointercancel", Z, b), document.documentElement.addEventListener("pointerleave", Z, b), window.addEventListener("blur", Z, b), o.addEventListener("keydown", (e) => {
		let t = e;
		if (t.key === "Escape" && !l.hidden) {
			t.preventDefault(), t.stopPropagation(), B();
			return;
		}
		if (t.target !== s) return;
		if (t.shiftKey && t.key === "F10" || t.key === "ContextMenu") {
			t.preventDefault(), z();
			return;
		}
		if (t.key === "Escape") {
			t.preventDefault(), Y();
			return;
		}
		(t.key === "Enter" || t.key === " ") && (t.preventDefault(), le());
		let n = {
			ArrowLeft: [-16, 0],
			ArrowRight: [16, 0],
			ArrowUp: [0, -16],
			ArrowDown: [0, 16]
		};
		if (n[t.key]) {
			t.preventDefault();
			let [e, r] = n[t.key];
			W(D.x + e, D.y + r);
		}
	}, b), C.addEventListener("change", () => O?.setReducedMotion(C.matches), b);
	function ue() {
		document.hidden ? (Z(), S.add("background"), O?.pause("background")) : (S.delete("background"), O?.resume("background"));
	}
	document.addEventListener("visibilitychange", ue, b), ue();
	function Q() {
		O?.resize(), s.hidden || (N = O?.getVisibleBounds() ?? N), W(D.x, D.y);
	}
	let $ = new ResizeObserver((e) => {
		e.some((e) => e.target === a) ? Q() : R();
	});
	$.observe(a);
	for (let e of [
		l,
		_,
		v
	]) $.observe(e);
	return window.addEventListener("resize", () => {
		Z(), L(), Q();
	}, b), W(D.x, D.y), {
		ready: f ? q(f) : J(n.model),
		events: i,
		element: a,
		get character() {
			return O;
		},
		show: se,
		hide: Y,
		setPosition: W,
		resetPosition: ce,
		setScale: re,
		getState: () => ({
			modelId: f,
			hidden: w,
			scale: T,
			edge: E,
			position: { ...D }
		}),
		selectModel: q,
		pause(e, t = !0) {
			S.add(e), t && x.add(e), Z(), O?.pause(e), G();
		},
		resume(e) {
			S.delete(e), x.delete(e), O?.resume(e), G();
		},
		loadModel: J,
		destroy() {
			k || (Z(), k = !0, ++A, ++p, y.abort(), $.disconnect(), O?.destroy(), a.remove());
		}
	};
}
async function a(e) {
	let t = new URL(e.base.replace(/\/?$/, "/"), document.baseURI), r = await n(new URL("character.json", t).href), a = e.initialState?.modelId ?? r.model;
	if (!r.models.find((e) => e.id === a)) throw Error(`Character is not in catalog: ${a}`);
	return i({
		...e,
		coreUrl: new URL("sdk/live2dcubismcore.min.js", t).href,
		shaderUrl: new URL("sdk/shaders/", t).href,
		modelId: a,
		choices: r.models
	});
}
//#endregion
export { i as createCharacterWidget, a as mountCharacter };
