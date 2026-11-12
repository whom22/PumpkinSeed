import { createContext, useEffect, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useFestival } from '../theme/FestivalProvider';
import { activateModalFocus } from './modalFocus';

/* ============================================================
   PumpkinSeed UI kit �� hand-rolled, dependency-free.
   Small enough to read in five minutes, polished enough to ship.
   ============================================================ */

/* ---------- Button ---------- */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', ...rest }: ButtonProps) {
  const sizeClass = size === 'md' ? '' : ` ps-btn--${size}`;
  return <button className={`ps-btn ps-btn--${variant}${sizeClass} ${className}`} {...rest} />;
}

/* ---------- Card / Badge / Empty ---------- */
export function Card({ pad = true, className = '', children }: { pad?: boolean; className?: string; children: ReactNode }) {
  return <div className={`ps-card${pad ? ' ps-card--pad' : ''} ${className}`}>{children}</div>;
}

type BadgeTone = 'default' | 'accent' | 'muted';
export function Badge({ tone = 'default', title, children }: { tone?: BadgeTone; title?: string; children: ReactNode }) {
  const cls = tone === 'default' ? '' : ` ps-badge--${tone}`;
  return (
    <span className={`ps-badge${cls}`} title={title}>
      {children}
    </span>
  );
}

export function EmptyState({ motif = '??', text }: { motif?: string; text: string }) {
  return (
    <div className="ps-empty">
      <span className="ps-empty__motif">{motif}</span>
      <p>{text}</p>
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--ps-text-dim)' }}>
      <div style={{ fontSize: '2rem', animation: 'ps-spin 1.4s ease-in-out infinite', display: 'inline-block' }}>??</div>
      {label && <p style={{ margin: '0.4rem 0 0' }}>{label}</p>}
      <style>{'@keyframes ps-spin{50%{transform:rotate(180deg) scale(0.85)}100%{transform:rotate(360deg)}}'}</style>
    </div>
  );
}

/* ---------- Modal ---------- */
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!open || !dialogRef.current) return;
    return activateModalFocus(dialogRef.current, () => onCloseRef.current());
  }, [open]);
  if (!open) return null;
  return (
    <div className="ps-modal-overlay" onClick={onClose}>
      <div ref={dialogRef} className="ps-modal" onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}>
        {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}

/* ---------- Toasts ---------- */
interface Toast { id: number; text: string; tone: 'info' | 'success' | 'error' }
interface ToastContextValue {
  toast: (text: string, tone?: Toast['tone']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const toast = useCallback((text: string, tone: Toast['tone'] = 'info') => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="ps-toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`ps-toast ps-toast--${t.tone === 'info' ? '' : t.tone}`}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

/* ---------- Festival confetti rain ---------- */
export function FestivalConfetti({ count = 14 }: { count?: number }) {
  const { skin } = useFestival();
  const pieces = useMemo(() => {
    const seeded = (i: number) => {
      const x = (i * 73) % 100;
      const dur = 9 + ((i * 17) % 9);
      const delay = (i * 1.3) % 9;
      const size = 16 + ((i * 11) % 14);
      return { x, dur, delay, size };
    };
    return Array.from({ length: count }, (_, i) => ({ ...seeded(i), emoji: skin.particles[i % skin.particles.length] }));
  }, [count, skin]);

  return (
    <div className="ps-confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.x}%`,
            fontSize: p.size,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

