import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, Lock, ArrowLeft, Eye, EyeOff, Truck, CheckCircle, XCircle, Loader } from "lucide-react";
import MerchantSidebar from "../../components/MerchantSidebar";
import { supabase } from "../../lib/supabase";

export default function Settings() {
  const navigate = useNavigate();
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
  const [deliveryCompany, setDeliveryCompany] = useState<string>("");
  const [deliveryApiKey, setDeliveryApiKey] = useState("");
  const [showDeliveryApiKey, setShowDeliveryApiKey] = useState(false);
  const [deliveryIntegration, setDeliveryIntegration] = useState<any>(null);

  // Fetch delivery integration on mount
  useEffect(() => {
    fetchDeliveryIntegration();
  }, []);

  const fetchDeliveryIntegration = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from("merchants")
        .select("delivery_company, delivery_api_key, delivery_integration_status")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setDeliveryIntegration(data);
        setDeliveryCompany(data.delivery_company || "");
      }
    } catch (err) {
      console.error("Error fetching delivery integration:", err);
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

  const handleDeliveryIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeliveryLoading(true);
    setDeliveryError("");
    setDeliverySuccess("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error("Session non trouvée. Veuillez vous reconnecter.");
      }

      if (!deliveryCompany) {
        throw new Error("Veuillez sélectionner une société de livraison");
      }

      if (!deliveryApiKey.trim()) {
        throw new Error("Veuillez entrer une clé API");
      }

      // Update merchant record with delivery integration
      const { error: updateError } = await supabase
        .from("merchants")
        .update({
          delivery_company: deliveryCompany,
          delivery_api_key: deliveryApiKey,
          delivery_integration_status: "active",
        })
        .eq("id", session.user.id);

      if (updateError) throw updateError;

      setDeliverySuccess("Intégration de livraison configurée avec succès!");
      setDeliveryApiKey("");

      // Refresh delivery integration data
      await fetchDeliveryIntegration();

      setTimeout(() => {
        setDeliverySuccess("");
      }, 3000);

    } catch (err: any) {
      console.error("Delivery integration error:", err);
      setDeliveryError(err.message || "Erreur lors de la configuration de l'intégration");
    } finally {
      setDeliveryLoading(false);
    }
  };

  const handleDisconnectDelivery = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir déconnecter cette intégration?")) {
      return;
    }

    setDeliveryLoading(true);
    setDeliveryError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error("Session non trouvée. Veuillez vous reconnecter.");
      }

      const { error: updateError } = await supabase
        .from("merchants")
        .update({
          delivery_company: null,
          delivery_api_key: null,
          delivery_integration_status: null,
        })
        .eq("id", session.user.id);

      if (updateError) throw updateError;

      setDeliverySuccess("Intégration déconnectée avec succès!");
      setDeliveryCompany("");
      await fetchDeliveryIntegration();

      setTimeout(() => {
        setDeliverySuccess("");
      }, 3000);

    } catch (err: any) {
      console.error("Disconnect delivery error:", err);
      setDeliveryError(err.message || "Erreur lors de la déconnexion");
    } finally {
      setDeliveryLoading(false);
    }
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
                <SettingsIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
                <p className="text-slate-600">Gérez votre compte et vos préférences</p>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
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

          {/* Delivery Company Integration Section */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <Truck className="w-6 h-6 text-slate-700" />
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Société de Livraison
                </h2>
                <p className="text-sm text-slate-600">
                  Intégrez votre compte avec une société de livraison
                </p>
              </div>
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

            {/* Show current integration status */}
            {deliveryIntegration?.delivery_integration_status === "active" && (
              <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-900">
                        Intégration Active
                      </p>
                      <p className="text-sm text-emerald-700">
                        Société: <span className="font-medium">{deliveryIntegration.delivery_company}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnectDelivery}
                    disabled={deliveryLoading}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    Déconnecter
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleDeliveryIntegration} className="space-y-5">
              {/* Delivery Company Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Société de livraison *
                </label>
                <select
                  value={deliveryCompany}
                  onChange={(e) => setDeliveryCompany(e.target.value)}
                  required
                  disabled={deliveryIntegration?.delivery_integration_status === "active"}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Sélectionnez une société</option>
                  <option value="aramex">Aramex</option>
                  <option value="fedex">FedEx</option>
                  <option value="dhl">DHL</option>
                  <option value="ups">UPS</option>
                  <option value="la_poste_tunisienne">La Poste Tunisienne</option>
                  <option value="speedaf">Speedaf</option>
                  <option value="mylerz">Mylerz</option>
                </select>
              </div>

              {/* API Key Input */}
              {deliveryIntegration?.delivery_integration_status !== "active" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Clé API *
                  </label>
                  <div className="relative">
                    <input
                      type={showDeliveryApiKey ? "text" : "password"}
                      value={deliveryApiKey}
                      onChange={(e) => setDeliveryApiKey(e.target.value)}
                      required
                      placeholder="Entrez votre clé API"
                      className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeliveryApiKey(!showDeliveryApiKey)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showDeliveryApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Obtenez votre clé API depuis le tableau de bord de votre société de livraison
                  </p>
                </div>
              )}

              {/* Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  💡 Comment obtenir votre clé API?
                </h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Connectez-vous au tableau de bord de votre société de livraison</li>
                  <li>• Accédez aux paramètres d'intégration ou API</li>
                  <li>• Générez une nouvelle clé API si nécessaire</li>
                  <li>• Copiez et collez la clé ici</li>
                </ul>
              </div>

              {/* Submit Button */}
              {deliveryIntegration?.delivery_integration_status !== "active" && (
                <button
                  type="submit"
                  disabled={deliveryLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {deliveryLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Configuration en cours...
                    </>
                  ) : (
                    <>
                      <Truck className="w-5 h-5" />
                      Configurer l'intégration
                    </>
                  )}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
