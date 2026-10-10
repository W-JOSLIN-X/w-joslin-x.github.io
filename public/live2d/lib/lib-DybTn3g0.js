//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, c = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, l = (n, r, a) => (a = n == null ? {} : e(i(n)), c(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n)), u = (function(e) {
	if (e == null) return h;
	if (typeof e == "function") return m(e);
	if (typeof e == "object") return Array.isArray(e) ? d(e) : f(e);
	if (typeof e == "string") return p(e);
	throw Error("Expected function, string, or object as test");
});
function d(e) {
	let t = [], n = -1;
	for (; ++n < e.length;) t[n] = u(e[n]);
	return m(r);
	function r(...e) {
		let n = -1;
		for (; ++n < t.length;) if (t[n].apply(this, e)) return !0;
		return !1;
	}
}
function f(e) {
	let t = e;
	return m(n);
	function n(n) {
		let r = n, i;
		for (i in e) if (r[i] !== t[i]) return !1;
		return !0;
	}
}
function p(e) {
	return m(t);
	function t(t) {
		return t && t.type === e;
	}
}
function m(e) {
	return t;
	function t(t, n, r) {
		return !!(g(t) && e.call(this, t, typeof n == "number" ? n : void 0, r || void 0));
	}
}
function h() {
	return !0;
}
function g(e) {
	return typeof e == "object" && !!e && "type" in e;
}
//#endregion
//#region node_modules/.pnpm/unist-util-visit-parents@6.0.2/node_modules/unist-util-visit-parents/lib/color.js
function _(e) {
	return e;
}
//#endregion
//#region node_modules/.pnpm/unist-util-visit-parents@6.0.2/node_modules/unist-util-visit-parents/lib/index.js
var v = [], y = "skip";
function b(e, t, n, r) {
	let i;
	typeof t == "function" && typeof n != "function" ? (r = n, n = t) : i = t;
	let a = u(i), o = r ? -1 : 1;
	s(e, void 0, [])();
	function s(e, i, c) {
		let l = e && typeof e == "object" ? e : {};
		if (typeof l.type == "string") {
			let t = typeof l.tagName == "string" ? l.tagName : typeof l.name == "string" ? l.name : void 0;
			Object.defineProperty(u, "name", { value: "node (" + _(e.type + (t ? "<" + t + ">" : "")) + ")" });
		}
		return u;
		function u() {
			let l = v, u, d, f;
			if ((!t || a(e, i, c[c.length - 1] || void 0)) && (l = x(n(e, c)), l[0] === !1)) return l;
			if ("children" in e && e.children) {
				let t = e;
				if (t.children && l[0] !== "skip") for (d = (r ? t.children.length : -1) + o, f = c.concat(t); d > -1 && d < t.children.length;) {
					let e = t.children[d];
					if (u = s(e, d, f)(), u[0] === !1) return u;
					d = typeof u[1] == "number" ? u[1] : d + o;
				}
			}
			return l;
		}
	}
}
function x(e) {
	return Array.isArray(e) ? e : typeof e == "number" ? [!0, e] : e == null ? v : [e];
}
//#endregion
export { s as a, o as i, b as n, l as o, u as r, y as t };
