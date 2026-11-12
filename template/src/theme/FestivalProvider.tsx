import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { applySkin, builtinSkins, halloween } from './skins';
import type { FestivalSkin } from './skins';

interface FestivalContextValue {
  skin: FestivalSkin;
  availableSkins: FestivalSkin[];
  setSkin: (id: string) => void;
}

const FestivalContext = createContext<FestivalContextValue | null>(null);

export interface FestivalProviderProps {
  /** Skin id to activate. Defaults to the app's declared festival. */
  initialSkin?: string;
  /** Extra skins the app wants available in the switcher. */
  extraSkins?: FestivalSkin[];
  children: ReactNode;
}

/**
 * FestivalProvider �� injects the active skin's CSS variables and exposes
 * the skin switcher. Every PumpkinSeed app wraps its root with this,
 * which is why two different apps still feel like siblings.
 */
export function FestivalProvider({ initialSkin = 'halloween', extraSkins = [], children }: FestivalProviderProps) {
  const availableSkins = useMemo(() => [...builtinSkins, ...extraSkins], [extraSkins]);
  const [skinId, setSkinId] = useState(initialSkin);

  const skin = useMemo(
    () => availableSkins.find((s) => s.id === skinId) ?? halloween,
    [availableSkins, skinId],
  );

  useEffect(() => {
    applySkin(skin);
  }, [skin]);

  const value = useMemo(
    () => ({ skin, availableSkins, setSkin: setSkinId }),
    [skin, availableSkins],
  );

  return <FestivalContext.Provider value={value}>{children}</FestivalContext.Provider>;
}

export function useFestival(): FestivalContextValue {
  const ctx = useContext(FestivalContext);
  if (!ctx) throw new Error('useFestival must be used inside <FestivalProvider>');
  return ctx;
}

