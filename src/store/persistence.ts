import type { AppState } from '../types/models';
import { createSeedState, STORE_VERSION } from './seed';

const STORAGE_KEY = 'viehhandel.v1';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    const parsed = JSON.parse(raw) as AppState;
    // Bei Schema-Wechsel: Demodaten neu aufsetzen.
    if (parsed.version !== STORE_VERSION) return createSeedState();
    return parsed;
  } catch {
    return createSeedState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage nicht verfügbar (z.B. privater Modus) – Demo läuft trotzdem.
  }
}

export function resetState(): AppState {
  const fresh = createSeedState();
  saveState(fresh);
  return fresh;
}
