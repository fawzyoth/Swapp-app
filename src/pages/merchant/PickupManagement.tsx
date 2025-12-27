import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  Package,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  RefreshCw,
  Send,
  Printer,
  FileText,
  DollarSign,
} from "lucide-react";

// Delivery fee constant - 9 TND per package
const DELIVERY_FEE = 9;
import { supabase } from "../../lib/supabase";
import MerchantLayout from "../../components/MerchantLayout";
import {
  isPickupDay,
  getNextPickupDate,
  formatPickupDate,
  schedulePickupForColis,
  DEFAULT_JAX_TOKEN,
  getGovernorateId,
} from "../../lib/jaxService";

interface ExchangeWithJax {
  id: string;
  exchange_code: string;
  client_name: string;
  client_address: string;
  client_city: string;
  product_name: string;
  status: string;
  jax_ean: string | null;
  jax_pickup_scheduled: boolean;
  created_at: string;
  payment_amount: number;
  delivery_fee: number;
  merchant_delivery_charge: number;
  payment_status: string;
}

interface ScheduledPickup {
  id: string;
  date: string;
  colis: ExchangeWithJax[];
  totalAmount: number;
  totalDeliveryFees: number;
  totalMerchantCharge: number;
}

interface PickupHistoryItem {
  id: string;
  date: string;
  colisCount: number;
  totalAmount: number;
  totalDeliveryFees: number;
  totalMerchantCharge: number;
  colis: ExchangeWithJax[];
}

export default function PickupManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scheduling, setScheduling] = useState(false);
  const [exchanges, setExchanges] = useState<ExchangeWithJax[]>([]);
  const [selectedEans, setSelectedEans] = useState<string[]>([]);
  const [merchant, setMerchant] = useState<any>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [lastScheduledPickup, setLastScheduledPickup] =
    useState<ScheduledPickup | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [pickupHistory, setPickupHistory] = useState<PickupHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"pickup" | "history">("pickup");
  const [selectedHistoryPickup, setSelectedHistoryPickup] =
    useState<PickupHistoryItem | null>(null);

  const todayIsPickupDay = isPickupDay() || testMode; // Allow test mode to bypass day check
  const nextPickupDate = getNextPickupDate();
  const nextPickupDateFormatted = formatPickupDate(nextPickupDate);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/merchant/login");
        return;
      }

      // Get merchant
      const { data: merchantData } = await supabase
        .from("merchants")
        .select("*")
        .eq("email", session.user.email)
        .maybeSingle();

      if (!merchantData) {
        setError("Marchand non trouve");
        setLoading(false);
        return;
      }

      setMerchant(merchantData);

      // Get exchanges - use select("*") to get all available columns
      // Some columns like jax_ean may or may not exist in the database
      const { data: exchangesData, error: exchangesError } = await supabase
        .from("exchanges")
        .select("*")
        .eq("merchant_id", merchantData.id)
        .in("status", [
          "approved",
          "validated",
          "ready_for_pickup",
          "in_transit",
        ])
        .order("created_at", { ascending: false });

      if (exchangesError) throw exchangesError;

      // Filter to only exchanges with JAX EAN and add pickup status
      const exchangesWithJax = (exchangesData || [])
        .filter((e) => e.jax_ean) // Only include exchanges that have JAX EAN
        .map((e) => ({
          id: e.id,
          exchange_code: e.exchange_code,
          client_name: e.client_name,
          client_address: e.client_address || "",
          client_city: e.client_city || "",
          product_name: e.product_name || "",
          status: e.status,
          jax_ean: e.jax_ean,
          jax_pickup_scheduled: false, // Default to false since column doesn't exist
          created_at: e.created_at,
          payment_amount: e.payment_amount || 0,
          delivery_fee: e.delivery_fee || DELIVERY_FEE, // Default to 9 TND if not set
          merchant_delivery_charge:
            e.merchant_delivery_charge ||
            (e.payment_status === "free" ? DELIVERY_FEE : 0),
          payment_status: e.payment_status || "pending",
        }));

      setExchanges(exchangesWithJax);

      // Load pickup history from localStorage
      const savedHistory = localStorage.getItem(
        `pickup_history_${merchantData.id}`,
      );
      if (savedHistory) {
        try {
          setPickupHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error("Error parsing pickup history:", e);
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Erreur lors du chargement des donnees");
    } finally {
      setLoading(false);
    }
  };

  const pendingPickupExchanges = exchanges.filter(
    (e) => e.jax_ean && !e.jax_pickup_scheduled,
  );

  const scheduledExchanges = exchanges.filter(
    (e) => e.jax_ean && e.jax_pickup_scheduled,
  );

  const toggleSelectEan = (ean: string) => {
    setSelectedEans((prev) =>
      prev.includes(ean) ? prev.filter((e) => e !== ean) : [...prev, ean],
    );
  };

  const selectAll = () => {
    const allEans = pendingPickupExchanges
      .map((e) => e.jax_ean)
      .filter((ean): ean is string => ean !== null);
    setSelectedEans(allEans);
  };

  const deselectAll = () => {
    setSelectedEans([]);
  };

  // Format currency
  const formatAmount = (amount: number) => {
    return amount.toFixed(3) + " TND";
  };

  // Print Bordereau de Sortie Expéditeur
  const printBordereauSortie = (pickup: ScheduledPickup) => {
    const printWindow = window.open("", "", "height=800,width=600");
    if (!printWindow) return;

    const today = new Date();
    const dateStr = today.toLocaleDateString("fr-TN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bordereau de Sortie - ${pickup.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #000;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .header h2 {
            font-size: 18px;
            color: #333;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 5px;
          }
          .info-block h3 {
            font-size: 12px;
            color: #666;
            margin-bottom: 3px;
          }
          .info-block p {
            font-size: 14px;
            font-weight: bold;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            padding: 15px;
            background: #000;
            color: #fff;
            border-radius: 5px;
          }
          .summary-item {
            text-align: center;
          }
          .summary-item .number {
            font-size: 28px;
            font-weight: bold;
          }
          .summary-item .label {
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            font-size: 11px;
          }
          th {
            background: #000;
            color: #fff;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background: #f9f9f9;
          }
          .ean-code {
            font-family: monospace;
            font-weight: bold;
            font-size: 12px;
          }
          .amount {
            text-align: right;
            font-weight: bold;
          }
          .total-row {
            background: #f0f0f0 !important;
            font-weight: bold;
          }
          .total-row td {
            font-size: 13px;
          }
          .footer {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            width: 45%;
            border: 1px solid #000;
            padding: 15px;
            text-align: center;
          }
          .signature-box h4 {
            font-size: 12px;
            margin-bottom: 40px;
          }
          .signature-line {
            border-top: 1px solid #000;
            margin-top: 30px;
            padding-top: 5px;
            font-size: 10px;
          }
          .jax-logo {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #666;
          }
          @media print {
            body { padding: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BORDEREAU DE SORTIE EXPEDITEUR</h1>
          <h2>BON DE RAMASSAGE JAX DELIVERY</h2>
        </div>

        <div class="info-section">
          <div class="info-block">
            <h3>EXPEDITEUR</h3>
            <p>${merchant?.business_name || merchant?.name || "N/A"}</p>
            <p style="font-weight: normal; font-size: 12px;">${merchant?.business_address || ""}</p>
            <p style="font-weight: normal; font-size: 12px;">${merchant?.phone || ""}</p>
          </div>
          <div class="info-block" style="text-align: right;">
            <h3>DATE DE RAMASSAGE</h3>
            <p>${dateStr}</p>
            <h3 style="margin-top: 10px;">N° BON</h3>
            <p>${pickup.id}</p>
          </div>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="number">${pickup.colis.length}</div>
            <div class="label">COLIS TOTAL</div>
          </div>
          <div class="summary-item">
            <div class="number">${pickup.totalDeliveryFees.toFixed(3)}</div>
            <div class="label">FRAIS LIVRAISON (TND)</div>
          </div>
          <div class="summary-item" style="background: #991b1b;">
            <div class="number">${pickup.totalMerchantCharge.toFixed(3)}</div>
            <div class="label">À VOTRE CHARGE (TND)</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>CODE EAN JAX</th>
              <th>REFERENCE</th>
              <th>DESTINATAIRE</th>
              <th>VILLE</th>
              <th style="text-align: center;">TYPE</th>
              <th style="text-align: right;">LIVRAISON</th>
              <th style="text-align: right;">À CHARGE</th>
            </tr>
          </thead>
          <tbody>
            ${pickup.colis
              .map(
                (colis, index) => `
              <tr>
                <td>${index + 1}</td>
                <td class="ean-code">${colis.jax_ean}</td>
                <td>${colis.exchange_code}</td>
                <td>${colis.client_name}</td>
                <td>${colis.client_city || "-"}</td>
                <td style="text-align: center;">
                  <span style="padding: 2px 6px; border-radius: 4px; font-size: 10px; ${colis.payment_status === "free" ? "background: #fee2e2; color: #991b1b;" : "background: #d1fae5; color: #065f46;"}">
                    ${colis.payment_status === "free" ? "GRATUIT" : "PAYANT"}
                  </span>
                </td>
                <td class="amount">${(colis.delivery_fee || 9).toFixed(3)} TND</td>
                <td class="amount" style="${colis.merchant_delivery_charge > 0 ? "color: #dc2626; font-weight: bold;" : ""}">${(colis.merchant_delivery_charge || 0).toFixed(3)} TND</td>
              </tr>
            `,
              )
              .join("")}
            <tr class="total-row">
              <td colspan="6" style="text-align: right;">TOTAL FRAIS DE LIVRAISON:</td>
              <td class="amount">${pickup.totalDeliveryFees.toFixed(3)} TND</td>
              <td></td>
            </tr>
            <tr class="total-row" style="background: #fef2f2 !important;">
              <td colspan="6" style="text-align: right; color: #991b1b;">TOTAL À VOTRE CHARGE:</td>
              <td></td>
              <td class="amount" style="color: #dc2626; font-weight: bold;">${pickup.totalMerchantCharge.toFixed(3)} TND</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <div class="signature-box">
            <h4>SIGNATURE EXPEDITEUR</h4>
            <div class="signature-line">Date: ___/___/______</div>
          </div>
          <div class="signature-box">
            <h4>SIGNATURE LIVREUR JAX</h4>
            <div class="signature-line">Date: ___/___/______</div>
          </div>
        </div>

        <div class="jax-logo">
          <p>Partenaire logistique: JAX DELIVERY</p>
          <p style="font-size: 10px; margin-top: 5px;">Document généré par SWAPP - ${today.toISOString()}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSchedulePickup = async () => {
    if (selectedEans.length === 0) {
      setError("Veuillez selectionner au moins un colis");
      return;
    }

    if (!todayIsPickupDay) {
      setError(
        "Les ramassages ne sont disponibles que le Mercredi et Dimanche",
      );
      return;
    }

    if (!merchant?.business_address) {
      setError("Veuillez configurer votre adresse dans Parametres > Marque");
      return;
    }

    setScheduling(true);
    setError("");
    setSuccess("");

    try {
      const gouvernoratId = getGovernorateId(merchant.business_city || "Tunis");

      const result = await schedulePickupForColis(
        DEFAULT_JAX_TOKEN,
        selectedEans,
        merchant.business_address,
        gouvernoratId,
        `Ramassage SWAPP - ${selectedEans.length} colis`,
      );

      if (result.success) {
        // Get the scheduled colis for the bordereau
        const scheduledColis = exchanges.filter(
          (e) => e.jax_ean && selectedEans.includes(e.jax_ean),
        );

        // Calculate totals
        const totalAmount = scheduledColis.reduce(
          (sum, colis) => sum + (colis.payment_amount || 0),
          0,
        );
        const totalDeliveryFees = scheduledColis.reduce(
          (sum, colis) => sum + (colis.delivery_fee || DELIVERY_FEE),
          0,
        );
        const totalMerchantCharge = scheduledColis.reduce(
          (sum, colis) => sum + (colis.merchant_delivery_charge || 0),
          0,
        );

        // Create pickup record
        const pickupId = `RAM-${Date.now().toString(36).toUpperCase()}`;
        const pickup: ScheduledPickup = {
          id: pickupId,
          date: new Date().toISOString(),
          colis: scheduledColis,
          totalAmount,
          totalDeliveryFees,
          totalMerchantCharge,
        };

        setLastScheduledPickup(pickup);

        // Save to pickup history
        const historyItem: PickupHistoryItem = {
          id: pickupId,
          date: new Date().toISOString(),
          colisCount: scheduledColis.length,
          totalAmount,
          totalDeliveryFees,
          totalMerchantCharge,
          colis: scheduledColis,
        };

        const updatedHistory = [historyItem, ...pickupHistory];
        setPickupHistory(updatedHistory);

        // Persist history to localStorage
        if (merchant?.id) {
          localStorage.setItem(
            `pickup_history_${merchant.id}`,
            JSON.stringify(updatedHistory),
          );
        }

        const chargeMessage =
          totalMerchantCharge > 0
            ? ` Frais à votre charge: ${formatAmount(totalMerchantCharge)}`
            : "";
        setSuccess(
          `Ramassage programmé avec succès pour ${selectedEans.length} colis!${chargeMessage} Vous pouvez imprimer le bordereau de sortie.`,
        );
        setSelectedEans([]);

        // Remove scheduled exchanges from the list locally
        setExchanges((prev) =>
          prev.filter((e) => !e.jax_ean || !selectedEans.includes(e.jax_ean)),
        );

        // Auto-print the bordereau de sortie
        printBordereauSortie(pickup);
      } else {
        setError(
          result.error || "Erreur lors de la programmation du ramassage",
        );
      }
    } catch (err) {
      console.error("Pickup scheduling error:", err);
      setError("Erreur lors de la programmation du ramassage");
    } finally {
      setScheduling(false);
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

  return (
    <MerchantLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Truck className="w-7 h-7 text-sky-600" />
              Gestion des Ramassages
            </h1>
            <p className="text-slate-600 mt-1">
              Programmez le ramassage de vos colis par JAX Delivery
            </p>
          </div>
          {/* Test Mode Toggle */}
          <button
            onClick={() => setTestMode(!testMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              testMode
                ? "bg-orange-100 text-orange-700 border border-orange-300"
                : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
            }`}
          >
            {testMode ? "Mode Test: ON" : "Mode Test"}
          </button>
        </div>

        {/* Tab Switch */}
        <div className="mb-6 flex bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("pickup")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === "pickup"
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Send className="w-4 h-4" />
            Demande de ramassage
            {pendingPickupExchanges.length > 0 && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  activeTab === "pickup"
                    ? "bg-sky-100 text-sky-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {pendingPickupExchanges.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === "history"
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-4 h-4" />
            Historique
            {pickupHistory.length > 0 && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  activeTab === "history"
                    ? "bg-sky-100 text-sky-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {pickupHistory.length}
              </span>
            )}
          </button>
        </div>

        {/* ===== PICKUP TAB ===== */}
        {activeTab === "pickup" && (
          <>
            {/* Pickup Schedule Info */}
            <div
              className={`mb-6 p-4 rounded-xl border-2 ${
                todayIsPickupDay
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full ${
                    todayIsPickupDay ? "bg-emerald-100" : "bg-amber-100"
                  }`}
                >
                  <Calendar
                    className={`w-6 h-6 ${
                      todayIsPickupDay ? "text-emerald-600" : "text-amber-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${
                      todayIsPickupDay ? "text-emerald-900" : "text-amber-900"
                    }`}
                  >
                    {todayIsPickupDay
                      ? "Aujourd'hui est un jour de ramassage!"
                      : "Prochain jour de ramassage"}
                  </h3>
                  <p
                    className={`text-sm ${
                      todayIsPickupDay ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {todayIsPickupDay
                      ? "Vous pouvez programmer le ramassage de vos colis maintenant."
                      : `Les ramassages sont disponibles uniquement le Mercredi et Dimanche.`}
                  </p>
                  <div
                    className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      todayIsPickupDay
                        ? "bg-emerald-200 text-emerald-800"
                        : "bg-amber-200 text-amber-800"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    {nextPickupDateFormatted}
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800 flex-1">{success}</span>
                </div>
                {lastScheduledPickup && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => printBordereauSortie(lastScheduledPickup)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                    >
                      <Printer className="w-4 h-4" />
                      Reimprimer le Bordereau de Sortie
                    </button>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {pendingPickupExchanges.length}
                    </p>
                    <p className="text-sm text-slate-600">
                      En attente de ramassage
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {scheduledExchanges.length}
                    </p>
                    <p className="text-sm text-slate-600">
                      Ramassage programme
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Pickup List */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">
                  Colis en attente de ramassage
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadData}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Actualiser"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  {pendingPickupExchanges.length > 0 && (
                    <>
                      <button
                        onClick={selectAll}
                        className="text-sm text-sky-600 hover:text-sky-700"
                      >
                        Tout selectionner
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={deselectAll}
                        className="text-sm text-slate-500 hover:text-slate-700"
                      >
                        Deselectionner
                      </button>
                    </>
                  )}
                </div>
              </div>

              {pendingPickupExchanges.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">
                    Aucun colis en attente de ramassage
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Les colis apparaissent ici apres l'impression du bordereau
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingPickupExchanges.map((exchange) => (
                    <div
                      key={exchange.id}
                      className={`p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                        exchange.jax_ean &&
                        selectedEans.includes(exchange.jax_ean)
                          ? "bg-sky-50"
                          : ""
                      }`}
                      onClick={() =>
                        exchange.jax_ean && toggleSelectEan(exchange.jax_ean)
                      }
                    >
                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          exchange.jax_ean &&
                          selectedEans.includes(exchange.jax_ean)
                            ? "bg-sky-600 border-sky-600"
                            : "border-slate-300"
                        }`}
                      >
                        {exchange.jax_ean &&
                          selectedEans.includes(exchange.jax_ean) && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-sky-600">
                            {exchange.jax_ean}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-sm text-slate-600">
                            {exchange.exchange_code}
                          </span>
                        </div>
                        <p className="text-sm text-slate-900 font-medium truncate">
                          {exchange.client_name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="w-3 h-3" />
                          {exchange.client_city || exchange.client_address}
                        </div>
                      </div>

                      {/* Type & Fees */}
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-1 ${
                            exchange.payment_status === "free"
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {exchange.payment_status === "free"
                            ? "Gratuit"
                            : "Payant"}
                        </span>
                        <p className="text-xs text-slate-500">
                          Livraison:{" "}
                          {formatAmount(exchange.delivery_fee || DELIVERY_FEE)}
                        </p>
                        {exchange.merchant_delivery_charge > 0 && (
                          <p className="text-xs font-medium text-red-600">
                            À charge:{" "}
                            {formatAmount(exchange.merchant_delivery_charge)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Schedule Button */}
              {pendingPickupExchanges.length > 0 && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                  {/* Selected total */}
                  {selectedEans.length > 0 &&
                    (() => {
                      const selectedColis = pendingPickupExchanges.filter(
                        (e) => e.jax_ean && selectedEans.includes(e.jax_ean),
                      );
                      const totalDeliveryFees = selectedColis.reduce(
                        (sum, e) => sum + (e.delivery_fee || DELIVERY_FEE),
                        0,
                      );
                      const totalMerchantCharge = selectedColis.reduce(
                        (sum, e) => sum + (e.merchant_delivery_charge || 0),
                        0,
                      );
                      const freeCount = selectedColis.filter(
                        (e) => e.payment_status === "free",
                      ).length;

                      return (
                        <div className="mb-3 space-y-2">
                          <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-sky-800">
                                {selectedEans.length} colis sélectionné(s)
                              </span>
                              <span className="text-sm text-sky-700">
                                Frais livraison:{" "}
                                {formatAmount(totalDeliveryFees)}
                              </span>
                            </div>
                            {freeCount > 0 && (
                              <div className="text-xs text-sky-600">
                                {freeCount} échange(s) gratuit(s) •{" "}
                                {selectedEans.length - freeCount} échange(s)
                                payant(s)
                              </div>
                            )}
                          </div>
                          {totalMerchantCharge > 0 && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-800">
                                  À votre charge (échanges gratuits)
                                </span>
                              </div>
                              <span className="text-lg font-bold text-red-700">
                                {formatAmount(totalMerchantCharge)}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  <button
                    onClick={handleSchedulePickup}
                    disabled={
                      !todayIsPickupDay ||
                      selectedEans.length === 0 ||
                      scheduling
                    }
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                      todayIsPickupDay && selectedEans.length > 0
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {scheduling ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Programmation en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {todayIsPickupDay
                          ? `Programmer le ramassage (${selectedEans.length} colis)`
                          : `Disponible le ${nextPickupDateFormatted}`}
                      </>
                    )}
                  </button>
                  {!todayIsPickupDay && (
                    <p className="text-center text-sm text-slate-500 mt-2">
                      Les ramassages sont uniquement disponibles le Mercredi et
                      Dimanche
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Scheduled Pickups */}
            {scheduledExchanges.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h2 className="font-semibold text-slate-900">
                    Ramassages programmes
                  </h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {scheduledExchanges.map((exchange) => (
                    <div
                      key={exchange.id}
                      className="p-4 flex items-center gap-4"
                    >
                      <div className="p-2 bg-emerald-100 rounded-full">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-emerald-600">
                            {exchange.jax_ean}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-sm text-slate-600">
                            {exchange.exchange_code}
                          </span>
                        </div>
                        <p className="text-sm text-slate-900">
                          {exchange.client_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-emerald-600">
                          {formatAmount(exchange.payment_amount)}
                        </span>
                        <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          Programme
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ===== HISTORY TAB ===== */}
        {activeTab === "history" && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {pickupHistory.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg text-slate-500 font-medium">
                  Aucun historique de ramassage
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Les ramassages programmés apparaîtront ici
                </p>
              </div>
            ) : (
              <>
                {/* History List */}
                <div className="divide-y divide-slate-100">
                  {pickupHistory.map((pickup) => (
                    <div key={pickup.id} className="p-4">
                      {/* Pickup Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-full">
                            <FileText className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-mono text-sm font-bold text-slate-800">
                              {pickup.id}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(pickup.date).toLocaleDateString(
                                "fr-TN",
                                {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-lg font-bold text-emerald-600">
                              {formatAmount(pickup.totalAmount)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {pickup.colisCount} colis
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              printBordereauSortie({
                                ...pickup,
                                totalAmount: pickup.totalAmount,
                              })
                            }
                            className="p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors"
                            title="Imprimer le bordereau"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Colis Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        {pickup.colis.map((colis, idx) => (
                          <div
                            key={colis.id}
                            className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 flex-shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-slate-700 truncate">
                                {colis.client_name}
                              </span>
                            </div>
                            <span className="font-semibold text-emerald-600 ml-2 flex-shrink-0">
                              {formatAmount(colis.payment_amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* History Summary Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Total:{" "}
                      {pickupHistory.reduce((sum, p) => sum + p.colisCount, 0)}{" "}
                      colis
                      <span className="text-slate-400 mx-2">•</span>
                      {pickupHistory.length} ramassage(s)
                    </span>
                    <span className="text-xl font-bold text-slate-900">
                      {formatAmount(
                        pickupHistory.reduce(
                          (sum, p) => sum + p.totalAmount,
                          0,
                        ),
                      )}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </MerchantLayout>
  );
}
