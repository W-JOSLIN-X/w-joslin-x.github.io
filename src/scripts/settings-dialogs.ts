import { roxy } from "../config/roxy";
import { exportDefaults } from "../utils/roxy-defaults.mjs";
import { t } from "../utils/roxy-i18n";
import { normalizeEffects } from "../utils/roxy-personalization.mjs";
import { pageFeature } from "./core/page-scope";

const read = (key: string) => {
	try {
		const value = JSON.parse(localStorage.getItem(key) || "{}");
		return value && typeof value === "object" ? value : {};
	} catch {
		return {};
	}
};
export function confirmSettings(message: string): Promise<boolean> {
	const dialog =
		document.querySelector<HTMLDialogElement>("#settings-confirm")!;
	if (dialog.open) return Promise.resolve(false);
	const focus = document.activeElement as HTMLElement;
	dialog.querySelector("p")!.textContent = message;
	dialog.returnValue = "";
	return new Promise((resolve) => {
		dialog.onclose = () => {
			focus?.focus({ preventScroll: true });
			resolve(dialog.returnValue === "confirm");
		};
		dialog.showModal();
	});
}
let downloadUrl = "";
export function showExport(content: string, complete: string, file: string) {
	const dialog = document.querySelector<HTMLDialogElement>("#settings-export")!;
	const text = dialog.querySelector<HTMLTextAreaElement>("textarea")!;
	text.value = content;
	dialog.querySelector("#export-status")!.textContent = "";
	if (downloadUrl) URL.revokeObjectURL(downloadUrl);
	downloadUrl = URL.createObjectURL(
		new Blob([complete], { type: "text/plain;charset=utf-8" }),
	);
	const download = dialog.querySelector<HTMLAnchorElement>("#export-download")!;
	download.href = downloadUrl;
	download.download = file.split("/").at(-1)!;
	dialog.querySelector<HTMLAnchorElement>("#export-edit")!.href =
		`${roxy.repository}/edit/${roxy.branch}/${file}`;
	dialog.querySelector<HTMLButtonElement>("#export-copy")!.onclick =
		async () => {
			try {
				await navigator.clipboard.writeText(text.value);
				dialog.querySelector("#export-status")!.textContent = t("copied");
			} catch {
				dialog.querySelector("#export-status")!.textContent = t("manualCopy");
				text.focus();
				text.select();
			}
		};
	dialog.showModal();
}
export async function exportCurrentGroup(group: string) {
	if (!(await confirmSettings(t("exportExplanation")))) return;
	const values: Record<string, unknown> = {
		...document.documentElement.dataset,
	};
	if (group === "appearance") values.font = read("roxy-fonts-v1").global;
	if (group === "background") Object.assign(values, read("roxy-slideshow-v1"));
	if (group === "effects")
		Object.assign(values, normalizeEffects(read("roxy-effects-v1")));
	const config = exportDefaults(group, values);
	showExport(
		JSON.stringify({ [group]: config[group] }, null, 2),
		`${JSON.stringify(config, null, 2)}\n`,
		"src/config/roxy-defaults.json",
	);
}
pageFeature((scope) => {
	for (const dialog of document.querySelectorAll<HTMLDialogElement>(
		".settings-dialog",
	)) {
		scope.on(dialog, "click", (event) => {
			if (
				event.target === dialog &&
				(event.clientX < dialog.getBoundingClientRect().left ||
					event.clientX > dialog.getBoundingClientRect().right ||
					event.clientY < dialog.getBoundingClientRect().top ||
					event.clientY > dialog.getBoundingClientRect().bottom)
			)
				dialog.close();
		});
		scope.defer(() => {
			if (dialog.open) dialog.close("cancel");
		});
	}
	scope.defer(() => {
		if (downloadUrl) URL.revokeObjectURL(downloadUrl);
		downloadUrl = "";
	});
});
