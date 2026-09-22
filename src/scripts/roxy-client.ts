const root = document.documentElement;
const $ = <T extends HTMLElement = HTMLElement>(s:string) => document.querySelector<T>(s)!;
function save(){try{localStorage.setItem('roxy-appearance',JSON.stringify({...root.dataset,color:root.style.getPropertyValue('--accent')}))}catch{}}
function syncSettings(){document.querySelectorAll<HTMLButtonElement>('#appearance [data-mode]').forEach(b=>{const active=b.dataset.mode===root.dataset.mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});for(const name of ['soft','waves','dynamic']){const el=$<HTMLInputElement>(`#setting-${name}`);el.checked=root.dataset[name]==='true'||(name==='waves'&&root.dataset[name]!=='false')}}
$('#appearance-open').onclick=()=>{syncSettings();$<HTMLDialogElement>('#appearance').showModal()};
document.querySelectorAll<HTMLButtonElement>('[data-close-dialog]').forEach(b=>b.onclick=()=>b.closest('dialog')?.close());
document.querySelectorAll<HTMLDialogElement>('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
$('#theme-toggle').onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';root.classList.toggle('dark',root.dataset.theme==='dark');save()};
root.classList.toggle('dark',root.dataset.theme==='dark');
document.querySelectorAll<HTMLButtonElement>('#appearance [data-mode]').forEach(b=>b.onclick=()=>{root.dataset.mode=b.dataset.mode;save();syncSettings()});
document.querySelectorAll<HTMLButtonElement>('[data-color]').forEach(b=>b.onclick=()=>{root.style.setProperty('--accent',b.dataset.color!);save();document.querySelectorAll('[data-color]').forEach(c=>c.classList.toggle('active',c===b))});
$<HTMLInputElement>('#custom-color').oninput=e=>{root.style.setProperty('--accent',(e.target as HTMLInputElement).value);save()};
for(const name of ['soft','waves','dynamic'])$<HTMLInputElement>(`#setting-${name}`).onchange=e=>{root.dataset[name]=String((e.target as HTMLInputElement).checked);save()};
$('#reset-appearance').onclick=()=>{root.dataset.mode='banner';root.dataset.theme='light';root.dataset.soft='false';root.dataset.waves='true';root.dataset.dynamic='false';root.classList.remove('dark');root.style.removeProperty('--accent');save();syncSettings()};
let drawerTrigger:HTMLButtonElement|null=null;
function closeDrawer(){document.querySelectorAll('.drawer-open').forEach(e=>e.classList.remove('drawer-open'));document.body.style.overflow='';drawerTrigger?.focus();drawerTrigger=null}
document.querySelectorAll<HTMLButtonElement>('[data-drawer]').forEach(b=>b.onclick=()=>{closeDrawer();drawerTrigger=b;const drawer=document.getElementById(b.dataset.drawer!)!;drawer.classList.add('drawer-open');document.body.style.overflow='hidden';drawer.querySelector<HTMLButtonElement>('.drawer-close')?.focus()});
document.querySelectorAll<HTMLButtonElement>('.drawer-close').forEach(b=>b.onclick=closeDrawer);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer();const drawer=document.querySelector('.drawer-open');if(drawer&&e.key==='Tab'){const els=Array.from(drawer.querySelectorAll<HTMLElement>('button,a,input,select')).filter(el=>el.getClientRects().length&&!el.hasAttribute('disabled'));const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}});
window.matchMedia('(min-width:951px)').addEventListener('change',closeDrawer);
$('#back-top').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
$('#focus-search').onclick=()=>{const input=document.querySelector<HTMLInputElement>('#search-input');if(input){input.scrollIntoView({block:'center'});input.focus()}else location.href='/?search=1#main'};
document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-selected',String(x===b))});document.querySelectorAll<HTMLElement>('[data-tab-panel]').forEach(p=>p.hidden=p.dataset.tabPanel!==b.dataset.tab)});
const records=JSON.parse($('#activity-data').textContent||'[]') as {date:string,hash:string,message:string,url:string}[];
document.querySelectorAll<HTMLButtonElement>('[data-day]').forEach(b=>b.onclick=()=>{$('#activity-title').textContent=`${b.dataset.day} · 修改记录`;const list=$('#activity-records');list.replaceChildren();const rows=records.filter(r=>r.date===b.dataset.day);if(!rows.length){const p=document.createElement('p');p.textContent='这一天没有内容提交记录。';list.append(p)}for(const r of rows){const a=document.createElement('a');a.href=r.url;a.target='_blank';a.rel='noopener';a.textContent=`${r.message} · ${r.hash.slice(0,7)} ↗`;list.append(a)}$<HTMLDialogElement>('#activity-dialog').showModal()});
const headings=Array.from(document.querySelectorAll<HTMLElement>('.prose h2[id],.prose h3[id]'));
if(headings.length){const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)document.querySelectorAll<HTMLAnchorElement>('.toc a').forEach(a=>a.classList.toggle('current',decodeURIComponent(a.hash.slice(1))===e.target.id))},{rootMargin:'-10% 0px -65% 0px'});headings.forEach(h=>observer.observe(h))}
document.querySelectorAll('.toc a').forEach(a=>a.addEventListener('click',closeDrawer));
document.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach(button=>{
 button.setAttribute('aria-label','复制代码');
 button.onclick=async()=>{const code=button.closest('figure')?.querySelector('code');if(!code)return;const lines=Array.from(code.querySelectorAll('.ec-line .code'));const text=lines.length?lines.map(line=>(line.textContent||'').replace(/\n$/,'')).join('\n'):code.textContent||'';try{await navigator.clipboard.writeText(text);button.setAttribute('aria-label','代码已复制');button.classList.add('copied');setTimeout(()=>{button.setAttribute('aria-label','复制代码');button.classList.remove('copied')},1800)}catch{button.setAttribute('aria-label','复制失败，请手动选中代码')}};
});
