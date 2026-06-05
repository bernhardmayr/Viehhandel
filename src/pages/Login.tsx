import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLE_LABELS } from '../types/models';

const DEMO_ACCOUNTS = [
  { email: 'landwirt@demo.de', role: 'landwirt' as const },
  { email: 'haendler@demo.de', role: 'haendler' as const },
  { email: 'schlachthof@demo.de', role: 'schlachthof' as const },
  { email: 'hobby@demo.de', role: 'hobby' as const },
];

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const user = login(email, password);
    if (user) navigate('/dashboard');
    else setError('E-Mail oder Passwort ist falsch.');
  }

  function quickLogin(demoEmail: string) {
    const user = login(demoEmail, 'demo');
    if (user) navigate('/dashboard');
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 460 }}>
        <h1>Anmelden</h1>
        <form className="card card-pad" onSubmit={submit}>
          {error && <div className="warn-box" style={{ marginBottom: 14 }}>{error}</div>}
          <label className="field">
            <span className="label">E-Mail</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span className="label">Passwort</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button className="btn btn-primary btn-block btn-lg" type="submit">
            Anmelden
          </button>
          <p className="text-sm text-muted" style={{ marginTop: 12, marginBottom: 0 }}>
            Noch kein Konto? <Link to="/register">Jetzt registrieren</Link>
          </p>
        </form>

        <div className="card card-pad" style={{ marginTop: 18 }}>
          <h3 style={{ marginTop: 0 }}>Demo-Schnellzugang</h3>
          <p className="text-sm text-muted">Ein Klick genügt – jede Rolle hat eine andere Ansicht (Passwort: <code>demo</code>).</p>
          <div className="stack">
            {DEMO_ACCOUNTS.map((d) => (
              <button key={d.email} className="btn btn-ghost" onClick={() => quickLogin(d.email)}>
                Als {ROLE_LABELS[d.role]} anmelden
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
