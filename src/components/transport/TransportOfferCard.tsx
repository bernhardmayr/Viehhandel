import type { TransportOffer } from '../../types/models';
import { formatEur } from '../../lib/util';

export function TransportOfferCard({
  offer,
  onBook,
  selected,
}: {
  offer: TransportOffer;
  onBook?: () => void;
  selected?: boolean;
}) {
  return (
    <div className="card card-pad" style={selected ? { outline: '2px solid var(--green-600)' } : undefined}>
      <div className="row spread">
        <strong>{offer.fahrerName}</strong>
        {offer.zertifiziert ? (
          <span className="badge badge-blue">✓ Tierschutz-zertifiziert</span>
        ) : (
          <span className="badge badge-gray">nicht zertifiziert</span>
        )}
      </div>
      <div className="row" style={{ gap: 18, marginTop: 8 }}>
        <span className="text-sm">📍 {offer.vonPlz} → {offer.nachPlz}</span>
        <span className="text-sm">🛣 {offer.distanzKm} km</span>
        <span className="text-sm">⏱ {Math.floor(offer.fahrzeitMin / 60)} h {offer.fahrzeitMin % 60} min</span>
        <span className="text-sm">🐄 max. {offer.maxTiere}</span>
      </div>
      <div className="row spread" style={{ marginTop: 12 }}>
        <span className="price">{formatEur(offer.preisEur)}</span>
        {onBook &&
          (offer.status === 'gebucht' ? (
            <span className="badge badge-amber">gebucht</span>
          ) : (
            <button className="btn btn-primary" onClick={onBook}>
              {selected ? '✓ Ausgewählt' : 'Auswählen'}
            </button>
          ))}
      </div>
    </div>
  );
}
