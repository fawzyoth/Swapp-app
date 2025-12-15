import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Banknote,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Calendar,
  TrendingUp,
  Filter,
} from "lucide-react";
import { supabase, MerchantPayment, PAYMENT_STATUS_LABELS, SWAPP_EXCHANGE_FEE } from "../../lib/supabase";
import MerchantLayout from "../../components/MerchantLayout";

export default function PaymentHistory() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<MerchantPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [summary, setSummary] = useState({
    totalPending: 0,
    totalPaid: 0,
    currentPeriodExchanges: 0,
    currentPeriodAmount: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const fetchPayments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch payments for this merchant
      let query = supabase
        .from("merchant_payments")
        .select("*")
        .eq("merchant_id", user.id)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data: paymentsData, error } = await query;

      if (error) {
        console.warn("merchant_payments table may not exist yet:", error.message);
        // Calculate from exchanges instead
        await calculateFromExchanges(user.id);
        return;
      }

      setPayments(paymentsData || []);

      // Calculate summary
      const pending = (paymentsData || [])
        .filter((p) => p.status === "pending" || p.status === "approved")
        .reduce((sum, p) => sum + (p.amount_due || 0), 0);

      const paid = (paymentsData || [])
        .filter((p) => p.status === "paid")
        .reduce((sum, p) => sum + (p.amount_due || 0), 0);

      setSummary((prev) => ({
        ...prev,
        totalPending: pending,
        totalPaid: paid,
      }));

      // Calculate current period stats from exchanges
      await calculateCurrentPeriodStats(user.id);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFromExchanges = async (merchantId: string) => {
    try {
      // Get exchanges with payment collected for this merchant
      const { data: exchanges, error } = await supabase
        .from("exchanges")
        .select("*, delivery_verifications(amount_collected, payment_collected, created_at)")
        .eq("merchant_id", merchantId)
        .in("status", ["delivery_verified", "completed"]);

      if (error) throw error;

      let totalCollected = 0;
      let exchangeCount = 0;

      (exchanges || []).forEach((exchange: any) => {
        const verification = exchange.delivery_verifications?.[0];
        if (verification?.payment_collected && verification.amount_collected > 0) {
          totalCollected += verification.amount_collected;
          exchangeCount++;
        }
      });

      const merchantAmount = Math.max(0, totalCollected - (exchangeCount * SWAPP_EXCHANGE_FEE));

      setSummary({
        totalPending: merchantAmount,
        totalPaid: 0,
        currentPeriodExchanges: exchangeCount,
        currentPeriodAmount: merchantAmount,
      });
    } catch (error) {
      console.error("Error calculating from exchanges:", error);
    }
  };

  const calculateCurrentPeriodStats = async (merchantId: string) => {
    try {
      const now = new Date();
      const day = now.getDate();
      const year = now.getFullYear();
      const month = now.getMonth();

      let periodStart: Date;
      let periodEnd: Date;

      if (day <= 15) {
        periodStart = new Date(year, month, 1);
        periodEnd = new Date(year, month, 15, 23, 59, 59);
      } else {
        periodStart = new Date(year, month, 16);
        periodEnd = new Date(year, month + 1, 0, 23, 59, 59);
      }

      const { data: exchanges, error } = await supabase
        .from("exchanges")
        .select("*, delivery_verifications(amount_collected, payment_collected, created_at)")
        .eq("merchant_id", merchantId)
        .in("status", ["delivery_verified", "completed"])
        .gte("created_at", periodStart.toISOString())
        .lte("created_at", periodEnd.toISOString());

      if (error) throw error;

      let periodCollected = 0;
      let periodExchanges = 0;

      (exchanges || []).forEach((exchange: any) => {
        const verification = exchange.delivery_verifications?.[0];
        if (verification?.payment_collected && verification.amount_collected > 0) {
          periodCollected += verification.amount_collected;
          periodExchanges++;
        }
      });

      const periodMerchantAmount = Math.max(0, periodCollected - (periodExchanges * SWAPP_EXCHANGE_FEE));

      setSummary((prev) => ({
        ...prev,
        currentPeriodExchanges: periodExchanges,
        currentPeriodAmount: periodMerchantAmount,
      }));
    } catch (error) {
      console.error("Error calculating current period:", error);
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
    return `${startDate.getDate()}-${endDate.getDate()} ${startDate.toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}`;
  };

  if (loading) {
    return (
      <MerchantLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes Paiements</h1>
          <p className="text-slate-600">
            Suivez vos paiements et l'historique des versements
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">En Attente</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {summary.totalPending.toFixed(2)} <span className="text-base font-normal text-slate-500">TND</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">Montant à recevoir</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">Total Reçu</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {summary.totalPaid.toFixed(2)} <span className="text-base font-normal text-slate-500">TND</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">Depuis le début</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">Cette Période</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {summary.currentPeriodExchanges} <span className="text-base font-normal text-slate-500">échanges</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              ≈ {summary.currentPeriodAmount.toFixed(2)} TND à recevoir
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Banknote className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-indigo-900">Comment ça marche ?</p>
              <p className="text-sm text-indigo-700 mt-1">
                Pour chaque échange, des frais de <strong>{SWAPP_EXCHANGE_FEE} TND</strong> sont déduits.
                Le reste du montant encaissé par le client vous est versé toutes les 2 semaines
                (1-15 du mois et 16-fin du mois).
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Tous les paiements</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
            <option value="paid">Payés</option>
            <option value="disputed">Contestés</option>
          </select>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Historique des Paiements</h2>
          </div>

          {payments.length === 0 ? (
            <div className="p-12 text-center">
              <Banknote className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">Aucun paiement pour le moment</p>
              <p className="text-sm text-slate-500">
                Les paiements apparaîtront ici une fois générés par l'administration
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  onClick={() => navigate(`/merchant/payments/${payment.id}`)}
                  className="px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{payment.payment_number}</p>
                        <p className="text-sm text-slate-500">{formatPeriod(payment)}</p>
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
                  {payment.status === "paid" && payment.paid_at && (
                    <div className="mt-2 ml-14 text-xs text-emerald-600">
                      Payé le {new Date(payment.paid_at).toLocaleDateString("fr-FR")}
                      {payment.payment_reference && ` - Réf: ${payment.payment_reference}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MerchantLayout>
  );
}
