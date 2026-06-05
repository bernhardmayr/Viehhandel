import type { HealthStatusBVD, HealthStatusBHV1, User } from '../../types/models';

export function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) return null;
  return (
    <span className="badge badge-verified" title="Identität & Betriebsnummer geprüft">
      ✓ Verifiziert
    </span>
  );
}

export function RatingStars({ user }: { user: Pick<User, 'ratingAvg' | 'ratingCount'> }) {
  if (user.ratingCount === 0) {
    return <span className="text-sm text-muted">Noch keine Bewertungen</span>;
  }
  const full = Math.round(user.ratingAvg);
  return (
    <span className="text-sm" title={`${user.ratingAvg.toFixed(1)} von 5`}>
      <span style={{ color: '#f0a500' }}>{'★'.repeat(full)}</span>
      <span style={{ color: '#ccc' }}>{'★'.repeat(5 - full)}</span>{' '}
      <span className="text-muted">
        {user.ratingAvg.toFixed(1)} ({user.ratingCount})
      </span>
    </span>
  );
}

export function BvdBadge({ status }: { status: HealthStatusBVD }) {
  const cls =
    status === 'unverdächtig' ? 'badge' : status === 'verdächtig' ? 'badge badge-red' : 'badge badge-gray';
  return <span className={cls}>BVD: {status}</span>;
}

export function Bhv1Badge({ status }: { status: HealthStatusBHV1 }) {
  const cls =
    status === 'frei' ? 'badge' : status === 'reagent' ? 'badge badge-red' : 'badge badge-gray';
  return <span className={cls}>BHV1: {status}</span>;
}
