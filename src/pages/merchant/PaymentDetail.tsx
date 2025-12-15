import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Banknote,
  CreditCard,
  FileText,
  Package,
} from "lucide-react";
import { supabase, MerchantPayment, MerchantPaymentItem, SWAPP_EXCHANGE_FEE, PAYMENT_STATUS_LABELS } from "../../lib/supabase";
import MerchantLayout from "../../components/MerchantLayout";

export default function PaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<MerchantPayment | null>(null);
  const [items, setItems] = useState<MerchantPaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPaymentDetails();
    }
  }, [id]);

  const fetchPaymentDetails = async () => {
    try {
      // Fetch payment
      const { data: paymentData, error: paymentError } = await supabase
        .from("merchant_payments")
        .select("*")
        .eq("id", id)
        .single();

      if (paymentError) throw paymentError;
      setPayment(paymentData);

      // Fetch line items
      const { data: itemsData, error: itemsError } = await supabase
        .from("merchant_payment_items")
        .select("*")
        .eq("payment_id", id)
        .order("collection_date", { ascending: false });

      if (itemsError) {
        console.warn("Items table may not exist:", itemsError.message);
      } else {
        setItems(itemsData || []);
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-4 h-4" />
            Payé
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-4 h-4" />
            Approuvé
          </span>
        );
      case "disputed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-4 h-4" />
            Contesté
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
            <Clock className="w-4 h-4" />
            En attente
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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

  if (!payment) {
    return (
      <MerchantLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <FileText className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Paiement non trouvé</h2>
          <button
            onClick={() => navigate("/merchant/payments")}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Retour à l'historique
          </button>
        </div>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/merchant/payments")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Retour aux paiements</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                {payment.payment_number}
              </h1>
              <p className="text-slate-600">
                Période: {formatDate(payment.period_start)} - {formatDate(payment.period_end)}
              </p>
            </div>
            {getStatusBadge(payment.status)}
          </div>

          {/* Payment Info if Paid */}
          {payment.status === "paid" && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-900">
                    Payé le {payment.paid_at ? formatDate(payment.paid_at) : "-"}
                  </p>
                  {payment.payment_method && (
                    <p className="text-sm text-emerald-700">
                      Mode: {payment.payment_method === "bank_transfer" ? "Virement bancaire" :
                             payment.payment_method === "cash" ? "Espèces" :
                             payment.payment_method === "check" ? "Chèque" : payment.payment_method}
                    </p>
                  )}
                  {payment.payment_reference && (
                    <p className="text-sm text-emerald-700">
                      Référence: {payment.payment_reference}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Financial Breakdown */}
          <div className="bg-slate-50 rounded-lg p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Résumé Financier</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total encaissé clients</span>
                <span className="font-medium text-slate-900">{payment.total_collected.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between items-center text-red-600">
                <span>Frais SWAPP ({SWAPP_EXCHANGE_FEE} TND × {payment.total_exchanges})</span>
                <span className="font-medium">- {payment.total_swapp_fees.toFixed(2)} TND</span>
              </div>
              <div className="border-t border-slate-300 pt-3 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Montant versé</span>
                <span className="text-xl font-bold text-emerald-600">{payment.amount_due.toFixed(2)} TND</span>
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Line Items */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Détail des Échanges ({payment.total_exchanges})
            </h2>
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Détails des échanges non disponibles</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Encaissé
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Frais
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Net
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm text-slate-900">{item.exchange_code}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {item.client_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-900">
                        {item.amount_collected.toFixed(2)} TND
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                        -{item.swapp_fee.toFixed(2)} TND
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-emerald-600">
                        {item.merchant_amount.toFixed(2)} TND
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-500">
                        {new Date(item.collection_date).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50">
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-sm font-medium text-slate-900">
                      Total
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">
                      {payment.total_collected.toFixed(2)} TND
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-red-600">
                      -{payment.total_swapp_fees.toFixed(2)} TND
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-emerald-600">
                      {payment.amount_due.toFixed(2)} TND
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Notes */}
        {payment.notes && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-medium text-amber-900 mb-1">Notes</p>
            <p className="text-sm text-amber-700">{payment.notes}</p>
          </div>
        )}
      </div>
    </MerchantLayout>
  );
}
