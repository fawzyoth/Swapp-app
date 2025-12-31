import { useState, useEffect } from "react";
import { supabase, FinanceWallet, walletTypeLabels } from "../../lib/supabase";
import FinanceLayout from "../../components/FinanceLayout";
import {
  Wallet,
  Search,
  Filter,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Building2,
  User,
  Truck,
  X,
} from "lucide-react";

type WalletWithDetails = FinanceWallet & {
  merchant?: { business_name: string } | null;
  delivery_person?: { full_name: string } | null;
  delivery_company?: { name: string } | null;
};

export default function FinanceWallets() {
  const [wallets, setWallets] = useState<WalletWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedWallet, setSelectedWallet] = useState<WalletWithDetails | null>(null);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("finance_wallets")
        .select(`
          *,
          merchant:merchants(business_name),
          delivery_person:delivery_persons(full_name),
          delivery_company:delivery_companies(name)
        `)
        .eq("is_active", true)
        .order("wallet_type")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWallets(data || []);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletTransactions = async (walletId: string) => {
    setLoadingTransactions(true);
    try {
      const { data, error } = await supabase
        .from("finance_transactions")
        .select("*")
        .eq("wallet_id", walletId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setWalletTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleViewWallet = (wallet: WalletWithDetails) => {
    setSelectedWallet(wallet);
    fetchWalletTransactions(wallet.id);
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case "merchant":
        return <Building2 className="w-5 h-5" />;
      case "delivery_person":
        return <User className="w-5 h-5" />;
      case "delivery_company":
        return <Truck className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const getWalletName = (wallet: WalletWithDetails) => {
    if (wallet.merchant) return wallet.merchant.business_name;
    if (wallet.delivery_person) return wallet.delivery_person.full_name;
    if (wallet.delivery_company) return wallet.delivery_company.name;
    return wallet.wallet_number;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + " TND";
  };

  const filteredWallets = wallets.filter((wallet) => {
    const matchesSearch =
      getWalletName(wallet).toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.wallet_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || wallet.wallet_type === filterType;
    return matchesSearch && matchesType;
  });

  const walletTypes = [
    { value: "all", label: "Tous" },
    { value: "merchant", label: "Marchands" },
    { value: "delivery_person", label: "Livreurs" },
    { value: "delivery_company", label: "Sociétés Livraison" },
    { value: "swapp_main", label: "SWAPP Principal" },
    { value: "swapp_fee", label: "SWAPP Commissions" },
  ];

  // Calculate totals
  const totalBalance = filteredWallets.reduce((sum, w) => sum + Number(w.balance), 0);
  const totalPending = filteredWallets.reduce((sum, w) => sum + Number(w.pending_in) - Number(w.pending_out), 0);

  return (
    <FinanceLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portefeuilles</h1>
            <p className="text-gray-500 mt-1">Gestion des portefeuilles virtuels</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            <Plus className="w-4 h-4" />
            Nouveau Wallet
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Solde Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalBalance)}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">En Attente</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{formatCurrency(totalPending)}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Nombre de Wallets</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{filteredWallets.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un wallet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {walletTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchWallets}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Wallets List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : filteredWallets.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun wallet trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wallet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solde
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      En Attente
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Devise
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredWallets.map((wallet) => (
                    <tr key={wallet.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                            {getWalletIcon(wallet.wallet_type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{getWalletName(wallet)}</p>
                            <p className="text-sm text-gray-500">{wallet.wallet_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                          {walletTypeLabels[wallet.wallet_type] || wallet.wallet_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-semibold ${Number(wallet.balance) >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(Number(wallet.balance))}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm">
                          <span className="text-green-600">+{formatCurrency(Number(wallet.pending_in))}</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span className="text-red-600">-{formatCurrency(Number(wallet.pending_out))}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-600">{wallet.currency}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewWallet(wallet)}
                          className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Detail Modal */}
      {selectedWallet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  {getWalletIcon(selectedWallet.wallet_type)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{getWalletName(selectedWallet)}</h2>
                  <p className="text-sm text-gray-500">{selectedWallet.wallet_number}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWallet(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Balance Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Solde</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(Number(selectedWallet.balance))}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600">Entrées en Attente</p>
                  <p className="text-xl font-bold text-green-700">+{formatCurrency(Number(selectedWallet.pending_in))}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm text-red-600">Sorties en Attente</p>
                  <p className="text-xl font-bold text-red-700">-{formatCurrency(Number(selectedWallet.pending_out))}</p>
                </div>
              </div>

              {/* Recent Transactions */}
              <h3 className="font-medium text-gray-900 mb-3">Transactions Récentes</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                {loadingTransactions ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
                  </div>
                ) : walletTransactions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    Aucune transaction
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {walletTransactions.map((tx) => (
                      <div key={tx.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            Number(tx.amount) >= 0 ? "bg-green-100" : "bg-red-100"
                          }`}>
                            {Number(tx.amount) >= 0 ? (
                              <ArrowDownRight className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{tx.description || tx.transaction_type}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(tx.created_at).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                        <span className={`font-semibold ${
                          Number(tx.amount) >= 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {Number(tx.amount) >= 0 ? "+" : ""}{formatCurrency(Number(tx.amount))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedWallet(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </FinanceLayout>
  );
}
