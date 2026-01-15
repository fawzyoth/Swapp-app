import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, Lock, ArrowLeft, Eye, EyeOff, Truck, CheckCircle, XCircle, Loader, Plus, Trash2, X } from "lucide-react";
import MerchantSidebar from "../../components/MerchantSidebar";
import { supabase } from "../../lib/supabase";

interface DeliveryIntegration {
  id: string;
  delivery_company: string;
  status: string;
  created_at: string;
}

const DELIVERY_COMPANIES = [
  { value: "test_delivery", label: "Test Delivery (Fake/Testing)" },
  { value: "aramex", label: "Aramex" },
  { value: "fedex", label: "FedEx" },
  { value: "dhl", label: "DHL" },
  { value: "ups", label: "UPS" },
  { value: "la_poste_tunisienne", label: "La Poste Tunisienne" },
  { value: "speedaf", label: "Speedaf" },
  { value: "mylerz", label: "Mylerz" },
];

export default function Settings() {
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState<"general" | "delivery">("general");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delivery company integration state
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  const [deliverySuccess, setDeliverySuccess] = useState("");
  const [deliveryIntegrations, setDeliveryIntegrations] = useState<DeliveryIntegration[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeliveryCompany, setNewDeliveryCompany] = useState("");
  const [newDeliveryApiKey, setNewDeliveryApiKey] = useState("");
  const [showNewApiKey, setShowNewApiKey] = useState(false);

  // Fetch delivery integrations on mount
  useEffect(() => {
    fetchDeliveryIntegrations();
  }, []);

  const fetchDeliveryIntegrations = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from("delivery_integrations")
        .select("*")
        .eq("merchant_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setDeliveryIntegrations(data || []);
    } catch (err) {
      console.error("Error fetching delivery integrations:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear messages when user starts typing
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError("Veuillez entrer votre mot de passe actuel");
      return false;
    }
    if (!formData.newPassword) {
      setError("Veuillez entrer un nouveau mot de passe");
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError("Le nouveau mot de passe doit être différent de l'ancien");
      return false;
    }
    return true;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // First, verify current password by trying to sign in with it
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        throw new Error("Session non trouvée. Veuillez vous reconnecter.");
      }

      // Try to sign in with current password to verify it
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: formData.currentPassword,
      });

      if (signInError) {
        throw new Error("Mot de passe actuel incorrect");
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) throw updateError;

      setSuccess("Mot de passe changé avec succès!");

      // Clear form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Show success message for 2 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (err: any) {
      console.error("Password change error:", err);
      setError(err.message || "Erreur lors du changement de mot de passe");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeliveryIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeliveryLoading(true);
    setDeliveryError("");
    setDeliverySuccess("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error("Session non trouvée. Veuillez vous reconnecter.");
      }

      if (!newDeliveryCompany) {
        throw new Error("Veuillez sélectionner une société de livraison");
      }

      if (!newDeliveryApiKey.trim()) {
        throw new Error("Veuillez entrer une clé API");
      }

      // Check if integration already exists
      const existing = deliveryIntegrations.find(
        (d) => d.delivery_company === newDeliveryCompany
      );
      if (existing) {
        throw new Error("Cette société de livraison est déjà intégrée");
      }

      // Insert new delivery integration
      const { error: insertError } = await supabase
        .from("delivery_integrations")
        .insert({
          merchant_id: session.user.id,
          delivery_company: newDeliveryCompany,
          api_key: newDeliveryApiKey,
          status: "active",
        });

      if (insertError) throw insertError;

      setDeliverySuccess("Intégration ajoutée avec succès!");
      setShowAddModal(false);
      setNewDeliveryCompany("");
      setNewDeliveryApiKey("");

      // Refresh delivery integrations
      await fetchDeliveryIntegrations();

      setTimeout(() => {
        setDeliverySuccess("");
      }, 3000);

    } catch (err: any) {
      console.error("Add delivery integration error:", err);
      setDeliveryError(err.message || "Erreur lors de l'ajout de l'intégration");
    } finally {
      setDeliveryLoading(false);
    }
  };

  const handleDeleteIntegration = async (integrationId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette intégration?")) {
      return;
    }

    setDeliveryLoading(true);
    setDeliveryError("");

    try {
      const { error: deleteError } = await supabase
        .from("delivery_integrations")
        .delete()
        .eq("id", integrationId);

      if (deleteError) throw deleteError;

      setDeliverySuccess("Intégration supprimée avec succès!");
      await fetchDeliveryIntegrations();

      setTimeout(() => {
        setDeliverySuccess("");
      }, 3000);

    } catch (err: any) {
      console.error("Delete delivery integration error:", err);
      setDeliveryError(err.message || "Erreur lors de la suppression");
    } finally {
      setDeliveryLoading(false);
    }
  };

  const getCompanyLabel = (value: string) => {
    return DELIVERY_COMPANIES.find((c) => c.value === value)?.label || value;
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <MerchantSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/merchant/dashboard")}
              className="flex items-center text-slate-600 hover:text-slate-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour au Dashboard
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <SettingsIcon className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
                <p className="text-slate-600">Gérez votre compte et vos préférences</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "general"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Lock className="w-5 h-5" />
              <span>Général</span>
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "delivery"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Truck className="w-5 h-5" />
              <span>Intégrations Livraison</span>
              {deliveryIntegrations.length > 0 && (
                <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {deliveryIntegrations.length}
                </span>
              )}
            </button>
          </div>

          {/* General Tab */}
          {activeTab === "general" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <Lock className="w-6 h-6 text-slate-700" />
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Changer le mot de passe
                </h2>
                <p className="text-sm text-slate-600">
                  Mettez à jour votre mot de passe pour sécuriser votre compte
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mot de passe actuel *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    required
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nouveau mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Minimum 6 caractères
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirmer le nouveau mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-semibold transition-colors"
              >
                {loading ? "Changement en cours..." : "Changer le mot de passe"}
              </button>
            </form>
            </div>
          )}

          {/* Delivery Tab */}
          {activeTab === "delivery" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-slate-700" />
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Sociétés de Livraison
                  </h2>
                  <p className="text-sm text-slate-600">
                    Gérez vos intégrations avec les sociétés de livraison
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Ajouter
              </button>
            </div>

            {deliveryError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                {deliveryError}
              </div>
            )}

            {deliverySuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                {deliverySuccess}
              </div>
            )}

            {/* List of integrations */}
            {deliveryIntegrations.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <Truck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-4">
                  Aucune intégration configurée
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter une intégration
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {deliveryIntegrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Truck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {getCompanyLabel(integration.delivery_company)}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            integration.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-700"
                          }`}>
                            {integration.status === "active" ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                Inactive
                              </>
                            )}
                          </span>
                          <span className="text-xs text-slate-500">
                            Ajouté le {new Date(integration.created_at).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteIntegration(integration.id)}
                      disabled={deliveryLoading}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors disabled:opacity-50"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Info Card */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                💡 Comment obtenir votre clé API?
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Connectez-vous au tableau de bord de votre société de livraison</li>
                <li>• Accédez aux paramètres d'intégration ou API</li>
                <li>• Générez une nouvelle clé API si nécessaire</li>
                <li>• Copiez et collez la clé lors de l'ajout d'une intégration</li>
              </ul>
            </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">
                Ajouter une intégration
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddDeliveryIntegration} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Société de livraison *
                </label>
                <select
                  value={newDeliveryCompany}
                  onChange={(e) => setNewDeliveryCompany(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Sélectionnez une société</option>
                  {DELIVERY_COMPANIES.map((company) => (
                    <option key={company.value} value={company.value}>
                      {company.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Clé API *
                </label>
                <div className="relative">
                  <input
                    type={showNewApiKey ? "text" : "password"}
                    value={newDeliveryApiKey}
                    onChange={(e) => setNewDeliveryApiKey(e.target.value)}
                    required
                    placeholder="Entrez votre clé API"
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewApiKey(!showNewApiKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Obtenez votre clé API depuis le tableau de bord de votre société de livraison
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={deliveryLoading}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {deliveryLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Ajout...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Ajouter
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
