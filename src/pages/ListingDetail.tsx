import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { HitPassPanel } from '../components/listing/HitPassPanel';
import { VerifiedBadge, RatingStars } from '../components/common/Badges';
import { Term } from '../components/common/Tooltip';
import { EmptyState } from '../components/common/EmptyState';
import { CATEGORY_LABELS, SALE_TYPE_LABELS } from '../types/models';
import { formatEur } from '../lib/util';
import { uid } from '../lib/util';

export function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAppStore();
  const { currentUser } = useAuth();

  const listing = state.listings.find((l) => l.id === id);
  if (!listing) {
    return (
      <div className="page container">
        <EmptyState icon="🐄" title="Angebot nicht gefunden">
          <Link to="/markt">Zurück zum Marktplatz</Link>
        </EmptyState>
      </div>
    );
  }
  const seller = state.users.find((u) => u.id === listing.sellerId);

  function contactSeller() {
    if (!currentUser || !seller) {
      navigate('/login');
      return;
    }
    const threadId = [currentUser.id, seller.id].sort().join('__');
    dispatch({
      type: 'SEND_MESSAGE',
      message: {
        id: uid('m'),
        threadId,
        fromUserId: currentUser.id,
        toUserId: seller.id,
        listingId: listing!.id,
        text: `Hallo, ich interessiere mich für "${listing!.title}". Ist das Tier noch verfügbar?`,
        sentAt: new Date().toISOString(),
        read: false,
      },
    });
    navigate('/nachrichten');
  }

  function buy() {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate(`/checkout/${listing!.id}`);
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
              <div className="row" style={{ gap: 6, marginTop: 12 }}>
                <span className="badge badge-amber">{SALE_TYPE_LABELS[listing.saleType]}</span>
                <span className="badge badge-gray">{CATEGORY_LABELS[listing.category]}</span>
                {listing.anzahl > 1 && <span className="badge badge-gray">{listing.anzahl} Tiere</span>}
              </div>
              <h1 style={{ margin: '12px 0 8px' }}>{listing.title}</h1>
              <p className="text-muted" style={{ margin: 0 }}>
                📍 {listing.standortPlz} {listing.standortOrt}
              </p>
              <div className="divider" />
              <p style={{ whiteSpace: 'pre-line' }}>{listing.beschreibung}</p>
            </div>

            {listing.slaughter && (
              <div className="card card-pad">
                <h3 style={{ marginTop: 0 }}>Schlachtdaten</h3>
                <dl className="kv">
                  <dt>
                    <Term term="Lebendgewicht">Lebendgewicht</Term>
                  </dt>
                  <dd>{listing.slaughter.lebendgewichtKg} kg</dd>
                  <dt>
                    <Term term="EUROP">Handelsklasse</Term>
                  </dt>
                  <dd>{listing.slaughter.handelsklasse}</dd>
                  <dt>
                    <Term term="Fettklasse">Fettklasse</Term>
                  </dt>
                  <dd>{listing.slaughter.fettklasse}</dd>
                </dl>
              </div>
            )}

            <HitPassPanel listing={listing} />
          </div>

          <div className="stack">
            <div className="card card-pad">
              {listing.saleType !== 'gesuch' && (
                <>
                  <div className="price" style={{ fontSize: '1.8rem' }}>
                    {formatEur(listing.preis)}
                    {listing.anzahl > 1 && <span className="text-sm text-muted"> / Tier</span>}
                  </div>
                  <div className="divider" />
                </>
              )}

              {listing.saleType === 'direktkauf' && (
                <>
                  <button className="btn btn-primary btn-lg btn-block" onClick={buy}>
                    🔒 Sicher kaufen (Treuhand)
                  </button>
                  <p className="text-sm text-muted" style={{ marginTop: 10 }}>
                    Mit <Term term="Treuhand">Käuferschutz</Term>: Zahlung wird erst nach Erhalt
                    freigegeben.
                  </p>
                </>
              )}

              {(listing.saleType === 'vermittlung' || listing.saleType === 'gesuch') && (
                <button className="btn btn-primary btn-lg btn-block" onClick={contactSeller}>
                  ✉ Anbieter kontaktieren
                </button>
              )}

              <button className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={contactSeller}>
                Frage stellen
              </button>
            </div>

            {seller && (
              <div className="card card-pad">
                <h3 style={{ marginTop: 0 }}>Anbieter</h3>
                <div className="row spread">
                  <strong>{seller.displayName}</strong>
                  <VerifiedBadge verified={seller.verified} />
                </div>
                <div style={{ marginTop: 6 }}>
                  <RatingStars user={seller} />
                </div>
                {seller.ort && (
                  <p className="text-sm text-muted" style={{ marginBottom: 0 }}>
                    📍 {seller.plz} {seller.ort}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
