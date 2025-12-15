import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import type {
  MerchantPayment,
  MerchantFinancialSummary,
  MerchantPaymentStatus,
} from "../../lib/supabase";
import { PAYMENT_STATUS_LABELS, getCurrentPeriod } from "../../lib/supabase";
import MerchantLayout from "../../components/MerchantLayout";

// Demo data for when database tables don't exist
const DEMO_PAYMENTS: MerchantPayment[] = [
  {
    id: "1",
    merchant_id: "demo",
    payment_number: "PAY-2025-P24-001",
    period_number: 2,
    year: 2025,
    month: 12,
    period_start: "2025-12-01",
    period_end: "2025-12-15",
    total_exchanges: 8,
    total_collected: 245,
    total_swapp_fees: 72,
    amount_due: 173,
    status: "pending",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    merchant_id: "demo",
    payment_number: "PAY-2025-P23-001",
    period_number: 1,
    year: 2025,
    month: 12,
    period_start: "2025-12-01",
    period_end: "2025-12-15",
    total_exchanges: 12,
    total_collected: 380,
    total_swapp_fees: 108,
    amount_due: 272,
    status: "paid",
    paid_at: "2025-12-18T10:30:00Z",
    payment_method: "bank_transfer",
    payment_reference: "VIR-2025-1218-001",
    created_at: "2025-12-01T00:00:00Z",
  },
  {
    id: "3",
    merchant_id: "demo",
    payment_number: "PAY-2025-P22-001",
    period_number: 2,
    year: 2025,
    month: 11,
    period_start: "2025-11-16",
    period_end: "2025-11-30",
    total_exchanges: 15,
    total_collected: 425,
    total_swapp_fees: 135,
    amount_due: 290,
    status: "paid",
    paid_at: "2025-12-03T14:00:00Z",
    payment_method: "bank_transfer",
    payment_reference: "VIR-2025-1203-002",
    created_at: "2025-11-16T00:00:00Z",
  },
  {
    id: "4",
    merchant_id: "demo",
    payment_number: "PAY-2025-P21-001",
    period_number: 1,
    year: 2025,
    month: 11,
    period_start: "2025-11-01",
    period_end: "2025-11-15",
    total_exchanges: 10,
    total_collected: 310,
    total_swapp_fees: 90,
    amount_due: 220,
    status: "paid",
    paid_at: "2025-11-18T09:15:00Z",
    payment_method: "bank_transfer",
    payment_reference: "VIR-2025-1118-001",
    created_at: "2025-11-01T00:00:00Z",
  },
];

const DEMO_SUMMARY: MerchantFinancialSummary = {
  total_pending: 173,
  total_paid: 782,
  current_period_amount: 173,
  exchanges_this_period: 8,
  last_payment_date: "2025-12-18",
  last_payment_amount: 272,
};

export default function PaymentHistory() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<MerchantPayment[]>([]);
  const [summary, setSummary] = useState<MerchantFinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/merchant/login");
    }
  };

  const fetchData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // Get merchant ID
      const { data: merchantData } = await supabase
        .from("merchants")
        .select("id")
        .eq("email", session.user.email)
        .maybeSingle();

      if (!merchantData) {
        // Use demo data
        setPayments(DEMO_PAYMENTS);
        setSummary(DEMO_SUMMARY);
        setLoading(false);
        return;
      }

      // Try to fetch real payments
      const { data: paymentsData, error } = await supabase
        .from("merchant_payments")
        .select("*")
        .eq("merchant_id", merchantData.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(
          "Using demo data - merchant_payments table not created yet",
        );
        setPayments(DEMO_PAYMENTS);
        setSummary(DEMO_SUMMARY);
      } else {
        setPayments(paymentsData || []);
        // Calculate summary from real data
        const pending = (paymentsData || [])
          .filter((p) => p.status === "pending" || p.status === "approved")
          .reduce((sum, p) => sum + p.amount_due, 0);
        const paid = (paymentsData || [])
          .filter((p) => p.status === "paid")
          .reduce((sum, p) => sum + p.amount_due, 0);
        const lastPaid = (paymentsData || []).find((p) => p.status === "paid");
        const currentPeriod = getCurrentPeriod();
        const currentPeriodPayment = (paymentsData || []).find(
          (p) =>
            p.year === currentPeriod.year &&
            p.month === currentPeriod.month &&
            p.period_number === currentPeriod.periodNumber,
        );

        setSummary({
          total_pending: pending,
          total_paid: paid,
          current_period_amount: currentPeriodPayment?.amount_due || 0,
          exchanges_this_period: currentPeriodPayment?.total_exchanges || 0,
          last_payment_date: lastPaid?.paid_at,
          last_payment_amount: lastPaid?.amount_due,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setPayments(DEMO_PAYMENTS);
      setSummary(DEMO_SUMMARY);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments =
    filterStatus === "all"
      ? payments
      : payments.filter((p) => p.status === filterStatus);

  const getStatusBadge = (status: MerchantPaymentStatus) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      disputed: "bg-red-100 text-red-800",
    };
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      paid: <CheckCircle className="w-3 h-3" />,
      disputed: <AlertCircle className="w-3 h-3" />,
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {icons[status]}
        {PAYMENT_STATUS_LABELS[status]}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatPeriod = (payment: MerchantPayment) => {
    const start = new Date(payment.period_start);
    const end = new Date(payment.period_end);
    return `${start.getDate()}-${end.getDate()} ${start.toLocaleDateString("fr-FR", { month: "short" })} ${payment.year}`;
  };

  if (loading) {
    return (
      <MerchantLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout>
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Mes Paiements
          </h2>
          <p className="text-slate-600">Suivi de vos paiements bi-mensuels</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-1">Solde en Attente</p>
            <p className="text-2xl font-bold text-slate-900">
              {summary?.total_pending.toFixed(2)} TND
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-1">Total Reçu</p>
            <p className="text-2xl font-bold text-slate-900">
              {summary?.total_paid.toFixed(2)} TND
            </p>
            {summary?.last_payment_date && (
              <p className="text-xs text-slate-500 mt-1">
                Dernier paiement: {formatDate(summary.last_payment_date)}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-1">Période Actuelle</p>
            <p className="text-2xl font-bold text-slate-900">
              {summary?.exchanges_this_period} échanges
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {summary?.current_period_amount.toFixed(2)} TND à recevoir
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Filtrer par statut:</span>
            <div className="flex gap-2">
              {["all", "pending", "approved", "paid", "disputed"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      filterStatus === status
                        ? "bg-sky-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {status === "all"
                      ? "Tous"
                      : PAYMENT_STATUS_LABELS[status as MerchantPaymentStatus]}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Historique des Paiements
            </h3>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>Aucun paiement trouvé</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredPayments.map((payment) => (
                <Link
                  key={payment.id}
                  to={`/merchant/payments/${payment.id}`}
                  className="block p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-slate-900">
                          {payment.payment_number}
                        </span>
                        {getStatusBadge(payment.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatPeriod(payment)}
                        </span>
                        <span>{payment.total_exchanges} échanges</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        {payment.amount_due.toFixed(2)} TND
                      </p>
                      {payment.paid_at && (
                        <p className="text-xs text-green-600">
                          Payé le {formatDate(payment.paid_at)}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 ml-4" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <h4 className="font-medium text-blue-900 mb-2">
            Comment ça marche ?
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Les paiements sont calculés toutes les 2 semaines (1-15 et
              16-fin du mois)
            </li>
            <li>
              • Frais SWAPP: 9 TND par échange (déduit du montant encaissé)
            </li>
            <li>• Le reste vous est versé par virement bancaire</li>
          </ul>
        </div>
      </div>
    </MerchantLayout>
  );
}
