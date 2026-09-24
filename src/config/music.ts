import library from "../../.generated/library.json";
export interface MusicTrack {
	id: string;
	title: string;
	artist: string;
	album?: string;
	src: string;
	cover?: string;
}
export const musicTracks: MusicTrack[] = library.music;
export const musicDefaults = { volume: 0.65, mode: "list" as const };
