import { useEffect, useState } from 'react';
import type { Listing } from '../types/models';
import { useAppStore } from './useAppStore';

const BOT_NAMES = [
  'Zuchtbetrieb Huber',
  'Milchhof Wegscheid',
  'Viehhandel Stadler',
  'Hof am Bergweg',
  'Agrar Oberland eG',
];

// Steuert Countdown + simulierte Gegengebote einer Live-Auktion.
export function useAuctionTimer(listing: Listing | undefined) {
  const { dispatch } = useAppStore();
  const [secondsLeft, setSecondsLeft] = useState(0);

  const auction = listing?.auction;
  const endsAt = auction?.endsAt;
  const isLive = auction?.status === 'live';

  useEffect(() => {
    if (!listing || !endsAt || !isLive) return;

    const tick = () => {
      const remaining = Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        dispatch({ type: 'END_AUCTION', listingId: listing.id });
      }
    };
    tick();
    const interval = setInterval(tick, 1000);

    // Gelegentliche Bot-Gegengebote, solange die Auktion läuft.
    // Preis wird im Reducer aus dem aktuellen State berechnet (kein Stale-Closure).
    const botInterval = setInterval(() => {
      if (Math.random() < 0.25) {
        dispatch({
          type: 'PLACE_BOT_BID',
          listingId: listing.id,
          botName: BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)],
        });
      }
    }, 6000);

    return () => {
      clearInterval(interval);
      clearInterval(botInterval);
    };
    // listing.auction wird absichtlich nicht als Dep genutzt (Intervall stabil halten);
    // current-Werte werden zur Laufzeit aus listing.auction gelesen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing?.id, endsAt, isLive]);

  return { secondsLeft };
}
