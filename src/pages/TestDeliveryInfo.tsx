import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Banknote,
  FileText,
  Video,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Truck,
  Info,
  Link as LinkIcon,
} from "lucide-react";
import { supabase, STATUS_LABELS } from "../lib/supabase";

interface ExchangeData {
  id: string;
  exchange_code: string;
  status: string;
  client_name: string;
  client_phone: string;
  client_address: string;
  client_governorate_id: number;
  client_delegation: string;
  client_country: string;
  product_name: string;
  reason: string;
  payment_amount: number;
  delivery_fee: number;
  merchant_delivery_charge: number;
  payment_status: string;
  delivery_company: string;
  created_at: string;
  updated_at: string;
  media?: {
    video_url?: string;
    images?: string[];
  };
  merchant?: {
    id: string;
    name: string;
    store_name: string;
    email: string;
    phone: string;
    business_address: string;
  };
}

export default function TestDeliveryInfo() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [exchange, setExchange] = useState<ExchangeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (code) {
      fetchExchangeData();
    }
  }, [code]);

  const fetchExchangeData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch exchange data
      const { data, error: exchangeError } = await supabase
        .from("exchanges")
        .select(`
          *,
          merchants (
            id,
            name,
            store_name,
            email,
            phone,
            business_address
          )
        `)
        .eq("exchange_code", code)
        .maybeSingle();

      if (exchangeError) throw exchangeError;
      if (!data) throw new Error("Échange non trouvé");

      // Fetch media (videos and images)
      const { data: mediaData } = await supabase
        .from("exchange_media")
        .select("*")
        .eq("exchange_id", data.id)
        .maybeSingle();

      setExchange({
        ...data,
        merchant: data.merchants,
        media: mediaData || undefined,
      });
    } catch (err: any) {
      console.error("Error fetching exchange:", err);
      setError(err.message || "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error || !exchange) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Erreur</h1>
          <p className="text-slate-600 mb-6">{error || "Échange non trouvé"}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "picked_up":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "in_transit":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Test Delivery - Informations complètes
                  </h1>
                  <p className="text-slate-600">Code: {exchange.exchange_code}</p>
                </div>
              </div>
              <div
                className={`px-4 py-2 rounded-xl font-semibold border-2 ${getStatusColor(exchange.status)}`}
              >
                {STATUS_LABELS[exchange.status] || exchange.status}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Client Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">Informations Client</h2>
              </div>
              <div className="space-y-3">
                <InfoRow icon={<User className="w-5 h-5" />} label="Nom" value={exchange.client_name} />
                <InfoRow
                  icon={<Phone className="w-5 h-5" />}
                  label="Téléphone"
                  value={exchange.client_phone}
                />
                <InfoRow
                  icon={<MapPin className="w-5 h-5" />}
                  label="Adresse"
                  value={exchange.client_address}
                />
                <InfoRow icon={<MapPin className="w-5 h-5" />} label="Délégation" value={exchange.client_delegation} />
                <InfoRow icon={<MapPin className="w-5 h-5" />} label="Pays" value={exchange.client_country} />
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                <Package className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-slate-900">Informations Produit</h2>
              </div>
              <div className="space-y-3">
                <InfoRow icon={<Package className="w-5 h-5" />} label="Produit" value={exchange.product_name} />
                <InfoRow icon={<FileText className="w-5 h-5" />} label="Raison" value={exchange.reason} />
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                <Banknote className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900">Informations Paiement</h2>
              </div>
              <div className="space-y-3">
                <InfoRow
                  icon={<Banknote className="w-5 h-5" />}
                  label="Montant Client"
                  value={`${exchange.payment_amount} TND`}
                />
                <InfoRow
                  icon={<Banknote className="w-5 h-5" />}
                  label="Frais Livraison"
                  value={`${exchange.delivery_fee} TND`}
                />
                <InfoRow
                  icon={<Banknote className="w-5 h-5" />}
                  label="Charge Marchand"
                  value={`${exchange.merchant_delivery_charge} TND`}
                />
                <InfoRow
                  icon={<CheckCircle className="w-5 h-5" />}
                  label="Statut Paiement"
                  value={exchange.payment_status === "free" ? "Gratuit" : exchange.payment_status}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Merchant Information */}
            {exchange.merchant && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                  <Truck className="w-6 h-6 text-amber-600" />
                  <h2 className="text-xl font-bold text-slate-900">Informations Marchand</h2>
                </div>
                <div className="space-y-3">
                  <InfoRow icon={<User className="w-5 h-5" />} label="Nom" value={exchange.merchant.store_name || exchange.merchant.name} />
                  <InfoRow icon={<Phone className="w-5 h-5" />} label="Téléphone" value={exchange.merchant.phone} />
                  <InfoRow icon={<MapPin className="w-5 h-5" />} label="Adresse" value={exchange.merchant.business_address} />
                </div>
              </div>
            )}

            {/* System Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                <Info className="w-6 h-6 text-slate-600" />
                <h2 className="text-xl font-bold text-slate-900">Informations Système</h2>
              </div>
              <div className="space-y-3">
                <InfoRow icon={<FileText className="w-5 h-5" />} label="ID" value={exchange.id} />
                <InfoRow
                  icon={<Truck className="w-5 h-5" />}
                  label="Société Livraison"
                  value={exchange.delivery_company}
                />
                <InfoRow
                  icon={<Calendar className="w-5 h-5" />}
                  label="Créé le"
                  value={new Date(exchange.created_at).toLocaleString("fr-FR")}
                />
                <InfoRow
                  icon={<Clock className="w-5 h-5" />}
                  label="Modifié le"
                  value={new Date(exchange.updated_at).toLocaleString("fr-FR")}
                />
              </div>
            </div>

            {/* Media Information */}
            {exchange.media && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                  <Video className="w-6 h-6 text-red-600" />
                  <h2 className="text-xl font-bold text-slate-900">Médias</h2>
                </div>
                <div className="space-y-4">
                  {/* Video */}
                  {exchange.media.video_url && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-slate-900">Vidéo:</span>
                      </div>
                      <a
                        href={exchange.media.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                      >
                        <LinkIcon className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-700 font-medium truncate">
                          Ouvrir la vidéo
                        </span>
                      </a>
                      <video
                        src={exchange.media.video_url}
                        controls
                        className="w-full mt-3 rounded-xl"
                      />
                    </div>
                  )}

                  {/* Images */}
                  {exchange.media.images && exchange.media.images.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-slate-900">
                          Images ({exchange.media.images.length}):
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {exchange.media.images.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-xl border-2 border-slate-200"
                            />
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center"
                            >
                              <LinkIcon className="w-6 h-6 text-white" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!exchange.media.video_url && (!exchange.media.images || exchange.media.images.length === 0) && (
                    <p className="text-slate-500 text-center py-4">Aucun média disponible</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Raw JSON Data */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
            <FileText className="w-6 h-6 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-900">Données JSON Brutes (API Response)</h2>
          </div>
          <pre className="bg-slate-900 text-green-400 p-4 rounded-xl overflow-x-auto text-xs font-mono">
            {JSON.stringify(exchange, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-slate-500 mt-0.5">{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-slate-500 font-medium">{label}</div>
        <div className="text-slate-900 font-semibold break-words">{value}</div>
      </div>
    </div>
  );
}
