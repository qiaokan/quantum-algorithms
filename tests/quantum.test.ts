import {describe,it,expect} from 'vitest';
import {c,H,X,Z,basis,gate,oracle,permutation,tensor,matvec,dagger,norm,probabilities,marginal,equivalent,qft,qftRegister,markedOracle,diffusion,sample,parity,shorPostprocess,hhlDiagonal,modPow,scale,add,mul,type State} from '../src/lib/quantum';
import {makeDemo,resultProbabilities} from '../src/lib/demos';
function close(a:number[],b:number[],digits=10){expect(a.length).toBe(b.length);a.forEach((x,i)=>expect(x).toBeCloseTo(b[i],digits))}
const final=(id:string,value:string)=>{const d=makeDemo(id,value);return {d,frame:d.frames.at(-1)!,p:resultProbabilities(d,d.frames.length-1)}};
describe('linear algebra and legal operations',()=>{
 it('rejects nonfinite probabilities and random draws instead of inventing counts',()=>{
  for(const p of [[NaN,1],[Infinity,0],[-Infinity,Infinity],[]])expect(()=>sample(p,1)).toThrow();
  expect(()=>sample([.5,.5],1,()=>NaN)).toThrow();
 });
 it('rejects fractional or oversized registers and nonfinite state components',()=>{
  expect(()=>gate(basis(2),0,X,.5)).toThrow();
  expect(()=>marginal(basis(2),[.5])).toThrow();
  expect(()=>qftRegister(basis(2),3)).toThrow();
  expect(()=>qftRegister(basis(2),1.5)).toThrow();
  expect(()=>oracle(basis(2),.5,1.5,()=>0)).toThrow();
  expect(()=>gate([c(1),c(),c()],0,H)).toThrow();
  expect(()=>qft([c(NaN),c()])).toThrow();
  expect(()=>tensor(basis(5),basis(4))).toThrow();
  expect(()=>markedOracle(basis(2),[4])).toThrow();
 });
 it('rejects undefined HHL postselection',()=>{
  const b=[Math.SQRT1_2,Math.SQRT1_2];
  expect(()=>hhlDiagonal([1,2],b,0)).toThrow();
  expect(()=>hhlDiagonal([1,NaN],b,1)).toThrow();
  expect(()=>hhlDiagonal([1,2],[NaN,0],1)).toThrow();
  expect(()=>hhlDiagonal([1,2],b,Number.MIN_VALUE)).toThrow();
 });
 it('expands a tensor in documented big-endian order',()=>{const s=tensor([c(1/Math.sqrt(2)),c(1/Math.sqrt(2))],[c(1/Math.sqrt(2)),c(-1/Math.sqrt(2))]);close(s.map(z=>z.re),[.5,-.5,.5,-.5]);expect(norm(s)).toBeCloseTo(1,12)});
 it.each([H,X,Z,[[c(1),c()],[c(),c(0,1)]]])('small gate is unitary on every basis direction',(row0,row1)=>{const m=[row0,row1];for(let i=0;i<2;i++)expect(equivalent(matvec(dagger(m),matvec(m,basis(1,i))),basis(1,i))).toBe(true)});
 it('controlled X is its own inverse and changes the correct bit',()=>{for(let i=0;i<8;i++){const s=gate(basis(3,i),2,X,0);expect(probabilities(s).indexOf(1)).toBe((i&4)?i^1:i);expect(equivalent(gate(s,2,X,0),basis(3,i))).toBe(true)}});
 it('rejects irreversible purported oracle and never silently normalizes',()=>{expect(()=>permutation(basis(2),()=>0)).toThrow();expect(()=>sample([.4,.4],10)).toThrow();expect(norm([c(2),c()])).toBe(4);expect(()=>basis(9)).toThrow()});
 it('compares global phase separately from probability equality',()=>{const plus=[c(Math.SQRT1_2),c(Math.SQRT1_2)];expect(equivalent(plus,plus.map(z=>mul(c(0,1),z)))).toBe(true);const minus=[c(Math.SQRT1_2),c(-Math.SQRT1_2)];close(probabilities(plus),probabilities(minus));expect(equivalent(plus,minus)).toBe(false)});
 it('keeps every demonstrated intermediate state normalized',()=>{for(const [id,values]of Object.entries({deutsch:['00','01','10','11'],grover:['0','1','2','3'],'bernstein-vazirani':['0','5','7'],'deutsch-jozsa':['zero','one','balanced','broken'],simon:['3','5','6'],qft:['0','1','2','3'],'phase-estimation':['0','0.25','0.3','0.375']})){for(const v of values)for(const frame of makeDemo(id,v).frames)expect(norm(frame.state),`${id}, ${v}, ${frame.name}`).toBeCloseTo(1,11)}});
});
describe('oracle algorithms',()=>{
 it.each(['00','01','10','11'])('Deutsch function %s yields the correct parity',(values)=>{const{p,d}=final('deutsch',values);const parity=Number(values[0])^Number(values[1]);close(p,parity?[0,1]:[1,0]);expect(d.frames.at(-1)!.queries).toBe(1);close(marginal(d.frames[3].state,[0]),[.5,.5])});
 it.each([0,1,2,3])('Grover marked position %i and oscillation',(mark)=>{let s=basis(2).map(()=>c(.5));for(let r=0;r<6;r++){expect(probabilities(s)[mark]).toBeCloseTo(Math.sin((2*r+1)*Math.PI/6)**2,11);s=diffusion(markedOracle(s,[mark]));expect(norm(s)).toBeCloseTo(1,11)}const d=makeDemo('grover',String(mark));expect(equivalent(d.frames[4].state,basis(2,mark))).toBe(true)});
 it('two marks out of four are not amplified by a standard iteration',()=>{const s=diffusion(markedOracle([c(.5),c(.5),c(.5),c(.5)],[0,3]));close(probabilities(s),[.25,.25,.25,.25])});
 it.each(Array.from({length:8},(_,i)=>i))('BV recovers hidden string %i',(s)=>{const{p,d}=final('bernstein-vazirani',String(s));close(p,Array.from({length:8},(_,i)=>i===s?1:0));expect(d.frames.at(-1)!.queries).toBe(1)});
 it('DJ promise and broken promise have distinct guarantees',()=>{expect(final('deutsch-jozsa','zero').p[0]).toBeCloseTo(1);expect(final('deutsch-jozsa','one').p[0]).toBeCloseTo(1);expect(final('deutsch-jozsa','balanced').p[0]).toBeCloseTo(0);close(final('deutsch-jozsa','broken').p,[.25,.25,.25,.25])});
 it.each([1,2,3,4,5,6,7])('Simon mask %i satisfies all output constraints',(s)=>{const{p}=final('simon',String(s));p.forEach((v,y)=>expect(v).toBeCloseTo(parity(y&s)===0?.25:0,11));const candidates=Array.from({length:7},(_,i)=>i+1).filter(candidate=>p.every((v,y)=>v<1e-9||parity(y&candidate)===0));expect(candidates).toEqual([s])});
 it('samples only allowed Simon rows and recovers a unique nonzero mask',()=>{const{p}=final('simon','3');let seed=9;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/2**32};const counts=sample(p,200,random);expect(counts.reduce((a,b)=>a+b,0)).toBe(200);const rows=counts.flatMap((n,y)=>n?[y]:[]);expect(rows.every(y=>parity(y&3)===0)).toBe(true);expect([1,2,3,4,5,6,7].filter(s=>rows.every(y=>parity(y&s)===0))).toEqual([3])});
 it('value oracle is reversible even with many-to-one function',()=>{const s=gate(gate(basis(4),0,H),1,H);const f=(x:number)=>Math.min(x,x^3);expect(equivalent(oracle(oracle(s,2,2,f),2,2,f),s)).toBe(true)});
});
describe('Fourier and phase estimation',()=>{
 it('QFT and inverse preserve amplitudes for a complex input',()=>{const s=[c(.5),c(0,.5),c(-.5),c(.3,.4)];expect(norm(s)).toBeCloseTo(1);const back=qft(qft(s),true);back.forEach((z,i)=>{expect(z.re).toBeCloseTo(s[i].re,11);expect(z.im).toBeCloseTo(s[i].im,11)})});
 it.each([0,1,2,3])('two-qubit QFT gate decomposition has positive exponent and natural ordering for %i',(x)=>{const d=makeDemo('qft',String(x));const actual=d.frames[d.frames.length-2].state,expected=qft(basis(2,x));expect(equivalent(actual,expected)).toBe(true);close(probabilities(actual),[.25,.25,.25,.25]);expect(equivalent(d.frames.at(-1)!.state,basis(2,x))).toBe(true)});
 it.each([0,.125,.25,.375,.5,.625,.75,.875])('exact QPE θ=%s',(theta)=>{const{p,d}=final('phase-estimation',String(theta));close(p,Array.from({length:8},(_,i)=>i===theta*8?1:0));expect(d.frames.at(-1)!.queries).toBe(7)});
 it('inexact QPE agrees with the geometric-series distribution and sums to one',()=>{const{p}=final('phase-estimation','.3');const exact=p.map((_,y)=>Math.sin(Math.PI*8*(.3-y/8))**2/(64*Math.sin(Math.PI*(.3-y/8))**2));close(p,exact);expect(p[2]).toBeGreaterThan(.57);expect(p[3]).toBeGreaterThan(.25);expect(p.reduce((a,b)=>a+b,0)).toBeCloseTo(1,12)});
});
describe('classical postprocessing and advanced toy transformations',()=>{
 it('Shor successful, failed and classically easy trials',()=>{expect(shorPostprocess(15,2,4).factors).toEqual([3,5]);expect(shorPostprocess(15,14,2).reason).toMatch(/trivial/);expect(shorPostprocess(21,4,3).reason).toMatch(/odd/);expect(shorPostprocess(15,2,6).reason).toMatch(/not an order/);expect(shorPostprocess(15,2,8).reason).toMatch(/trivial/);expect(shorPostprocess(15,3,0).factors).toEqual([3,5]);expect(modPow(2,4,15)).toBe(1)});
 it('HHL diagonal solution matches classical solution and preserves success/failure accounting',()=>{const b=[Math.SQRT1_2,Math.SQRT1_2];const r=hhlDiagonal([1,2],b,1);close(r.solution,[b[0],b[1]/2]);close(r.state,[2/Math.sqrt(5),1/Math.sqrt(5)]);expect(r.success).toBeCloseTo(5/8,12);expect(r.success+r.failure.reduce((s,x)=>s+x*x,0)).toBeCloseTo(1,12);expect(()=>hhlDiagonal([1,2],b,3)).toThrow()});
 it('Trotter error decreases for X+Z and state norms stay one',()=>{const t=.7,s=basis(1);const exact=s.map((z,i)=>add(scale(z,Math.cos(Math.sqrt(2)*t)),mul(c(0,-Math.sin(Math.sqrt(2)*t)/Math.sqrt(2)),add(matvec(X,s)[i],matvec(Z,s)[i]))));const evol=(m:typeof X,u:number,v:State)=>v.map((z,i)=>add(scale(z,Math.cos(u)),mul(c(0,-Math.sin(u)),matvec(m,v)[i])));const run=(r:number)=>{let v=s;for(let i=0;i<r;i++)v=evol(X,t/r,evol(Z,t/r,v));expect(norm(v)).toBeCloseTo(1,10);return Math.sqrt(v.reduce((a,z,i)=>a+(z.re-exact[i].re)**2+(z.im-exact[i].im)**2,0))};expect(run(32)).toBeLessThan(run(4)/5)});
 it('one-qubit variational energy matches its analytic expectation and lower bound',()=>{for(const theta of [0,.4,Math.PI/2,Math.PI]){const s=[c(Math.cos(theta/2)),c(Math.sin(theta/2))];const z=probabilities(s)[0]-probabilities(s)[1],x=2*s[0].re*s[1].re;expect(z+.5*x).toBeCloseTo(Math.cos(theta)+.5*Math.sin(theta),12);expect(z+.5*x).toBeGreaterThanOrEqual(-Math.sqrt(1.25)-1e-12)}});
});
