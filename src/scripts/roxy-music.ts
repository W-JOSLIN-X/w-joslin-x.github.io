import { musicTracks, musicDefaults } from "../config/music";
import {
	formatMusicTime,
	nextTrack,
	readMusicPreferences,
} from "../utils/roxy-music.mjs";
import { t, type MessageKey } from "../utils/roxy-i18n";

const player = document.querySelector<HTMLElement>("#music-player")!;
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
	player.querySelector<T>(selector)!;
const audio = $<HTMLAudioElement>("#music-audio");
const seek = $<HTMLInputElement>("#music-seek");
const volume = $<HTMLInputElement>("#music-volume");
const playButton = $<HTMLButtonElement>("#music-play");
const cover = $<HTMLImageElement>("#music-cover");
const key = "roxy-music-v1";
let saved: unknown;
try {
	saved = JSON.parse(localStorage.getItem(key) || "{}");
} catch {
	saved = {};
}
const prefs = readMusicPreferences(saved, musicTracks, musicDefaults);
let currentId: string | null = prefs.id;
let mode: "list" | "single" | "shuffle" = prefs.mode;
let restoreTime = prefs.time;
let generation = 0;
let loading = false;
let errorKey: MessageKey | null = null;
let lastSaved = 0;
let scrubbing = false;

function save() {
	try {
		localStorage.setItem(
			key,
			JSON.stringify({
				id: currentId,
				time: restoreTime ?? audio.currentTime,
				volume: audio.volume,
				muted: audio.muted,
				mode,
			}),
		);
	} catch {}
}
function fillRange(input: HTMLInputElement, fraction: number) {
	input.style.setProperty(
		"--range-fill",
		`${Math.max(0, Math.min(100, fraction * 100))}%`,
	);
}
function syncTimeline() {
	const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
	seek.disabled = duration <= 0;
	seek.max = String(duration || 100);
	if (!scrubbing) seek.value = String(audio.currentTime || 0);
	const position = scrubbing ? Number(seek.value) : audio.currentTime;
	$("#music-current").textContent = formatMusicTime(position);
	$("#music-duration").textContent = formatMusicTime(duration);
	seek.setAttribute(
		"aria-valuetext",
		`${formatMusicTime(position)} / ${formatMusicTime(duration)}`,
	);
	fillRange(seek, duration ? position / duration : 0);
}
function sync() {
	const playing = !audio.paused && !audio.ended;
	player.classList.toggle("is-playing", playing);
	player.classList.toggle("is-loading", loading);
	$(".play-icon").hidden = playing || loading;
	$(".pause-icon").hidden = !playing || loading;
	$(".loading-icon").hidden = !loading;
	playButton.setAttribute(
		"aria-label",
		t(errorKey ? "retryMusic" : playing ? "pause" : "play"),
	);
	playButton.setAttribute("aria-pressed", String(playing));
	playButton.setAttribute("aria-busy", String(loading));
	const silent = audio.muted || audio.volume === 0;
	$(".sound-on").hidden = silent;
	$(".sound-off").hidden = !silent;
	$("#music-mute").setAttribute("aria-label", t(silent ? "unmute" : "mute"));
	$("#music-mute").setAttribute("aria-pressed", String(silent));
	volume.value = String(audio.volume);
	fillRange(volume, silent ? 0 : audio.volume);
	const label = t(
		(
			{
				list: "repeatList",
				single: "repeatOne",
				shuffle: "shuffleMusic",
			} as const
		)[mode],
	);
	$("#music-mode").setAttribute("aria-label", label);
	$("#music-mode").title = label;
	player
		.querySelectorAll<HTMLElement>("[data-mode-icon]")
		.forEach((el) => (el.hidden = el.dataset.modeIcon !== mode));
	const status = $("#music-status");
	status.hidden = !errorKey;
	status.textContent = errorKey ? t(errorKey) : "";
	player
		.querySelectorAll<HTMLButtonElement>("[data-track-id]")
		.forEach((button) => {
			if (button.dataset.trackId === currentId)
				button.setAttribute("aria-current", "true");
			else button.removeAttribute("aria-current");
		});
	if (!currentId) $("#music-title").textContent = t("songPlaceholder");
	syncMini();
}
async function play() {
	if (!currentId) return;
	const token = generation;
	if (audio.error) {
		restoreTime = 0;
		audio.load();
	}
	errorKey = null;
	loading = true;
	sync();
	try {
		await audio.play();
	} catch (error) {
		if (token !== generation || (error as DOMException).name === "AbortError")
			return;
		errorKey =
			(error as DOMException).name === "NotAllowedError"
				? "tapToPlay"
				: "musicLoadError";
	} finally {
		if (token === generation) {
			loading = false;
			sync();
		}
	}
}
function chooseTrack(id: string, autoplay = false, position = 0) {
	const track = musicTracks.find((track) => track.id === id && track.src);
	if (!track) return;
	generation++;
	audio.pause();
	currentId = id;
	restoreTime = position;
	loading = false;
	errorKey = null;
	scrubbing = false;
	$("#music-title").textContent = track.title;
	$("#music-title").title = track.title;
	$("#music-artist").textContent = track.artist;
	cover.hidden = !track.cover;
	if (track.cover) cover.src = track.cover;
	else cover.removeAttribute("src");
	audio.src = track.src;
	audio.load();
	syncTimeline();
	sync();
	save();
	if (autoplay) void play();
}
function skip(direction: number, ended = false) {
	const id = nextTrack(musicTracks, currentId, { direction, mode, ended });
	if (id) chooseTrack(id, true);
}
playButton.onclick = () => {
	if (audio.paused) void play();
	else audio.pause();
};
$("#music-prev").onclick = () => skip(-1);
$("#music-next").onclick = () => skip(1);
$("#music-mode").onclick = () => {
	mode = mode === "list" ? "single" : mode === "single" ? "shuffle" : "list";
	sync();
	save();
};
$("#music-list-toggle").onclick = () => {
	const list = $("#music-playlist");
	list.hidden = !list.hidden;
	$("#music-list-toggle").setAttribute("aria-expanded", String(!list.hidden));
};
$("#music-mute").onclick = () => {
	if (audio.volume === 0) {
		audio.volume = musicDefaults.volume;
		audio.muted = false;
	} else audio.muted = !audio.muted;
};
volume.oninput = () => {
	audio.volume = Number(volume.value);
	if (audio.volume > 0) audio.muted = false;
};
seek.oninput = () => {
	scrubbing = true;
	if (Number.isFinite(audio.duration)) {
		audio.currentTime = Number(seek.value);
		restoreTime = null;
	}
	syncTimeline();
	save();
};
for (const event of ["change", "pointerup", "keyup", "blur"])
	seek.addEventListener(event, () => {
		scrubbing = false;
		syncTimeline();
	});
player
	.querySelectorAll<HTMLButtonElement>("[data-track-id]")
	.forEach((button) => {
		button.onclick = () => {
			const id = button.dataset.trackId!;
			if (id === currentId) {
				if (audio.paused) void play();
				else audio.pause();
			} else chooseTrack(id, true);
		};
	});
cover.addEventListener("error", () => {
	cover.hidden = true;
});
player.querySelectorAll<HTMLImageElement>(".track-cover img").forEach((img) =>
	img.addEventListener("error", () => {
		img.hidden = true;
	}),
);
audio.addEventListener("loadedmetadata", () => {
	if (restoreTime !== null && Number.isFinite(audio.duration)) {
		audio.currentTime = restoreTime < audio.duration ? restoreTime : 0;
		restoreTime = null;
	}
	syncTimeline();
});
audio.addEventListener("durationchange", syncTimeline);
audio.addEventListener("timeupdate", () => {
	syncTimeline();
	if (Date.now() - lastSaved > 5000) {
		lastSaved = Date.now();
		save();
	}
});
audio.addEventListener("play", () => {
	errorKey = null;
	sync();
});
audio.addEventListener("playing", () => {
	loading = false;
	sync();
});
audio.addEventListener("waiting", () => {
	if (!audio.paused) loading = true;
	sync();
});
audio.addEventListener("pause", () => {
	loading = false;
	sync();
	save();
});
audio.addEventListener("volumechange", () => {
	sync();
	save();
});
audio.addEventListener("ended", () => skip(1, true));
audio.addEventListener("error", () => {
	loading = false;
	errorKey = "musicLoadError";
	sync();
});
window.addEventListener("pagehide", save);
window.addEventListener("roxy:language", sync);
audio.volume = prefs.volume;
audio.muted = prefs.muted;
if (currentId) chooseTrack(currentId, false, prefs.time);
else sync();

// Both controls reference the same persisted player/audio; only page drawers are rebound.
const mini = document.querySelector<HTMLElement>("#music-mini")!;
const miniPlay = mini.querySelector<HTMLButtonElement>("#music-mini-play")!;
function syncMini() {
	// Initialization sync can run before these bindings are assigned.
	const el = document.querySelector<HTMLElement>("#music-mini");
	if (!el) return;
	const track = musicTracks.find((item) => item.id === currentId);
	el.querySelector("#music-mini-title")!.textContent =
		track?.title || t("songPlaceholder");
	const img = el.querySelector<HTMLImageElement>("img")!;
	if (track?.cover && img.getAttribute("src") !== track.cover)
		img.src = track.cover;
	img.hidden = !track?.cover;
	const button = el.querySelector<HTMLButtonElement>("#music-mini-play")!;
	button.textContent = audio.paused ? "▶" : "Ⅱ";
	button.disabled = !currentId;
	button.setAttribute("aria-label", t(audio.paused ? "play" : "pause"));
}
miniPlay.onclick = () => {
	if (audio.paused) void play();
	else audio.pause();
};
mini.querySelector<HTMLButtonElement>("#music-mini-collapse")!.onclick = () => {
	mini.classList.toggle("collapsed");
	try {
		localStorage.setItem(
			"roxy-mini-collapsed",
			String(mini.classList.contains("collapsed")),
		);
	} catch {}
};
mini.querySelector<HTMLButtonElement>("#music-mini-expand")!.onclick = () => {
	if (mini.classList.contains("collapsed")) {
		mini.classList.remove("collapsed");
		try {
			localStorage.setItem("roxy-mini-collapsed", "false");
		} catch {}
		return;
	}
	const sidebar = document.querySelector<HTMLElement>("#right-sidebar")!;
	document.body.classList.add("music-expanded");
	sidebar.classList.add("drawer-open");
	document.body.style.overflow = "hidden";
	sidebar.querySelector<HTMLButtonElement>(".drawer-close")?.focus();
};
document.addEventListener("astro:page-load", () => {
	document
		.querySelectorAll<HTMLButtonElement>(".drawer-close")
		.forEach((button) =>
			button.addEventListener("click", () =>
				document.body.classList.remove("music-expanded"),
			),
		);
	syncMini();
});
window.addEventListener("keydown", (event) => {
	if (event.key === "Escape") document.body.classList.remove("music-expanded");
});
try {
	mini.classList.toggle(
		"collapsed",
		localStorage.getItem("roxy-mini-collapsed") === "true",
	);
} catch {}
syncMini();
