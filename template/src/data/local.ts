import { BroadcastChannel } from './broadcast';
import { DataLayerError, nowIso, uid } from './types';
import type { DataLayer, Row, RowDraft } from './types';

const key = (table: string) => `ps:${table}`;

/** Browser-profile-local demo storage, not a shared database or secure store. */
export class LocalAdapter implements DataLayer {
  readonly mode = 'local' as const;
  private channels = new Map<string, BroadcastChannel>();

  private mutate<T>(table: string, operation: () => T): Promise<T> {
    // Serialize read/modify/write across same-origin tabs on modern browsers.
    if (typeof navigator !== 'undefined' && navigator.locks) {
      return navigator.locks.request(`ps:write:${table}`, operation);
    }
    return Promise.resolve().then(operation);
  }

  private read<T extends Row>(table: string): T[] {
    try {
      const raw = localStorage.getItem(key(table));
      if (!raw) return [];
      const rows: unknown = JSON.parse(raw);
      if (!Array.isArray(rows) || rows.some((row) => !row || typeof row.id !== 'string' || typeof row.created_at !== 'string')) {
        throw new Error('Invalid stored rows');
      }
      return rows as T[];
    } catch (cause) {
      throw new DataLayerError(`Cannot read ${table}. Browser storage is unavailable or damaged. Existing data was not changed.`, cause);
    }
  }

  private write<T extends Row>(table: string, rows: T[]): void {
    try {
      localStorage.setItem(key(table), JSON.stringify(rows));
    } catch (cause) {
      throw new DataLayerError('Could not save. Browser storage may be blocked or full.', cause);
    }
    // Native BroadcastChannel does not echo to its sender.
    const channel = this.channels.get(table) ?? new BroadcastChannel(`ps-sync:${table}`);
    channel.postMessage({ type: 'change', table });
    if (channel.listenerCount === 0) channel.close();
  }

  async list<T extends Row>(table: string): Promise<T[]> {
    return this.read<T>(table).sort((a, b) => a.created_at.localeCompare(b.created_at));
  }

  async insert<T extends Row>(table: string, draft: RowDraft<T>): Promise<T> {
    return this.mutate(table, () => {
      const row = { ...draft, id: uid(), created_at: nowIso() } as T;
      this.write(table, [...this.read<T>(table), row]);
      return row;
    });
  }

  async update<T extends Row>(table: string, id: string, patch: Partial<T>): Promise<T> {
    return this.mutate(table, () => {
    const rows = this.read<T>(table);
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw new DataLayerError(`Row ${id} not found in ${table}`);
    const updated = { ...rows[idx], ...patch, id, created_at: rows[idx].created_at } as T;
    rows[idx] = updated;
    this.write(table, rows);
    return updated;
    });
  }

  async remove(table: string, id: string): Promise<void> {
    return this.mutate(table, () => this.write(table, this.read(table).filter((r) => r.id !== id)));
  }

  subscribe<T extends Row>(table: string, listener: (rows: T[]) => void, onError?: (error: unknown) => void): () => void {
    let channel = this.channels.get(table);
    if (!channel) {
      channel = new BroadcastChannel(`ps-sync:${table}`);
      this.channels.set(table, channel);
    }
    let active = true;
    const push = () => {
      void this.list<T>(table).then((rows) => { if (active) listener(rows); }).catch((error) => { if (active) onError?.(error); });
    };
    const removeListener = channel.addEventListener(push);
    push();
    return () => {
      active = false;
      removeListener();
      if (channel.listenerCount === 0) {
        channel.close();
        this.channels.delete(table);
      }
    };
  }
}

