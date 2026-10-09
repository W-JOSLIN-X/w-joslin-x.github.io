// Run with Playwright CLI: run-code --filename tests/browser/search.js
// Open the production preview first; the check stays on that page's origin.
async function searchRegression(page) {
	const origin = new URL(page.url()).origin;
	const errors = [];
	const onError = (error) => errors.push(error.message);
	page.on("pageerror", onError);
	const assert = (condition, message) => {
		if (!condition) throw new Error(message);
	};
	async function open(path) {
		await page.goto(`${origin}${path}`);
		await page.waitForFunction(() => document.body.dataset.ready === "true");
		await page.keyboard.press("Control+k");
	}
	async function query(value) {
		await page.waitForURL(
			(url) =>
				url.pathname === "/browse/" && url.searchParams.get("q") === value,
		);
		await page.waitForFunction(
			(value) =>
				document.querySelector("#search-input").value === (value ?? ""),
			value,
		);
	}
	try {
		for (const path of ["/", "/posts/welcome/"]) {
			await open(path);
			await page.getByRole("searchbox", { name: "搜索" }).fill("欢迎");
			await page
				.getByRole("combobox", { name: "搜索范围" })
				.selectOption("full");
			await page.locator(".nav-search button").click();
			await query("欢迎");
			assert(
				new URL(page.url()).searchParams.get("scope") === "full",
				"Lost full-text scope",
			);
		}
		await open("/");
		await page.getByRole("searchbox", { name: "搜索" }).fill("Markdown");
		await page.keyboard.press("Enter");
		await query("Markdown");
		await page.keyboard.press("Control+k");
		await page.getByRole("searchbox", { name: "搜索" }).fill("");
		await query(null);

		for (const pendingInput of [false, true]) {
			await open("/browse/");
			const keys = await page
				.locator("#search-input")
				.evaluate((input, pending) => {
					window.searchBeforeComposition = input;
					if (pending) {
						input.value = "old";
						input.dispatchEvent(new InputEvent("input", { bubbles: true }));
					}
					input.dispatchEvent(
						new CompositionEvent("compositionstart", { bubbles: true }),
					);
					const keys = ["ArrowDown", "ArrowUp", "Enter", "Escape"].map(
						(key) => {
							const event = new KeyboardEvent("keydown", {
								key,
								isComposing: true,
								bubbles: true,
								cancelable: true,
							});
							input.dispatchEvent(event);
							return {
								key,
								prevented: event.defaultPrevented,
								focused: document.activeElement === input,
							};
						},
					);
					input.value = "zhong";
					input.dispatchEvent(
						new InputEvent("input", { bubbles: true, isComposing: true }),
					);
					input.form.requestSubmit();
					return keys;
				}, pendingInput);
			assert(
				keys.every((key) => !key.prevented && key.focused),
				`IME keys intercepted: ${JSON.stringify(keys)}`,
			);
			// Deliberately exceed the 300ms search debounce while composition remains active.
			await page.waitForTimeout(650);
			assert(
				new URL(page.url()).search === "",
				"Composition submitted unfinished text",
			);
			assert(
				await page.evaluate(
					() =>
						window.searchBeforeComposition ===
						document.querySelector("#search-input"),
				),
				"Composition replaced the input",
			);
			await page.locator("#search-input").evaluate((input) => {
				input.value = "欢迎";
				input.dispatchEvent(
					new CompositionEvent("compositionend", {
						bubbles: true,
						data: "欢迎",
					}),
				);
				input.dispatchEvent(
					new InputEvent("input", { bubbles: true, data: "欢迎" }),
				);
			});
			await query("欢迎");
		}
		await page.keyboard.press("Control+k");
		await page.getByRole("searchbox", { name: "搜索" }).fill("Markdown");
		await query("Markdown");
		await page.goBack();
		await query("欢迎");
		assert(errors.length === 0, `Page errors: ${errors.join("; ")}`);
		return {
			passed: [
				"home/article search button",
				"full-text scope",
				"Enter",
				"clear query",
				"IME candidate keys",
				"IME debounce and previous timer",
				"committed Chinese text",
				"ordinary debounce",
				"back navigation",
			],
			errors,
		};
	} finally {
		page.off("pageerror", onError);
	}
}
