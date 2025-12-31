import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Play } from "lucide-react";
import { supabase, STATUS_LABELS } from "../../lib/supabase";
import MerchantLayout from "../../components/MerchantLayout";

const PAGE_SIZE = 50;

// Comprehensive demo exchanges data - covering the entire process
const DEMO_EXCHANGES = [
  // PENDING - Awaiting merchant validation
  {
    id: "demo-1",
    exchange_code: "EXC-2024-001",
    client_name: "Ahmed Ben Ali",
    client_phone: "+216 55 123 456",
    client_address: "15 Rue de la Liberte",
    client_city: "Tunis",
    product_name: "T-Shirt Nike - Taille L",
    reason: "Taille incorrecte",
    status: "pending",
    payment_amount: 0,
    payment_status: "pending",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    exchange_code: "EXC-2024-002",
    client_name: "Leila Mansouri",
    client_phone: "+216 98 111 222",
    client_address: "42 Avenue Habib Bourguiba",
    client_city: "Sfax",
    product_name: "Robe Zara - Rouge",
    reason: "Couleur non conforme",
    status: "pending",
    payment_amount: 15,
    payment_status: "pending",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "demo-3",
    exchange_code: "EXC-2024-003",
    client_name: "Karim Bouzid",
    client_phone: "+216 22 333 444",
    client_address: "8 Rue Ibn Khaldoun",
    client_city: "Sousse",
    product_name: "Chaussures Adidas - 42",
    reason: "Produit defectueux",
    status: "pending",
    payment_amount: 0,
    payment_status: "pending",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },

  // VALIDATED - Accepted by merchant, waiting for pickup
  {
    id: "demo-4",
    exchange_code: "EXC-2024-004",
    client_name: "Fatma Trabelsi",
    client_phone: "+216 22 987 654",
    client_address: "25 Rue de Marseille",
    client_city: "Tunis",
    product_name: "Sac a main Guess",
    reason: "Ne correspond pas a la description",
    status: "validated",
    payment_amount: 0,
    payment_status: "free",
    validated_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "demo-5",
    exchange_code: "EXC-2024-005",
    client_name: "Slim Hamdi",
    client_phone: "+216 55 666 777",
    client_address: "12 Avenue de la Republique",
    client_city: "Bizerte",
    product_name: "Montre Casio G-Shock",
    reason: "Produit defectueux",
    status: "validated",
    payment_amount: 25,
    payment_status: "pending",
    validated_at: new Date(Date.now() - 43200000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },

  // READY FOR PICKUP - Bordereau printed, waiting for delivery person
  {
    id: "demo-6",
    exchange_code: "EXC-2024-006",
    client_name: "Youssef Hammami",
    client_phone: "+216 23 456 789",
    client_address: "7 Rue de Paris",
    client_city: "La Marsa",
    product_name: "Veste en cuir - Taille M",
    reason: "Changement d'avis",
    status: "ready_for_pickup",
    payment_amount: 0,
    payment_status: "free",
    pickup_scheduled_date: new Date(Date.now() + 86400000).toISOString(),
    jax_ean: "JAX-TN-2024-123456",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "demo-7",
    exchange_code: "EXC-2024-007",
    client_name: "Nadia Gharbi",
    client_phone: "+216 50 888 999",
    client_address: "33 Rue de Carthage",
    client_city: "Tunis",
    product_name: "Parfum Dior - 100ml",
    reason: "Produit ne correspond pas",
    status: "ready_for_pickup",
    payment_amount: 45,
    payment_status: "pending",
    pickup_scheduled_date: new Date(Date.now() + 172800000).toISOString(),
    jax_ean: "JAX-TN-2024-789012",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },

  // IN TRANSIT - Delivery person on the way
  {
    id: "demo-8",
    exchange_code: "EXC-2024-008",
    client_name: "Hichem Bouslama",
    client_phone: "+216 29 111 333",
    client_address: "18 Avenue Mohamed V",
    client_city: "Nabeul",
    product_name: "Laptop HP Pavilion",
    reason: "Ecran defectueux",
    status: "in_transit",
    payment_amount: 0,
    payment_status: "free",
    delivery_person_id: "dp-demo-1",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },

  // COMPLETED - Exchange done successfully
  {
    id: "demo-9",
    exchange_code: "EXC-2024-009",
    client_name: "Mohamed Kacem",
    client_phone: "+216 98 456 123",
    client_address: "55 Rue de Rome",
    client_city: "Tunis",
    product_name: "Smartphone Samsung Galaxy",
    reason: "Batterie defectueuse",
    status: "completed",
    payment_amount: 0,
    payment_status: "free",
    return_product_status: "accepted",
    return_product_notes: "Produit en bon etat, echange effectue",
    completed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "demo-10",
    exchange_code: "EXC-2024-010",
    client_name: "Amira Khelifi",
    client_phone: "+216 21 444 555",
    client_address: "22 Rue Alain Savary",
    client_city: "Tunis",
    product_name: "Tablette iPad Pro",
    reason: "Ecran casse a la livraison",
    status: "completed",
    payment_amount: 30,
    payment_status: "collected",
    return_product_status: "accepted",
    completed_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: "demo-11",
    exchange_code: "EXC-2024-011",
    client_name: "Raouf Jebali",
    client_phone: "+216 58 777 888",
    client_address: "9 Rue de Hollande",
    client_city: "Sousse",
    product_name: "Casque Beats Solo",
    reason: "Son defectueux",
    status: "completed",
    payment_amount: 0,
    payment_status: "free",
    return_product_status: "problem",
    return_product_notes: "Legere rayure sur le produit retourne",
    completed_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },

  // REJECTED - Merchant refused the exchange
  {
    id: "demo-12",
    exchange_code: "EXC-2024-012",
    client_name: "Sarra Bouaziz",
    client_phone: "+216 50 789 012",
    client_address: "14 Rue de Grece",
    client_city: "Tunis",
    product_name: "Lunettes Ray-Ban",
    reason: "Ne me plait plus",
    status: "rejected",
    rejection_reason: "Delai de retour depasse (30 jours)",
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: "demo-13",
    exchange_code: "EXC-2024-013",
    client_name: "Walid Mejri",
    client_phone: "+216 27 222 333",
    client_address: "31 Avenue de France",
    client_city: "Sfax",
    product_name: "Chemise Hugo Boss",
    reason: "Taille trop grande",
    status: "rejected",
    rejection_reason: "Produit porte et lave, traces visibles",
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },

  // More completed exchanges for history
  {
    id: "demo-14",
    exchange_code: "EXC-2024-014",
    client_name: "Ines Braham",
    client_phone: "+216 54 999 000",
    client_address: "6 Rue de Londres",
    client_city: "Tunis",
    product_name: "Jeans Levi's 501",
    reason: "Mauvaise taille",
    status: "completed",
    payment_amount: 0,
    payment_status: "free",
    return_product_status: "accepted",
    completed_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    id: "demo-15",
    exchange_code: "EXC-2024-015",
    client_name: "Fares Dridi",
    client_phone: "+216 92 666 777",
    client_address: "45 Rue du Lac",
    client_city: "Tunis",
    product_name: "Polo Lacoste",
    reason: "Couleur differente de la photo",
    status: "completed",
    payment_amount: 20,
    payment_status: "collected",
    return_product_status: "accepted",
    completed_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

export default function MerchantExchangeList() {
  const navigate = useNavigate();
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [filteredExchanges, setFilteredExchanges] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // Check for demo mode
    const isDemoMode = sessionStorage.getItem("demo_mode") === "true";
    setDemoMode(isDemoMode);

    if (isDemoMode) {
      // Load demo data
      setExchanges(DEMO_EXCHANGES);
      setLoading(false);
    } else {
      checkAuthAndFetch();
    }
  }, []);

  useEffect(() => {
    filterExchanges();
  }, [exchanges, searchTerm, statusFilter]);

  const exitDemoMode = () => {
    sessionStorage.removeItem("demo_mode");
    sessionStorage.removeItem("demo_merchant");
    navigate("/merchant/login");
  };

  const toggleDemoMode = () => {
    if (demoMode) {
      // Exit demo mode
      sessionStorage.removeItem("demo_mode");
      sessionStorage.removeItem("demo_merchant");
      setDemoMode(false);
      setLoading(true);
      checkAuthAndFetch();
    } else {
      // Enter demo mode
      sessionStorage.setItem("demo_mode", "true");
      sessionStorage.setItem(
        "demo_merchant",
        JSON.stringify({
          id: "demo-merchant-id",
          email: "demo@merchant.com",
          name: "Boutique Demo",
        }),
      );
      setDemoMode(true);
      setExchanges(DEMO_EXCHANGES);
    }
  };

  const checkAuthAndFetch = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/merchant/login");
        return;
      }

      // Get merchant ID
      const { data: merchantData } = await supabase
        .from("merchants")
        .select("id")
        .eq("email", session.user.email)
        .maybeSingle();

      if (merchantData) {
        setMerchantId(merchantData.id);
        await fetchExchanges(merchantData.id);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExchanges = async (mId: string) => {
    try {
      // Only fetch exchanges for this merchant, limited to recent ones
      const { data } = await supabase
        .from("exchanges")
        .select(
          "id, exchange_code, client_name, client_phone, reason, status, created_at",
        )
        .eq("merchant_id", mId)
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);

      setExchanges(data || []);
    } catch (error) {
      console.error("Error fetching exchanges:", error);
    }
  };

  const filterExchanges = () => {
    let filtered = [...exchanges];

    if (statusFilter !== "all") {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (e) =>
          e.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.client_phone.includes(searchTerm) ||
          e.exchange_code.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredExchanges(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "validated":
        return "bg-emerald-100 text-emerald-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
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
      <div>
        {/* Demo Mode Banner */}
        {demoMode && (
          <div className="mb-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">Mode Démonstration</h3>
                <p className="text-purple-100 text-sm">
                  Vous visualisez des données fictives. Cliquez sur un échange
                  pour voir les détails.
                </p>
              </div>
              <button
                onClick={exitDemoMode}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors"
              >
                Quitter la Demo
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Demandes d'échange
            </h1>
            <p className="text-slate-600">
              Gérez et validez les demandes de vos clients
            </p>
          </div>

          {/* Test Mode Toggle Button */}
          <button
            onClick={toggleDemoMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              demoMode
                ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${demoMode ? "bg-white animate-pulse" : "bg-slate-400"}`}
            />
            {demoMode ? "Mode Demo Actif" : "Activer Mode Demo"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone ou code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="validated">Validé</option>
                <option value="ready_for_pickup">Prêt pour ramassage</option>
                <option value="preparing">En préparation</option>
                <option value="in_transit">En route</option>
                <option value="completed">Complété</option>
                <option value="rejected">Rejeté</option>
              </select>
            </div>
          </div>
        </div>

        {filteredExchanges.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <p className="text-slate-600">Aucun échange trouvé</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-700">
                    Code
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-700">
                    Client
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-700">
                    Téléphone
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-700">
                    Raison
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-700">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-700">
                    Statut
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredExchanges.map((exchange) => (
                  <tr key={exchange.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {exchange.exchange_code}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {exchange.client_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {exchange.client_phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {exchange.reason}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {new Date(exchange.created_at).toLocaleDateString(
                        "fr-FR",
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getStatusColor(exchange.status)}`}
                      >
                        {STATUS_LABELS[exchange.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/merchant/exchange/${exchange.id}`}
                        className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                      >
                        Voir détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MerchantLayout>
  );
}
