import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLE_LABELS, type UserRole } from '../types/models';

const ROLE_HINTS: Record<UserRole, string> = {
  landwirt: 'Einfaches Inserieren & Kaufen in wenigen Schritten.',
  haendler: 'Schnell-/Masseneingabe und Bestandsverwaltung für Profis.',
  schlachthof: 'Schlachtvieh mit Gewicht & EUROP-Klassifizierung, Sammelgesuche.',
  hobby: 'Geführte Formulare mit Erklärungen zu allen Fachbegriffen.',
};

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('landwirt');
  const [form, setForm] = useState({ displayName: '', email: '', password: '', plz: '', ort: '', betriebsnummer: '' });
  const [error, setError] = useState('');

  const needsBetrieb = role === 'landwirt' || role === 'haendler' || role === 'schlachthof';
  const set = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const user = register({
      email: form.email,
      password: form.password,
      displayName: form.displayName,
      role,
      plz: form.plz,
      ort: form.ort,
      betriebsnummer: needsBetrieb ? form.betriebsnummer : undefined,
    });
    if (user) navigate('/dashboard');
    else setError('Diese E-Mail-Adresse ist bereits registriert.');
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 620 }}>
        <h1>Registrieren</h1>
        <p className="text-muted">Wählen Sie zuerst Ihre Rolle – die Plattform passt sich an Ihre Bedürfnisse an.</p>

        <form className="card card-pad" onSubmit={submit}>
          <span className="label">Ich bin …</span>
          <div className="usp-grid" style={{ marginBottom: 18 }}>
            {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className="card card-pad"
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  outline: role === r ? '2px solid var(--green-600)' : 'none',
                  background: role === r ? 'var(--green-100)' : '#fff',
                }}
              >
                <strong>{ROLE_LABELS[r]}</strong>
                <p className="text-sm text-muted" style={{ margin: '4px 0 0' }}>
                  {ROLE_HINTS[r]}
                </p>
              </button>
            ))}
          </div>

          {error && <div className="warn-box" style={{ marginBottom: 14 }}>{error}</div>}

          <label className="field">
            <span className="label">{role === 'hobby' ? 'Ihr Name' : 'Betriebs- / Anzeigename'}</span>
            <input value={form.displayName} onChange={(e) => set('displayName', e.target.value)} required />
          </label>
          <div className="row" style={{ gap: 12 }}>
            <label className="field" style={{ flex: 1 }}>
              <span className="label">PLZ</span>
              <input value={form.plz} onChange={(e) => set('plz', e.target.value)} required />
            </label>
            <label className="field" style={{ flex: 2 }}>
              <span className="label">Ort</span>
              <input value={form.ort} onChange={(e) => set('ort', e.target.value)} required />
            </label>
          </div>
          {needsBetrieb && (
            <label className="field">
              <span className="label">HIT-Betriebsnummer</span>
              <input
                value={form.betriebsnummer}
                onChange={(e) => set('betriebsnummer', e.target.value)}
                placeholder="DE 09 1 234 5678"
              />
              <span className="hint">Wird für die Verifizierung Ihres Betriebs benötigt.</span>
            </label>
          )}
          <label className="field">
            <span className="label">E-Mail</span>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          </label>
          <label className="field">
            <span className="label">Passwort</span>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required />
          </label>
          <button className="btn btn-primary btn-block btn-lg" type="submit">
            Konto erstellen
          </button>
          <p className="text-sm text-muted" style={{ marginTop: 12, marginBottom: 0 }}>
            Bereits registriert? <Link to="/login">Anmelden</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
