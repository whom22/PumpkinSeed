import { useState } from 'react';
import { Button, Card, useI18n } from '@pumpkin-seed/core';
import { randomGhostName } from '../types';

interface HomeViewProps {
  nickname: string;
  onRename: (name: string) => void;
  onCreate: () => void;
  onJoin: (code: string) => void;
}

export function HomeView({ nickname, onRename, onCreate, onJoin }: HomeViewProps) {
  const { t } = useI18n();
  const [code, setCode] = useState('');

  const validCode = /^[A-Z0-9]{6}$/i.test(code);
  const steps = [t('home.how1'), t('home.how2'), t('home.how3'), t('home.how4')];

  return (
    <div className="gsr-home">
      <div className="gsr-hero">
        <h1 className="gsr-hero__title">👻 {t('app.title')}</h1>
        <p className="gsr-hero__tagline">{t('home.tagline')}</p>
      </div>

      <div className="gsr-home-grid">
        <Card className="gsr-panel">
          <label className="ps-label">{t('home.nickname')}</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              className="ps-input"
              value={nickname}
              maxLength={24}
              onChange={(e) => onRename(e.target.value)}
              onBlur={(e) => !e.target.value.trim() && onRename(randomGhostName())}
            />
            <Button variant="ghost" size="sm" onClick={() => onRename(randomGhostName())} title="🎲">
              🎲
            </Button>
          </div>

          <Button className="gsr-create" size="lg" onClick={onCreate}>
            {t('home.create')}
          </Button>

          <p className="gsr-or">{t('home.or')}</p>

          <label className="ps-label">{t('home.join')}</label>
          <p>{t('home.codeHint')}</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              className="ps-input gsr-code"
              value={code}
              placeholder={t('home.joinPh')}
              maxLength={6}
              style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && validCode && onJoin(code)}
            />
            <Button variant="secondary" onClick={() => validCode && onJoin(code)} disabled={!validCode}>
              {t('home.joinBtn')}
            </Button>
          </div>
        </Card>

        <Card className="gsr-panel gsr-panel--dim">
          <h3 style={{ margin: '0 0 0.8rem' }}>{t('home.howTitle')}</h3>
          <ol className="gsr-steps">
            {steps.map((s, i) => (
              <li key={i}>
                <span className="gsr-step-num">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
