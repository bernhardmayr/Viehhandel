import { Link } from 'react-router-dom';
import type { Listing, User } from '../../types/models';
import { CATEGORY_LABELS, SALE_TYPE_LABELS } from '../../types/models';
import { formatEur } from '../../lib/util';
import { VerifiedBadge, BvdBadge, Bhv1Badge } from '../common/Badges';

const SALE_BADGE: Record<string, string> = {
  auktion: 'badge badge-amber',
  direktkauf: 'badge',
  vermittlung: 'badge badge-blue',
  gesuch: 'badge badge-gray',
};

export function ListingCard({ listing, seller }: { listing: Listing; seller?: User }) {
  const isAuction = listing.saleType === 'auktion';
  const target = isAuction ? `/auktion/${listing.id}` : `/angebot/${listing.id}`;
  const price = isAuction ? listing.auction?.currentPreis : listing.preis;

  return (
    <Link to={target} className="card" style={{ overflow: 'hidden', color: 'inherit' }}>
      <div style={{ padding: 12 }}>
        <div className="listing-img" aria-hidden>
          {listing.imageEmoji}
        </div>
      </div>
      <div className="card-pad" style={{ paddingTop: 0 }}>
        <div className="row" style={{ gap: 6, marginBottom: 8 }}>
          <span className={SALE_BADGE[listing.saleType]}>{SALE_TYPE_LABELS[listing.saleType]}</span>
          <span className="badge badge-gray">{CATEGORY_LABELS[listing.category]}</span>
          {listing.anzahl > 1 && <span className="badge badge-gray">{listing.anzahl} Tiere</span>}
        </div>
        <h3 style={{ fontSize: '1.05rem', margin: '0 0 8px' }}>{listing.title}</h3>
        <div className="row" style={{ gap: 6, marginBottom: 10 }}>
          <BvdBadge status={listing.hit.bvdStatus} />
          <Bhv1Badge status={listing.hit.bhv1Status} />
        </div>
        <div className="row spread">
          <span className="price">
            {formatEur(price)}
            {listing.anzahl > 1 && listing.saleType !== 'gesuch' && (
              <span className="text-sm text-muted"> / Tier</span>
            )}
          </span>
          <span className="text-sm text-muted">📍 {listing.standortPlz}</span>
        </div>
        {seller && (
          <div className="row" style={{ gap: 6, marginTop: 8 }}>
            <span className="text-sm text-muted">{seller.displayName}</span>
            <VerifiedBadge verified={seller.verified} />
          </div>
        )}
      </div>
    </Link>
  );
}
