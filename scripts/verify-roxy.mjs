import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
const root=path.resolve('dist');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
const html=walk(root).filter(p=>p.endsWith('.html'));
let checked=0;
for(const file of html){const page=parse(fs.readFileSync(file,'utf8'));for(const el of page.querySelectorAll('[href],[src],[data-track-src]')){const ref=el.getAttribute('href')||el.getAttribute('src')||el.getAttribute('data-track-src');if(!ref?.startsWith('/')||ref.startsWith('//'))continue;const relative=decodeURIComponent(ref.split(/[?#]/)[0]);let target=path.join(root,relative);if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');assert.ok(fs.existsSync(target),`Broken local asset/link in ${file}: ${ref}`);checked++}}
assert.ok(!fs.existsSync('dist/archive'),'No archive route should be generated');
const manifest=JSON.parse(fs.readFileSync('src/data/roxy-downloads.json','utf8'));
for (const item of Object.values(manifest)) {
  assert.ok(/\.(md|zip)$/.test(item.file), `Unexpected download format: ${item.file}`);
  assert.ok(fs.existsSync(path.join(root, 'downloads', item.file)), `Missing download: ${item.file}`);
}
console.log(`Verified ${html.length} pages, ${checked} internal links/assets and download rules.`);
