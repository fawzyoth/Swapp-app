import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  FileText,
  CreditCard,
  AlertTriangle,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  Users,
  Calculator,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase";

const menuItems = [
  { path: "/finance/dashboard", icon: LayoutDashboard, label: "Tableau de Bord" },
  { path: "/finance/wallets", icon: Wallet, label: "Portefeuilles" },
  { path: "/finance/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { path: "/finance/reconciliation", icon: CheckSquare, label: "Réconciliation" },
  { path: "/finance/payouts", icon: CreditCard, label: "Paiements" },
  { path: "/finance/invoices", icon: FileText, label: "Factures" },
  { path: "/finance/alerts", icon: AlertTriangle, label: "Alertes" },
  { path: "/finance/reports", icon: BarChart3, label: "Rapports" },
];

const managementItems = [
  { path: "/finance/delivery-companies", icon: Building2, label: "Sociétés Livraison" },
  { path: "/finance/users", icon: Users, label: "Utilisateurs" },
  { path: "/finance/accounts", icon: Calculator, label: "Plan Comptable" },
];

export default function FinanceSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/finance/login");
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
        className={`fixed left-0 top-0 h-full bg-slate-900 text-white z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-white">SWAPP Finance</h2>
                <p className="text-xs text-slate-400">Plateforme Financière</p>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 px-4">
              Opérations
            </p>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-emerald-500 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Management Section */}
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-6 mb-3 px-4">
              Gestion
            </p>
            <ul className="space-y-1">
              {managementItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-emerald-500 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700">
            <Link
              to="/finance/settings"
              className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors mb-2"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Paramètres</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-400 w-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Déconnexion</span>
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
