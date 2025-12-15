import { useState, useEffect } from "react";
import { supabase, FinanceTransaction, transactionTypeLabels, transactionStatusLabels } from "../../lib/supabase";
import FinanceLayout from "../../components/FinanceLayout";
import {
  ArrowLeftRight,
  Search,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type TransactionWithDetails = FinanceTransaction & {
  wallet?: { wallet_number: string; wallet_type: string } | null;
};

export default function FinanceTransactions() {
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithDetails | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchTransactions();
  }, [page, filterType, filterStatus, dateFrom, dateTo]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("finance_transactions")
        .select(`
          *,
          wallet:finance_wallets(wallet_number, wallet_type)
        `, { count: "exact" });

      if (filterType !== "all") {
        query = query.eq("transaction_type", filterType);
      }
      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }
      if (dateFrom) {
        query = query.gte("created_at", dateFrom);
      }
      if (dateTo) {
        query = query.lte("created_at", dateTo + "T23:59:59");
      }
      if (searchTerm) {
        query = query.or(`transaction_number.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;
      setTransactions(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchTransactions();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + " TND";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "reversed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const transactionTypes = [
    { value: "all", label: "Tous les types" },
    { value: "client_collection", label: "Encaissement Client" },
    { value: "swapp_fee", label: "Commission SWAPP" },
    { value: "merchant_credit", label: "Crédit Marchand" },
    { value: "dp_to_company", label: "Livreur → Société" },
    { value: "company_to_swapp", label: "Société → SWAPP" },
    { value: "merchant_payout", label: "Paiement Marchand" },
    { value: "adjustment", label: "Ajustement" },
    { value: "refund", label: "Remboursement" },
  ];

  const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "pending", label: "En Attente" },
    { value: "completed", label: "Complété" },
    { value: "failed", label: "Échoué" },
    { value: "reversed", label: "Annulé" },
  ];

  const totalPages = Math.ceil(totalCount / pageSize);

  // Calculate totals
  const totalIn = transactions.filter(t => Number(t.amount) > 0).reduce((sum, t) => sum + Number(t.amount), 0);
  const totalOut = transactions.filter(t => Number(t.amount) < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  return (
    <FinanceLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-500 mt-1">Historique des mouvements financiers</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalCount}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Entrées</p>
            <p className="text-2xl font-bold text-green-600 mt-1">+{formatCurrency(totalIn)}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Sorties</p>
            <p className="text-2xl font-bold text-red-600 mt-1">-{formatCurrency(totalOut)}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Solde Net</p>
            <p className={`text-2xl font-bold mt-1 ${totalIn - totalOut >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(totalIn - totalOut)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {transactionTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ArrowLeftRight className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune transaction trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wallet
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            Number(tx.amount) >= 0 ? "bg-green-100" : "bg-red-100"
                          }`}>
                            {Number(tx.amount) >= 0 ? (
                              <ArrowDownRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{tx.transaction_number}</p>
                            <p className="text-sm text-gray-500 truncate max-w-[200px]">
                              {tx.description || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {transactionTypeLabels[tx.transaction_type] || tx.transaction_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {tx.wallet?.wallet_number || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-semibold ${
                          Number(tx.amount) >= 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {Number(tx.amount) >= 0 ? "+" : ""}{formatCurrency(Number(tx.amount))}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(tx.status)}`}>
                          {transactionStatusLabels[tx.status] || tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(tx.created_at).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedTransaction(tx)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Affichage {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, totalCount)} sur {totalCount}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Détail Transaction</h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  Number(selectedTransaction.amount) >= 0 ? "bg-green-100" : "bg-red-100"
                }`}>
                  {Number(selectedTransaction.amount) >= 0 ? (
                    <ArrowDownRight className="w-8 h-8 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-8 h-8 text-red-600" />
                  )}
                </div>
              </div>

              <div className="text-center">
                <p className={`text-3xl font-bold ${
                  Number(selectedTransaction.amount) >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {Number(selectedTransaction.amount) >= 0 ? "+" : ""}{formatCurrency(Number(selectedTransaction.amount))}
                </p>
                <span className={`mt-2 inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                  {transactionStatusLabels[selectedTransaction.status] || selectedTransaction.status}
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Numéro</span>
                  <span className="font-medium text-gray-900">{selectedTransaction.transaction_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-900">
                    {transactionTypeLabels[selectedTransaction.transaction_type] || selectedTransaction.transaction_type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Wallet</span>
                  <span className="font-medium text-gray-900">
                    {selectedTransaction.wallet?.wallet_number || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-900">
                    {new Date(selectedTransaction.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {selectedTransaction.description && (
                  <div className="pt-2">
                    <span className="text-gray-500 block mb-1">Description</span>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTransaction.description}</p>
                  </div>
                )}
                {selectedTransaction.reference && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Référence</span>
                    <span className="font-medium text-gray-900">{selectedTransaction.reference}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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
