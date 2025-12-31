import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Banknote,
  Receipt,
  Download,
  Building2,
  Phone,
  Mail,
  Check,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import type {
  MerchantPayment,
  MerchantPaymentItem,
  MerchantPaymentStatus,
  Merchant,
} from "../../lib/supabase";
import {
  PAYMENT_STATUS_LABELS,
  SWAPP_EXCHANGE_FEE,
  PAYMENT_METHOD_LABELS,
} from "../../lib/supabase";
import AdminLayout from "../../components/AdminLayout";

type PaymentWithMerchant = MerchantPayment & {
  merchant?: Merchant;
};

// Demo data
const DEMO_PAYMENT: PaymentWithMerchant = {
  id: "1",
  merchant_id: "m1",
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
  merchant: {
    id: "m1",
    email: "techstore@example.com",
    name: "TechStore",
    phone: "+216 98 123 456",
    business_name: "TechStore Tunisie",
    business_address: "12 Rue de la Liberté",
    business_city: "Tunis",
    created_at: "",
  },
};

const DEMO_ITEMS: MerchantPaymentItem[] = [
  {
    id: "1",
    payment_id: "1",
    exchange_id: "e1",
    exchange_code: "EXC-2025-001",
    client_name: "Ahmed Benali",
    amount_collected: 35,
    swapp_fee: 9,
    merchant_amount: 26,
    collection_date: "2025-12-02T14:30:00Z",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    payment_id: "1",
    exchange_id: "e2",
    exchange_code: "EXC-2025-002",
    client_name: "Sami Khalil",
    amount_collected: 25,
    swapp_fee: 9,
    merchant_amount: 16,
    collection_date: "2025-12-03T10:15:00Z",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    payment_id: "1",
    exchange_id: "e3",
    exchange_code: "EXC-2025-003",
    client_name: "Leila Mansouri",
    amount_collected: 9,
    swapp_fee: 9,
    merchant_amount: 0,
    collection_date: "2025-12-04T16:45:00Z",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    payment_id: "1",
    exchange_id: "e4",
    exchange_code: "EXC-2025-004",
    client_name: "Karim Jebali",
    amount_collected: 45,
    swapp_fee: 9,
    merchant_amount: 36,
    collection_date: "2025-12-05T11:00:00Z",
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    payment_id: "1",
    exchange_id: "e5",
    exchange_code: "EXC-2025-005",
    client_name: "Fatma Trabelsi",
    amount_collected: 30,
    swapp_fee: 9,
    merchant_amount: 21,
    collection_date: "2025-12-06T09:30:00Z",
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    payment_id: "1",
    exchange_id: "e6",
    exchange_code: "EXC-2025-006",
    client_name: "Youssef Hamdi",
    amount_collected: 50,
    swapp_fee: 9,
    merchant_amount: 41,
    collection_date: "2025-12-08T15:20:00Z",
    created_at: new Date().toISOString(),
  },
  {
    id: "7",
    payment_id: "1",
    exchange_id: "e7",
    exchange_code: "EXC-2025-007",
    client_name: "Nadia Bouazizi",
    amount_collected: 20,
    swapp_fee: 9,
    merchant_amount: 11,
    collection_date: "2025-12-10T13:45:00Z",
    created_at: new Date().toISOString(),
  },
  {
    id: "8",
    payment_id: "1",
    exchange_id: "e8",
    exchange_code: "EXC-2025-008",
    client_name: "Mohamed Sassi",
    amount_collected: 31,
    swapp_fee: 9,
    merchant_amount: 22,
    collection_date: "2025-12-12T08:00:00Z",
    created_at: new Date().toISOString(),
  },
];

export default function MerchantPaymentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<PaymentWithMerchant | null>(null);
  const [items, setItems] = useState<MerchantPaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [paymentReference, setPaymentReference] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const { data: paymentData, error: paymentError } = await supabase
        .from("merchant_payments")
        .select(
          `
          *,
          merchant:merchants(*)
        `,
        )
        .eq("id", id)
        .single();

      if (paymentError) {
        console.log(
          "Using demo data - merchant_payments table not created yet",
        );
        setPayment(DEMO_PAYMENT);
        setItems(DEMO_ITEMS);
      } else {
        setPayment(paymentData);

        // Fetch items
        const { data: itemsData } = await supabase
          .from("merchant_payment_items")
          .select("*")
          .eq("payment_id", id)
          .order("collection_date", { ascending: true });

        setItems(itemsData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setPayment(DEMO_PAYMENT);
      setItems(DEMO_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!payment) return;
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("merchant_payments")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      if (error) {
        // Demo mode
        setPayment({
          ...payment,
          status: "approved",
          approved_at: new Date().toISOString(),
        });
      } else {
        await fetchData();
      }
    } catch (error) {
      console.error("Error approving payment:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!payment || !paymentReference) return;
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("merchant_payments")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          payment_method: paymentMethod,
          payment_reference: paymentReference,
        })
        .eq("id", payment.id);

      if (error) {
        // Demo mode
        setPayment({
          ...payment,
          status: "paid",
          paid_at: new Date().toISOString(),
          payment_method: paymentMethod,
          payment_reference: paymentReference,
        });
      } else {
        await fetchData();
      }
      setShowPaymentModal(false);
    } catch (error) {
      console.error("Error marking as paid:", error);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: MerchantPaymentStatus) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      disputed: "bg-red-100 text-red-800",
    };
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="w-4 h-4" />,
      approved: <CheckCircle className="w-4 h-4" />,
      paid: <CheckCircle className="w-4 h-4" />,
      disputed: <AlertCircle className="w-4 h-4" />,
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${styles[status]}`}
      >
        {icons[status]}
        {PAYMENT_STATUS_LABELS[status]}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPeriod = (payment: MerchantPayment) => {
    const start = new Date(payment.period_start);
    const end = new Date(payment.period_end);
    const monthName = start.toLocaleDateString("fr-FR", { month: "long" });
    return `${start.getDate()} - ${end.getDate()} ${monthName} ${payment.year}`;
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

  if (!payment) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-slate-600">Paiement non trouvé</p>
          <Link
            to="/admin/merchant-payments"
            className="text-sky-600 hover:underline mt-2 inline-block"
          >
            Retour à la liste
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/admin/merchant-payments"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux paiements
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <FileText className="w-7 h-7" />
                {payment.payment_number}
              </h2>
              <p className="text-slate-600 mt-1">
                Période: {formatPeriod(payment)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(payment.status)}
              {payment.status === "pending" && (
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  Approuver
                </button>
              )}
              {(payment.status === "pending" ||
                payment.status === "approved") && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={processing}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Banknote className="w-4 h-4" />
                  Marquer Payé
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Merchant Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Marchand
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-slate-900 text-lg">
                  {payment.merchant?.business_name || payment.merchant?.name}
                </p>
                <p className="text-slate-500 text-sm">
                  {payment.merchant?.name}
                </p>
              </div>
              {payment.merchant?.email && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{payment.merchant.email}</span>
                </div>
              )}
              {payment.merchant?.phone && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{payment.merchant.phone}</span>
                </div>
              )}
              {payment.merchant?.business_address && (
                <p className="text-sm text-slate-500">
                  {payment.merchant.business_address}
                  {payment.merchant.business_city &&
                    `, ${payment.merchant.business_city}`}
                </p>
              )}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              Résumé Financier
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Total encaissé</span>
                <span className="font-medium text-slate-900">
                  {payment.total_collected.toFixed(2)} TND
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">
                  Frais SWAPP ({SWAPP_EXCHANGE_FEE} × {payment.total_exchanges})
                </span>
                <span className="font-medium text-red-600">
                  - {payment.total_swapp_fees.toFixed(2)} TND
                </span>
              </div>
              <div className="flex justify-between items-center py-3 bg-green-50 -mx-2 px-2 rounded-lg">
                <span className="font-semibold text-green-800">À verser</span>
                <span className="text-xl font-bold text-green-700">
                  {payment.amount_due.toFixed(2)} TND
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Paiement
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Échanges</span>
                <span className="font-medium text-slate-900">
                  {payment.total_exchanges}
                </span>
              </div>
              {payment.payment_method && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Méthode</span>
                  <span className="font-medium text-slate-900">
                    {PAYMENT_METHOD_LABELS[payment.payment_method]}
                  </span>
                </div>
              )}
              {payment.payment_reference && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Référence</span>
                  <span className="font-mono text-sm text-slate-900">
                    {payment.payment_reference}
                  </span>
                </div>
              )}
              {payment.paid_at && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Payé le</span>
                  <span className="font-medium text-green-600">
                    {formatDate(payment.paid_at)}
                  </span>
                </div>
              )}
              {payment.status === "pending" && (
                <div className="py-3 text-center text-yellow-700 bg-yellow-50 rounded-lg">
                  <Clock className="w-4 h-4 inline mr-2" />
                  En attente de traitement
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Exchange Items Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Détail des Échanges ({items.length})
            </h3>
            <button className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1">
              <Download className="w-4 h-4" />
              Exporter PDF
            </button>
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Aucun détail disponible
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Code Échange
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                      Encaissé
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                      Frais
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                      Net Marchand
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/exchanges/${item.exchange_id}`}
                          className="font-mono text-sm text-sky-600 hover:underline"
                        >
                          {item.exchange_code}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.client_name}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-sm">
                        {formatDateTime(item.collection_date)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">
                        {item.amount_collected.toFixed(2)} TND
                      </td>
                      <td className="px-4 py-3 text-right text-red-600">
                        -{item.swapp_fee.toFixed(2)} TND
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-green-700">
                        {item.merchant_amount.toFixed(2)} TND
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-3 font-semibold text-slate-900"
                    >
                      Total
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                      {payment.total_collected.toFixed(2)} TND
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">
                      -{payment.total_swapp_fees.toFixed(2)} TND
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-700">
                      {payment.amount_due.toFixed(2)} TND
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Notes */}
        {payment.notes && (
          <div className="mt-6 bg-slate-50 rounded-xl p-4">
            <h4 className="font-medium text-slate-900 mb-2">Notes</h4>
            <p className="text-slate-600">{payment.notes}</p>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Marquer comme Payé
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Méthode de paiement
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="bank_transfer">Virement Bancaire</option>
                    <option value="check">Chèque</option>
                    <option value="cash">Espèces</option>
                    <option value="mobile">Paiement Mobile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Référence de paiement *
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Ex: VIR-2025-1218-001"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Montant: {payment.amount_due.toFixed(2)} TND
                  </p>
                  <p className="text-green-700 text-sm">
                    À verser à{" "}
                    {payment.merchant?.business_name || payment.merchant?.name}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleMarkAsPaid}
                  disabled={!paymentReference || processing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Confirmer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
