import { resetState } from '../../store/persistence';
import { useAppStore } from '../../hooks/useAppStore';

export function Footer() {
  const { dispatch } = useAppStore();

  function handleReset() {
    if (confirm('Alle Demodaten auf den Ausgangszustand zurücksetzen?')) {
      dispatch({ type: 'RESET', state: resetState() });
    }
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row spread" style={{ alignItems: 'flex-start' }}>
          <div style={{ maxWidth: 420 }}>
            <strong>🐄 Viehhandel</strong>
            <p style={{ margin: '8px 0' }}>
              Die sichere Online-Plattform für den Handel mit Rindern und Kälbern – mit
              Treuhand-Zahlung, verifizierten Betrieben, HIT-Tierpass und Transportvermittlung.
            </p>
          </div>
          <div className="text-sm">
            <p style={{ margin: '0 0 8px' }}>
              <strong>Demo-Hinweis:</strong> Reine Frontend-Demo, alle Daten liegen lokal im Browser.
              Keine echten Zahlungen.
            </p>
            <button className="btn btn-ghost" style={{ borderColor: 'rgba(255,255,255,.4)', color: '#fff' }} onClick={handleReset}>
              ♻ Demodaten zurücksetzen
            </button>
          </div>
        </div>
        <div className="divider" style={{ background: 'rgba(255,255,255,.15)' }} />
        <div className="text-sm" style={{ opacity: 0.8 }}>
          © {new Date().getFullYear()} Viehhandel · DSGVO · Impressum · AGB (Demo)
        </div>
      </div>
    </footer>
  );
}
