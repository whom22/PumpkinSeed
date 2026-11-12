import type { ReactNode } from 'react';
import { useFestival } from '../theme/FestivalProvider';
import type { DataLayer } from '../data/types';
import { Badge, FestivalConfetti } from './kit';

/**
 * AppChrome �� the template's visible signature.
 * Header with motif + title, festival skin switcher, data-mode badge,
 * and a footer that always credits the seed. Both apps wear this, which
 * is what makes the Skeleton Crew lineage legible at a glance.
 */

export interface AppChromeProps {
  data: DataLayer;
  title: string;
  subtitle?: string;
  /** Right-side slot for app-specific actions (language toggle, etc.). */
  actions?: ReactNode;
  children: ReactNode;
  footerNote?: string;
}

export function AppChrome({ data, title, subtitle, actions, children, footerNote }: AppChromeProps) {
  const { skin, availableSkins, setSkin } = useFestival();

  return (
    <div className="ps-night">
      <FestivalConfetti />
      <header className="ps-header">
        <div className="ps-header__title">
          <span style={{ fontSize: '1.5em', filter: 'drop-shadow(var(--ps-glow))' }}>{skin.motif}</span>
          <span>{title}</span>
          {subtitle && <span style={{ fontSize: '0.62em', color: 'var(--ps-text-dim)', fontWeight: 400 }}>{subtitle}</span>}
        </div>
        <div className="ps-header__spacer" />
        <Badge tone={data.mode === 'supabase' ? 'accent' : 'muted'} title={data.mode === 'supabase' ? 'Hosted realtime' : 'Browser-local realtime'}>
          {data.mode === 'supabase' ? '? live' : '?? local'}
        </Badge>
        <select
          className="ps-select"
          style={{ width: 'auto', padding: '0.3em 0.6em', fontSize: '0.82rem' }}
          value={skin.id}
          onChange={(e) => setSkin(e.target.value)}
          aria-label="Festival skin"
        >
          {availableSkins.map((s) => (
            <option key={s.id} value={s.id}>
              {s.motif} {s.name}
            </option>
          ))}
        </select>
        {actions}
      </header>

      <main className="ps-app">
        <p className="ps-demo-notice" role="note">
          {data.mode === 'local'
            ? 'Local demo: syncs only between tabs in the same browser profile and origin. Use fictional data. Room codes are not private passwords. Map tiles need internet.'
            : 'Experimental hosted mode. Data is not private or authenticated. Do not enter personal information.'}
        </p>
        {children}
      </main>

      <footer className="ps-footer">
        {footerNote ?? (
          <>
            ?? Grown from <strong>PumpkinSeed</strong> �� one lean template, many pumpkins �� Local demo
          </>
        )}
      </footer>
    </div>
  );
}

