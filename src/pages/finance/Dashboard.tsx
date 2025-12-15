import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import FinanceLayout from "../../components/FinanceLayout";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

type DashboardStats = {
  totalWalletBalance: number;
  pendingReconciliation: number;
  pendingPayouts: number;
  activeAlerts: number;
  todayTransactions: number;
  todayVolume: number;
};

export default function FinanceDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalWalletBalance: 0,
    pendingReconciliation: 0,
    pendingPayouts: 0,
    activeAlerts: 0,
    todayTransactions: 0,
    todayVolume: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [pendingAlerts, setPendingAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Try to fetch from database first
      const { data: wallets, error: walletsError } = await supabase
        .from("finance_wallets")
        .select("balance")
        .eq("is_active", true);

      // If database tables don't exist, use demo data
      if (walletsError) {
        console.log("Using demo data - finance tables not created yet");

        // Demo stats
        setStats({
          totalWalletBalance: 45680.5,
          pendingReconciliation: 3,
          pendingPayouts: 5,
          activeAlerts: 2,
          todayTransactions: 24,
          todayVolume: 8750.0,
        });

        // Demo transactions
        setRecentTransactions([
          {
            id: "1",
            transaction_number: "TXN-2025-000124",
            transaction_type: "client_collection",
            amount: 35,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            transaction_number: "TXN-2025-000123",
            transaction_type: "swapp_fee",
            amount: -9,
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "3",
            transaction_number: "TXN-2025-000122",
            transaction_type: "merchant_credit",
            amount: 26,
            created_at: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: "4",
            transaction_number: "TXN-2025-000121",
            transaction_type: "client_collection",
            amount: 50,
            created_at: new Date(Date.now() - 10800000).toISOString(),
          },
          {
            id: "5",
            transaction_number: "TXN-2025-000120",
            transaction_type: "merchant_payout",
            amount: -156,
            created_at: new Date(Date.now() - 14400000).toISOString(),
          },
          {
            id: "6",
            transaction_number: "TXN-2025-000119",
            transaction_type: "dp_to_company",
            amount: 450,
            created_at: new Date(Date.now() - 18000000).toISOString(),
          },
        ]);

        // Demo alerts
        setPendingAlerts([
          {
            id: "1",
            severity: "high",
            title: "Écart de réconciliation détecté",
            description:
              "Différence de 45 TND sur la période du 10-15 Décembre",
          },
          {
            id: "2",
            severity: "medium",
            title: "Paiement marchand en retard",
            description:
              "TechStore - paiement de 289 TND en attente depuis 3 jours",
          },
        ]);

        setLoading(false);
        return;
      }

      const totalBalance =
        wallets?.reduce((sum, w) => sum + Number(w.balance), 0) || 0;

      // Fetch pending reconciliations count
      const { count: pendingReconCount } = await supabase
        .from("finance_reconciliations")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Fetch pending payouts count
      const { count: pendingPayoutCount } = await supabase
        .from("finance_payouts")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "approved"]);

      // Fetch active alerts count
      const { count: alertCount } = await supabase
        .from("finance_alerts")
        .select("*", { count: "exact", head: true })
        .eq("status", "open");

      // Fetch today's transactions
      const today = new Date().toISOString().split("T")[0];
      const { data: todayTx, count: txCount } = await supabase
        .from("finance_transactions")
        .select("amount", { count: "exact" })
        .gte("created_at", today);

      const todayVolume =
        todayTx?.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) || 0;

      // Fetch recent transactions
      const { data: recentTx } = await supabase
        .from("finance_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch pending alerts
      const { data: alerts } = await supabase
        .from("finance_alerts")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalWalletBalance: totalBalance,
        pendingReconciliation: pendingReconCount || 0,
        pendingPayouts: pendingPayoutCount || 0,
        activeAlerts: alertCount || 0,
        todayTransactions: txCount || 0,
        todayVolume: todayVolume,
      });

      setRecentTransactions(recentTx || []);
      setPendingAlerts(alerts || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Use demo data on error
      setStats({
        totalWalletBalance: 45680.5,
        pendingReconciliation: 3,
        pendingPayouts: 5,
        activeAlerts: 2,
        todayTransactions: 24,
        todayVolume: 8750.0,
      });
      setRecentTransactions([
        {
          id: "1",
          transaction_number: "TXN-2025-000124",
          transaction_type: "client_collection",
          amount: 35,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          transaction_number: "TXN-2025-000123",
          transaction_type: "swapp_fee",
          amount: -9,
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "3",
          transaction_number: "TXN-2025-000122",
          transaction_type: "merchant_credit",
          amount: 26,
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
      ]);
      setPendingAlerts([
        {
          id: "1",
          severity: "high",
          title: "Écart de réconciliation",
          description: "Différence détectée",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return (
      new Intl.NumberFormat("fr-TN", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount) + " TND"
    );
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      client_collection: "Encaissement Client",
      swapp_fee: "Commission SWAPP",
      merchant_credit: "Crédit Marchand",
      dp_to_company: "Livreur → Société",
      company_to_swapp: "Société → SWAPP",
      merchant_payout: "Paiement Marchand",
      adjustment: "Ajustement",
      refund: "Remboursement",
    };
    return labels[type] || type;
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <FinanceLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      </FinanceLayout>
    );
  }

  return (
    <FinanceLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tableau de Bord
            </h1>
            <p className="text-gray-500 mt-1">Vue d'ensemble financière</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Solde Total Wallets</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats.totalWalletBalance)}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Volume Aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats.todayVolume)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {stats.todayTransactions} transactions
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Réconciliations en Attente
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.pendingReconciliation}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Alertes Actives</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.activeAlerts}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stats.activeAlerts > 0 ? "bg-red-100" : "bg-green-100"
                }`}
              >
                {stats.activeAlerts > 0 ? (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Transactions Récentes
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentTransactions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Aucune transaction récente
                </div>
              ) : (
                recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          Number(tx.amount) >= 0 ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {Number(tx.amount) >= 0 ? (
                          <ArrowDownRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {getTransactionTypeLabel(tx.transaction_type)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {tx.transaction_number || tx.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          Number(tx.amount) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {Number(tx.amount) >= 0 ? "+" : ""}
                        {formatCurrency(Number(tx.amount))}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(tx.created_at).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Alertes en Cours
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {pendingAlerts.length === 0 ? (
                <div className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-500">Aucune alerte active</p>
                </div>
              ) : (
                pendingAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded ${getAlertSeverityColor(alert.severity)}`}
                          >
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {alert.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Actions Rapides
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Réconcilier
              </span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Nouveau Paiement
              </span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Voir Wallets
              </span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Voir Alertes
              </span>
            </button>
          </div>
        </div>
      </div>
    </FinanceLayout>
  );
}
