//#region src/chat-character.ts
function e(e, t, n = {}, r = {}) {
	let i = new AbortController(), a = { signal: i.signal }, o = e.addMenuAction("chat", r.label || "问问大肥鱼", () => t.open()), s = () => t.setAnchor(e.getAnchor());
	return e.events.addEventListener("anchorchange", s, a), t.events.addEventListener("statechange", (t) => {
		if (matchMedia("(prefers-reduced-motion: reduce)").matches || !e.getAnchor()) return;
		let r = n[t.detail.status], i = e.character, a = i?.capabilities?.motions.find((e) => e.group === r?.group);
		r && a && (r.index ?? 0) >= 0 && (r.index ?? 0) < a.count && i.playMotion(r).catch(() => {});
	}, a), s(), () => {
		i.abort(), o(), t.setAnchor(null);
	};
}
//#endregion
export { e as connectCharacterChat };
