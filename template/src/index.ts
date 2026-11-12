/**
 * @pumpkin-seed/core — the seed.
 * Everything an app needs to germinate: festival skins, UI kit,
 * realtime data layer, i18n, shared chrome, and hooks.
 */

// Festival engine
export { FestivalProvider, useFestival } from './theme/FestivalProvider';
export type { FestivalSkin } from './theme/skins';
export { builtinSkins, halloween, christmas, lunarNewYear, applySkin } from './theme/skins';

// UI kit
export { Button, Card, Badge, EmptyState, Spinner, Modal, ToastProvider, useToast, FestivalConfetti } from './ui/kit';
export type { ButtonProps, ModalProps } from './ui/kit';
export { AppChrome } from './ui/AppChrome';
export type { AppChromeProps } from './ui/AppChrome';
export { LangToggle } from './ui/LangToggle';

// Data layer
export { createDataLayer } from './data/createDataLayer';
export { LocalAdapter } from './data/local';
export { SupabaseAdapter } from './data/supabase';
export { DataLayerError, uid, nowIso } from './data/types';
export type { DataLayer, Row, RowDraft } from './data/types';

// i18n
export { I18nProvider, useI18n } from './i18n/i18n';
export type { Lang, Dict } from './i18n/i18n';

// Hooks
export { useTable, usePersistedState, useGeolocation, useClock } from './hooks/index';
