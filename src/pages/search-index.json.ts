import {lessons,definitions,lessonMarkdown,definitionMarkdown,render,plainText} from '../lib/content';
export async function GET(){const result=[];
 for(const lesson of lessons){if(lesson.editorial==='planned')continue;const body=await render(lessonMarkdown(lesson));const parts=body.html.split(/(?=<h2 id=")/);for(const part of parts){const heading=part.match(/^<h2 id="([^"]+)">([\s\S]*?)<\/h2>/);result.push({title:lesson.title,section:heading?plainText(heading[2]):'Introduction',url:`/lessons/${lesson.id}/${heading?'#'+heading[1]:''}`,text:plainText(part),aliases:lesson.aliases.join(' '),kind:'Lesson'})}}
 for(const d of definitions)result.push({title:d.title,section:'Definition',url:`/definitions/${d.id}/`,text:(await render(definitionMarkdown(d))).text,aliases:d.aliases.join(' '),kind:'Definition'});
 return new Response(JSON.stringify(result),{headers:{'Content-Type':'application/json'}})
}
