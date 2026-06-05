import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../types/models';

export function Header() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="brand">
          <span aria-hidden>🐄</span> Viehhandel
        </Link>
        <nav className="nav">
          <NavLink to="/markt">Marktplatz</NavLink>
          <NavLink to="/transport">Transport</NavLink>
          {currentUser && <NavLink to="/erstellen">Inserieren</NavLink>}
          {currentUser && <NavLink to="/nachrichten">Nachrichten</NavLink>}
          {currentUser ? (
            <>
              <NavLink to="/dashboard">
                Mein Bereich
              </NavLink>
              <span className="text-sm" style={{ opacity: 0.9, marginLeft: 4 }}>
                {currentUser.displayName.split(' ')[0]} · {ROLE_LABELS[currentUser.role]}
              </span>
              <button className="btn btn-ghost" style={{ borderColor: 'rgba(255,255,255,.4)', color: '#fff' }} onClick={logout}>
                Abmelden
              </button>
            </>
          ) : (
            <NavLink to="/login" className="active" style={{ background: 'rgba(255,255,255,.22)' }}>
              Anmelden
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
