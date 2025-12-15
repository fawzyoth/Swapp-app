import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Banknote,
  Store,
  FileText,
  Package,
  Printer,
  CreditCard,
} from "lucide-react";
import { supabase, MerchantPayment, MerchantPaymentItem, SWAPP_EXCHANGE_FEE } from "../../lib/supabase";
import AdminLayout from "../../components/AdminLayout";

export default function MerchantPaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<MerchantPayment & { merchant_name?: string; merchant_email?: string } | null>(null);
  const [items, setItems] = useState<MerchantPaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Payment form
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [paymentReference, setPaymentReference] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (id) {
      fetchPaymentDetails();
    }
  }, [id]);

  const fetchPaymentDetails = async () => {
    try {
      // Fetch payment with merchant info
      const { data: paymentData, error: paymentError } = await supabase
        .from("merchant_payments")
        .select("*, merchants(name, email)")
        .eq("id", id)
        .single();

      if (paymentError) throw paymentError;

      setPayment({
        ...paymentData,
        merchant_name: paymentData.merchants?.name || "Marchand",
        merchant_email: paymentData.merchants?.email,
      });

      // Fetch line items
      const { data: itemsData, error: itemsError } = await supabase
        .from("merchant_payment_items")
        .select("*")
        .eq("payment_id", id)
        .order("collection_date", { ascending: false });

      if (!itemsError) {
        setItems(itemsData || []);
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm("Approuver ce paiement ?")) return;

    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("merchant_payments")
        .update({
          status: "approved",
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      fetchPaymentDetails();
    } catch (error) {
      console.error("Error approving payment:", error);
      alert("Erreur lors de l'approbation");
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!paymentReference.trim()) {
      alert("Veuillez entrer une référence de paiement");
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("merchant_payments")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          payment_method: paymentMethod,
          payment_reference: paymentReference,
          notes: notes || null,
        })
        .eq("id", id);

      if (error) throw error;

      setShowPayModal(false);
      fetchPaymentDetails();
    } catch (error) {
      console.error("Error marking as paid:", error);
      alert("Erreur lors du marquage comme payé");
    } finally {
      setProcessing(false);
    }
  };

  const handleDispute = async () => {
    const reason = prompt("Raison de la contestation:");
    if (!reason) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("merchant_payments")
        .update({
          status: "disputed",
          notes: reason,
        })
        .eq("id", id);

      if (error) throw error;

      fetchPaymentDetails();
    } catch (error) {
      console.error("Error disputing payment:", error);
      alert("Erreur lors de la contestation");
    } finally {
      setProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!payment) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <FileText className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Paiement non trouvé</h2>
          <button
            onClick={() => navigate("/admin/merchant-payments")}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Retour à la liste
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto print:max-w-none">
        {/* Back Button - hide on print */}
        <button
          onClick={() => navigate("/admin/merchant-payments")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6 print:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Retour aux paiements</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 print:shadow-none print:border-0">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                {payment.payment_number}
              </h1>
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <Store className="w-4 h-4" />
                <span>{payment.merchant_name}</span>
                {payment.merchant_email && (
                  <span className="text-slate-400">({payment.merchant_email})</span>
                )}
              </div>
              <p className="text-slate-500">
                Période: {formatDate(payment.period_start)} - {formatDate(payment.period_end)}
              </p>
            </div>
            <div className="flex items-center gap-3 print:hidden">
              {getStatusBadge(payment.status)}
              <button
                onClick={handlePrint}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Imprimer"
              >
                <Printer className="w-5 h-5" />
              </button>
            </div>
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
                <span className="font-semibold text-slate-900">Montant à verser</span>
                <span className="text-xl font-bold text-emerald-600">{payment.amount_due.toFixed(2)} TND</span>
              </div>
            </div>
          </div>

          {/* Action Buttons - hide on print */}
          {payment.status !== "paid" && (
            <div className="flex gap-3 mt-6 print:hidden">
              {payment.status === "pending" && (
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approuver
                </button>
              )}
              {(payment.status === "pending" || payment.status === "approved") && (
                <button
                  onClick={() => setShowPayModal(true)}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
                >
                  <Banknote className="w-5 h-5" />
                  Marquer Payé
                </button>
              )}
              {payment.status !== "disputed" && (
                <button
                  onClick={handleDispute}
                  disabled={processing}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                >
                  <AlertCircle className="w-5 h-5" />
                  Contester
                </button>
              )}
            </div>
          )}
        </div>

        {/* Exchange Line Items */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border print:border-slate-300">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Client
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                      Encaissé
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                      Frais
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                      Net
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item) => (
                    <tr key={item.id}>
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

        {/* Pay Modal */}
        {showPayModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:hidden">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Banknote className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Marquer comme Payé</h3>
                    <p className="text-slate-600 text-sm">
                      Montant: {payment.amount_due.toFixed(2)} TND
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Mode de paiement
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("bank_transfer")}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${
                          paymentMethod === "bank_transfer"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span className="text-xs">Virement</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cash")}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${
                          paymentMethod === "cash"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <Banknote className="w-5 h-5" />
                        <span className="text-xs">Espèces</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("check")}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${
                          paymentMethod === "check"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                        <span className="text-xs">Chèque</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Référence de paiement *
                    </label>
                    <input
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="Ex: VIR-2025-1218-001"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes (optionnel)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder="Notes additionnelles..."
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowPayModal(false)}
                    disabled={processing}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleMarkAsPaid}
                    disabled={processing || !paymentReference.trim()}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
                  >
                    {processing ? "Traitement..." : "Confirmer le paiement"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
