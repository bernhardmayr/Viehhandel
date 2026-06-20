import { useMemo, useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { ListingCard } from '../components/listing/ListingCard';
import { DEFAULT_FILTERS, ListingFilterBar, type Filters } from '../components/listing/ListingFilterBar';
import { EmptyState } from '../components/common/EmptyState';

export function Marketplace() {
  const { state } = useAppStore();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const sellerOf = (id: string) => state.users.find((u) => u.id === id);

  const results = useMemo(() => {
    return state.listings
      .filter((l) => l.status === 'aktiv')
      .filter((l) => (filters.category === 'alle' ? true : l.category === filters.category))
      .filter((l) => (filters.saleType === 'alle' ? true : l.saleType === filters.saleType))
      .filter((l) =>
        filters.healthyOnly
          ? l.hit.bvdStatus === 'unverdächtig' && l.hit.bhv1Status === 'frei'
          : true,
      )
      .filter((l) => (filters.verifiedOnly ? sellerOf(l.sellerId)?.verified : true))
      .filter((l) => {
        if (!filters.q.trim()) return true;
        const q = filters.q.toLowerCase();
        return (
          l.title.toLowerCase().includes(q) ||
          l.hit.rasse.toLowerCase().includes(q) ||
          l.beschreibung.toLowerCase().includes(q) ||
          l.standortOrt.toLowerCase().includes(q)
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.listings, state.users, filters]);

  return (
    <div className="page">
      <div className="container">
        <div className="row spread">
          <h1 style={{ margin: 0 }}>Marktplatz</h1>
          <span className="text-muted">{results.length} Angebote</span>
        </div>
        <p className="text-muted">Rinder & Kälber aus verifizierten Betrieben – mit vollem HIT-Tierpass.</p>
        <ListingFilterBar filters={filters} onChange={setFilters} />
        {results.length === 0 ? (
          <EmptyState icon="🔍" title="Keine Angebote gefunden">
            Passen Sie die Filter an oder setzen Sie die Suche zurück.
          </EmptyState>
        ) : (
          <div className="grid grid-cards">
            {results.map((l) => (
              <ListingCard key={l.id} listing={l} seller={sellerOf(l.sellerId)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
