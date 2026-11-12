import { useMemo, useRef, useState } from 'react';
import {
  AppChrome,
  Badge,
  Button,
  EmptyState,
  FestivalProvider,
  I18nProvider,
  LangToggle,
  Modal,
  Spinner,
  ToastProvider,
  createDataLayer,
  useI18n,
  useTable,
  useToast,
} from '@pumpkin-seed/core';
import type { DataLayer } from '@pumpkin-seed/core';
import { CANDY_TYPES, isOpenNow, candyEmoji } from './types';
import type { CandyStop } from './types';
import { dicts } from './i18n';
import { MapView } from './components/MapView';
import { AddStopModal } from './components/AddStopModal';
import './app.css';

export function App() {
  const data = useMemo(() => createDataLayer({ ...import.meta.env }), []);
  return (
    <I18nProvider dicts={dicts}>
      <FestivalProvider initialSkin="halloween">
        <ToastProvider>
          <MapShell data={data} />
        </ToastProvider>
      </FestivalProvider>
    </I18nProvider>
  );
}

function MapShell({ data }: { data: DataLayer }) {
  const { t } = useI18n();
  const { toast } = useToast();
  const { rows: stops, ready, error, refresh } = useTable<CandyStop>(data, 'candy_stops');

  const voting = useRef(new Set<string>());
  const [pendingVotes, setPendingVotes] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [openOnly, setOpenOnly] = useState(false);
  const [allergyOnly, setAllergyOnly] = useState(false);
  const [candyFilter, setCandyFilter] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      stops.filter((s) => {
        if (openOnly && !isOpenNow(s.hours)) return false;
        if (allergyOnly && !s.allergenFree) return false;
        if (candyFilter && !s.candy.includes(candyFilter)) return false;
        if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [stops, openOnly, allergyOnly, candyFilter, search],
  );

  const selected = filtered.find((s) => s.id === selectedId) ?? stops.find((s) => s.id === selectedId) ?? null;

  const thank = async (stop: CandyStop) => {
    if (voting.current.has(stop.id)) return;
    voting.current.add(stop.id);
    setPendingVotes(new Set(voting.current));
    try {
      await data.update<CandyStop>('candy_stops', stop.id, { votes: stop.votes + 1 });
      toast(t('toast.thanks'), 'success');
    } catch {
      toast(t('toast.saveFailed'), 'error');
    } finally {
      voting.current.delete(stop.id);
      setPendingVotes(new Set(voting.current));
    }
  };

  const leaderboard = [...stops].sort((a, b) => b.votes - a.votes).slice(0, 8);

  return (
    <AppChrome data={data} title={t('app.title')} subtitle={t('app.subtitle')} actions={<LangToggle />}>
      {error && <p role="alert">{t('toast.loadFailed')} <Button onClick={refresh}>{t('btn.retry')}</Button></p>}
      <div className="tot-layout">
        {/* ---------- Map pane ---------- */}
        <section className="tot-mappane">
          <div className="tot-toolbar">
            <input
              className="ps-input tot-search"
              placeholder={t('filter.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant={openOnly ? 'primary' : 'ghost'} size="sm" onClick={() => setOpenOnly((v) => !v)}>
              ??? {t('filter.openNow')}
            </Button>
            <Button variant={allergyOnly ? 'primary' : 'ghost'} size="sm" onClick={() => setAllergyOnly((v) => !v)}>
              ?? {t('filter.allergenFree')}
            </Button>
            <Button size="sm" onClick={() => setAdding(true)}>
              {t('btn.addHouse')}
            </Button>
          </div>

          <div className="tot-candybar" role="tablist">
            <button
              className={`tot-chip ${candyFilter === null ? 'tot-chip--on' : ''}`}
              onClick={() => setCandyFilter(null)}
            >
              ?? All
            </button>
            {CANDY_TYPES.map((c) => (
              <button
                key={c.key}
                className={`tot-chip ${candyFilter === c.key ? 'tot-chip--on' : ''}`}
                onClick={() => setCandyFilter(candyFilter === c.key ? null : c.key)}
              >
                {c.emoji} {t(`candy.${c.key}`)}
              </button>
            ))}
          </div>

          {ready ? (
            <MapView
              stops={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onAddRequest={() => setAdding(true)}
            />
          ) : (
            <Spinner label="Lighting the lanterns��" />
          )}

          {data.mode === 'local' && <p className="tot-hint">?? {t('hint.local')}</p>}
        </section>

        {/* ---------- Sidebar ---------- */}
        <aside className="tot-side">
          {selected && (
            <StopDetail stop={selected} pending={pendingVotes.has(selected.id)} onThanks={() => thank(selected)} onClose={() => setSelectedId(null)} />
          )}

          <h2 className="tot-side-title">?? {t('list.title')}</h2>
          {leaderboard.length === 0 ? (
            <EmptyState motif="???" text={t('empty.map')} />
          ) : (
            <ol className="tot-board">
              {leaderboard.map((s, i) => (
                <li key={s.id} className={`tot-row ${s.id === selectedId ? 'tot-row--sel' : ''}`}>
                  <button className="tot-row__main" onClick={() => setSelectedId(s.id)}>
                    <span className="tot-row__rank">{['??', '??', '??'][i] ?? `#${i + 1}`}</span>
                    <span className="tot-row__name">
                      {s.name}
                      {s.allergenFree && <Badge tone="accent">??</Badge>}
                      <span className="tot-row__candy">{s.candy.map(candyEmoji).join(' ')}</span>
                    </span>
                  </button>
                  <Button size="sm" variant="secondary" disabled={pendingVotes.has(s.id)} onClick={() => thank(s)}>
                    {t('btn.thanks')} {s.votes}
                  </Button>
                </li>
              ))}
            </ol>
          )}
        </aside>
      </div>

      <AddStopModal open={adding} data={data} onClose={() => setAdding(false)} onAdded={() => toast(t('toast.added'), 'success')} />
    </AppChrome>
  );
}

/* ---------- Detail card shown above the leaderboard ---------- */
function StopDetail({ stop, pending, onThanks, onClose }: { stop: CandyStop; pending: boolean; onThanks: () => void; onClose: () => void }) {
  const { t } = useI18n();
  return (
    <Modal open onClose={onClose} title={stop.name}>
      <p className="tot-detail-badges">
        {stop.allergenFree && <Badge tone="accent">?? allergy-friendly</Badge>}
        <Badge>{'??'.repeat(stop.spooky)}</Badge>
        {stop.hours && <Badge tone="muted">??? {stop.hours}</Badge>}
      </p>
      {stop.candy.length > 0 && (
        <p className="tot-detail-candy">
          {stop.candy.map((c) => (
            <span key={c} className="tot-candy-big">
              {candyEmoji(c)} {t(`candy.${c}`)}
            </span>
          ))}
        </p>
      )}
      {stop.note && <p className="tot-detail-note">��{stop.note}��</p>}
      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button variant="ghost" onClick={onClose}>
          {t('btn.close')}
        </Button>
        <Button onClick={onThanks} disabled={pending}>
          {t('btn.thanks')} ({stop.votes})
        </Button>
      </div>
    </Modal>
  );
}

