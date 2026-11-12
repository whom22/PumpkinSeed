const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText, file);
global.window = new EventTarget();
global.BroadcastChannel = undefined;
const values = new Map();
global.localStorage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
const { LocalAdapter } = require('../template/src/data/local.ts');
const { toDatabase, fromDatabase } = require('../template/src/data/supabaseMapping.ts');
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

test('local mutations notify same tab and independent subscribers; cleanup is isolated', async () => {
  values.clear();
  const data = new LocalAdapter();
  const first = [], second = [], third = [];
  const stopFirst = data.subscribe('sample', (rows) => first.push(rows));
  const stopSecond = data.subscribe('sample', (rows) => second.push(rows));
  const other = new LocalAdapter();
  const stopThird = other.subscribe('sample', (rows) => third.push(rows));
  await tick();
  const row = await data.insert('sample', { name: 'Fictional sample' });
  await tick();
  assert.equal(first.at(-1).length, 1);
  assert.equal(second.at(-1)[0].name, 'Fictional sample');
  assert.equal(third.at(-1)[0].id, row.id);
  stopFirst();
  const count = first.length;
  await data.update('sample', row.id, { name: 'Updated', id: 'cannot-change' });
  await tick();
  assert.equal(first.length, count);
  assert.equal(second.at(-1)[0].name, 'Updated');
  assert.equal(second.at(-1)[0].id, row.id);
  await data.remove('sample', row.id);
  await tick();
  assert.deepEqual(second.at(-1), []);
  stopSecond();
  stopThird();
});

test('writer without a subscription still notifies another adapter', async () => {
  values.clear();
  const viewer = new LocalAdapter(), writer = new LocalAdapter();
  let seen = [];
  const stop = viewer.subscribe('sample', (rows) => { seen = rows; });
  await writer.insert('sample', { name: 'No listener on writer' });
  await tick();
  assert.equal(seen.length, 1);
  stop();
});

test('failed or malformed storage is surfaced and not silently overwritten', async () => {
  values.clear();
  const data = new LocalAdapter();
  values.set('ps:bad', '{broken');
  let seenError;
  const stop = data.subscribe('bad', () => assert.fail('invalid storage must not become an empty success'), (error) => { seenError = error; });
  await tick();
  assert.match(seenError.message, /unavailable or damaged/);
  await assert.rejects(data.insert('bad', { name: 'New row' }));
  assert.equal(values.get('ps:bad'), '{broken');
  stop();
  const original = localStorage.setItem;
  localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
  await assert.rejects(data.insert('fresh', { name: 'Cannot save' }), /Could not save/);
  localStorage.setItem = original;
});

test('unsubscribe before initial microtask prevents a stale callback', async () => {
  const data = new LocalAdapter();
  data.subscribe('sample', () => assert.fail('callback after unsubscribe'))();
  await tick();
});

test('Supabase application/database field mapping matches SQL schema', () => {
  const candy = { id: '1', allergenFree: true, name: 'Demo', created_at: '2026-01-01' };
  assert.deepEqual(toDatabase('candy_stops', candy), { id: '1', allergen_free: true, name: 'Demo', created_at: '2026-01-01' });
  assert.deepEqual(fromDatabase('candy_stops', toDatabase('candy_stops', candy)), candy);
  const line = { roomId: 'ABC123', text: 'Boo', vibes: 0 };
  assert.deepEqual(toDatabase('story_lines', line), { room_id: 'ABC123', text: 'Boo', vibes: 0 });
  assert.deepEqual(fromDatabase('story_lines', toDatabase('story_lines', line)), line);
});

