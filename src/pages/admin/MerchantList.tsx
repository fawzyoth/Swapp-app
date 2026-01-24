import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Store,
  Package,
  Eye,
  Edit,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Award,
  BarChart3,
  Building2,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import AdminLayout from "../../components/AdminLayout";

export default function AdminMerchantList() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [merchantsRes, exchangesRes] = await Promise.all([
        supabase
          .from("merchants")
          .select("id, name, email, phone, qr_code_data, created_at, verification_status, business_type")
          .order("created_at", { ascending: false }),
        supabase.from("exchanges").select("merchant_id, status, created_at"),
      ]);

      setMerchants(merchantsRes.data || []);
      setExchanges(exchangesRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (merchantId: string) => {
    try {
      await supabase.from("merchants").delete().eq("id", merchantId);
      setMerchants(merchants.filter((m) => m.id !== merchantId));
      setDeleteModal(null);
    } catch (error) {
      console.error("Error deleting merchant:", error);
    }
  };

  const getMerchantStats = (merchantId: string) => {
    const merchantExchanges = exchanges.filter(
      (e) => e.merchant_id === merchantId,
    );
    const validated = merchantExchanges.filter((e) =>
      ["validated", "preparing", "in_transit", "completed"].includes(e.status),
    ).length;
    const rejected = merchantExchanges.filter((e) => e.status === "rejected").length;
    const total = merchantExchanges.length;

    return {
      total,
      pending: merchantExchanges.filter((e) => e.status === "pending").length,
      validated,
      rejected,
      validationRate: total > 0 ? Math.round((validated / total) * 100) : 0,
    };
  };

  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch =
      merchant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "not_submitted" && !merchant.verification_status) ||
      merchant.verification_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Global stats
  const globalStats = {
    totalMerchants: merchants.length,
    verifiedMerchants: merchants.filter((m) => m.verification_status === 'verified').length,
    pendingVerifications: merchants.filter((m) => m.verification_status === 'pending').length,
    totalExchanges: exchanges.length,
    completedExchanges: exchanges.filter((e) => e.status === 'completed').length,
    avgExchangesPerMerchant: merchants.length > 0 ? Math.round(exchanges.length / merchants.length * 10) / 10 : 0,
    individuals: merchants.filter((m) => m.business_type === 'individual').length,
    enterprises: merchants.filter((m) => m.business_type === 'enterprise').length,
  };

  const overallValidationRate = globalStats.totalExchanges > 0
    ? Math.round((exchanges.filter((e) => ["validated", "preparing", "in_transit", "completed"].includes(e.status)).length / globalStats.totalExchanges) * 100)
    : 0;

  // Count merchants by verification status
  const statusCounts = {
    all: merchants.length,
    pending: merchants.filter((m) => m.verification_status === 'pending').length,
    verified: merchants.filter((m) => m.verification_status === 'verified').length,
    rejected: merchants.filter((m) => m.verification_status === 'rejected').length,
    not_submitted: merchants.filter((m) => !m.verification_status || m.verification_status === 'not_submitted').length,
  };

  // Get top performers (merchants with highest validation rate and > 5 exchanges)
  const topPerformers = merchants
    .map(m => ({ ...m, stats: getMerchantStats(m.id) }))
    .filter(m => m.stats.total >= 5)
    .sort((a, b) => b.stats.validationRate - a.stats.validationRate)
    .slice(0, 3)
    .map(m => m.id);

  const getVerificationBadge = (status: string | null) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Vérifié
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            En attente
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <XCircle className="w-3.5 h-3.5" />
            Rejeté
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            Non soumis
          </span>
        );
    }
  };

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              E-Commerçants
            </h1>
            <p className="text-slate-600">Gérez les comptes e-commerçants</p>
          </div>
          <Link
            to="/admin/merchant/new"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Ajouter un e-commerçant
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {/* Total Merchants */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{globalStats.totalMerchants}</p>
            <p className="text-xs text-slate-500">Total E-commerçants</p>
          </div>

          {/* Verified */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{globalStats.verifiedMerchants}</p>
            <p className="text-xs text-slate-500">Vérifiés</p>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600">{globalStats.pendingVerifications}</p>
            <p className="text-xs text-slate-500">En attente</p>
          </div>

          {/* Total Exchanges */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-sky-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{globalStats.totalExchanges}</p>
            <p className="text-xs text-slate-500">Total échanges</p>
          </div>

          {/* Validation Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{overallValidationRate}%</p>
            <p className="text-xs text-slate-500">Taux validation</p>
          </div>

          {/* Avg Exchanges */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-pink-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{globalStats.avgExchangesPerMerchant}</p>
            <p className="text-xs text-slate-500">Moy. échanges/marchand</p>
          </div>
        </div>

        {/* Business Type Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl border border-sky-200 p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-700">{globalStats.individuals}</p>
              <p className="text-sm text-sky-600">Particuliers (CIN)</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs text-sky-600 bg-sky-100 px-2 py-1 rounded-full">
                {globalStats.totalMerchants > 0 ? Math.round((globalStats.individuals / globalStats.totalMerchants) * 100) : 0}%
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-700">{globalStats.enterprises}</p>
              <p className="text-sm text-purple-600">Entreprises (Patente)</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                {globalStats.totalMerchants > 0 ? Math.round((globalStats.enterprises / globalStats.totalMerchants) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                statusFilter === "all"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tous
              <span className="px-1.5 py-0.5 rounded-full bg-white/50 text-xs">{statusCounts.all}</span>
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                statusFilter === "pending"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              En attente
              {statusCounts.pending > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-800 text-xs font-semibold animate-pulse">
                  {statusCounts.pending}
                </span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter("verified")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                statusFilter === "verified"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Vérifiés
              <span className="px-1.5 py-0.5 rounded-full bg-white/50 text-xs">{statusCounts.verified}</span>
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                statusFilter === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              Rejetés
              {statusCounts.rejected > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-200 text-red-800 text-xs">{statusCounts.rejected}</span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter("not_submitted")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                statusFilter === "not_submitted"
                  ? "bg-slate-200 text-slate-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Non soumis
              <span className="px-1.5 py-0.5 rounded-full bg-white/50 text-xs">{statusCounts.not_submitted}</span>
            </button>
          </div>
        </div>

        {/* Merchants List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                    E-Commerçant
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                    Contact
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-900">
                    <div className="flex items-center justify-center gap-1">
                      <Shield className="w-4 h-4" />
                      Statut
                    </div>
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-900">
                    <div className="flex items-center justify-center gap-1">
                      <Package className="w-4 h-4" />
                      Échanges
                    </div>
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-900">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Performance
                    </div>
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredMerchants.map((merchant) => {
                  const stats = getMerchantStats(merchant.id);
                  const isTopPerformer = topPerformers.includes(merchant.id);
                  return (
                    <tr
                      key={merchant.id}
                      className={`hover:bg-slate-50 transition-colors ${isTopPerformer ? 'bg-amber-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
                            merchant.verification_status === 'verified'
                              ? 'bg-emerald-100'
                              : merchant.verification_status === 'pending'
                              ? 'bg-amber-100'
                              : 'bg-purple-100'
                          }`}>
                            <Store className={`w-5 h-5 ${
                              merchant.verification_status === 'verified'
                                ? 'text-emerald-600'
                                : merchant.verification_status === 'pending'
                                ? 'text-amber-600'
                                : 'text-purple-600'
                            }`} />
                            {isTopPerformer && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                                <Award className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-900">
                                {merchant.name}
                              </p>
                              {isTopPerformer && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                                  Top
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <span>
                                {new Date(merchant.created_at).toLocaleDateString("fr-FR")}
                              </span>
                              {merchant.business_type && (
                                <span className="flex items-center gap-1">
                                  •
                                  {merchant.business_type === 'individual' ? (
                                    <CreditCard className="w-3 h-3" />
                                  ) : (
                                    <Building2 className="w-3 h-3" />
                                  )}
                                  {merchant.business_type === 'individual' ? 'Particulier' : 'Entreprise'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-900 text-sm">{merchant.email}</p>
                        <p className="text-sm text-slate-500">
                          {merchant.phone || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getVerificationBadge(merchant.verification_status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg">
                            <span className="text-lg font-bold text-slate-900">
                              {stats.total}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-2 mt-1 text-xs">
                            <span className="text-emerald-600 flex items-center gap-0.5">
                              <CheckCircle className="w-3 h-3" />
                              {stats.validated}
                            </span>
                            <span className="text-amber-600 flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {stats.pending}
                            </span>
                            {stats.rejected > 0 && (
                              <span className="text-red-600 flex items-center gap-0.5">
                                <XCircle className="w-3 h-3" />
                                {stats.rejected}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {stats.total > 0 ? (
                          <div>
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold ${
                              stats.validationRate >= 80
                                ? 'bg-emerald-100 text-emerald-700'
                                : stats.validationRate >= 50
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {stats.validationRate >= 50 ? (
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowDownRight className="w-3.5 h-3.5" />
                              )}
                              {stats.validationRate}%
                            </div>
                            <div className="mt-1 w-full bg-slate-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-all ${
                                  stats.validationRate >= 80
                                    ? 'bg-emerald-500'
                                    : stats.validationRate >= 50
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${stats.validationRate}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Aucun échange</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/merchant/${merchant.id}`}
                            className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <Link
                            to={`/admin/merchant/${merchant.id}/edit`}
                            className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => setDeleteModal(merchant.id)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredMerchants.length === 0 && (
            <div className="text-center py-12">
              <Store className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucun e-commerçant trouvé</p>
              <Link
                to="/admin/merchant/new"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-purple-600 hover:text-purple-700"
              >
                <Plus className="w-5 h-5" />
                Ajouter un e-commerçant
              </Link>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Confirmer la suppression
              </h3>
              <p className="text-slate-600 mb-6">
                Êtes-vous sûr de vouloir supprimer cet e-commerçant ? Cette
                action est irréversible.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteModal)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
