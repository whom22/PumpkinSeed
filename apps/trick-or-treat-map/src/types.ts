import type { Row } from '@pumpkin-seed/core';

/** One generous house on the candy map. */
export interface CandyStop extends Row {
  name: string;
  lat: number;
  lng: number;
  /** Candy type keys, see CANDY_TYPES. */
  candy: string[];
  allergenFree: boolean;
  /** Free-text window like "18:00-21:00". */
  hours: string;
  /** Decoration spookiness, 1-5. */
  spooky: number;
  note?: string;
  /** "Thanks" votes from trick-or-treaters. */
  votes: number;
}

export const CANDY_TYPES = [
  { key: 'chocolate', emoji: '🍫' },
  { key: 'gummy', emoji: '🐻' },
  { key: 'chips', emoji: '🥔' },
  { key: 'drinks', emoji: '🧃' },
  { key: 'fullsize', emoji: '👑' },
  { key: 'allergy', emoji: '🌾' },
] as const;

export function candyEmoji(key: string): string {
  return CANDY_TYPES.find((c) => c.key === key)?.emoji ?? '🍬';
}

/** Parse "18:00-21:00" → [start, end] minutes, or null. */
export function parseHours(hours: string): [number, number] | null {
  const m = /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/.exec(hours.trim());
  if (!m) return null;
  const toMin = (h: string, mm: string) => parseInt(h, 10) * 60 + parseInt(mm, 10);
  return [toMin(m[1], m[2]), toMin(m[3], m[4])];
}

export function isOpenNow(hours: string, now = new Date()): boolean {
  const range = parseHours(hours);
  if (!range) return true; // no window declared = always friendly
  const cur = now.getHours() * 60 + now.getMinutes();
  return cur >= range[0] && cur <= range[1];
}

/** Haversine distance in meters. */
export function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
