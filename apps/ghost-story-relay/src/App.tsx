import { useEffect, useMemo, useState } from 'react';
import {
  AppChrome,
  FestivalProvider,
  I18nProvider,
  LangToggle,
  ToastProvider,
  createDataLayer,
  useI18n,
  usePersistedState,
} from '@pumpkin-seed/core';
import type { DataLayer } from '@pumpkin-seed/core';
import { makeRoomCode, normalizeRoomCode, randomGhostName } from './types';
import { dicts } from './i18n';
import { HomeView } from './components/HomeView';
import { StoryRoom } from './components/StoryRoom';
import './app.css';

export function App() {
  const data = useMemo(() => createDataLayer({ ...import.meta.env }), []);
  return (
    <I18nProvider dicts={dicts}>
      <FestivalProvider initialSkin="halloween">
        <ToastProvider>
          <Router data={data} />
        </ToastProvider>
      </FestivalProvider>
    </I18nProvider>
  );
}

/** Hash routing without a router dependency: #/r/CODE is a room. */
function useRoomFromHash(): string | null {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const match = /^#\/r\/([A-Z0-9]{6})$/i.exec(hash);
  return match ? normalizeRoomCode(match[1]) : null;
}

function Router({ data }: { data: DataLayer }) {
  const { t } = useI18n();
  const roomId = useRoomFromHash();
  const [nickname, setNickname] = usePersistedState('gsr:nickname', randomGhostName());

  return (
    <AppChrome data={data} title={t('app.title')} subtitle={t('app.subtitle')} actions={<LangToggle />}>
      {roomId ? (
        <StoryRoom key={roomId} data={data} roomId={roomId} nickname={nickname} onRename={setNickname} />
      ) : (
        <HomeView
          nickname={nickname}
          onRename={setNickname}
          onCreate={() => {
            window.location.hash = `#/r/${makeRoomCode()}`;
          }}
          onJoin={(code) => {
            window.location.hash = `#/r/${normalizeRoomCode(code)}`;
          }}
        />
      )}
    </AppChrome>
  );
}

