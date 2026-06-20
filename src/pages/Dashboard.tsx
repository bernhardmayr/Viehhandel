import { Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { EmptyState } from '../components/common/EmptyState';
import { EscrowStepper } from '../components/escrow/EscrowStepper';
import { VerifiedBadge } from '../components/common/Badges';
import { ROLE_LABELS, SALE_TYPE_LABELS, CATEGORY_LABELS } from '../types/models';
import { formatEur } from '../lib/util';

export function Dashboard() {
  const { state, dispatch } = useAppStore();
  const { currentUser } = useAuth();
  const me = currentUser!;

  const myListings = state.listings.filter((l) => l.sellerId === me.id);
  const myEscrows = state.escrows.filter((e) => e.buyerId === me.id || e.sellerId === me.id);
  const aktiv = myListings.filter((l) => l.status === 'aktiv').length;
  const verkauft = myListings.filter((l) => l.status === 'verkauft').length;

  return (
    <div className="page">
      <div className="container">
        <div className="row spread">
          <div>
            <h1 style={{ margin: 0 }}>Mein Bereich</h1>
            <p className="text-muted" style={{ margin: '4px 0 0' }}>
              {me.displayName} · {ROLE_LABELS[me.role]} <VerifiedBadge verified={me.verified} />
            </p>
          </div>
          <Link to="/erstellen" className="btn btn-primary">
            + Inserieren
          </Link>
        </div>

        {!me.verified && (
          <div className="warn-box" style={{ marginTop: 16 }}>
            ⚠ Ihr Betrieb ist noch nicht verifiziert. Verifizierte Betriebe verkaufen nachweislich schneller –
            die Prüfung erfolgt anhand Ihrer HIT-Betriebsnummer (in dieser Demo simuliert).
          </div>
        )}

        <div className="grid grid-cards" style={{ marginTop: 18 }}>
          <div className="card card-pad">
            <div className="price">{aktiv}</div>
            <div className="text-muted">aktive Anzeigen</div>
          </div>
          <div className="card card-pad">
            <div className="price">{verkauft}</div>
            <div className="text-muted">verkauft</div>
          </div>
          <div className="card card-pad">
            <div className="price">{myEscrows.length}</div>
            <div className="text-muted">Treuhand-Vorgänge</div>
          </div>
        </div>

        {/* Rollenabhängiger Hauptbereich */}
        {me.role === 'haendler' ? (
          <InventoryManager listings={myListings} onSold={(id) => dispatch({ type: 'SET_LISTING_STATUS', listingId: id, status: 'verkauft' })} />
        ) : me.role === 'schlachthof' ? (
          <SchlachthofView listings={myListings} />
        ) : (
          <SimpleListingsView listings={myListings} hobby={me.role === 'hobby'} />
        )}

        {/* Treuhand-Vorgänge */}
        <h2 style={{ marginTop: 40 }}>Treuhand-Vorgänge</h2>
        {myEscrows.length === 0 ? (
          <EmptyState icon="🔒" title="Noch keine Treuhand-Vorgänge">
            Sobald Sie kaufen oder verkaufen, sehen Sie hier den sicheren Ablauf.
          </EmptyState>
        ) : (
          <div className="grid grid-cards">
            {myEscrows.map((e) => {
              const listing = state.listings.find((l) => l.id === e.listingId);
              return (
                <div key={e.id} className="card card-pad">
                  <div className="row spread">
                    <strong>{listing?.title ?? 'Tier'}</strong>
                    <span className="badge badge-blue">{formatEur(e.betrag)}</span>
                  </div>
                  <p className="text-sm text-muted">
                    {e.buyerId === me.id ? 'Sie kaufen' : 'Sie verkaufen'}
                  </p>
                  <EscrowStepper escrow={e} />
                  <Link to={`/checkout/${e.listingId}`} className="btn btn-ghost btn-block" style={{ marginTop: 10 }}>
                    Vorgang öffnen
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function statusBadge(status: string) {
  if (status === 'aktiv') return <span className="badge">aktiv</span>;
  if (status === 'verkauft') return <span className="badge badge-gray">verkauft</span>;
  return <span className="badge badge-amber">reserviert</span>;
}

// Landwirt / Hobby: einfache Kartenansicht
function SimpleListingsView({ listings, hobby }: { listings: any[]; hobby: boolean }) {
  return (
    <>
      <h2 style={{ marginTop: 40 }}>Meine Anzeigen</h2>
      {hobby && (
        <div className="info-box" style={{ marginBottom: 14 }}>
          💡 Tipp: Je mehr Angaben zum Tier, desto schneller finden Sie Interessenten.
        </div>
      )}
      {listings.length === 0 ? (
        <EmptyState icon="📋" title="Noch keine Anzeigen">
          <Link to="/erstellen">Jetzt erstes Tier inserieren</Link>
        </EmptyState>
      ) : (
        <div className="grid grid-cards">
          {listings.map((l) => (
            <Link key={l.id} to={l.saleType === 'auktion' ? `/auktion/${l.id}` : `/angebot/${l.id}`} className="card card-pad" style={{ color: 'inherit' }}>
              <div className="row spread">
                <strong>{l.title}</strong>
                {statusBadge(l.status)}
              </div>
              <p className="text-sm text-muted" style={{ margin: '6px 0 0' }}>
                {SALE_TYPE_LABELS[l.saleType as keyof typeof SALE_TYPE_LABELS]} · {formatEur(l.saleType === 'auktion' ? l.auction?.currentPreis : l.preis)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

// Viehhändler: Bestandsverwaltung als Tabelle mit Sammelaktion
function InventoryManager({ listings, onSold }: { listings: any[]; onSold: (id: string) => void }) {
  return (
    <>
      <h2 style={{ marginTop: 40 }}>Bestandsverwaltung</h2>
      <p className="text-muted">Profi-Übersicht über alle Tiere mit Schnellaktionen.</p>
      {listings.length === 0 ? (
        <EmptyState icon="📦" title="Kein Bestand">
          <Link to="/erstellen">Über die Schnelleingabe Tiere anlegen</Link>
        </EmptyState>
      ) : (
        <div className="card card-pad" style={{ overflowX: 'auto' }}>
          <table className="data">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Kategorie</th>
                <th>Art</th>
                <th>Preis</th>
                <th>Status</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id}>
                  <td>
                    <Link to={l.saleType === 'auktion' ? `/auktion/${l.id}` : `/angebot/${l.id}`}>{l.title}</Link>
                  </td>
                  <td>{CATEGORY_LABELS[l.category as keyof typeof CATEGORY_LABELS]}</td>
                  <td>{SALE_TYPE_LABELS[l.saleType as keyof typeof SALE_TYPE_LABELS]}</td>
                  <td>{formatEur(l.saleType === 'auktion' ? l.auction?.currentPreis : l.preis)}</td>
                  <td>{statusBadge(l.status)}</td>
                  <td>
                    {l.status === 'aktiv' && (
                      <button className="btn btn-ghost" onClick={() => onSold(l.id)}>
                        Als verkauft markieren
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// Schlachtbetrieb: Fokus auf eigene Gesuche / Einkauf
function SchlachthofView({ listings }: { listings: any[] }) {
  const gesuche = listings.filter((l) => l.saleType === 'gesuch');
  return (
    <>
      <h2 style={{ marginTop: 40 }}>Meine Gesuche & Einkauf</h2>
      <p className="text-muted">
        Tipp: Legen Sie Sammelgesuche an (z.B. „wöchentlich 10 Schlachtbullen Klasse E/U") –
        passende Anbieter melden sich direkt.
      </p>
      {gesuche.length === 0 ? (
        <EmptyState icon="🥩" title="Noch keine Gesuche">
          <Link to="/erstellen">Sammelgesuch anlegen</Link>
        </EmptyState>
      ) : (
        <div className="grid grid-cards">
          {gesuche.map((l) => (
            <Link key={l.id} to={`/angebot/${l.id}`} className="card card-pad" style={{ color: 'inherit' }}>
              <div className="row spread">
                <strong>{l.title}</strong>
                {statusBadge(l.status)}
              </div>
              {l.slaughter && (
                <p className="text-sm text-muted" style={{ margin: '6px 0 0' }}>
                  Klasse {l.slaughter.handelsklasse} · {l.slaughter.lebendgewichtKg} kg · {l.anzahl} Tiere
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
