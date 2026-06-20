import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { useAuctionTimer } from '../hooks/useAuctionTimer';
import { HitPassPanel } from '../components/listing/HitPassPanel';
import { EmptyState } from '../components/common/EmptyState';
import { formatEur, formatRelative, uid } from '../lib/util';

function formatCountdown(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function LiveAuction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAppStore();
  const { currentUser } = useAuth();

  const listing = state.listings.find((l) => l.id === id);
  const { secondsLeft } = useAuctionTimer(listing);
  const [bidValue, setBidValue] = useState('');

  if (!listing || !listing.auction) {
    return (
      <div className="page container">
        <EmptyState icon="🔨" title="Auktion nicht gefunden">
          <Link to="/markt">Zurück zum Marktplatz</Link>
        </EmptyState>
      </div>
    );
  }

  const auction = listing.auction;
  const minNext = auction.currentPreis + auction.mindestSchritt;
  const isLive = auction.status === 'live';
  const bidsReversed = [...auction.bids].reverse();
  const youWon = !isLive && auction.gewinnerUserId === currentUser?.id;

  function placeBid() {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const amount = Number(bidValue);
    if (!amount || amount < minNext) {
      alert(`Ihr Gebot muss mindestens ${formatEur(minNext)} betragen.`);
      return;
    }
    dispatch({
      type: 'PLACE_BID',
      listingId: listing!.id,
      bid: {
        id: uid('b'),
        userId: currentUser.id,
        userName: currentUser.displayName,
        amount,
        timestamp: new Date().toISOString(),
        isBot: false,
      },
    });
    setBidValue('');
  }

  return (
    <div className="page">
      <div className="container">
        <Link to="/markt" className="text-sm">
          ← Zurück zum Marktplatz
        </Link>
        <div className="detail-grid" style={{ marginTop: 14 }}>
          <div className="stack">
            <div className="card card-pad">
              <div className="listing-img lg" aria-hidden>
                {listing.imageEmoji}
              </div>
              <h1 style={{ margin: '12px 0 6px' }}>{listing.title}</h1>
              <p className="text-muted" style={{ margin: 0 }}>
                📍 {listing.standortPlz} {listing.standortOrt}
              </p>
              <div className="divider" />
              <p style={{ whiteSpace: 'pre-line' }}>{listing.beschreibung}</p>
            </div>
            <HitPassPanel listing={listing} />
          </div>

          <div className="stack">
            <div className="card card-pad">
              <div className="row spread">
                <span className="badge badge-amber">🔨 Auktion</span>
                {isLive ? (
                  <span className="badge badge-red">● LIVE</span>
                ) : (
                  <span className="badge badge-gray">beendet</span>
                )}
              </div>

              <p className="text-sm text-muted" style={{ marginBottom: 4, marginTop: 12 }}>
                {isLive ? 'Endet in' : 'Auktion beendet'}
              </p>
              {isLive && (
                <div className={`countdown ${secondsLeft > 60 ? 'calm' : ''}`}>
                  {formatCountdown(secondsLeft)}
                </div>
              )}

              <div className="divider" />
              <p className="text-sm text-muted" style={{ margin: 0 }}>Aktuelles Höchstgebot</p>
              <div className="price" style={{ fontSize: '2rem' }}>
                {formatEur(auction.currentPreis)}
              </div>
              <p className="text-sm text-muted">
                Startpreis {formatEur(auction.startPreis)} · Schritt {formatEur(auction.mindestSchritt)}
              </p>

              {isLive ? (
                <div style={{ marginTop: 12 }}>
                  <label className="field">
                    <span className="label">Ihr Gebot (min. {formatEur(minNext)})</span>
                    <input
                      type="number"
                      min={minNext}
                      step={auction.mindestSchritt}
                      placeholder={String(minNext)}
                      value={bidValue}
                      onChange={(e) => setBidValue(e.target.value)}
                    />
                  </label>
                  <div className="row">
                    <button className="btn btn-ghost" onClick={() => setBidValue(String(minNext))}>
                      {formatEur(minNext)}
                    </button>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={placeBid}>
                      Gebot abgeben
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 12 }}>
                  {youWon ? (
                    <>
                      <div className="info-box" style={{ marginBottom: 12 }}>
                        🎉 Glückwunsch, Sie haben die Auktion gewonnen!
                      </div>
                      <button
                        className="btn btn-primary btn-lg btn-block"
                        onClick={() => navigate(`/checkout/${listing.id}`)}
                      >
                        🔒 Zur Treuhand-Abwicklung
                      </button>
                    </>
                  ) : (
                    <div className="warn-box">Die Auktion ist beendet.</div>
                  )}
                </div>
              )}
            </div>

            <div className="card card-pad">
              <h3 style={{ marginTop: 0 }}>Gebotsverlauf ({auction.bids.length})</h3>
              <table className="data">
                <tbody>
                  {bidsReversed.map((b) => (
                    <tr key={b.id}>
                      <td>{b.userName}{b.isBot && <span className="text-muted text-sm"> 🤖</span>}</td>
                      <td style={{ fontWeight: 700 }}>{formatEur(b.amount)}</td>
                      <td className="text-sm text-muted">{formatRelative(b.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
