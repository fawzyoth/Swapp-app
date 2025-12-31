import { useState, useEffect } from "react";
import { supabase, FinancePayout, payoutStatusLabels, paymentMethodLabels } from "../../lib/supabase";
import FinanceLayout from "../../components/FinanceLayout";
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  Truck,
} from "lucide-react";

type PayoutWithDetails = FinancePayout & {
  merchant?: { business_name: string } | null;
  delivery_person?: { full_name: string } | null;
  delivery_company?: { name: string } | null;
  wallet?: { wallet_number: string } | null;
};

export default function FinancePayouts() {
  const [payouts, setPayouts] = useState<PayoutWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedPayout, setSelectedPayout] = useState<PayoutWithDetails | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    fetchPayouts();
  }, [page, filterStatus, filterType, dateFrom, dateTo]);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("finance_payouts")
        .select(`
          *,
          merchant:merchants(business_name),
          delivery_person:delivery_persons(full_name),
          delivery_company:delivery_companies(name),
          wallet:finance_wallets(wallet_number)
        `, { count: "exact" });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }
      if (filterType !== "all") {
        query = query.eq("payee_type", filterType);
      }
      if (dateFrom) {
        query = query.gte("created_at", dateFrom);
      }
      if (dateTo) {
        query = query.lte("created_at", dateTo + "T23:59:59");
      }
      if (searchTerm) {
        query = query.ilike("payout_number", `%${searchTerm}%`);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;
      setPayouts(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching payouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchPayouts();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + " TND";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "rejected":
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPayeeIcon = (type: string) => {
    switch (type) {
      case "merchant":
        return <Building2 className="w-5 h-5" />;
      case "delivery_person":
        return <User className="w-5 h-5" />;
      case "delivery_company":
        return <Truck className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPayeeName = (payout: PayoutWithDetails) => {
    if (payout.merchant) return payout.merchant.business_name;
    if (payout.delivery_person) return payout.delivery_person.full_name;
    if (payout.delivery_company) return payout.delivery_company.name;
    return payout.payout_number;
  };

  const payeeTypes = [
    { value: "all", label: "Tous les bénéficiaires" },
    { value: "merchant", label: "Marchands" },
    { value: "delivery_person", label: "Livreurs" },
    { value: "delivery_company", label: "Sociétés Livraison" },
  ];

  const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "pending", label: "En Attente" },
    { value: "approved", label: "Approuvé" },
    { value: "paid", label: "Payé" },
    { value: "rejected", label: "Rejeté" },
    { value: "cancelled", label: "Annulé" },
  ];

  const totalPages = Math.ceil(totalCount / pageSize);

  // Stats
  const pendingAmount = payouts
    .filter(p => p.status === "pending" || p.status === "approved")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const paidAmount = payouts
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <FinanceLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
            <p className="text-gray-500 mt-1">Gestion des versements aux partenaires</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            <Plus className="w-4 h-4" />
            Nouveau Paiement
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Paiements</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">En Attente</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Payé (page)</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bénéficiaires</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(payouts.map(p => p.merchant_id || p.delivery_person_id || p.delivery_company_id)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par numéro..."
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
                {payeeTypes.map((type) => (
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

        {/* Payouts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : payouts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun paiement trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paiement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bénéficiaire
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Méthode
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
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(payout.status)}
                          <div>
                            <p className="font-medium text-gray-900">{payout.payout_number}</p>
                            <p className="text-sm text-gray-500">
                              {payout.wallet?.wallet_number || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                            {getPayeeIcon(payout.payee_type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{getPayeeName(payout)}</p>
                            <p className="text-xs text-gray-500 capitalize">
                              {payout.payee_type === "merchant" ? "Marchand" :
                               payout.payee_type === "delivery_person" ? "Livreur" :
                               payout.payee_type === "delivery_company" ? "Société" : payout.payee_type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(Number(payout.amount))}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-gray-600">
                          {paymentMethodLabels[payout.payment_method] || payout.payment_method || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(payout.status)}`}>
                          {payoutStatusLabels[payout.status] || payout.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(payout.created_at).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedPayout(payout)}
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

      {/* Payout Detail Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedPayout.status)}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedPayout.payout_number}</h2>
                  <p className="text-sm text-gray-500">{getPayeeName(selectedPayout)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPayout(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Amount */}
              <div className="text-center py-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Montant</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(Number(selectedPayout.amount))}</p>
                <span className={`mt-2 inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedPayout.status)}`}>
                  {payoutStatusLabels[selectedPayout.status] || selectedPayout.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bénéficiaire</span>
                  <span className="font-medium text-gray-900">{getPayeeName(selectedPayout)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {selectedPayout.payee_type === "merchant" ? "Marchand" :
                     selectedPayout.payee_type === "delivery_person" ? "Livreur" :
                     selectedPayout.payee_type === "delivery_company" ? "Société Livraison" : selectedPayout.payee_type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Wallet</span>
                  <span className="font-medium text-gray-900">{selectedPayout.wallet?.wallet_number || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Méthode</span>
                  <span className="font-medium text-gray-900">
                    {paymentMethodLabels[selectedPayout.payment_method] || selectedPayout.payment_method || "-"}
                  </span>
                </div>
                {selectedPayout.payment_reference && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Référence</span>
                    <span className="font-medium text-gray-900">{selectedPayout.payment_reference}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Créé le</span>
                  <span className="font-medium text-gray-900">
                    {new Date(selectedPayout.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {selectedPayout.paid_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payé le</span>
                    <span className="font-medium text-green-600">
                      {new Date(selectedPayout.paid_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {selectedPayout.notes && (
                  <div className="pt-2">
                    <span className="text-gray-500 block mb-1">Notes</span>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedPayout.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              {selectedPayout.status === "pending" && (
                <>
                  <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                    Rejeter
                  </button>
                  <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                    Approuver
                  </button>
                </>
              )}
              {selectedPayout.status === "approved" && (
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                  Marquer Payé
                </button>
              )}
              <button
                onClick={() => setSelectedPayout(null)}
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
