import { useNavigate } from "react-router-dom";
import { ArrowRight, QrCode, Package, CheckCircle, Smartphone, TrendingUp, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import landingImage from "../lib/landingimage.png";
import Landing from "./Landing";

export default function LandingNew() {
  const navigate = useNavigate();
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  // If user wants to see original, render that instead
  if (showOriginal) {
    return <Landing />;
  }

  useEffect(() => {
    const scroll1 = scrollRef1.current;
    const scroll2 = scrollRef2.current;

    if (!scroll1 || !scroll2) return;

    let animationFrameId1: number;
    let animationFrameId2: number;
    let position1 = 0;
    let position2 = 0;

    const animate1 = () => {
      position1 -= 0.5;
      if (scroll1) {
        scroll1.style.transform = `translateY(${position1}px)`;
        if (Math.abs(position1) >= scroll1.scrollHeight / 2) {
          position1 = 0;
        }
      }
      animationFrameId1 = requestAnimationFrame(animate1);
    };

    const animate2 = () => {
      position2 += 0.5;
      if (scroll2) {
        scroll2.style.transform = `translateY(${position2}px)`;
        if (position2 >= scroll2.scrollHeight / 2) {
          position2 = 0;
        }
      }
      animationFrameId2 = requestAnimationFrame(animate2);
    };

    animationFrameId1 = requestAnimationFrame(animate1);
    animationFrameId2 = requestAnimationFrame(animate2);

    return () => {
      cancelAnimationFrame(animationFrameId1);
      cancelAnimationFrame(animationFrameId2);
    };
  }, []);

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <img
            src="/SWAPPIE.svg"
            alt="SWAPPIE"
            style={{ height: '4rem' }}
            className="w-auto"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors font-medium flex items-center gap-1.5"
              title="Basculer entre les versions"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Version {showOriginal ? "Animée" : "Simple"}
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

      {/* Hero Section with Animated Background */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-20 overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
        {/* Top Content - Centered */}
        <div className="relative z-20 text-center px-6 pt-16 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8">
            <CheckCircle className="w-4 h-4" />
            Plateforme d'échanges vérifiés
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto">
            Chaque échange, <span className="text-yellow-300">vérifié.</span>
          </h1>

          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            La plateforme de confiance pour les retours et échanges e-commerce.
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl hover:bg-yellow-300 transition-all font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Créer un compte
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Cards - Positioned Absolutely */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left Top Card */}
          <div ref={scrollRef1} className="absolute left-[5%] top-[25%] transform -translate-y-1/2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 w-64 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">QR Scanner</div>
                  <div className="text-xs text-slate-500">Scan rapide</div>
                </div>
              </div>
              <div className="w-full h-24 bg-slate-100 rounded-lg"></div>
            </div>
          </div>

          {/* Right Top Card */}
          <div ref={scrollRef2} className="absolute right-[5%] top-[30%] transform -translate-y-1/2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 w-64 border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <div className="font-semibold text-slate-900 text-sm">Échange validé</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Code</span>
                  <span className="font-mono font-medium">EX-2024</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Statut</span>
                  <span className="text-emerald-600 font-medium">✓ Validé</span>
                </div>
              </div>
            </div>
          </div>

          {/* Left Middle Card */}
          <div className="absolute left-[10%] top-[50%] transform -translate-y-1/2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 w-56 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <Package className="w-5 h-5 text-blue-600" />
                <div className="font-medium text-slate-900 text-sm">Colis en transit</div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-blue-100 rounded w-full"></div>
                <div className="h-2 bg-blue-100 rounded w-3/4"></div>
                <div className="h-2 bg-blue-100 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          {/* Right Middle Card */}
          <div className="absolute right-[8%] top-[55%] transform -translate-y-1/2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 w-56 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div className="font-medium text-slate-900 text-sm">Statistiques</div>
              </div>
              <div className="text-3xl font-bold text-purple-600">98%</div>
              <div className="text-xs text-slate-500">Satisfaction client</div>
            </div>
          </div>
        </div>

        {/* Woman Image - Bottom Center */}
        <div className="relative z-10 mt-auto w-full max-w-2xl mx-auto">
          <img
            src={landingImage}
            alt="Happy customer"
            className="w-full h-auto object-contain object-bottom"
            style={{ maxHeight: '60vh' }}
          />
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
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
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

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Vérification
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Chaque étape est vérifiée et documentée pour une traçabilité complète.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <QrCode className="w-7 h-7 text-purple-600" />
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
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
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
            style={{ height: '4rem' }}
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
