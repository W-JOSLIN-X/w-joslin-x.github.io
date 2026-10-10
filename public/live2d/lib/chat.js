//#region src/chat/appearance.ts
var e = {
	parts: {
		frame: "maid",
		messages: "maid",
		composer: "maid",
		controls: "maid",
		ornaments: "maid"
	},
	palettes: {
		light: {
			accent: "#526aa8",
			base: "#f4f7fd"
		},
		dark: {
			accent: "#9bb0e1",
			base: "#0c193c"
		}
	},
	background: {
		id: "maid-palace",
		enabled: !0
	}
}, t = {
	maid: structuredClone(e),
	orca: n("orca", {
		accent: "#287b87",
		base: "#eef6f7"
	}, {
		accent: "#7cccd1",
		base: "#10272f"
	}, "orca-scene"),
	glass: n("glass", {
		accent: "#5869ac",
		base: "#f2f4fa"
	}, {
		accent: "#b6c3ef",
		base: "#202737"
	}, "none"),
	neu: n("neu", {
		accent: "#5d6e95",
		base: "#e8edf3"
	}, {
		accent: "#b3c3df",
		base: "#282f3a"
	}, "none")
};
function n(e, t, n, r) {
	return {
		parts: {
			frame: e,
			messages: e,
			composer: e,
			controls: e,
			ornaments: e === "maid" || e === "orca" ? e : "none"
		},
		palettes: {
			light: t,
			dark: n
		},
		background: {
			id: r,
			enabled: r !== "none"
		}
	};
}
function r(e) {
	if (!e.background.localName) return Object.keys(t).find((n) => {
		let r = t[n];
		return Object.keys(r.parts).every((t) => e.parts[t] === r.parts[t]) && ["light", "dark"].every((t) => ["accent", "base"].every((n) => e.palettes[t][n].toLowerCase() === r.palettes[t][n])) && e.background.id === r.background.id && e.background.enabled === r.background.enabled;
	});
}
function i(e, t) {
	let n = structuredClone(e);
	for (let [e, r] of Object.entries(t.parts || {})) {
		let t = e === "ornaments" ? [
			"maid",
			"orca",
			"none"
		] : [
			"maid",
			"orca",
			"glass",
			"neu"
		];
		if (!(e in n.parts) || !t.includes(r)) throw Error("未知皮肤部件");
		n.parts[e] = r;
	}
	for (let e of ["light", "dark"]) for (let r of ["accent", "base"]) {
		let i = t.palettes?.[e]?.[r];
		if (i !== void 0) {
			if (!/^#[\da-f]{6}$/i.test(i)) throw Error("配色需要六位十六进制颜色");
			n.palettes[e][r] = i;
		}
	}
	return t.background && Object.assign(n.background, t.background), n;
}
function a(e) {
	let t = e.match(/[\da-f]{2}/gi).map((e) => parseInt(e, 16) / 255).map((e) => e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4);
	return t[0] * .2126 + t[1] * .7152 + t[2] * .0722;
}
function o(e, t) {
	let n = a(e), r = a(t);
	return (Math.max(n, r) + .05) / (Math.min(n, r) + .05);
}
function s(e) {
	let t = o(e.base, "#172347") >= 4.5 ? "#172347" : o(e.base, "#ffffff") >= 4.5 ? "#ffffff" : "#000000";
	return {
		...e,
		ink: t,
		link: o(e.accent, e.base) >= 4.5 ? e.accent : t
	};
}
//#endregion
//#region src/chat/types.ts
var c = Object.freeze({
	images: 4,
	imageBytes: 5 * 1024 * 1024,
	text: 64e3,
	bodyBytes: 32 * 1024 * 1024,
	output: 4096,
	thinkingOutput: 8192,
	idleMs: 12e4,
	totalMs: 6e5
}), l = {
	baseUrl: "https://api.deepseek.com",
	model: "deepseek-flash",
	images: !0,
	thinking: !1,
	preset: "deepseek"
}, u = class extends Error {};
function d(e) {
	let t;
	try {
		t = new URL(e);
	} catch {
		throw new u("请输入有效的接口基础地址");
	}
	if (t.username || t.password || t.search || t.hash || t.protocol !== "https:" && !(t.protocol === "http:" && [
		"localhost",
		"127.0.0.1",
		"[::1]"
	].includes(t.hostname))) throw new u("接口需使用 HTTPS，本地调试允许 localhost HTTP；地址不能包含凭据、查询或片段");
	return t.href.replace(/\/+$/, "");
}
function f(e) {
	let t = {
		...e,
		baseUrl: d(e.baseUrl),
		model: e.model.trim()
	};
	if (!t.model) throw new u("请填写模型名称");
	if (t.preset === "deepseek" && t.baseUrl !== "https://api.deepseek.com") throw new u("DeepSeek 预设仅使用官方地址；其他地址请选择兼容接口");
	return t.preset !== "deepseek" && (t.thinking = !1), t;
}
var p = "你叫大肥鱼。";
function m(e, t, n, r) {
	if (e = f(e), !t.trim()) throw new u("请先在服务设置中填写 API Key");
	if (!r.text.trim() && !r.materials.length) throw new u("请输入问题或附上材料");
	let i = [...p].length, a = (t) => {
		let n = t.materials.filter((e) => e.kind === "image");
		if (n.length > c.images || n.some((e) => e.bytes > c.imageBytes)) throw new u("图片超过每条 4 张或每张 5 MiB 的限制");
		if (n.length && !e.images) throw new u("当前型号未声明支持图片，历史图片也不能静默删除；请选择图像型号或清空会话");
		let r = t.text + t.materials.filter((e) => e.kind !== "image").map((e) => `\n\n[用户附加材料：${e.kind}]\n标题：${e.title}\n来源：${e.source}\n${e.text}\n[材料结束]`).join("");
		return i += [...r].length, {
			role: "user",
			content: n.length ? [...r ? [{
				type: "text",
				text: r
			}] : [], ...n.map((e) => ({
				type: "image_url",
				image_url: { url: e.dataUrl }
			}))] : r
		};
	}, o = [{
		role: "system",
		content: p
	}];
	for (let e of n) o.push(a(e.input)), e.answer && (i += [...e.answer].length, o.push({
		role: "assistant",
		content: e.answer
	}));
	if (o.push(a(r)), i > c.text) throw new u("上下文超过 64000 字符，请缩减本轮材料或清空会话；历史不会自动裁剪");
	let s = JSON.stringify({
		model: e.model,
		messages: o,
		stream: !0,
		max_tokens: e.thinking ? c.thinkingOutput : c.output,
		...e.preset === "deepseek" ? { thinking: { type: e.thinking ? "enabled" : "disabled" } } : {}
	});
	if (new TextEncoder().encode(s).byteLength > c.bodyBytes) throw new u("请求包含历史图片，已超过 32 MiB；请减少材料或清空会话");
	return {
		service: e,
		key: t,
		body: s
	};
}
function h(e = fetch, t = {
	idleMs: c.idleMs,
	totalMs: c.totalMs
}) {
	return { async *stream(n, r) {
		let i = new AbortController(), a = !1, o = () => {
			a = !0, i.abort();
		}, s = () => i.abort();
		r.addEventListener("abort", s, { once: !0 }), r.aborted && i.abort();
		let c = setTimeout(o, t.idleMs), l = setTimeout(o, t.totalMs), d;
		try {
			let r = await e(`${n.service.baseUrl}/chat/completions`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${n.key}`,
					"Content-Type": "application/json"
				},
				body: n.body,
				signal: i.signal,
				redirect: "error",
				credentials: "omit",
				referrerPolicy: "no-referrer"
			});
			if (!r.ok) throw new u({
				401: "Key 无效或已过期",
				403: "服务拒绝访问，请检查权限",
				413: "服务拒绝了过大的请求",
				429: "服务限流或额度不足，请稍后手动重试"
			}[r.status] || `服务请求失败（HTTP ${r.status}）`);
			if (!r.body || !r.headers.get("content-type")?.includes("text/event-stream")) throw new u("接口未返回兼容的 SSE 流");
			d = r.body.getReader();
			let a = new TextDecoder(), s = "", l = [], f = "stop", p = (e) => {
				if (e.startsWith("data:")) return l.push(e.slice(5).replace(/^ /, "")), [];
				if (e || !l.length) return [];
				let t = l.join("\n");
				if (l = [], t === "[DONE]") return "end";
				let n;
				try {
					n = JSON.parse(t);
				} catch {
					throw new u("服务返回了无法解析的流数据");
				}
				if (n.error) throw new u("服务在生成期间返回错误");
				let r = n.choices?.[0];
				r?.finish_reason && (f = r.finish_reason);
				let i = [];
				return typeof r?.delta?.content == "string" && i.push({
					type: "text",
					text: r.delta.content
				}), typeof r?.delta?.reasoning_content == "string" && i.push({
					type: "reasoning",
					text: r.delta.reasoning_content
				}), i;
			};
			for (;;) {
				let e = await d.read();
				if (e.done) throw new u("连接提前结束；已保留收到的内容，可手动重试");
				clearTimeout(c), c = setTimeout(o, t.idleMs), s += a.decode(e.value, { stream: !0 });
				let n;
				for (; (n = s.indexOf("\n")) !== -1;) {
					let e = p(s.slice(0, n).replace(/\r$/, ""));
					if (s = s.slice(n + 1), e === "end") {
						yield {
							type: "done",
							reason: f
						};
						return;
					}
					yield* e;
				}
			}
		} catch (e) {
			throw a ? new u("请求超时；已保留收到的内容") : r.aborted ? r.reason : e instanceof u ? e : new u("连接失败，请检查网络、接口地址及浏览器跨域支持");
		} finally {
			clearTimeout(c), clearTimeout(l), r.removeEventListener("abort", s), await d?.cancel().catch(() => {}), i.abort();
		}
	} };
}
//#endregion
//#region src/chat/images.ts
async function g(e) {
	if (e.size > c.imageBytes) throw new u("单张图片不能超过 5 MiB；原图不会自动压缩");
	let t = new Uint8Array(await e.slice(0, 16).arrayBuffer()), n = t[0] === 137 && t[1] === 80 && t[2] === 78 && t[3] === 71 ? "image/png" : t[0] === 255 && t[1] === 216 && t[2] === 255 ? "image/jpeg" : String.fromCharCode(...t.slice(0, 4)) === "RIFF" && String.fromCharCode(...t.slice(8, 12)) === "WEBP" ? "image/webp" : "";
	if (!n || e.type && e.type !== n) throw new u("只支持实际内容为 PNG、JPEG 或 WebP 的图片");
	return n;
}
async function _(e) {
	let t = await g(e), n = URL.createObjectURL(e);
	try {
		let e = new Image();
		e.src = n, await e.decode();
	} catch {
		throw new u("图片无法解码，请重新选择");
	} finally {
		URL.revokeObjectURL(n);
	}
	let r = await new Promise((n, r) => {
		let i = new FileReader();
		i.onload = () => n(String(i.result)), i.onerror = () => r(new u("图片读取失败")), i.readAsDataURL(new Blob([e], { type: t }));
	});
	return {
		id: crypto.randomUUID(),
		kind: "image",
		title: e.name || "粘贴图片",
		bytes: e.size,
		dataUrl: r
	};
}
//#endregion
//#region src/chat/background.ts
var v = {
	async load(e) {
		let t = new Image();
		t.src = e, await t.decode();
	},
	create: (e) => URL.createObjectURL(e),
	revoke: (e) => URL.revokeObjectURL(e),
	validate: g
};
function y(e, t = v) {
	let n = 0, r = "", i = "", a = !1, o = /* @__PURE__ */ new Set(), s = (e) => {
		o.delete(e) && t.revoke(e);
	};
	return {
		async select(c) {
			let l = ++n, u = "", d = !1;
			try {
				if (typeof c == "string") u = c;
				else {
					if (await t.validate(c), a || n !== l) return !1;
					u = t.create(c), d = !0, o.add(u);
				}
				if (await t.load(u), a || n !== l) return d && s(u), !1;
				let f = r;
				return r = d ? u : "", i = u, e(u), f && s(f), !0;
			} catch (e) {
				if (d && u && s(u), a || n !== l) return !1;
				throw e;
			}
		},
		cancel() {
			++n;
		},
		clear() {
			++n;
			for (let e of o) s(e);
			return r = i = "", a || e(""), !a;
		},
		get current() {
			return i;
		},
		destroy() {
			a = !0, ++n;
			for (let e of o) s(e);
			r = i = "";
		}
	};
}
//#endregion
//#region \0chat-skin-assets
var b = {
	"dsh-neu-theme-LICENSE.txt": new URL("skins/dsh-neu-theme-LICENSE.txt", import.meta.url).href,
	"dsh-skin-glass-LICENSE.txt": new URL("skins/dsh-skin-glass-LICENSE.txt", import.meta.url).href,
	"maid-atelier-LICENSE-ARTWORK.txt": new URL("skins/maid-atelier-LICENSE-ARTWORK.txt", import.meta.url).href,
	"maid-atelier-LICENSE.txt": new URL("skins/maid-atelier-LICENSE.txt", import.meta.url).href,
	"maid-atelier-NOTICE.txt": new URL("skins/maid-atelier-NOTICE.txt", import.meta.url).href,
	"maid-bow.webp": new URL("skins/maid-bow.webp", import.meta.url).href,
	"maid-crest.webp": new URL("skins/maid-crest.webp", import.meta.url).href,
	"maid-day.webp": new URL("skins/maid-day.webp", import.meta.url).href,
	"maid-frame.webp": new URL("skins/maid-frame.webp", import.meta.url).href,
	"maid-lace.png": new URL("skins/maid-lace.png", import.meta.url).href,
	"maid-night.webp": new URL("skins/maid-night.webp", import.meta.url).href,
	"maid-ribbon-left-cap.webp": new URL("skins/maid-ribbon-left-cap.webp", import.meta.url).href,
	"maid-ribbon-left-fill.webp": new URL("skins/maid-ribbon-left-fill.webp", import.meta.url).href,
	"maid-ribbon-right-cap.webp": new URL("skins/maid-ribbon-right-cap.webp", import.meta.url).href,
	"maid-ribbon-right-fill.webp": new URL("skins/maid-ribbon-right-fill.webp", import.meta.url).href,
	"maid-top-trim.webp": new URL("skins/maid-top-trim.webp", import.meta.url).href,
	"orca-link-LICENSE-ARTWORK.txt": new URL("skins/orca-link-LICENSE-ARTWORK.txt", import.meta.url).href,
	"orca-link-LICENSE.txt": new URL("skins/orca-link-LICENSE.txt", import.meta.url).href,
	"orca-link-NOTICE.txt": new URL("skins/orca-link-NOTICE.txt", import.meta.url).href,
	"orca-scene.webp": new URL("skins/orca-scene.webp", import.meta.url).href,
	"SOURCES.md": new URL("skins/SOURCES.md", import.meta.url).href
}, x = [
	{
		id: "maid-palace",
		name: "女仆工坊 · 日景宫殿",
		thumbnail: b["maid-day.webp"],
		light: b["maid-day.webp"]
	},
	{
		id: "maid-palace-night",
		name: "女仆工坊 · 夜景宫殿",
		thumbnail: b["maid-night.webp"],
		light: b["maid-night.webp"]
	},
	{
		id: "orca-scene",
		name: "虎鲸链路 · 海潮",
		thumbnail: b["orca-scene.webp"],
		light: b["orca-scene.webp"]
	}
], S = {
	lace: b["maid-lace.png"],
	crest: b["maid-crest.webp"],
	frame: b["maid-frame.webp"],
	bow: b["maid-bow.webp"],
	trim: b["maid-top-trim.webp"],
	leftCap: b["maid-ribbon-left-cap.webp"],
	leftFill: b["maid-ribbon-left-fill.webp"],
	rightCap: b["maid-ribbon-right-cap.webp"],
	rightFill: b["maid-ribbon-right-fill.webp"]
}, C = {
	maid: "女仆工坊",
	orca: "虎鲸链路",
	glass: "毛玻璃",
	neu: "轻拟物",
	none: "无装饰"
}, w = "\n/* The original shell uses nine-slice borders. Artwork stays undistorted while\n   the ribbon fills span the remaining width. Half-size chrome fits the bubble. */\n#panel{--maid-plate:color-mix(in srgb,var(--chat-base) 88%,transparent);--maid-edge:#c5b383}\n#panel[data-frame=maid]{border:1px solid var(--maid-edge);border-radius:12px;box-shadow:0 18px 54px #0f1e4840,0 0 0 3px #e2cfaa55,inset 0 0 0 1px #fff9}\n[data-frame=maid]>header{background:linear-gradient(120deg,color-mix(in srgb,var(--chat-accent) 42%,#090f28),#0d1739);color:#ede5ce;border-bottom:1px solid var(--maid-edge);box-shadow:inset 0 2px #a9946244}\n[data-frame=maid] #handle{font-family:Georgia,\"Noto Serif SC\",serif;letter-spacing:2px}\n[data-frame=maid] #settings{border:1px solid var(--maid-edge);border-radius:10px;box-shadow:0 8px 28px #07112c44,inset 0 0 0 3px #c5b38322}\n[data-messages=maid] :is(.user,.answer,.turn>details,.material){border:1px solid #c5b38399;border-radius:14px;box-shadow:0 3px 10px #10204d14,inset 0 1px #fff6;background:color-mix(in srgb,var(--chat-base) 94%,transparent);backdrop-filter:blur(5px)}\n[data-messages=maid] .user{border-radius:14px 14px 3px 14px;border-left:3px solid var(--chat-accent)}\n[data-messages=maid] .answer{background:color-mix(in srgb,var(--chat-base) 88%,transparent)}\n[data-messages=maid] :is(.state,#status,#page-note){background:var(--maid-plate);backdrop-filter:blur(5px)}\n[data-composer=maid]>footer{margin:22px 18px 18px;border:0;border-radius:20px;background:transparent;box-shadow:none;--chrome-top:36px;--chrome-side:27px;--chrome-bottom:26px}\n[data-composer=maid]>footer::before{content:\"\";position:absolute;inset:-10px -7px -9px;z-index:1;border-style:solid;border-width:var(--chrome-top) var(--chrome-side) var(--chrome-bottom);border-image:var(--maid-frame) 170 120 115 120 / var(--chrome-top) var(--chrome-side) var(--chrome-bottom) var(--chrome-side) stretch;pointer-events:none}\n[data-composer=maid]>footer::after{content:\"\";position:absolute;inset:2px -4px -5px;z-index:-1;border-radius:20px;background:linear-gradient(180deg,color-mix(in srgb,var(--chat-base) 88%,transparent),color-mix(in srgb,var(--chat-base) 76%,transparent));backdrop-filter:blur(3px);box-shadow:0 8px 22px #10204d22,inset 0 1px #fff8;pointer-events:none}\n[data-scheme=dark][data-composer=maid]>footer::after{background:linear-gradient(180deg,color-mix(in srgb,var(--chat-base) 92%,transparent),color-mix(in srgb,var(--chat-base) 90%,transparent))}\n[data-composer=maid] #composer-content{padding:22px 8px 6px;border-radius:18px}\n[data-controls=maid] .icon-button{border:1px solid #c5b383aa;border-radius:50%;background:color-mix(in srgb,var(--chat-base) 85%,transparent);box-shadow:0 2px 5px #15255222,inset 0 0 0 2px #fff3;color:var(--chat-ink);transition:box-shadow .15s,background .15s}\n[data-controls=maid] .icon-button:hover{box-shadow:0 3px 8px #10204d33,inset 0 0 0 2px #fff5;border-color:var(--chat-accent)}\n[data-controls=maid] :is(#send,#stop){background:var(--chat-link);color:var(--chat-base);box-shadow:0 3px 9px #10204d44,inset 0 0 0 2px #fff3}\n[data-controls=maid] .icon-button[aria-pressed=true]{box-shadow:inset 0 0 0 2px var(--chat-accent),0 2px 5px #10204d22}\n[data-frame=maid][data-controls=maid]>header .icon-button{background:#ffffff0a;color:#eee6cd;border-color:#c5b38366;box-shadow:inset 0 0 0 1px #fff1}\n\n#ornaments{position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden;border-radius:inherit}\n#ornaments[data-skin=maid]{background:var(--maid-bow) center top/auto 20px no-repeat}\n#ornaments[data-skin=maid]:before{content:\"\";position:absolute;top:43px;left:0;right:0;height:22px;background:var(--maid-trim) repeat-x center bottom/auto 30px}\n#ornaments[data-skin=maid]:after{content:\"\";position:absolute;bottom:-4px;left:calc(50% - 28px);width:56px;height:28px;background:var(--maid-crest) center/contain no-repeat}\n/* Decorative choices own ribbons, bow and lace independently of the plate. */\n[data-ornaments=maid] #composer-content{padding-top:22px}\n[data-ornaments=maid] #composer-ornaments{display:block;position:absolute;inset:-10px -7px auto;height:36px;z-index:1;background-image:var(--maid-bow),var(--maid-leftCap),var(--maid-rightCap),var(--maid-leftFill),var(--maid-rightFill);background-position:center top,left 27px top,right 27px top,left 78px top,right 78px top;background-size:auto 34.5px,51px 16px,51px 16px,max(0px,calc(50% - 93px)) 16px,max(0px,calc(50% - 93px)) 16px;background-repeat:no-repeat}\n[data-ornaments=maid] #composer-ornaments span{position:absolute;left:27px;right:27px;top:15px;height:16.5px;background:var(--maid-lace) repeat-x center top/27px 16.5px;z-index:-1}\n#panel[data-fullscreen][data-composer=maid]>footer{--chrome-top:54px;--chrome-side:40.5px;--chrome-bottom:39px;margin-top:32px;margin-bottom:24px;width:min(960px,calc(100% - 48px))}\n[data-fullscreen][data-composer=maid] #composer-content{padding:30px 16px 12px}\n[data-fullscreen][data-ornaments=maid] #composer-content{padding-top:30px}\n[data-fullscreen][data-ornaments=maid] #composer-ornaments{inset:-10px -7px auto;height:52px;background-position:center top,left 40.5px top,right 40.5px top,left 117px top,right 117px top;background-size:auto 51.75px,76.5px 24px,76.5px 24px,max(0px,calc(50% - 139.5px)) 24px,max(0px,calc(50% - 139.5px)) 24px}\n[data-fullscreen][data-ornaments=maid] #composer-ornaments span{left:40.5px;right:40.5px;top:22.5px;height:24.75px;background-size:40.5px 24.75px}\n#ornaments[data-skin=orca]:before{content:\"\";position:absolute;inset:5px;border:1px solid var(--chat-accent);clip-path:polygon(0 0,25px 0,25px 2px,2px 2px,2px 25px,0 25px,0 0,100% 0,100% 25px,calc(100% - 2px) 25px,calc(100% - 2px) 2px,calc(100% - 25px) 2px,calc(100% - 25px) 0,100% 0,100% 100%,0 100%);opacity:.5}\n";
//#endregion
//#region src/chat/appearance-view.ts
function T(n, a, o) {
	let c = (e) => n.getElementById(e), l = c("panel"), u = i(e, a.appearance || {}), d = structuredClone(u), f = getComputedStyle(n.host).colorScheme === "dark" ? "dark" : "light", p = !1, m = !1, h = 0, g = [...x];
	for (let e of a.backgrounds || []) {
		let t = g.findIndex((t) => t.id === e.id);
		t >= 0 ? g[t] = e : g.push(e);
	}
	let _ = document.createElement("style");
	_.textContent = w, n.append(_);
	let v = y((e) => {
		c("wallpaper").style.backgroundImage = e ? `url(${JSON.stringify(e)})` : "none";
	}), b = (e) => {
		c("appearance-note").textContent = e;
	};
	for (let e of Object.keys(t)) {
		let n = document.createElement("button");
		n.type = "button", n.dataset.skinPreset = e, n.textContent = C[e], n.addEventListener("click", () => {
			j(t[e]);
		}, { signal: o }), c("skin-presets").append(n);
	}
	let T = /* @__PURE__ */ new Map();
	for (let [e, t] of Object.entries({
		frame: "窗口框架",
		messages: "消息样式",
		composer: "输入区",
		controls: "按钮与图标",
		ornaments: "装饰层"
	})) {
		let n = document.createElement("div");
		n.className = "appearance-row";
		let r = document.createElement("label");
		r.textContent = t;
		let i = document.createElement("select");
		i.setAttribute("aria-label", t), i.dataset.part = e;
		for (let t of e === "ornaments" ? [
			"maid",
			"orca",
			"none"
		] : [
			"maid",
			"orca",
			"glass",
			"neu"
		]) {
			let e = new Option(C[t], t);
			i.add(e);
		}
		i.addEventListener("change", () => {
			j({ parts: { [e]: i.value } });
		}, { signal: o });
		let a = document.createElement("span");
		a.className = "skin-preview", a.setAttribute("aria-hidden", "true"), a.textContent = "Aa", r.append(i), n.append(a, r), T.set(e, i);
		let s = document.createElement("button");
		s.type = "button", s.textContent = "恢复", s.title = `恢复${t}`, s.addEventListener("click", () => {
			j({ parts: { [e]: u.parts[e] } });
		}, { signal: o }), n.append(s), c("skin-parts").append(n);
	}
	let E = c("background-choice"), D = document.createElement("img");
	D.className = "background-thumbnail", D.alt = "当前仓库背景预览", D.loading = "lazy", E.parentElement.after(D), E.add(new Option("无背景", "none"));
	for (let e of g) E.add(new Option(e.name, e.id));
	let O = new Option("本地图片（临时）", "local");
	O.hidden = !0, E.add(O);
	function k() {
		let e = r(d);
		c("preset-name").textContent = e ? C[e] : "自定义组合";
		for (let t of c("skin-presets").querySelectorAll("button")) t.setAttribute("aria-pressed", String(t.dataset.skinPreset === e));
		let t = !!d.background.localName || d.background.id !== "none";
		c("background-toggle").disabled = !t;
		for (let [e, t] of Object.entries(d.parts)) l.dataset[e] = t, T.get(e).value = t, T.get(e).parentElement.previousElementSibling.dataset.skin = t;
		c("ornaments").dataset.skin = d.parts.ornaments;
		for (let [e, t] of Object.entries(S)) l.style.setProperty(`--maid-${e}`, `url(${JSON.stringify(t)})`);
		l.dataset.scheme = f;
		let n = s(d.palettes[f]);
		for (let [e, t] of Object.entries(n)) l.style.setProperty(`--chat-${e}`, t);
		l.style.colorScheme = f, c("wallpaper").hidden = !t || !d.background.enabled, c("background-toggle").setAttribute("aria-pressed", String(t && d.background.enabled)), E.value = d.background.localName ? "local" : d.background.id, O.hidden = !d.background.localName, D.hidden = !!d.background.localName || !t;
		let i = g.find((e) => e.id === d.background.id)?.thumbnail;
		i && D.getAttribute("src") !== i && (D.src = i), c("background-name").textContent = d.background.localName || g.find((e) => e.id === d.background.id)?.name || (d.background.id === "none" ? "无背景" : "背景不可用"), c("accent").value = n.accent, c("base-color").value = n.base, c("palette-mode").textContent = `${f === "dark" ? "暗色" : "亮色"}模式 · 主色与底色`, !m && Object.values(d.parts).some((e) => e !== "maid" && e !== "none") && (m = !0, import("./skin-variants-DFj5WNyd.js").then(({ variants: e }) => {
			p || (_.textContent += e);
		}).catch(() => {
			m = !1, b("其他风格加载失败，请再次选择");
		}));
	}
	async function A(e) {
		if (e === "none") return v.clear();
		let t = g.find((t) => t.id === e);
		if (!t) throw Error("背景编号不存在");
		return v.select(t.light);
	}
	async function j(e) {
		i(d, e);
		let t = e.background?.id === void 0 ? h : ++h;
		if (e.background?.id !== void 0) {
			try {
				if (!await A(e.background.id) || p || t !== h) return;
			} catch {
				if (p || t !== h) return;
				k(), b("背景加载失败，已保留之前的完整外观");
				return;
			}
			d.background.id = e.background.id, delete d.background.localName;
		}
		d = i(d, e), d.background.id === "none" && !d.background.localName && (d.background.enabled = !1), k(), b("");
	}
	let M = (e, t, n) => c(e).addEventListener(t, n, { signal: o });
	M("background-toggle", "click", () => {
		j({ background: { enabled: !d.background.enabled } });
	}), M("background-choice", "change", () => {
		E.value !== "local" && j({ background: {
			id: E.value,
			enabled: E.value !== "none"
		} });
	}), M("background-local", "click", () => c("background-file").click()), M("background-file", "change", async () => {
		let e = c("background-file"), t = e.files?.[0];
		if (e.value = "", !t) return;
		let n = ++h;
		try {
			await v.select(t) && !p && n === h && (d.background.localName = t.name, d.background.enabled = !0, k(), b("本地背景仅本次浏览有效，不上传"));
		} catch {
			if (p || n !== h) return;
			b("背景读取失败：请选择可解码的 PNG/JPEG/WebP，最大 5 MiB");
		}
	}), M("background-reset", "click", () => {
		j({ background: u.background });
	});
	for (let [e, t] of [["accent", "accent"], ["base-color", "base"]]) M(e, "input", () => {
		j({ palettes: { [f]: { [t]: c(e).value } } });
	});
	return M("palette-reset", "click", () => {
		j({ palettes: { [f]: u.palettes[f] } });
	}), c("sync-palette").hidden = !a.readHostPalette, M("sync-palette", "click", () => {
		try {
			j({ palettes: { [f]: a.readHostPalette() } }).catch(() => b("网站配色格式无效，需要六位十六进制颜色"));
		} catch {
			b("网站配色读取失败");
		}
	}), M("appearance-reset", "click", () => {
		j(u);
	}), k(), A(d.background.id).catch(() => b("默认背景加载失败，暂用纯色底；可在外观中重试")), {
		get: () => structuredClone(d),
		set: j,
		setScheme(e) {
			f !== e && (f = e, k());
		},
		destroy() {
			p = !0, v.destroy(), _.remove();
		}
	};
}
//#endregion
//#region src/chat/icons.ts
var E = {
	settings: "<path d=\"m9 3 1-1h4l1 3 3 1 3 1v4l-2 2 1 3-3 2-3-1-2 3-3-1-1-3-3-1v-4l3-1 1-3Z\"/><circle cx=\"12\" cy=\"11\" r=\"3\"/>",
	image: "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\"/><circle cx=\"8\" cy=\"8\" r=\"1.5\"/><path d=\"m3 17 5-5 4 4 4-6 5 7\"/>",
	wallpaper: "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 8h18 M8 8v13 M11 17l3-4 4 4 M16 11h.01\"/>",
	article: "<path d=\"M6 3h9l4 4v14H6Z M14 3v5h5 M9 12h7 M9 16h7\"/>",
	clear: "<path d=\"M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7\"/>",
	thinking: "<path d=\"M9 18H7a4 4 0 0 1-3-7 4 4 0 0 1 5-6 3 3 0 0 1 6 0 4 4 0 0 1 5 6 4 4 0 0 1-3 7h-2 M12 4v17 M8 9l4 3 4-3 M8 15l4-3 4 3\"/>",
	send: "<path d=\"m4 4 17 8-17 8 3-8Z M7 12h14\"/>",
	stop: "<rect x=\"5\" y=\"5\" width=\"14\" height=\"14\" rx=\"3\"/>",
	close: "<path d=\"m6 9 6 6 6-6\"/>",
	fullscreen: "<path class=\"expand-icon\" d=\"M8 3H3v5 M16 3h5v5 M21 16v5h-5 M3 16v5h5\"/><path class=\"contract-icon\" d=\"M3 8h5V3 M21 8h-5V3 M16 21v-5h5 M8 21v-5H3\"/>",
	retry: "<path d=\"M20 10a8 8 0 1 0-1 7 M20 3v7h-7\"/>",
	restore: "<path d=\"m9 4-6 6 6 6 M3 10h10a7 7 0 0 1 7 7v3\"/>",
	remove: "<path d=\"m6 6 12 12 M6 18 18 6\"/>",
	copy: "<rect x=\"8\" y=\"8\" width=\"12\" height=\"13\" rx=\"2\"/><path d=\"M16 8V3H3v13h5\"/>"
};
function D(e) {
	return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${E[e] || E.image}</svg>`;
}
function O(e, t, n) {
	e.innerHTML = D(t), e.title = n, e.setAttribute("aria-label", n), e.classList.add("icon-button");
}
//#endregion
//#region src/chat/geometry.ts
var k = {
	minWidth: 320,
	minHeight: 300,
	maxWidth: 760,
	maxHeight: 800,
	margin: 12
}, A = (e, t, n) => Math.max(t, Math.min(n, e));
function j(e, t) {
	let n = Math.min(k.margin, Math.max(0, (Math.min(t.width, t.height) - 1) / 2)), r = A(e.width, Math.min(k.minWidth, t.width - 2 * n), Math.min(k.maxWidth, t.width - 2 * n)), i = A(e.height, Math.min(k.minHeight, t.height - 2 * n), Math.min(k.maxHeight, t.height - 2 * n));
	return {
		width: r,
		height: i,
		x: A(e.x, n, t.width - r - n),
		y: A(e.y, n, t.height - i - n)
	};
}
function M(e, t, n) {
	let r = j(e, n), i = t.right + 14;
	return i + r.width > n.width - k.margin && (i = t.left - r.width - 14), j({
		...r,
		x: i,
		y: t.bottom - r.height
	}, n);
}
function N(e, t, n, r, i) {
	let a = j(e, i), o = Math.min(k.margin, Math.max(0, (Math.min(i.width, i.height) - 1) / 2)), s = Math.min(k.minWidth, i.width - 2 * o), c = Math.min(k.minHeight, i.height - 2 * o), { x: l, y: u, width: d, height: f } = a;
	return t.includes("w") && (d = A(a.width - n, s, Math.min(k.maxWidth, a.x + a.width - o)), l = a.x + a.width - d), t.includes("e") && (d = A(a.width + n, s, Math.min(k.maxWidth, i.width - a.x - o))), t.includes("n") && (f = A(a.height - r, c, Math.min(k.maxHeight, a.y + a.height - o)), u = a.y + a.height - f), t.includes("s") && (f = A(a.height + r, c, Math.min(k.maxHeight, i.height - a.y - o))), {
		x: l,
		y: u,
		width: d,
		height: f
	};
}
//#endregion
//#region src/chat/window.ts
function ee(e, t) {
	let n = () => ({
		width: innerWidth,
		height: innerHeight
	}), r = j({
		x: innerWidth - 450,
		y: innerHeight - 550,
		width: 420,
		height: 520
	}, n()), i = null, a = null, o = !1, s = !1;
	function c() {
		o || (r = i && !s ? a ? j({
			...r,
			x: i.left + a.x,
			y: i.top + a.y
		}, n()) : M(r, i, n()) : j(r, n()));
		let t = o ? {
			x: 0,
			y: 0,
			...n()
		} : r;
		Object.assign(e.style, {
			left: `${t.x}px`,
			top: `${t.y}px`,
			width: `${t.width}px`,
			height: `${t.height}px`
		}), e.toggleAttribute("data-fullscreen", o);
		for (let t of e.querySelectorAll("[data-edge]")) t.disabled = o;
		let c = e.querySelector("#fullscreen");
		c?.setAttribute("aria-pressed", String(o)), c?.setAttribute("aria-label", o ? "还原窗口" : "铺满页面"), c && (c.title = o ? "还原窗口" : "铺满页面");
	}
	function l() {
		i && (a = {
			x: r.x - i.left,
			y: r.y - i.top
		});
	}
	function u(e, a) {
		e.addEventListener("pointerdown", (u) => {
			if (u.button !== 0 || o || !a && i) return;
			u.preventDefault(), e.setPointerCapture(u.pointerId), s = !0;
			let d = { ...r }, f = u.clientX, p = u.clientY, m = (e) => {
				r = a ? N(d, a, e.clientX - f, e.clientY - p, n()) : j({
					...d,
					x: d.x + e.clientX - f,
					y: d.y + e.clientY - p
				}, n()), c();
			}, h = () => {
				s = !1, l(), e.removeEventListener("pointermove", m), e.removeEventListener("lostpointercapture", h);
			};
			e.addEventListener("pointermove", m, { signal: t }), e.addEventListener("lostpointercapture", h, {
				signal: t,
				once: !0
			});
		}, { signal: t }), e.addEventListener("keydown", (e) => {
			if (!e.key.startsWith("Arrow") || o || !a && i) return;
			e.preventDefault();
			let t = e.shiftKey ? 30 : 10, s = e.key === "ArrowRight" ? t : e.key === "ArrowLeft" ? -t : 0, u = e.key === "ArrowDown" ? t : e.key === "ArrowUp" ? -t : 0;
			r = a ? N(r, a, s, u, n()) : j({
				...r,
				x: r.x + s,
				y: r.y + u
			}, n()), l(), c();
		}, { signal: t });
	}
	return window.addEventListener("resize", c, { signal: t }), {
		layout: c,
		bind: u,
		get fullscreen() {
			return o;
		},
		toggleFullscreen() {
			o = !o, o || l(), c();
		},
		setAnchor(e) {
			!i && e && (a = null), i = e, c();
		}
	};
}
//#endregion
//#region src/chat/session.ts
var P = class extends EventTarget {
	provider;
	draft = {
		text: "",
		materials: []
	};
	turns = [];
	service = { ...l };
	key = "";
	active;
	destroyed = !1;
	constructor(e) {
		super(), this.provider = e;
	}
	get busy() {
		return !!this.active;
	}
	get configured() {
		return !!this.key;
	}
	changed() {
		this.dispatchEvent(new Event("change"));
	}
	configure(e, t, n = !1) {
		if (this.busy) throw new u("生成期间不能更换服务设置");
		let r = f(e);
		if (r.baseUrl !== this.service.baseUrl) {
			if (!n) throw new u("更换接口地址需要明确更换并清空");
			this.clear();
		}
		this.service = r, this.key = t, this.changed();
	}
	forgetKey() {
		this.stop(), this.key = "", this.changed();
	}
	attach(e) {
		e.kind === "article" && (this.draft.materials = this.draft.materials.filter((e) => e.kind !== "article")), this.draft.materials.push(structuredClone(e)), this.changed();
	}
	remove(e) {
		this.draft.materials = this.draft.materials.filter((t) => t.id !== e), this.changed();
	}
	async send(e = !1) {
		if (this.destroyed || this.busy) return;
		let t = this.turns.at(-1);
		if (e && (!t || !["failed", "stopped"].includes(t.status))) throw new u("只能重试最后一次失败或中断的请求");
		let n = structuredClone(e ? t.input : this.draft), r = e ? this.turns.slice(0, -1) : this.turns, i = m(this.service, this.key, r, n), a = {
			id: e ? t.id : crypto.randomUUID(),
			input: n,
			answer: "",
			reasoning: "",
			status: "generating"
		};
		e ? this.turns[this.turns.length - 1] = a : (this.turns.push(a), this.draft = {
			text: "",
			materials: []
		});
		let o = this.active = new AbortController();
		this.changed();
		try {
			let e = !1;
			for await (let t of this.provider.stream(i, o.signal)) {
				if (this.active !== o) return;
				if (t.type === "text" ? a.answer += t.text : t.type === "reasoning" ? a.reasoning += t.text : (a.status = t.reason === "length" ? "length" : "complete", e = !0), this.changed(), e) break;
			}
			if (!e && this.active === o) throw new u("连接提前结束；可手动重试");
		} catch (e) {
			if (this.active !== o) return;
			a.status = "failed", a.error = e instanceof u ? e.message : "生成失败；已保留内容，可手动重试";
		} finally {
			this.active === o && (this.active = void 0, this.changed());
		}
	}
	stop() {
		let e = this.active;
		if (this.active = void 0, e) {
			e.abort();
			let t = this.turns.at(-1);
			t?.status === "generating" && (t.status = "stopped"), this.changed();
		}
	}
	restoreFailed() {
		let e = this.turns.at(-1);
		if (this.busy || e?.status !== "failed" || e.answer) throw new u("只能取回最后一次尚未收到正文的失败问题");
		if (this.draft.text || this.draft.materials.length) throw new u("请先处理当前草稿，再取回失败的问题；现有草稿不会被覆盖");
		this.draft = structuredClone(e.input), this.turns.pop(), this.changed();
	}
	clear() {
		this.stop(), this.turns = [], this.draft = {
			text: "",
			materials: []
		}, this.changed();
	}
	destroy() {
		this.clear(), this.key = "", this.destroyed = !0;
	}
}, F = "portable-chat-services-v1", te = class {
	storage;
	memory = /* @__PURE__ */ new Map();
	constructor(e) {
		this.storage = e;
		try {
			let t = JSON.parse(e?.getItem(F) || "[]");
			if (Array.isArray(t)) for (let e of t) try {
				let t = f(e.service);
				typeof e.key == "string" && this.memory.set(t.baseUrl, {
					service: t,
					key: e.key,
					remember: !0
				});
			} catch {}
		} catch {}
	}
	get(e) {
		return this.memory.get(d(e));
	}
	get initial() {
		return [...this.memory.values()].at(-1);
	}
	save(e, t, n) {
		return e = f(e), this.memory.set(e.baseUrl, {
			service: { ...e },
			key: t,
			remember: n
		}), this.flush();
	}
	forget(e) {
		return this.memory.delete(d(e)), this.flush();
	}
	flush() {
		try {
			if (!this.storage) throw Error();
			let e = [...this.memory.values()].filter((e) => e.remember);
			return e.length ? this.storage.setItem(F, JSON.stringify(e)) : this.storage.removeItem(F), !0;
		} catch {
			for (let e of this.memory.values()) e.remember = !1;
			return !1;
		}
	}
}, ne = "<style>\n.contract-icon,#fullscreen[aria-pressed=true] .expand-icon{display:none}#fullscreen[aria-pressed=true] .contract-icon{display:block}\n#panel #composer-content{display:flex;flex-direction:column;min-height:0}#composer-content #materials{flex:0 1 auto;min-height:0}#composer-content :is(textarea,.toolbar){flex-shrink:0}\n@media(max-height:420px){#panel textarea{height:40px;min-height:32px}}\n:host{color-scheme:inherit;font:14px/1.6 system-ui,sans-serif;color:var(--chat-ink,#172347)}\n*{box-sizing:border-box}[hidden]{display:none!important}button,input,textarea,select{font:inherit}button{cursor:pointer;color:inherit;border:1px solid var(--line,#8884);border-radius:8px;padding:5px 10px;background:var(--surface,Canvas);min-height:32px}button:hover{border-color:var(--chat-accent);filter:brightness(.96)}button:disabled{opacity:.5;cursor:default}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--chat-link);outline-offset:2px}button[aria-pressed=true]{box-shadow:inset 0 -3px var(--chat-accent);border-color:var(--chat-accent)}svg{display:block;width:18px;height:18px;flex:none}.icon-button{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;min-width:32px;padding:6px}\n#launcher{position:fixed;right:24px;bottom:24px;z-index:210;background:Canvas;color:CanvasText;border-radius:24px;padding:10px 18px;box-shadow:0 4px 20px #0002}\n#panel{--surface:var(--chat-base);--line:color-mix(in srgb,var(--chat-ink) 22%,transparent);position:fixed;z-index:211;background:var(--chat-base);color:var(--chat-ink);display:flex;flex-direction:column;isolation:isolate;overflow:hidden;min-width:0}\n#wallpaper{position:absolute;inset:0;z-index:-1;background-size:cover;background-position:center;background-repeat:no-repeat;pointer-events:none}\nheader{display:flex;align-items:center;gap:5px;min-height:46px;padding:6px 12px;flex-shrink:0}#handle{flex:1;min-width:0;text-align:left;border:0;background:transparent;font-weight:650;touch-action:none;cursor:move;padding:2px 4px}#history-region{position:relative;flex:1;min-height:0}#history{height:100%;min-height:0;overflow:auto;padding:18px 14px 8px;overscroll-behavior:contain;scrollbar-width:thin}.turn{max-width:960px;margin:0 auto 18px;min-width:0}.user,.answer,.turn>details{padding:10px 12px;background:var(--surface);overflow-wrap:anywhere;margin:8px 0}.user,.answer{width:fit-content;max-width:100%}.user{max-width:calc(100% - 28px);margin-left:auto;white-space:pre-wrap}.answer{margin-right:auto}.answer:empty{display:none}.answer>:first-child{margin-top:0}.answer>:last-child{margin-bottom:0}.answer p{margin:8px 0}.answer pre{max-width:100%;overflow:auto;margin:0;padding:12px;white-space:pre;tab-size:4}.answer code{font-family:\"Cascadia Code\",Consolas,\"SFMono-Regular\",ui-monospace,\"Microsoft YaHei\",monospace;font-size:13px;font-style:normal;font-weight:400;line-height:1.6}.answer :not(pre)>code{padding:1px 4px;border-radius:4px;background:color-mix(in srgb,var(--chat-ink) 7%,var(--chat-base))}.code-block{max-width:100%;margin:10px 0;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--chat-base)}.code-toolbar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 8px;border-bottom:1px solid var(--line);font:12px/1.6 system-ui,sans-serif}.answer .code-block code{padding:0;background:none;color:var(--chat-ink)}.answer table{display:block;max-width:100%;overflow:auto;border-collapse:collapse}.answer td,.answer th{border:1px solid var(--line);padding:5px 8px}.answer img{display:none}.answer a{color:var(--chat-link)}.answer .katex-display{overflow:auto;padding:4px}#panel{--code-keyword:#7439a3;--code-string:#186334;--code-number:#8e4218;--code-comment:#586778;--code-title:#185b99}#panel[data-scheme=dark]{--code-keyword:#d7acff;--code-string:#a8dcac;--code-number:#ffc695;--code-comment:#b2bbc9;--code-title:#93ccff}.answer .hljs-keyword,.answer .hljs-selector-tag,.answer .hljs-tag{color:var(--code-keyword)}.answer .hljs-string,.answer .hljs-attr,.answer .hljs-attribute{color:var(--code-string);text-decoration:none}.answer .hljs-number,.answer .hljs-literal{color:var(--code-number)}.answer .hljs-comment,.answer .hljs-quote{color:var(--code-comment);font-style:normal}.answer .hljs-title,.answer .hljs-built_in,.answer .hljs-type{color:var(--code-title)}summary{cursor:pointer}.reason{white-space:pre-wrap;font-size:12px;max-height:180px;overflow:auto}.state{display:table;background:var(--surface);border-radius:4px;padding:0 4px}.state,#status,#page-note{font-size:12px}#status,#page-note{margin:0 14px;padding:2px 6px;background:var(--surface);border-radius:5px;flex-shrink:0}#page-note:empty,#status:empty{display:none}footer{position:relative;margin:16px 12px 12px;background:var(--surface);flex-shrink:1;min-height:116px;max-height:52%;display:flex;isolation:isolate}#composer-content{position:relative;z-index:2;min-width:0;width:100%;overflow:auto;padding:12px 10px 8px}#composer-ornaments{display:none;pointer-events:none}.toolbar{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:6px}textarea{display:block;width:100%;height:58px;min-height:40px;max-height:120px;resize:none;border:0;background:transparent;color:inherit;padding:4px;outline:none}.send-controls{display:flex;align-items:center;justify-content:flex-end;gap:6px;min-width:0;flex:1;margin-left:auto}#current-model{min-width:0;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;font-weight:600}#materials{max-height:110px;overflow:auto}.material{padding:6px;margin:5px 0;border:1px solid var(--line);border-radius:8px;background:var(--surface);overflow-wrap:anywhere}.material img{width:60px;height:50px;object-fit:contain;vertical-align:middle;margin-right:8px}.material details{max-height:180px;overflow:auto}.material pre{white-space:pre-wrap;font:inherit}.source{font-size:11px}.material{position:relative}.material:has(>.remove){padding-right:36px}.material summary{min-height:24px;line-height:24px}.material>.remove{position:absolute;right:6px;top:6px;width:24px;height:24px;min-width:24px;min-height:24px;padding:4px;display:flex;align-items:center;justify-content:center}.material>.remove svg{width:14px;height:14px}\n#settings{position:absolute;inset:51px 8px 8px;z-index:4;background:var(--surface);overflow:auto;padding:12px;color:var(--chat-ink);box-shadow:0 4px 20px #0002}#settings fieldset{padding:0;border:0;min-width:0}#settings label{display:block;margin:7px 0}#settings input:not([type=checkbox]),#settings select{width:100%;padding:5px;color:inherit;background:var(--surface);border:1px solid var(--line);border-radius:7px}#settings input[type=color]{height:34px;padding:3px}#settings p{font-size:12px;margin:7px 0}.settings-tabs{display:flex;gap:5px;position:sticky;top:-12px;background:var(--surface);padding:5px 0;z-index:1}#settings-close{margin-left:auto}.preset-heading{margin-top:10px}.preset-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin:8px 0}.preset-grid button{font-size:12px;min-width:0}.appearance-row{display:flex;gap:8px;align-items:center}.appearance-row label{flex:1}.appearance-row>button{margin-top:22px;font-size:12px}.appearance-section{border-top:1px solid var(--line);padding:10px 0;margin-top:8px}.palette-row{display:flex;gap:12px}.palette-row label{flex:1}#latest{position:absolute;right:18px;bottom:8px;z-index:2;font-size:12px}\n[data-edge]{position:absolute;z-index:5;border:0;border-radius:0;background:transparent;padding:0;min-height:0;touch-action:none;opacity:0}[data-edge]:hover{background:transparent;filter:none}[data-edge]:focus-visible{opacity:1;background:var(--chat-accent);outline-offset:-2px}[data-edge=n],[data-edge=s]{left:12px;right:12px;height:6px;cursor:ns-resize}[data-edge=n]{top:0}[data-edge=s]{bottom:0}[data-edge=e],[data-edge=w]{top:12px;bottom:12px;width:6px;cursor:ew-resize}[data-edge=e]{right:0}[data-edge=w]{left:0}[data-edge=ne],[data-edge=nw],[data-edge=se],[data-edge=sw]{width:12px;height:12px}[data-edge=ne]{top:0;right:0;cursor:nesw-resize}[data-edge=nw]{top:0;left:0;cursor:nwse-resize}[data-edge=se]{bottom:0;right:0;cursor:nwse-resize}[data-edge=sw]{bottom:0;left:0;cursor:nesw-resize}\n#panel[data-fullscreen][data-frame]{border-radius:0;box-shadow:none;border:0}#panel[data-fullscreen]>footer{width:min(960px,calc(100% - 24px));align-self:center}#panel[data-fullscreen] #status,#panel[data-fullscreen] #page-note{width:min(960px,calc(100% - 28px));align-self:center}#panel[data-fullscreen] #settings{inset:52px max(8px,calc((100% - 960px)/2)) 12px}#panel[data-fullscreen] [data-edge]{display:none}#panel[data-fullscreen] #handle{cursor:default}\n.background-thumbnail{display:block;width:100%;height:78px;object-fit:cover;border-radius:8px;border:1px solid var(--line)}\n.skin-preview{display:grid;place-items:center;flex:none;width:35px;height:32px;margin-top:22px;background:var(--surface);border:1px solid var(--line);font-size:12px}.skin-preview[data-skin=maid]{border:1px solid #c5a468;border-radius:9px;font-family:Georgia,serif}.skin-preview[data-skin=orca]{border-radius:2px;border-left:3px solid var(--chat-accent);font-family:monospace}.skin-preview[data-skin=glass]{border-radius:12px;border:1px solid #fffa;box-shadow:inset 0 1px #fff,0 3px 8px #0002}.skin-preview[data-skin=neu]{border-radius:8px;box-shadow:3px 3px 6px #0002,-3px -3px 6px #fff4}.skin-preview[data-skin=none]{border-style:dashed;color:transparent}\n@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}\n</style><link id=\"math-style\" rel=\"stylesheet\"><button id=\"launcher\">问问大肥鱼</button><section id=\"panel\" role=\"dialog\" aria-label=\"大肥鱼\" hidden><div id=\"wallpaper\" aria-hidden=\"true\"></div><div id=\"ornaments\" aria-hidden=\"true\"></div><header><button id=\"handle\" aria-label=\"移动大肥鱼：方向键移动\">大肥鱼</button><button id=\"settings-open\">设置</button><button id=\"background-toggle\" aria-pressed=\"true\"></button><button id=\"fullscreen\" aria-pressed=\"false\"></button><button id=\"close\" aria-label=\"收起问答\">×</button></header><div id=\"history-region\"><div id=\"history\" aria-label=\"聊天历史\"></div><button id=\"latest\" hidden>返回最新内容 ↓</button></div><div id=\"status\" role=\"status\" aria-live=\"polite\"></div><div id=\"page-note\"></div><footer><div id=\"composer-ornaments\" aria-hidden=\"true\"><span></span></div><div id=\"composer-content\"><div id=\"materials\"></div><textarea id=\"input\" aria-label=\"问题\" placeholder=\"输入问题，或粘贴图片…\"></textarea><div class=\"toolbar\"><button id=\"image\">图片</button><button id=\"article\">附上文章</button><button id=\"clear\">清空</button><button id=\"thinking\" type=\"button\" aria-pressed=\"false\"></button><div class=\"send-controls\"><span id=\"current-model\" aria-label=\"当前模型\"></span><button id=\"stop\" hidden>停止</button><button id=\"send\" class=\"send\">发送</button></div><input id=\"files\" type=\"file\" accept=\"image/png,image/jpeg,image/webp\" multiple hidden></div></div></footer><form id=\"settings\" hidden><nav class=\"settings-tabs\"><button type=\"button\" id=\"appearance-tab\" aria-pressed=\"true\">外观</button><button type=\"button\" id=\"service-tab\" aria-pressed=\"false\">模型服务</button><button type=\"button\" id=\"settings-close\" aria-label=\"返回聊天\">返回</button></nav><section id=\"appearance-settings\"><div class=\"preset-heading\">整套皮肤 · <span id=\"preset-name\"></span></div><div id=\"skin-presets\" class=\"preset-grid\"></div><p>整套替换部件、亮暗配色和背景；毛玻璃、轻拟物使用无背景。下方可单独混搭。</p><div id=\"skin-parts\"></div><div class=\"appearance-section\"><label>背景图片<select id=\"background-choice\"></select></label><div class=\"toolbar\"><button type=\"button\" id=\"background-local\">选择本地图片</button><button type=\"button\" id=\"background-reset\">恢复背景</button></div><input id=\"background-file\" type=\"file\" accept=\"image/png,image/jpeg,image/webp\" hidden><small id=\"background-name\"></small><p>PNG/JPEG/WebP，最多 5 MiB；本地背景刷新清空。图片居中等比铺满。</p></div><div class=\"appearance-section\"><div id=\"palette-mode\"></div><div class=\"palette-row\"><label>主色<input type=\"color\" id=\"accent\"></label><label>底色<input type=\"color\" id=\"base-color\"></label></div><div class=\"toolbar\"><button type=\"button\" id=\"sync-palette\">同步网站主题色</button><button type=\"button\" id=\"palette-reset\">恢复配色</button></div></div><button type=\"button\" id=\"appearance-reset\">全部恢复仓库默认</button><p>外观仅本次浏览有效；清空聊天不会重置外观。</p><p id=\"appearance-note\" role=\"status\"></p></section><fieldset id=\"service-fields\" hidden><legend>模型服务</legend><label>接口类型<select id=\"preset\"><option value=\"deepseek\">DeepSeek</option><option value=\"custom\">兼容接口</option></select></label><label>基础地址<input id=\"base\" type=\"url\" autocomplete=\"off\"></label><label>模型名称<input id=\"model\" autocomplete=\"off\"></label><label>API Key<input id=\"key\" type=\"password\" autocomplete=\"off\" spellcheck=\"false\"></label><label><input id=\"vision\" type=\"checkbox\">此型号支持原生图片</label><label><input id=\"remember\" type=\"checkbox\">记在本设备</label><p>默认仅本次使用。记住后 Key 保存在本浏览器；聊天记录不会保存。材料仅在发送时交给所选服务。</p><div class=\"toolbar\"><button type=\"submit\">保存设置</button><button type=\"button\" id=\"forget\">清除 Key</button></div><p id=\"settings-note\" role=\"status\"></p></fieldset></form></section>";
//#endregion
//#region src/chat/mock.ts
function I(e, t = 20, n = -1) {
	return { async *stream(r, i) {
		for (let r = 0; r < e.length; r++) {
			if (i.throwIfAborted(), await new Promise((e, n) => {
				let r = () => {
					clearTimeout(a), n(i.reason);
				}, a = setTimeout(() => {
					i.removeEventListener("abort", r), e();
				}, t);
				i.addEventListener("abort", r, { once: !0 });
			}), r === n) throw Error("模拟连接中断");
			i.throwIfAborted(), yield e[r];
		}
	} };
}
//#endregion
//#region src/chat.ts
function L(e) {
	let t = new P(e.provider || h()), n;
	try {
		n = localStorage;
	} catch {}
	let r = new te(n);
	r.initial && t.configure(r.initial.service, r.initial.key, !0);
	let i = document.createElement("div");
	i.dataset.noEffects = "", i.dataset.chat = "";
	let a = i.attachShadow({ mode: "open" });
	a.innerHTML = ne, e.mount.append(i);
	let o = (e) => a.getElementById(e), s = o("panel"), f = o("input"), p = o("history"), m = o("settings"), g = new AbortController(), v = { signal: g.signal }, y = new EventTarget(), b = [], x;
	function S(e) {
		return x ||= new Promise((t, n) => {
			let r = o("math-style"), i = (e) => {
				clearTimeout(a), r.removeEventListener("load", i), r.removeEventListener("error", i), g.signal.removeEventListener("abort", i), e?.type === "load" ? t() : n(/* @__PURE__ */ Error("公式样式加载失败"));
			}, a = setTimeout(i, 15e3);
			r.addEventListener("load", i), r.addEventListener("error", i), g.signal.addEventListener("abort", i, { once: !0 }), r.href = e;
		}).catch((e) => {
			throw x = void 0, e;
		}), x;
	}
	let C = () => {
		for (let e of b.splice(0)) document.fonts.delete(e);
	}, w = !1, E = !1, D = !1, k = !1, A = 0, j = location.href, M = null, N = ee(s, g.signal), F = T(a, e, g.signal);
	for (let [e, t, n] of [
		[
			"settings-open",
			"settings",
			"设置"
		],
		[
			"background-toggle",
			"wallpaper",
			"背景图片开关"
		],
		[
			"fullscreen",
			"fullscreen",
			"铺满页面"
		],
		[
			"close",
			"close",
			"收起大肥鱼"
		],
		[
			"image",
			"image",
			"添加图片"
		],
		[
			"article",
			"article",
			"附上文章"
		],
		[
			"clear",
			"clear",
			"清空会话"
		],
		[
			"thinking",
			"thinking",
			"深度思考"
		],
		[
			"send",
			"send",
			"发送"
		],
		[
			"stop",
			"stop",
			"停止生成"
		]
	]) O(o(e), t, n);
	for (let e of [
		"n",
		"s",
		"e",
		"w",
		"ne",
		"nw",
		"se",
		"sw"
	]) {
		let t = document.createElement("button");
		t.type = "button", t.dataset.edge = e, t.setAttribute("aria-label", `${{
			n: "上边",
			s: "下边",
			e: "右边",
			w: "左边",
			ne: "右上角",
			nw: "左上角",
			se: "右下角",
			sw: "左下角"
		}[e]}缩放：方向键调整，Shift 加速`), t.title = t.getAttribute("aria-label"), s.append(t), N.bind(t, e);
	}
	o("handle").textContent = e.labels?.title || "大肥鱼", s.setAttribute("aria-label", e.labels?.title || "大肥鱼"), o("launcher").textContent = e.labels?.open || "问问大肥鱼";
	let I = 0, L = !0, R = "", z = "", B = "idle", V = /* @__PURE__ */ new Map(), H = (e, t, n) => o(e).addEventListener(t, n, v), U = (e) => {
		R = e instanceof u ? e.message : "操作失败，请重试", o("status").textContent = R;
	};
	function W() {
		N.layout(), s.hidden = !w || E, o("launcher").hidden = e.showLauncher === !1 || w || E;
	}
	function G() {
		D || (w || (M = document.activeElement), w = !0, W(), f.focus());
	}
	function K() {
		w = !1, m.hidden = !0, o("key").value = "", W(), e.showLauncher === !1 ? M?.focus({ preventScroll: !0 }) : o("launcher").focus();
	}
	function q(e, n) {
		let r = document.createElement("div");
		if (r.className = "material", n) {
			let n = document.createElement("button");
			O(n, "remove", "移除材料"), n.classList.add("remove"), n.setAttribute("aria-label", `移除 ${e.title}`), n.onclick = () => t.remove(e.id), r.append(n);
		}
		if (e.kind === "image") {
			let t = document.createElement("img");
			t.src = e.dataUrl, t.alt = e.title, r.append(t, document.createTextNode(e.title));
		} else {
			let t = document.createElement("details"), n = document.createElement("summary"), i = document.createElement("div"), a = document.createElement("pre");
			n.textContent = `${e.kind === "article" ? "文章" : "选文"} · ${e.title}`, i.className = "source", i.textContent = e.source, a.textContent = e.text, t.append(n, i, a), r.append(t);
		}
		return r;
	}
	async function re(e, t) {
		let n = ++e.version;
		try {
			let { renderMarkdown: r } = await import("./render-C9uy_wBM.js"), i = await r(t);
			if (i.css && !D && await S(i.css), D || n !== e.version || !e.node.isConnected) return;
			e.answer.innerHTML = i.html;
			for (let t of e.answer.querySelectorAll("pre")) {
				let e = t.querySelector("code");
				if (!e) continue;
				let n = e.textContent || "", r = document.createElement("button");
				O(r, "copy", "复制代码"), r.onclick = async () => {
					try {
						await navigator.clipboard.writeText(n), r.title = "已复制", r.setAttribute("aria-label", "已复制");
					} catch {
						r.title = "复制失败，请手动选择", r.setAttribute("aria-label", "复制失败，请手动选择");
					}
				};
				let i = document.createElement("div"), a = document.createElement("div"), o = document.createElement("span");
				i.className = "code-block", a.className = "code-toolbar", o.textContent = [...e.classList].find((e) => e.startsWith("language-"))?.slice(9) || "纯文本", a.append(o, r), t.before(i), i.append(a, t);
			}
			L && (p.scrollTop = p.scrollHeight);
		} catch {
			n === e.version && (e.answer.textContent = t);
		}
	}
	function J() {
		if (I = 0, D) return;
		let n = new Set(t.turns.map((e) => e.id));
		for (let [e, t] of V) n.has(e) || (t.node.remove(), ++t.version, V.delete(e));
		for (let e of t.turns) {
			let n = V.get(e.id);
			if (!n) {
				let r = document.createElement("article");
				r.className = "turn";
				let i = document.createElement("div");
				i.className = "user", i.textContent = e.input.text;
				for (let t of e.input.materials) i.append(q(t, !1));
				let a = document.createElement("details"), o = document.createElement("summary"), s = document.createElement("div"), c = document.createElement("div"), l = document.createElement("div"), u = document.createElement("button"), d = document.createElement("button");
				o.textContent = "思考过程", s.className = "reason", a.append(o, s), c.className = "answer", l.className = "state", O(u, "retry", "重试本次"), u.onclick = () => void X(!0), O(d, "restore", "取回草稿修改"), d.onclick = () => {
					try {
						t.restoreFailed(), R = "", f.focus();
					} catch (e) {
						U(e);
					}
				}, r.append(i, a, c, l, u, d), p.append(r), n = {
					node: r,
					answer: c,
					reasoning: s,
					state: l,
					retry: u,
					restore: d,
					text: "\0",
					version: 0,
					turn: e
				}, V.set(e.id, n);
			}
			n.reasoning.textContent = e.reasoning, n.reasoning.parentElement.hidden = !e.reasoning, n.text !== e.answer && (n.text = e.answer, re(n, e.answer)), n.state.textContent = e.error || {
				generating: "正在生成…",
				complete: "",
				stopped: "已停止 · 部分正文将用于后续追问",
				failed: "生成失败",
				length: "已达到输出上限，可继续追问"
			}[e.status], n.restore.hidden = t.busy || e !== t.turns.at(-1) || e.status !== "failed" || !!e.answer, n.retry.hidden = t.busy || e !== t.turns.at(-1) || !["stopped", "failed"].includes(e.status);
		}
		let r = t.draft.materials.map((e) => e.id).join();
		r !== z && (z = r, o("materials").replaceChildren(...t.draft.materials.map((e) => q(e, !0)))), f.value !== t.draft.text && (f.value = t.draft.text), o("send").disabled = t.busy, o("stop").hidden = !t.busy, o("service-fields").disabled = t.busy, o("send").hidden = t.busy, o("thinking").disabled = t.busy || t.service.preset !== "deepseek", o("thinking").setAttribute("aria-pressed", String(t.service.thinking)), o("current-model").textContent = t.service.model, o("current-model").title = t.service.model, o("current-model").setAttribute("aria-label", `当前模型：${t.service.model}`), o("status").textContent = R || (t.configured ? "" : "先在设置中填写自己的 API Key"), o("page-note").textContent = t.draft.materials.some((e) => e.kind !== "image" && e.source !== j) ? "页面已变化：草稿保留原来源材料，未自动替换。" : "", o("article").hidden = !e.article, L && (p.scrollTop = p.scrollHeight);
		let i = t.busy ? "generating" : t.turns.at(-1)?.status || "idle";
		i !== B && (B = i, y.dispatchEvent(new CustomEvent("statechange", { detail: { status: i } })));
	}
	function Y() {
		I ||= window.setTimeout(J, 80);
	}
	async function X(e = !1) {
		R = "";
		try {
			await t.send(e);
		} catch (e) {
			U(e);
		}
		Y();
	}
	async function Z(e) {
		let n = A;
		try {
			if (e.length + t.draft.materials.filter((e) => e.kind === "image").length > c.images) throw new u("每条消息最多附上 4 张图片");
			let r = await Promise.all(e.map(_));
			if (D || n !== A) return;
			if (t.draft.materials.filter((e) => e.kind === "image").length + r.length > c.images) throw new u("每条消息最多附上 4 张图片");
			for (let e of r) t.attach(e);
		} catch (e) {
			U(e);
		}
	}
	function ie() {
		let e = t.service, n = r.get(e.baseUrl);
		for (let [t, r] of [
			["preset", e.preset],
			["base", e.baseUrl],
			["model", e.model],
			["key", n?.key || ""]
		]) o(t).value = r;
		o("vision").checked = e.images, o("remember").checked = n?.remember || !1, o("settings-note").textContent = "";
	}
	H("launcher", "click", G), H("close", "click", K), H("input", "input", () => {
		t.draft.text = f.value;
	}), H("input", "compositionstart", () => k = !0), H("input", "compositionend", () => k = !1), H("input", "keydown", (e) => {
		e.key === "Enter" && !e.shiftKey && !e.isComposing && !k && e.keyCode !== 229 && (e.preventDefault(), X());
	}), H("input", "paste", (e) => {
		let t = [...e.clipboardData?.files || []];
		t.length && (e.preventDefault(), Z(t));
	}), H("send", "click", () => void X()), H("stop", "click", () => t.stop()), H("clear", "click", () => {
		(t.turns.length || t.draft.text || t.draft.materials.length) && !confirm("清空当前聊天及草稿？Key 会保留。") || (++A, R = "", t.clear());
	}), H("thinking", "click", () => {
		t.service.thinking = !t.service.thinking, Y();
	}), H("image", "click", () => o("files").click()), H("files", "change", () => {
		let e = o("files");
		Z([...e.files || []]), e.value = "";
	}), H("article", "click", async () => {
		let t = A;
		try {
			let n = await e.article?.();
			n && !D && t === A ? $(n) : n || U(new u("当前页面没有可附加的文章"));
		} catch {
			U(new u("文章材料读取失败，请重试"));
		}
	});
	function Q(e) {
		o("appearance-settings").hidden = e, o("service-fields").hidden = !e, o("appearance-tab").setAttribute("aria-pressed", String(!e)), o("service-tab").setAttribute("aria-pressed", String(e)), e ? ie() : o("key").value = "";
	}
	H("appearance-tab", "click", () => Q(!1)), H("service-tab", "click", () => Q(!0)), H("fullscreen", "click", () => N.toggleFullscreen()), H("settings-open", "click", () => {
		Q(!1), m.hidden = !1, o("appearance-tab").focus();
	}), H("settings-close", "click", () => {
		m.hidden = !0, o("key").value = "", f.focus();
	}), H("preset", "change", () => {
		o("preset").value === "deepseek" ? (o("base").value = l.baseUrl, o("model").value = l.model, o("vision").checked = !0) : (o("base").value = "", o("model").value = "", o("vision").checked = !1), o("key").value = "", o("remember").checked = !1;
	}), H("base", "input", () => {
		o("key").value = "", o("remember").checked = !1;
	}), H("base", "change", () => {
		try {
			let e = r.get(o("base").value);
			e && (o("key").value = e.key, o("remember").checked = e.remember);
		} catch {}
	}), H("settings", "submit", (e) => {
		if (e.preventDefault(), !(t.busy || o("service-fields").hidden)) try {
			let e = {
				baseUrl: d(o("base").value),
				model: o("model").value,
				images: o("vision").checked,
				thinking: t.service.thinking,
				preset: o("preset").value
			}, n = e.baseUrl !== t.service.baseUrl;
			if (n && !confirm("更换接口地址并清空聊天、草稿和图片？旧 Key 不会转交新地址。")) return;
			let i = o("key").value.trim();
			n && ++A, t.configure(e, i, n), R = r.save(e, i, o("remember").checked) ? "" : "存储不可用：当前仅临时使用；如需删除旧副本，请清理此站点存储", m.hidden = !0, o("key").value = "", Y();
		} catch (e) {
			o("settings-note").textContent = e instanceof u ? e.message : "设置保存失败";
		}
	}), H("forget", "click", () => {
		t.forgetKey();
		let e = r.forget(t.service.baseUrl);
		o("key").value = "", o("remember").checked = !1, o("settings-note").textContent = e ? "已清除 Key" : "内存 Key 已清除；无法删除设备副本，请清理此站点存储";
	}), H("history", "scroll", () => {
		L = p.scrollHeight - p.scrollTop - p.clientHeight < 60, o("latest").hidden = L;
	}), H("latest", "click", () => {
		L = !0, p.scrollTop = p.scrollHeight;
	}), a.addEventListener("keydown", (e) => {
		let t = e;
		t.key === "Escape" && w ? (t.preventDefault(), t.stopPropagation(), m.hidden ? N.fullscreen ? N.toggleFullscreen() : K() : (m.hidden = !0, o("key").value = "", f.focus())) : (t.ctrlKey || t.metaKey) && t.key.toLowerCase() === "k" && t.stopPropagation();
	}, v), N.bind(o("handle")), H("math-style", "load", () => {
		C();
		let e = o("math-style");
		try {
			for (let t of e.sheet?.cssRules || []) {
				if (t.type !== CSSRule.FONT_FACE_RULE) continue;
				let n = t.style, r = n.getPropertyValue("src").replace(/url\(["']?([^"'()]+)["']?\)/g, (t, n) => `url("${new URL(n, e.href).href}")`), i = new FontFace(n.getPropertyValue("font-family").replace(/^["']|["']$/g, ""), r, {
					weight: n.getPropertyValue("font-weight") || "normal",
					style: n.getPropertyValue("font-style") || "normal"
				});
				document.fonts.add(i), b.push(i);
			}
		} catch {}
	}), window.addEventListener("resize", W, v), window.addEventListener("pagehide", () => t.stop(), v), t.addEventListener("change", Y, v);
	function $(e) {
		e.kind === "article" && t.draft.materials.some((e) => e.kind === "article") && !confirm("替换草稿中的整篇文章材料？其他材料和问题会保留。") || (t.attach(e), e.kind === "selection" && !t.draft.text.trim() && (t.draft.text = "请解释这段内容"), G(), Y());
	}
	return W(), J(), {
		events: y,
		element: i,
		open: G,
		close: K,
		attach: $,
		send: X,
		retry: () => X(!0),
		stop: () => t.stop(),
		clear() {
			++A, t.clear();
		},
		getState: () => ({
			draft: structuredClone(t.draft),
			turns: structuredClone(t.turns),
			busy: t.busy,
			opened: w
		}),
		setAnchor(e) {
			N.setAnchor(e), W();
		},
		getAppearance: F.get,
		setAppearance: F.set,
		setColorScheme: F.setScheme,
		setSuppressed(e) {
			E = e, W();
		},
		setPage(e) {
			j = e, Y();
		},
		destroy() {
			D = !0, ++A, g.abort(), F.destroy(), C(), clearTimeout(I), t.destroy(), V.clear(), i.remove();
		}
	};
}
//#endregion
export { P as ChatSession, h as compatibleProvider, L as createChat, I as mockProvider };
