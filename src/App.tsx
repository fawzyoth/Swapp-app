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

const MerchantChat = lazy(() => import("./pages/merchant/Chat"));
const MerchantBrandingSettings = lazy(
  () => import("./pages/merchant/BrandingSettings"),
);
const MerchantPickupManagement = lazy(
  () => import("./pages/merchant/PickupManagement"),
);
const MerchantPaymentHistory = lazy(
  () => import("./pages/merchant/PaymentHistory"),
);
const MerchantPaymentDetail = lazy(
  () => import("./pages/merchant/PaymentDetail"),
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
const AdminMerchantPayments = lazy(
  () => import("./pages/admin/MerchantPayments"),
);
const AdminMerchantPaymentDetail = lazy(
  () => import("./pages/admin/MerchantPaymentDetail"),
);
const AdminDeliveryCollections = lazy(
  () => import("./pages/admin/DeliveryCollections"),
);

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
const DeliveryWallet = lazy(() => import("./pages/delivery/Wallet"));

// Finance pages
const FinanceLogin = lazy(() => import("./pages/finance/Login"));
const FinanceDashboard = lazy(() => import("./pages/finance/Dashboard"));
const FinanceWallets = lazy(() => import("./pages/finance/Wallets"));
const FinanceTransactions = lazy(() => import("./pages/finance/Transactions"));
const FinanceReconciliation = lazy(
  () => import("./pages/finance/Reconciliation"),
);
const FinancePayouts = lazy(() => import("./pages/finance/Payouts"));
const FinanceAlerts = lazy(() => import("./pages/finance/Alerts"));

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

// Session cache for faster auth checks
let cachedSession: any = null;
let sessionChecked = false;
let authPromise: Promise<any> | null = null;

// Single auth check function - returns cached or fetches once
const getAuthSession = async () => {
  if (sessionChecked) {
    return cachedSession;
  }

  // If already fetching, wait for that promise
  if (authPromise) {
    return authPromise;
  }

  // Start fetch with timeout
  authPromise = Promise.race([
    supabase.auth.getSession(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 3000),
    ),
  ])
    .then((result: any) => {
      cachedSession = result?.data?.session ?? null;
      sessionChecked = true;
      authPromise = null;
      return cachedSession;
    })
    .catch((err) => {
      console.error("Session error:", err);
      cachedSession = null;
      sessionChecked = true;
      authPromise = null;
      return null;
    });

  return authPromise;
};

function ProtectedRoute({
  children,
  loginPath,
}: {
  children: React.ReactNode;
  loginPath: string;
}) {
  const [user, setUser] = useState<any>(
    sessionChecked ? (cachedSession?.user ?? null) : undefined,
  );
  const [checked, setChecked] = useState(sessionChecked);

  // Check for demo mode - allows bypassing auth for merchant routes
  const isDemoMode = sessionStorage.getItem("demo_mode") === "true";

  useEffect(() => {
    let mounted = true;

    // If demo mode is active, skip auth check
    if (isDemoMode) {
      setChecked(true);
      return;
    }

    // If already checked, use cached immediately
    if (sessionChecked) {
      setUser(cachedSession?.user ?? null);
      setChecked(true);
      return;
    }

    getAuthSession().then((session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setChecked(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      cachedSession = session;
      sessionChecked = true;
      if (mounted) {
        setUser(session?.user ?? null);
        setChecked(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isDemoMode]);

  if (!checked) {
    return <LoadingSpinner />;
  }

  // Allow access if demo mode is active OR user is authenticated
  if (isDemoMode) {
    return <>{children}</>;
  }

  if (user === null) {
    return <Navigate to={loginPath} />;
  }

  return <>{children}</>;
}

// Public route - shows login form immediately, redirects if already logged in
function PublicRoute({
  children,
  dashboardPath,
}: {
  children: React.ReactNode;
  dashboardPath: string;
}) {
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Check if already authenticated - but don't block rendering
    const checkAuth = async () => {
      try {
        // Always fetch fresh session for login pages (don't trust cache)
        const session = (await Promise.race([
          supabase.auth.getSession(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), 1500),
          ),
        ])) as any;

        if (mounted && session?.data?.session?.user) {
          cachedSession = session.data.session;
          sessionChecked = true;
          setShouldRedirect(true);
        } else {
          // Clear cache if no session
          cachedSession = null;
          sessionChecked = true;
        }
      } catch {
        // On timeout or error, just show the login form
        cachedSession = null;
        sessionChecked = true;
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (shouldRedirect) {
    return <Navigate to={dashboardPath} />;
  }

  // Always show children (login form) immediately
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
          <Route
            path="/admin/merchant-payments"
            element={<AdminMerchantPayments />}
          />
          <Route
            path="/admin/merchant-payments/:id"
            element={<AdminMerchantPaymentDetail />}
          />
          <Route
            path="/admin/delivery-collections"
            element={<AdminDeliveryCollections />}
          />

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
            path="/merchant/branding"
            element={
              <ProtectedRoute loginPath="/merchant/login">
                <MerchantBrandingSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/pickups"
            element={
              <ProtectedRoute loginPath="/merchant/login">
                <MerchantPickupManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/payments"
            element={
              <ProtectedRoute loginPath="/merchant/login">
                <MerchantPaymentHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/payments/:id"
            element={
              <ProtectedRoute loginPath="/merchant/login">
                <MerchantPaymentDetail />
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
          <Route
            path="/delivery/wallet"
            element={
              <ProtectedRoute loginPath="/delivery/login">
                <DeliveryWallet />
              </ProtectedRoute>
            }
          />

          {/* Finance routes - uses sessionStorage auth, no Supabase auth */}
          <Route path="/finance/login" element={<FinanceLogin />} />
          <Route path="/finance/dashboard" element={<FinanceDashboard />} />
          <Route path="/finance/wallets" element={<FinanceWallets />} />
          <Route
            path="/finance/transactions"
            element={<FinanceTransactions />}
          />
          <Route
            path="/finance/reconciliation"
            element={<FinanceReconciliation />}
          />
          <Route path="/finance/payouts" element={<FinancePayouts />} />
          <Route path="/finance/alerts" element={<FinanceAlerts />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
