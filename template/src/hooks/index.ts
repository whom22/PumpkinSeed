import { useCallback, useEffect, useState } from 'react';
import type { DataLayer, Row } from '../data/types';

/**
 * useTable — reactive table subscription. The only data hook apps need:
 * rows stay in sync across tabs (local mode) or devices (supabase mode).
 */
export function useTable<T extends Row>(data: DataLayer, table: string) {
  const [rows, setRows] = useState<T[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setReady(false);
    setError(null);
    const handle = (next: T[]) => {
      if (alive) {
        setRows(next);
        setError(null);
        setReady(true);
      }
    };
    const unsubscribe = data.subscribe<T>(table, handle, (cause) => {
      if (alive) {
        setError(cause instanceof Error ? cause.message : 'Could not read browser data.');
        setReady(true);
      }
    });
    return () => {
      alive = false;
      unsubscribe();
    };
  }, [data, table]);

  const refresh = useCallback(async () => {
    try {
      setRows(await data.list<T>(table));
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not read browser data.');
    }
  }, [data, table]);

  return { rows, ready, error, refresh };
}

/** usePersistedState — useState that remembers itself. */
export function usePersistedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Preferences are optional. Data writes surface errors separately. */ }
  }, [key, value]);
  return [value, setValue] as const;
}

/** useGeolocation — one-shot locate with error surfacing. */
export function useGeolocation() {
  const [state, setState] = useState<{ pos?: GeolocationPosition; error?: string; loading: boolean }>({
    loading: false,
  });

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({ error: 'unsupported', loading: false });
      return;
    }
    setState((s) => ({ ...s, loading: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => setState({ pos, loading: false }),
      (err) => setState({ error: err.message, loading: false }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  return { ...state, locate };
}

/** useClock — ticking timestamp for countdowns. */
export function useClock(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
