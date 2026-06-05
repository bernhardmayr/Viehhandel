import { Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { ListingCard } from '../components/listing/ListingCard';

const USPS = [
  {
    ico: '🔒',
    title: 'Treuhand-Zahlung',
    text: 'Ihr Geld ist sicher: Es wird erst an den Verkäufer ausgezahlt, wenn die Tiere wohlbehalten angekommen sind. Echter Käuferschutz statt Vorkasse-Risiko.',
  },
  {
    ico: '✓',
    title: 'Verifizierte Betriebe',
    text: 'Geprüfte Identität, Betriebsnummer und Bewertungen. Sie wissen immer, mit wem Sie handeln.',
  },
  {
    ico: '📋',
    title: 'HIT-Tierpass inklusive',
    text: 'Ohrmarke, Herkunftskette, BVD/BHV1-Status und Impfungen transparent bei jedem Tier – und papierlose Ab-/Ummeldung.',
  },
  {
    ico: '🚚',
    title: 'Transport integriert',
    text: 'Tierschutzkonformer Transport direkt mitbuchbar: zertifizierte Fahrer, Distanz und Fahrzeit auf einen Blick.',
  },
];

export function Landing() {
  const { state } = useAppStore();
  const sellerOf = (id: string) => state.users.find((u) => u.id === id);
  const featured = state.listings.filter((l) => l.status === 'aktiv').slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="badge badge-amber" style={{ marginBottom: 14 }}>
            Der Unterschied
          </span>
          <h1>Sicher handeln statt nur inserieren.</h1>
          <p className="lead">
            Andere Plattformen vermitteln nur Kontakte. Viehhandel wickelt den ganzen Handel
            ab – mit Treuhand-Käuferschutz, verifizierten Betrieben, lückenlosem HIT-Tierpass
            und integriertem Tiertransport.
          </p>
          <div className="row" style={{ marginTop: 24 }}>
            <Link to="/markt" className="btn btn-amber btn-lg">
              Marktplatz ansehen
            </Link>
            <Link to="/register" className="btn btn-lg" style={{ background: 'rgba(255,255,255,.15)', color: '#fff' }}>
              Kostenlos registrieren
            </Link>
          </div>
        </div>
      </section>

      <section className="page">
        <div className="container">
          <h2>Warum Viehhandel?</h2>
          <p className="text-muted">Vier Dinge, die reine Kleinanzeigen-Börsen nicht bieten.</p>
          <div className="usp-grid" style={{ marginTop: 18 }}>
            {USPS.map((u) => (
              <div key={u.title} className="card usp-card">
                <div className="ico" aria-hidden>
                  {u.ico}
                </div>
                <h3>{u.title}</h3>
                <p className="text-sm text-muted" style={{ margin: 0 }}>
                  {u.text}
                </p>
              </div>
            ))}
          </div>

          <div className="row spread" style={{ marginTop: 48, marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Aktuelle Angebote</h2>
            <Link to="/markt">Alle ansehen →</Link>
          </div>
          <div className="grid grid-cards">
            {featured.map((l) => (
              <ListingCard key={l.id} listing={l} seller={sellerOf(l.sellerId)} />
            ))}
          </div>

          <div className="card card-pad" style={{ marginTop: 40 }}>
            <h3 style={{ marginTop: 0 }}>Für jede Nutzergruppe das passende Werkzeug</h3>
            <div className="usp-grid">
              <div>
                <strong>🚜 Landwirt:innen</strong>
                <p className="text-sm text-muted">Einfaches Inserieren in 3 Schritten.</p>
              </div>
              <div>
                <strong>📦 Viehhändler:innen</strong>
                <p className="text-sm text-muted">Schnell-/Masseneingabe & Bestandsverwaltung.</p>
              </div>
              <div>
                <strong>🥩 Schlachtbetriebe</strong>
                <p className="text-sm text-muted">Gewicht, EUROP-Klasse & Sammelgesuche.</p>
              </div>
              <div>
                <strong>🏡 Hobbyhalter:innen</strong>
                <p className="text-sm text-muted">Geführte Formulare mit Begriffserklärungen.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
