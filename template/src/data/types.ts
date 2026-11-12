/**
 * PumpkinSeed data layer contracts.
 *
 * One tiny interface powers both apps. Two swappable backends:
 *  - local:  localStorage + BroadcastChannel �� zero-setup, two browser tabs
 *            demo live realtime with no account at all.
 *  - supabase: hosted Postgres + realtime �� the community-grade backend.
 *
 * Apps never know (or care) which one is active.
 */

export interface Row {
  id: string;
  created_at: string;
}

export type RowDraft<T extends Row> = Omit<T, 'id' | 'created_at'>;

export interface DataLayer {
  /** Which adapter is live �� surfaced in the UI as a subtle badge. */
  readonly mode: 'local' | 'supabase';
  list<T extends Row>(table: string): Promise<T[]>;
  insert<T extends Row>(table: string, row: RowDraft<T>): Promise<T>;
  update<T extends Row>(table: string, id: string, patch: Partial<T>): Promise<T>;
  remove(table: string, id: string): Promise<void>;
  /** Subscribe to the full current row set of a table; returns unsubscribe. */
  subscribe<T extends Row>(table: string, listener: (rows: T[]) => void, onError?: (error: unknown) => void): () => void;
}

export class DataLayerError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'DataLayerError';
  }
}

export function uid(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function nowIso(): string {
  return new Date().toISOString();
}

