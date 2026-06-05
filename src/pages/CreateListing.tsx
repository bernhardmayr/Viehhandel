import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { Term } from '../components/common/Tooltip';
import { uid, mockHitLookup } from '../lib/util';
import {
  CATEGORY_LABELS,
  SALE_TYPE_LABELS,
  type AnimalCategory,
  type Fettklasse,
  type Handelsklasse,
  type HitPass,
  type Listing,
  type SaleType,
} from '../types/models';

const EMOJI: Record<AnimalCategory, string> = {
  kuh: '🐄',
  kalb: '🐮',
  faerse: '🐄',
  bulle: '🐂',
  ochse: '🐂',
};

function emptyHit(ohrmarke = ''): HitPass {
  return {
    ohrmarke,
    geburtsdatum: '',
    herkunftsbetrieb: '',
    rasse: '',
    bvdStatus: 'ungetestet',
    bhv1Status: 'ungetestet',
    impfungen: [],
    vorbesitzerKette: [],
    abmeldungSimuliert: false,
  };
}

export function CreateListing() {
  const navigate = useNavigate();
  const { dispatch } = useAppStore();
  const { currentUser } = useAuth();
  const role = currentUser!.role;
  const isHobby = role === 'hobby';
  const isSchlacht = role === 'schlachthof';
  const isHaendler = role === 'haendler';

  const [bulkMode, setBulkMode] = useState(isHaendler);

  if (isHaendler && bulkMode) {
    return <BulkEntry onSingle={() => setBulkMode(false)} />;
  }

  return (
    <SingleWizard
      role={role}
      isHobby={isHobby}
      isSchlacht={isSchlacht}
      onBulk={isHaendler ? () => setBulkMode(true) : undefined}
      onSubmit={(listing) => {
        dispatch({ type: 'ADD_LISTING', listing });
        navigate('/dashboard');
      }}
    />
  );
}

// ---------------- Einzel-Wizard (Landwirt / Hobby / Schlachthof) ----------------

function SingleWizard({
  isHobby,
  isSchlacht,
  onBulk,
  onSubmit,
}: {
  role: string;
  isHobby: boolean;
  isSchlacht: boolean;
  onBulk?: () => void;
  onSubmit: (l: Listing) => void;
}) {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [tier, setTier] = useState({
    title: '',
    category: 'kuh' as AnimalCategory,
    anzahl: 1,
    beschreibung: '',
    plz: currentUser?.plz ?? '',
    ort: currentUser?.ort ?? '',
  });
  const [hit, setHit] = useState(emptyHit());
  const [slaughter, setSlaughter] = useState({
    lebendgewichtKg: 650,
    handelsklasse: 'R' as Handelsklasse,
    fettklasse: 3 as Fettklasse,
  });
  const [vermarktung, setVermarktung] = useState({
    saleType: (isSchlacht ? 'gesuch' : 'direktkauf') as SaleType,
    preis: 1000,
    startPreis: 800,
    mindestSchritt: 50,
    laufzeitMin: 60,
  });

  const labels = ['Tierdaten', isHobby ? 'Tierpass' : 'HIT & Gesundheit', 'Vermarktung'];

  function lookup() {
    const data = mockHitLookup(hit.ohrmarke);
    setHit({ ...hit, ...data });
  }

  function finish() {
    const isAuction = vermarktung.saleType === 'auktion';
    const listing: Listing = {
      id: uid('l'),
      sellerId: currentUser!.id,
      title: tier.title || `${CATEGORY_LABELS[tier.category]} ${hit.rasse}`.trim(),
      category: tier.category,
      saleType: vermarktung.saleType,
      anzahl: Number(tier.anzahl) || 1,
      preis: isAuction ? undefined : Number(vermarktung.preis),
      beschreibung: tier.beschreibung,
      standortPlz: tier.plz,
      standortOrt: tier.ort,
      imageEmoji: EMOJI[tier.category],
      hit,
      slaughter: isSchlacht ? slaughter : undefined,
      auction: isAuction
        ? {
            startPreis: Number(vermarktung.startPreis),
            currentPreis: Number(vermarktung.startPreis),
            mindestSchritt: Number(vermarktung.mindestSchritt),
            endsAt: new Date(Date.now() + vermarktung.laufzeitMin * 60000).toISOString(),
            bids: [],
            status: 'live',
          }
        : undefined,
      createdAt: new Date().toISOString(),
      status: 'aktiv',
    };
    onSubmit(listing);
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="row spread">
          <h1 style={{ margin: 0 }}>Tier inserieren</h1>
          {onBulk && (
            <button className="btn btn-ghost" onClick={onBulk}>
              ⊞ Zur Schnell-/Masseneingabe
            </button>
          )}
        </div>

        {isHobby && (
          <div className="info-box" style={{ margin: '14px 0' }}>
            💡 Keine Sorge bei Fachbegriffen – fahren Sie mit der Maus über die{' '}
            <span className="tip" tabIndex={0}>
              unterstrichenen Wörter
              <span className="tip-body">So sehen Sie eine einfache Erklärung.</span>
            </span>
            , um eine Erklärung zu sehen.
          </div>
        )}

        <div className="steps" style={{ marginTop: 16 }}>
          {labels.map((l, i) => (
            <div key={l} className={`step ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}>
              {i + 1}. {l}
            </div>
          ))}
        </div>

        <div className="card card-pad">
          {step === 1 && (
            <>
              <label className="field">
                <span className="label">Kategorie</span>
                <select value={tier.category} onChange={(e) => setTier({ ...tier, category: e.target.value as AnimalCategory })}>
                  {(Object.keys(CATEGORY_LABELS) as AnimalCategory[]).map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
                {isHobby && (
                  <span className="hint">
                    Eine <Term term="Färse">Färse</Term> ist z.B. eine Kuh, die noch nicht gekalbt hat.
                  </span>
                )}
              </label>
              <label className="field">
                <span className="label">Titel der Anzeige</span>
                <input value={tier.title} onChange={(e) => setTier({ ...tier, title: e.target.value })} placeholder="z.B. Milchkuh Fleckvieh, 2. Laktation" />
              </label>
              <label className="field">
                <span className="label">Anzahl Tiere</span>
                <input type="number" min={1} value={tier.anzahl} onChange={(e) => setTier({ ...tier, anzahl: Number(e.target.value) })} />
              </label>
              <label className="field">
                <span className="label">Beschreibung</span>
                <textarea rows={4} value={tier.beschreibung} onChange={(e) => setTier({ ...tier, beschreibung: e.target.value })} placeholder="Gesundheit, Haltung, Besonderheiten …" />
              </label>
              <div className="row" style={{ gap: 12 }}>
                <label className="field" style={{ flex: 1 }}>
                  <span className="label">PLZ</span>
                  <input value={tier.plz} onChange={(e) => setTier({ ...tier, plz: e.target.value })} />
                </label>
                <label className="field" style={{ flex: 2 }}>
                  <span className="label">Ort</span>
                  <input value={tier.ort} onChange={(e) => setTier({ ...tier, ort: e.target.value })} />
                </label>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <label className="field">
                <span className="label">
                  <Term term="Ohrmarke">Ohrmarke</Term>
                </span>
                <div className="row" style={{ gap: 8 }}>
                  <input style={{ flex: 1 }} value={hit.ohrmarke} onChange={(e) => setHit({ ...hit, ohrmarke: e.target.value })} placeholder="DE 09 123 45678" />
                  <button type="button" className="btn btn-amber" onClick={lookup} disabled={!hit.ohrmarke}>
                    📡 Aus <Term term="HIT">HI-Tier</Term> abrufen
                  </button>
                </div>
                <span className="hint">Wir füllen Rasse, Herkunft und Gesundheitsstatus automatisch aus der HI-Tier-Datenbank.</span>
              </label>
              <div className="row" style={{ gap: 12 }}>
                <label className="field" style={{ flex: 1 }}>
                  <span className="label">Rasse</span>
                  <input value={hit.rasse} onChange={(e) => setHit({ ...hit, rasse: e.target.value })} />
                </label>
                <label className="field" style={{ flex: 1 }}>
                  <span className="label">Geburtsdatum</span>
                  <input type="date" value={hit.geburtsdatum} onChange={(e) => setHit({ ...hit, geburtsdatum: e.target.value })} />
                </label>
              </div>
              <div className="row" style={{ gap: 12 }}>
                <label className="field" style={{ flex: 1 }}>
                  <span className="label">
                    <Term term="BVD">BVD</Term>-Status
                  </span>
                  <select value={hit.bvdStatus} onChange={(e) => setHit({ ...hit, bvdStatus: e.target.value as typeof hit.bvdStatus })}>
                    <option value="unverdächtig">unverdächtig</option>
                    <option value="verdächtig">verdächtig</option>
                    <option value="ungetestet">ungetestet</option>
                  </select>
                </label>
                <label className="field" style={{ flex: 1 }}>
                  <span className="label">
                    <Term term="BHV1">BHV1</Term>-Status
                  </span>
                  <select value={hit.bhv1Status} onChange={(e) => setHit({ ...hit, bhv1Status: e.target.value as typeof hit.bhv1Status })}>
                    <option value="frei">frei</option>
                    <option value="reagent">reagent</option>
                    <option value="ungetestet">ungetestet</option>
                  </select>
                </label>
              </div>

              {isSchlacht && (
                <>
                  <div className="divider" />
                  <h3 style={{ marginTop: 0 }}>Schlachtdaten</h3>
                  <div className="row" style={{ gap: 12 }}>
                    <label className="field" style={{ flex: 1 }}>
                      <span className="label">
                        <Term term="Lebendgewicht">Lebendgewicht</Term> (kg)
                      </span>
                      <input type="number" value={slaughter.lebendgewichtKg} onChange={(e) => setSlaughter({ ...slaughter, lebendgewichtKg: Number(e.target.value) })} />
                    </label>
                    <label className="field" style={{ flex: 1 }}>
                      <span className="label">
                        <Term term="EUROP">Handelsklasse</Term>
                      </span>
                      <select value={slaughter.handelsklasse} onChange={(e) => setSlaughter({ ...slaughter, handelsklasse: e.target.value as Handelsklasse })}>
                        {(['E', 'U', 'R', 'O', 'P'] as Handelsklasse[]).map((k) => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </label>
                    <label className="field" style={{ flex: 1 }}>
                      <span className="label">
                        <Term term="Fettklasse">Fettklasse</Term>
                      </span>
                      <select value={slaughter.fettklasse} onChange={(e) => setSlaughter({ ...slaughter, fettklasse: Number(e.target.value) as Fettklasse })}>
                        {[1, 2, 3, 4, 5].map((k) => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <label className="field">
                <span className="label">Vermarktungsart</span>
                <select value={vermarktung.saleType} onChange={(e) => setVermarktung({ ...vermarktung, saleType: e.target.value as SaleType })}>
                  {(Object.keys(SALE_TYPE_LABELS) as SaleType[]).map((s) => (
                    <option key={s} value={s}>{SALE_TYPE_LABELS[s]}</option>
                  ))}
                </select>
              </label>

              {vermarktung.saleType === 'auktion' ? (
                <div className="row" style={{ gap: 12 }}>
                  <label className="field" style={{ flex: 1 }}>
                    <span className="label">Startpreis (€)</span>
                    <input type="number" value={vermarktung.startPreis} onChange={(e) => setVermarktung({ ...vermarktung, startPreis: Number(e.target.value) })} />
                  </label>
                  <label className="field" style={{ flex: 1 }}>
                    <span className="label">Mindestschritt (€)</span>
                    <input type="number" value={vermarktung.mindestSchritt} onChange={(e) => setVermarktung({ ...vermarktung, mindestSchritt: Number(e.target.value) })} />
                  </label>
                  <label className="field" style={{ flex: 1 }}>
                    <span className="label">Laufzeit (Min.)</span>
                    <input type="number" value={vermarktung.laufzeitMin} onChange={(e) => setVermarktung({ ...vermarktung, laufzeitMin: Number(e.target.value) })} />
                  </label>
                </div>
              ) : vermarktung.saleType !== 'gesuch' ? (
                <label className="field">
                  <span className="label">Preis pro Tier (€)</span>
                  <input type="number" value={vermarktung.preis} onChange={(e) => setVermarktung({ ...vermarktung, preis: Number(e.target.value) })} />
                </label>
              ) : (
                <div className="info-box">Bei einem Gesuch geben Sie keinen festen Preis an – Anbieter melden sich mit Angeboten.</div>
              )}

              <div className="warn-box" style={{ marginTop: 14 }}>
                🔒 Käufe werden über unsere <Term term="Treuhand">Treuhand</Term> mit Käuferschutz abgewickelt.
              </div>
            </>
          )}

          <div className="divider" />
          <div className="row spread">
            <button className="btn btn-ghost" disabled={step === 1} onClick={() => setStep(step - 1)}>
              ← Zurück
            </button>
            {step < 3 ? (
              <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
                Weiter →
              </button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={finish}>
                ✓ Anzeige veröffentlichen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- Massen-/Schnelleingabe (Viehhändler) ----------------

interface BulkRow {
  ohrmarke: string;
  category: AnimalCategory;
  rasse: string;
  anzahl: number;
  preis: number;
}

const emptyRow: BulkRow = { ohrmarke: '', category: 'kalb', rasse: 'Fleckvieh', anzahl: 1, preis: 500 };

function BulkEntry({ onSingle }: { onSingle: () => void }) {
  const navigate = useNavigate();
  const { dispatch } = useAppStore();
  const { currentUser } = useAuth();
  const [rows, setRows] = useState<BulkRow[]>([{ ...emptyRow }, { ...emptyRow }, { ...emptyRow }]);
  const [saleType, setSaleType] = useState<SaleType>('direktkauf');

  const update = (i: number, patch: Partial<BulkRow>) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () => setRows([...rows, { ...emptyRow }]);
  const duplicate = (i: number) => setRows([...rows.slice(0, i + 1), { ...rows[i] }, ...rows.slice(i + 1)]);
  const remove = (i: number) => setRows(rows.filter((_, idx) => idx !== i));

  function publish() {
    const valid = rows.filter((r) => r.rasse && r.preis > 0);
    if (valid.length === 0) {
      alert('Bitte mindestens eine vollständige Zeile ausfüllen.');
      return;
    }
    const listings: Listing[] = valid.map((r) => ({
      id: uid('l'),
      sellerId: currentUser!.id,
      title: `${CATEGORY_LABELS[r.category]} ${r.rasse}`,
      category: r.category,
      saleType,
      anzahl: Number(r.anzahl) || 1,
      preis: Number(r.preis),
      beschreibung: 'Aus Schnelleingabe erstellt.',
      standortPlz: currentUser?.plz ?? '',
      standortOrt: currentUser?.ort ?? '',
      imageEmoji: EMOJI[r.category],
      hit: { ...emptyHit(r.ohrmarke), rasse: r.rasse, bvdStatus: 'unverdächtig', bhv1Status: 'frei' },
      createdAt: new Date().toISOString(),
      status: 'aktiv',
    }));
    dispatch({ type: 'ADD_LISTINGS_BULK', listings });
    navigate('/dashboard');
  }

  return (
    <div className="page">
      <div className="container">
        <div className="row spread">
          <h1 style={{ margin: 0 }}>Schnell-/Masseneingabe</h1>
          <button className="btn btn-ghost" onClick={onSingle}>
            Zur Einzelanzeige
          </button>
        </div>
        <p className="text-muted">
          Profi-Modus: mehrere Tiere als Tabelle erfassen. „Zeile duplizieren" spart Tipparbeit bei ähnlichen Partien.
        </p>

        <div className="card card-pad" style={{ marginBottom: 14 }}>
          <label className="field" style={{ maxWidth: 280, marginBottom: 0 }}>
            <span className="label">Vermarktungsart für alle Zeilen</span>
            <select value={saleType} onChange={(e) => setSaleType(e.target.value as SaleType)}>
              {(Object.keys(SALE_TYPE_LABELS) as SaleType[]).map((s) => (
                <option key={s} value={s}>{SALE_TYPE_LABELS[s]}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="card card-pad" style={{ overflowX: 'auto' }}>
          <table className="data">
            <thead>
              <tr>
                <th>Ohrmarke</th>
                <th>Kategorie</th>
                <th>Rasse</th>
                <th>Anzahl</th>
                <th>Preis/Tier (€)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td><input value={r.ohrmarke} onChange={(e) => update(i, { ohrmarke: e.target.value })} placeholder="DE …" /></td>
                  <td>
                    <select value={r.category} onChange={(e) => update(i, { category: e.target.value as AnimalCategory })}>
                      {(Object.keys(CATEGORY_LABELS) as AnimalCategory[]).map((c) => (
                        <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                      ))}
                    </select>
                  </td>
                  <td><input value={r.rasse} onChange={(e) => update(i, { rasse: e.target.value })} /></td>
                  <td><input type="number" min={1} value={r.anzahl} onChange={(e) => update(i, { anzahl: Number(e.target.value) })} /></td>
                  <td><input type="number" value={r.preis} onChange={(e) => update(i, { preis: Number(e.target.value) })} /></td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="btn btn-ghost" title="Zeile duplizieren" onClick={() => duplicate(i)}>⧉</button>{' '}
                    <button className="btn btn-danger" title="Zeile löschen" onClick={() => remove(i)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row spread" style={{ marginTop: 14 }}>
            <button className="btn btn-ghost" onClick={addRow}>+ Zeile hinzufügen</button>
            <button className="btn btn-primary btn-lg" onClick={publish}>
              ✓ {rows.length} Zeilen veröffentlichen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
