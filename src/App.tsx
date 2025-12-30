import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

import ClientScanner from "./pages/client/Scanner";
import ClientExchangeForm from "./pages/client/ExchangeForm";
import ClientTracking from "./pages/client/Tracking";
import ClientExchangeList from "./pages/client/ExchangeList";
import ClientExchangeDetail from "./pages/client/ExchangeDetail";
import ClientChat from "./pages/client/Chat";
import ClientReviewForm from "./pages/client/ReviewForm";
import ClientVideoCall from "./pages/client/VideoCall";

import MerchantLogin from "./pages/merchant/Login";
import MerchantDashboard from "./pages/merchant/Dashboard";
import MerchantExchangeList from "./pages/merchant/ExchangeList";
import MerchantExchangeDetail from "./pages/merchant/ExchangeDetail";
import MerchantClientList from "./pages/merchant/ClientList";
import MerchantClientDetail from "./pages/merchant/ClientDetail";
import MerchantSimulation from "./pages/merchant/Simulation";
import MerchantChat from "./pages/merchant/Chat";
import MerchantReviews from "./pages/merchant/Reviews";
import MerchantVideoCall from "./pages/merchant/VideoCall";
import MerchantVideoCallList from "./pages/merchant/VideoCallList";

import HomePage from "./pages/Home";

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

        <Route path="/client/scan" element={<ClientScanner />} />
        <Route path="/client/exchange/new" element={<ClientExchangeForm />} />
        <Route path="/client/tracking/:code" element={<ClientTracking />} />
        <Route path="/client/exchanges" element={<ClientExchangeList />} />
        <Route path="/client/exchange/:id" element={<ClientExchangeDetail />} />
        <Route path="/client/chat" element={<ClientChat />} />
        <Route path="/client/review/new" element={<ClientReviewForm />} />
        <Route path="/call/:roomId" element={<ClientVideoCall />} />

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
        <Route
          path="/merchant/reviews"
          element={
            user ? <MerchantReviews /> : <Navigate to="/merchant/login" />
          }
        />
        <Route
          path="/merchant/video-calls"
          element={
            user ? <MerchantVideoCallList /> : <Navigate to="/merchant/login" />
          }
        />
        <Route
          path="/merchant/call/:roomId"
          element={
            user ? <MerchantVideoCall /> : <Navigate to="/merchant/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
