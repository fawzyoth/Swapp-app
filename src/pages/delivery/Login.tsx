import { useState } from "react";
import { Truck, ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function DeliveryLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Direct authentication against delivery_persons table (no email confirmation needed)
      const { data: deliveryPerson, error: dpError } = await supabase
        .from("delivery_persons")
        .select("id, name, email, password")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();

      if (dpError) {
        console.error("Error checking delivery person:", dpError);
        throw new Error("Erreur de connexion");
      }

      if (!deliveryPerson) {
        throw new Error("Compte livreur non trouvé. Vérifiez votre email.");
      }

      // Check password (stored directly in delivery_persons table)
      if (deliveryPerson.password !== password) {
        throw new Error("Mot de passe incorrect.");
      }

      // Store delivery person session in localStorage
      localStorage.setItem("delivery_person_id", deliveryPerson.id);
      localStorage.setItem("delivery_person_name", deliveryPerson.name);
      localStorage.setItem("delivery_person_email", deliveryPerson.email);

      // Redirect to dashboard
      window.location.href = "#/delivery/dashboard";
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={goHome}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour à l'accueil
        </button>

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <Truck className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Connexion Livreur
            </h1>
            <p className="text-slate-600">
              Accédez à votre espace de vérification
            </p>
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
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
