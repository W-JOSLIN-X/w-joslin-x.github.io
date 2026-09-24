import { navigate } from "astro:transitions/client";

// Router-owned history maintains scroll/index state; never overwrite it with pushState(null).
export function filterNavigation(params: URLSearchParams) {
	return navigate(`/browse/${params.size ? "?" + params : ""}`, {
		history: "push",
	});
}

document.addEventListener("astro:before-swap", (event: any) => {
	const from = document.documentElement,
		to = event.newDocument.documentElement;
	for (const name of [
		"mode",
		"theme",
		"soft",
		"waves",
		"edge",
		"atmosphere",
		"layout",
		"wide",
		"lang",
		"color",
		"overlayTransparency",
	])
		if (from.dataset[name]) to.dataset[name] = from.dataset[name];
	to.style.cssText = from.style.cssText;
	to.classList.toggle("dark", from.dataset.theme === "dark");
	to.lang = from.lang;
});

document.addEventListener("astro:page-load", () => {
	document.body.dataset.ready = "true";
});
