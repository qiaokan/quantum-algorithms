// A deliberately simple surface-code resource model for teaching. It is not a reproduction of
// any paper's compiler; each assumption is stated so the reader can see what drives the answer.
//
// Logical error per patch per cycle: eps(d) = 0.1 * (p / 0.01)^((d+1)/2). At p = 1e-3 and odd d
// this equals 10^-((d+1)/2 + 1), the rule Gidney and Ekerå (2021, Sec. 2.13) adopt ("approximately
// 10^-ceil(d/2+1)"), i.e. Λ = 10 when p = 1e-3 and Λ = 0.01 / p in general.
// Time per non-Clifford operation: the slower of the reaction time (feedforward through the
// decoder) and the factory supply interval, cyclesPerStatePerD * d cycles per state shared over
// all factories. Operations are assumed sequential: no parallel threads.
// Footprint: (logical qubits * routing overhead + factories * patches per factory) patches of
// 2 d^2 physical qubits each.

export interface EstimateInput {
  physicalError: number;       // p, per physical operation
  cycleTimeUs: number;         // surface-code cycle time, microseconds
  reactionTimeUs: number;      // decode + feedforward latency, microseconds
  failureBudget: number;       // acceptable probability that the whole run fails from logical errors
  nonCliffordOps: number;      // T, Toffoli or CCZ count, each consuming one magic state
  logicalQubits: number;       // algorithm's logical qubits
  factories: number;           // magic-state factories running in parallel
  routingOverhead: number;     // patches per algorithm qubit, including routing space (>= 1)
  patchesPerFactory: number;   // factory footprint in logical patches
  cyclesPerStatePerD: number;  // factory time per magic state, in units of d cycles
}

export interface Estimate {
  distance: number;
  logicalErrorPerCycle: number;
  timePerOpUs: number;
  limitedBy: 'reaction' | 'factories';
  runtimeSeconds: number;
  dataPatches: number;
  factoryPatches: number;
  physicalQubits: number;
  failureProbability: number;
}

export const THRESHOLD = 0.01;
export const MAX_DISTANCE = 101;

export function logicalErrorPerCycle(p: number, d: number): number {
  return 0.1 * (p / THRESHOLD) ** ((d + 1) / 2);
}

function validate(i: EstimateInput) {
  const positive: (keyof EstimateInput)[] = ['physicalError', 'cycleTimeUs', 'reactionTimeUs', 'failureBudget', 'nonCliffordOps', 'logicalQubits', 'factories', 'patchesPerFactory', 'cyclesPerStatePerD'];
  for (const k of positive) if (!(Number.isFinite(i[k]) && i[k] > 0)) throw new Error(`${k} must be a positive number.`);
  if (!(i.routingOverhead >= 1)) throw new Error('routingOverhead must be at least 1.');
  if (i.physicalError >= THRESHOLD) throw new Error(`Physical error must be below the model threshold ${THRESHOLD}; above it, a larger code does not help.`);
  if (i.failureBudget >= 1) throw new Error('failureBudget must be below 1.');
}

export function estimate(i: EstimateInput): Estimate {
  validate(i);
  const dataPatches = i.logicalQubits * i.routingOverhead;
  const factoryPatches = i.factories * i.patchesPerFactory;
  for (let d = 3; d <= MAX_DISTANCE; d += 2) {
    const supplyUs = (i.cyclesPerStatePerD * d * i.cycleTimeUs) / i.factories;
    const timePerOpUs = Math.max(i.reactionTimeUs, supplyUs);
    const runtimeSeconds = (i.nonCliffordOps * timePerOpUs) / 1e6;
    const cycles = (runtimeSeconds * 1e6) / i.cycleTimeUs;
    const eps = logicalErrorPerCycle(i.physicalError, d);
    // Factory patches are excluded from the topological-error budget, as in Gidney–Ekerå Sec. 2.13:
    // their errors are part of the magic-state error, which this model does not treat.
    const failureProbability = Math.min(1, dataPatches * cycles * eps);
    if (failureProbability <= i.failureBudget) {
      return {
        distance: d, logicalErrorPerCycle: eps, timePerOpUs,
        limitedBy: supplyUs > i.reactionTimeUs ? 'factories' : 'reaction',
        runtimeSeconds, dataPatches, factoryPatches,
        physicalQubits: Math.round((dataPatches + factoryPatches) * 2 * d * d),
        failureProbability,
      };
    }
  }
  throw new Error(`No distance up to ${MAX_DISTANCE} meets the failure budget.`);
}

/** Published-scenario inputs used in FT-11. Values not taken from the papers are labelled as fitted. */
export const presets: Record<string, { label: string; input: EstimateInput; note: string }> = {
  'gidney-ekera-2021': {
    label: 'RSA-2048, Gidney–Ekerå (2021) assumptions',
    input: {
      physicalError: 1e-3, cycleTimeUs: 1, reactionTimeUs: 10, failureBudget: 0.3,
      nonCliffordOps: 2.7e9, logicalQubits: 6189, factories: 28,
      routingOverhead: 1.725, patchesPerFactory: 127, cyclesPerStatePerD: 5.5,
    },
    note: 'p, cycle time, reaction time, 2.7 billion Toffoli+T/2, 3n + 0.002 n lg n = 6189 abstract qubits and 28 factories are from the paper. Routing overhead and factory footprint are fitted so the board matches its 226 × 63 logical patches with about 25% used for distillation; the factory speed is borrowed from Babbush et al. (2021).',
  },
  'lee-femoco-2021': {
    label: 'FeMoco (Reiher), Lee et al. (2021) assumptions',
    input: {
      physicalError: 1e-3, cycleTimeUs: 1, reactionTimeUs: 10, failureBudget: 0.01,
      nonCliffordOps: 6.7e9, logicalQubits: 2142, factories: 4,
      routingOverhead: 1, patchesPerFactory: 10, cyclesPerStatePerD: 5.5,
    },
    note: 'p = 0.1%, 1 µs cycle, 2,142 logical qubits, 6.7 billion Toffolis (its compilation section; Table III lists 5.3 billion), four CCZ factories and a 1% error budget are from the paper, which reports about 4 million qubits and 3 days. The 10-patch factory footprint and routing overhead 1 are illustrative.',
  },
  'google-2024-noise': {
    label: 'Same RSA workload at Google 2024 noise (Λ ≈ 2.14)',
    input: {
      physicalError: 0.01 / 2.14, cycleTimeUs: 1.1, reactionTimeUs: 63, failureBudget: 0.3,
      nonCliffordOps: 2.7e9, logicalQubits: 6189, factories: 28,
      routingOverhead: 1.725, patchesPerFactory: 127, cyclesPerStatePerD: 5.5,
    },
    note: 'Illustrative. In this model Λ = 0.01 / p, so p = 0.01 / 2.14 reproduces Google\'s measured Λ; 1.1 µs cycle and 63 µs real-time decoder latency (at distance 5) are from that paper. Using its decoder latency as the reaction time is an assumption.',
  },
};

/** Vary each input down and up by a factor and report the effect on qubits and runtime. */
export function sensitivity(i: EstimateInput, factor = 2): { input: keyof EstimateInput; low: Estimate | null; high: Estimate | null }[] {
  const keys: (keyof EstimateInput)[] = ['physicalError', 'cycleTimeUs', 'reactionTimeUs', 'failureBudget', 'nonCliffordOps', 'logicalQubits', 'factories'];
  const tryEstimate = (x: EstimateInput) => { try { return estimate(x); } catch { return null; } };
  return keys.map(k => ({ input: k, low: tryEstimate({ ...i, [k]: i[k] / factor }), high: tryEstimate({ ...i, [k]: i[k] * factor }) }));
}
