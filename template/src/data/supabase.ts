import { createClient } from '@supabase/supabase-js';
import { nowIso, uid } from './types';
import type { DataLayer, Row, RowDraft } from './types';
import { fromDatabase, toDatabase } from './supabaseMapping';

/** Experimental hosted adapter. No authentication, abuse protection, or private rooms. */
export class SupabaseAdapter implements DataLayer {
  readonly mode = 'supabase' as const;
  private client;

  constructor(url: string, anonKey: string) {
    this.client = createClient(url, anonKey, { realtime: { params: { eventsPerSecond: 10 } } });
  }

  async list<T extends Row>(table: string): Promise<T[]> {
    const { data, error } = await this.client.from(table).select('*').order('created_at');
    if (error) throw error;
    return (data ?? []).map((row: Record<string, unknown>) => fromDatabase(table, row) as T);
  }

  async insert<T extends Row>(table: string, draft: RowDraft<T>): Promise<T> {
    const { data, error } = await this.client.from(table)
      .insert(toDatabase(table, { ...draft, id: uid(), created_at: nowIso() }))
      .select().single();
    if (error) throw error;
    return fromDatabase(table, data) as T;
  }

  async update<T extends Row>(table: string, id: string, patch: Partial<T>): Promise<T> {
    const { data, error } = await this.client.from(table)
      .update(toDatabase(table, patch as Record<string, unknown>))
      .eq('id', id).select().single();
    if (error) throw error;
    return fromDatabase(table, data) as T;
  }

  async remove(table: string, id: string): Promise<void> {
    const { error } = await this.client.from(table).delete().eq('id', id);
    if (error) throw error;
  }

  subscribe<T extends Row>(table: string, listener: (rows: T[]) => void, onError?: (error: unknown) => void): () => void {
    let active = true;
    let request = 0;
    const push = () => {
      const current = ++request;
      void this.list<T>(table).then((rows) => {
        if (active && current === request) listener(rows);
      }).catch((error) => { if (active && current === request) onError?.(error); });
    };
    // One channel per subscriber so cleanup cannot silently remove another listener.
    const channel = this.client.channel(`ps:${table}:${uid()}`);
    channel.on('postgres_changes', { event: '*', schema: 'public', table }, push).subscribe((status: string) => {
      if (!active) return;
      if (status === 'SUBSCRIBED') push();
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') onError?.(new Error('Hosted realtime is unavailable.'));
    });
    push();
    return () => { active = false; void this.client.removeChannel(channel); };
  }
}

