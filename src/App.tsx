import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { useAuth } from './hooks/useAuth';
import { Landing } from './pages/Landing';
import { Marketplace } from './pages/Marketplace';
import { ListingDetail } from './pages/ListingDetail';
import { LiveAuction } from './pages/LiveAuction';
import { CreateListing } from './pages/CreateListing';
import { Dashboard } from './pages/Dashboard';
import { TransportExchange } from './pages/TransportExchange';
import { Messages } from './pages/Messages';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

export function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/markt" element={<Marketplace />} />
          <Route path="/angebot/:id" element={<ListingDetail />} />
          <Route path="/auktion/:id" element={<LiveAuction />} />
          <Route path="/transport" element={<TransportExchange />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/erstellen"
            element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nachrichten"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/:listingId"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
