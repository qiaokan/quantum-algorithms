// Two small decoders over a decoding graph: exact minimum-weight perfect matching (by dynamic
// programming over subsets, for teaching-sized inputs) and the union-find decoder of Delfosse and
// Nickerson with peeling. Node -1 stands for the boundary, which can absorb any number of defects.

export interface DecodingEdge { a: number; b: number; weight: number; fault: number; flipsObservable: boolean }
export interface DecodingGraph { nodes: number; edges: DecodingEdge[] }
export interface Correction { edges: number[]; faults: number[]; flipsObservable: boolean; weight: number }

function validate(graph: DecodingGraph, defects: number[]) {
  if (!Number.isInteger(graph.nodes) || graph.nodes < 1) throw new Error('Graph needs at least one node.');
  for (const e of graph.edges) {
    if (!(e.weight > 0) || !Number.isFinite(e.weight)) throw new Error('Edge weights must be positive and finite.');
    for (const v of [e.a, e.b]) if (!Number.isInteger(v) || v < -1 || v >= graph.nodes) throw new Error(`Edge endpoint ${v} is not a node.`);
  }
  if (new Set(defects).size !== defects.length) throw new Error('Defects must be distinct.');
  for (const v of defects) if (!Number.isInteger(v) || v < 0 || v >= graph.nodes) throw new Error(`Defect ${v} is not a node.`);
}

function summarize(graph: DecodingGraph, edgeIds: number[]): Correction {
  // An edge used twice cancels; keep the parity of each edge.
  const count = new Map<number, number>();
  for (const id of edgeIds) count.set(id, (count.get(id) ?? 0) ^ 1);
  const edges = [...count].filter(([, v]) => v).map(([id]) => id).sort((x, y) => x - y);
  return {
    edges,
    faults: edges.map(id => graph.edges[id].fault),
    flipsObservable: edges.reduce((f, id) => f !== graph.edges[id].flipsObservable, false),
    weight: edges.reduce((w, id) => w + graph.edges[id].weight, 0),
  };
}

/** Defects (flipped checks) produced by a set of faulty edges. */
export function defectsOf(graph: DecodingGraph, edgeIds: number[]): number[] {
  const flipped = new Uint8Array(graph.nodes);
  for (const id of edgeIds) { const e = graph.edges[id]; if (e.a >= 0) flipped[e.a] ^= 1; if (e.b >= 0) flipped[e.b] ^= 1; }
  return [...flipped].flatMap((f, v) => f ? [v] : []);
}

/** Dijkstra from one node; the boundary is node index graph.nodes. Returns distances and the edge used to reach each node. */
function shortestPaths(graph: DecodingGraph, source: number) {
  const total = graph.nodes + 1, boundary = graph.nodes;
  const adj: [number, number][][] = Array.from({ length: total }, () => []);
  graph.edges.forEach((e, id) => { const a = e.a < 0 ? boundary : e.a, b = e.b < 0 ? boundary : e.b; adj[a].push([b, id]); adj[b].push([a, id]); });
  const dist = new Array<number>(total).fill(Infinity), via = new Array<number>(total).fill(-1), done = new Uint8Array(total);
  dist[source] = 0;
  for (let step = 0; step < total; step++) {
    let u = -1;
    for (let v = 0; v < total; v++) if (!done[v] && (u < 0 || dist[v] < dist[u])) u = v;
    if (u < 0 || dist[u] === Infinity) break;
    done[u] = 1;
    // Paths may not pass through the boundary: it is an endpoint, not a corridor.
    if (u === boundary && u !== source) continue;
    for (const [v, id] of adj[u]) { const w = dist[u] + graph.edges[id].weight; if (w < dist[v]) { dist[v] = w; via[v] = id; } }
  }
  const pathTo = (target: number) => { const ids: number[] = []; let v = target; while (v !== source && via[v] >= 0) { const e = graph.edges[via[v]]; ids.push(via[v]); const a = e.a < 0 ? boundary : e.a, b = e.b < 0 ? boundary : e.b; v = a === v ? b : a; } return ids; };
  return { dist, pathTo };
}

export const MAX_EXACT_DEFECTS = 20;

/** Exact minimum-weight perfect matching of defects, each paired with another defect or the boundary. */
export function matchingDecoder(graph: DecodingGraph, defects: number[]): Correction & { pairs: [number, number][] } {
  validate(graph, defects);
  const k = defects.length;
  if (k > MAX_EXACT_DEFECTS) throw new Error(`Exact matching is limited to ${MAX_EXACT_DEFECTS} defects.`);
  if (k === 0) return { ...summarize(graph, []), pairs: [] };
  const sp = defects.map(v => shortestPaths(graph, v));
  const boundary = graph.nodes;
  const pairCost = (i: number, j: number) => sp[i].dist[defects[j]];
  const boundaryCost = (i: number) => sp[i].dist[boundary];
  const full = (1 << k) - 1;
  const best = new Float64Array(1 << k).fill(Infinity), choice = new Int32Array(1 << k).fill(-2);
  best[0] = 0;
  for (let mask = 1; mask <= full; mask++) {
    const i = 31 - Math.clz32(mask & -mask); // lowest unmatched defect
    const rest = mask & ~(1 << i);
    const viaBoundary = boundaryCost(i) + best[rest];
    if (viaBoundary < best[mask]) { best[mask] = viaBoundary; choice[mask] = -1; }
    for (let j = i + 1; j < k; j++) if (rest & (1 << j)) {
      const cost = pairCost(i, j) + best[rest & ~(1 << j)];
      if (cost < best[mask]) { best[mask] = cost; choice[mask] = j; }
    }
  }
  if (!Number.isFinite(best[full])) throw new Error('Some defect cannot reach another defect or the boundary.');
  const pairs: [number, number][] = [], used: number[] = [];
  for (let mask = full; mask; ) {
    const i = 31 - Math.clz32(mask & -mask), j = choice[mask];
    if (j === -1) { pairs.push([defects[i], -1]); used.push(...sp[i].pathTo(boundary)); mask &= ~(1 << i); }
    else { pairs.push([defects[i], defects[j]]); used.push(...sp[i].pathTo(defects[j])); mask &= ~((1 << i) | (1 << j)); }
  }
  return { ...summarize(graph, used), pairs };
}

/**
 * Union-find decoder (Delfosse–Nickerson): grow odd clusters by half-edges, merge clusters when an
 * edge becomes fully grown, stop when every cluster has even defect parity or touches the
 * boundary, then peel a spanning forest of the grown edges to choose the correction.
 */
export function unionFindDecoder(graph: DecodingGraph, defects: number[]): Correction & { rounds: number } {
  validate(graph, defects);
  const total = graph.nodes + 1, boundary = graph.nodes;
  const end = (v: number) => v < 0 ? boundary : v;
  const parent = Array.from({ length: total }, (_, v) => v);
  const parity = new Uint8Array(total), touchesBoundary = new Uint8Array(total);
  touchesBoundary[boundary] = 1;
  const isDefect = new Uint8Array(total);
  for (const v of defects) { isDefect[v] = 1; parity[v] = 1; }
  const find = (v: number): number => { while (parent[v] !== v) { parent[v] = parent[parent[v]]; v = parent[v]; } return v; };
  const union = (a: number, b: number) => {
    let ra = find(a), rb = find(b); if (ra === rb) return;
    if (rb === boundary) [ra, rb] = [rb, ra]; // keep the boundary as a root so its flag is easy to read
    parent[rb] = ra; parity[ra] ^= parity[rb]; touchesBoundary[ra] |= touchesBoundary[rb];
  };
  const growth = new Float64Array(graph.edges.length);
  const active = (root: number) => parity[root] === 1 && !touchesBoundary[root];
  let rounds = 0;
  while (true) {
    const growing = new Set<number>();
    for (let v = 0; v < graph.nodes; v++) if (active(find(v))) growing.add(find(v));
    if (!growing.size) break;
    rounds++;
    if (rounds > 4 * (graph.edges.length + 1) * Math.max(1, ...graph.edges.map(e => e.weight))) throw new Error('Union-find did not converge.');
    const fused: number[] = [];
    graph.edges.forEach((e, id) => {
      if (growth[id] >= e.weight) return;
      const ra = find(end(e.a)), rb = find(end(e.b));
      // Each active cluster on either end grows the edge by half a unit per round.
      const add = (growing.has(ra) ? 0.5 : 0) + (growing.has(rb) && rb !== ra ? 0.5 : 0);
      if (add) { growth[id] = Math.min(e.weight, growth[id] + add); if (growth[id] >= e.weight) fused.push(id); }
    });
    for (const id of fused) union(end(graph.edges[id].a), end(graph.edges[id].b));
  }
  // Peeling: spanning forest of fully grown edges, rooted at the boundary where it is present.
  const adj: [number, number][][] = Array.from({ length: total }, () => []);
  graph.edges.forEach((e, id) => { if (growth[id] >= e.weight) { adj[end(e.a)].push([end(e.b), id]); adj[end(e.b)].push([end(e.a), id]); } });
  const seen = new Uint8Array(total), order: number[] = [], via = new Int32Array(total).fill(-1), up = new Int32Array(total).fill(-1);
  const starts = [boundary, ...Array.from({ length: graph.nodes }, (_, v) => v)];
  for (const s of starts) {
    if (seen[s]) continue;
    seen[s] = 1; const queue = [s];
    while (queue.length) { const u = queue.shift()!; order.push(u); for (const [v, id] of adj[u]) if (!seen[v]) { seen[v] = 1; via[v] = id; up[v] = u; queue.push(v); } }
  }
  const chosen: number[] = [];
  for (let k = order.length - 1; k >= 0; k--) {
    const v = order[k];
    if (via[v] < 0 || !isDefect[v]) continue;
    chosen.push(via[v]); isDefect[v] = 0; if (up[v] !== boundary) isDefect[up[v]] ^= 1;
  }
  return { ...summarize(graph, chosen), rounds };
}
