import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { EscrowStepper } from '../components/escrow/EscrowStepper';
import { TransportOfferCard } from '../components/transport/TransportOfferCard';
import { EmptyState } from '../components/common/EmptyState';
import { ESCROW_STEP_LABELS, type EscrowStep } from '../types/models';
import { formatEur, uid } from '../lib/util';

const NEXT_ACTION_LABEL: Partial<Record<EscrowStep, string>> = {
  angelegt: '🔒 Jetzt auf Treuhandkonto zahlen',
  kaeufer_zahlt_treuhand: '📦 Verkäufer hat Tier(e) übergeben',
  verkaeufer_versendet: '✓ Erhalt bestätigen & Geld freigeben',
  kaeufer_bestaetigt: 'Geld an Verkäufer freigeben',
};

export function Checkout() {
  const { listingId } = useParams();
  const { state, dispatch } = useAppStore();
  const { currentUser } = useAuth();
  const me = currentUser!;

  const listing = state.listings.find((l) => l.id === listingId);
  const betrag = listing
    ? (listing.saleType === 'auktion' ? listing.auction?.currentPreis : listing.preis) ?? 0
    : 0;

  const escrow = state.escrows.find((e) => e.listingId === listingId && e.buyerId === me.id);

  // Treuhand-Vorgang beim ersten Aufruf anlegen.
  useEffect(() => {
    if (listing && !escrow) {
      const now = new Date().toISOString();
      dispatch({
        type: 'CREATE_ESCROW',
        escrow: {
          id: uid('e'),
          listingId: listing.id,
          buyerId: me.id,
          sellerId: listing.sellerId,
          betrag: betrag * listing.anzahl,
          step: 'angelegt',
          verlauf: [{ step: 'angelegt', at: now }],
          createdAt: now,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing?.id, escrow?.id]);

  if (!listing) {
    return (
      <div className="page container">
        <EmptyState icon="🐄" title="Angebot nicht gefunden">
          <Link to="/markt">Zurück zum Marktplatz</Link>
        </EmptyState>
      </div>
    );
  }
  if (!escrow) {
    return <div className="page container">Treuhand-Vorgang wird vorbereitet …</div>;
  }

  const transport = escrow.transportOfferId
    ? state.transportOffers.find((t) => t.id === escrow.transportOfferId)
    : undefined;
  const matchingTransports = state.transportOffers.filter((t) => t.status === 'angeboten');
  const done = escrow.step === 'freigegeben';
  const actionLabel = NEXT_ACTION_LABEL[escrow.step];

  function advance() {
    dispatch({ type: 'ADVANCE_ESCROW', escrowId: escrow!.id });
    // Bei Freigabe das Angebot als verkauft markieren.
    if (escrow!.step === 'kaeufer_bestaetigt') {
      dispatch({ type: 'SET_LISTING_STATUS', listingId: listing!.id, status: 'verkauft' });
    }
  }

  return (
    <div className="page">
      <div className="container">
        <h1>Sichere Abwicklung (Treuhand)</h1>
        <div className="detail-grid" style={{ marginTop: 16 }}>
          <div className="card card-pad">
            <h3 style={{ marginTop: 0 }}>Ablauf mit Käuferschutz</h3>
            <EscrowStepper escrow={escrow} />
            <div className="divider" />
            {done ? (
              <div className="info-box">
                ✅ Handel abgeschlossen. Das Geld wurde an den Verkäufer freigegeben.
                {!listing.hit.abmeldungSimuliert && (
                  <div style={{ marginTop: 10 }}>
                    <button
                      className="btn btn-amber"
                      onClick={() => dispatch({ type: 'HIT_DEREGISTER', listingId: listing.id })}
                    >
                      📡 Papierlose HI-Tier-Ummeldung durchführen
                    </button>
                  </div>
                )}
                {listing.hit.abmeldungSimuliert && (
                  <p style={{ margin: '10px 0 0' }}>✓ HI-Tier-Ummeldung erledigt.</p>
                )}
              </div>
            ) : (
              <div className="row" style={{ gap: 10 }}>
                {actionLabel && (
                  <button className="btn btn-primary btn-lg" onClick={advance}>
                    {actionLabel}
                  </button>
                )}
                <button
                  className="btn btn-danger"
                  onClick={() => dispatch({ type: 'CANCEL_ESCROW', escrowId: escrow.id })}
                >
                  Abbrechen
                </button>
              </div>
            )}
          </div>

          <div className="stack">
            <div className="card card-pad">
              <h3 style={{ marginTop: 0 }}>Bestellübersicht</h3>
              <div className="row spread">
                <span>{listing.title}</span>
                <strong>{formatEur(betrag)}</strong>
              </div>
              {listing.anzahl > 1 && (
                <div className="row spread text-muted text-sm">
                  <span>Anzahl</span>
                  <span>× {listing.anzahl}</span>
                </div>
              )}
              {transport && (
                <div className="row spread">
                  <span>Transport ({transport.fahrerName})</span>
                  <strong>{formatEur(transport.preisEur)}</strong>
                </div>
              )}
              <div className="divider" />
              <div className="row spread">
                <strong>Gesamt</strong>
                <span className="price">{formatEur(escrow.betrag + (transport?.preisEur ?? 0))}</span>
              </div>
            </div>

            <div className="card card-pad">
              <h3 style={{ marginTop: 0 }}>🚚 Transport hinzubuchen</h3>
              {transport ? (
                <div className="info-box">
                  ✓ {transport.fahrerName} gebucht ({transport.distanzKm} km, {formatEur(transport.preisEur)}).
                </div>
              ) : (
                <div className="stack">
                  <p className="text-sm text-muted" style={{ margin: 0 }}>
                    Optional: tierschutzkonformen Transport gleich mitbuchen.
                  </p>
                  {matchingTransports.slice(0, 3).map((t) => (
                    <TransportOfferCard
                      key={t.id}
                      offer={t}
                      onBook={() => dispatch({ type: 'BOOK_TRANSPORT', transportId: t.id, escrowId: escrow.id })}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted" style={{ marginTop: 18 }}>
          Schritte: {Object.values(ESCROW_STEP_LABELS).slice(0, 5).join(' → ')}
        </p>
      </div>
    </div>
  );
}
