import {definitions,definitionMarkdown,render} from '../lib/content';
export async function GET(){const data=Object.fromEntries(await Promise.all(definitions.map(async d=>[d.id,{id:d.id,title:d.title,html:(await render(definitionMarkdown(d))).html}])));return new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}})}
