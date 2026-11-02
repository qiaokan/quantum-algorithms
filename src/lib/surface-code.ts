// Rotated surface code layout and code-capacity decoding graphs.
// Data qubit (row, col) has index row*d + col, rows top to bottom, columns left to right.
// A plaquette (i, j), 0 <= i, j <= d, touches the data qubits at the corners
// (i-1, j-1), (i-1, j), (i, j-1), (i, j) that exist. It is X-type when i + j is even and Z-type
// when odd. All interior plaquettes are kept; X-type plaquettes are kept on the top and bottom
// edges and Z-type on the left and right edges, giving d^2 - 1 stabilizers.
import {Tableau} from './stabilizer';
import type {DecodingGraph} from './decoders';

export interface Plaquette { type: 'X' | 'Z'; i: number; j: number; qubits: number[] }
export interface SurfaceCode {
  d: number;
  dataQubits: number;
  stabilizers: Plaquette[];
  xStabilizers: Plaquette[];
  zStabilizers: Plaquette[];
  logicalX: number[]; // X on every data qubit of column 0
  logicalZ: number[]; // Z on every data qubit of row 0
}

export function surfaceCode(d: number): SurfaceCode {
  if (!Number.isInteger(d) || d < 3 || d % 2 === 0 || d > 15) throw new Error('Use an odd distance from 3 to 15.');
  const stabilizers: Plaquette[] = [];
  for (let i = 0; i <= d; i++) for (let j = 0; j <= d; j++) {
    const type = (i + j) % 2 === 0 ? 'X' : 'Z';
    const qubits: number[] = [];
    for (const [r, col] of [[i - 1, j - 1], [i - 1, j], [i, j - 1], [i, j]]) if (r >= 0 && r < d && col >= 0 && col < d) qubits.push(r * d + col);
    const interior = i > 0 && i < d && j > 0 && j < d;
    const topBottom = (i === 0 || i === d) && j > 0 && j < d;
    const leftRight = (j === 0 || j === d) && i > 0 && i < d;
    if (interior || (topBottom && type === 'X') || (leftRight && type === 'Z')) stabilizers.push({ type, i, j, qubits });
  }
  return {
    d, dataQubits: d * d, stabilizers,
    xStabilizers: stabilizers.filter(s => s.type === 'X'),
    zStabilizers: stabilizers.filter(s => s.type === 'Z'),
    logicalX: Array.from({ length: d }, (_, r) => r * d),
    logicalZ: Array.from({ length: d }, (_, col) => col),
  };
}

/** Which stabilizers of the given type an error on these data qubits flips (1 = flipped). */
export function syndrome(checks: Plaquette[], errorQubits: number[]): number[] {
  const e = new Set<number>();
  for (const q of errorQubits) { if (e.has(q)) e.delete(q); else e.add(q); }
  return checks.map(s => s.qubits.filter(q => e.has(q)).length % 2);
}

/**
 * Code-capacity decoding graph for X errors: one node per Z stabilizer, one edge per data qubit
 * joining the Z stabilizers it touches, or one stabilizer and the boundary. An edge's fault is
 * its data qubit; it flips the logical observable when that qubit lies on logical Z (row 0).
 */
export function xErrorGraph(code: SurfaceCode): DecodingGraph {
  const edges = [];
  for (let q = 0; q < code.dataQubits; q++) {
    const touching = code.zStabilizers.map((s, k) => s.qubits.includes(q) ? k : -1).filter(k => k >= 0);
    if (touching.length < 1 || touching.length > 2) throw new Error(`Data qubit ${q} touches ${touching.length} Z stabilizers.`);
    edges.push({ a: touching[0], b: touching.length === 2 ? touching[1] : -1, weight: 1, fault: q, flipsObservable: code.logicalZ.includes(q) });
  }
  return { nodes: code.zStabilizers.length, edges };
}

/** Repetition code of length d: checks Z_k Z_{k+1}; the end qubits also meet the boundary. */
export function repetitionGraph(d: number): DecodingGraph {
  if (!Number.isInteger(d) || d < 2) throw new Error('Use at least 2 qubits.');
  const edges = Array.from({ length: d }, (_, q) => ({ a: q === 0 ? 0 : q - 1, b: q === 0 ? -1 : q === d - 1 ? -1 : q, weight: 1, fault: q, flipsObservable: q === 0 }));
  return { nodes: d - 1, edges };
}

/**
 * One round of syndrome extraction for the rotated surface code on a stabilizer tableau.
 * Data qubits are 0..d^2-1; each stabilizer has its own measure qubit after them, so d = 3 uses
 * 9 + 8 = 17 qubits. Returns one bit per stabilizer, in the order of code.stabilizers.
 */
export function measureStabilizers(t: Tableau, code: SurfaceCode, rng?: () => number): number[] {
  if (t.n !== code.dataQubits + code.stabilizers.length) throw new Error('Tableau size must be data qubits plus one measure qubit per stabilizer.');
  return code.stabilizers.map((s, k) => {
    const m = code.dataQubits + k;
    t.reset(m, rng);
    if (s.type === 'Z') { for (const q of s.qubits) t.cx(q, m); }
    else { t.h(m); for (const q of s.qubits) t.cx(m, q); t.h(m); }
    return t.measure(m, rng).outcome;
  });
}
