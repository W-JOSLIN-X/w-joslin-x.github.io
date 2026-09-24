import { execFileSync } from "node:child_process";

const roots = ["src/content/posts/", "content/posts/"];
const relative = (file) =>
	roots.reduce(
		(value, root) =>
			value.startsWith(root) ? value.slice(root.length) : value,
		file,
	);
export function contentHistory(manifest, cwd = process.cwd()) {
	const git = (args) =>
		execFileSync("git", args, {
			cwd,
			encoding: "utf8",
			maxBuffer: 16 * 1024 * 1024,
		}).trim();
	const records = [];
	// An unborn branch is valid; other Git failures must not silently erase history.
	if (!git(["rev-list", "--all", "--max-count=1"])) return records;
	const lines = git(["log", "--format=%H%x09%cI%x09%s", "--", ...roots])
		.split("\n")
		.filter(Boolean);
	for (const line of lines) {
		const [hash, time, ...message] = line.split("\t");
		const changes = git([
			"diff-tree",
			"--root",
			"-M",
			"--no-commit-id",
			"--name-status",
			"-r",
			hash,
		])
			.split("\n")
			.filter(Boolean);
		const changed = [];
		for (const change of changes) {
			const [status, ...paths] = change.split("\t");
			// Pure moves between old/new content roots are maintenance, not edits.
			if (
				status === "R100" &&
				paths.every((file) => roots.some((root) => file.startsWith(root))) &&
				relative(paths[0]) === relative(paths[1])
			)
				continue;
			for (const file of paths)
				if (roots.some((root) => file.startsWith(root)))
					changed.push(relative(file));
		}
		if (!changed.length) continue;
		const posts = Object.entries(manifest)
			.filter(([, item]) =>
				changed.some(
					(file) =>
						file === item.source ||
						(item.source.endsWith("/index.md") &&
							file.startsWith(item.source.slice(0, -8))),
				),
			)
			.map(([slug]) => slug);
		records.push({
			hash,
			date: new Intl.DateTimeFormat("sv-SE", {
				timeZone: "Asia/Shanghai",
			}).format(new Date(time)),
			message: message.join("\t"),
			url: `https://github.com/W-JOSLIN-X/w-joslin-x.github.io/commit/${hash}`,
			posts,
		});
	}
	return records;
}
