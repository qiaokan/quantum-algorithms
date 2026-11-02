import fs from 'node:fs';
import {lessons,definitions,sources,exercises,lessonMarkdown,definitionMarkdown,render,counts} from '../src/lib/content';
import revisits from '../src/content/module-revisits.json';
const errors:string[]=[],warnings:string[]=[];
const unique=(items:{id:string}[],name:string)=>{const seen=new Set<string>();for(const item of items){if(seen.has(item.id))errors.push(`Duplicate ${name}: ${item.id}`);seen.add(item.id)}return seen};
const lessonIds=unique(lessons,'lesson'),defIds=unique(definitions,'definition'),sourceIds=unique(sources,'source');
const byId=new Map(lessons.map(l=>[l.id,l]));
const visited=new Set<string>(),visiting=new Set<string>();
function visit(id:string,chain:string[]=[]){if(visiting.has(id)){errors.push(`Prerequisite cycle: ${[...chain,id].join(' -> ')}`);return}if(visited.has(id))return;visiting.add(id);for(const p of byId.get(id)?.prerequisites??[]){if(!lessonIds.has(p))errors.push(`Missing prerequisite ${p} for ${id}`);else visit(p,[...chain,id])}visiting.delete(id);visited.add(id)}
for(const l of lessons)visit(l.id);
const sequences=new Set<number>();const renderings=new Map<string,{html:string;sections:{id:string;title:string}[];text:string}>();
for(const l of lessons){
 if(sequences.has(l.sequence))errors.push(`Duplicate sequence ${l.sequence}`);sequences.add(l.sequence);
 for(const id of l.sourceIds)if(!sourceIds.has(id))errors.push(`${l.id}: missing source ${id}`);
 for(const id of [...l.concepts,...l.reusedConcepts])if(!defIds.has(id))errors.push(`${l.id}: missing concept ${id}`);
 if(l.editorial==='planned')continue;
 const md=lessonMarkdown(l);if(!md.trim()){errors.push(`${l.id}: blank content`);continue;}
 if(l.editorial==='partial'&&!l.gaps.length)errors.push(`${l.id}: partial without exact gaps`);
 if((l.editorial==='complete'||l.editorial==='reviewed')&&l.gaps.length)errors.push(`${l.id}: complete despite declared gaps`);
 if((l.editorial==='complete'||l.editorial==='reviewed')&&md.split(/\s+/).length<650)errors.push(`${l.id}: too little substantive prose for complete status (minimum diagnostic, not proof of quality)`);
 if(!/## References/i.test(md))errors.push(`${l.id}: missing bibliography`);
 if(exercises.filter(e=>e.lesson===l.id).length<2)errors.push(`${l.id}: fewer than two explained exercises`);
 if(!l.sourceIds.length)errors.push(`${l.id}: missing source metadata`);
 const chunks=md.split(/^## /m).slice(1);for(const ch of chunks){const body=ch.slice(ch.indexOf('\n')+1);if(body.trim().length<50)errors.push(`${l.id}: empty or vestigial section: ${ch.split('\n')[0]}`)}
 try{renderings.set(`/lessons/${l.id}/`,await render(md))}catch(e){errors.push(`${l.id}: math/Markdown rendering: ${e}`)}
}
for(const d of definitions){try{renderings.set(`/definitions/${d.id}/`,await render(definitionMarkdown(d)))}catch(e){errors.push(`${d.id}: definition render: ${e}`)}}
for(const [url,r]of renderings){
 for(const m of r.html.matchAll(/href="(\/(?:lessons|definitions)\/[^"#]+)(#[^"]+)?"/g)){
  const target=renderings.get(m[1]);if(!target){errors.push(`${url}: broken link ${m[1]}`);continue}
  if(m[2]&&!target.html.includes(`id="${m[2].slice(1)}"`))errors.push(`${url}: missing anchor ${m[1]+m[2]}`)
 }
 if(/class="katex-error"/.test(r.html))errors.push(`${url}: KaTeX error output`);
 const anchors=[...r.html.matchAll(/ id="([^"]+)"/g)].map(m=>m[1]);if(new Set(anchors).size!==anchors.length)errors.push(`${url}: duplicate anchors`);
}
const definitionEdges = new Map(definitions.map(d=>[d.id,[...definitionMarkdown(d).matchAll(/\]\(\/definitions\/([^/]+)\/\)/g)].map(m=>m[1])]));
const definitionDone=new Set<string>(),definitionStack:string[]=[];
function visitDefinition(id:string){if(definitionStack.includes(id)){errors.push(`Definition cycle: ${[...definitionStack,id].join(' -> ')}`);return}if(definitionDone.has(id))return;definitionStack.push(id);for(const dep of definitionEdges.get(id)??[])visitDefinition(dep);definitionStack.pop();definitionDone.add(id)}
for(const d of definitions)visitDefinition(d.id);
// Audit prose-number boundaries outside formulas; short mathematical names stay valid.
const proseNumberAllowlist=new Set(['ln','log']);
for(const item of [...exercises.map(e=>({id:e.lesson,text:e.question+'\n\n'+e.answer})),...revisits.map(r=>({id:r.lesson,text:r.body}))]){
 const prose=item.text.replace(/\$[\s\S]*?\$/g,'');
 for(const m of prose.matchAll(/\b([A-Za-z]{2,})(?=\d)/g))if(!proseNumberAllowlist.has(m[1]))errors.push(`${item.id}: missing prose/number space after ${m[1]}`);
 try{await render(item.text)}catch(e){errors.push(`${item.id}: practice/revisit math rendering: ${e}`)}
}
for(const s of sources){if(!/^https?:\/\//.test(s.url))errors.push(`Invalid URL for ${s.id}`);if(!s.verified)warnings.push(`Source not verified: ${s.id}`)}
if(lessons[0]?.id!=='deutsch'||lessons[1]?.id!=='grover')errors.push('First algorithm lessons must be Deutsch then Grover');
for(let n=1;n<=61;n++)if(!sequences.has(n))errors.push(`Required lesson number ${n} absent`);
for(const e of exercises){if(!lessonIds.has(e.lesson))errors.push(`Orphan exercise ${e.lesson}`);if(e.answer.length<45)errors.push(`Exercise answer too short ${e.lesson}`)}
const report={date:'2026-11-02',counts:counts(),lessons:lessons.length,definitions:definitions.length,sources:sources.length,exercises:exercises.length,words:lessons.reduce((s,l)=>s+lessonMarkdown(l).split(/\s+/).filter(Boolean).length,0),errors,warnings,limitations:'Automated structure/link/math checks are not independent scientific or pedagogical peer review.',gaps:lessons.filter(l=>l.gaps.length).map(l=>({id:l.id,gaps:l.gaps}))};
fs.mkdirSync('docs',{recursive:true});fs.writeFileSync('docs/content-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
