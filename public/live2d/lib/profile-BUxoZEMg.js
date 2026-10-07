//#region src/character.ts
var e, t = 0, n = 0, r;
function i(t) {
	let n = new URL(t, document.baseURI).href;
	return e && e.url !== n ? Promise.reject(/* @__PURE__ */ Error("Only one Cubism Core version can be used on this page.")) : (e ||= {
		url: n,
		ready: new Promise((t, r) => {
			let i = document.createElement("script");
			i.src = n, i.onload = () => t(), i.onerror = () => {
				i.remove(), e = void 0, r(/* @__PURE__ */ Error(`Core failed to load: ${n}`));
			}, document.head.append(i);
		})
	}, e.ready);
}
function a() {
	!t && !n && r?.releaseContexts();
}
function o(e) {
	let { canvas: o } = e, s = o.getContext("webgl2", {
		alpha: !0,
		premultipliedAlpha: !0
	}) ?? o.getContext("webgl", {
		alpha: !0,
		premultipliedAlpha: !0
	});
	if (!s) throw Error("This browser cannot create a WebGL context.");
	t++;
	let c = new EventTarget(), l = (e, t) => c.dispatchEvent(new CustomEvent(e, { detail: t })), u = /* @__PURE__ */ new Set(), d, f, p = Promise.resolve(), m = !1, h = !1, g = 0, _ = 0, v = 0;
	function y() {
		!g && d && !m && !u.size && (!h || d.activeMotion) && (g = requestAnimationFrame(b));
	}
	function b(t) {
		if (g = 0, !(!d || m || u.size)) {
			if (t - _ >= 1e3 / (e.fps ?? 30)) {
				let e = _ ? Math.min((t - _) / 1e3, .1) : 0;
				_ = t, d.update(e, !h), d.draw();
			}
			y();
		}
	}
	function x() {
		cancelAnimationFrame(g), g = 0, _ = 0;
	}
	function S() {
		let t = o.getBoundingClientRect(), n = Math.min(devicePixelRatio, e.maxDpr ?? 1.5), r = Math.max(1, Math.round(t.width * n)), i = Math.max(1, Math.round(t.height * n));
		(o.width !== r || o.height !== i) && (o.width = r, o.height = i), d && !u.size && d.draw();
	}
	function C(t) {
		if (m) return Promise.reject(/* @__PURE__ */ Error("Character has been destroyed."));
		let o = ++v;
		f?.abort(), x(), d?.release(), d = void 0;
		let c = new AbortController();
		f = c;
		let u = p.then(async () => {
			c.signal.throwIfAborted(), n++;
			let u;
			try {
				await i(e.coreUrl), c.signal.throwIfAborted(), r = await import("./cubism-BGc0hpvr.js"), r.initializeFramework(), S(), u = new r.CubismActor(s, t, c.signal, l), await u.initialize(e.shaderUrl), c.signal.throwIfAborted(), d = u, d.draw(), l("ready", d.capabilities), y();
			} catch (e) {
				throw u?.release(), !c.signal.aborted && o === v && l("error", e), e;
			} finally {
				n--, a();
			}
		});
		return p = u.catch(() => {}), u;
	}
	async function w(e) {
		if (!d || m || u.size) return !1;
		let t = d;
		try {
			let n = await t.play(e);
			return y(), n;
		} catch (e) {
			if (t !== d || m) return !1;
			throw e;
		}
	}
	let T = {
		ready: C(e.model),
		events: c,
		get capabilities() {
			return d?.capabilities;
		},
		loadModel: C,
		playMotion: w,
		playAction(e) {
			let t = d?.config.actions;
			return !t || !Object.hasOwn(t, e) ? Promise.reject(/* @__PURE__ */ Error(`Action not configured: ${e}`)) : w(t[e]);
		},
		async setExpression(e) {
			let t = d;
			if (!t) throw Error("No model is loaded.");
			try {
				if (await t.setExpression(e, h), t !== d || m) return;
				t.update(0, !h), u.size || t.draw(), y();
			} catch (e) {
				if (t === d && !m) throw e;
			}
		},
		lookAt(e, t) {
			!h && !u.size && d?.setDragging(Math.max(-1, Math.min(1, e)), Math.max(-1, Math.min(1, t)));
		},
		hitTest(e, t) {
			return !u.size && !!d?.hit(e, t, !!d.config.tapHitArea);
		},
		tap(e, t) {
			return T.hitTest(e, t) ? (l("hit", {
				area: d?.config.tapHitArea,
				x: e,
				y: t
			}), d?.config.actions.tap ? T.playAction("tap") : (l("unavailable", {
				action: "tap",
				reason: "No tap action configured"
			}), Promise.resolve(!1))) : Promise.resolve(!1);
		},
		containsPoint(e, t) {
			return !u.size && !!d?.hit(e, t, !1);
		},
		getVisibleBounds() {
			return d?.visibleBounds();
		},
		pause(e) {
			u.add(e), x();
		},
		resume(e) {
			u.delete(e), y();
		},
		setReducedMotion(e) {
			h = e, e ? (d?.stop(), x(), d?.draw()) : y();
		},
		resize: S,
		destroy() {
			m || (m = !0, ++v, f?.abort(), x(), d?.release(), d = void 0, o.removeEventListener("webglcontextlost", E), t--, a());
		}
	};
	function E(e) {
		e.preventDefault(), T.pause("context-lost"), l("error", /* @__PURE__ */ Error("WebGL context lost. Recreate the character to retry."));
	}
	return o.addEventListener("webglcontextlost", E), T;
}
//#endregion
//#region src/profile.ts
async function s(e, t) {
	let n = new URL(e, document.baseURI), r = await fetch(n, { signal: t });
	if (!r.ok) throw Error(`Profile ${r.status}: ${n.pathname}`);
	let i = await r.json();
	if (typeof i?.url != "string" || !i.actions || typeof i.actions != "object" || Array.isArray(i.actions)) throw Error(`Invalid model profile: ${n.pathname}`);
	let a = new URL(i.url, n);
	if (!["http:", "https:"].includes(a.protocol)) throw Error(`Unsupported model URL: ${a.protocol}`);
	return {
		...i,
		url: a.href
	};
}
async function c(e) {
	let t = new URL(e, document.baseURI), n = await fetch(t);
	if (!n.ok) throw Error(`Character catalog ${n.status}`);
	let r = await n.json(), i = /* @__PURE__ */ new Set();
	if (!Array.isArray(r.models) || !r.models.length) throw Error("Empty character catalog.");
	let a = r.models.map(({ id: e, name: n }) => {
		if (typeof e != "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(e) || i.has(e) || typeof n != "string" || !n.trim()) throw Error(`Invalid catalog entry: ${e}`);
		return i.add(e), {
			id: e,
			name: n,
			url: new URL(`profiles/${e}.json`, t).href
		};
	});
	if (!i.has(r.model)) throw Error(`Default character is not in catalog: ${r.model}`);
	return {
		model: r.model,
		models: a
	};
}
//#endregion
export { s as n, o as r, c as t };
