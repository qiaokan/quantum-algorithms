import {describe,it,expect} from 'vitest';
import {estimate,logicalErrorPerCycle,presets,sensitivity} from '../src/lib/resource-estimate';

describe('surface-code resource model',()=>{
 it('reproduces the Gidney–Ekerå logical error rule at p = 1e-3',()=>{
  for(const d of [3,7,15,27,29])expect(logicalErrorPerCycle(1e-3,d)/10**-((d+1)/2+1)).toBeCloseTo(1,9);
  expect(logicalErrorPerCycle(1e-3,5)/logicalErrorPerCycle(1e-3,7)).toBeCloseTo(10,9);
 });
 it('lands near the published RSA-2048 figures with the paper\'s inputs',()=>{
  const e=estimate(presets['gidney-ekera-2021'].input);
  expect(e.distance).toBe(27);expect(e.limitedBy).toBe('reaction');
  expect(e.runtimeSeconds/3600).toBeCloseTo(7.5,1);
  expect(e.physicalQubits/1e6).toBeGreaterThan(19);expect(e.physicalQubits/1e6).toBeLessThan(22);
  expect(e.failureProbability).toBeGreaterThan(0.25);expect(e.failureProbability).toBeLessThan(0.3);
  expect(e.dataPatches+e.factoryPatches).toBeCloseTo(226*63,-2);
 });
 it('lands near the published FeMoco figures with illustrative factory choices',()=>{
  const e=estimate(presets['lee-femoco-2021'].input);
  expect(e.distance).toBe(31);expect(e.limitedBy).toBe('factories');
  expect(e.runtimeSeconds/86400).toBeGreaterThan(3);expect(e.runtimeSeconds/86400).toBeLessThan(3.6);
  expect(e.physicalQubits/1e6).toBeCloseTo(4.2,1);
 });
 it('shows how much worse the same workload is at Λ ≈ 2.14 with a 63 µs reaction time',()=>{
  const e=estimate(presets['google-2024-noise'].input);
  expect(e.distance).toBe(89);expect(e.runtimeSeconds/3600).toBeCloseTo(47.25,1);expect(e.physicalQubits).toBeGreaterThan(2e8);
 });
 it('becomes factory-limited with too few factories and reports sensitivities',()=>{
  const base=presets['gidney-ekera-2021'].input;
  const one=estimate({...base,factories:1});expect(one.limitedBy).toBe('factories');expect(one.runtimeSeconds).toBeGreaterThan(estimate(base).runtimeSeconds*10);
  const s=sensitivity(base);const p=s.find(r=>r.input==='physicalError')!;
  expect(p.low!.distance).toBeLessThan(27);expect(p.high!.distance).toBeGreaterThan(27);
  const react=s.find(r=>r.input==='reactionTimeUs')!;expect(react.high!.runtimeSeconds).toBeCloseTo(2*estimate(base).runtimeSeconds,0);
 });
 it('rejects inputs at or above threshold and non-positive values',()=>{
  const base=presets['gidney-ekera-2021'].input;
  expect(()=>estimate({...base,physicalError:0.01})).toThrow();expect(()=>estimate({...base,factories:0})).toThrow();
  expect(()=>estimate({...base,routingOverhead:0.5})).toThrow();expect(()=>estimate({...base,failureBudget:1})).toThrow();
 });
});
