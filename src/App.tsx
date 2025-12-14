import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { LanguageProvider } from "./contexts/LanguageContext";

import ClientScanner from "./pages/client/Scanner";
import ClientExchangeForm from "./pages/client/ExchangeForm";
import ClientTracking from "./pages/client/Tracking";
import ClientExchangeList from "./pages/client/ExchangeList";
import ClientExchangeDetail from "./pages/client/ExchangeDetail";
import ClientChat from "./pages/client/Chat";
import ClientExchangeSuccess from "./pages/client/ExchangeSuccess";

import MerchantLogin from "./pages/merchant/Login";
import MerchantDashboard from "./pages/merchant/Dashboard";
import MerchantExchangeList from "./pages/merchant/ExchangeList";
import MerchantExchangeDetail from "./pages/merchant/ExchangeDetail";
import MerchantClientList from "./pages/merchant/ClientList";
import MerchantClientDetail from "./pages/merchant/ClientDetail";
import MerchantSimulation from "./pages/merchant/Simulation";
import MerchantChat from "./pages/merchant/Chat";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminMerchantList from "./pages/admin/MerchantList";
import AdminMerchantDetail from "./pages/admin/MerchantDetail";
import AdminMerchantForm from "./pages/admin/MerchantForm";
import AdminDeliveryPersonList from "./pages/admin/DeliveryPersonList";
import AdminDeliveryPersonDetail from "./pages/admin/DeliveryPersonDetail";
import AdminDeliveryPersonForm from "./pages/admin/DeliveryPersonForm";

import DeliveryLogin from "./pages/delivery/Login";
import DeliveryDashboard from "./pages/delivery/Dashboard";
import DeliveryBordereauScanner from "./pages/delivery/BordereauScanner";
import DeliveryExchangeVerification from "./pages/delivery/ExchangeVerification";
import DeliveryVerificationList from "./pages/delivery/VerificationList";

import HomePage from "./pages/Home";

// Wrapper component for client routes with language support
function ClientRoutes() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="scan" element={<ClientScanner />} />
        <Route path="exchange/new" element={<ClientExchangeForm />} />
        <Route path="success/:code" element={<ClientExchangeSuccess />} />
        <Route path="tracking/:code" element={<ClientTracking />} />
        <Route path="exchanges" element={<ClientExchangeList />} />
        <Route path="exchange/:id" element={<ClientExchangeDetail />} />
        <Route path="chat/:exchangeId" element={<ClientChat />} />
        <Route path="chat" element={<ClientChat />} />
      </Routes>
    </LanguageProvider>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Client routes with language support */}
        <Route path="/client/*" element={<ClientRoutes />} />

        {/* Merchant routes */}
        <Route
          path="/merchant/login"
          element={
            user ? <Navigate to="/merchant/dashboard" /> : <MerchantLogin />
          }
        />
        <Route
          path="/merchant/dashboard"
          element={
            user ? <MerchantDashboard /> : <Navigate to="/merchant/login" />
          }
        />
        <Route
          path="/merchant/exchanges"
          element={
            user ? <MerchantExchangeList /> : <Navigate to="/merchant/login" />
          }
        />
        <Route
          path="/merchant/exchange/:id"
          element={
            user ? (
              <MerchantExchangeDetail />
            ) : (
              <Navigate to="/merchant/login" />
            )
          }
        />
        <Route
          path="/merchant/clients"
          element={
            user ? <MerchantClientList /> : <Navigate to="/merchant/login" />
          }
        />
        <Route
          path="/merchant/client/:phone"
          element={
            user ? <MerchantClientDetail /> : <Navigate to="/merchant/login" />
          }
        />
        <Route
          path="/merchant/chat"
          element={user ? <MerchantChat /> : <Navigate to="/merchant/login" />}
        />
        <Route
          path="/merchant/simulation"
          element={
            user ? <MerchantSimulation /> : <Navigate to="/merchant/login" />
          }
        />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/merchants" element={<AdminMerchantList />} />
        <Route path="/admin/merchant/new" element={<AdminMerchantForm />} />
        <Route path="/admin/merchant/:id" element={<AdminMerchantDetail />} />
        <Route
          path="/admin/merchant/:id/edit"
          element={<AdminMerchantForm />}
        />
        <Route
          path="/admin/delivery-persons"
          element={<AdminDeliveryPersonList />}
        />
        <Route
          path="/admin/delivery-person/new"
          element={<AdminDeliveryPersonForm />}
        />
        <Route
          path="/admin/delivery-person/:id"
          element={<AdminDeliveryPersonDetail />}
        />
        <Route
          path="/admin/delivery-person/:id/edit"
          element={<AdminDeliveryPersonForm />}
        />

        {/* Delivery person routes */}
        <Route
          path="/delivery/login"
          element={
            user ? <Navigate to="/delivery/dashboard" /> : <DeliveryLogin />
          }
        />
        <Route
          path="/delivery/dashboard"
          element={
            user ? <DeliveryDashboard /> : <Navigate to="/delivery/login" />
          }
        />
        <Route
          path="/delivery/scan"
          element={
            user ? (
              <DeliveryBordereauScanner />
            ) : (
              <Navigate to="/delivery/login" />
            )
          }
        />
        <Route
          path="/delivery/verify/:code"
          element={
            user ? (
              <DeliveryExchangeVerification />
            ) : (
              <Navigate to="/delivery/login" />
            )
          }
        />
        <Route
          path="/delivery/verifications"
          element={
            user ? (
              <DeliveryVerificationList />
            ) : (
              <Navigate to="/delivery/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
