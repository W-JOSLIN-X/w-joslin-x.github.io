import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import {
	assertPublicContent,
	inferredUpdated,
} from "../src/utils/content-policy.mjs";

test("unsupported privacy flags fail before public content generation", () => {
	for (const data of [
		{ encrypted: true },
		{ encrypted: "true" },
		{ password: "secret" },
		{ passwordHint: "hint" },
		{ hideHomeContent: true },
	]) {
		assert.throws(
			() => assertPublicContent(data, "fixture"),
			/fixture:.*unsupported/,
		);
	}
	assert.doesNotThrow(() =>
		assertPublicContent({ draft: true, encrypted: false }),
	);
});

test("inferred updates use UTC date precision and never precede publication", () => {
	assert.equal(
		inferredUpdated("2026-09-22", "2026-09-22").toISOString(),
		"2026-09-22T00:00:00.000Z",
	);
	assert.equal(
		inferredUpdated("2026-09-22T18:00:00Z", "2026-09-21").toISOString(),
		"2026-09-22T18:00:00.000Z",
	);
});

test("actual Wiki plugin exposes public cards but no draft metadata or broken private links", () => {
	// Isolated subprocess: replace only the content directory reads, never write fixture posts.
	const script = `
import fs from 'node:fs';
import path from 'node:path';
import {syncBuiltinESMExports} from 'node:module';
import assert from 'node:assert/strict';
const root = path.resolve('content/posts');
const fixtures = {'draft.md':'---\\ntitle: PRIVATE TITLE\\ndescription: PRIVATE BODY\\ndraft: true\\n---\\n', 'public.md':'---\\ntitle: Public title\\npublished: 2026-09-22\\n---\\n'};
const read = fs.readFileSync, list = fs.readdirSync, stat = fs.statSync;
fs.readdirSync = (dir,...args) => path.resolve(String(dir)) === root ? Object.keys(fixtures).map(name=>({name,isDirectory:()=>false})) : list(dir,...args);
fs.readFileSync = (file,...args) => path.dirname(String(file)) === root && fixtures[path.basename(String(file))] ? fixtures[path.basename(String(file))] : read(file,...args);
fs.statSync = (file,...args) => path.dirname(String(file)) === root && fixtures[path.basename(String(file))] ? {isFile:()=>true} : stat(file,...args);
syncBuiltinESMExports();
const {remarkWikiLink} = await import('./src/plugins/remark-wiki-link.mjs');
const tree = {type:'root',children:['[[draft]]','[[draft|Alias]]','[[public]]'].map(value=>({type:'paragraph',children:[{type:'text',value}]}))};
await remarkWikiLink()(tree,{path:path.join(root,'current.md')});
const result = JSON.stringify(tree);
assert.ok(!result.includes('PRIVATE'));
assert.ok(!result.includes('/posts/draft'));
assert.ok(result.includes('Public title'));
assert.ok(result.includes('Alias'));
`;
	execFileSync(
		process.execPath,
		["--experimental-strip-types", "--input-type=module", "-e", script],
		{ cwd: new URL("../", import.meta.url), stdio: "pipe" },
	);
});
