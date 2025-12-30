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
import SMSInviteModal from "../../components/merchant/SMSInviteModal";
import {
  sendRejectionSMS,
  sendAcceptanceSMS,
  sendMessageNotificationSMS,
} from "../../lib/smsService";
import {
  createJaxExchangeColis,
  buildJaxRequestFromExchange,
  DEFAULT_JAX_TOKEN,
  JaxValidationError,
} from "../../lib/jaxService";

// Delivery fee constant - 9 TND per package
const DELIVERY_FEE = 9;

// Demo exchanges database - matching IDs from ExchangeList
const DEMO_EXCHANGES_DB: Record<string, any> = {
  "demo-1": {
    id: "demo-1",
    exchange_code: "EXC-2024-001",
    client_name: "Ahmed Ben Ali",
    client_phone: "+216 55 123 456",
    client_address: "15 Rue de la Liberte",
    client_city: "Tunis",
    client_postal_code: "1000",
    client_country: "Tunisie",
    product_name: "T-Shirt Nike - Taille L",
    reason: "Taille incorrecte",
    status: "pending",
    payment_amount: 0,
    payment_status: "pending",
    created_at: new Date().toISOString(),
    video: null,
    images: null,
  },
  "demo-2": {
    id: "demo-2",
    exchange_code: "EXC-2024-002",
    client_name: "Leila Mansouri",
    client_phone: "+216 98 111 222",
    client_address: "42 Avenue Habib Bourguiba",
    client_city: "Sfax",
    client_postal_code: "3000",
    client_country: "Tunisie",
    product_name: "Robe Zara - Rouge",
    reason: "Couleur non conforme",
    status: "pending",
    payment_amount: 15,
    payment_status: "pending",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    video: null,
    images: null,
  },
  "demo-3": {
    id: "demo-3",
    exchange_code: "EXC-2024-003",
    client_name: "Karim Bouzid",
    client_phone: "+216 22 333 444",
    client_address: "8 Rue Ibn Khaldoun",
    client_city: "Sousse",
    client_postal_code: "4000",
    client_country: "Tunisie",
    product_name: "Chaussures Adidas - 42",
    reason: "Produit defectueux",
    status: "pending",
    payment_amount: 0,
    payment_status: "pending",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    video: null,
    images: null,
  },
  "demo-4": {
    id: "demo-4",
    exchange_code: "EXC-2024-004",
    client_name: "Fatma Trabelsi",
    client_phone: "+216 22 987 654",
    client_address: "25 Rue de Marseille",
    client_city: "Tunis",
    client_postal_code: "1000",
    client_country: "Tunisie",
    product_name: "Sac a main Guess",
    reason: "Ne correspond pas a la description",
    status: "validated",
    payment_amount: 0,
    payment_status: "free",
    validated_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    video: null,
    images: null,
  },
  "demo-9": {
    id: "demo-9",
    exchange_code: "EXC-2024-009",
    client_name: "Mohamed Kacem",
    client_phone: "+216 98 456 123",
    client_address: "55 Rue de Rome",
    client_city: "Tunis",
    client_postal_code: "1000",
    client_country: "Tunisie",
    product_name: "Smartphone Samsung Galaxy",
    reason: "Batterie defectueuse",
    status: "completed",
    payment_amount: 0,
    payment_status: "free",
    return_product_status: "accepted",
    return_product_notes: "Produit en bon etat, echange effectue",
    completed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    video: null,
    images: null,
  },
  "demo-11": {
    id: "demo-11",
    exchange_code: "EXC-2024-011",
    client_name: "Raouf Jebali",
    client_phone: "+216 58 777 888",
    client_address: "9 Rue de Hollande",
    client_city: "Sousse",
    client_postal_code: "4000",
    client_country: "Tunisie",
    product_name: "Casque Beats Solo",
    reason: "Son defectueux",
    status: "completed",
    payment_amount: 0,
    payment_status: "free",
    return_product_status: "problem",
    return_product_notes: "Legere rayure sur le produit retourne",
    completed_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    video: null,
    images: null,
  },
  "demo-12": {
    id: "demo-12",
    exchange_code: "EXC-2024-012",
    client_name: "Sarra Bouaziz",
    client_phone: "+216 50 789 012",
    client_address: "14 Rue de Grece",
    client_city: "Tunis",
    client_postal_code: "1000",
    client_country: "Tunisie",
    product_name: "Lunettes Ray-Ban",
    reason: "Ne me plait plus",
    status: "rejected",
    rejection_reason: "Delai de retour depasse (30 jours)",
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    video: null,
    images: null,
  },
};

// Default demo exchange for unknown IDs
const DEMO_EXCHANGE = {
  id: "demo-123",
  exchange_code: "EXC-DEMO-2024",
  client_name: "Ahmed Ben Ali",
  client_phone: "+216 55 123 456",
  client_address: "15 Rue de la Liberte",
  client_city: "Tunis",
  client_postal_code: "1000",
  client_country: "Tunisie",
  product_name: "T-Shirt Nike - Taille L",
  reason: "Taille incorrecte",
  status: "pending",
  payment_amount: 0,
  payment_status: "pending",
  created_at: new Date().toISOString(),
  video: null,
  images: null,
};

const DEMO_MESSAGES = [
  {
    id: "msg-1",
    sender_type: "client",
    message:
      "Bonjour, j'ai commande une taille L mais j'ai recu une taille M. Je voudrais echanger.",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "msg-2",
    sender_type: "merchant",
    message:
      "Bonjour, nous avons bien recu votre demande. Nous allons l'examiner.",
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
];

const DEMO_CLIENT_HISTORY = [
  {
    id: "hist-1",
    exchange_code: "EXC-ABC123",
    reason: "Couleur non conforme",
    status: "completed",
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "hist-2",
    exchange_code: "EXC-DEF456",
    reason: "Produit defectueux",
    status: "validated",
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
];

export default function MerchantExchangeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exchange, setExchange] = useState<any>(null);
  const [merchant, setMerchant] = useState<any>(null);
  const [mediaData, setMediaData] = useState<{
    video?: string;
    images?: string[];
  } | null>(null);
  const [loadingMedia, setLoadingMedia] = useState(false);
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
  const [jaxLoading, setJaxLoading] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [jaxError, setJaxError] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Test mode state - check sessionStorage on init
  const [testMode, setTestMode] = useState(() => {
    return sessionStorage.getItem("demo_mode") === "true";
  });

  useEffect(() => {
    if (testMode) {
      loadDemoData();
    } else {
      fetchData();
    }
  }, [id, testMode]);

  // Load demo data for test mode
  const loadDemoData = () => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      // Get the correct exchange from demo database, or use default
      const demoExchange =
        id && DEMO_EXCHANGES_DB[id] ? DEMO_EXCHANGES_DB[id] : DEMO_EXCHANGE;
      setExchange(demoExchange);
      setMessages(DEMO_MESSAGES);
      setClientHistory(DEMO_CLIENT_HISTORY);
      setDeliveryAttempts([]);
      setMerchant({
        id: "demo-merchant",
        name: "Boutique Demo",
        business_name: "Ma Boutique Demo",
        phone: "+216 70 000 000",
        business_address: "Avenue Habib Bourguiba, Tunis",
        business_city: "Tunis",
      });
      setLoading(false);
    }, 500);
  };

  // Toggle test mode
  const toggleTestMode = () => {
    setTestMode(!testMode);
    // Reset states when switching modes
    setExchange(null);
    setMessages([]);
    setClientHistory([]);
    setDeliveryAttempts([]);
    setShowValidateModal(false);
    setShowRejectModal(false);
    setPaymentType("free");
    setPaymentAmount("0");
  };

  // Lazy load video and images only when user clicks to view
  const loadMedia = async () => {
    if (mediaData || loadingMedia) return;
    setLoadingMedia(true);
    try {
      const { data } = await supabase
        .from("exchanges")
        .select("video, images")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        setMediaData({ video: data.video, images: data.images });
      }
    } catch (error) {
      console.error("Error loading media:", error);
    } finally {
      setLoadingMedia(false);
    }
  };

  const fetchData = async () => {
    try {
      // Get the current session to fetch merchant by email
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Debug: Log session info
      console.log("Session email:", session?.user?.email);

      // Fetch exchange - use * for compatibility, video/images loaded separately on demand
      const { data: exchangeData } = await supabase
        .from("exchanges")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!exchangeData) {
        setLoading(false);
        return;
      }

      // Debug: Log exchange merchant_id
      console.log("Exchange merchant_id:", exchangeData.merchant_id);

      setExchange(exchangeData);

      // Then fetch other data in parallel - but only needed fields
      const [
        messagesRes,
        transportersRes,
        depotsRes,
        historyRes,
        deliveryRes,
        merchantRes,
      ] = await Promise.all([
        supabase
          .from("messages")
          .select("id, sender_type, message, created_at")
          .eq("exchange_id", id)
          .order("created_at", { ascending: true }),
        supabase.from("transporters").select("id, name"),
        supabase.from("mini_depots").select("id, name, address"),
        // Client history - NO video/images, only basic info
        supabase
          .from("exchanges")
          .select("id, exchange_code, reason, status, created_at")
          .eq("client_phone", exchangeData.client_phone)
          .neq("id", id)
          .order("created_at", { ascending: false })
          .limit(5),
        // delivery_attempts table may not exist yet - handle gracefully
        supabase
          .from("delivery_attempts")
          .select("*")
          .eq("exchange_id", id)
          .order("attempt_number", { ascending: true })
          .then((res) => (res.error ? { data: [] } : res))
          .catch(() => ({ data: [] })),
        // Fetch merchant info for JAX API - use session email (more reliable)
        session?.user?.email
          ? supabase
              .from("merchants")
              .select(
                "id, name, business_name, phone, business_address, business_city",
              )
              .eq("email", session.user.email)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      // Debug: Log merchant query result
      console.log("Merchant query result:", merchantRes);

      setMessages(messagesRes.data || []);
      setTransporters(transportersRes.data || []);
      setDepots(depotsRes.data || []);
      setClientHistory(historyRes.data || []);
      setDeliveryAttempts(deliveryRes.data || []);
      setMerchant(merchantRes.data || null);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Demo mode - just update local state
    if (testMode) {
      setMessages([
        ...messages,
        {
          id: `msg-demo-${Date.now()}`,
          sender_type: "merchant",
          message: newMessage,
          created_at: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
      return;
    }

    try {
      await supabase.from("messages").insert({
        exchange_id: id,
        sender_type: "merchant",
        message: newMessage,
      });

      // Send SMS notification to client about new message
      if (exchange && id) {
        await sendMessageNotificationSMS(
          exchange.client_phone,
          exchange.client_name,
          exchange.exchange_code,
          id,
        );
      }

      setNewMessage("");
      fetchData();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const validateExchange = async () => {
    // For free exchanges: client pays 0, but delivery fee (9 DT) is charged to merchant
    // For paid exchanges: client pays the specified amount
    const clientPaymentAmount =
      paymentType === "free" ? 0 : parseFloat(paymentAmount);

    // Delivery fee is always 9 DT per package
    const deliveryFee = DELIVERY_FEE;

    // For free exchanges, merchant pays the delivery fee
    // For paid exchanges, the delivery fee can be included in the client payment or paid by merchant
    const merchantDeliveryCharge = paymentType === "free" ? deliveryFee : 0;

    // Demo mode - just update local state
    if (testMode) {
      setExchange({
        ...exchange,
        status: "validated",
        payment_amount: clientPaymentAmount,
        delivery_fee: deliveryFee,
        merchant_delivery_charge: merchantDeliveryCharge,
        payment_status: paymentType === "free" ? "free" : "pending",
      });
      setMessages([
        ...messages,
        {
          id: `msg-demo-${Date.now()}`,
          sender_type: "merchant",
          message:
            paymentType === "free"
              ? "Votre échange a été validé. Aucun paiement supplémentaire requis."
              : `Votre échange a été validé. Montant à payer: ${clientPaymentAmount.toFixed(2)} TND.`,
          created_at: new Date().toISOString(),
        },
      ]);
      setShowValidateModal(false);
      setShowPrintModal(true);
      return;
    }

    try {
      await supabase
        .from("exchanges")
        .update({
          status: "validated",
          payment_amount: clientPaymentAmount,
          delivery_fee: deliveryFee,
          merchant_delivery_charge: merchantDeliveryCharge,
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
          : `Votre échange a été validé. Montant à payer: ${clientPaymentAmount.toFixed(2)} TND.`;

      await supabase.from("messages").insert({
        exchange_id: id,
        sender_type: "merchant",
        message: paymentMessage,
      });

      // Send SMS notification to client
      if (exchange) {
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + 3); // Estimated 3 days
        const dateStr = estimatedDate.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        await sendAcceptanceSMS(
          exchange.client_phone,
          exchange.client_name,
          exchange.exchange_code,
          dateStr,
        );
      }

      setShowValidateModal(false);
      setShowPrintModal(true);
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

    // Demo mode - just update local state
    if (testMode) {
      setExchange({
        ...exchange,
        status: "rejected",
        rejection_reason: rejectionReason,
      });
      setMessages([
        ...messages,
        {
          id: `msg-demo-${Date.now()}`,
          sender_type: "merchant",
          message: `Votre demande d'échange a été refusée. Raison: ${rejectionReason}`,
          created_at: new Date().toISOString(),
        },
      ]);
      setShowRejectModal(false);
      setRejectionReason("");
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

      // Send SMS notification to client about rejection
      if (exchange) {
        await sendRejectionSMS(
          exchange.client_phone,
          exchange.client_name,
          exchange.exchange_code,
          rejectionReason,
        );
      }

      setShowRejectModal(false);
      fetchData();
    } catch (error) {
      console.error("Error rejecting exchange:", error);
    }
  };

  // Create JAX colis and print bordereau
  const printBordereauGo = async () => {
    if (!exchange) return;

    const depot = depots.find((d) => d.id === exchange.mini_depot_id);
    const transporter = transporters.find(
      (t) => t.id === exchange.transporter_id,
    );

    // Check if JAX colis already created
    let jaxEan = exchange.jax_ean;

    // Fetch merchant data directly here to ensure we have it
    let merchantData = merchant;
    if (!merchantData) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Fetching merchant for email:", session?.user?.email);

      if (session?.user?.email) {
        const { data: freshMerchant, error: merchantError } = await supabase
          .from("merchants")
          .select(
            "id, name, business_name, phone, business_address, business_city",
          )
          .eq("email", session.user.email)
          .maybeSingle();

        console.log("Fresh merchant data:", freshMerchant);
        console.log("Merchant query error:", merchantError);

        if (freshMerchant) {
          merchantData = freshMerchant;
          setMerchant(freshMerchant);
        }
      }
    }

    // Debug: Log merchant data
    console.log("Merchant data for JAX:", merchantData);
    console.log("business_name:", merchantData?.business_name);
    console.log("name:", merchantData?.name);

    // If no JAX EAN yet, create the colis using default token (jax_token column doesn't exist yet)
    const jaxToken = DEFAULT_JAX_TOKEN;
    if (!jaxEan && jaxToken) {
      setJaxLoading(true);
      setJaxError(null);

      try {
        const jaxRequest = buildJaxRequestFromExchange(
          exchange,
          merchantData || {},
        );
        const jaxResponse = await createJaxExchangeColis(jaxToken, jaxRequest);

        if (jaxResponse.success && jaxResponse.ean) {
          jaxEan = jaxResponse.ean;

          // Save JAX EAN to exchange record and update status to ready_for_pickup
          try {
            console.log(
              "Saving JAX EAN to database:",
              jaxEan,
              "for exchange:",
              exchange.id,
            );
            const updateResult = await supabase
              .from("exchanges")
              .update({
                jax_ean: jaxEan,
                jax_created_at: new Date().toISOString(),
                status: "ready_for_pickup", // Update status when bordereau is printed
              })
              .eq("id", exchange.id);

            console.log("JAX EAN update result:", updateResult);

            if (updateResult.error) {
              console.error(
                "Could not save jax_ean to database:",
                updateResult.error.message,
              );
            } else {
              console.log("JAX EAN saved successfully!");
              // Also add to status history
              await supabase.from("status_history").insert({
                exchange_id: exchange.id,
                status: "ready_for_pickup",
              });
            }
          } catch (err) {
            console.error("Error saving jax_ean:", err);
          }

          // Update local state regardless of DB save
          setExchange({
            ...exchange,
            jax_ean: jaxEan,
            status: "ready_for_pickup",
          });
        } else {
          setJaxError(
            jaxResponse.error ||
              jaxResponse.message ||
              "Erreur lors de la création du colis JAX",
          );
          setJaxLoading(false);
          return;
        }
      } catch (error) {
        console.error("JAX API Error:", error);
        if (error instanceof JaxValidationError) {
          setJaxError(error.message);
        } else {
          setJaxError("Erreur de connexion à JAX");
        }
        setJaxLoading(false);
        return;
      }

      setJaxLoading(false);
    }

    // Generate QR code URL for delivery person verification
    const verificationUrl = `https://fawzyoth.github.io/Swapp-app/#/delivery/verify/${exchange.exchange_code}`;

    const printWindow = window.open("", "", "height=800,width=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Bordereau ALLER - ${exchange.exchange_code}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: Arial, Helvetica, sans-serif;
              padding: 15px;
              max-width: 600px;
              margin: 0 auto;
              color: #000;
            }
            .header {
              border: 3px solid #000;
              padding: 12px;
              margin-bottom: 15px;
            }
            .header-top {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 2px;
            }
            .doc-type {
              background: #000;
              color: #fff;
              padding: 5px 15px;
              font-weight: bold;
              font-size: 14px;
            }
            .header-info {
              display: flex;
              justify-content: space-between;
            }
            .exchange-code {
              font-family: 'Courier New', monospace;
              font-size: 20px;
              font-weight: bold;
              letter-spacing: 2px;
            }
            .date {
              font-size: 12px;
              color: #333;
            }

            .codes-section {
              display: flex;
              gap: 15px;
              margin-bottom: 15px;
            }
            .code-box {
              flex: 1;
              border: 2px solid #000;
              padding: 10px;
              text-align: center;
            }
            .code-box .title {
              font-weight: bold;
              font-size: 11px;
              text-transform: uppercase;
              margin-bottom: 8px;
              padding-bottom: 5px;
              border-bottom: 1px solid #000;
            }
            .code-box img {
              display: block;
              margin: 0 auto;
            }
            .code-box .code-label {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              font-weight: bold;
              margin-top: 8px;
            }

            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            .info-table th, .info-table td {
              border: 1px solid #000;
              padding: 8px 10px;
              text-align: left;
              font-size: 12px;
            }
            .info-table th {
              background: #f0f0f0;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 10px;
              width: 120px;
            }
            .info-table td {
              font-size: 13px;
            }

            .address-box {
              border: 2px solid #000;
              padding: 12px;
              margin-bottom: 15px;
            }
            .address-box .title {
              font-weight: bold;
              font-size: 11px;
              text-transform: uppercase;
              margin-bottom: 8px;
              padding-bottom: 5px;
              border-bottom: 1px solid #000;
            }
            .address-box .content {
              font-size: 13px;
              line-height: 1.5;
            }

            .payment-box {
              border: 3px solid #000;
              padding: 12px;
              margin-bottom: 15px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .payment-box .label {
              font-weight: bold;
              font-size: 14px;
              text-transform: uppercase;
            }
            .payment-box .amount {
              font-size: 22px;
              font-weight: bold;
              font-family: 'Courier New', monospace;
            }

            .notice {
              border: 2px dashed #000;
              padding: 10px;
              text-align: center;
              margin-bottom: 15px;
            }
            .notice .title {
              font-weight: bold;
              font-size: 12px;
              margin-bottom: 5px;
            }
            .notice .text {
              font-size: 11px;
            }

            .footer {
              border-top: 2px solid #000;
              padding-top: 10px;
              display: flex;
              justify-content: space-between;
              font-size: 10px;
            }
            .footer .brand {
              font-weight: bold;
            }

            .signature-area {
              display: flex;
              gap: 15px;
              margin-top: 15px;
            }
            .signature-box {
              flex: 1;
              border: 1px solid #000;
              padding: 10px;
              height: 60px;
            }
            .signature-box .label {
              font-size: 9px;
              text-transform: uppercase;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-top">
              <div class="logo">SWAPP</div>
              <div class="doc-type">BORDEREAU ALLER</div>
            </div>
            <div class="header-info">
              <div class="exchange-code">${exchange.exchange_code}</div>
              <div class="date">${new Date(exchange.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })}</div>
            </div>
            ${jaxEan ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #000; font-size: 12px;"><strong>JAX:</strong> <span style="font-family: 'Courier New', monospace;">${jaxEan}</span></div>` : ""}
          </div>

          <div class="codes-section">
            <div class="code-box">
              <div class="title">QR Vérification</div>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verificationUrl)}" alt="QR Code" width="100" height="100" />
              <div class="code-label">SCAN LIVREUR</div>
            </div>
            <div class="code-box">
              <div class="title">Code-Barres JAX</div>
              <img src="https://barcodeapi.org/api/128/${jaxEan || exchange.exchange_code.slice(-8)}" alt="Barcode" width="160" height="50" />
              <div class="code-label">${jaxEan || exchange.exchange_code.slice(-8)}</div>
            </div>
          </div>

          <table class="info-table">
            <tr>
              <th>Client</th>
              <td><strong>${exchange.client_name}</strong></td>
            </tr>
            <tr>
              <th>Téléphone</th>
              <td>${exchange.client_phone}</td>
            </tr>
            <tr>
              <th>Produit</th>
              <td>${exchange.product_name || "Non spécifié"}</td>
            </tr>
            <tr>
              <th>Motif</th>
              <td>${exchange.reason}</td>
            </tr>
          </table>

          <div class="address-box">
            <div class="title">Adresse de livraison</div>
            <div class="content">
              ${exchange.client_address || "Non fournie"}<br>
              ${exchange.client_city || ""} ${exchange.client_postal_code || ""}<br>
              ${exchange.client_country || "Tunisie"}
            </div>
          </div>

          ${
            depot
              ? `
          <table class="info-table">
            <tr>
              <th>Dépôt</th>
              <td>${depot.name}</td>
            </tr>
          </table>
          `
              : ""
          }

          ${
            transporter
              ? `
          <table class="info-table">
            <tr>
              <th>Transporteur</th>
              <td>${transporter.name}</td>
            </tr>
          </table>
          `
              : ""
          }

          <div class="payment-box">
            <div class="label">Montant à encaisser</div>
            <div class="amount">${exchange.payment_amount > 0 ? exchange.payment_amount + " TND" : "GRATUIT"}</div>
          </div>

          <div class="notice">
            <div class="title">COLIS CONTENANT LE PRODUIT D'ÉCHANGE</div>
            <div class="text">À livrer au client. Le retour du produit sera géré par notre partenaire de livraison.</div>
          </div>

          <div class="signature-area">
            <div class="signature-box">
              <div class="label">Signature expéditeur</div>
            </div>
            <div class="signature-box">
              <div class="label">Signature livreur</div>
            </div>
            <div class="signature-box">
              <div class="label">Signature client</div>
            </div>
          </div>

          <div class="footer">
            <div class="brand">SWAPP - Plateforme d'échange</div>
            <div>Statut: ${STATUS_LABELS[exchange.status]}</div>
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
      
      {/* SMS Invite Modal for Video Call */}
      {showSMSModal && exchange && (
        <SMSInviteModal
          isOpen={showSMSModal}
          onClose={() => setShowSMSModal(false)}
          clientPhone={exchange.client_phone}
          clientName={exchange.client_name}
          exchangeId={exchange.id}
        />
      )}
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
        {/* Header with back button and test mode toggle */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/merchant/exchanges")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour aux échanges</span>
          </button>

          {/* Test Mode Toggle */}
          <button
            onClick={toggleTestMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              testMode
                ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${testMode ? "bg-white animate-pulse" : "bg-slate-400"}`}
            />
            {testMode ? "Mode Demo Actif" : "Activer Mode Demo"}
          </button>
        </div>

        {/* Demo Mode Banner */}
        {testMode && (
          <div className="mb-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">Mode Démonstration</h3>
                <p className="text-purple-100 text-sm">
                  Vous visualisez des données fictives. Cliquez sur "Activer
                  Mode Demo" pour revenir aux vraies données.
                </p>
              </div>
              <button
                onClick={toggleTestMode}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors"
              >
                Voir données réelles
              </button>
            </div>
          </div>
        )}

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

              {/* Video */}
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

              {/* Extracted Images from Video */}
              {exchange.images && exchange.images.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-slate-900">
                      Images extraites de la vidéo
                    </h3>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      {exchange.images.length} images
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {exchange.images.map((image: string, index: number) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Frame ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(image, "_blank")}
                        />
                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {index + 1}/{exchange.images.length}
                        </span>
                      </div>
                    ))}
                  </div>
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
                <>
                {/* Video Call Button */}
                <button
                  onClick={() => setShowSMSModal(true)}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mb-4"
                >
                  <Video className="w-5 h-5" />
                  Inviter a un appel video
                </button>

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
                </>
              )}

              {!isPending && exchange.status === "validated" && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-medium text-slate-700 text-center">
                    Imprimer le bordereau
                  </p>

                  {/* Show JAX EAN if already created */}
                  {exchange.jax_ean && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
                      <p className="text-xs text-emerald-700 mb-1">
                        Code JAX créé
                      </p>
                      <p className="font-mono font-bold text-emerald-900">
                        {exchange.jax_ean}
                      </p>
                    </div>
                  )}

                  {/* Error message */}
                  {jaxError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                      <p className="text-sm text-red-700">{jaxError}</p>
                      <p className="text-xs text-red-500 mt-1">
                        Vérifiez votre token JAX dans les paramètres
                      </p>
                    </div>
                  )}

                  <button
                    onClick={printBordereauGo}
                    disabled={jaxLoading}
                    className={`w-full py-3 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      jaxLoading
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-sky-600 hover:bg-sky-700"
                    }`}
                  >
                    {jaxLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Création du colis JAX...</span>
                      </>
                    ) : (
                      <>
                        <Printer className="w-5 h-5" />
                        <span>
                          {exchange.jax_ean
                            ? "Réimprimer Bordereau"
                            : "Créer & Imprimer Bordereau"}
                        </span>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-500 text-center">
                    Le colis sera créé automatiquement chez JAX Delivery
                  </p>
                </div>
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
            <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-5 rounded-t-2xl">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  Valider l'échange
                </h3>
                <p className="text-emerald-100 text-sm mt-1">
                  {exchange?.exchange_code} • {exchange?.client_name}
                </p>
              </div>

              <div className="p-6">
                {/* Transparent Pricing Info */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-blue-900">
                      Tarification transparente
                    </h4>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Truck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            Frais de livraison
                          </p>
                          <p className="text-xs text-slate-500">
                            Coût fixe par colis
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {DELIVERY_FEE} TND
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 mt-2 text-center">
                    Pas de frais cachés • Prix unique pour tous les colis
                  </p>
                </div>

                {/* Payment Options - Card Style */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-slate-600" />
                    Qui paie les frais de livraison ?
                  </h4>

                  <div className="grid gap-3">
                    {/* Option 1: You pay */}
                    <div
                      onClick={() => setPaymentType("free")}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentType === "free"
                          ? "border-orange-400 bg-orange-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {paymentType === "free" && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            paymentType === "free"
                              ? "bg-orange-200"
                              : "bg-slate-100"
                          }`}
                        >
                          <User className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-slate-900">
                              Vous payez
                            </h5>
                            <span className="text-lg font-bold text-orange-600">
                              {DELIVERY_FEE} TND
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            Échange gratuit pour votre client
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full w-fit">
                            <Package className="w-3 h-3" />
                            Le client ne paie rien
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Option 2: Client pays */}
                    <div
                      onClick={() => setPaymentType("paid")}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentType === "paid"
                          ? "border-emerald-400 bg-emerald-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {paymentType === "paid" && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            paymentType === "paid"
                              ? "bg-emerald-200"
                              : "bg-slate-100"
                          }`}
                        >
                          <DollarSign className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-slate-900">
                              Le client paie
                            </h5>
                            <span className="text-lg font-bold text-emerald-600">
                              0 TND pour vous
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            Définissez le montant à payer par le client
                          </p>

                          {paymentType === "paid" && (
                            <div className="mt-3 space-y-3">
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={paymentAmount}
                                  onChange={(e) =>
                                    setPaymentAmount(e.target.value)
                                  }
                                  placeholder="Montant en TND"
                                  className="w-full px-4 py-3 pr-16 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-semibold"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                                  TND
                                </span>
                              </div>
                              <div className="bg-emerald-100 rounded-lg p-3 flex items-start gap-2">
                                <Info className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-emerald-800">
                                  <strong>Conseil :</strong> Mettez{" "}
                                  {DELIVERY_FEE} TND ou plus pour couvrir les
                                  frais de livraison. Le client paie à la
                                  réception du colis.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clear Summary Box */}
                <div
                  className={`rounded-xl p-4 mb-6 ${
                    paymentType === "free"
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200"
                      : "bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200"
                  }`}
                >
                  <h4 className="font-bold text-slate-900 mb-3 text-center">
                    Récapitulatif de votre choix
                  </h4>

                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-slate-600 flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Frais de livraison
                      </span>
                      <span className="font-semibold">{DELIVERY_FEE} TND</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-slate-600 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Le client paie
                      </span>
                      <span
                        className={`font-semibold ${paymentType === "free" ? "text-slate-400" : "text-emerald-600"}`}
                      >
                        {paymentType === "free"
                          ? "0 TND (gratuit)"
                          : `${paymentAmount || "0"} TND`}
                      </span>
                    </div>

                    <div
                      className={`flex justify-between items-center pt-1 ${
                        paymentType === "free"
                          ? "text-orange-700"
                          : "text-emerald-700"
                      }`}
                    >
                      <span className="font-bold flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Vous payez
                      </span>
                      <span className="text-xl font-bold">
                        {paymentType === "free"
                          ? `${DELIVERY_FEE} TND`
                          : "0 TND"}
                      </span>
                    </div>
                  </div>

                  {paymentType === "free" && (
                    <p className="text-xs text-orange-700 text-center mt-3">
                      Ce montant sera déduit lors du ramassage
                    </p>
                  )}
                  {paymentType === "paid" &&
                    parseFloat(paymentAmount) >= DELIVERY_FEE && (
                      <p className="text-xs text-emerald-700 text-center mt-3">
                        Les frais de livraison sont couverts par le paiement
                        client
                      </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowValidateModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={validateExchange}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                      paymentType === "free"
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Confirmer
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

        {showPrintModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Échange validé !
                </h3>
                <p className="text-emerald-100">{exchange?.exchange_code}</p>
              </div>

              <div className="p-6">
                <div className="bg-sky-50 border-2 border-sky-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Printer className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sky-900 mb-1">
                        Prochaine étape
                      </h4>
                      <p className="text-sm text-sky-700">
                        Imprimez le bordereau pour préparer l'expédition du
                        colis au client.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowPrintModal(false);
                      printBordereauGo();
                    }}
                    className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer className="w-5 h-5" />
                    Imprimer le bordereau
                  </button>
                  <button
                    onClick={() => setShowPrintModal(false)}
                    className="w-full py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  >
                    Imprimer plus tard
                  </button>
                </div>

                <p className="text-xs text-slate-500 text-center mt-4">
                  Vous pourrez toujours imprimer le bordereau depuis la page de
                  l'échange
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MerchantLayout>
  );
}
