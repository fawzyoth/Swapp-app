import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Store,
  Calculator,
  Wallet,
  CreditCard,
  Truck,
  Search,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Barcode,
  User,
  FileText,
  Banknote,
  Video,
  History,
  Eye,
  MessageSquare,
  Play,
  Shield,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import AdminLayout from "../../components/AdminLayout";

interface SearchResult {
  id: string;
  exchange_code: string;
  jax_ean: string;
  status: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  client_city: string;
  product_name: string;
  product_size: string;
  reason: string;
  payment_option: string;
  payment_amount: number;
  item_count: number;
  created_at: string;
  validated_at: string;
  completed_at: string;
  merchant: {
    id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
  delivery_person: {
    id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
}

export default function AdminDashboard() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pending verifications
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Detail modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [merchantsRes, exchangesRes, pendingVerificationsRes] = await Promise.all([
        // Only select fields needed for display - NO logo_base64
        supabase.from("merchants").select("id, name, email"),
        // Only select fields needed for stats - NO video, NO images
        supabase.from("exchanges").select("merchant_id, status"),
        // Fetch pending verification requests
        supabase
          .from("merchants")
          .select("id, name, email, phone, business_type, verification_document_url, verification_status, created_at")
          .eq("verification_status", "pending")
          .order("created_at", { ascending: false }),
      ]);

      setMerchants(merchantsRes.data || []);
      setExchanges(exchangesRes.data || []);
      setPendingVerifications(pendingVerificationsRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    setShowSearchResults(true);
    setSearchError(null);

    try {
      const query = searchQuery.trim().toLowerCase();

      // Fetch all exchanges and filter client-side for reliable search
      const { data: exchangeResults, error } = await supabase
        .from("exchanges")
        .select(`
          id,
          exchange_code,
          jax_ean,
          status,
          client_name,
          client_phone,
          client_address,
          client_city,
          product_name,
          reason,
          payment_amount,
          item_count,
          created_at,
          validated_at,
          completed_at,
          merchant_id,
          delivery_person_id
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        setSearchError(`Erreur DB: ${error.message}`);
        throw error;
      }

      console.log("Total exchanges fetched:", exchangeResults?.length);
      console.log("Search query:", query);

      // Log first few exchanges to see structure
      if (exchangeResults && exchangeResults.length > 0) {
        console.log("Sample exchange:", {
          exchange_code: exchangeResults[0].exchange_code,
          client_name: exchangeResults[0].client_name,
          client_phone: exchangeResults[0].client_phone,
        });
      }

      // Filter client-side for reliable search across all fields
      const filtered = (exchangeResults || []).filter((e: any) => {
        const searchFields = [
          e.exchange_code,
          e.jax_ean,
          e.client_name,
          e.client_phone,
          e.product_name,
          e.id, // Also search by ID
        ];
        const matches = searchFields.some(
          (field) => field && String(field).toLowerCase().includes(query)
        );
        return matches;
      });

      console.log("Filtered results:", filtered.length);

      // Get unique merchant and delivery person IDs from filtered results
      const merchantIds = [...new Set(filtered.map((e: any) => e.merchant_id).filter(Boolean))];
      const deliveryPersonIds = [...new Set(filtered.map((e: any) => e.delivery_person_id).filter(Boolean))];

      // Fetch merchant and delivery person details in parallel
      const [merchantsData, deliveryPersonsData] = await Promise.all([
        merchantIds.length > 0
          ? supabase.from("merchants").select("id, name, email, phone").in("id", merchantIds)
          : { data: [] },
        deliveryPersonIds.length > 0
          ? supabase.from("delivery_persons").select("id, name, email, phone").in("id", deliveryPersonIds)
          : { data: [] },
      ]);

      // Create lookup maps
      const merchantMap = new Map((merchantsData.data || []).map((m: any) => [m.id, m]));
      const deliveryPersonMap = new Map((deliveryPersonsData.data || []).map((d: any) => [d.id, d]));

      // Transform results to match interface (limit to 50)
      const results: SearchResult[] = filtered.slice(0, 50).map((e: any) => ({
        id: e.id,
        exchange_code: e.exchange_code,
        jax_ean: e.jax_ean,
        status: e.status,
        client_name: e.client_name,
        client_email: "", // Not in DB
        client_phone: e.client_phone,
        client_address: e.client_address,
        client_city: e.client_city,
        product_name: e.product_name,
        product_size: "", // Not in DB
        reason: e.reason,
        payment_option: "", // Not in DB
        payment_amount: e.payment_amount || 0,
        item_count: e.item_count || 1,
        created_at: e.created_at,
        validated_at: e.validated_at,
        completed_at: e.completed_at,
        merchant: e.merchant_id ? merchantMap.get(e.merchant_id) || null : null,
        delivery_person: e.delivery_person_id ? deliveryPersonMap.get(e.delivery_person_id) || null : null,
      }));

      setSearchResults(results);
    } catch (err: any) {
      console.error("Search error:", err);
      setSearchError(err.message || "Erreur de recherche");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const viewExchangeDetails = async (exchangeId: string) => {
    setDetailLoading(true);
    setShowDetailModal(true);

    try {
      // Fetch full exchange details including video
      const { data: exchangeData, error: exchangeError } = await supabase
        .from("exchanges")
        .select("*")
        .eq("id", exchangeId)
        .single();

      if (exchangeError) throw exchangeError;

      // Fetch merchant details
      let merchant = null;
      if (exchangeData.merchant_id) {
        const { data: merchantData } = await supabase
          .from("merchants")
          .select("id, name, email, phone")
          .eq("id", exchangeData.merchant_id)
          .single();
        merchant = merchantData;
      }

      // Fetch delivery person details
      let deliveryPerson = null;
      if (exchangeData.delivery_person_id) {
        const { data: dpData } = await supabase
          .from("delivery_persons")
          .select("id, name, email, phone")
          .eq("id", exchangeData.delivery_person_id)
          .single();
        deliveryPerson = dpData;
      }

      // Fetch status history
      const { data: historyData } = await supabase
        .from("status_history")
        .select("*")
        .eq("exchange_id", exchangeId)
        .order("created_at", { ascending: true });

      // Fetch messages
      const { data: messagesData } = await supabase
        .from("messages")
        .select("*")
        .eq("exchange_id", exchangeId)
        .order("created_at", { ascending: true });

      setSelectedExchange({ ...exchangeData, merchant, delivery_person: deliveryPerson });
      setStatusHistory(historyData || []);
      setMessages(messagesData || []);
    } catch (err) {
      console.error("Error fetching exchange details:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedExchange(null);
    setStatusHistory([]);
    setMessages([]);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "En attente",
      validated: "Validé",
      preparing: "En préparation",
      ready_for_pickup: "Prêt à enlever",
      in_transit: "En transit",
      completed: "Complété",
      rejected: "Rejeté",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700",
      validated: "bg-blue-100 text-blue-700",
      preparing: "bg-purple-100 text-purple-700",
      ready_for_pickup: "bg-cyan-100 text-cyan-700",
      in_transit: "bg-indigo-100 text-indigo-700",
      completed: "bg-emerald-100 text-emerald-700",
      rejected: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = {
    totalMerchants: merchants.length,
    totalExchanges: exchanges.length,
    pendingExchanges: exchanges.filter((e) => e.status === "pending").length,
    completedExchanges: exchanges.filter((e) => e.status === "completed")
      .length,
    validatedExchanges: exchanges.filter((e) =>
      ["validated", "preparing", "in_transit", "completed"].includes(e.status),
    ).length,
    rejectedExchanges: exchanges.filter((e) => e.status === "rejected").length,
  };

  const validationRate =
    stats.totalExchanges > 0
      ? Math.round((stats.validatedExchanges / stats.totalExchanges) * 100)
      : 0;

  // Get top merchants by exchange count
  const merchantStats = merchants
    .map((merchant) => {
      const merchantExchanges = exchanges.filter(
        (e) => e.merchant_id === merchant.id,
      );
      return {
        ...merchant,
        exchangeCount: merchantExchanges.length,
        validatedCount: merchantExchanges.filter((e) =>
          ["validated", "preparing", "in_transit", "completed"].includes(
            e.status,
          ),
        ).length,
      };
    })
    .sort((a, b) => b.exchangeCount - a.exchangeCount);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Dashboard Administration
          </h1>
          <p className="text-slate-600">Vue d'ensemble de la plateforme</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-600" />
            Rechercher un échange
          </h3>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Rechercher par téléphone, nom, code-barres (EAN) ou code ixmoove..."
                className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 transition-colors flex items-center gap-2"
            >
              {searchLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search className="w-5 h-5" />
              )}
              Rechercher
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Vous pouvez rechercher par numéro de téléphone, nom du client, code-barres EAN ou code ixmoove
          </p>
        </div>

        {/* Search Results */}
        {showSearchResults && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Résultats de recherche ({searchResults.length})
              </h3>
              <button
                onClick={clearSearch}
                className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Fermer
              </button>
            </div>

            {searchError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {searchError}
              </div>
            )}

            {searchLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Aucun résultat trouvé pour "{searchQuery}"</p>
                <p className="text-xs text-slate-400 mt-2">Vérifiez la console du navigateur (F12) pour plus de détails</p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="border border-slate-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    {/* Header with status and codes */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                          {getStatusLabel(result.status)}
                        </span>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Barcode className="w-4 h-4" />
                          <span className="font-mono text-sm">{result.exchange_code || "-"}</span>
                        </div>
                        {result.jax_ean && (
                          <div className="flex items-center gap-2 text-slate-500">
                            <span className="text-xs">EAN:</span>
                            <span className="font-mono text-sm">{result.jax_ean}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-slate-500">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {formatDate(result.created_at)}
                      </div>
                    </div>

                    {/* Main content grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Client Info */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          Client
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p className="font-medium text-slate-900">{result.client_name}</p>
                          <p className="text-slate-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {result.client_phone}
                          </p>
                          <p className="text-slate-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {result.client_email || "-"}
                          </p>
                          <p className="text-slate-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {result.client_address}, {result.client_city}
                          </p>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                          <Package className="w-4 h-4 text-purple-600" />
                          Produit
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p className="font-medium text-slate-900">{result.product_name}</p>
                          <p className="text-slate-600">Taille: {result.product_size || "-"}</p>
                          <p className="text-slate-600">Raison: {result.reason}</p>
                          <p className="text-slate-600">Nb articles: {result.item_count}</p>
                        </div>
                      </div>

                      {/* Merchant Info */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                          <Store className="w-4 h-4 text-emerald-600" />
                          Marchand
                        </h4>
                        {result.merchant ? (
                          <div className="space-y-1 text-sm">
                            <p className="font-medium text-slate-900">{result.merchant.name}</p>
                            <p className="text-slate-600 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {result.merchant.email}
                            </p>
                            <p className="text-slate-600 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {result.merchant.phone || "-"}
                            </p>
                            <Link
                              to={`/admin/merchant/${result.merchant.id}`}
                              className="text-purple-600 hover:text-purple-700 text-xs"
                            >
                              Voir profil →
                            </Link>
                          </div>
                        ) : (
                          <p className="text-slate-500 text-sm">Non assigné</p>
                        )}
                      </div>

                      {/* Delivery Person & Payment */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-amber-600" />
                            Livreur
                          </h4>
                          {result.delivery_person ? (
                            <div className="space-y-1 text-sm">
                              <p className="font-medium text-slate-900">{result.delivery_person.name}</p>
                              <p className="text-slate-600 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {result.delivery_person.phone || "-"}
                              </p>
                            </div>
                          ) : (
                            <p className="text-slate-500 text-sm">Non assigné</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-green-600" />
                            Paiement
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-slate-600">
                              {result.payment_amount > 0 ? `${result.payment_amount} TND` : "Gratuit"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dates footer */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span>Créé: {formatDate(result.created_at)}</span>
                        {result.validated_at && <span>Validé: {formatDate(result.validated_at)}</span>}
                        {result.completed_at && <span>Complété: {formatDate(result.completed_at)}</span>}
                      </div>
                      <button
                        onClick={() => viewExchangeDetails(result.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Voir détails complets
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pending Verification Requests */}
        {pendingVerifications.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                Demandes de vérification en attente
                <span className="ml-2 px-2 py-0.5 bg-amber-200 text-amber-800 text-sm rounded-full">
                  {pendingVerifications.length}
                </span>
              </h3>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="space-y-3">
              {pendingVerifications.map((merchant) => (
                <div
                  key={merchant.id}
                  className="bg-white rounded-lg border border-amber-200 p-4 hover:border-amber-400 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <Store className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{merchant.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {merchant.email}
                          </span>
                          {merchant.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {merchant.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                          {merchant.business_type === 'individual' ? (
                            <>
                              <CreditCard className="w-3 h-3" />
                              Particulier (CIN)
                            </>
                          ) : (
                            <>
                              <FileText className="w-3 h-3" />
                              Entreprise (Patente)
                            </>
                          )}
                        </span>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(merchant.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Link
                        to={`/admin/merchant/${merchant.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Vérifier
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">E-Commerçants</p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.totalMerchants}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Échanges</p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.totalExchanges}
                </p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-sky-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">En attente</p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.pendingExchanges}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">
                  Taux de validation
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {validationRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Statut des échanges
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-slate-600">Validés</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {stats.validatedExchanges}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-slate-600">Rejetés</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {stats.rejectedExchanges}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-500" />
                  <span className="text-slate-600">Complétés</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {stats.completedExchanges}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Top E-Commerçants
              </h3>
              <Link
                to="/admin/merchants"
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Voir tous
              </Link>
            </div>
            <div className="space-y-3">
              {merchantStats.slice(0, 5).map((merchant, index) => (
                <Link
                  key={merchant.id}
                  to={`/admin/merchant/${merchant.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Store className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {merchant.name}
                      </p>
                      <p className="text-xs text-slate-500">{merchant.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      {merchant.exchangeCount}
                    </p>
                    <p className="text-xs text-slate-500">échanges</p>
                  </div>
                </Link>
              ))}
              {merchantStats.length === 0 && (
                <p className="text-slate-500 text-center py-4">
                  Aucun e-commerçant
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Platform Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/finance/login"
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Finance</h3>
                <p className="text-emerald-100 text-sm">
                  Plateforme Financière
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/10 rounded-lg p-2">
                <Wallet className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs">Wallets</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <CreditCard className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs">Paiements</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs">Rapports</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/merchant-payments"
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Marchands</h3>
                <p className="text-blue-100 text-sm">Paiements Marchands</p>
              </div>
            </div>
            <p className="text-sm text-blue-100">
              Gérer les paiements bi-mensuels aux marchands
            </p>
          </Link>

          <Link
            to="/admin/delivery-persons"
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Livreurs</h3>
                <p className="text-orange-100 text-sm">Gestion des livreurs</p>
              </div>
            </div>
            <p className="text-sm text-orange-100">
              Gérer les livreurs et leurs vérifications
            </p>
          </Link>

          <Link
            to="/admin/finances"
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Rapports</h3>
                <p className="text-purple-100 text-sm">Tableau Financier</p>
              </div>
            </div>
            <p className="text-sm text-purple-100">
              Voir les statistiques financières
            </p>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Actions rapides
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/admin/merchant/new"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Ajouter un e-commerçant
            </Link>
            <Link
              to="/admin/merchants"
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Gérer les e-commerçants
            </Link>
            <Link
              to="/finance/dashboard"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Accéder à Finance
            </Link>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-600" />
                Détails complets de l'échange
              </h2>
              <button
                onClick={closeDetailModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {detailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : selectedExchange ? (
                <div className="space-y-6">
                  {/* Exchange Info Header */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(selectedExchange.status)}`}>
                          {getStatusLabel(selectedExchange.status)}
                        </span>
                        <div className="flex items-center gap-2 text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                          <Barcode className="w-4 h-4 text-purple-600" />
                          <span className="font-mono font-semibold">{selectedExchange.exchange_code || "-"}</span>
                        </div>
                        {selectedExchange.jax_ean && (
                          <div className="flex items-center gap-2 text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                            <span className="text-xs font-medium">EAN:</span>
                            <span className="font-mono">{selectedExchange.jax_ean}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                        ID: <span className="font-mono">{selectedExchange.id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Summary Card - Prominent */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-5 text-white shadow-lg">
                    <h4 className="font-bold text-lg flex items-center gap-2 mb-4">
                      <Banknote className="w-6 h-6" />
                      Informations Financières
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/20 rounded-lg p-3">
                        <p className="text-emerald-100 text-xs mb-1">Montant Client</p>
                        <p className="text-2xl font-bold">
                          {selectedExchange.payment_amount > 0 ? `${selectedExchange.payment_amount} TND` : "Gratuit"}
                        </p>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <p className="text-emerald-100 text-xs mb-1">Frais Livraison</p>
                        <p className="text-2xl font-bold">9 TND</p>
                        <p className="text-xs text-emerald-200">
                          {selectedExchange.client_pays_delivery === false ? "Payé par marchand" : "Payé par client"}
                        </p>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <p className="text-emerald-100 text-xs mb-1">Nb. Articles</p>
                        <p className="text-2xl font-bold">{selectedExchange.item_count || 1}</p>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <p className="text-emerald-100 text-xs mb-1">Total Estimé</p>
                        <p className="text-2xl font-bold">
                          {(selectedExchange.payment_amount || 0) + (selectedExchange.client_pays_delivery !== false ? 9 : 0)} TND
                        </p>
                      </div>
                    </div>
                    {selectedExchange.commission_amount && (
                      <div className="mt-3 pt-3 border-t border-white/20 text-sm">
                        <span className="text-emerald-200">Commission ixmoove:</span>
                        <span className="font-semibold ml-2">{selectedExchange.commission_amount} TND</span>
                      </div>
                    )}
                  </div>

                  {/* Rejection Reason if rejected */}
                  {selectedExchange.status === "rejected" && selectedExchange.rejection_reason && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <h4 className="font-semibold text-red-700 flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5" />
                        Raison du rejet
                      </h4>
                      <p className="text-red-600">{selectedExchange.rejection_reason}</p>
                    </div>
                  )}

                  {/* Media Section - Video & Images */}
                  {(selectedExchange.video || (selectedExchange.images && selectedExchange.images.length > 0)) ? (
                    <div className="space-y-4">
                      {/* Video Section */}
                      {selectedExchange.video && (
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-lg">
                          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <Play className="w-5 h-5 text-purple-400" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">Vidéo de preuve</h3>
                                <p className="text-xs text-slate-400">Vidéo enregistrée par le client</p>
                              </div>
                            </div>
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                              Média disponible
                            </span>
                          </div>
                          <div className="p-4">
                            <video
                              src={selectedExchange.video}
                              controls
                              className="w-full rounded-lg max-h-[400px] bg-black"
                            >
                              Votre navigateur ne supporte pas la lecture vidéo.
                            </video>
                          </div>
                        </div>
                      )}

                      {/* Images Section */}
                      {selectedExchange.images && selectedExchange.images.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Eye className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900">Photos du produit</h3>
                                <p className="text-xs text-slate-500">Cliquez pour agrandir</p>
                              </div>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                              {selectedExchange.images.length} photo(s)
                            </span>
                          </div>
                          <div className="p-4 bg-slate-50">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {selectedExchange.images.map((img: string, index: number) => (
                                <div
                                  key={index}
                                  className="aspect-square rounded-xl overflow-hidden border-2 border-white shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
                                  onClick={() => window.open(img, '_blank')}
                                >
                                  <img
                                    src={img}
                                    alt={`Photo ${index + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl p-8 text-center border border-slate-200">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-600 font-medium">Aucun média disponible</p>
                      <p className="text-sm text-slate-400 mt-1">Le client n'a pas fourni de vidéo ou photo</p>
                    </div>
                  )}

                  {/* Client & Product Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Client Info */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                        <User className="w-5 h-5 text-blue-600" />
                        Informations Client
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{selectedExchange.client_name}</p>
                            <p className="text-xs text-slate-500">Client</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                          <Phone className="w-4 h-4 text-blue-500" />
                          <a href={`tel:${selectedExchange.client_phone}`} className="font-medium text-blue-600 hover:underline">
                            {selectedExchange.client_phone}
                          </a>
                        </div>
                        {selectedExchange.client_email && (
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                            <Mail className="w-4 h-4 text-slate-500" />
                            <span>{selectedExchange.client_email}</span>
                          </div>
                        )}
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                            <div>
                              <p className="font-medium">{selectedExchange.client_address}</p>
                              <p className="text-slate-600">{selectedExchange.client_city}</p>
                              {selectedExchange.client_postal_code && (
                                <p className="text-xs text-slate-500">{selectedExchange.client_postal_code}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        {selectedExchange.client_notes && (
                          <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-xs text-amber-600 mb-1">Notes client:</p>
                            <p className="text-slate-700">{selectedExchange.client_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                        <Package className="w-5 h-5 text-purple-600" />
                        Informations Produit
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="pb-2 border-b border-slate-100">
                          <p className="text-slate-500 text-xs mb-1">Produit Original</p>
                          <p className="font-semibold text-slate-900">{selectedExchange.product_name}</p>
                        </div>
                        {selectedExchange.new_product_name && (
                          <div className="pb-2 border-b border-slate-100">
                            <p className="text-slate-500 text-xs mb-1">Nouveau Produit Souhaité</p>
                            <p className="font-semibold text-emerald-600">{selectedExchange.new_product_name}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-slate-500 text-xs">Raison</p>
                            <p className="font-medium">{selectedExchange.reason || "-"}</p>
                          </div>
                          {selectedExchange.desired_size && (
                            <div>
                              <p className="text-slate-500 text-xs">Taille souhaitée</p>
                              <p className="font-medium">{selectedExchange.desired_size}</p>
                            </div>
                          )}
                        </div>
                        {selectedExchange.description && (
                          <div className="pt-2 border-t border-slate-100">
                            <p className="text-slate-500 text-xs mb-1">Description du problème</p>
                            <p className="text-slate-700 bg-slate-50 rounded p-2">{selectedExchange.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Merchant & Delivery Person */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Merchant */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                        <Store className="w-5 h-5 text-emerald-600" />
                        Marchand
                      </h4>
                      {selectedExchange.merchant ? (
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Store className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{selectedExchange.merchant.name}</p>
                              <p className="text-xs text-slate-500">E-commerçant</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                            <Mail className="w-4 h-4 text-emerald-500" />
                            <span className="text-slate-700">{selectedExchange.merchant.email}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                            <Phone className="w-4 h-4 text-emerald-500" />
                            <a href={`tel:${selectedExchange.merchant.phone}`} className="font-medium text-emerald-600 hover:underline">
                              {selectedExchange.merchant.phone || "-"}
                            </a>
                          </div>
                          <Link
                            to={`/admin/merchant/${selectedExchange.merchant.id}`}
                            className="flex items-center justify-center gap-2 w-full py-2 mt-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-sm font-medium transition-colors"
                          >
                            Voir profil marchand →
                          </Link>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Store className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                          <p className="text-slate-500 text-sm">Non assigné</p>
                        </div>
                      )}
                    </div>

                    {/* Delivery Person */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                        <Truck className="w-5 h-5 text-amber-600" />
                        Livreur
                      </h4>
                      {selectedExchange.delivery_person ? (
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                              <Truck className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{selectedExchange.delivery_person.name}</p>
                              <p className="text-xs text-slate-500">Livreur vérificateur</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                            <Mail className="w-4 h-4 text-amber-500" />
                            <span className="text-slate-700">{selectedExchange.delivery_person.email}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                            <Phone className="w-4 h-4 text-amber-500" />
                            <a href={`tel:${selectedExchange.delivery_person.phone}`} className="font-medium text-amber-600 hover:underline">
                              {selectedExchange.delivery_person.phone || "-"}
                            </a>
                          </div>
                          {selectedExchange.verification_date && (
                            <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                              <p className="text-xs text-amber-600">Vérifié le:</p>
                              <p className="font-medium text-amber-700">{formatDate(selectedExchange.verification_date)}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Truck className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                          <p className="text-slate-500 text-sm">Non assigné</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status History */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                      <History className="w-5 h-5 text-indigo-600" />
                      Historique des statuts
                      <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                        {statusHistory.length} événement(s)
                      </span>
                    </h4>
                    {statusHistory.length > 0 ? (
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                        <div className="space-y-4">
                          {statusHistory.map((history, index) => (
                            <div key={index} className="flex items-start gap-4 relative">
                              <div className={`w-4 h-4 rounded-full border-2 bg-white z-10 ${
                                history.status === "completed" ? "border-emerald-500" :
                                history.status === "rejected" ? "border-red-500" :
                                history.status === "pending" ? "border-amber-500" :
                                history.status === "validated" ? "border-blue-500" :
                                history.status === "in_transit" ? "border-purple-500" :
                                "border-slate-400"
                              }`}>
                                <div className={`w-2 h-2 rounded-full m-0.5 ${
                                  history.status === "completed" ? "bg-emerald-500" :
                                  history.status === "rejected" ? "bg-red-500" :
                                  history.status === "pending" ? "bg-amber-500" :
                                  history.status === "validated" ? "bg-blue-500" :
                                  history.status === "in_transit" ? "bg-purple-500" :
                                  "bg-slate-400"
                                }`}></div>
                              </div>
                              <div className="flex-1 bg-slate-50 rounded-lg p-3 -mt-1">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(history.status)}`}>
                                    {getStatusLabel(history.status)}
                                  </span>
                                  <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded">
                                    {formatDate(history.created_at)}
                                  </span>
                                </div>
                                {history.notes && (
                                  <p className="text-sm text-slate-600 mt-2 p-2 bg-white rounded border border-slate-100">{history.notes}</p>
                                )}
                                {history.changed_by && (
                                  <p className="text-xs text-slate-400 mt-1">Par: {history.changed_by}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <History className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                        <p className="text-slate-500 text-sm">Aucun historique disponible</p>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-sky-600" />
                      Messages
                      <span className="ml-auto text-xs bg-sky-100 text-sky-600 px-2 py-1 rounded-full">
                        {messages.length} message(s)
                      </span>
                    </h4>
                    {messages.length > 0 ? (
                      <div className="space-y-3 max-h-80 overflow-y-auto bg-slate-50 rounded-lg p-3">
                        {messages.map((msg, index) => (
                          <div
                            key={index}
                            className={`rounded-xl p-4 shadow-sm ${
                              msg.sender_type === "merchant"
                                ? "bg-blue-500 text-white ml-8"
                                : msg.sender_type === "client"
                                ? "bg-white border border-slate-200 mr-8"
                                : "bg-amber-50 border border-amber-200 mx-4"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-xs font-semibold flex items-center gap-1 ${
                                msg.sender_type === "merchant"
                                  ? "text-blue-100"
                                  : msg.sender_type === "client"
                                  ? "text-slate-500"
                                  : "text-amber-600"
                              }`}>
                                {msg.sender_type === "merchant" && <Store className="w-3 h-3" />}
                                {msg.sender_type === "client" && <User className="w-3 h-3" />}
                                {msg.sender_type !== "merchant" && msg.sender_type !== "client" && <MessageSquare className="w-3 h-3" />}
                                {msg.sender_type === "merchant" ? "Marchand" :
                                 msg.sender_type === "client" ? "Client" : "Système"}
                              </span>
                              <span className={`text-xs ${
                                msg.sender_type === "merchant" ? "text-blue-200" : "text-slate-400"
                              }`}>
                                {formatDate(msg.created_at)}
                              </span>
                            </div>
                            <p className={`text-sm ${
                              msg.sender_type === "merchant" ? "text-white" : "text-slate-700"
                            }`}>{msg.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-slate-50 rounded-lg">
                        <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                        <p className="text-slate-500 text-sm">Aucun message échangé</p>
                      </div>
                    )}
                  </div>

                  {/* Timeline / All Dates */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      Chronologie de l'échange
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Created */}
                      <div className="flex-1 min-w-[140px] bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <p className="text-xs font-medium text-blue-600">Créé</p>
                        </div>
                        <p className="font-semibold text-slate-900 text-sm">{formatDate(selectedExchange.created_at)}</p>
                      </div>

                      {/* Arrow */}
                      <div className="text-slate-300 hidden md:block">→</div>

                      {/* Validated */}
                      <div className="flex-1 min-w-[140px] bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${selectedExchange.validated_at ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                          <p className={`text-xs font-medium ${selectedExchange.validated_at ? 'text-emerald-600' : 'text-slate-400'}`}>Validé</p>
                        </div>
                        <p className="font-semibold text-slate-900 text-sm">{formatDate(selectedExchange.validated_at)}</p>
                      </div>

                      {/* Arrow */}
                      <div className="text-slate-300 hidden md:block">→</div>

                      {/* Picked up */}
                      <div className="flex-1 min-w-[140px] bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${selectedExchange.picked_up_at ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                          <p className={`text-xs font-medium ${selectedExchange.picked_up_at ? 'text-amber-600' : 'text-slate-400'}`}>Enlevé</p>
                        </div>
                        <p className="font-semibold text-slate-900 text-sm">{formatDate(selectedExchange.picked_up_at)}</p>
                      </div>

                      {/* Arrow */}
                      <div className="text-slate-300 hidden md:block">→</div>

                      {/* Completed */}
                      <div className="flex-1 min-w-[140px] bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${selectedExchange.completed_at ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                          <p className={`text-xs font-medium ${selectedExchange.completed_at ? 'text-purple-600' : 'text-slate-400'}`}>Complété</p>
                        </div>
                        <p className="font-semibold text-slate-900 text-sm">{formatDate(selectedExchange.completed_at)}</p>
                      </div>
                    </div>

                    {/* Last updated note */}
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                      <span>Dernière mise à jour: {formatDate(selectedExchange.updated_at)}</span>
                      {selectedExchange.delivery_company_id && (
                        <span className="bg-slate-200 px-2 py-1 rounded">
                          Société de livraison: {selectedExchange.delivery_company_id.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-slate-500 py-12">Erreur de chargement</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={closeDetailModal}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
