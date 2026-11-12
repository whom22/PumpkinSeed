import { useEffect, useRef, useState } from 'react';
import { Button, Modal, useI18n, useToast } from '@pumpkin-seed/core';
import type { DataLayer } from '@pumpkin-seed/core';
import { CANDY_TYPES } from '../types';
import type { CandyStop } from '../types';

interface AddStopModalProps {
  open: boolean;
  data: DataLayer;
  onClose: () => void;
  onAdded: () => void;
}

const EMPTY_PICK: { lat: number; lng: number } | null = null;

export function AddStopModal({ open, data, onClose, onAdded }: AddStopModalProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const savingRef = useRef(false);

  const [name, setName] = useState('');
  const [candy, setCandy] = useState<string[]>(['chocolate']);
  const [allergenFree, setAllergenFree] = useState(false);
  const [hours, setHours] = useState('');
  const [spooky, setSpooky] = useState(3);
  const [note, setNote] = useState('');
  const [pick, setPick] = useState<{ lat: number; lng: number } | null>(EMPTY_PICK);
  const [saving, setSaving] = useState(false);

  // The map broadcasts the picked point via `tot:pick`.
  useEffect(() => {
    const onPick = (e: Event) => setPick((e as CustomEvent<{ lat: number; lng: number }>).detail);
    window.addEventListener('tot:pick', onPick);
    return () => window.removeEventListener('tot:pick', onPick);
  }, []);

  const toggleCandy = (key: string) =>
    setCandy((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const save = async () => {
    if (!pick || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      await data.insert<CandyStop>('candy_stops', {
        name: name.trim() || 'Anonymous Haunt',
        lat: pick.lat,
        lng: pick.lng,
        candy: candy.length ? candy : ['chocolate'],
        allergenFree,
        hours: hours.trim(),
        spooky,
        note: note.trim() || undefined,
        votes: 0,
      });
      setName('');
      setNote('');
      setPick(null);
      onAdded();
      onClose();
    } catch {
      toast(t('toast.saveFailed'), 'error');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={() => !savingRef.current && onClose()} title={t('modal.title')}>
      <fieldset className="tot-form tot-form-fields" disabled={saving}>
        <p>{t('form.demoHint')}</p>
        <div className="tot-pickpoint">
          {pick ? (
            <span>
              {t('form.picked')} {pick.lat.toFixed(5)}, {pick.lng.toFixed(5)}
            </span>
          ) : (
            <span>🗺️ {t('form.pickHint')}</span>
          )}
          <Button size="sm" variant="ghost" disabled={saving} onClick={() => {
            onClose();
            window.dispatchEvent(new Event('tot:start-pick'));
          }}>{t('form.chooseMap')}</Button>
          <Button size="sm" variant="ghost" disabled={saving} onClick={() => setPick({ lat: 39.9042, lng: 116.4074 })}>
            {t('form.demoPoint')}
          </Button>
        </div>

        <div>
          <label className="ps-label">{t('form.name')}</label>
          <input className="ps-input" value={name} placeholder={t('form.namePh')} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="ps-label">{t('form.candy')}</label>
          <div className="tot-candy-pick">
            {CANDY_TYPES.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`tot-chip ${candy.includes(c.key) ? 'tot-chip--on' : ''}`}
                onClick={() => toggleCandy(c.key)}
              >
                {c.emoji} {t(`candy.${c.key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="tot-form-row">
          <div>
            <label className="ps-label">{t('form.hours')}</label>
            <input className="ps-input" value={hours} placeholder={t('form.hoursPh')} onChange={(e) => setHours(e.target.value)} />
          </div>
          <div>
            <label className="ps-label">{t('form.spooky')}</label>
            <div className="tot-stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" className={n <= spooky ? 'on' : ''} onClick={() => setSpooky(n)}>
                  🎃
                </button>
              ))}
            </div>
          </div>
        </div>

        <label className="tot-check">
          <input type="checkbox" checked={allergenFree} onChange={(e) => setAllergenFree(e.target.checked)} />
          🌾 {t('form.allergenFree')}
        </label>

        <div>
          <label className="ps-label">{t('form.note')}</label>
          <textarea className="ps-textarea" value={note} placeholder={t('form.notePh')} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
          <Button variant="ghost" disabled={saving} onClick={onClose}>
            {t('btn.cancel')}
          </Button>
          <Button onClick={save} disabled={!pick || saving}>
            🎃 {t('btn.save')}
          </Button>
        </div>
      </fieldset>
    </Modal>
  );
}
