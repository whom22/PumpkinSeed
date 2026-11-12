import { LocalAdapter } from './local';
import { SupabaseAdapter } from './supabase';
import { DataLayerError } from './types';
import type { DataLayer } from './types';

/** Local demo by default. Hosted mode requires deliberate developer opt-in. */
export function createDataLayer(env: Record<string, unknown> = {}): DataLayer {
  if (env.VITE_DATA_MODE !== 'supabase') return new LocalAdapter();
  const url = typeof env.VITE_SUPABASE_URL === 'string' ? env.VITE_SUPABASE_URL : '';
  const key = typeof env.VITE_SUPABASE_ANON_KEY === 'string' ? env.VITE_SUPABASE_ANON_KEY : '';
  if (!url || !key) throw new DataLayerError('Experimental Supabase mode requires a URL and public anon key. Use VITE_DATA_MODE=local for the demo.');
  return new SupabaseAdapter(url, key);
}

