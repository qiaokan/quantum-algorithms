const storage={get(key:string,fallback=''){try{return localStorage.getItem(key)||fallback}catch{return fallback}},set(key:string,value:string){try{localStorage.setItem(key,value)}catch{/* private mode: reading still works */}}};
const $=<T extends HTMLElement>(s:string)=>document.querySelector<T>(s)!;
const theme=$<HTMLButtonElement>('#theme-toggle');
function syncTheme(){const dark=document.documentElement.dataset.theme==='dark';theme.textContent=dark?'Light theme':'Dark theme';theme.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} theme`)}
theme.onclick=()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';storage.set('qa-theme',document.documentElement.dataset.theme);syncTheme()};syncTheme();
const menu=$<HTMLButtonElement>('#menu-toggle'),sidebar=$('#sidebar'),backdrop=$('#menu-backdrop');
const mobileQuery=window.matchMedia('(max-width:800px)');
function syncSidebarAccess(){const hidden=mobileQuery.matches&&!document.body.classList.contains('menu-open');sidebar.inert=hidden;sidebar.setAttribute('aria-hidden',String(hidden))};
mobileQuery.addEventListener('change',syncSidebarAccess);syncSidebarAccess();
function closeMenu(){document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');backdrop.hidden=true;syncSidebarAccess();}
menu.onclick=()=>{const open=menu.getAttribute('aria-expanded')!=='true';document.body.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));backdrop.hidden=!open;syncSidebarAccess();if(open)$('#menu-close').focus()};
$('#menu-close').onclick=()=>{closeMenu();menu.focus()};backdrop.onclick=closeMenu;
sidebar.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menu.focus()}if(e.key==='Tab'&&document.body.classList.contains('menu-open')){const items=[...sidebar.querySelectorAll<HTMLElement>('a,button,summary')].filter(el=>el.getClientRects().length);const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName)){e.preventDefault();location.href='/search/'}if(e.key==='Escape'&&document.body.classList.contains('menu-open'))closeMenu()});
const detailButton=document.querySelector<HTMLButtonElement>('#full-detail');
function expandDetails(open:boolean){document.querySelectorAll<HTMLDetailsElement>('#main details').forEach(d=>d.open=open);detailButton?.setAttribute('aria-pressed',String(open));if(detailButton)detailButton.textContent=open?'Collapse optional derivations':'Show all derivations'}
if(detailButton)detailButton.onclick=()=>{const open=detailButton.getAttribute('aria-pressed')!=='true';expandDetails(open);storage.set('qa-full-detail',String(open))};
if(storage.get('qa-full-detail')==='true')expandDetails(true);
let beforePrint:HTMLDetailsElement[]=[];
window.addEventListener('beforeprint',()=>{beforePrint=[...document.querySelectorAll<HTMLDetailsElement>('#main details:not([open])')];beforePrint.forEach(d=>d.open=true)});
window.addEventListener('afterprint',()=>beforePrint.forEach(d=>d.open=false));
const printButton=document.querySelector<HTMLButtonElement>('#print-page');if(printButton)printButton.onclick=()=>window.print();
const sectionLinks=[...document.querySelectorAll<HTMLAnchorElement>('[data-section-link]')];
let activeSection='';
function updateSection(){const sections=sectionLinks.map(a=>document.getElementById(a.dataset.sectionLink!)).filter((x):x is HTMLElement=>!!x);const active=sections.filter(s=>s.getBoundingClientRect().top<=150).at(-1)||sections[0];if(!active)return;activeSection=active.id;sectionLinks.forEach(a=>a.setAttribute('aria-current',a.dataset.sectionLink===active.id?'location':'false'))}
let ticking=false;
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{updateSection();ticking=false});ticking=true}},{passive:true});updateSection();
const lesson=document.querySelector<HTMLElement>('[data-lesson-id]');
if(lesson){
 const key=lesson.dataset.lessonId!;
 let progress:Record<string,string>={};try{progress=JSON.parse(storage.get('qa-progress','{}'))}catch{}
 const controls=[...document.querySelectorAll<HTMLButtonElement>('[data-progress]')];
 function updateProgress(){controls.forEach(b=>b.setAttribute('aria-pressed',String(progress[key]===b.dataset.progress)));const status=document.querySelector('[data-progress-status]');if(status)status.textContent=progress[key]?`Your status: ${progress[key]}`:'No learning status selected.'}
 controls.forEach(b=>b.onclick=()=>{if(progress[key]===b.dataset.progress)delete progress[key];else progress[key]=b.dataset.progress!;storage.set('qa-progress',JSON.stringify(progress));updateProgress()});updateProgress();
 const saveLocation=()=>{storage.set('qa-last',JSON.stringify({url:location.pathname+(activeSection?`#${activeSection}`:''),title:document.title,scroll:window.scrollY}));storage.set(`qa-location:${key}`,String(window.scrollY))};
 window.addEventListener('pagehide',saveLocation);
 let saveTimer:ReturnType<typeof setTimeout>;window.addEventListener('scroll',()=>{clearTimeout(saveTimer);saveTimer=setTimeout(saveLocation,300)},{passive:true});
 if(!location.hash){const y=Number(storage.get(`qa-location:${key}`,'0'));if(y>0)requestAnimationFrame(()=>window.scrollTo(0,y))}storage.set('qa-last',JSON.stringify({url:location.pathname+location.hash,title:document.title,scroll:window.scrollY}));
}
// Definition calls preserve the parent document and origin. Nested calls carry their own scroll stack.
const dialog=$<HTMLDialogElement>('#definition-dialog');
type DefinitionData={id:string;title:string;html:string};
let definitionData:Record<string,DefinitionData>|undefined;
let originElement:HTMLElement|null=null;let originY=0;let stack:{id:string;scroll:number}[]=[];
async function loadDefinitions(){if(!definitionData){const response=await fetch('/definitions.json');if(!response.ok)throw new Error('Definitions unavailable');definitionData=await response.json()}return definitionData!}
function showDefinition(data:Record<string,DefinitionData>){const item=data[stack.at(-1)!.id];$('#definition-title').textContent=item.title;$('#definition-body').innerHTML=item.html;$('#definition-stack').textContent=['Lesson',...stack.map(s=>data[s.id].title)].join(' → ');$<HTMLAnchorElement>('#definition-permalink').href=`/definitions/${item.id}/`;$<HTMLButtonElement>('#definition-back').textContent=stack.length>1?'← Return to previous explanation':'← Return to lesson';dialog.scrollTop=stack.at(-1)!.scroll;$('#definition-back').focus({preventScroll:true})}
function closeDefinition(){dialog.close();stack=[];window.scrollTo(0,originY);originElement?.focus({preventScroll:true})}
document.addEventListener('click',async e=>{
 const a=(e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="/definitions/"]');
 if(!a||a.id==='definition-permalink'||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
 const id=a.getAttribute('href')!.split('/')[2];e.preventDefault();
 try{const data=await loadDefinitions();if(!data[id]){location.href=a.href;return}
  if(!dialog.open){originElement=a;originY=window.scrollY;const source=a.closest('p,li,details,section');$('#definition-origin').textContent=`Return point: ${(source?.textContent||a.textContent||'').replace(/\s+/g,' ').slice(0,230)}`;stack=[];dialog.showModal()}else if(stack.length)stack.at(-1)!.scroll=dialog.scrollTop;
  const previous=stack.findIndex(s=>s.id===id);if(previous>=0)stack=stack.slice(0,previous+1);else stack.push({id,scroll:0});showDefinition(data);
 }catch{location.href=a.href}
});
$('#definition-close').onclick=closeDefinition;
$('#definition-back').onclick=()=>{if(stack.length>1){stack.pop();showDefinition(definitionData!)}else closeDefinition()};
dialog.addEventListener('cancel',e=>{e.preventDefault();closeDefinition()});
