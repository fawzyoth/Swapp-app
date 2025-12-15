import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Banknote,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Calendar,
  Store,
  Filter,
  RefreshCw,
  Plus,
} from "lucide-react";
import { supabase, MerchantPayment, Merchant, SWAPP_EXCHANGE_FEE, getCurrentPeriod, generatePaymentNumber } from "../../lib/supabase";
import AdminLayout from "../../components/AdminLayout";

type MerchantWithBalance = {
  merchant: Merchant;
  pendingAmount: number;
  exchangesCount: number;
  totalCollected: number;
};

export default function MerchantPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<(MerchantPayment & { merchant_name?: string })[]>([]);
  const [merchantBalances, setMerchantBalances] = useState<MerchantWithBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [view, setView] = useState<"payments" | "balances">("balances");
  const [summary, setSummary] = useState({
    totalPending: 0,
    totalPaid: 0,
    merchantsWithBalance: 0,
  });

  const currentPeriod = getCurrentPeriod();

  useEffect(() => {
    fetchData();
  }, [statusFilter, view]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (view === "payments") {
        await fetchPayments();
      } else {
        await fetchMerchantBalances();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      let query = supabase
        .from("merchant_payments")
        .select("*, merchants(name)")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.warn("merchant_payments table may not exist:", error.message);
        setPayments([]);
        return;
      }

      const paymentsWithNames = (data || []).map((p: any) => ({
        ...p,
        merchant_name: p.merchants?.name || "Marchand inconnu",
      }));

      setPayments(paymentsWithNames);

      // Calculate summary
      const pending = paymentsWithNames
        .filter((p) => p.status === "pending" || p.status === "approved")
        .reduce((sum, p) => sum + (p.amount_due || 0), 0);

      const paid = paymentsWithNames
        .filter((p) => p.status === "paid")
        .reduce((sum, p) => sum + (p.amount_due || 0), 0);

      setSummary((prev) => ({
        ...prev,
        totalPending: pending,
        totalPaid: paid,
      }));
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchMerchantBalances = async () => {
    try {
      // Get all merchants
      const { data: merchants, error: merchantsError } = await supabase
        .from("merchants")
        .select("*")
        .order("name");

      if (merchantsError) throw merchantsError;

      // Get exchanges with payment collected
      const { data: exchanges, error: exchangesError } = await supabase
        .from("exchanges")
        .select("*, delivery_verifications(amount_collected, payment_collected, created_at)")
        .in("status", ["delivery_verified", "completed"]);

      if (exchangesError) throw exchangesError;

      // Calculate balance per merchant
      const balances: MerchantWithBalance[] = [];
      let totalPendingAll = 0;
      let merchantsWithBalanceCount = 0;

      for (const merchant of merchants || []) {
        const merchantExchanges = (exchanges || []).filter(
          (e: any) => e.merchant_id === merchant.id
        );

        let totalCollected = 0;
        let exchangesCount = 0;

        merchantExchanges.forEach((exchange: any) => {
          const verification = exchange.delivery_verifications?.[0];
          if (verification?.payment_collected && verification.amount_collected > 0) {
            totalCollected += verification.amount_collected;
            exchangesCount++;
          }
        });

        const pendingAmount = Math.max(0, totalCollected - (exchangesCount * SWAPP_EXCHANGE_FEE));

        if (exchangesCount > 0) {
          balances.push({
            merchant,
            pendingAmount,
            exchangesCount,
            totalCollected,
          });

          if (pendingAmount > 0) {
            totalPendingAll += pendingAmount;
            merchantsWithBalanceCount++;
          }
        }
      }

      // Sort by pending amount descending
      balances.sort((a, b) => b.pendingAmount - a.pendingAmount);

      setMerchantBalances(balances);
      setSummary((prev) => ({
        ...prev,
        totalPending: totalPendingAll,
        merchantsWithBalance: merchantsWithBalanceCount,
      }));
    } catch (error) {
      console.error("Error fetching merchant balances:", error);
    }
  };

  const generatePaymentBatch = async () => {
    if (!confirm("Générer les paiements pour la période actuelle ?")) return;

    setGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      let sequence = 1;

      for (const balance of merchantBalances) {
        if (balance.pendingAmount <= 0) continue;

        const paymentNumber = generatePaymentNumber(
          currentPeriod.year,
          currentPeriod.month,
          currentPeriod.periodNumber,
          sequence
        );

        // Create payment record
        const { error } = await supabase.from("merchant_payments").insert({
          merchant_id: balance.merchant.id,
          payment_number: paymentNumber,
          period_number: currentPeriod.periodNumber,
          year: currentPeriod.year,
          month: currentPeriod.month,
          period_start: currentPeriod.start.toISOString(),
          period_end: currentPeriod.end.toISOString(),
          total_exchanges: balance.exchangesCount,
          total_collected: balance.totalCollected,
          total_swapp_fees: balance.exchangesCount * SWAPP_EXCHANGE_FEE,
          amount_due: balance.pendingAmount,
          status: "pending",
        });

        if (error) {
          console.error("Error creating payment for", balance.merchant.name, error);
        } else {
          sequence++;
        }
      }

      alert(`${sequence - 1} paiements générés avec succès !`);
      fetchData();
    } catch (error) {
      console.error("Error generating payments:", error);
      alert("Erreur lors de la génération des paiements");
    } finally {
      setGenerating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3.5 h-3.5" />
            Payé
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-3.5 h-3.5" />
            Approuvé
          </span>
        );
      case "disputed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3.5 h-3.5" />
            Contesté
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            En attente
          </span>
        );
    }
  };

  const formatPeriod = (payment: MerchantPayment) => {
    const startDate = new Date(payment.period_start);
    const endDate = new Date(payment.period_end);
    return `${startDate.getDate()}-${endDate.getDate()} ${startDate.toLocaleDateString("fr-FR", { month: "short" })}`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Paiements Marchands</h1>
            <p className="text-slate-600">
              Période actuelle: {currentPeriod.start.getDate()}-{currentPeriod.end.getDate()}{" "}
              {currentPeriod.start.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </p>
          </div>
          <button
            onClick={generatePaymentBatch}
            disabled={generating || merchantBalances.filter((b) => b.pendingAmount > 0).length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
          >
            {generating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            Générer Période
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">Total à Payer</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {summary.totalPending.toFixed(2)} <span className="text-base font-normal text-slate-500">TND</span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">Total Payé</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {summary.totalPaid.toFixed(2)} <span className="text-base font-normal text-slate-500">TND</span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Store className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">Marchands avec Solde</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {summary.merchantsWithBalance}
            </p>
          </div>
        </div>

        {/* View Toggle & Filter */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setView("balances")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === "balances"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Soldes Marchands
            </button>
            <button
              onClick={() => setView("payments")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === "payments"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Historique Paiements
            </button>
          </div>

          {view === "payments" && (
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Tous</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvés</option>
                <option value="paid">Payés</option>
                <option value="disputed">Contestés</option>
              </select>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {view === "balances" ? (
            <>
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Soldes par Marchand</h2>
              </div>

              {merchantBalances.length === 0 ? (
                <div className="p-12 text-center">
                  <Store className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">Aucun solde marchand</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                          Marchand
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                          Échanges
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                          Encaissé
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                          Frais SWAPP
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                          À Payer
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {merchantBalances.map((item) => (
                        <tr key={item.merchant.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-100 rounded-lg">
                                <Store className="w-5 h-5 text-slate-600" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{item.merchant.name}</p>
                                <p className="text-sm text-slate-500">{item.merchant.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-slate-900">
                            {item.exchangesCount}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-slate-900">
                            {item.totalCollected.toFixed(2)} TND
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-red-600">
                            -{(item.exchangesCount * SWAPP_EXCHANGE_FEE).toFixed(2)} TND
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`font-semibold ${item.pendingAmount > 0 ? "text-emerald-600" : "text-slate-500"}`}>
                              {item.pendingAmount.toFixed(2)} TND
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50">
                      <tr>
                        <td className="px-6 py-4 font-medium text-slate-900">Total</td>
                        <td className="px-6 py-4 text-right font-medium text-slate-900">
                          {merchantBalances.reduce((sum, m) => sum + m.exchangesCount, 0)}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-slate-900">
                          {merchantBalances.reduce((sum, m) => sum + m.totalCollected, 0).toFixed(2)} TND
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-red-600">
                          -{merchantBalances.reduce((sum, m) => sum + (m.exchangesCount * SWAPP_EXCHANGE_FEE), 0).toFixed(2)} TND
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-600">
                          {summary.totalPending.toFixed(2)} TND
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Historique des Paiements</h2>
              </div>

              {payments.length === 0 ? (
                <div className="p-12 text-center">
                  <Banknote className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">Aucun paiement généré</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      onClick={() => navigate(`/admin/merchant-payments/${payment.id}`)}
                      className="px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{payment.payment_number}</p>
                            <p className="text-sm text-slate-500">
                              {payment.merchant_name} • {formatPeriod(payment)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-slate-900">
                              {payment.amount_due.toFixed(2)} TND
                            </p>
                            <p className="text-xs text-slate-500">
                              {payment.total_exchanges} échange{payment.total_exchanges > 1 ? "s" : ""}
                            </p>
                          </div>
                          {getStatusBadge(payment.status)}
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
