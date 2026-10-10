import {
	chatAppearance,
	chatBackgrounds,
	readChatHostPalette,
} from "../config/chat-appearance";
import { pageFeature } from "./core/page-scope";

type Anchor = { left: number; top: number; right: number; bottom: number };
type Material = {
	id: string;
	kind: "article" | "selection";
	title: string;
	source: string;
	text: string;
};
export interface ChatCharacter {
	getAnchor(): Anchor | null;
	addMenuAction(
		id: string,
		label: string,
		callback: () => void | Promise<void>,
	): () => void;
	events: EventTarget;
}
interface Chat {
	open(): void;
	attach(material: Material): void;
	setPage(source: string): void;
	setColorScheme(scheme: "light" | "dark"): void;
	setSuppressed(value: boolean): void;
	destroy(): void;
}
const enabled = import.meta.env.PUBLIC_CHAT_ENABLED === "true";
const desktop = matchMedia("(hover: hover) and (pointer: fine)");
const base = `${import.meta.env.BASE_URL}live2d/lib/`;
let chat: Chat | undefined, widget: ChatCharacter | undefined;
let pending: Promise<Chat> | undefined,
	disconnect: (() => void) | undefined,
	removeEntry: (() => void) | undefined;
let revision = 0,
	loadAttempt = 0;
const moduleUrl = (name: string) => {
	const url = new URL(`${base}${name}.js`, location.origin);
	if (loadAttempt) url.searchParams.set("retry", String(loadAttempt));
	return url.href;
};
const scheme = () =>
	document.documentElement.dataset.theme === "dark" ? "dark" : "light";
const pageUrl = () => location.origin + location.pathname;
function sync() {
	const hidden =
		!desktop.matches || !!document.querySelector("#screensaver[open]");
	chat?.setSuppressed(hidden);
	chat?.setPage(pageUrl());
	chat?.setColorScheme(scheme());
}
async function connect() {
	const current = ++revision;
	disconnect?.();
	disconnect = undefined;
	if (!widget) return;
	if (!chat) {
		if (removeEntry) return;
		removeEntry = widget.addMenuAction("chat-launch", "问问大肥鱼", () =>
			openChat(),
		);
		return;
	}
	const { connectCharacterChat } = await import(
		/* @vite-ignore */ moduleUrl("chat-character")
	);
	if (current === revision && widget && chat) {
		removeEntry?.();
		removeEntry = undefined;
		disconnect = connectCharacterChat(widget, chat);
	}
}
export function setChatCharacter(value?: ChatCharacter) {
	if (widget !== value) {
		removeEntry?.();
		removeEntry = undefined;
	}
	widget = value;
	if (enabled) void connect();
}
async function article(): Promise<Material | undefined> {
	const resource = document.body.dataset.articleContext;
	const source = pageUrl();
	if (!resource) return;
	const response = await fetch(resource, { credentials: "omit" });
	if (!response.ok) throw new Error("Article context unavailable");
	const value = await response.json();
	if (typeof value.title !== "string" || typeof value.text !== "string")
		throw new Error("Invalid article context");
	return {
		id: crypto.randomUUID(),
		kind: "article",
		title: value.title,
		source,
		text: value.text,
	};
}
async function openChat(material?: Material) {
	if (!enabled || !desktop.matches) return;
	try {
		if (!pending)
			pending = (async () => {
				const host = document.getElementById("chat-host");
				if (!host) throw new Error("Missing chat host");
				const { createChat } = await import(
					/* @vite-ignore */ moduleUrl("chat")
				);
				chat = createChat({
					mount: host,
					article,
					showLauncher: false,
					labels: { title: "大肥鱼", open: "问问大肥鱼" },
					appearance: chatAppearance,
					backgrounds: chatBackgrounds(base),
					readHostPalette: readChatHostPalette,
				}) as Chat;
				await connect();
				sync();
				return chat;
			})().catch((error) => {
				chat?.destroy();
				chat = undefined;
				pending = undefined;
				++loadAttempt;
				throw error;
			});
		const current = await pending;
		if (material) current.attach(material);
		else current.open();
		sync();
	} catch {
		throw new Error("大肥鱼加载失败，请重试");
	}
}

if (enabled)
	pageFeature((scope) => {
		scope.on(window, "roxy:focus", sync);
		scope.on(desktop, "change", sync);
		sync();
		const root = document.documentElement;
		const theme = () => chat?.setColorScheme(scheme());
		const observer = new MutationObserver(theme);
		observer.observe(root, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});
		scope.defer(() => observer.disconnect());
		theme();
		const body = document.querySelector<HTMLElement>(
			".article .prose[data-pagefind-body]",
		);
		if (!body) return;
		const menu = document.createElement("div");
		menu.hidden = true;
		menu.dataset.noEffects = "";
		menu.setAttribute("role", "menu");
		menu.setAttribute("aria-label", "选文操作");
		Object.assign(menu.style, {
			position: "fixed",
			zIndex: "212",
			padding: "6px",
			background: "var(--panel, #fff)",
			color: "var(--text, #30283e)",
			border: "1px solid #9273c9",
			borderRadius: "10px",
			boxShadow: "0 4px 20px #0003",
		});
		for (const label of ["问大肥鱼", "复制"]) {
			const button = document.createElement("button");
			button.textContent = label;
			button.setAttribute("role", "menuitem");
			Object.assign(button.style, { padding: "6px 12px", cursor: "pointer" });
			menu.append(button);
		}
		document.body.append(menu);
		scope.defer(() => menu.remove());
		let snapshot: Material | undefined,
			previousFocus: HTMLElement | null = null;
		function selection() {
			const selected = getSelection();
			if (!selected?.rangeCount || selected.isCollapsed) return;
			const range = selected.getRangeAt(0);
			if (
				!body!.contains(range.startContainer) ||
				!body!.contains(range.endContainer)
			)
				return;
			let text = selected.toString().trim();
			const fragment = range.cloneContents();
			if (fragment.querySelector(".katex")) {
				for (const math of fragment.querySelectorAll(".katex")) {
					const source = math.querySelector(
						'annotation[encoding="application/x-tex"]',
					)?.textContent;
					if (source) math.replaceWith(document.createTextNode(`$${source}$`));
					else math.querySelector(".katex-mathml")?.remove();
				}
				for (const block of fragment.querySelectorAll(
					"p,pre,li,h1,h2,h3,h4,br",
				))
					block.append(document.createTextNode("\n"));
				text = fragment.textContent?.trim() || text;
			}
			if (!text) return;
			return {
				range,
				material: {
					id: crypto.randomUUID(),
					kind: "selection" as const,
					title:
						document.querySelector(".article h1")?.textContent ||
						document.title,
					source: pageUrl(),
					text,
				},
			};
		}
		function close() {
			menu.hidden = true;
			snapshot = undefined;
			previousFocus?.focus({ preventScroll: true });
		}
		function show(x: number, y: number) {
			menu.children[0].textContent = "问大肥鱼";
			menu.hidden = false;
			menu.style.left = `${Math.max(8, Math.min(x, innerWidth - menu.offsetWidth - 8))}px`;
			menu.style.top = `${Math.max(8, Math.min(y, innerHeight - menu.offsetHeight - 8))}px`;
			previousFocus = document.activeElement as HTMLElement;
			(menu.firstElementChild as HTMLElement).focus();
		}
		scope.on(body, "contextmenu", (event: MouseEvent) => {
			if (
				!desktop.matches ||
				(event.target as Element).closest(
					"input,textarea,[contenteditable=true]",
				)
			)
				return;
			const value = selection();
			if (!value) return;
			event.preventDefault();
			snapshot = value.material;
			show(event.clientX, event.clientY);
		});
		scope.on(document, "keydown", (event: KeyboardEvent) => {
			if (
				!(
					event.key === "ContextMenu" ||
					(event.shiftKey && event.key === "F10")
				)
			)
				return;
			if (
				(event.target as Element).closest(
					"input,textarea,[contenteditable=true],#chat-host,#live2d-host",
				)
			)
				return;
			const value = selection();
			if (!value || !desktop.matches) return;
			event.preventDefault();
			snapshot = value.material;
			const rect = value.range.getBoundingClientRect();
			show(rect.left, rect.bottom);
		});
		scope.on(menu, "keydown", (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				event.stopPropagation();
				close();
			} else if (["ArrowDown", "ArrowUp"].includes(event.key)) {
				event.preventDefault();
				const buttons = [...menu.children] as HTMLElement[];
				buttons[
					(buttons.indexOf(document.activeElement as HTMLElement) + 1) %
						buttons.length
				].focus();
			}
		});
		scope.on(menu.children[0], "click", () => {
			const value = snapshot;
			close();
			if (value)
				void openChat(value).catch(() => {
					if (!scope.active) return;
					snapshot = value;
					menu.children[0].textContent = "问大肥鱼（加载失败，重试）";
					menu.hidden = false;
					(menu.children[0] as HTMLElement).focus();
				});
		});
		scope.on(menu.children[1], "click", async () => {
			const value = snapshot;
			if (!value) return;
			try {
				await navigator.clipboard.writeText(value.text);
				close();
			} catch {
				menu.children[1].textContent = "复制失败，请使用 Ctrl+C";
			}
		});
		scope.on(document, "pointerdown", (event: PointerEvent) => {
			if (!menu.hidden && !menu.contains(event.target as Node)) {
				menu.hidden = true;
				snapshot = undefined;
			}
		});
	});
