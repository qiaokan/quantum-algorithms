// Stabilizer-tableau simulator for Clifford circuits with Pauli noise, following the
// destabilizer tableau of Aaronson and Gottesman (2004). Qubit 0 is the leftmost character of a
// Pauli string, matching the state-vector simulator's big-endian convention.
//
// Rows 0..n-1 are destabilizers, rows n..2n-1 stabilizers, row 2n is scratch. Each row stores a
// Pauli as x and z bits per qubit (x=z=1 means Y) and a sign bit r (r=1 means a factor of -1).

export type Rng = () => number;
export interface Measurement { outcome: 0 | 1; deterministic: boolean }
export const MAX_STABILIZER_QUBITS = 512;

export class Tableau {
  readonly n: number;
  private x: Uint8Array[];
  private z: Uint8Array[];
  private r: Uint8Array;

  constructor(n: number) {
    if (!Number.isInteger(n) || n < 1 || n > MAX_STABILIZER_QUBITS) throw new Error(`Use 1–${MAX_STABILIZER_QUBITS} qubits.`);
    this.n = n;
    this.x = Array.from({ length: 2 * n + 1 }, () => new Uint8Array(n));
    this.z = Array.from({ length: 2 * n + 1 }, () => new Uint8Array(n));
    this.r = new Uint8Array(2 * n + 1);
    // |0...0>: destabilizer i is X_i, stabilizer i is Z_i.
    for (let i = 0; i < n; i++) { this.x[i][i] = 1; this.z[n + i][i] = 1; }
  }

  private check(...qubits: number[]) {
    for (const q of qubits) if (!Number.isInteger(q) || q < 0 || q >= this.n) throw new Error(`Invalid qubit ${q}`);
    if (new Set(qubits).size !== qubits.length) throw new Error('A two-qubit gate needs distinct qubits.');
  }

  h(a: number) {
    this.check(a);
    for (let i = 0; i < 2 * this.n; i++) {
      this.r[i] ^= this.x[i][a] & this.z[i][a];
      const t = this.x[i][a]; this.x[i][a] = this.z[i][a]; this.z[i][a] = t;
    }
  }

  s(a: number) {
    this.check(a);
    for (let i = 0; i < 2 * this.n; i++) { this.r[i] ^= this.x[i][a] & this.z[i][a]; this.z[i][a] ^= this.x[i][a]; }
  }

  sdg(a: number) { this.s(a); this.s(a); this.s(a); }

  cx(control: number, target: number) {
    this.check(control, target);
    const a = control, b = target;
    for (let i = 0; i < 2 * this.n; i++) {
      this.r[i] ^= this.x[i][a] & this.z[i][b] & (this.x[i][b] ^ this.z[i][a] ^ 1);
      this.x[i][b] ^= this.x[i][a];
      this.z[i][a] ^= this.z[i][b];
    }
  }

  cz(a: number, b: number) { this.h(b); this.cx(a, b); this.h(b); }

  // A Pauli gate flips the sign of every row it anticommutes with.
  xGate(a: number) { this.check(a); for (let i = 0; i < 2 * this.n; i++) this.r[i] ^= this.z[i][a]; }
  zGate(a: number) { this.check(a); for (let i = 0; i < 2 * this.n; i++) this.r[i] ^= this.x[i][a]; }
  yGate(a: number) { this.check(a); for (let i = 0; i < 2 * this.n; i++) this.r[i] ^= this.x[i][a] ^ this.z[i][a]; }

  applyPauli(pauli: string) {
    if (pauli.length !== this.n || /[^IXYZ]/.test(pauli)) throw new Error('Pauli string must use I, X, Y, Z with one letter per qubit.');
    [...pauli].forEach((p, q) => { if (p === 'X') this.xGate(q); else if (p === 'Y') this.yGate(q); else if (p === 'Z') this.zGate(q); });
  }

  // Exponent of i picked up when multiplying single-qubit Paulis (x1,z1)*(x2,z2).
  private static g(x1: number, z1: number, x2: number, z2: number): number {
    if (!x1 && !z1) return 0;
    if (x1 && z1) return z2 - x2;
    if (x1) return z2 * (2 * x2 - 1);
    return x2 * (1 - 2 * z2);
  }

  // Row h := row i * row h, tracking the sign exactly.
  private rowsum(h: number, i: number) {
    let e = 2 * this.r[h] + 2 * this.r[i];
    for (let j = 0; j < this.n; j++) e += Tableau.g(this.x[i][j], this.z[i][j], this.x[h][j], this.z[h][j]);
    this.r[h] = ((e % 4) + 4) % 4 === 0 ? 0 : 1;
    for (let j = 0; j < this.n; j++) { this.x[h][j] ^= this.x[i][j]; this.z[h][j] ^= this.z[i][j]; }
  }

  private copyRow(to: number, from: number) { this.x[to].set(this.x[from]); this.z[to].set(this.z[from]); this.r[to] = this.r[from]; }
  private clearRow(row: number) { this.x[row].fill(0); this.z[row].fill(0); this.r[row] = 0; }

  /** Measure qubit a in the computational basis. rng decides random outcomes (rng() < 0.5 gives 0). */
  measure(a: number, rng: Rng = Math.random): Measurement {
    this.check(a);
    const n = this.n;
    let p = -1;
    for (let i = n; i < 2 * n; i++) if (this.x[i][a]) { p = i; break; }
    if (p >= 0) {
      for (let i = 0; i < 2 * n; i++) if (i !== p && this.x[i][a]) this.rowsum(i, p);
      this.copyRow(p - n, p);
      this.clearRow(p);
      this.z[p][a] = 1;
      const draw = rng();
      if (!Number.isFinite(draw)) throw new Error('Random draw must be finite.');
      const outcome: 0 | 1 = draw < 0.5 ? 0 : 1;
      this.r[p] = outcome;
      return { outcome, deterministic: false };
    }
    const scratch = 2 * n;
    this.clearRow(scratch);
    for (let i = 0; i < n; i++) if (this.x[i][a]) this.rowsum(scratch, i + n);
    return { outcome: this.r[scratch] ? 1 : 0, deterministic: true };
  }

  reset(a: number, rng: Rng = Math.random) { if (this.measure(a, rng).outcome === 1) this.xGate(a); }

  /** Expectation value of a Pauli string on the current stabilizer state: +1, -1 or 0. */
  expectation(pauli: string): -1 | 0 | 1 {
    if (pauli.length !== this.n || /[^IXYZ]/.test(pauli)) throw new Error('Pauli string must use I, X, Y, Z with one letter per qubit.');
    const n = this.n;
    const px = [...pauli].map(p => (p === 'X' || p === 'Y') ? 1 : 0), pz = [...pauli].map(p => (p === 'Z' || p === 'Y') ? 1 : 0);
    const anticommutes = (row: number) => { let s = 0; for (let j = 0; j < n; j++) s ^= (px[j] & this.z[row][j]) ^ (pz[j] & this.x[row][j]); return s === 1; };
    for (let i = n; i < 2 * n; i++) if (anticommutes(i)) return 0;
    // P commutes with the stabilizer group, so P = ±(product of the stabilizers whose
    // destabilizer partners anticommute with P). Build that product in the scratch row.
    const scratch = 2 * n;
    this.clearRow(scratch);
    for (let i = 0; i < n; i++) if (anticommutes(i)) this.rowsum(scratch, i + n);
    for (let j = 0; j < n; j++) if (this.x[scratch][j] !== px[j] || this.z[scratch][j] !== pz[j]) throw new Error('Internal tableau inconsistency.');
    return this.r[scratch] ? -1 : 1;
  }

  /** Current stabilizer generators as signed Pauli strings, for display and tests. */
  stabilizers(): string[] {
    const out: string[] = [];
    for (let i = this.n; i < 2 * this.n; i++) {
      let s = this.r[i] ? '-' : '+';
      for (let j = 0; j < this.n; j++) s += this.x[i][j] ? (this.z[i][j] ? 'Y' : 'X') : (this.z[i][j] ? 'Z' : 'I');
      out.push(s);
    }
    return out;
  }
}

/** Apply X, Y or Z to qubit q, each with probability p/3 (single-qubit depolarizing noise). */
export function depolarize(t: Tableau, q: number, p: number, rng: Rng = Math.random): 'I' | 'X' | 'Y' | 'Z' {
  if (!(p >= 0 && p <= 1)) throw new Error('Error probability must be between 0 and 1.');
  const u = rng();
  if (u >= p) return 'I';
  const which = (['X', 'Y', 'Z'] as const)[Math.min(2, Math.floor((u / p) * 3))];
  if (which === 'X') t.xGate(q); else if (which === 'Y') t.yGate(q); else t.zGate(q);
  return which;
}

/** Apply a bit flip (X) to qubit q with probability p. */
export function bitFlip(t: Tableau, q: number, p: number, rng: Rng = Math.random): boolean {
  if (!(p >= 0 && p <= 1)) throw new Error('Error probability must be between 0 and 1.');
  if (rng() < p) { t.xGate(q); return true; }
  return false;
}

/** Small deterministic generator for reproducible tests and demonstrations (mulberry32). */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
