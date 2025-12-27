import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Store, ArrowLeft, Play } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function MerchantLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Clear session cache when on login page (but not if demo mode is being set)
  useEffect(() => {
    // Don't clear if demo mode is active - user might be redirecting
    if (sessionStorage.getItem("demo_mode") === "true") {
      return;
    }
    sessionStorage.removeItem("merchant_auth_v2");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Login response:", { data, error });

      if (error) throw error;

      if (data.user) {
        console.log("User authenticated:", data.user.email);

        // Check if this email belongs to a delivery person (forbidden)
        const { data: deliveryPerson } = await supabase
          .from("delivery_persons")
          .select("id")
          .eq("email", data.user.email)
          .maybeSingle();

        if (deliveryPerson) {
          await supabase.auth.signOut();
          throw new Error(
            "Ce compte est un compte livreur. Veuillez utiliser le portail livreur.",
          );
        }

        // Verify the user is a merchant by email
        const { data: merchant, error: merchantError } = await supabase
          .from("merchants")
          .select("id")
          .eq("email", data.user.email)
          .maybeSingle();

        console.log("Merchant lookup:", { merchant, merchantError });

        if (merchantError || !merchant) {
          await supabase.auth.signOut();
          throw new Error(
            `Compte e-commerçant non trouvé pour ${data.user.email}. Veuillez contacter l'administrateur.`,
          );
        }

        console.log("Login successful, navigating to dashboard");
        window.location.href = "#/merchant/dashboard";
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    // Set demo mode flag in sessionStorage
    sessionStorage.setItem("demo_mode", "true");
    sessionStorage.setItem(
      "demo_merchant",
      JSON.stringify({
        id: "demo-merchant-id",
        email: "demo@merchant.com",
        name: "Boutique Demo",
        business_name: "Ma Boutique Demo",
        phone: "+216 70 000 000",
        business_address: "Avenue Habib Bourguiba, Tunis",
        business_city: "Tunis",
      }),
    );
    // Redirect to dashboard (full URL to force reload)
    window.location.assign(
      window.location.origin +
        window.location.pathname +
        "#/merchant/dashboard",
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour à l'accueil
        </button>

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4">
              <Store className="w-8 h-8 text-sky-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Connexion E-Commerçant
            </h1>
            <p className="text-slate-600">Accédez à votre tableau de bord</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            {/* Demo Mode Button */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Play className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-purple-800 font-bold">
                  Mode Démonstration
                </p>
              </div>
              <p className="text-xs text-purple-700 mb-3">
                Testez la plateforme sans créer de compte. Données fictives
                uniquement.
              </p>
              <button
                onClick={handleDemoMode}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Accéder à la Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
