import { useState, useEffect } from "react";
import { supabase, FinanceAlert, alertStatusLabels, alertSeverityLabels } from "../../lib/supabase";
import FinanceLayout from "../../components/FinanceLayout";
import {
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  AlertCircle,
  Shield,
} from "lucide-react";

export default function FinanceAlerts() {
  const [alerts, setAlerts] = useState<FinanceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedAlert, setSelectedAlert] = useState<FinanceAlert | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    fetchAlerts();
  }, [page, filterStatus, filterSeverity, filterType]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("finance_alerts")
        .select("*", { count: "exact" });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }
      if (filterSeverity !== "all") {
        query = query.eq("severity", filterSeverity);
      }
      if (filterType !== "all") {
        query = query.eq("alert_type", filterType);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;
      setAlerts(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("finance_alerts")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
        })
        .eq("id", alertId);

      if (error) throw error;

      fetchAlerts();
      setSelectedAlert(null);
    } catch (error) {
      console.error("Error resolving alert:", error);
    }
  };

  const handleDismissAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("finance_alerts")
        .update({
          status: "dismissed",
          resolved_at: new Date().toISOString(),
        })
        .eq("id", alertId);

      if (error) throw error;

      fetchAlerts();
      setSelectedAlert(null);
    } catch (error) {
      console.error("Error dismissing alert:", error);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "high":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case "medium":
        return <Bell className="w-5 h-5 text-yellow-500" />;
      case "low":
        return <Shield className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "acknowledged":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "dismissed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const alertTypes = [
    { value: "all", label: "Tous les types" },
    { value: "discrepancy", label: "Écart" },
    { value: "threshold", label: "Seuil Dépassé" },
    { value: "overdue", label: "Retard" },
    { value: "missing", label: "Données Manquantes" },
    { value: "duplicate", label: "Doublon" },
    { value: "anomaly", label: "Anomalie" },
  ];

  const severityOptions = [
    { value: "all", label: "Toutes les sévérités" },
    { value: "critical", label: "Critique" },
    { value: "high", label: "Haute" },
    { value: "medium", label: "Moyenne" },
    { value: "low", label: "Basse" },
  ];

  const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "open", label: "Ouvert" },
    { value: "acknowledged", label: "Reconnu" },
    { value: "resolved", label: "Résolu" },
    { value: "dismissed", label: "Ignoré" },
  ];

  const totalPages = Math.ceil(totalCount / pageSize);

  // Stats
  const openCount = alerts.filter(a => a.status === "open").length;
  const criticalCount = alerts.filter(a => a.severity === "critical" && a.status === "open").length;
  const highCount = alerts.filter(a => a.severity === "high" && a.status === "open").length;

  return (
    <FinanceLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alertes</h1>
            <p className="text-gray-500 mt-1">Surveillance et détection d'anomalies</p>
          </div>
          <button
            onClick={fetchAlerts}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Alertes Ouvertes</p>
                <p className="text-2xl font-bold text-red-600">{openCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Critiques</p>
                <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Haute Priorité</p>
                <p className="text-2xl font-bold text-orange-600">{highCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-600" />
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <select
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {alertTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterSeverity}
                onChange={(e) => { setFilterSeverity(e.target.value); setPage(1); }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {severityOptions.map((sev) => (
                  <option key={sev.value} value={sev.value}>{sev.label}</option>
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
            <div>
              <button
                onClick={fetchAlerts}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-gray-500">Aucune alerte trouvée</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${
                    alert.severity === "critical" ? "border-l-red-500" :
                    alert.severity === "high" ? "border-l-orange-500" :
                    alert.severity === "medium" ? "border-l-yellow-500" :
                    "border-l-blue-500"
                  }`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        alert.severity === "critical" ? "bg-red-100" :
                        alert.severity === "high" ? "bg-orange-100" :
                        alert.severity === "medium" ? "bg-yellow-100" :
                        "bg-blue-100"
                      }`}>
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${getSeverityColor(alert.severity)}`}>
                            {alertSeverityLabels[alert.severity] || alert.severity}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(alert.status)}`}>
                            {alertStatusLabels[alert.status] || alert.status}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-900">{alert.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{alert.description}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(alert.created_at).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAlert(alert);
                      }}
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
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

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
            <div className={`p-6 border-b ${
              selectedAlert.severity === "critical" ? "bg-red-50 border-red-100" :
              selectedAlert.severity === "high" ? "bg-orange-50 border-orange-100" :
              selectedAlert.severity === "medium" ? "bg-yellow-50 border-yellow-100" :
              "bg-blue-50 border-blue-100"
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getSeverityIcon(selectedAlert.severity)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getSeverityColor(selectedAlert.severity)}`}>
                        {alertSeverityLabels[selectedAlert.severity] || selectedAlert.severity}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(selectedAlert.status)}`}>
                        {alertStatusLabels[selectedAlert.status] || selectedAlert.status}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mt-1">{selectedAlert.title}</h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="p-2 hover:bg-white/50 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedAlert.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Type</h3>
                  <p className="text-gray-900 capitalize">
                    {selectedAlert.alert_type === "discrepancy" ? "Écart" :
                     selectedAlert.alert_type === "threshold" ? "Seuil Dépassé" :
                     selectedAlert.alert_type === "overdue" ? "Retard" :
                     selectedAlert.alert_type === "missing" ? "Données Manquantes" :
                     selectedAlert.alert_type === "duplicate" ? "Doublon" :
                     selectedAlert.alert_type === "anomaly" ? "Anomalie" :
                     selectedAlert.alert_type}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Créé le</h3>
                  <p className="text-gray-900">
                    {new Date(selectedAlert.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {selectedAlert.resolved_at && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Résolu le</h3>
                  <p className="text-green-600">
                    {new Date(selectedAlert.resolved_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}

              {selectedAlert.resolution_notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes de Résolution</h3>
                  <p className="text-gray-900 bg-green-50 p-4 rounded-lg">{selectedAlert.resolution_notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              {selectedAlert.status === "open" && (
                <>
                  <button
                    onClick={() => handleDismissAlert(selectedAlert.id)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Ignorer
                  </button>
                  <button
                    onClick={() => handleResolveAlert(selectedAlert.id)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                  >
                    Marquer Résolu
                  </button>
                </>
              )}
              {selectedAlert.status === "acknowledged" && (
                <button
                  onClick={() => handleResolveAlert(selectedAlert.id)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                  Marquer Résolu
                </button>
              )}
              <button
                onClick={() => setSelectedAlert(null)}
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
