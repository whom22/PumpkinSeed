/**
 * PumpkinSeed �� festival skin definitions.
 *
 * A "skin" is a complete festival look expressed as CSS custom properties.
 * Apps inherit the whole design language from one object; adding a festival
 * is a data change, not a code change. This is what makes PumpkinSeed a
 * *festival engine* rather than a one-off starter.
 */

export interface FestivalSkin {
  /** Stable id used by <FestivalProvider skin="halloween"> */
  id: string;
  /** Display name (i18n key also derived from this). */
  name: string;
  /** Emoji used as the default decorative motif. */
  motif: string;
  /** CSS custom properties applied on :root when the skin is active. */
  vars: Record<string, string>;
  /** Confetti/sparkle particle set for celebrations. */
  particles: string[];
}

export const halloween: FestivalSkin = {
  id: 'halloween',
  name: 'Halloween',
  motif: '??',
  particles: ['??', '??', '??', '???', '??'],
  vars: {
    '--ps-bg': '#0d0817',
    '--ps-bg-elevated': '#171026',
    '--ps-bg-card': '#1d1433',
    '--ps-border': '#2f2148',
    '--ps-text': '#f4edff',
    '--ps-text-dim': '#a89bc4',
    '--ps-accent': '#ff7a1a',
    '--ps-accent-strong': '#ff9440',
    '--ps-accent-contrast': '#1a0e00',
    '--ps-secondary': '#8b5cf6',
    '--ps-secondary-strong': '#a78bfa',
    '--ps-success': '#4ade80',
    '--ps-danger': '#f87171',
    '--ps-warning': '#fbbf24',
    '--ps-glow': '0 0 24px rgba(255, 122, 26, 0.35)',
    '--ps-radius': '14px',
    '--ps-radius-sm': '9px',
    '--ps-font-display': "'Creepster', 'Lilita One', system-ui, sans-serif",
    '--ps-font-body': "'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif",
  },
};

export const christmas: FestivalSkin = {
  id: 'christmas',
  name: 'Christmas',
  motif: '??',
  particles: ['??', '??', '??', '?', '??'],
  vars: {
    '--ps-bg': '#071018',
    '--ps-bg-elevated': '#0c1a26',
    '--ps-bg-card': '#102230',
    '--ps-border': '#1d3a4d',
    '--ps-text': '#eaf6ff',
    '--ps-text-dim': '#8fb2c4',
    '--ps-accent': '#e11d48',
    '--ps-accent-strong': '#f43f5e',
    '--ps-accent-contrast': '#fff5f5',
    '--ps-secondary': '#22d3ee',
    '--ps-secondary-strong': '#67e8f9',
    '--ps-success': '#4ade80',
    '--ps-danger': '#f87171',
    '--ps-warning': '#fbbf24',
    '--ps-glow': '0 0 24px rgba(225, 29, 72, 0.35)',
    '--ps-radius': '14px',
    '--ps-radius-sm': '9px',
    '--ps-font-display': "'Lilita One', system-ui, sans-serif",
    '--ps-font-body': "'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif",
  },
};

export const lunarNewYear: FestivalSkin = {
  id: 'lunar-new-year',
  name: 'Lunar New Year',
  motif: '??',
  particles: ['??', '??', '??', '??', '?'],
  vars: {
    '--ps-bg': '#160708',
    '--ps-bg-elevated': '#241012',
    '--ps-bg-card': '#2c1416',
    '--ps-border': '#4a2024',
    '--ps-text': '#fff3e8',
    '--ps-text-dim': '#c9a08e',
    '--ps-accent': '#facc15',
    '--ps-accent-strong': '#fde047',
    '--ps-accent-contrast': '#2b1d00',
    '--ps-secondary': '#ef4444',
    '--ps-secondary-strong': '#f87171',
    '--ps-success': '#4ade80',
    '--ps-danger': '#f87171',
    '--ps-warning': '#fb923c',
    '--ps-glow': '0 0 24px rgba(250, 204, 21, 0.35)',
    '--ps-radius': '14px',
    '--ps-radius-sm': '9px',
    '--ps-font-display': "'Lilita One', 'ZCOOL KuaiLe', system-ui, sans-serif",
    '--ps-font-body': "'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif",
  },
};

/** All built-in skins. Apps may register their own via FestivalProvider. */
export const builtinSkins: FestivalSkin[] = [halloween, christmas, lunarNewYear];

export function applySkin(skin: FestivalSkin): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(skin.vars)) {
    root.style.setProperty(key, value);
  }
  root.dataset.skin = skin.id;
  root.dataset.motif = skin.motif;
}

