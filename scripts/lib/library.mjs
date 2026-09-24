import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const readYaml = (file) =>
	matter(`---\n${fs.readFileSync(file, "utf8")}\n---`).data;
export function resource(folder, relative, optional = false) {
	if (!relative && optional) return null;
	if (typeof relative !== "string" || !relative)
		throw Error(`${folder}: missing resource path`);
	const root = path.resolve(folder),
		target = path.resolve(root, relative);
	if (
		!target.startsWith(root + path.sep) ||
		!fs.existsSync(target) ||
		!fs.statSync(target).isFile()
	) {
		throw Error(`${folder}: missing or invalid resource ${relative}`);
	}
	return target;
}
export function loadLibrary(base = "content") {
	const catalog = readYaml(path.join(base, "catalog.yaml"));
	const result = {
		backgrounds: [],
		music: [],
		defaultBackgrounds: catalog.defaultBackgrounds,
	};
	for (const kind of ["backgrounds", "music"]) {
		const ids = catalog[kind];
		if (
			!Array.isArray(ids) ||
			ids.some(
				(id) => typeof id !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(id),
			) ||
			new Set(ids).size !== ids.length
		)
			throw Error(`catalog.yaml: invalid or duplicate ${kind} IDs`);
		const folders = fs
			.readdirSync(path.join(base, kind), { withFileTypes: true })
			.filter((e) => e.isDirectory())
			.map((e) => e.name);
		for (const id of folders)
			if (!ids.includes(id))
				throw Error(`catalog.yaml: ${kind}/${id} is not registered`);
		for (const id of ids) {
			const folder = path.join(base, kind, id),
				meta = readYaml(path.join(folder, "meta.yaml"));
			if (typeof meta.title !== "string" || !meta.title.trim())
				throw Error(`${folder}: title is required`);
			if (kind === "music" && typeof meta.artist !== "string")
				throw Error(`${folder}: artist is required`);
			for (const field of kind === "backgrounds"
				? ["image"]
				: ["audio", "cover"])
				resource(folder, meta[field], kind === "music");
			result[kind].push({ ...meta, id, folder });
		}
	}
	if (
		!Array.isArray(result.defaultBackgrounds) ||
		!result.defaultBackgrounds.length ||
		new Set(result.defaultBackgrounds).size !==
			result.defaultBackgrounds.length ||
		result.defaultBackgrounds.some((id) => !catalog.backgrounds.includes(id))
	)
		throw Error("catalog.yaml: invalid defaultBackgrounds");
	return result;
}
