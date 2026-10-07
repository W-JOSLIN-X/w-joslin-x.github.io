import { spawn } from "node:child_process";

const mode = process.argv[2];
if (!["dev", "build"].includes(mode))
	throw new Error("Usage: node scripts/live2d.mjs <dev|build>");
const child = spawn(
	process.execPath,
	["node_modules/astro/bin/astro.mjs", mode, ...process.argv.slice(3)],
	{
		stdio: "inherit",
		env: { ...process.env, PUBLIC_LIVE2D_ENABLED: "true" },
	},
);
child.on("exit", (code) => {
	process.exitCode = code ?? 1;
});
child.on("error", (error) => {
	console.error(error);
	process.exitCode = 1;
});
