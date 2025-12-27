import { useState } from "react";
import { LogIn, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      if (data.user) {
        const userEmail = data.user.email;

        // Check if user is a merchant
        const { data: merchant } = await supabase
          .from("merchants")
          .select("id")
          .eq("email", userEmail)
          .maybeSingle();

        if (merchant) {
          // User is a merchant - redirect to merchant dashboard
          window.location.href = "#/merchant/dashboard";
          return;
        }

        // Check if user is a delivery person
        const { data: deliveryPerson } = await supabase
          .from("delivery_persons")
          .select("id")
          .eq("email", userEmail)
          .maybeSingle();

        if (deliveryPerson) {
          // User is a delivery person - redirect to delivery dashboard
          window.location.href = "#/delivery/dashboard";
          return;
        }

        // User not found in either table
        await supabase.auth.signOut();
        throw new Error("Compte non trouvé. Contactez l'administrateur.");
      }
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    window.location.href = "#/";
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
