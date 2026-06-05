import type { AnimalCategory, SaleType } from '../../types/models';
import { CATEGORY_LABELS, SALE_TYPE_LABELS } from '../../types/models';

export interface Filters {
  q: string;
  category: AnimalCategory | 'alle';
  saleType: SaleType | 'alle';
  healthyOnly: boolean;
  verifiedOnly: boolean;
}

export const DEFAULT_FILTERS: Filters = {
  q: '',
  category: 'alle',
  saleType: 'alle',
  healthyOnly: false,
  verifiedOnly: false,
};

export function ListingFilterBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="card card-pad" style={{ marginBottom: 20 }}>
      <div className="row" style={{ gap: 12 }}>
        <input
          style={{ flex: '1 1 220px', padding: '11px 12px', border: '1px solid var(--line)', borderRadius: 8, font: 'inherit' }}
          placeholder="🔎 Suche nach Rasse, Titel …"
          value={filters.q}
          onChange={(e) => set('q', e.target.value)}
        />
        <select value={filters.category} onChange={(e) => set('category', e.target.value as Filters['category'])}
          style={{ padding: '11px 12px', border: '1px solid var(--line)', borderRadius: 8, font: 'inherit' }}>
          <option value="alle">Alle Kategorien</option>
          {(Object.keys(CATEGORY_LABELS) as AnimalCategory[]).map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <select value={filters.saleType} onChange={(e) => set('saleType', e.target.value as Filters['saleType'])}
          style={{ padding: '11px 12px', border: '1px solid var(--line)', borderRadius: 8, font: 'inherit' }}>
          <option value="alle">Alle Handelsarten</option>
          {(Object.keys(SALE_TYPE_LABELS) as SaleType[]).map((s) => (
            <option key={s} value={s}>
              {SALE_TYPE_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <div className="row" style={{ gap: 18, marginTop: 12 }}>
        <label className="row text-sm" style={{ gap: 6, cursor: 'pointer' }}>
          <input type="checkbox" checked={filters.healthyOnly} onChange={(e) => set('healthyOnly', e.target.checked)} />
          Nur BVD-unverdächtig & BHV1-frei
        </label>
        <label className="row text-sm" style={{ gap: 6, cursor: 'pointer' }}>
          <input type="checkbox" checked={filters.verifiedOnly} onChange={(e) => set('verifiedOnly', e.target.checked)} />
          Nur verifizierte Anbieter
        </label>
      </div>
    </div>
  );
}
