import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Calculator, Lock, Mail, AlertCircle } from "lucide-react";

export default function FinanceLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Demo credentials - no database required
    const DEMO_EMAIL = "finance@swapp.tn";
    const DEMO_PASSWORD = "finance123";

    try {
      // Check demo credentials first
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        const demoUser = {
          id: "demo-finance-user",
          email: DEMO_EMAIL,
          name: "Finance Admin",
          role: "admin",
          is_active: true,
        };
        sessionStorage.setItem("financeUser", JSON.stringify(demoUser));
        navigate("/finance/dashboard");
        return;
      }

      // Try Supabase Auth for real users
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        setError("Email ou mot de passe incorrect");
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Erreur de connexion");
        setLoading(false);
        return;
      }

      // Check if user is a finance user by email
      const { data: financeUser, error: financeError } = await supabase
        .from("finance_users")
        .select("*")
        .eq("email", authData.user.email)
        .eq("is_active", true)
        .single();

      if (financeError || !financeUser) {
        await supabase.auth.signOut();
        setError("Accès non autorisé à la plateforme financière");
        setLoading(false);
        return;
      }

      // Store finance user info in session storage
      sessionStorage.setItem("financeUser", JSON.stringify(financeUser));

      navigate("/finance/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-xl mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">SWAPP Finance</h1>
          <p className="text-slate-400 mt-1">
            Plateforme de Gestion Financière
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Connexion
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="finance@swapp.tn"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="********"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="bg-slate-50 rounded-lg p-3 mb-3">
              <p className="text-xs font-medium text-slate-600 mb-1">
                Identifiants demo:
              </p>
              <p className="text-xs text-slate-500">Email: finance@swapp.tn</p>
              <p className="text-xs text-slate-500">Mot de passe: finance123</p>
            </div>
            <p className="text-xs text-center text-gray-500">
              Accès réservé à l'équipe financière SWAPP
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          &copy; 2025 SWAPP - Plateforme Financière
        </p>
      </div>
    </div>
  );
}
