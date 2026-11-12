const fields: Record<string, Record<string, string>> = {
  candy_stops: { allergenFree: 'allergen_free' },
  story_lines: { roomId: 'room_id' },
};

export function toDatabase(table: string, row: Record<string, unknown>): Record<string, unknown> {
  const mapping = fields[table] ?? {};
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [mapping[key] ?? key, value]));
}

export function fromDatabase(table: string, row: Record<string, unknown>): Record<string, unknown> {
  const mapping = Object.fromEntries(Object.entries(fields[table] ?? {}).map(([app, db]) => [db, app]));
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [mapping[key] ?? key, value]));
}

