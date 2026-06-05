import { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { TransportOfferCard } from '../components/transport/TransportOfferCard';
import { estimateDistanceKm, estimateDriveMinutes, uid } from '../lib/util';

export function TransportExchange() {
  const { state, dispatch } = useAppStore();
  const { currentUser } = useAuth();
  const [form, setForm] = useState({ vonPlz: currentUser?.plz ?? '', nachPlz: '', tiere: 2, datum: '' });
  const set = (k: keyof typeof form, v: string | number) => setForm({ ...form, [k]: v });

  const distanz = form.vonPlz && form.nachPlz ? estimateDistanceKm(form.vonPlz, form.nachPlz) : 0;

  function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
    const km = estimateDistanceKm(form.vonPlz, form.nachPlz);
    dispatch({
      type: 'ADD_TRANSPORT_OFFER',
      offer: {
        id: uid('t'),
        fahrerId: currentUser.id,
        fahrerName: `Anfrage von ${currentUser.displayName}`,
        zertifiziert: false,
        vonPlz: form.vonPlz,
        nachPlz: form.nachPlz,
        distanzKm: km,
        fahrzeitMin: estimateDriveMinutes(km),
        preisEur: Math.round(km * 1.8 + 40),
        maxTiere: Number(form.tiere),
        tierschutzKonform: true,
        status: 'angeboten',
      },
    });
    setForm({ ...form, nachPlz: '', datum: '' });
    alert('Ihre Transportanfrage wurde eingestellt. Zertifizierte Fahrer können sie jetzt sehen.');
  }

  return (
    <div className="page">
      <div className="container">
        <h1>Transportbörse</h1>
        <p className="text-muted">
          Tierschutzkonformer Transport direkt vermittelt – zertifizierte Fahrer, transparente Distanz und Fahrzeit.
          Buchung erfolgt gekoppelt an Ihren Kauf im Treuhand-Checkout.
        </p>

        <div className="detail-grid" style={{ marginTop: 16 }}>
          <div>
            <h2 style={{ marginTop: 0 }}>Verfügbare Fahrten</h2>
            <div className="stack">
              {state.transportOffers.map((o) => (
                <TransportOfferCard key={o.id} offer={o} />
              ))}
            </div>
          </div>

          <div className="card card-pad" style={{ alignSelf: 'start' }}>
            <h3 style={{ marginTop: 0 }}>Transport anfragen</h3>
            {!currentUser ? (
              <div className="info-box">Bitte melden Sie sich an, um eine Transportanfrage zu stellen.</div>
            ) : (
              <form onSubmit={submitRequest}>
                <div className="row" style={{ gap: 12 }}>
                  <label className="field" style={{ flex: 1 }}>
                    <span className="label">Von (PLZ)</span>
                    <input value={form.vonPlz} onChange={(e) => set('vonPlz', e.target.value)} required />
                  </label>
                  <label className="field" style={{ flex: 1 }}>
                    <span className="label">Nach (PLZ)</span>
                    <input value={form.nachPlz} onChange={(e) => set('nachPlz', e.target.value)} required />
                  </label>
                </div>
                <label className="field">
                  <span className="label">Anzahl Tiere</span>
                  <input type="number" min={1} value={form.tiere} onChange={(e) => set('tiere', Number(e.target.value))} />
                </label>
                <label className="field">
                  <span className="label">Wunschtermin</span>
                  <input type="date" value={form.datum} onChange={(e) => set('datum', e.target.value)} />
                </label>
                {distanz > 0 && (
                  <div className="info-box" style={{ marginBottom: 14 }}>
                    Geschätzte Strecke: <strong>{distanz} km</strong> · ca.{' '}
                    {Math.floor(estimateDriveMinutes(distanz) / 60)} h {estimateDriveMinutes(distanz) % 60} min
                  </div>
                )}
                <button className="btn btn-primary btn-block btn-lg" type="submit">
                  Anfrage einstellen
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
