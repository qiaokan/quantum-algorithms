import {lessons,definitions,lessonMarkdown,definitionMarkdown,render,plainText,exercises} from '../lib/content';
import revisits from '../content/module-revisits.json';
export async function GET(){const result=[];
 for(const lesson of lessons){if(lesson.editorial==='planned')continue;result.push({title:lesson.title,section:'Overview',url:`/lessons/${lesson.id}/`,text:lesson.summary+' '+lesson.why,aliases:lesson.aliases.join(' '),kind:'Lesson'});const body=await render(lessonMarkdown(lesson));const parts=body.html.split(/(?=<h2 id=")/);for(const part of parts){const heading=part.match(/^<h2 id="([^"]+)">([\s\S]*?)<\/h2>/);result.push({title:lesson.title,section:heading?plainText(heading[2]):'Introduction',url:`/lessons/${lesson.id}/${heading?'#'+heading[1]:''}`,text:plainText(part),aliases:lesson.aliases.join(' '),kind:'Lesson'})}}
 for(const e of exercises){const lesson=lessons.find(l=>l.id===e.lesson);if(lesson&&lesson.editorial!=='planned')result.push({title:lesson.title,section:'Practice & explained answers',url:`/lessons/${e.lesson}/#practice`,text:(await render(e.question+'\n\n'+e.answer)).text,aliases:lesson.aliases.join(' '),kind:'Exercise'})}
 for(const r of revisits){const lesson=lessons.find(l=>l.id===r.lesson);if(lesson&&lesson.editorial!=='planned')result.push({title:lesson.title,section:'Revisit the module',url:`/lessons/${r.lesson}/#module-revisit`,text:(await render(r.body)).text,aliases:'',kind:'Module revisit'})}
 for(const d of definitions)result.push({title:d.title,section:'Definition',url:`/definitions/${d.id}/`,text:(await render(definitionMarkdown(d))).text,aliases:d.aliases.join(' '),kind:'Definition'});
 return new Response(JSON.stringify(result),{headers:{'Content-Type':'application/json'}})
}
