import {lessons,moduleNames,counts} from '../lib/content';
export function GET(){return new Response(JSON.stringify({verified:'2026-11-02',scope:'61 required topics plus synthesis; see coverage page for additions and gaps',counts:counts(),modules:moduleNames,lessons},null,2),{headers:{'Content-Type':'application/json'}})}
