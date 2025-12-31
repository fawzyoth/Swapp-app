import { useState, useEffect } from "react";
import { supabase, FinanceReconciliation, reconciliationStatusLabels } from "../../lib/supabase";
import FinanceLayout from "../../components/FinanceLayout";
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type ReconciliationWithDetails = FinanceReconciliation & {
  delivery_company?: { name: string } | null;
};

export default function FinanceReconciliation() {
  const [reconciliations, setReconciliations] = useState<ReconciliationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedRecon, setSelectedRecon] = useState<ReconciliationWithDetails | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    fetchReconciliations();
  }, [page, filterStatus, filterType, dateFrom, dateTo]);

  const fetchReconciliations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("finance_reconciliations")
        .select(`
          *,
          delivery_company:delivery_companies(name)
        `, { count: "exact" });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }
      if (filterType !== "all") {
        query = query.eq("reconciliation_type", filterType);
      }
      if (dateFrom) {
        query = query.gte("period_start", dateFrom);
      }
      if (dateTo) {
        query = query.lte("period_end", dateTo);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;
      setReconciliations(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching reconciliations:", error);
    } finally {
      setLoading(false);
    }
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
      case "matched":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "discrepancy":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "matched":
        return "bg-green-100 text-green-800";
      case "discrepancy":
        return "bg-orange-100 text-orange-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const reconciliationTypes = [
    { value: "all", label: "Tous les types" },
    { value: "daily", label: "Quotidien" },
    { value: "weekly", label: "Hebdomadaire" },
    { value: "monthly", label: "Mensuel" },
    { value: "delivery_company", label: "Société Livraison" },
    { value: "merchant", label: "Marchand" },
  ];

  const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "pending", label: "En Attente" },
    { value: "matched", label: "Réconcilié" },
    { value: "discrepancy", label: "Écart" },
    { value: "resolved", label: "Résolu" },
  ];

  const totalPages = Math.ceil(totalCount / pageSize);

  // Stats
  const pendingCount = reconciliations.filter(r => r.status === "pending").length;
  const discrepancyCount = reconciliations.filter(r => r.status === "discrepancy").length;
  const totalDiscrepancy = reconciliations
    .filter(r => r.status === "discrepancy")
    .reduce((sum, r) => sum + Math.abs(Number(r.discrepancy_amount)), 0);

  return (
    <FinanceLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Réconciliation</h1>
            <p className="text-gray-500 mt-1">Vérification et rapprochement des comptes</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            <Plus className="w-4 h-4" />
            Nouvelle Réconciliation
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Écarts Détectés</p>
                <p className="text-2xl font-bold text-orange-600">{discrepancyCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Montant Écarts</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDiscrepancy)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <select
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {reconciliationTypes.map((type) => (
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
                placeholder="Date début"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Date fin"
              />
            </div>
            <div>
              <button
                onClick={fetchReconciliations}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Reconciliation Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : reconciliations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CheckSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune réconciliation trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Référence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Période
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendu
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Réel
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Écart
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reconciliations.map((recon) => (
                    <tr key={recon.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(recon.status)}
                          <div>
                            <p className="font-medium text-gray-900">{recon.reconciliation_number}</p>
                            {recon.delivery_company && (
                              <p className="text-sm text-gray-500">{recon.delivery_company.name}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 capitalize">
                          {recon.reconciliation_type === "daily" ? "Quotidien" :
                           recon.reconciliation_type === "weekly" ? "Hebdomadaire" :
                           recon.reconciliation_type === "monthly" ? "Mensuel" :
                           recon.reconciliation_type === "delivery_company" ? "Société Livraison" :
                           recon.reconciliation_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(recon.period_start).toLocaleDateString("fr-FR")} - {new Date(recon.period_end).toLocaleDateString("fr-FR")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-medium text-gray-900">
                          {formatCurrency(Number(recon.expected_amount))}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-medium text-gray-900">
                          {formatCurrency(Number(recon.actual_amount))}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-semibold ${
                          Number(recon.discrepancy_amount) === 0 ? "text-green-600" :
                          Number(recon.discrepancy_amount) > 0 ? "text-blue-600" : "text-red-600"
                        }`}>
                          {Number(recon.discrepancy_amount) > 0 ? "+" : ""}
                          {formatCurrency(Number(recon.discrepancy_amount))}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(recon.status)}`}>
                          {reconciliationStatusLabels[recon.status] || recon.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedRecon(recon)}
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

      {/* Reconciliation Detail Modal */}
      {selectedRecon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedRecon.status)}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedRecon.reconciliation_number}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedRecon.period_start).toLocaleDateString("fr-FR")} - {new Date(selectedRecon.period_end).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecon(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Amounts */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Attendu</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(Number(selectedRecon.expected_amount))}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Réel</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(Number(selectedRecon.actual_amount))}</p>
                </div>
                <div className={`rounded-lg p-4 text-center ${
                  Number(selectedRecon.discrepancy_amount) === 0 ? "bg-green-50" :
                  Number(selectedRecon.discrepancy_amount) > 0 ? "bg-blue-50" : "bg-red-50"
                }`}>
                  <p className="text-sm text-gray-500">Écart</p>
                  <p className={`text-xl font-bold ${
                    Number(selectedRecon.discrepancy_amount) === 0 ? "text-green-600" :
                    Number(selectedRecon.discrepancy_amount) > 0 ? "text-blue-600" : "text-red-600"
                  }`}>
                    {formatCurrency(Number(selectedRecon.discrepancy_amount))}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {selectedRecon.reconciliation_type === "daily" ? "Quotidien" :
                     selectedRecon.reconciliation_type === "weekly" ? "Hebdomadaire" :
                     selectedRecon.reconciliation_type === "monthly" ? "Mensuel" :
                     selectedRecon.reconciliation_type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Statut</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedRecon.status)}`}>
                    {reconciliationStatusLabels[selectedRecon.status] || selectedRecon.status}
                  </span>
                </div>
                {selectedRecon.delivery_company && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Société Livraison</span>
                    <span className="font-medium text-gray-900">{selectedRecon.delivery_company.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Créé le</span>
                  <span className="font-medium text-gray-900">
                    {new Date(selectedRecon.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {selectedRecon.notes && (
                  <div className="pt-2">
                    <span className="text-gray-500 block mb-1">Notes</span>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRecon.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              {selectedRecon.status === "discrepancy" && (
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                  Marquer Résolu
                </button>
              )}
              <button
                onClick={() => setSelectedRecon(null)}
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
