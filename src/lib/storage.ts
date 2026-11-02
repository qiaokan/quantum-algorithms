/** Browser storage is optional; malformed or older values must not stop reading. */
export const storage = {
  get(key: string, fallback = '') {
    try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  },
  set(key: string, value: string) {
    try { localStorage.setItem(key, value); } catch { /* Reading still works without persistence. */ }
  },
  remove(key: string) {
    try { localStorage.removeItem(key); } catch { /* Storage may be unavailable. */ }
  },
};

export type LearningStatus = 'read' | 'practiced' | 'revisit';
export function parseProgress(raw: string): Record<string, LearningStatus> {
  const result: Record<string, LearningStatus> = Object.create(null);
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
    for (const [id, status] of Object.entries(value)) {
      if (/^[a-z][a-z0-9-]*$/.test(id) && (status === 'read' || status === 'practiced' || status === 'revisit')) result[id] = status;
    }
  } catch { /* Invalid JSON is treated as no saved learning status. */ }
  return result;
}
