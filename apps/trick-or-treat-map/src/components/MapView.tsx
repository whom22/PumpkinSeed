import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Button, useI18n } from '@pumpkin-seed/core';
import type { CandyStop } from '../types';

interface MapViewProps {
  stops: CandyStop[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddRequest: () => void;
}

/** Pumpkin pin built from a divIcon so festival CSS can style it. */
function markerIcon(stop: CandyStop, selected: boolean): L.DivIcon {
  const cls = ['tot-marker', stop.allergenFree ? 'tot-marker--safe' : '', selected ? 'tot-marker--sel' : '']
    .filter(Boolean)
    .join(' ');
  return L.divIcon({
    html: `<div class="${cls}"><span>🍬</span></div>`,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 32],
    popupAnchor: [0, -30],
  });
}

export function MapView({ stops, selectedId, onSelect, onAddRequest }: MapViewProps) {
  const { t } = useI18n();
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [picking, setPicking] = useState(false);
  useEffect(() => {
    const start = () => setPicking(true);
    const cancel = (e: KeyboardEvent) => { if (e.key === 'Escape') setPicking(false); };
    window.addEventListener('tot:start-pick', start);
    window.addEventListener('keydown', cancel);
    return () => {
      window.removeEventListener('tot:start-pick', start);
      window.removeEventListener('keydown', cancel);
    };
  }, []);

  // ---- init map once ----
  useEffect(() => {
    if (!hostRef.current || mapRef.current) return;
    const map = L.map(hostRef.current, {
      center: [39.9042, 116.4074],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // ---- sync markers ----
  const fittedRef = useRef(false);
  useEffect(() => {
    const layer = layerRef.current;
    const map = mapRef.current;
    if (!layer || !map) return;
    layer.clearLayers();
    for (const stop of stops) {
      const marker = L.marker([stop.lat, stop.lng], { icon: markerIcon(stop, stop.id === selectedId) });
      marker.bindPopup(
        `<strong>${escapeHtml(stop.name)}</strong><br/>${'🎃'.repeat(stop.spooky)} · ${stop.allergenFree ? '🌾' : ''} ${escapeHtml(stop.hours || 'All night')}<br/><small>${stop.votes} 🍬</small>`,
      );
      marker.on('click', () => onSelect(stop.id));
      marker.addTo(layer);
    }
    // Frame all houses once data first arrives.
    if (!fittedRef.current && stops.length > 0) {
      fittedRef.current = true;
      map.fitBounds(L.latLngBounds(stops.map((s) => [s.lat, s.lng])).pad(0.25));
    }
  }, [stops, selectedId, onSelect]);

  // ---- pick mode: next map click opens the add form at that point ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!picking) return;
    const el = map.getContainer();
    el.classList.add('tot-map--picking');
    const onClick = (e: L.LeafletMouseEvent) => {
      setPicking(false);
      onAddRequest();
      // hand the picked point to the modal through a custom event
      window.dispatchEvent(new CustomEvent('tot:pick', { detail: { lat: e.latlng.lat, lng: e.latlng.lng } }));
    };
    map.on('click', onClick);
    return () => {
      el.classList.remove('tot-map--picking');
      map.off('click', onClick);
    };
  }, [picking, onAddRequest]);

  return (
    <div className="tot-map ps-map-dark" ref={hostRef}>
      {picking && <div className="tot-pick-banner">🎃 {t('form.pickHint')}</div>}
      <Button
        className="tot-locate"
        style={{ top: '52px' }}
        variant="primary"
        size="sm"
        onClick={(e) => { e.stopPropagation(); setPicking((value) => !value); }}
        title={t('btn.addHouse')}
      >
        {picking ? t('btn.cancel') : t('btn.addHouse')}
      </Button>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
