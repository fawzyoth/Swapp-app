import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Send,
  Printer,
  MapPin,
  Phone,
  User,
  Package,
  Clock,
  DollarSign,
  Info,
  TrendingUp,
  Home,
  AlertTriangle,
  Check,
  Truck,
  Calendar,
  AlertCircleIcon,
  Video,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { supabase, STATUS_LABELS } from "../../lib/supabase";
import MerchantLayout from "../../components/MerchantLayout";

export default function MerchantExchangeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exchange, setExchange] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [clientHistory, setClientHistory] = useState<any[]>([]);
  const [deliveryAttempts, setDeliveryAttempts] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState("");
  const [selectedDepot, setSelectedDepot] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("0");
  const [paymentType, setPaymentType] = useState<"free" | "paid">("free");
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [exchangeRes, messagesRes, transportersRes, depotsRes] =
        await Promise.all([
          supabase.from("exchanges").select("*").eq("id", id).maybeSingle(),
          supabase
            .from("messages")
            .select("*")
            .eq("exchange_id", id)
            .order("created_at", { ascending: true }),
          supabase.from("transporters").select("*"),
          supabase.from("mini_depots").select("*"),
        ]);

      if (exchangeRes.data) {
        setExchange(exchangeRes.data);

        const [historyRes, deliveryRes] = await Promise.all([
          supabase
            .from("exchanges")
            .select("*")
            .eq("client_phone", exchangeRes.data.client_phone)
            .neq("id", id)
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("delivery_attempts")
            .select("*")
            .eq("exchange_id", id)
            .order("attempt_number", { ascending: true }),
        ]);

        setClientHistory(historyRes.data || []);
        setDeliveryAttempts(deliveryRes.data || []);
      }

      setMessages(messagesRes.data || []);
      setTransporters(transportersRes.data || []);
      setDepots(depotsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
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
        sender_type: "merchant",
        message: newMessage,
      });

      setNewMessage("");
      fetchData();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const validateExchange = async () => {
    const finalPaymentAmount =
      paymentType === "free" ? 0 : parseFloat(paymentAmount);

    try {
      await supabase
        .from("exchanges")
        .update({
          status: "validated",
          payment_amount: finalPaymentAmount,
          payment_status: paymentType === "free" ? "free" : "pending",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      await supabase.from("status_history").insert({
        exchange_id: id,
        status: "validated",
      });

      const paymentMessage =
        paymentType === "free"
          ? "Votre échange a été validé. Aucun paiement supplémentaire requis."
          : `Votre échange a été validé. Montant à payer: ${finalPaymentAmount.toFixed(2)} TND.`;

      await supabase.from("messages").insert({
        exchange_id: id,
        sender_type: "merchant",
        message: paymentMessage,
      });

      setShowValidateModal(false);
      fetchData();
    } catch (error) {
      console.error("Error validating exchange:", error);
    }
  };

  const rejectExchange = async () => {
    if (!rejectionReason.trim()) {
      alert("Veuillez fournir une raison pour le refus");
      return;
    }

    try {
      await supabase
        .from("exchanges")
        .update({
          status: "rejected",
          rejection_reason: rejectionReason,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      await supabase.from("status_history").insert({
        exchange_id: id,
        status: "rejected",
      });

      await supabase.from("messages").insert({
        exchange_id: id,
        sender_type: "merchant",
        message: `Votre demande d'échange a été refusée. Raison: ${rejectionReason}`,
      });

      setShowRejectModal(false);
      fetchData();
    } catch (error) {
      console.error("Error rejecting exchange:", error);
    }
  };

  const printBordereau = () => {
    if (!exchange) return;

    const depot = depots.find((d) => d.id === exchange.mini_depot_id);
    const transporter = transporters.find(
      (t) => t.id === exchange.transporter_id,
    );

    // Generate QR code URL for delivery person verification
    const verificationUrl = `https://fawzyoth.github.io/Swapp-app/delivery/verify/${exchange.exchange_code}`;

    const printWindow = window.open("", "", "height=800,width=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Bordereau - ${exchange.exchange_code}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 20px;
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #000;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 24px;
              margin-bottom: 5px;
            }
            .header .code {
              font-size: 18px;
              font-weight: bold;
              color: #333;
            }
            .header .date {
              font-size: 12px;
              color: #666;
            }
            .qr-section {
              text-align: center;
              padding: 20px;
              background: #f5f5f5;
              border: 2px solid #d97706;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .qr-section img {
              width: 150px;
              height: 150px;
            }
            .qr-section .scan-text {
              margin-top: 10px;
              font-weight: bold;
              color: #d97706;
              font-size: 14px;
            }
            .qr-section .scan-desc {
              margin-top: 5px;
              font-size: 11px;
              color: #666;
            }
            .section {
              margin-bottom: 15px;
              padding: 12px;
              border: 1px solid #ddd;
              border-radius: 6px;
            }
            .section-title {
              font-size: 12px;
              font-weight: bold;
              color: #666;
              text-transform: uppercase;
              margin-bottom: 8px;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .section-content {
              font-size: 14px;
            }
            .section-content p {
              margin: 3px 0;
            }
            .section-content .label {
              color: #666;
              font-size: 11px;
            }
            .section-content .value {
              font-weight: 500;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .payment {
              background: #fef3c7;
              border-color: #f59e0b;
            }
            .payment .value {
              font-size: 18px;
              color: #d97706;
            }
            .footer {
              margin-top: 20px;
              padding-top: 15px;
              border-top: 2px dashed #ccc;
              text-align: center;
              font-size: 10px;
              color: #999;
            }
            @media print {
              body { padding: 10px; }
              .qr-section { background: #fff; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BORDEREAU D'ÉCHANGE</h1>
            <div class="code">${exchange.exchange_code}</div>
            <div class="date">Créé le ${new Date(exchange.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</div>
          </div>

          <div class="qr-section">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}" alt="QR Code" />
            <p class="scan-text">SCANNER POUR VÉRIFIER L'ÉCHANGE</p>
            <p class="scan-desc">Ce QR code permet au livreur d'accéder à la vidéo et aux informations pour vérifier le produit</p>
          </div>

          <div class="grid">
            <div class="section">
              <div class="section-title">Client</div>
              <div class="section-content">
                <p class="value">${exchange.client_name}</p>
                <p>${exchange.client_phone}</p>
              </div>
            </div>
            <div class="section">
              <div class="section-title">Produit</div>
              <div class="section-content">
                <p class="value">${exchange.product_name || "Non spécifié"}</p>
                <p class="label">Raison: ${exchange.reason}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Adresse de livraison</div>
            <div class="section-content">
              <p class="value">${exchange.client_address || "Non fournie"}</p>
              <p>${exchange.client_city || ""} ${exchange.client_postal_code || ""}</p>
              <p>${exchange.client_country || "Tunisia"}</p>
            </div>
          </div>

          ${
            depot
              ? `
          <div class="section">
            <div class="section-title">Mini-Dépôt</div>
            <div class="section-content">
              <p class="value">${depot.name}</p>
              <p>${depot.address}, ${depot.city}</p>
              <p>Tél: ${depot.phone}</p>
            </div>
          </div>
          `
              : ""
          }

          ${
            transporter
              ? `
          <div class="section">
            <div class="section-title">Transporteur</div>
            <div class="section-content">
              <p class="value">${transporter.name}</p>
              <p>Tél: ${transporter.phone}</p>
            </div>
          </div>
          `
              : ""
          }

          <div class="section payment">
            <div class="section-title">Paiement</div>
            <div class="section-content">
              <p class="value">${exchange.payment_amount > 0 ? `${exchange.payment_amount} TND` : "GRATUIT"}</p>
            </div>
          </div>

          <div class="footer">
            <p>SWAPP - Plateforme d'échange de produits</p>
            <p>Statut actuel: ${STATUS_LABELS[exchange.status]}</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
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

  if (!exchange) {
    return (
      <MerchantLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Échange non trouvé
            </h2>
            <button
              onClick={() => navigate("/merchant/exchanges")}
              className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              Retour aux échanges
            </button>
          </div>
        </div>
      </MerchantLayout>
    );
  }

  const isPending = exchange.status === "pending";
  const historyStats = {
    total: clientHistory.length,
    validated: clientHistory.filter(
      (h) => h.status === "validated" || h.status === "completed",
    ).length,
    rejected: clientHistory.filter((h) => h.status === "rejected").length,
  };

  return (
    <MerchantLayout>
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/merchant/exchanges")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Retour aux échanges</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    {exchange.exchange_code}
                  </h2>
                  <p className="text-slate-600">
                    Créé le{" "}
                    {new Date(exchange.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    exchange.status === "pending"
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : exchange.status === "validated"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : exchange.status === "rejected"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}
                >
                  {STATUS_LABELS[exchange.status]}
                </span>
              </div>

              {isPending && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-1">
                        Action requise
                      </h4>
                      <p className="text-sm text-amber-700">
                        Cette demande attend votre validation. Examinez les
                        détails ci-dessous et décidez de l'approuver ou de la
                        refuser.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-sky-600" />
                    <h3 className="font-semibold text-slate-900">
                      Informations client
                    </h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-600">Nom:</span>
                      <p className="font-medium text-slate-900">
                        {exchange.client_name}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-600">Téléphone:</span>
                      <p className="font-medium text-slate-900">
                        <a
                          href={`tel:${exchange.client_phone}`}
                          className="text-sky-600 hover:text-sky-700"
                        >
                          {exchange.client_phone}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-sky-600" />
                    <h3 className="font-semibold text-slate-900">Produit</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-600">Nom:</span>
                      <p className="font-medium text-slate-900">
                        {exchange.product_name || "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-600">Raison:</span>
                      <p className="font-medium text-slate-900">
                        {exchange.reason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-200 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-sky-700" />
                  <h3 className="font-semibold text-slate-900">
                    Adresse de livraison
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Home className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {exchange.client_address || "Non fournie"}
                      </p>
                      <p className="text-slate-700">
                        {exchange.client_city && exchange.client_postal_code
                          ? `${exchange.client_city} ${exchange.client_postal_code}, ${exchange.client_country || "Tunisia"}`
                          : "Informations incomplètes"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {exchange.video && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-sky-600" />
                      <h3 className="font-semibold text-slate-900">
                        Vidéo du produit
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        Enregistrée le{" "}
                        {new Date(exchange.created_at).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}{" "}
                        à{" "}
                        {new Date(exchange.created_at).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                  <video
                    src={exchange.video}
                    controls
                    className="w-full max-h-96 rounded-lg border border-slate-200 bg-black"
                  />
                </div>
              )}

              {exchange.photos && exchange.photos.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Photos du produit
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {exchange.photos.map((photo: string, index: number) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(photo, "_blank")}
                      />
                    ))}
                  </div>
                </div>
              )}

              {isPending && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => setShowValidateModal(true)}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Valider l'échange
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Refuser
                  </button>
                </div>
              )}

              {!isPending && exchange.status === "validated" && (
                <button
                  onClick={printBordereau}
                  className="w-full mt-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                  Imprimer le bordereau
                </button>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Messages
              </h3>
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-slate-600 text-center py-8">
                    Aucun message
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-lg ${
                        msg.sender_type === "merchant"
                          ? "bg-sky-50 ml-auto max-w-md border border-sky-200"
                          : "bg-slate-100 mr-auto max-w-md border border-slate-200"
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-900 mb-1">
                        {msg.sender_type === "merchant"
                          ? "Vous"
                          : exchange.client_name}
                      </p>
                      <p className="text-slate-700">{msg.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
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
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-sky-600" />
                <h3 className="font-semibold text-slate-900">
                  Historique de livraison du colis
                </h3>
              </div>

              {deliveryAttempts.length === 0 ? (
                <div className="text-center py-8">
                  <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 mb-2">
                    Aucune tentative de livraison enregistrée
                  </p>
                  <p className="text-xs text-slate-500">
                    Le client déclare vouloir échanger ce produit
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exchange.delivery_accepted_on_attempt && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-900">
                          Colis accepté à la tentative{" "}
                          {exchange.delivery_accepted_on_attempt}
                        </span>
                      </div>
                    </div>
                  )}

                  {deliveryAttempts.map((attempt, index) => (
                    <div
                      key={attempt.id}
                      className={`rounded-lg p-4 border ${
                        attempt.status === "successful"
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            attempt.status === "successful"
                              ? "bg-emerald-100"
                              : "bg-red-100"
                          }`}
                        >
                          {attempt.status === "successful" ? (
                            <CheckCircle
                              className={`w-4 h-4 ${
                                attempt.status === "successful"
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }`}
                            />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`font-semibold text-sm ${
                                attempt.status === "successful"
                                  ? "text-emerald-900"
                                  : "text-red-900"
                              }`}
                            >
                              Tentative {attempt.attempt_number}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                attempt.status === "successful"
                                  ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                                  : "bg-red-100 text-red-700 border border-red-300"
                              }`}
                            >
                              {attempt.status === "successful"
                                ? "Réussie"
                                : "Échouée"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-600 mb-2">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(
                                attempt.attempt_date,
                              ).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          {attempt.failure_reason && (
                            <div className="text-sm text-red-700 mb-1">
                              <span className="font-medium">Raison: </span>
                              {attempt.failure_reason}
                            </div>
                          )}
                          {attempt.notes && (
                            <div className="text-xs text-slate-600">
                              <span className="font-medium">Notes: </span>
                              {attempt.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {deliveryAttempts.length > 0 && (
                    <div
                      className={`rounded-lg p-3 border mt-4 ${
                        deliveryAttempts.some((a) => a.status === "successful")
                          ? "bg-amber-50 border-amber-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircleIcon
                          className={`w-4 h-4 mt-0.5 ${
                            deliveryAttempts.some(
                              (a) => a.status === "successful",
                            )
                              ? "text-amber-600"
                              : "text-red-600"
                          }`}
                        />
                        <div className="text-xs">
                          {deliveryAttempts.some(
                            (a) => a.status === "successful",
                          ) ? (
                            <p className="text-amber-900">
                              <span className="font-semibold">Attention:</span>{" "}
                              Le client a accepté le colis après{" "}
                              {
                                deliveryAttempts.filter(
                                  (a) => a.status === "failed",
                                ).length
                              }{" "}
                              tentative(s) échouée(s), mais demande maintenant
                              un échange.
                            </p>
                          ) : (
                            <p className="text-red-900">
                              <span className="font-semibold">Attention:</span>{" "}
                              Toutes les tentatives de livraison ont échoué (
                              {deliveryAttempts.length} tentative(s)). Le client
                              demande maintenant un échange.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-sky-600" />
                <h3 className="font-semibold text-slate-900">
                  Historique du client
                </h3>
              </div>

              {clientHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-600">
                    Premier échange de ce client
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-2xl font-bold text-slate-900">
                        {historyStats.total}
                      </div>
                      <div className="text-xs text-slate-600">Échanges</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <div className="text-2xl font-bold text-emerald-700">
                        {historyStats.validated}
                      </div>
                      <div className="text-xs text-emerald-700">Validés</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <div className="text-2xl font-bold text-red-700">
                        {historyStats.rejected}
                      </div>
                      <div className="text-xs text-red-700">Refusés</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">
                      Derniers échanges
                    </h4>
                    {clientHistory.slice(0, 3).map((h) => (
                      <div
                        key={h.id}
                        className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs text-slate-600">
                            {h.exchange_code}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              h.status === "validated" ||
                              h.status === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : h.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {STATUS_LABELS[h.status]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 truncate">
                          {h.reason}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(h.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {historyStats.total > 0 && (
                    <div
                      className={`rounded-lg p-3 border ${
                        historyStats.validated / historyStats.total >= 0.7
                          ? "bg-emerald-50 border-emerald-200"
                          : historyStats.validated / historyStats.total >= 0.4
                            ? "bg-amber-50 border-amber-200"
                            : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Check
                          className={`w-4 h-4 ${
                            historyStats.validated / historyStats.total >= 0.7
                              ? "text-emerald-600"
                              : historyStats.validated / historyStats.total >=
                                  0.4
                                ? "text-amber-600"
                                : "text-red-600"
                          }`}
                        />
                        <span className="text-sm font-medium">
                          Taux de validation:{" "}
                          {Math.round(
                            (historyStats.validated / historyStats.total) * 100,
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {showValidateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Valider l'échange
                </h3>

                <div className="space-y-6">
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-5 h-5 text-sky-700" />
                      <h4 className="font-semibold text-slate-900">
                        Options de paiement
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-300 cursor-pointer hover:border-sky-500 transition-colors">
                        <input
                          type="radio"
                          name="paymentType"
                          value="free"
                          checked={paymentType === "free"}
                          onChange={(e) =>
                            setPaymentType(e.target.value as "free")
                          }
                          className="w-4 h-4 text-sky-600"
                        />
                        <div>
                          <div className="font-medium text-slate-900">
                            Échange gratuit
                          </div>
                          <div className="text-sm text-slate-600">
                            Pas de frais supplémentaires
                          </div>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-300 cursor-pointer hover:border-sky-500 transition-colors">
                        <input
                          type="radio"
                          name="paymentType"
                          value="paid"
                          checked={paymentType === "paid"}
                          onChange={(e) =>
                            setPaymentType(e.target.value as "paid")
                          }
                          className="w-4 h-4 text-sky-600 mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 mb-2">
                            Échange payant
                          </div>
                          {paymentType === "paid" && (
                            <div className="space-y-2">
                              <label className="text-sm text-slate-700">
                                Montant à payer (TND)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={paymentAmount}
                                onChange={(e) =>
                                  setPaymentAmount(e.target.value)
                                }
                                placeholder="0.00"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                              />
                              <p className="text-xs text-slate-600">
                                Pour différence de prix ou frais de livraison
                              </p>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowValidateModal(false)}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={validateExchange}
                    className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Confirmer la validation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Refuser l'échange
                </h3>
                <p className="text-slate-600 mb-6">
                  Veuillez expliquer la raison du refus au client
                </p>

                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Expliquez pourquoi l'échange est refusé..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={rejectExchange}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Confirmer le refus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MerchantLayout>
  );
}
