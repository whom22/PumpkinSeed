-- EXPERIMENTAL AND UNVERIFIED: not used by the local demo.
-- Open anonymous policies expose all rows for reading and modification.
-- Do not use for private, real household, medical or child data. Review auth/RLS before any deployment.
-- PumpkinSeed Supabase schema
-- Run once in the Supabase SQL editor, then set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY.
-- These tables are intentionally anonymous (anon key + open policies): both apps are
-- lightweight community tools for a one-night festival, not accounts systems.

create table if not exists candy_stops (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null,
  lat double precision not null,
  lng double precision not null,
  candy jsonb not null default '[]',
  allergen_free boolean not null default false,
  hours text not null default '',
  spooky int not null default 3,
  note text,
  votes int not null default 0
);

create table if not exists story_lines (
  id uuid primary key,
  created_at timestamptz not null default now(),
  room_id text not null,
  author text not null,
  text text not null,
  vibes int not null default 0
);

create index if not exists story_lines_room_idx on story_lines (room_id, created_at);

-- Open policies (anon writes) �� accepted trade-off documented in .kiro/steering/tech.md
alter table candy_stops enable row level security;
alter table story_lines enable row level security;

create policy "candy_stops open" on candy_stops
  for all to anon using (true) with check (true);

create policy "story_lines open" on story_lines
  for all to anon using (true) with check (true);

-- Realtime
alter publication supabase_realtime add table candy_stops;
alter publication supabase_realtime add table story_lines;

