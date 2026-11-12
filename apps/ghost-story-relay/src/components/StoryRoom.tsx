import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Button, EmptyState, FestivalConfetti, Modal, Spinner, useI18n, useTable, useToast } from '@pumpkin-seed/core';
import type { DataLayer } from '@pumpkin-seed/core';
import { MAX_LINE_LENGTH, OPENING_AUTHOR } from '../types';
import type { StoryLine } from '../types';

interface StoryRoomProps {
  data: DataLayer;
  roomId: string;
  nickname: string;
  onRename: (name: string) => void;
}

const OPENING: Record<'en' | 'zh', string> = {
  en: 'The invitation said midnight. Nobody remembered sending it.',
  zh: '\u9080\u8bf7\u51fd\u4e0a\u5199\u7740\u5348\u591c\u3002\u5374\u6ca1\u6709\u4eba\u8bb0\u5f97\u662f\u8c01\u53d1\u51fa\u7684\u3002',
};

export function StoryRoom({ data, roomId, nickname, onRename }: StoryRoomProps) {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const { rows: allLines, ready, error, refresh } = useTable<StoryLine>(data, 'story_lines');
  const lines = useMemo(
    () => allLines.filter((l) => l.roomId === roomId).sort((a, b) => a.created_at.localeCompare(b.created_at)),
    [allLines, roomId],
  );

  const [draft, setDraft] = useState('');
  const [voted, setVoted] = useState<Set<string>>(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(`gsr:voted:${roomId}`) ?? '[]');
      return new Set(Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string') : []);
    } catch { return new Set(); }
  });
  const busyRef = useRef(false);
  const [sending, setSending] = useState(false);
  const voteBusy = useRef(false);
  const [voting, setVoting] = useState(false);
  const speechAvailable = typeof window.speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined';
  const [reading, setReading] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const lastSpokenRef = useRef<string | null>(null);

  const seedStarted = useRef(false);
  // Recheck inside a cross-tab lock; failed inserts leave no permanent seed flag.
  useEffect(() => {
    if (!ready || error || lines.length > 0 || seedStarted.current) return;
    seedStarted.current = true;
    const seed = async () => {
      const latest = await data.list<StoryLine>('story_lines');
      if (!latest.some((line) => line.roomId === roomId)) {
        await data.insert<StoryLine>('story_lines', { roomId, author: OPENING_AUTHOR, text: OPENING[lang], vibes: 0 });
      }
    };
    // Without Web Locks, skip optional seeding rather than risk duplicate openings.
    if (navigator.locks) {
      void navigator.locks.request(`gsr:seed:${roomId}`, seed).catch(() => toast(t('toast.seedFailed'), 'error'));
    }
    // No cleanup: an admitted write completes even when navigation changes.
  }, [ready, error, lines.length, data, roomId, lang, t, toast]);

  // Auto-scroll to the newest whisper.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines.length]);

  // Read new lines aloud while enabled.
  useEffect(() => {
    if (!speechAvailable || !reading || lines.length === 0) return;
    const newest = lines[lines.length - 1];
    if (lastSpokenRef.current === newest.id) return;
    lastSpokenRef.current = newest.id;
    const utter = new SpeechSynthesisUtterance(newest.text);
    utter.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
    utter.rate = 0.92;
    utter.pitch = 0.75;
    try { window.speechSynthesis.speak(utter); } catch { setReading(false); toast(t('toast.speechFailed'), 'error'); }
  }, [reading, lines, lang, speechAvailable, toast, t]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const spirits = useMemo(() => new Set(lines.filter((l) => l.author !== OPENING_AUTHOR).map((l) => l.author)).size, [lines]);

  const toggleVibe = async (line: StoryLine) => {
    if (voteBusy.current) return;
    voteBusy.current = true;
    setVoting(true);
    const next = new Set(voted);
    const already = next.has(line.id);
    if (already) next.delete(line.id);
    else next.add(line.id);
    try {
      await data.update<StoryLine>('story_lines', line.id, { vibes: Math.max(0, line.vibes + (already ? -1 : 1)) });
      setVoted(next);
      try { localStorage.setItem(`gsr:voted:${roomId}`, JSON.stringify([...next])); }
      catch { toast(t('toast.voteMemoryFailed'), 'error'); }
      if (!already) toast(t('toast.voted'));
    } catch { toast(t('toast.saveFailed'), 'error'); }
    finally { voteBusy.current = false; setVoting(false); }
  };

  const whisper = async () => {
    if (busyRef.current) return;
    const text = draft.trim();
    if (!text) {
      toast(t('toast.emptyLine'), 'error');
      return;
    }
    busyRef.current = true;
    setSending(true);
    try {
      await data.insert<StoryLine>('story_lines', { roomId, author: nickname.trim() || 'Anonymous Ghost', text, vibes: 0 });
      setDraft('');
      toast(t('toast.lineAdded'), 'success');
    } catch { toast(t('toast.saveFailed'), 'error'); }
    finally { busyRef.current = false; setSending(false); }
  };

  const copyText = async (text: string, successKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(t(successKey), 'success');
    } catch { toast(t('toast.copyFailed'), 'error'); }
  };
  const copyInvite = () => copyText(`${window.location.origin}${window.location.pathname}#/r/${roomId}`, 'room.copied');

  const stopReading = () => {
    setReading(false);
    window.speechSynthesis?.cancel();
  };

  const storyText = lines.map((l) => l.text).join(' ');

  if (!ready) return <Spinner label="Raising the spirits��" />;

  return (
    <div className="gsr-room">
      {error && <p role="alert">{t('toast.loadFailed')} <Button onClick={refresh}>{t('btn.retry')}</Button></p>}
      {finishing && lines.length > 2 && <FestivalConfetti count={22} />}

      <div className="gsr-roombar">
        <Button variant="ghost" size="sm" onClick={() => (window.location.hash = '')}>
          {t('room.back')}
        </Button>
        <Badge tone="accent">?? {roomId}</Badge>
        <Badge tone="muted">
          ?? {spirits} {t('room.guests')}
        </Badge>
        <div style={{ flex: 1 }} />
        <input
          className="ps-input gsr-nick"
          value={nickname}
          maxLength={24}
          onChange={(e) => onRename(e.target.value)}
          aria-label={t('home.nickname')}
        />
        <Button variant="secondary" size="sm" onClick={copyInvite}>
          ?? {t('room.copy')}
        </Button>
        {reading ? (
          <Button variant="ghost" size="sm" onClick={stopReading}>
            {t('room.stopReading')}
          </Button>
        ) : (
          <Button variant="ghost" size="sm" disabled={!speechAvailable} onClick={() => setReading(true)}>
            {t('room.readaloud')}
          </Button>
        )}
        <Button size="sm" onClick={() => setFinishing(true)} disabled={lines.length < 3}>
          {t('room.finish')}
        </Button>
      </div>

      <div className="gsr-story" ref={listRef}>
        {lines.length === 0 ? (
          <EmptyState motif="???" text={t('empty.room')} />
        ) : (
          lines.map((line) => (
            <StoryLineView
              key={line.id}
              line={line}
              isYou={line.author === nickname}
              onVibe={() => toggleVibe(line)}
              voted={voted.has(line.id)}
              pending={voting}
            />
          ))
        )}
      </div>

      <div className="gsr-composer">
        <div className="gsr-turn-row">
          <span className="gsr-turn">{t('room.turn')}</span>
          <span className="gsr-meter" data-over={draft.length > MAX_LINE_LENGTH - 20 ? '' : undefined}>
            {draft.length}/{MAX_LINE_LENGTH}
          </span>
        </div>
        <div className="gsr-composer-row">
          <input
            className="ps-input"
            value={draft}
            disabled={sending}
            maxLength={MAX_LINE_LENGTH}
            placeholder={t('room.placeholder')}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && whisper()}
          />
          <Button onClick={whisper} disabled={sending || !draft.trim()}>{t('room.send')}</Button>
        </div>
      </div>

      <Modal open={finishing} onClose={() => setFinishing(false)} title={`?? ${t('share.title')}`}>
        <p className="gsr-final">{storyText}</p>
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', marginTop: '1rem', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            onClick={() => copyText(storyText, 'share.copied')}
          >
            {t('share.copy')}
          </Button>
          <Button
            onClick={() => {
              setFinishing(false);
              window.location.hash = '';
            }}
          >
            {t('share.again')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function StoryLineView({
  line,
  isYou,
  voted,
  onVibe,
  pending,
}: {
  line: StoryLine;
  isYou: boolean;
  voted: boolean;
  pending: boolean;
  onVibe: () => void;
}) {
  const { t } = useI18n();
  const isHouse = line.author === OPENING_AUTHOR;
  return (
    <div className={`gsr-line ${isHouse ? 'gsr-line--house' : ''} ${isYou ? 'gsr-line--you' : ''}`}>
      <div className="gsr-line__head">
        <span className="gsr-line__author">
          {isHouse ? line.author : `?? ${line.author}`}
          {isYou && !isHouse && <em className="gsr-you"> �� {t('room.you')}</em>}
        </span>
        <button className={`gsr-vibe ${voted ? 'gsr-vibe--on' : ''}`} onClick={onVibe} disabled={pending} title="spooky vibes">
          ?? {line.vibes}
        </button>
      </div>
      <p className="gsr-line__text">{line.text}</p>
    </div>
  );
}

