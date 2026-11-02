import { type State,basis,gate,H,X,oracle,markedOracle,diffusion,qft,qftRegister,phase,c,parity,probabilities,marginal,norm } from './quantum';
export interface Frame { name:string; explanation:string; state:State; queries:number; }
export interface Demo { id:string; title:string; frames:Frame[]; measuredQubits:number[]; labels:string; note:string; }
export const demoIds=['deutsch','grover','bernstein-vazirani','deutsch-jozsa','simon','qft','phase-estimation'];
export function makeDemo(id:string,instance='0'):Demo {
  const frames:Frame[]=[]; let state:State;let queries=0;
  const push=(name:string,explanation:string,s:State,delta=0)=>{state=s;queries+=delta;if(Math.abs(norm(s)-1)>1e-9)throw new Error('Operation lost normalization');frames.push({name,explanation,state:s,queries});};
  let measuredQubits:number[]=[];let labels='';let note='All operations are ideal. Numerical state inspection is a classical simulator privilege.';
  if(id==='deutsch') {
    const f=instance.padStart(2,'0').slice(-2).split('').map(Number);state=basis(2,1); measuredQubits=[0];labels='|input, target⟩';
    push('Prepare |01⟩','Input is 0. The auxiliary target is 1. No function has been queried.',state);
    push('H on input','H changes input 0 into (|0⟩ + |1⟩)/√2.',gate(state,0,H));
    push('H on target','H|1⟩ = (|0⟩ − |1⟩)/√2; the joint amplitudes are (1, −1, 1, −1)/2.',gate(state,1,H));
    push('Coherent U_f','Apply |x,y⟩ → |x,y XOR f(x)⟩. A target swap reverses the signs within that input branch.',oracle(state,1,1,x=>f[x]),1);
    push('H on input','Add/subtract the two input contributions. Equal function values give input 0; unequal values give input 1.',gate(state,0,H));
  } else if(id==='grover') {
    const mark=Number(instance); state=basis(2);measuredQubits=[0,1];labels='|candidate⟩';push('Prepare |00⟩','There are four candidate labels. Exactly one is marked.',state);
    push('H on left bit','Prepare the first bit uniformly.',gate(state,0,H));push('H on right bit','Each of four candidates has amplitude 1/2 and probability 1/4.',gate(state,1,H));
    for(let r=1;r<=3;r++) {push(`Oracle ${r}`,`Negate the amplitude of ${mark.toString(2).padStart(2,'0')}; immediate probabilities do not change.`,markedOracle(state,[mark]),1);push(`Diffusion ${r}`,'Each new amplitude is twice the current mean minus its old value. More iterations are not always better.',diffusion(state));}
  } else if(id==='bernstein-vazirani') {
    const secret=Number(instance);state=basis(4,1);measuredQubits=[0,1,2];labels='|three input bits, target⟩';push('Prepare |0001⟩','The hidden three-bit string determines a parity function.',state);
    for(let q=0;q<4;q++)push(`H on bit ${q}`,q===3?'Prepare target |−⟩.':'Prepare an input bit in |+⟩.',gate(state,q,H));
    push('Coherent U_f','f(x) is the parity of the positions where the hidden string and x both have bit 1.',oracle(state,3,1,x=>parity(x&secret)),1);
    for(let q=0;q<3;q++)push(`Readout H on bit ${q}`,'Turn the relative sign of this bit into a basis value.',gate(state,q,H));
  } else if(id==='deutsch-jozsa') {
    const values=instance==='one'?[1,1,1,1]:instance==='balanced'?[0,1,1,0]:instance==='broken'?[0,0,0,1]:[0,0,0,0];
    state=basis(3,1);measuredQubits=[0,1];labels='|two input bits, target⟩';push('Prepare |001⟩','Promise: f is constant or has two zeroes and two ones. The broken-promise option deliberately violates it.',state);
    for(let q=0;q<3;q++)push(`H on bit ${q}`,'Prepare input superposition and a |−⟩ auxiliary target.',gate(state,q,H));
    push('Coherent U_f',`Truth table in order 00,01,10,11: ${values.join(', ')}.`,oracle(state,2,1,x=>values[x]),1);
    for(let q=0;q<2;q++)push(`Readout H on bit ${q}`,'The 00 amplitude is the average of the four function-dependent signs.',gate(state,q,H));
    note+=' A broken promise can produce 00 with nonzero probability despite a nonconstant function.';
  } else if(id==='simon') {
    const secret=Number(instance)||3;state=basis(6);measuredQubits=[0,1,2];labels='|three input bits, three output bits⟩';push('Prepare |000,000⟩','Output register starts at zero, not |−⟩. This example uses f(x) = min(x, x XOR s).',state);
    for(let q=0;q<3;q++)push(`H on input ${q}`,'Create equal amplitudes over all eight inputs.',gate(state,q,H));
    push('Coherent U_f','Each output label tags a pair x and x XOR s. Distinct pairs have distinct labels.',oracle(state,3,3,x=>Math.min(x,x^secret)),1);
    for(let q=0;q<3;q++)push(`Readout H on input ${q}`,'Within each equal-output pair, contributions cancel unless the measured y satisfies parity(y AND s) = 0.',gate(state,q,H));
    note+=' The input marginal is the same whether the output register is discarded or measured with its outcome ignored. Repeated input samples supply linear equations; one run is not the whole algorithm.';
  } else if(id==='qft') {
    const x=Number(instance);state=basis(2,x);measuredQubits=[0,1];labels='|two-bit index⟩';push(`Prepare |${x.toString(2).padStart(2,'0')}⟩`,'Positive-exponent QFT, natural binary output order.',state);
    push('H on bit 0','Split the most significant bit.',gate(state,0,H));
    push('Controlled phase π/2','Only the |11⟩ contribution acquires a factor i.',gate(state,0,[[c(1),c()],[c(),phase(Math.PI/2)]],1));
    push('H on bit 1','Split the least significant bit.',gate(state,1,H));
    // SWAP via three controlled X gates; display each actual operation.
    push('CNOT 0 → 1 (SWAP 1/3)','First of three gates reversing the register order.',gate(state,1,X,0));
    push('CNOT 1 → 0 (SWAP 2/3)','Second SWAP component.',gate(state,0,X,1));
    push('CNOT 0 → 1 (SWAP 3/3)','Now amplitude k equals exp(2π i x k/4)/2. All four probabilities are 1/4.',gate(state,1,X,0));
    push('Inverse QFT','This bundled mathematical transform is computed directly by the simulator. It undoes the displayed QFT circuit.',qft(state,true));
  } else if(id==='phase-estimation') {
    const theta=Number.isFinite(Number(instance))?Number(instance):0.25;state=basis(4,1);measuredQubits=[0,1,2];labels='|three counting bits, target⟩';push('Prepare |000,1⟩','U = diag(1, exp(2πiθ)); |1⟩ is an eigenstate. θ is the fraction of one full turn.',state);
    for(let q=0;q<3;q++)push(`H on counter ${q}`,'Prepare a uniform counting register.',gate(state,q,H));
    for(let q=0;q<3;q++){const power=2**(2-q);push(`Controlled U^${power}`,`Apply ${power} base-U calls, bundled for display. The |1⟩ eigenstate persists; conditional phase changes counter amplitudes.`,gate(state,3,[[c(1),c()],[c(),phase(2*Math.PI*theta*power)]],q),power);}
    push('Inverse QFT on counter','Compute the negative-exponent Fourier transform of the counting amplitudes. Peaks occur near y/8 = θ; inexact phases spread across outcomes.',qftRegister(state,3,true));
    note+=' Controlled powers cost 4 + 2 + 1 = 7 base-U calls here. Direct calculation of a powered 2×2 matrix is a simulator convenience, not a free oracle resource.';
  } else throw new Error(`Unknown demo: ${id}`);
  return {id,title:id,frames,measuredQubits,labels,note};
}
export const resultProbabilities=(d:Demo,i:number)=>marginal(d.frames[i].state,d.measuredQubits);
export const stateProbabilities=(d:Demo,i:number)=>probabilities(d.frames[i].state);
