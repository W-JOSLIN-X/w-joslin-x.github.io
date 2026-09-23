import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import matter from 'gray-matter';
const base=path.resolve('src/content/posts');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
const files=walk(base).filter(p=>/\.md$/.test(p));
fs.mkdirSync('public/downloads',{recursive:true});
fs.mkdirSync('src/data',{recursive:true});
function crc32(buffer){let c=0xffffffff;for(const b of buffer){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^0xffffffff)>>>0}
// ZIP store mode: UTF-8 filenames, deterministic bytes, no shell or extra runtime.
function zip(entries){let offset=0;const body=[],central=[];for(const [name,data]of entries){const n=Buffer.from(name);const header=Buffer.alloc(30);header.writeUInt32LE(0x04034b50);header.writeUInt16LE(20,4);header.writeUInt16LE(0x800,6);header.writeUInt16LE(33,12);header.writeUInt32LE(crc32(data),14);header.writeUInt32LE(data.length,18);header.writeUInt32LE(data.length,22);header.writeUInt16LE(n.length,26);body.push(header,n,data);const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt16LE(33,14);c.writeUInt32LE(crc32(data),16);c.writeUInt32LE(data.length,20);c.writeUInt32LE(data.length,24);c.writeUInt16LE(n.length,28);c.writeUInt32LE(offset,42);central.push(c,n);offset+=header.length+n.length+data.length}const cd=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(cd.length,12);end.writeUInt32LE(offset,16);return Buffer.concat([...body,cd,end])}
const manifest={};
for(const file of files){const raw=fs.readFileSync(file,'utf8');const {data}=matter(raw);if(data.draft)continue;const source=path.relative(base,file).replaceAll('\\','/');const slug=source.replace(/\.md$/,'').replace(/\/index$/,'');const flat=slug.replaceAll('/','--');let rewritten=raw;const images=new Map();const refs=[...raw.matchAll(/!\[[^\]]*\]\(<?([^\s)>]+)>?(?:\s+[^)]*)?\)/g)];for(const match of refs){const src=match[1];if(/^(https?:|data:|\/\/)/.test(src))continue;const decoded=decodeURIComponent(src.split(/[?#]/)[0]);const target=src.startsWith('/')?path.resolve('public','.'+decoded):path.resolve(path.dirname(file),decoded);const allowed=[base,path.resolve('public')].some(root=>target.startsWith(root+path.sep));if(!allowed)throw Error(`图片路径超出内容目录: ${src}`);if(!fs.existsSync(target))throw Error(`缺少图片: ${file}: ${src}`);if(!images.has(target))images.set(target,`images/${images.size+1}-${path.basename(target)}`);rewritten=rewritten.replace(match[0],match[0].replace(src,images.get(target)))}const output=images.size?`${flat}.zip`:`${flat}.md`;if(images.size){fs.writeFileSync(path.join('public/downloads',output),zip([[`${flat}.md`,Buffer.from(rewritten)],...[...images].map(([file,name])=>[name,fs.readFileSync(file)])]))}else fs.writeFileSync(path.join('public/downloads',output),raw);manifest[slug]={file:output,source};}
fs.writeFileSync('src/data/roxy-downloads.json',JSON.stringify(manifest,null,2)+'\n');
let activity=[];
try{const remote=execFileSync('git',['remote','get-url','origin'],{encoding:'utf8'}).trim();if(/W-JOSLIN-X\/w-joslin-x.github.io(?:\.git)?$/i.test(remote)){const log=execFileSync('git',['log','--format=%H%x09%cI%x09%s','--','src/content/posts'],{encoding:'utf8',maxBuffer:8*1024*1024});activity=log.trim().split('\n').filter(Boolean).map(line=>{const [hash,date,...message]=line.split('\t');return{hash,date:new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date(date)),message:message.join('\t'),url:`https://github.com/W-JOSLIN-X/w-joslin-x.github.io/commit/${hash}`}})}}catch{/* No project history yet. */}
// Associate commits with current article folders, including edits to their images.
for (const record of activity) {
 const changed=execFileSync('git',['diff-tree','--root','--no-commit-id','--name-only','-r',record.hash,'--','src/content/posts'],{encoding:'utf8'}).trim().split('\n');
 record.posts=Object.entries(manifest).filter(([,item])=>{
  const article=`src/content/posts/${item.source}`;
  const folder=path.posix.dirname(article)+'/';
  return changed.some(file=>file===article||(item.source.endsWith('/index.md')&&file.startsWith(folder)));
 }).map(([slug])=>slug);
}
fs.writeFileSync('src/data/roxy-activity.json',JSON.stringify(activity,null,2)+'\n');
console.log(`Prepared ${Object.keys(manifest).length} article downloads; ${activity.length} content commits.`);
