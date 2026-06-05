import type { Listing } from '../../types/models';
import { formatDate } from '../../lib/util';
import { BvdBadge, Bhv1Badge } from '../common/Badges';
import { Term } from '../common/Tooltip';

// USP-Kernkomponente: durchgängige HIT-/Tierpass-Transparenz.
export function HitPassPanel({ listing }: { listing: Listing }) {
  const { hit } = listing;
  return (
    <div className="card card-pad">
      <div className="row spread">
        <h3 style={{ margin: 0 }}>
          <Term term="HIT">HIT</Term>-Tierpass
        </h3>
        <span className="badge badge-blue">🔒 Herkunft verifiziert</span>
      </div>
      <p className="text-sm text-muted" style={{ marginTop: 4 }}>
        Direkt aus der HI-Tier-Datenbank – lückenlose Rückverfolgung.
      </p>
      <div className="divider" />
      <dl className="kv">
        <dt>
          <Term term="Ohrmarke">Ohrmarke</Term>
        </dt>
        <dd>{hit.ohrmarke}</dd>
        <dt>Rasse</dt>
        <dd>{hit.rasse}</dd>
        <dt>Geburtsdatum</dt>
        <dd>{formatDate(hit.geburtsdatum)}</dd>
        <dt>Herkunftsbetrieb</dt>
        <dd>{hit.herkunftsbetrieb}</dd>
      </dl>
      <div className="divider" />
      <div className="row" style={{ gap: 8 }}>
        <BvdBadge status={hit.bvdStatus} />
        <Bhv1Badge status={hit.bhv1Status} />
      </div>

      {hit.impfungen.length > 0 && (
        <>
          <h4 style={{ margin: '16px 0 6px' }}>Impfungen</h4>
          <ul className="text-sm" style={{ margin: 0, paddingLeft: 18 }}>
            {hit.impfungen.map((i, idx) => (
              <li key={idx}>
                {i.bezeichnung} – {formatDate(i.datum)}
              </li>
            ))}
          </ul>
        </>
      )}

      {hit.vorbesitzerKette.length > 0 && (
        <>
          <h4 style={{ margin: '16px 0 6px' }}>Herkunftskette</h4>
          <ol className="text-sm" style={{ margin: 0, paddingLeft: 18 }}>
            {hit.vorbesitzerKette.map((v, idx) => (
              <li key={idx}>{v}</li>
            ))}
          </ol>
        </>
      )}

      {hit.abmeldungSimuliert && (
        <div className="info-box" style={{ marginTop: 14 }}>
          ✓ Papierlose Ab-/Ummeldung über HI-Tier bereits durchgeführt.
        </div>
      )}
    </div>
  );
}
