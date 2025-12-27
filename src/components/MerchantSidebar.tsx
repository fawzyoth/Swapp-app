import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  MessageSquare,
  LogOut,
  Store,
  Menu,
  X,
  Palette,
  Banknote,
  Truck,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const menuItems = [
  { path: "/merchant/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/merchant/exchanges", icon: Package, label: "Échanges" },
  { path: "/merchant/pickups", icon: Truck, label: "Ramassages" },
  { path: "/merchant/clients", icon: Users, label: "Clients" },
  { path: "/merchant/payments", icon: Banknote, label: "Mes Paiements" },
  { path: "/merchant/branding", icon: Palette, label: "Ma Marque" },
  { path: "/merchant/chat", icon: MessageSquare, label: "Messagerie" },
];

export default function MerchantSidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [merchantInfo, setMerchantInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if demo mode
    const demoMode = sessionStorage.getItem("demo_mode") === "true";
    setIsDemoMode(demoMode);

    if (demoMode) {
      // Get demo merchant info
      const demoMerchant = sessionStorage.getItem("demo_merchant");
      if (demoMerchant) {
        const parsed = JSON.parse(demoMerchant);
        setMerchantInfo({
          name: parsed.name || "Boutique Demo",
          email: parsed.email || "demo@merchant.com",
        });
      } else {
        setMerchantInfo({ name: "Boutique Demo", email: "demo@merchant.com" });
      }
    } else {
      // Get real merchant info from Supabase
      const fetchMerchant = async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.user?.email) {
            const { data: merchant } = await supabase
              .from("merchants")
              .select("name, email, business_name")
              .eq("email", session.user.email)
              .maybeSingle();

            if (merchant) {
              setMerchantInfo({
                name: merchant.business_name || merchant.name || "Marchand",
                email: merchant.email,
              });
            } else {
              setMerchantInfo({ name: "Marchand", email: session.user.email });
            }
          }
        } catch (err) {
          console.error("Error fetching merchant:", err);
        }
      };
      fetchMerchant();
    }
  }, []);

  const handleLogout = () => {
    // Clear all storage
    sessionStorage.clear();
    localStorage.clear();

    // Redirect to login
    window.location.href = "/Swapp-app/#/merchant/login";
  };

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDemoMode ? "bg-purple-100" : "bg-sky-100"}`}
              >
                {isDemoMode ? (
                  <User className="w-6 h-6 text-purple-600" />
                ) : (
                  <Store className="w-6 h-6 text-sky-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-slate-900 truncate">
                  {merchantInfo?.name || "Chargement..."}
                </h2>
                <p className="text-xs text-slate-500 truncate">
                  {merchantInfo?.email || ""}
                </p>
              </div>
            </div>
            {isDemoMode && (
              <div className="mt-3 px-2 py-1 bg-purple-100 rounded-lg">
                <p className="text-xs text-purple-700 font-medium text-center">
                  Mode Demo
                </p>
              </div>
            )}
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-sky-50 text-sky-600"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
