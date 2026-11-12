import type { Row } from '@pumpkin-seed/core';

/** One sentence in a haunted story. */
export interface StoryLine extends Row {
  roomId: string;
  author: string;
  text: string;
  /** Spooky-vibe votes. */
  vibes: number;
}

export const MAX_LINE_LENGTH = 140;
export const OPENING_AUTHOR = '🕯️ The House';

export function makeRoomCode(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

export function normalizeRoomCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export function randomGhostName(): string {
  const adjectives = ['Whispering', 'Sleepless', 'Velvet', 'Midnight', 'Grinning', 'Hollow', 'Moth-Eaten', 'Twilight'];
  const nouns = ['Raven', 'Pumpkin', 'Candle', 'Spider', 'Owl', 'Cat', 'Ghost', 'Broomstick'];
  const a = adjectives[Math.floor(Math.random() * adjectives.length)];
  const n = nouns[Math.floor(Math.random() * nouns.length)];
  return `${a} ${n}`;
}
