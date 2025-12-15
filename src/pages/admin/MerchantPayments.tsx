import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  Search,
  Filter,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  RefreshCw,
  Download,
  Building2,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import type {
  MerchantPayment,
  MerchantPaymentStatus,
  Merchant,
} from "../../lib/supabase";
import {
  PAYMENT_STATUS_LABELS,
  getCurrentPeriod,
  generatePaymentNumber,
} from "../../lib/supabase";
import AdminLayout from "../../components/AdminLayout";

type PaymentWithMerchant = MerchantPayment & {
  merchant?: Merchant;
};

// Demo data
const DEMO_PAYMENTS: PaymentWithMerchant[] = [
  {
    id: "1",
    merchant_id: "m1",
    payment_number: "PAY-2025-P24-001",
    period_number: 2,
    year: 2025,
    month: 12,
    period_start: "2025-12-01",
    period_end: "2025-12-15",
    total_exchanges: 12,
    total_collected: 380,
    total_swapp_fees: 108,
    amount_due: 272,
    status: "pending",
    created_at: new Date().toISOString(),
    merchant: {
      id: "m1",
      email: "techstore@example.com",
      name: "TechStore",
      phone: "+216 98 123 456",
      business_name: "TechStore Tunisie",
      created_at: "",
    },
  },
  {
    id: "2",
    merchant_id: "m2",
    payment_number: "PAY-2025-P24-002",
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
    merchant: {
      id: "m2",
      email: "modashop@example.com",
      name: "ModaShop",
      phone: "+216 97 456 789",
      business_name: "ModaShop Fashion",
      created_at: "",
    },
  },
  {
    id: "3",
    merchant_id: "m3",
    payment_number: "PAY-2025-P24-003",
    period_number: 2,
    year: 2025,
    month: 12,
    period_start: "2025-12-01",
    period_end: "2025-12-15",
    total_exchanges: 5,
    total_collected: 134,
    total_swapp_fees: 45,
    amount_due: 89,
    status: "paid",
    paid_at: "2025-12-16T10:00:00Z",
    payment_method: "bank_transfer",
    payment_reference: "VIR-2025-1216-001",
    created_at: new Date().toISOString(),
    merchant: {
      id: "m3",
      email: "electroplus@example.com",
      name: "ElectroPlus",
      phone: "+216 96 789 012",
      business_name: "ElectroPlus SARL",
      created_at: "",
    },
  },
  {
    id: "4",
    merchant_id: "m1",
    payment_number: "PAY-2025-P23-001",
    period_number: 1,
    year: 2025,
    month: 12,
    period_start: "2025-12-01",
    period_end: "2025-12-15",
    total_exchanges: 15,
    total_collected: 425,
    total_swapp_fees: 135,
    amount_due: 290,
    status: "paid",
    paid_at: "2025-12-17T14:30:00Z",
    payment_method: "bank_transfer",
    payment_reference: "VIR-2025-1217-001",
    created_at: "2025-12-01T00:00:00Z",
    merchant: {
      id: "m1",
      email: "techstore@example.com",
      name: "TechStore",
      phone: "+216 98 123 456",
      business_name: "TechStore Tunisie",
      created_at: "",
    },
  },
];

export default function MerchantPayments() {
  const [payments, setPayments] = useState<PaymentWithMerchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPeriod, setFilterPeriod] = useState<string>("current");

  const currentPeriod = getCurrentPeriod();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("merchant_payments")
        .select(
          `
          *,
          merchant:merchants(id, name, email, phone, business_name)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.log(
          "Using demo data - merchant_payments table not created yet",
        );
        setPayments(DEMO_PAYMENTS);
      } else {
        setPayments(data || []);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments(DEMO_PAYMENTS);
    } finally {
      setLoading(false);
    }
  };

  const generatePeriodPayments = async () => {
    setGenerating(true);
    try {
      // In production, this would:
      // 1. Fetch all completed exchanges for the current period
      // 2. Group by merchant
      // 3. Calculate totals (collected - 9 TND per exchange)
      // 4. Create merchant_payments records
      // 5. Create merchant_payment_items for each exchange

      alert(
        `Génération des paiements pour la période ${currentPeriod.periodNumber === 1 ? "1-15" : "16-" + new Date(currentPeriod.year, currentPeriod.month, 0).getDate()} ${new Date(currentPeriod.year, currentPeriod.month - 1).toLocaleDateString("fr-FR", { month: "long" })} ${currentPeriod.year}`,
      );

      // Refresh
      await fetchPayments();
    } catch (error) {
      console.error("Error generating payments:", error);
      alert("Erreur lors de la génération des paiements");
    } finally {
      setGenerating(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      payment.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.merchant?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.merchant?.business_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      filterStatus === "all" || payment.status === filterStatus;

    // Period filter
    let matchesPeriod = true;
    if (filterPeriod === "current") {
      matchesPeriod =
        payment.year === currentPeriod.year &&
        payment.month === currentPeriod.month &&
        payment.period_number === currentPeriod.periodNumber;
    } else if (filterPeriod === "previous") {
      // Previous period logic
      const prevPeriod =
        currentPeriod.periodNumber === 1
          ? {
              year: currentPeriod.year,
              month: currentPeriod.month - 1 || 12,
              num: 2,
            }
          : { year: currentPeriod.year, month: currentPeriod.month, num: 1 };
      matchesPeriod =
        payment.year === prevPeriod.year &&
        payment.month === prevPeriod.month &&
        payment.period_number === prevPeriod.num;
    }

    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const pendingTotal = filteredPayments
    .filter((p) => p.status === "pending" || p.status === "approved")
    .reduce((sum, p) => sum + p.amount_due, 0);

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

  const formatPeriod = (payment: MerchantPayment) => {
    const start = new Date(payment.period_start);
    const end = new Date(payment.period_end);
    return `${start.getDate()}-${end.getDate()} ${start.toLocaleDateString("fr-FR", { month: "short" })}`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Wallet className="w-7 h-7" />
              Paiements Marchands
            </h2>
            <p className="text-slate-600 mt-1">
              Période actuelle:{" "}
              {currentPeriod.periodNumber === 1
                ? "1-15"
                : "16-" +
                  new Date(
                    currentPeriod.year,
                    currentPeriod.month,
                    0,
                  ).getDate()}{" "}
              {new Date(
                currentPeriod.year,
                currentPeriod.month - 1,
              ).toLocaleDateString("fr-FR", { month: "long" })}{" "}
              {currentPeriod.year}
            </p>
          </div>
          <button
            onClick={generatePeriodPayments}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
          >
            {generating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Générer Période
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl shadow p-6 mb-8 text-white">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sky-100 text-sm">
                Total à payer cette période
              </p>
              <p className="text-3xl font-bold">
                {pendingTotal.toFixed(2)} TND
              </p>
            </div>
            <div>
              <p className="text-sky-100 text-sm">Paiements en attente</p>
              <p className="text-3xl font-bold">
                {filteredPayments.filter((p) => p.status === "pending").length}
              </p>
            </div>
            <div>
              <p className="text-sky-100 text-sm">Marchands concernés</p>
              <p className="text-3xl font-bold">
                {new Set(filteredPayments.map((p) => p.merchant_id)).size}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par n° paiement ou marchand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Tous statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvé</option>
                <option value="paid">Payé</option>
                <option value="disputed">Contesté</option>
              </select>
            </div>

            {/* Period Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Toutes périodes</option>
                <option value="current">Période actuelle</option>
                <option value="previous">Période précédente</option>
              </select>
            </div>

            {/* Export */}
            <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {filteredPayments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>Aucun paiement trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      N° Paiement
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Marchand
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Période
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">
                      Échanges
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                      À Payer
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm text-slate-900">
                          {payment.payment_number}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {payment.merchant?.business_name ||
                                payment.merchant?.name ||
                                "—"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {payment.merchant?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatPeriod(payment)} {payment.year}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-900">
                        {payment.total_exchanges}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        {payment.amount_due.toFixed(2)} TND
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/admin/merchant-payments/${payment.id}`}
                          className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 text-sm font-medium"
                        >
                          Détails
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <h4 className="font-medium text-blue-900 mb-2">Cycle de Paiement</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • <strong>Période 1:</strong> Du 1er au 15 du mois → Paiement
              entre le 16 et le 20
            </li>
            <li>
              • <strong>Période 2:</strong> Du 16 à la fin du mois → Paiement
              entre le 1er et le 5 du mois suivant
            </li>
            <li>• Frais SWAPP: 9 TND par échange (déduit automatiquement)</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
