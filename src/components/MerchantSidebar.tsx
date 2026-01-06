import { Link, useLocation } from "react-router-dom";
import {
  Star,
  Video,
  LayoutDashboard,
  Package,
  Users,
  MessageSquare,
  LogOut,
  Store,
  Menu,
  X,
  Palette,
  Key,
  Settings,
  UserCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const menuItems = [
  { path: "/merchant/dashboard", icon: LayoutDashboard, label: "Dashboard", dataOnboarding: null },
  { path: "/merchant/exchanges", icon: Package, label: "Échanges", dataOnboarding: "exchanges" },
  { path: "/merchant/clients", icon: Users, label: "Clients", dataOnboarding: "qr-code" },
  { path: "/merchant/branding", icon: Palette, label: "Ma Marque", dataOnboarding: "branding" },
  { path: "/merchant/chat", icon: MessageSquare, label: "Messagerie", dataOnboarding: "chat" },
  { path: "/merchant/reviews", icon: Star, label: "Avis Clients", dataOnboarding: null },
  { path: "/merchant/video-calls", icon: Video, label: "Appels Video", dataOnboarding: null },
  { path: "/merchant/api-keys", icon: Key, label: "Clés API", dataOnboarding: null },
];

export default function MerchantSidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    getUserEmail();
  }, []);

  const handleLogout = () => {
    // Sign out locally (no server call to avoid CORS)
    supabase.auth.signOut({ scope: "local" });
    // Redirect to unified login
    window.location.href = "#/login";
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
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-200">
            <img
              src="/Logo.png"
              alt="Revixio"
              className="h-8 w-auto"
            />
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
                      {...(item.dataOnboarding ? { 'data-onboarding': item.dataOnboarding } : {})}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Account Section */}
          <div className="p-4 border-t border-slate-200">
            {/* User Info */}
            <div className="mb-3 px-3 py-2 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {userEmail || "Utilisateur"}
                  </p>
                  <p className="text-xs text-slate-500">Compte Merchant</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-1">
              <Link
                to="/merchant/branding"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">Paramètres</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
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
