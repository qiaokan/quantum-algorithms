/** Ideal small-state simulator. Big-endian qubits; q=0 is leftmost. No implicit renormalization. */
export type Complex = { re: number; im: number };
export type State = Complex[];
export type Matrix = Complex[][];
export const c = (re=0,im=0): Complex=>({re,im});
export const add=(a:Complex,b:Complex)=>c(a.re+b.re,a.im+b.im);
export const mul=(a:Complex,b:Complex)=>c(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
export const conj=(a:Complex)=>c(a.re,-a.im);
export const scale=(a:Complex,s:number)=>c(a.re*s,a.im*s);
export const abs2=(a:Complex)=>a.re*a.re+a.im*a.im;
export const phase=(t:number)=>c(Math.cos(t),Math.sin(t));
export const MAX_QUBITS=8;
export function basis(n:number,index=0):State {
  if(!Number.isInteger(n)||n<1||n>MAX_QUBITS||!Number.isInteger(index)||index<0||index>=2**n) throw new Error('Use 1–8 qubits and a valid basis index.');
  return Array.from({length:2**n},(_,i)=>c(i===index?1:0));
}
export const H:Matrix=[[c(Math.SQRT1_2),c(Math.SQRT1_2)],[c(Math.SQRT1_2),c(-Math.SQRT1_2)]];
export const X:Matrix=[[c(),c(1)],[c(1),c()]];
export const Z:Matrix=[[c(1),c()],[c(),c(-1)]];
export const identity=(n:number):Matrix=>Array.from({length:n},(_,r)=>Array.from({length:n},(_,j)=>c(r===j?1:0)));
export const dagger=(m:Matrix):Matrix=>m[0].map((_,j)=>m.map(row=>conj(row[j])));
export function matvec(m:Matrix,v:State):State {
  if(m.length!==v.length||m.some(r=>r.length!==v.length)) throw new Error('Matrix/state dimension mismatch');
  return m.map(row=>row.reduce((sum,x,j)=>add(sum,mul(x,v[j])),c()));
}
export function tensor(a:State,b:State):State { return a.flatMap(x=>b.map(y=>mul(x,y))); }
export function gate(s:State,q:number,m:Matrix,control?:number):State {
  const n=Math.log2(s.length);
  if(q<0||q>=n||!Number.isInteger(q)||m.length!==2||m.some(r=>r.length!==2)||control===q||(control!==undefined&&(control<0||control>=n))) throw new Error('Invalid single-qubit gate');
  const bit=1<<(n-q-1), cb=control===undefined?0:1<<(n-control-1);
  const out=s.map(v=>c(v.re,v.im));
  for(let i=0;i<s.length;i++) if((i&bit)===0&&(!cb||(i&cb)!==0)) {
    out[i]=add(mul(m[0][0],s[i]),mul(m[0][1],s[i|bit]));
    out[i|bit]=add(mul(m[1][0],s[i]),mul(m[1][1],s[i|bit]));
  }
  return out;
}
export function permutation(s:State,fn:(i:number)=>number):State {
  const indices=s.map((_,i)=>fn(i));
  if(new Set(indices).size!==s.length||indices.some(i=>!Number.isInteger(i)||i<0||i>=s.length)) throw new Error('Oracle must be reversible (a permutation)');
  const out=s.map(()=>c()); indices.forEach((j,i)=>out[j]=c(s[i].re,s[i].im)); return out;
}
export function oracle(s:State,inputBits:number,outputBits:number,fn:(x:number)=>number):State {
  if(s.length!==2**(inputBits+outputBits)) throw new Error('Oracle register mismatch');
  const mask=(1<<outputBits)-1;
  return permutation(s,i=>{
    const x=i>>outputBits,y=i&mask,v=fn(x);
    if(v<0||v>mask||!Number.isInteger(v)) throw new Error('Invalid oracle value');
    return (x<<outputBits)|(y^v);
  });
}
export const probabilities=(s:State)=>s.map(abs2);
export const norm=(s:State)=>probabilities(s).reduce((a,b)=>a+b,0);
export function marginal(s:State,qubits:number[]):number[] {
  const n=Math.log2(s.length),p=Array(2**qubits.length).fill(0);
  if(new Set(qubits).size!==qubits.length||qubits.some(q=>q<0||q>=n)) throw new Error('Invalid marginal register');
  s.forEach((a,i)=>{const j=qubits.reduce((v,q)=>(v<<1)|((i>>(n-q-1))&1),0);p[j]+=abs2(a)});return p;
}
export function sample(p:number[],shots:number,rng= Math.random):number[] {
  if(Math.abs(p.reduce((a,b)=>a+b,0)-1)>1e-9||p.some(x=>x<0)||!Number.isInteger(shots)||shots<0)throw new Error('Sampling needs a normalized probability distribution');
  const counts=Array(p.length).fill(0);
  for(let k=0;k<shots;k++){const u=rng(); if(u<0||u>=1)throw new Error('Random source must return [0,1)');let sum=0;for(let i=0;i<p.length;i++){sum+=p[i];if(u<sum||i===p.length-1){counts[i]++;break;}}}return counts;
}
export function qft(s:State,inverse=false):State {
  const N=s.length,sign=inverse?-1:1;
  return s.map((_,k)=>s.reduce((a,v,j)=>add(a,mul(v,scale(phase(sign*2*Math.PI*j*k/N),1/Math.sqrt(N)))),c()));
}
export function qftRegister(s:State,bits:number,inverse=false):State {
  const targetDim=s.length/(2**bits),out=s.map(()=>c());
  for(let y=0;y<targetDim;y++) {const part=Array.from({length:2**bits},(_,x)=>s[x*targetDim+y]);qft(part,inverse).forEach((v,x)=>out[x*targetDim+y]=v);} return out;
}
export function equivalent(a:State,b:State,tolerance=1e-9):boolean {
  if(a.length!==b.length||Math.abs(norm(a)-norm(b))>tolerance)return false;
  const k=b.findIndex(z=>abs2(z)>tolerance*tolerance);if(k<0)return a.every(z=>abs2(z)<tolerance*tolerance);
  const ratio=scale(mul(a[k],conj(b[k])),1/abs2(b[k]));
  if(Math.abs(abs2(ratio)-1)>tolerance)return false;
  return a.every((z,j)=>{const r=mul(ratio,b[j]);return Math.hypot(z.re-r.re,z.im-r.im)<tolerance});
}
export const parity=(x:number):number=>{let p=0;while(x){p^=x&1;x>>>=1}return p};
export const markedOracle=(s:State,marked:number[])=>s.map((z,i)=>scale(z,marked.includes(i)?-1:1));
export function diffusion(s:State):State { const mean=scale(s.reduce(add,c()),1/s.length);return s.map(z=>add(scale(mean,2),scale(z,-1))); }
export function modPow(a:number,exponent:number,modulus:number):number {let b=BigInt(a),e=BigInt(exponent),m=BigInt(modulus),r=1n;while(e>0n){if(e&1n)r=r*b%m;b=b*b%m;e>>=1n}return Number(r);}
export const gcd=(a:number,b:number):number=>{while(b){[a,b]=[b,a%b]}return Math.abs(a)};
export function shorPostprocess(N:number,a:number,r:number):{factors?:number[];reason:string} {
  const g=gcd(a,N); if(g>1&&g<N)return {factors:[g,N/g],reason:'Classical gcd found a factor before order finding'};
  if(r<=0||!Number.isInteger(r)||modPow(a,r,N)!==1)return {reason:'Reject: candidate is not an order multiple'};
  if(r%2)return {reason:'Reject: odd order'};
  const x=modPow(a,r/2,N);if(x===1||x===N-1)return {reason:'Reject: trivial square root of one'};
  const f=[gcd(x-1,N),gcd(x+1,N)].filter(d=>d>1&&d<N);return f.length?{factors:f,reason:'Nontrivial factors'}:{reason:'Reject: gcds trivial'};
}
export function hhlDiagonal(diagonal:number[],b:number[],C:number) {
  if(diagonal.length!==b.length||diagonal.some(x=>x===0||Math.abs(C/x)>1)||Math.abs(b.reduce((s,x)=>s+x*x,0)-1)>1e-10)throw new Error('HHL requires normalized input and legal reciprocal rotations');
  const solution=b.map((x,i)=>x/diagonal[i]);
  const post=solution.map(x=>C*x),success=post.reduce((s,x)=>s+x*x,0);
  return {solution,success,state:post.map(x=>x/Math.sqrt(success)),failure:b.map((x,i)=>x*Math.sqrt(1-(C/diagonal[i])**2))};
}
