import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("[LOGIN] Starting login process...");
    console.log("[LOGIN] Email:", email.trim().toLowerCase());

    try {
      // Sign in with Supabase
      console.log("[LOGIN] Calling supabase.auth.signInWithPassword...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("[LOGIN] Supabase auth response:");
      console.log("[LOGIN] - data:", data);
      console.log("[LOGIN] - error:", error);
      console.log("[LOGIN] - data.user:", data?.user);
      console.log("[LOGIN] - data.session:", data?.session);

      if (error) {
        console.error("[LOGIN] Auth error:", error);
        throw error;
      }

      if (data.user) {
        const userEmail = data.user.email;
        console.log("[LOGIN] User authenticated successfully!");
        console.log("[LOGIN] User ID:", data.user.id);
        console.log("[LOGIN] User email:", userEmail);

        // Check if user is a merchant
        console.log("[LOGIN] Checking if user is a merchant...");
        const { data: merchant, error: merchantError } = await supabase
          .from("merchants")
          .select("id")
          .eq("email", userEmail)
          .maybeSingle();

        console.log("[LOGIN] Merchant query result:");
        console.log("[LOGIN] - merchant:", merchant);
        console.log("[LOGIN] - merchantError:", merchantError);

        if (merchant) {
          console.log(
            "[LOGIN] User is a MERCHANT! Redirecting to /merchant/dashboard...",
          );
          console.log("[LOGIN] navigate function:", navigate);
          console.log("[LOGIN] Calling navigate now...");
          navigate("/merchant/dashboard", { replace: true });
          console.log("[LOGIN] navigate() called, should have redirected");
          return;
        }

        // Check if user is a delivery person
        console.log(
          "[LOGIN] User is not a merchant. Checking if delivery person...",
        );
        const { data: deliveryPerson, error: deliveryError } = await supabase
          .from("delivery_persons")
          .select("id")
          .eq("email", userEmail)
          .maybeSingle();

        console.log("[LOGIN] Delivery person query result:");
        console.log("[LOGIN] - deliveryPerson:", deliveryPerson);
        console.log("[LOGIN] - deliveryError:", deliveryError);

        if (deliveryPerson) {
          console.log(
            "[LOGIN] User is a DELIVERY PERSON! Redirecting to /delivery/dashboard...",
          );
          navigate("/delivery/dashboard", { replace: true });
          console.log("[LOGIN] navigate() called, should have redirected");
          return;
        }

        // User not found in either table
        console.log(
          "[LOGIN] User not found in merchants or delivery_persons tables!",
        );
        console.log("[LOGIN] Signing out user...");
        await supabase.auth.signOut();
        throw new Error("Compte non trouvé. Contactez l'administrateur.");
      } else {
        console.log("[LOGIN] No user in response data");
      }
    } catch (err: any) {
      console.error("[LOGIN] Caught error:", err);
      console.error("[LOGIN] Error message:", err.message);
      setError(err.message || "Erreur de connexion");
    } finally {
      console.log("[LOGIN] Login process finished. Loading:", false);
      setLoading(false);
    }
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <button
          onClick={goHome}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour à l'accueil
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
            <LogIn className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Connexion</h1>
          <p className="text-slate-600">Accédez à votre espace SWAPP</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl font-semibold text-lg transition-colors"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Vous serez redirigé automatiquement vers votre espace
        </p>
      </div>
    </div>
  );
}
