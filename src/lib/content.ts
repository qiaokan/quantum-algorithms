import fs from 'node:fs';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import katex from 'katex';

export interface Lesson {
  id: string; sequence: number; module: number; title: string; kind: string;
  summary: string; why: string; prerequisites: string[]; concepts: string[];
  reusedConcepts: string[]; exampleIds: string[]; sourceIds: string[];
  path: 'main'|'branch'; editorial: 'complete'|'reviewed'|'partial'|'planned';
  advantage: string; aliases: string[]; file: string; gaps: string[];
}
export interface Source { id: string; title: string; authors: string; url: string; supports: string; verified: string|null; verification: string; note?: string }
export interface Exercise { lesson: string; question: string; answer: string }
export interface Definition { id: string; title: string; aliases: string[]; file: string; summary: string }
export interface Section { id: string; title: string }
export interface Rendered { html: string; sections: Section[]; text: string }
export const root = path.resolve('src/content');
export const moduleNames = [
  'Orientation & prerequisite library', 'First examples & oracle reasoning',
  'Search & amplitude amplification', 'Fourier structure & number theory',
  'Estimation & sampling expectations', 'Simulation & an initial linear solver',
  'Modern algorithmic building blocks', 'Walks & combinatorial algorithms',
  'Variational, optimization & adiabatic methods', 'Learning, measurement & sampling',
  'Specialized advanced extensions', 'Connections & synthesis',
];
function readJson<T>(filename: string): T { return JSON.parse(fs.readFileSync(filename,'utf8')); }
export const lessons: Lesson[] = fs.readdirSync(root).filter(f=>/^catalog-.*\.json$/.test(f)).flatMap(f=>readJson<Lesson[]>(path.join(root,f))).sort((a,b)=>a.sequence-b.sequence);
export const sources: Source[] = fs.readdirSync(path.join(root,'sources')).filter(f=>f.endsWith('.json')).flatMap(f=>readJson<Source[]>(path.join(root,'sources',f)));
export const exercises: Exercise[] = fs.readdirSync(path.join(root,'exercises')).filter(f=>f.endsWith('.json')).flatMap(f=>readJson<Exercise[]>(path.join(root,'exercises',f)));
export const definitions: Definition[] = fs.readdirSync(root).filter(f=>/^definitions(?:-.*)?\.json$/.test(f)).flatMap(f=>readJson<Definition[]>(path.join(root,f)));
export function lessonMarkdown(lesson: Lesson): string { return lesson.file && fs.existsSync(path.join(root,'lessons',lesson.file)) ? fs.readFileSync(path.join(root,'lessons',lesson.file),'utf8') : ''; }
export function definitionMarkdown(d: Definition): string { return fs.readFileSync(path.join(root,'definitions',d.file),'utf8'); }
export function plainText(html: string): string {
  const entities:Record<string,string>={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '};
  // KaTeX MathML contains no nested HTML spans; omit its duplicate accessible copy only for indexing.
  return html.replace(/<span class="katex-mathml">[\s\S]*?<\/span>/g,'')
    .replace(/<annotation[\s\S]*?<\/annotation>/g,'').replace(/<[^>]+>/g,' ')
    .replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,(_,entity:string)=>{
      if(!entity.startsWith('#'))return entities[entity.toLowerCase()];
      const code=entity[1].toLowerCase()==='x'?parseInt(entity.slice(2),16):Number(entity.slice(1));
      return code>0&&code<=0x10ffff&&!(code>=0xd800&&code<=0xdfff)?String.fromCodePoint(code):'�';
    }).replace(/\s+/g,' ').trim();
}
export async function render(markdown: string): Promise<Rendered> {
  const tableSafe = markdown.split('\n').map(line => line.trimStart().startsWith('|') ? line.replace(/\$([^$]+)\$/g, (_, math: string) => '$' + math.replace(/(?<!\\)\|/g, '\\vert ') + '$') : line).join('\n');
  const displaySafe = tableSafe.replace(/\$\$([\s\S]*?)\$\$/g, (_, math: string) => '\n$$\n' + math.trim() + '\n$$\n');
  // remark-math does not parse inside raw HTML, so inline math in <summary> labels is rendered here.
  const normalized = displaySafe.replace(/<summary>([\s\S]*?)<\/summary>/g, (_, label: string) => '<summary>' + label.replace(/\$([^$]+)\$/g, (_m, math: string) => katex.renderToString(math, { strict: 'error', trust: false })) + '</summary>');
  const file = await unified().use(remarkParse).use(remarkGfm).use(remarkMath)
    .use(remarkRehype,{allowDangerousHtml:true}).use(rehypeRaw)
    .use(rehypeKatex,{strict:'error',trust:false})
    .use(rehypeSlug).use(rehypeStringify).process(normalized);
  if (file.messages.length) throw new Error(file.messages.map(m=>`${m.message}: ${m.cause} at ${m.line}:${m.column}`).join('\n'));
  const html=String(file).replace(/<span class="katex-display">/g,'<span class="katex-display" tabindex="0" role="region" aria-label="Scrollable equation">').replace(/<table>/g,'<table tabindex="0">').replace(/<pre>/g,'<pre tabindex="0">');
  const sections=[...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map(m=>({id:m[1],title:plainText(m[2])}));
  return {html,sections,text:plainText(html)};
}
export function counts() { return Object.fromEntries(['reviewed','complete','partial','planned'].map(s=>[s,lessons.filter(l=>l.editorial===s).length])); }
// Reading is rendered words at 150 per minute. Calculation adds working time for each display
// equation, in-lesson prediction or derivation block, and practice question. The constants are
// editorial estimates, not measurements; the path pages state them.
export const timeModel = { wordsPerMinute: 150, perDisplayEquation: 1.5, perCheck: 3, perPractice: 4 };
export interface TimeEstimate { reading: number; calculation: number; total: number }
const estimates = new Map<string, Promise<TimeEstimate>>();
export function timeEstimate(l: Lesson): Promise<TimeEstimate> {
  if (!estimates.has(l.id)) estimates.set(l.id, (async () => {
    const r = await render(lessonMarkdown(l));
    const reading = Math.ceil(r.text.split(/\s+/).length / timeModel.wordsPerMinute);
    const equations = (r.html.match(/class="katex-display"/g) || []).length;
    const checks = (r.html.match(/<details/g) || []).length;
    const practice = exercises.filter(e => e.lesson === l.id).length;
    const calculation = Math.ceil(timeModel.perDisplayEquation * equations + timeModel.perCheck * checks + timeModel.perPractice * practice);
    return { reading, calculation, total: reading + calculation };
  })());
  return estimates.get(l.id)!;
}
export async function readingMinutes(l: Lesson) { return (await timeEstimate(l)).total; }
export function formatMinutes(minutes: number) { return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h ${minutes % 60} min`; }

// The decision path is an ordered reading route; tiers label every lesson relative to it.
export interface DecisionPath { title: string; summary: string; lessons: string[]; callouts: Record<string, string> }
export const decisionPath: DecisionPath = readJson<DecisionPath>(path.join(root, 'decision-path.json'));
export type Tier = 'decision' | 'complete' | 'deferred';
export function tier(l: Lesson): Tier { return decisionPath.lessons.includes(l.id) ? 'decision' : l.path === 'main' ? 'complete' : 'deferred'; }
export const tierLabels: Record<Tier, string> = { decision: 'Decision path', complete: 'Complete path', deferred: 'Deferred branch (read after the decision path)' };
export function decisionLessons(): Lesson[] { return decisionPath.lessons.map(id => { const l = lessons.find(x => x.id === id); if (!l) throw new Error(`Decision path names unknown lesson ${id}`); return l; }); }
export function label(l: Lesson) { return `${String(l.sequence).padStart(2,'0')}. ${l.title}`; }
