import {describe,it,expect} from 'vitest';
import {c,H,X,Z,basis,gate,marginal,abs2,mul,conj,type State,type Matrix} from '../src/lib/quantum';
import {Tableau,depolarize,seededRng} from '../src/lib/stabilizer';

const S:Matrix=[[c(1),c()],[c(),c(0,1)]];
const Y:Matrix=[[c(),c(0,-1)],[c(0,1),c()]];
type Op={g:'h'|'s'|'x'|'y'|'z';q:number}|{g:'cx'|'cz';a:number;b:number};

function randomCircuit(n:number,length:number,rng:()=>number):Op[]{
 const ops:Op[]=[];const pick=(k:number)=>Math.floor(rng()*k);
 for(let i=0;i<length;i++){const r=rng();
  if(r<0.3&&n>1){const a=pick(n);let b=pick(n-1);if(b>=a)b++;ops.push({g:rng()<0.7?'cx':'cz',a,b})}
  else ops.push({g:(['h','s','x','y','z'] as const)[pick(5)],q:pick(n)});}
 return ops;
}
function runVector(n:number,ops:Op[]):State{
 let s=basis(n);
 for(const o of ops){
  if(o.g==='cx')s=gate(s,o.b,X,o.a);
  else if(o.g==='cz')s=gate(s,o.b,Z,o.a);
  else if('q' in o)s=gate(s,o.q,{h:H,s:S,x:X,y:Y,z:Z}[o.g]);
 }
 return s;
}
function runTableau(n:number,ops:Op[]):Tableau{
 const t=new Tableau(n);
 for(const o of ops){
  if(o.g==='cx')t.cx(o.a,o.b);else if(o.g==='cz')t.cz(o.a,o.b);
  else if('q' in o){if(o.g==='h')t.h(o.q);else if(o.g==='s')t.s(o.q);else if(o.g==='x')t.xGate(o.q);else if(o.g==='y')t.yGate(o.q);else t.zGate(o.q);}
 }
 return t;
}
function vectorExpectation(s:State,pauli:string):number{
 let v=s;[...pauli].forEach((p,q)=>{if(p!=='I')v=gate(v,q,{X,Y,Z}[p as 'X'|'Y'|'Z'])});
 let re=0;for(let i=0;i<s.length;i++)re+=mul(conj(s[i]),v[i]).re;return re;
}
const randomPauli=(n:number,rng:()=>number)=>Array.from({length:n},()=>'IXYZ'[Math.floor(rng()*4)]).join('');

describe('stabilizer tableau simulator',()=>{
 it('prepares a Bell state with stabilizers +XX and +ZZ',()=>{
  const t=new Tableau(2);t.h(0);t.cx(0,1);
  expect(t.expectation('XX')).toBe(1);expect(t.expectation('ZZ')).toBe(1);expect(t.expectation('YY')).toBe(-1);expect(t.expectation('ZI')).toBe(0);
  const m0=t.measure(0,()=>0.9);expect(m0.deterministic).toBe(false);
  const m1=t.measure(1);expect(m1).toEqual({outcome:m0.outcome,deterministic:true});
 });
 it('agrees with the state-vector simulator on Pauli expectations for random Clifford circuits',()=>{
  const rng=seededRng(2026);
  for(let trial=0;trial<120;trial++){
   const n=1+Math.floor(rng()*6);const ops=randomCircuit(n,4+Math.floor(rng()*30),rng);
   const s=runVector(n,ops),t=runTableau(n,ops);
   for(let k=0;k<12;k++){const p=randomPauli(n,rng);expect(t.expectation(p),`${JSON.stringify(ops)} ${p}`).toBeCloseTo(vectorExpectation(s,p),9)}
  }
 });
 it('matches state-vector measurement statistics and post-measurement states',()=>{
  const rng=seededRng(7);
  for(let trial=0;trial<80;trial++){
   const n=2+Math.floor(rng()*5);const ops=randomCircuit(n,25,rng);
   let s=runVector(n,ops);const t=runTableau(n,ops);
   for(let q=0;q<n;q++){
    const p1=marginal(s,[q])[1];const forced=rng();const m=t.measure(q,()=>forced);
    if(m.deterministic)expect(p1).toBeCloseTo(m.outcome,9);else expect(p1).toBeCloseTo(0.5,9);
    // Project the state vector onto the tableau's outcome and renormalize.
    const bit=1<<(n-q-1);s=s.map((z,i)=>((i&bit)!==0)===(m.outcome===1)?z:c());const norm=Math.sqrt(s.reduce((a,z)=>a+abs2(z),0));s=s.map(z=>c(z.re/norm,z.im/norm));
    for(let k=0;k<6;k++){const p=randomPauli(n,rng);expect(t.expectation(p)).toBeCloseTo(vectorExpectation(s,p),9)}
   }
  }
 });
 it('simulates a 60-qubit GHZ state with consistent measurements',()=>{
  const n=60,t=new Tableau(n);t.h(0);for(let q=1;q<n;q++)t.cx(q-1,q);
  expect(t.expectation('X'.repeat(n))).toBe(1);expect(t.expectation('ZZ'+'I'.repeat(n-2))).toBe(1);
  const first=t.measure(0,()=>0.2);const rest=Array.from({length:n-1},(_,i)=>t.measure(i+1));
  expect(rest.every(m=>m.deterministic&&m.outcome===first.outcome)).toBe(true);
 });
 it('applies sampled Pauli noise and tracks its effect on stabilizers',()=>{
  const n=50,t=new Tableau(n);for(let q=0;q<n;q++)t.h(q);
  const rng=seededRng(11);const errors=Array.from({length:n},(_,q)=>depolarize(t,q,0.3,rng));
  errors.forEach((e,q)=>{const p='I'.repeat(q)+'X'+'I'.repeat(n-q-1);expect(t.expectation(p)).toBe(e==='Z'||e==='Y'?-1:1)});
  expect(errors.some(e=>e!=='I')).toBe(true);
 });
 it('rejects invalid qubits, gates and Pauli strings',()=>{
  const t=new Tableau(3);
  expect(()=>t.h(3)).toThrow();expect(()=>t.cx(1,1)).toThrow();expect(()=>t.expectation('XX')).toThrow();expect(()=>t.applyPauli('XQZ')).toThrow();expect(()=>new Tableau(0)).toThrow();
 });
});
