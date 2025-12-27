import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  FileText,
  Download,
  Printer,
  AlertTriangle,
  MapPin,
  Phone,
  User,
  Calendar,
  Camera,
  Check,
  X,
} from "lucide-react";
import { supabase, STATUS_LABELS } from "../../lib/supabase";

// Timeline step type
type TimelineStep = {
  id: string;
  label: string;
  description: string;
  status: "completed" | "current" | "pending" | "error";
  date?: string;
};

// Return product status labels
const RETURN_STATUS_LABELS: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  pending: { label: "En attente", color: "yellow", icon: Clock },
  accepted: { label: "Accepte", color: "green", icon: CheckCircle },
  rejected: { label: "Refuse", color: "red", icon: XCircle },
  problem: { label: "Probleme signale", color: "orange", icon: AlertTriangle },
};

export default function ClientExchangeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exchange, setExchange] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [deliveryPerson, setDeliveryPerson] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "timeline" | "messages" | "manifeste"
  >("timeline");

  useEffect(() => {
    fetchExchangeDetails();
  }, [id]);

  const fetchExchangeDetails = async () => {
    try {
      const { data: exchangeData } = await supabase
        .from("exchanges")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (exchangeData) {
        setExchange(exchangeData);

        // Fetch delivery person if assigned
        if (exchangeData.delivery_person_id) {
          const { data: dpData } = await supabase
            .from("delivery_persons")
            .select("id, name, phone")
            .eq("id", exchangeData.delivery_person_id)
            .maybeSingle();
          setDeliveryPerson(dpData);
        }

        const { data: messagesData } = await supabase
          .from("messages")
          .select("*")
          .eq("exchange_id", id)
          .order("created_at", { ascending: true });

        setMessages(messagesData || []);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await supabase.from("messages").insert({
        exchange_id: id,
        sender_type: "client",
        message: newMessage,
      });

      setNewMessage("");
      fetchExchangeDetails();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Generate timeline steps based on exchange status
  const getTimelineSteps = (): TimelineStep[] => {
    if (!exchange) return [];

    const statusOrder = [
      "pending",
      "validated",
      "ready_for_pickup",
      "in_transit",
      "completed",
    ];
    const currentIndex = statusOrder.indexOf(exchange.status);

    const steps: TimelineStep[] = [
      {
        id: "submitted",
        label: "Demande soumise",
        description: "Votre demande d'echange a ete envoyee",
        status: "completed",
        date: exchange.created_at,
      },
      {
        id: "validated",
        label: "Validee par le marchand",
        description:
          exchange.status === "rejected"
            ? "Votre demande a ete refusee"
            : "Le marchand a accepte votre echange",
        status:
          exchange.status === "rejected"
            ? "error"
            : currentIndex >= 1
              ? "completed"
              : currentIndex === 0
                ? "current"
                : "pending",
        date: currentIndex >= 1 ? exchange.validated_at : undefined,
      },
      {
        id: "pickup",
        label: "Ramassage programme",
        description: exchange.pickup_scheduled_date
          ? `Prevu le ${new Date(exchange.pickup_scheduled_date).toLocaleDateString("fr-FR")}`
          : "En attente de programmation",
        status:
          currentIndex >= 2
            ? "completed"
            : currentIndex === 1
              ? "current"
              : "pending",
        date: exchange.pickup_scheduled_date,
      },
      {
        id: "in_transit",
        label: "Livreur en route",
        description: deliveryPerson
          ? `${deliveryPerson.name} est en chemin`
          : "Le livreur arrive bientot",
        status:
          currentIndex >= 3
            ? "completed"
            : currentIndex === 2
              ? "current"
              : "pending",
      },
      {
        id: "completed",
        label: "Echange effectue",
        description: "Votre echange est termine",
        status:
          exchange.status === "completed"
            ? "completed"
            : currentIndex === 3
              ? "current"
              : "pending",
        date: exchange.completed_at,
      },
    ];

    return steps;
  };

  // Print manifeste
  const printManifeste = () => {
    const returnStatus =
      RETURN_STATUS_LABELS[exchange.return_product_status || "pending"];

    const printWindow = window.open("", "", "height=800,width=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Manifeste d'Echange - ${exchange.exchange_code}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
            .logo { font-size: 28px; font-weight: bold; letter-spacing: 3px; }
            .doc-title { font-size: 18px; margin-top: 10px; text-transform: uppercase; }
            .code { font-family: monospace; font-size: 20px; margin-top: 10px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; font-size: 14px; text-transform: uppercase; background: #f0f0f0; padding: 8px; margin-bottom: 10px; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { color: #666; }
            .value { font-weight: 500; }
            .status-box { text-align: center; padding: 20px; border: 3px solid; margin: 20px 0; }
            .status-box.accepted { border-color: #22c55e; background: #f0fdf4; }
            .status-box.rejected { border-color: #ef4444; background: #fef2f2; }
            .status-box.pending { border-color: #eab308; background: #fefce8; }
            .status-box.problem { border-color: #f97316; background: #fff7ed; }
            .status-label { font-size: 24px; font-weight: bold; text-transform: uppercase; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #000; text-align: center; font-size: 12px; color: #666; }
            .qr-placeholder { width: 100px; height: 100px; border: 2px solid #000; margin: 20px auto; display: flex; align-items: center; justify-content: center; }
            .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
            .signature-box { width: 45%; text-align: center; }
            .signature-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 5px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SWAPP</div>
            <div class="doc-title">Manifeste d'Echange</div>
            <div class="code">${exchange.exchange_code}</div>
          </div>

          <div class="section">
            <div class="section-title">Informations Client</div>
            <div class="row"><span class="label">Nom</span><span class="value">${exchange.client_name}</span></div>
            <div class="row"><span class="label">Telephone</span><span class="value">${exchange.client_phone}</span></div>
            <div class="row"><span class="label">Adresse</span><span class="value">${exchange.client_address || "Non fournie"}</span></div>
            <div class="row"><span class="label">Ville</span><span class="value">${exchange.client_city || ""}</span></div>
          </div>

          <div class="section">
            <div class="section-title">Details de l'Echange</div>
            <div class="row"><span class="label">Produit</span><span class="value">${exchange.product_name || "Non specifie"}</span></div>
            <div class="row"><span class="label">Raison</span><span class="value">${exchange.reason}</span></div>
            <div class="row"><span class="label">Date de demande</span><span class="value">${new Date(exchange.created_at).toLocaleDateString("fr-FR")}</span></div>
          </div>

          <div class="section">
            <div class="section-title">Statut du Produit Retourne</div>
            <div class="status-box ${exchange.return_product_status || "pending"}">
              <div class="status-label">${returnStatus.label}</div>
              ${exchange.return_product_notes ? `<p style="margin-top: 10px; font-size: 14px;">${exchange.return_product_notes}</p>` : ""}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Paiement</div>
            <div class="row"><span class="label">Montant</span><span class="value">${exchange.payment_amount > 0 ? exchange.payment_amount + " TND" : "GRATUIT"}</span></div>
            <div class="row"><span class="label">Statut</span><span class="value">${exchange.payment_status === "collected" ? "Encaisse" : exchange.payment_status === "free" ? "Gratuit" : "En attente"}</span></div>
          </div>

          ${
            deliveryPerson
              ? `
          <div class="section">
            <div class="section-title">Livreur</div>
            <div class="row"><span class="label">Nom</span><span class="value">${deliveryPerson.name}</span></div>
            <div class="row"><span class="label">Telephone</span><span class="value">${deliveryPerson.phone}</span></div>
          </div>
          `
              : ""
          }

          <div class="signatures">
            <div class="signature-box">
              <div class="signature-line">Signature Client</div>
            </div>
            <div class="signature-box">
              <div class="signature-line">Signature Livreur</div>
            </div>
          </div>

          <div class="footer">
            <p>SWAPP - Plateforme d'echange</p>
            <p>Genere le ${new Date().toLocaleDateString("fr-FR")} a ${new Date().toLocaleTimeString("fr-FR")}</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!exchange) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Echange non trouve
          </h2>
          <button
            onClick={() => navigate("/client/exchanges")}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Retour aux echanges
          </button>
        </div>
      </div>
    );
  }

  const timelineSteps = getTimelineSteps();
  const returnStatus =
    RETURN_STATUS_LABELS[exchange.return_product_status || "pending"];
  const ReturnIcon = returnStatus.icon;
  const showManifeste =
    ["completed", "delivery_verified", "returned"].includes(exchange.status) ||
    exchange.return_product_status;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/client/exchanges")}
            className="flex items-center text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
          <div className="text-right">
            <p className="text-sm text-slate-500">Code d'echange</p>
            <p className="font-mono font-bold text-lg text-slate-900">
              {exchange.exchange_code}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  exchange.status === "completed"
                    ? "bg-emerald-100"
                    : exchange.status === "rejected"
                      ? "bg-red-100"
                      : "bg-amber-100"
                }`}
              >
                {exchange.status === "completed" ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                ) : exchange.status === "rejected" ? (
                  <XCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <Clock className="w-6 h-6 text-amber-600" />
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {STATUS_LABELS[exchange.status]}
                </p>
                <p className="text-sm text-slate-500">
                  Mis a jour le{" "}
                  {new Date(
                    exchange.updated_at || exchange.created_at,
                  ).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                exchange.status === "completed"
                  ? "bg-emerald-100 text-emerald-700"
                  : exchange.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {STATUS_LABELS[exchange.status]}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === "timeline"
                ? "bg-white shadow-sm text-emerald-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Suivi
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === "messages"
                ? "bg-white shadow-sm text-emerald-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Send className="w-4 h-4 inline mr-2" />
            Messages
            {messages.length > 0 && (
              <span className="ml-2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs">
                {messages.length}
              </span>
            )}
          </button>
          {showManifeste && (
            <button
              onClick={() => setActiveTab("manifeste")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                activeTab === "manifeste"
                  ? "bg-white shadow-sm text-emerald-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Manifeste
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <>
              {/* Timeline */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6">
                  Progression de votre echange
                </h2>
                <div className="relative">
                  {timelineSteps.map((step, index) => (
                    <div key={step.id} className="flex gap-4 pb-8 last:pb-0">
                      {/* Line */}
                      {index < timelineSteps.length - 1 && (
                        <div
                          className={`absolute left-5 top-10 w-0.5 h-16 ${
                            step.status === "completed"
                              ? "bg-emerald-500"
                              : step.status === "error"
                                ? "bg-red-500"
                                : "bg-slate-200"
                          }`}
                          style={{ marginTop: `${index * 88}px` }}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.status === "completed"
                            ? "bg-emerald-500 text-white"
                            : step.status === "current"
                              ? "bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50"
                              : step.status === "error"
                                ? "bg-red-500 text-white"
                                : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {step.status === "completed" ? (
                          <Check className="w-5 h-5" />
                        ) : step.status === "error" ? (
                          <X className="w-5 h-5" />
                        ) : step.status === "current" ? (
                          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                        ) : (
                          <div className="w-3 h-3 bg-slate-300 rounded-full" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <h3
                          className={`font-semibold ${
                            step.status === "completed" ||
                            step.status === "current"
                              ? "text-slate-900"
                              : step.status === "error"
                                ? "text-red-600"
                                : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {step.description}
                        </p>
                        {step.date && (
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(step.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Cards Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Pickup Status Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Ramassage</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Date prevue
                      </span>
                      <span className="font-medium text-slate-900">
                        {exchange.pickup_scheduled_date
                          ? new Date(
                              exchange.pickup_scheduled_date,
                            ).toLocaleDateString("fr-FR")
                          : "A programmer"}
                      </span>
                    </div>

                    {deliveryPerson && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">
                            Livreur
                          </span>
                          <span className="font-medium text-slate-900">
                            {deliveryPerson.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">
                            Contact
                          </span>
                          <a
                            href={`tel:${deliveryPerson.phone}`}
                            className="font-medium text-blue-600"
                          >
                            {deliveryPerson.phone}
                          </a>
                        </div>
                      </>
                    )}

                    <div className="pt-2 border-t border-slate-100">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                          exchange.status === "in_transit" ||
                          exchange.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {exchange.status === "in_transit" ||
                        exchange.status === "completed" ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Ramassage effectue
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4" />
                            En attente
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Status Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Paiement</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Montant</span>
                      <span
                        className={`font-bold text-lg ${
                          exchange.payment_amount > 0
                            ? "text-slate-900"
                            : "text-emerald-600"
                        }`}
                      >
                        {exchange.payment_amount > 0
                          ? `${exchange.payment_amount} TND`
                          : "GRATUIT"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Type</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          exchange.payment_status === "free"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {exchange.payment_status === "free"
                          ? "Echange gratuit"
                          : "Avec supplement"}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                          exchange.payment_status === "collected"
                            ? "bg-emerald-100 text-emerald-700"
                            : exchange.payment_status === "free"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {exchange.payment_status === "collected" ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Paiement encaisse
                          </>
                        ) : exchange.payment_status === "free" ? (
                          <>
                            <Check className="w-4 h-4" />
                            Aucun paiement requis
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4" />A payer a la livraison
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Product Status (if exchange happened) */}
              {(exchange.return_product_status ||
                exchange.status === "completed") && (
                <div
                  className={`bg-white rounded-2xl shadow-sm border-2 p-5 ${
                    exchange.return_product_status === "accepted"
                      ? "border-emerald-200"
                      : exchange.return_product_status === "rejected"
                        ? "border-red-200"
                        : exchange.return_product_status === "problem"
                          ? "border-orange-200"
                          : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        exchange.return_product_status === "accepted"
                          ? "bg-emerald-100"
                          : exchange.return_product_status === "rejected"
                            ? "bg-red-100"
                            : exchange.return_product_status === "problem"
                              ? "bg-orange-100"
                              : "bg-amber-100"
                      }`}
                    >
                      <ReturnIcon
                        className={`w-5 h-5 ${
                          exchange.return_product_status === "accepted"
                            ? "text-emerald-600"
                            : exchange.return_product_status === "rejected"
                              ? "text-red-600"
                              : exchange.return_product_status === "problem"
                                ? "text-orange-600"
                                : "text-amber-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Produit retourne
                      </h3>
                      <p className="text-sm text-slate-500">
                        Statut de verification par le livreur
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl ${
                      exchange.return_product_status === "accepted"
                        ? "bg-emerald-50"
                        : exchange.return_product_status === "rejected"
                          ? "bg-red-50"
                          : exchange.return_product_status === "problem"
                            ? "bg-orange-50"
                            : "bg-amber-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ReturnIcon
                        className={`w-8 h-8 ${
                          exchange.return_product_status === "accepted"
                            ? "text-emerald-600"
                            : exchange.return_product_status === "rejected"
                              ? "text-red-600"
                              : exchange.return_product_status === "problem"
                                ? "text-orange-600"
                                : "text-amber-600"
                        }`}
                      />
                      <div>
                        <p
                          className={`font-bold text-lg ${
                            exchange.return_product_status === "accepted"
                              ? "text-emerald-700"
                              : exchange.return_product_status === "rejected"
                                ? "text-red-700"
                                : exchange.return_product_status === "problem"
                                  ? "text-orange-700"
                                  : "text-amber-700"
                          }`}
                        >
                          {returnStatus.label}
                        </p>
                        {exchange.return_product_notes && (
                          <p className="text-sm text-slate-600 mt-1">
                            {exchange.return_product_notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Return photos if any */}
                  {exchange.return_product_photos &&
                    exchange.return_product_photos.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          Photos du produit retourne
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {exchange.return_product_photos.map(
                            (photo: string, index: number) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                className="w-full aspect-square object-cover rounded-lg border border-slate-200"
                                onClick={() => window.open(photo, "_blank")}
                              />
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Messages avec le marchand
              </h2>

              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Send className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">
                      Aucun message pour le moment
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Envoyez un message pour communiquer avec le marchand
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-xl max-w-[80%] ${
                        msg.sender_type === "client"
                          ? "bg-emerald-500 text-white ml-auto"
                          : "bg-slate-100 text-slate-900 mr-auto"
                      }`}
                    >
                      <p className="text-sm font-medium mb-1 opacity-80">
                        {msg.sender_type === "client" ? "Vous" : "Marchand"}
                      </p>
                      <p>{msg.message}</p>
                      <p
                        className={`text-xs mt-2 ${
                          msg.sender_type === "client"
                            ? "text-emerald-100"
                            : "text-slate-500"
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleString("fr-FR")}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Votre message..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* Manifeste Tab */}
          {activeTab === "manifeste" && showManifeste && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Manifeste d'Echange
                  </h2>
                  <p className="text-sm text-slate-500">
                    Recu officiel de votre echange
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={printManifeste}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimer
                  </button>
                  <button
                    onClick={printManifeste}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Telecharger
                  </button>
                </div>
              </div>

              {/* Manifeste Preview */}
              <div className="border-2 border-slate-200 rounded-xl p-6 bg-slate-50">
                {/* Header */}
                <div className="text-center border-b-2 border-slate-300 pb-4 mb-6">
                  <h3 className="text-2xl font-bold tracking-wider">SWAPP</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    MANIFESTE D'ECHANGE
                  </p>
                  <p className="font-mono text-lg font-bold mt-2">
                    {exchange.exchange_code}
                  </p>
                </div>

                {/* Client Info */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">
                    Informations Client
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">
                        {exchange.client_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">
                        {exchange.client_phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">
                        {exchange.client_address || "Adresse non fournie"},{" "}
                        {exchange.client_city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Exchange Details */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">
                    Details de l'Echange
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Produit</p>
                      <p className="font-medium text-slate-900">
                        {exchange.product_name || "Non specifie"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Raison</p>
                      <p className="font-medium text-slate-900">
                        {exchange.reason}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Date de demande</p>
                      <p className="font-medium text-slate-900">
                        {new Date(exchange.created_at).toLocaleDateString(
                          "fr-FR",
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Date d'echange</p>
                      <p className="font-medium text-slate-900">
                        {exchange.completed_at
                          ? new Date(exchange.completed_at).toLocaleDateString(
                              "fr-FR",
                            )
                          : "En cours"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Return Status */}
                <div
                  className={`p-4 rounded-xl mb-6 ${
                    exchange.return_product_status === "accepted"
                      ? "bg-emerald-100 border-2 border-emerald-300"
                      : exchange.return_product_status === "rejected"
                        ? "bg-red-100 border-2 border-red-300"
                        : exchange.return_product_status === "problem"
                          ? "bg-orange-100 border-2 border-orange-300"
                          : "bg-amber-100 border-2 border-amber-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-600">
                        Statut du produit retourne
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          exchange.return_product_status === "accepted"
                            ? "text-emerald-700"
                            : exchange.return_product_status === "rejected"
                              ? "text-red-700"
                              : exchange.return_product_status === "problem"
                                ? "text-orange-700"
                                : "text-amber-700"
                        }`}
                      >
                        {returnStatus.label.toUpperCase()}
                      </p>
                    </div>
                    <ReturnIcon
                      className={`w-10 h-10 ${
                        exchange.return_product_status === "accepted"
                          ? "text-emerald-600"
                          : exchange.return_product_status === "rejected"
                            ? "text-red-600"
                            : exchange.return_product_status === "problem"
                              ? "text-orange-600"
                              : "text-amber-600"
                      }`}
                    />
                  </div>
                  {exchange.return_product_notes && (
                    <p className="text-sm text-slate-600 mt-2 border-t border-slate-300 pt-2">
                      Note: {exchange.return_product_notes}
                    </p>
                  )}
                </div>

                {/* Payment */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Montant</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {exchange.payment_amount > 0
                          ? `${exchange.payment_amount} TND`
                          : "GRATUIT"}
                      </p>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        exchange.payment_status === "collected"
                          ? "bg-emerald-100 text-emerald-700"
                          : exchange.payment_status === "free"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {exchange.payment_status === "collected"
                        ? "ENCAISSE"
                        : exchange.payment_status === "free"
                          ? "GRATUIT"
                          : "EN ATTENTE"}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-slate-500 border-t border-slate-200 pt-4">
                  <p>SWAPP - Plateforme d'echange</p>
                  <p>
                    Document genere le {new Date().toLocaleDateString("fr-FR")}{" "}
                    a {new Date().toLocaleTimeString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
