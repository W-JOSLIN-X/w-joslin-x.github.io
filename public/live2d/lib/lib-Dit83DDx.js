import { n as e } from "./lib-DybTn3g0.js";
//#region node_modules/.pnpm/devlop@1.1.0/node_modules/devlop/lib/default.js
function t() {}
//#endregion
//#region node_modules/.pnpm/unist-util-visit@5.1.0/node_modules/unist-util-visit/lib/index.js
function n(t, n, r, i) {
	let a, o, s;
	typeof n == "function" && typeof r != "function" ? (o = void 0, s = n, a = r) : (o = n, s = r, a = i), e(t, o, c, a);
	function c(e, t) {
		let n = t[t.length - 1], r = n ? n.children.indexOf(e) : void 0;
		return s(e, r, n);
	}
}
//#endregion
export { t as n, n as t };
