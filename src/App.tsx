import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "./lib/supabase";
import { LanguageProvider } from "./contexts/LanguageContext";

// Minimal loading spinner
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
  </div>
);

// Lazy load all pages
const HomePage = lazy(() => import("./pages/Home"));

// Client pages
const ClientScanner = lazy(() => import("./pages/client/Scanner"));
const ClientExchangeForm = lazy(() => import("./pages/client/ExchangeForm"));
const ClientTracking = lazy(() => import("./pages/client/Tracking"));
const ClientExchangeList = lazy(() => import("./pages/client/ExchangeList"));
const ClientExchangeDetail = lazy(
  () => import("./pages/client/ExchangeDetail"),
);
const ClientChat = lazy(() => import("./pages/client/Chat"));
const ClientExchangeSuccess = lazy(
  () => import("./pages/client/ExchangeSuccess"),
);

// Merchant pages
const MerchantLogin = lazy(() => import("./pages/merchant/Login"));
const MerchantDashboard = lazy(() => import("./pages/merchant/Dashboard"));
const MerchantExchangeList = lazy(
  () => import("./pages/merchant/ExchangeList"),
);
const MerchantExchangeDetail = lazy(
  () => import("./pages/merchant/ExchangeDetail"),
);
const MerchantClientList = lazy(() => import("./pages/merchant/ClientList"));
const MerchantClientDetail = lazy(
  () => import("./pages/merchant/ClientDetail"),
);
const MerchantSimulation = lazy(() => import("./pages/merchant/Simulation"));
const MerchantChat = lazy(() => import("./pages/merchant/Chat"));
const MerchantPrintBordereau = lazy(
  () => import("./pages/merchant/PrintBordereau"),
);
const MerchantBrandingSettings = lazy(
  () => import("./pages/merchant/BrandingSettings"),
);

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminMerchantList = lazy(() => import("./pages/admin/MerchantList"));
const AdminMerchantDetail = lazy(() => import("./pages/admin/MerchantDetail"));
const AdminMerchantForm = lazy(() => import("./pages/admin/MerchantForm"));
const AdminDeliveryPersonList = lazy(
  () => import("./pages/admin/DeliveryPersonList"),
);
const AdminDeliveryPersonDetail = lazy(
  () => import("./pages/admin/DeliveryPersonDetail"),
);
const AdminDeliveryPersonForm = lazy(
  () => import("./pages/admin/DeliveryPersonForm"),
);
const AdminFinancialDashboard = lazy(
  () => import("./pages/admin/FinancialDashboard"),
);
const AdminInvoiceList = lazy(() => import("./pages/admin/InvoiceList"));
const AdminInvoiceDetail = lazy(() => import("./pages/admin/InvoiceDetail"));
const AdminSettlementList = lazy(() => import("./pages/admin/SettlementList"));

// Delivery pages
const DeliveryLogin = lazy(() => import("./pages/delivery/Login"));
const DeliveryDashboard = lazy(() => import("./pages/delivery/Dashboard"));
const DeliveryBordereauScanner = lazy(
  () => import("./pages/delivery/BordereauScanner"),
);
const DeliveryExchangeVerification = lazy(
  () => import("./pages/delivery/ExchangeVerification"),
);
const DeliveryVerificationList = lazy(
  () => import("./pages/delivery/VerificationList"),
);
const DeliveryFinancialDashboard = lazy(
  () => import("./pages/delivery/FinancialDashboard"),
);

// Client routes wrapper
function ClientRoutes() {
  return (
    <LanguageProvider>
      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    </LanguageProvider>
  );
}

// Protected route component - checks auth inline
function ProtectedRoute({
  children,
  loginPath,
}: {
  children: React.ReactNode;
  loginPath: string;
}) {
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (user === undefined) {
    return <LoadingSpinner />;
  }

  if (user === null) {
    return <Navigate to={loginPath} />;
  }

  return <>{children}</>;
}

// Public route - redirects to dashboard if already logged in
function PublicRoute({
  children,
  dashboardPath,
}: {
  children: React.ReactNode;
  dashboardPath: string;
}) {
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (user === undefined) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to={dashboardPath} />;
  }

  return <>{children}</>;
}

function App() {
  // Subscribe to auth changes globally
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // Force re-render on auth change by updating localStorage
      localStorage.setItem("auth_updated", Date.now().toString());
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes - no auth check needed */}
          <Route path="/" element={<HomePage />} />
          <Route path="/client/*" element={<ClientRoutes />} />

          {/* Admin routes - no auth for demo */}
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
          <Route path="/admin/finances" element={<AdminFinancialDashboard />} />
          <Route path="/admin/invoices" element={<AdminInvoiceList />} />
          <Route path="/admin/invoices/:id" element={<AdminInvoiceDetail />} />
          <Route path="/admin/settlements" element={<AdminSettlementList />} />

          {/* Merchant routes */}
          <Route
            path="/merchant/login"
            element={
              <PublicRoute dashboardPath="/merchant/dashboard">
                <MerchantLogin />
              </PublicRoute>
            }
          />
          <Route
            path="/merchant/dashboard"
            element={
              <ProtectedRoute loginPath="/merchant/login">
                <MerchantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/exchanges"
            element={
              <ProtectedRoute loginPath="/merchant/login">
                <MerchantExchangeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/exchange/:id"
            element={
              <ProtectedRoute loginPath="/merchant/login">
                <MerchantExchangeDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/clients"
            element={
              <ProtectedRoute loginPath="/merchant/login">
                <MerchantClientList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/client/:phone"
            element={
              <ProtectedRoute loginPath="/merchant/login">
                <MerchantClientDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/chat"
            element={
              <ProtectedRoute loginPath="/merchant/login">
                <MerchantChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/simulation"
            element={
              <ProtectedRoute loginPath="/merchant/login">
                <MerchantSimulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/print-bordereau"
            element={
              <ProtectedRoute loginPath="/merchant/login">
                <MerchantPrintBordereau />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/branding"
            element={
              <ProtectedRoute loginPath="/merchant/login">
                <MerchantBrandingSettings />
              </ProtectedRoute>
            }
          />

          {/* Delivery routes */}
          <Route
            path="/delivery/login"
            element={
              <PublicRoute dashboardPath="/delivery/dashboard">
                <DeliveryLogin />
              </PublicRoute>
            }
          />
          <Route
            path="/delivery/dashboard"
            element={
              <ProtectedRoute loginPath="/delivery/login">
                <DeliveryDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/scan"
            element={
              <ProtectedRoute loginPath="/delivery/login">
                <DeliveryBordereauScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/verify/:code"
            element={
              <ProtectedRoute loginPath="/delivery/login">
                <DeliveryExchangeVerification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/verifications"
            element={
              <ProtectedRoute loginPath="/delivery/login">
                <DeliveryVerificationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/finances"
            element={
              <ProtectedRoute loginPath="/delivery/login">
                <DeliveryFinancialDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
