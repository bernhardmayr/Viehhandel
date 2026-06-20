import type { HitPass } from '../types/models';

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatEur(value?: number): string {
  if (value == null) return '–';
  return value.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });
}

export function formatDate(iso: string): string {
  if (!iso || iso === '—') return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('de-DE');
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'gerade eben';
  if (min < 60) return `vor ${min} Min.`;
  const h = Math.round(min / 60);
  if (h < 24) return `vor ${h} Std.`;
  const d = Math.round(h / 24);
  return `vor ${d} Tag${d === 1 ? '' : 'en'}`;
}

// Deterministische, simulierte Distanz aus zwei PLZ (keine externe API).
export function estimateDistanceKm(plzA: string, plzB: string): number {
  const a = parseInt(plzA.slice(0, 5) || '0', 10) || 0;
  const b = parseInt(plzB.slice(0, 5) || '0', 10) || 0;
  const km = Math.abs(a - b) / 100;
  return Math.max(8, Math.round(km));
}

export function estimateDriveMinutes(km: number): number {
  return Math.round((km / 65) * 60) + 15; // 65 km/h + 15 Min Rüstzeit
}

// Simulierter HIT-/Tierpass-Abruf anhand der Ohrmarkennummer.
export function mockHitLookup(ohrmarke: string): Partial<HitPass> {
  const seed = ohrmarke.replace(/\D/g, '').slice(-2) || '00';
  const rassen = ['Fleckvieh', 'Schwarzbunt (HF)', 'Braunvieh', 'Murnau-Werdenfelser'];
  const idx = parseInt(seed, 10) % rassen.length;
  return {
    rasse: rassen[idx],
    bvdStatus: 'unverdächtig',
    bhv1Status: 'frei',
    herkunftsbetrieb: 'aus HI-Tier übernommen',
    vorbesitzerKette: ['aus HI-Tier-Datenbank übernommen'],
    impfungen: [{ bezeichnung: 'BVD', datum: new Date().toISOString().slice(0, 10) }],
  };
}
