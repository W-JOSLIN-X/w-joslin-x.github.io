import {matchesPost} from '../utils/roxy-filter.mjs';
import {matchesDay} from '../utils/roxy-calendar.mjs';
import {t} from '../utils/roxy-i18n';
type Post={id:string;slug:string;title:string;href:string;published:string;updated:string;tags:string[];moods:string[];text:string;category:string};
const data:Post[]=JSON.parse(document.querySelector('#search-data')!.textContent!);
const records=JSON.parse(document.querySelector('#activity-data')!.textContent||'[]');
const input=document.querySelector<HTMLInputElement>('#search-input')!;
const scope=document.querySelector<HTMLSelectElement>('#search-scope')!;
const browse=document.querySelector<HTMLElement>('#feed-root')!.dataset.browse==='true';
let limit=12;
function update(){
 const params=new URLSearchParams(location.search);
 input.value=params.get('q')||'';scope.value=params.get('scope')==='full'?'full':'title';
 const category=params.get('type')||'', tags=params.getAll('tag'), moods=params.getAll('mood'), date=params.get('date')||'';
 const filtered=data.filter(p=>matchesPost(p,{q:input.value,scope:scope.value,category,tags,moods})&&matchesDay(p,date,records));
 const visible=new Set(filtered.slice(0,limit).map(p=>p.id));
 const timeline=browse||params.size>0;
 document.querySelector<HTMLElement>('#post-feed')!.hidden=timeline;
 document.querySelector<HTMLElement>('#timeline')!.hidden=!timeline||!filtered.length;
 document.querySelector<HTMLElement>('.result-heading')!.hidden=!timeline;
 document.querySelector('#result-count')!.textContent=String(filtered.length);
 for(const selector of ['.feed-entry','.timeline-entry']){let group='';document.querySelectorAll<HTMLElement>(selector).forEach(el=>{el.hidden=!visible.has(el.dataset.postId!);if(el.hidden)return;const key=el.dataset.month||el.dataset.year!;const heading=el.querySelector<HTMLElement>('h2')!;if(selector==='.timeline-entry')heading.hidden=group===key;else{heading.hidden=false;heading.classList.toggle('group-repeat',group===key)}group=key;if(selector==='.timeline-entry')heading.querySelector('small')!.textContent=`${filtered.filter(p=>p.published.startsWith(key)).length} ${t('posts')}`})}
 document.querySelector<HTMLElement>('#no-results')!.hidden=!!filtered.length;
 document.querySelector<HTMLElement>('#load-more')!.hidden=filtered.length<=limit;
 document.querySelectorAll<HTMLElement>('[data-category],[data-filter-tag],[data-filter-mood]').forEach(el=>{const active=el.dataset.category!==undefined?category===el.dataset.category:el.dataset.filterTag!==undefined?tags.includes(el.dataset.filterTag):moods.includes(el.dataset.filterMood!);el.classList.toggle('active',active);el.setAttribute('aria-current',active?'true':'false')});
 const chips=document.querySelector<HTMLElement>('#active-filters')!;chips.replaceChildren();
 for(const [key,value] of params){if(key==='scope')continue;const button=document.createElement('button');button.className='chip active';button.textContent=`${value} ×`;button.onclick=()=>{const next=new URLSearchParams(location.search);next.delete(key,value);navigate(next)};chips.append(button)}chips.hidden=!chips.childElementCount;
 const commits=records.filter((r:any)=>r.date===date),box=document.querySelector<HTMLElement>('#date-commits')!;box.hidden=!date||!commits.length;const list=box.querySelector('div')!;list.replaceChildren();for(const r of commits){const a=document.createElement('a');a.href=r.url;a.target='_blank';a.rel='noopener';a.textContent=`${r.message} ↗`;list.append(a)}
 window.dispatchEvent(new Event('roxy:filters'));
}
function navigate(params:URLSearchParams){limit=12;history.pushState(null,'',`${location.pathname}${params.size?'?'+params:''}`);update()}
if(browse){
 document.addEventListener('click',e=>{const link=(e.target as Element).closest<HTMLAnchorElement>('a[data-category],a[data-filter-tag],a[data-filter-mood],a[data-reset-filter],a[data-calendar-date]');if(!link||e instanceof MouseEvent&&(e.metaKey||e.ctrlKey||e.shiftKey||e.button!==0))return;e.preventDefault();const params=new URLSearchParams(location.search);
 if(link.hasAttribute('data-reset-filter')){navigate(new URLSearchParams());return}
 const [key,value]=link.dataset.category!==undefined?['type',link.dataset.category]:link.dataset.filterTag!==undefined?['tag',link.dataset.filterTag]:link.dataset.filterMood!==undefined?['mood',link.dataset.filterMood]:['date',link.dataset.calendarDate!];
 if(key==='tag'||key==='mood'){params.getAll(key).includes(value!)?params.delete(key,value):params.append(key,value!)}else if(value)params.set(key,value);else params.delete(key);navigate(params);
 });
 document.querySelector<HTMLFormElement>('.nav-search')!.onsubmit=e=>{e.preventDefault();const params=new URLSearchParams(location.search);input.value?params.set('q',input.value):params.delete('q');scope.value==='full'?params.set('scope','full'):params.delete('scope');navigate(params)};
 let timer:ReturnType<typeof setTimeout>;input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>document.querySelector<HTMLFormElement>('.nav-search')!.requestSubmit(),200)});scope.addEventListener('change',()=>document.querySelector<HTMLFormElement>('.nav-search')!.requestSubmit());
}
window.addEventListener('popstate',()=>{limit=12;update()});window.addEventListener('roxy:language',update);
document.querySelector<HTMLButtonElement>('#load-more')!.onclick=()=>{limit+=12;update()};update();
