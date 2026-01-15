import { useNavigate } from "react-router-dom";
import { Shield, Package, CheckCircle, ArrowRight, RefreshCw } from "lucide-react";
import { useState } from "react";
import LandingNew from "./LandingNew";

export default function Landing() {
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);

  // If user wants to see new version, render that instead
  if (showNew) {
    return <LandingNew />;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-28 flex items-center justify-between">
          <img
            src="/SWAPPIE.svg"
            alt="SWAPPIE"
            style={{ height: '6.5rem' }}
            className="w-auto"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNew(!showNew)}
              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors font-medium flex items-center gap-1.5"
              title="Basculer entre les versions"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Version {showNew ? "Simple" : "Animée"}
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
            >
              Connexion
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-sm px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Commencer
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-8">
            <CheckCircle className="w-4 h-4" />
            Plateforme d'échanges vérifiés
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Chaque échange,
            <br />
            <span className="text-emerald-600">vérifié.</span>
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            La plateforme de confiance pour les retours et échanges e-commerce.
            Protégez vos transactions avec une vérification complète.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium text-lg shadow-lg shadow-emerald-200"
            >
              Créer un compte
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium text-lg"
            >
              Se connecter
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Comment ça marche
            </h2>
            <p className="text-lg text-slate-600">
              Simple, rapide et sécurisé
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Package className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Demande d'échange
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Le client scanne le QR code et soumet sa demande d'échange avec photos.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Vérification
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Chaque étape est vérifiée et documentée pour une traçabilité complète.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Échange effectué
              </h3>
              <p className="text-slate-600 leading-relaxed">
                L'échange est complété avec une preuve vérifiable pour toutes les parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Rejoignez les marchands qui protègent leurs échanges
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium text-lg shadow-lg shadow-emerald-200"
          >
            Créer un compte gratuit
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <img
            src="/SWAPPIE.svg"
            alt="SWAPPIE"
            style={{ height: '5rem' }}
            className="w-auto opacity-70"
          />
          <div className="flex gap-8 text-sm text-slate-500">
            <button
              onClick={() => navigate("/login")}
              className="hover:text-slate-900 transition-colors"
            >
              Connexion
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="hover:text-slate-900 transition-colors"
            >
              Inscription
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
