type Change = { type: string; table: string };
type Listener = (event: Change) => void;

/** Same-tab delivery plus same-origin cross-tab events, with explicit cleanup. */
export class BroadcastChannel {
  private ch: globalThis.BroadcastChannel | null = null;
  private listeners = new Set<Listener>();
  private storageListener: ((event: StorageEvent) => void) | null = null;
  private localListener: (event: Event) => void;

  constructor(public readonly name: string) {
    this.localListener = (event) => this.dispatch((event as CustomEvent<Change>).detail);
    window.addEventListener(name, this.localListener);
    try {
      if (typeof globalThis.BroadcastChannel === 'function') {
        this.ch = new globalThis.BroadcastChannel(name);
        this.ch.onmessage = (event) => this.dispatch(event.data);
      }
    } catch { /* Storage events still work when BroadcastChannel is unavailable. */ }
    if (!this.ch) {
      const table = name.slice('ps-sync:'.length);
      this.storageListener = (event) => {
        if (event.key === `ps:${table}` || event.key === null) this.dispatch({ type: 'change', table });
      };
      window.addEventListener('storage', this.storageListener);
    }
  }

  postMessage(data: Change): void {
    window.dispatchEvent(new CustomEvent(this.name, { detail: data }));
    try { this.ch?.postMessage(data); } catch { /* The successful save remains valid. */ }
  }

  private dispatch(data: Change): void {
    this.listeners.forEach((listener) => listener(data));
  }

  get listenerCount(): number { return this.listeners.size; }

  addEventListener(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  close(): void {
    this.ch?.close();
    window.removeEventListener(this.name, this.localListener);
    if (this.storageListener) window.removeEventListener('storage', this.storageListener);
    this.listeners.clear();
  }
}

