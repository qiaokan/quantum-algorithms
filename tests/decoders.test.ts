import {describe,it,expect} from 'vitest';
import {surfaceCode,syndrome,xErrorGraph,repetitionGraph,measureStabilizers} from '../src/lib/surface-code';
import {matchingDecoder,unionFindDecoder,defectsOf,type DecodingGraph} from '../src/lib/decoders';
import {Tableau,seededRng} from '../src/lib/stabilizer';

const commute=(a:number[],b:number[])=>a.filter(q=>b.includes(q)).length%2===0;
function combinations(n:number,k:number):number[][]{if(k===0)return[[]];const out:number[][]=[];const rec=(start:number,acc:number[])=>{if(acc.length===k){out.push([...acc]);return}for(let i=start;i<n;i++){acc.push(i);rec(i+1,acc);acc.pop()}};rec(0,[]);return out}
// Residual = error XOR correction, as a set of edges; a logical failure flips the observable.
function residualFlips(graph:DecodingGraph,error:number[],correction:number[]){const s=new Set<number>();for(const e of [...error,...correction]){if(s.has(e))s.delete(e);else s.add(e)}return [...s].reduce((f,id)=>f!==graph.edges[id].flipsObservable,false)}

describe('rotated surface code layout',()=>{
 for(const d of [3,5,7])it(`distance ${d} has d^2-1 commuting stabilizers and anticommuting logicals`,()=>{
  const code=surfaceCode(d);
  expect(code.stabilizers.length).toBe(d*d-1);expect(code.xStabilizers.length).toBe((d*d-1)/2);
  for(const x of code.xStabilizers)for(const z of code.zStabilizers)expect(commute(x.qubits,z.qubits)).toBe(true);
  for(const z of code.zStabilizers)expect(commute(code.logicalX,z.qubits)).toBe(true);
  for(const x of code.xStabilizers)expect(commute(code.logicalZ,x.qubits)).toBe(true);
  expect(commute(code.logicalX,code.logicalZ)).toBe(false);
 });
 it('distance 3 uses 17 qubits and detects a single X error with its two neighbouring Z checks',()=>{
  const code=surfaceCode(3);expect(code.dataQubits+code.stabilizers.length).toBe(17);
  expect(syndrome(code.zStabilizers,[4])).toEqual(code.zStabilizers.map(s=>s.qubits.includes(4)?1:0));
  expect(syndrome(code.zStabilizers,[4]).reduce((a,b)=>a+b,0)).toBe(2);
  expect(syndrome(code.zStabilizers,code.logicalX)).toEqual([0,0,0,0]);
 });
 it('extracts syndromes on a 17-qubit stabilizer simulation, including a repeated round and an injected error',()=>{
  const code=surfaceCode(3),rng=seededRng(3),t=new Tableau(17);
  const round1=measureStabilizers(t,code,rng),round2=measureStabilizers(t,code,rng);
  expect(round2).toEqual(round1);
  code.stabilizers.forEach((s,k)=>{if(s.type==='Z')expect(round1[k]).toBe(0)});
  t.xGate(4);const round3=measureStabilizers(t,code,rng);
  const changed=round3.map((b,k)=>b^round2[k]);
  expect(changed).toEqual(code.stabilizers.map(s=>s.type==='Z'&&s.qubits.includes(4)?1:0));
 });
});

describe('decoders',()=>{
 const graphs:[string,DecodingGraph,number][]=[['repetition d=5',repetitionGraph(5),2],['repetition d=7',repetitionGraph(7),3],['surface d=3',xErrorGraph(surfaceCode(3)),1],['surface d=5',xErrorGraph(surfaceCode(5)),2]];
 for(const [name,graph,t] of graphs)it(`${name}: both decoders correct every error of weight up to ${t}`,()=>{
  for(let w=0;w<=t;w++)for(const error of combinations(graph.edges.length,w)){
   const defects=defectsOf(graph,error);
   for(const decode of [matchingDecoder,unionFindDecoder]){
    const c=decode(graph,defects);
    expect(defectsOf(graph,c.edges),`${name} ${decode.name} ${error}`).toEqual(defects);
    expect(residualFlips(graph,error,c.edges),`${name} ${decode.name} ${error}`).toBe(false);
   }
  }
 });
 it('exact matching finds a minimum-weight correction for every d=3 surface-code syndrome',()=>{
  const graph=xErrorGraph(surfaceCode(3));const m=graph.edges.length;const bestBySyndrome=new Map<string,number>();
  for(let mask=0;mask<1<<m;mask++){const err=[...Array(m).keys()].filter(i=>mask>>i&1);const key=defectsOf(graph,err).join(',');bestBySyndrome.set(key,Math.min(bestBySyndrome.get(key)??Infinity,err.length))}
  expect(bestBySyndrome.size).toBe(16);
  for(const [key,best] of bestBySyndrome){const defects=key?key.split(',').map(Number):[];const c=matchingDecoder(graph,defects);expect(c.weight,key).toBe(best);expect(defectsOf(graph,c.edges)).toEqual(defects)}
 });
 it('matching pairs nearby defects and sends a lone defect to the boundary',()=>{
  const graph=repetitionGraph(5);
  expect(matchingDecoder(graph,[1,2]).pairs).toEqual([[1,2]]);
  const lone=matchingDecoder(graph,[0]);expect(lone.pairs).toEqual([[0,-1]]);expect(lone.faults).toEqual([0]);
 });
 it('union-find grows clusters for a small number of rounds and handles an empty syndrome',()=>{
  const graph=repetitionGraph(7);expect(unionFindDecoder(graph,[]).edges).toEqual([]);
  const c=unionFindDecoder(graph,[2,3]);expect(c.faults).toEqual([3]);expect(c.rounds).toBe(1);
 });
 it('rejects malformed graphs and defects',()=>{
  const graph=repetitionGraph(3);
  expect(()=>matchingDecoder(graph,[5])).toThrow();expect(()=>unionFindDecoder(graph,[0,0])).toThrow();
  expect(()=>matchingDecoder({nodes:2,edges:[{a:0,b:1,weight:0,fault:0,flipsObservable:false}]},[0,1])).toThrow();
  expect(()=>surfaceCode(4)).toThrow();
 });
});
