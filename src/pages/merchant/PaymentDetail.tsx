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
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import type {
  MerchantPayment,
  MerchantPaymentItem,
  MerchantPaymentStatus,
} from "../../lib/supabase";
import {
  PAYMENT_STATUS_LABELS,
  SWAPP_EXCHANGE_FEE,
  PAYMENT_METHOD_LABELS,
  DEFAULT_PLATFORM_FEE,
  DEFAULT_DELIVERY_FEE,
} from "../../lib/supabase";
import MerchantLayout from "../../components/MerchantLayout";

// Demo data
const DEMO_PAYMENT: MerchantPayment = {
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
  total_delivery_fees: 40,
  amount_due: 133,
  status: "paid",
  paid_at: "2025-12-18T10:30:00Z",
  payment_method: "cash",
  merchant_accepted: false,
  created_at: new Date().toISOString(),
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

export default function PaymentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<MerchantPayment | null>(null);
  const [items, setItems] = useState<MerchantPaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [accepting, setAccepting] = useState(false);
  const [disputing, setDisputing] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, [id]);

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
      // Try to fetch real payment
      const { data: paymentData, error: paymentError } = await supabase
        .from("merchant_payments")
        .select("*")
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

        // Try to fetch items from merchant_payment_items table
        const { data: itemsData, error: itemsError } = await supabase
          .from("merchant_payment_items")
          .select("*")
          .eq("payment_id", id)
          .order("collection_date", { ascending: true });

        if (!itemsError && itemsData && itemsData.length > 0) {
          setItems(itemsData);
        } else {
          // No items in merchant_payment_items, fetch exchanges directly
          // based on the payment period and merchant
          const { data: exchanges } = await supabase
            .from("exchanges")
            .select(
              `
              id,
              exchange_code,
              client_name,
              created_at,
              delivery_verifications!inner(
                payment_collected,
                amount_collected,
                created_at
              )
            `,
            )
            .eq("merchant_id", paymentData.merchant_id)
            .gte("created_at", paymentData.period_start)
            .lte("created_at", paymentData.period_end + "T23:59:59")
            .eq("delivery_verifications.payment_collected", true);

          if (exchanges && exchanges.length > 0) {
            // Convert exchanges to payment items format
            const generatedItems: MerchantPaymentItem[] = exchanges.map(
              (ex: any, index: number) => {
                const verification = ex.delivery_verifications?.[0];
                const amountCollected = verification?.amount_collected || 9;
                return {
                  id: `gen-${index}`,
                  payment_id: id!,
                  exchange_id: ex.id,
                  exchange_code: ex.exchange_code,
                  client_name: ex.client_name,
                  amount_collected: amountCollected,
                  swapp_fee: 9,
                  merchant_amount: Math.max(0, amountCollected - 9),
                  collection_date: verification?.created_at || ex.created_at,
                  created_at: new Date().toISOString(),
                };
              },
            );
            setItems(generatedItems);
          } else {
            // Fallback: generate demo items based on payment totals
            const numExchanges = paymentData.total_exchanges || 0;
            if (numExchanges > 0) {
              const avgAmount = paymentData.total_collected / numExchanges;
              const generatedItems: MerchantPaymentItem[] = [];
              for (let i = 0; i < numExchanges; i++) {
                generatedItems.push({
                  id: `demo-${i}`,
                  payment_id: id!,
                  exchange_id: `ex-${i}`,
                  exchange_code: `EXC-${paymentData.year}-${String(i + 1).padStart(3, "0")}`,
                  client_name: `Client ${i + 1}`,
                  amount_collected: avgAmount,
                  swapp_fee: 9,
                  merchant_amount: Math.max(0, avgAmount - 9),
                  collection_date: paymentData.period_start,
                  created_at: new Date().toISOString(),
                });
              }
              setItems(generatedItems);
            } else {
              setItems([]);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setPayment(DEMO_PAYMENT);
      setItems(DEMO_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: MerchantPaymentStatus) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      paid: "bg-emerald-100 text-emerald-800",
      accepted: "bg-green-100 text-green-800",
      disputed: "bg-red-100 text-red-800",
    };
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="w-4 h-4" />,
      approved: <CheckCircle className="w-4 h-4" />,
      paid: <CheckCircle className="w-4 h-4" />,
      accepted: <CheckCircle className="w-4 h-4" />,
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

  const needsAcceptance =
    payment?.status === "paid" && !payment?.merchant_accepted;

  const handleAccept = async () => {
    if (!payment) return;
    setAccepting(true);
    try {
      const { error } = await supabase
        .from("merchant_payments")
        .update({
          merchant_accepted: true,
          merchant_accepted_at: new Date().toISOString(),
          status: "accepted",
        })
        .eq("id", payment.id);

      if (!error) {
        setPayment({
          ...payment,
          merchant_accepted: true,
          merchant_accepted_at: new Date().toISOString(),
          status: "accepted",
        });
      }
    } finally {
      setAccepting(false);
    }
  };

  const handleDispute = async () => {
    if (!payment || !disputeReason.trim()) return;
    setDisputing(true);
    try {
      const { error } = await supabase
        .from("merchant_payments")
        .update({
          status: "disputed",
          dispute_reason: disputeReason,
        })
        .eq("id", payment.id);

      if (!error) {
        setPayment({
          ...payment,
          status: "disputed",
          dispute_reason: disputeReason,
        });
        setShowDisputeModal(false);
        setDisputeReason("");
      }
    } finally {
      setDisputing(false);
    }
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
      <MerchantLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      </MerchantLayout>
    );
  }

  if (!payment) {
    return (
      <MerchantLayout>
        <div className="text-center py-12">
          <p className="text-slate-600">Paiement non trouvé</p>
          <Link
            to="/merchant/payments"
            className="text-sky-600 hover:underline mt-2 inline-block"
          >
            Retour à la liste
          </Link>
        </div>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/merchant/payments"
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
              {payment.merchant_accepted && (
                <span className="text-xs text-green-600 font-medium">
                  ✓ Accepté par vous
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Accept/Dispute Action Bar */}
        {needsAcceptance && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-medium text-amber-900">Action requise</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Vous avez reçu un paiement de{" "}
                  <strong>{payment.amount_due.toFixed(2)} TND</strong>. Veuillez
                  confirmer la réception ou signaler un problème.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDisputeModal(true)}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Contester
                </button>
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {accepting ? "Confirmation..." : "Accepter le paiement"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dispute Modal */}
        {showDisputeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Contester le paiement
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Veuillez expliquer la raison de votre contestation. Notre équipe
                examinera votre demande.
              </p>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Expliquez le problème rencontré..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={4}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowDisputeModal(false);
                    setDisputeReason("");
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDispute}
                  disabled={!disputeReason.trim() || disputing}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {disputing ? "Envoi..." : "Envoyer la contestation"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Financial Summary */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              Résumé Financier
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Total encaissé clients</span>
                <span className="font-medium text-slate-900">
                  {payment.total_collected.toFixed(2)} TND
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">
                  Frais Plateforme ({DEFAULT_PLATFORM_FEE} TND ×{" "}
                  {payment.total_exchanges})
                </span>
                <span className="font-medium text-red-600">
                  - {payment.total_swapp_fees.toFixed(2)} TND
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">
                  Frais Livraison ({DEFAULT_DELIVERY_FEE} TND ×{" "}
                  {payment.total_exchanges})
                </span>
                <span className="font-medium text-red-600">
                  - {(payment.total_delivery_fees || 0).toFixed(2)} TND
                </span>
              </div>
              <div className="flex justify-between items-center py-3 bg-green-50 -mx-2 px-2 rounded-lg">
                <span className="font-semibold text-green-800">
                  Montant versé
                </span>
                <span className="text-xl font-bold text-green-700">
                  {payment.amount_due.toFixed(2)} TND
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Informations de Paiement
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Nombre d'échanges</span>
                <span className="font-medium text-slate-900">
                  {payment.total_exchanges}
                </span>
              </div>
              {payment.payment_method && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Méthode de paiement</span>
                  <span className="font-medium text-slate-900">
                    {PAYMENT_METHOD_LABELS[payment.payment_method] ||
                      payment.payment_method}
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
                  <span className="text-slate-600">Date de paiement</span>
                  <span className="font-medium text-green-600">
                    {formatDate(payment.paid_at)}
                  </span>
                </div>
              )}
              {payment.status === "pending" && (
                <div className="py-2 text-center text-yellow-700 bg-yellow-50 rounded-lg">
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
              Exporter
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
                      Frais SWAPP
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                      Net
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-sm text-slate-900">
                        {item.exchange_code}
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
      </div>
    </MerchantLayout>
  );
}
