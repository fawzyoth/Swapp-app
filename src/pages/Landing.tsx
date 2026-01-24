import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Truck,
  Menu,
  X,
  Shield,
  Clock,
  Package,
  BarChart3,
  Headphones,
  MapPin,
  CreditCard,
  Building2,
  BadgeCheck,
  Users,
  ChevronRight,
  Moon,
  Sun,
  TrendingUp,
  QrCode,
  Smartphone,
  Camera,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("landing_dark_mode");
    return saved === "true";
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    store: "",
    message: ""
  });

  // Track scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem("landing_dark_mode", darkMode.toString());
  }, [darkMode]);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen font-sans`}>
      <div className="bg-white dark:bg-slate-900 min-h-screen transition-colors duration-300">
      {/* Header - Clean & Clear */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-lg"
          : "bg-white dark:bg-slate-900"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>ixmoove</span>
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1">
                {[
                  { label: "Services", id: "services" },
                  { label: "Processus", id: "processus" },
                  { label: "Tarifs", id: "tarifs" },
                  { label: "Contact", id: "contact" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="text-sm font-semibold px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/30 transition-all"
              >
                Commencer gratuitement
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-6">
            <nav className="space-y-2">
              {[
                { label: "Services", id: "services" },
                { label: "Processus", id: "processus" },
                { label: "Tarifs", id: "tarifs" },
                { label: "Contact", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center justify-between w-full px-4 py-3 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  {item.label}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </nav>

            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center justify-between w-full px-4 py-3 mt-2 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <span className="flex items-center gap-3">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {darkMode ? "Mode clair" : "Mode sombre"}
              </span>
              <div className={`w-10 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
            </button>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate("/login"); }}
                className="block w-full text-center py-3 text-slate-700 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Connexion
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate("/signup"); }}
                className="block w-full text-center py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all"
              >
                Commencer gratuitement
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Clean Two Column */}
      <section className="pt-32 pb-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text */}
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-4 tracking-wide">
                Spécialiste des échanges e-commerce en Tunisie
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-[1.15] mb-6">
                La livraison qui{' '}
                <span className="text-blue-600 dark:text-blue-400">vérifie</span> chaque retour
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Livrez le nouveau produit, récupérez l'ancien avec vérification photo sur place. Protégez votre e-commerce contre la fraude.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <button
                  onClick={() => navigate("/signup")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Démarrer gratuitement
                </button>
                <button
                  onClick={() => scrollToSection("processus")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  Comment ça marche
                </button>
              </div>

              {/* Inline Stats */}
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">5,000+</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Échanges</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">24h</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Délai moyen</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">100%</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Vérifié</div>
                </div>
              </div>
            </div>

            {/* Right Column - Single Clean Card */}
            <div className="hidden lg:block">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900 px-6 py-4">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <span className="text-lg font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>ixmoove</span>
                      <p className="text-xs text-slate-400">Bordereau #EXC-0847</p>
                    </div>
                    <span className="px-2.5 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                      Validé
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  {/* Client & Product */}
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Client</p>
                      <p className="font-medium text-slate-900 dark:text-white">Ahmed Ben Ali</p>
                      <p className="text-sm text-slate-500">Tunis, Lac 2</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Date</p>
                      <p className="font-medium text-slate-900 dark:text-white">24 Jan 2026</p>
                    </div>
                  </div>

                  {/* Product Box */}
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Produit échangé</p>
                    <p className="font-semibold text-slate-900 dark:text-white">iPhone 15 Pro - 256GB</p>
                    <p className="text-sm text-slate-500 mt-1">Changement de couleur</p>
                  </div>

                  {/* Verification Photos */}
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Photos de vérification</p>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`w-14 h-14 rounded-lg flex items-center justify-center ${i === 3 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-600'}`}>
                          {i === 3 ? (
                            <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                          ) : (
                            <Camera className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      ))}
                      <div className="w-14 h-14 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-600 flex items-center justify-center">
                        <span className="text-slate-400 text-xl">+</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">Mohamed K.</span>
                    </div>
                    <button className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Voir détails →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients logos - Simple */}
      <section className="py-12 px-6 border-y border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm font-medium text-slate-400 mb-8 uppercase tracking-wider">
            Ils nous font confiance
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {["FASHIONTN", "LUXE STORE", "MODAPLUS", "TECH ZONE", "BEAUTY BOX", "STYLE HOUSE"].map((brand) => (
              <span key={brand} className="text-lg font-semibold text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500 transition-colors">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Clean */}
      <section className="py-16 px-6 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "5,000+", label: "Échanges traités" },
              { value: "98%", label: "Satisfaction client" },
              { value: "24h", label: "Délai moyen" },
              { value: "100%", label: "Vérification" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-semibold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Card Style */}
      <section id="services" className="py-20 px-6 scroll-mt-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">Nos services</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mb-4">
              Une solution complète pour vos échanges
            </h2>
          </div>

          {/* First Row - 3 Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Card 1 - Livraison d'échanges */}
            <div className="bg-[#e8f4f3] dark:bg-teal-900/20 rounded-2xl p-6 flex flex-col min-h-[420px]">
              {/* Visual Mockup */}
              <div className="flex-1 relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center">
                      <Package className="w-14 h-14 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-md flex items-center justify-center">
                      <Truck className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-white dark:bg-slate-800 rounded-lg shadow-md px-3 py-1.5 flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Confirmé</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Livraison d'échanges</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                  Livraison du nouveau produit et récupération de l'ancien en une seule tournée optimisée.
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className="inline-flex items-center px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  Découvrir
                </button>
              </div>
            </div>

            {/* Card 2 - Vérification sur place */}
            <div className="bg-[#f5f0e8] dark:bg-amber-900/20 rounded-2xl p-6 flex flex-col min-h-[420px]">
              {/* Visual Mockup */}
              <div className="flex-1 relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-44 bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-100 border-b">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-6 h-6 text-amber-600" />
                          <div className="flex-1">
                            <div className="h-1.5 bg-slate-200 rounded w-3/4 mb-1"></div>
                            <div className="h-1.5 bg-slate-100 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-green-500" />
                            <div className="h-1.5 bg-slate-100 rounded flex-1"></div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-green-500" />
                            <div className="h-1.5 bg-slate-100 rounded flex-1"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-md px-2.5 py-2 flex items-center gap-1.5">
                      <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-slate-700">Photo</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Vérification sur place</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                  Inspection complète du produit retourné avec documentation photo et vidéo.
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className="inline-flex items-center px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  En savoir plus
                </button>
              </div>
            </div>

            {/* Card 3 - Gestion des retours */}
            <div className="bg-[#fef3e8] dark:bg-orange-900/20 rounded-2xl p-6 flex flex-col min-h-[420px]">
              {/* Visual Mockup */}
              <div className="flex-1 relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                      <Package className="w-14 h-14 text-orange-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-orange-600 rotate-180" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-md px-3 py-1.5">
                      <span className="text-xs font-medium text-orange-600">Retour SAV</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Gestion des retours</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                  Prise en charge complète des retours SAV pour produits défectueux ou non conformes.
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className="inline-flex items-center px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  Découvrir
                </button>
              </div>
            </div>
          </div>

          {/* Second Row - 3 Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 4 - Encaissement sécurisé */}
            <div className="bg-[#e8f5e9] dark:bg-emerald-900/20 rounded-2xl p-6 flex flex-col min-h-[420px]">
              {/* Visual Mockup */}
              <div className="flex-1 relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-40 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 shadow-lg text-white">
                      <div className="flex items-center justify-between mb-4">
                        <CreditCard className="w-6 h-6" />
                        <div className="text-[10px] font-medium opacity-80">ixmoove</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-0.5">
                              {[1, 2, 3, 4].map((j) => (
                                <div key={j} className="w-1 h-1 bg-white/60 rounded-full"></div>
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="text-sm font-medium">•••• 4242</div>
                      </div>
                    </div>
                    <div className="absolute -bottom-3 -right-4 bg-white rounded-lg shadow-md px-3 py-2">
                      <div className="text-[10px] text-slate-500">Collecté</div>
                      <div className="text-base font-bold text-emerald-600">+25 TND</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Encaissement sécurisé</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                  Collecte des différences de prix lors des échanges avec traçabilité complète.
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className="inline-flex items-center px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  Commencer
                </button>
              </div>
            </div>

            {/* Card 5 - Tableau de bord */}
            <div className="bg-[#eef0f8] dark:bg-indigo-900/20 rounded-2xl p-6 flex flex-col min-h-[420px]">
              {/* Visual Mockup */}
              <div className="flex-1 relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-3">
                          <BarChart3 className="w-5 h-5 text-indigo-600" />
                          <div className="text-[10px] font-medium text-slate-500">Live</div>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 mb-3">
                          <div className="bg-indigo-50 rounded p-1.5 text-center">
                            <div className="text-sm font-bold text-indigo-600">127</div>
                            <div className="text-[9px] text-slate-500">Mois</div>
                          </div>
                          <div className="bg-green-50 rounded p-1.5 text-center">
                            <div className="text-sm font-bold text-green-600">98%</div>
                            <div className="text-[9px] text-slate-500">Succès</div>
                          </div>
                          <div className="bg-amber-50 rounded p-1.5 text-center">
                            <div className="text-sm font-bold text-amber-600">24h</div>
                            <div className="text-[9px] text-slate-500">Délai</div>
                          </div>
                        </div>
                        <div className="flex items-end gap-0.5 h-10">
                          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="flex-1 bg-indigo-200 rounded-t" style={{ height: `${h}%` }}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white rounded-full shadow-md px-2 py-1 flex items-center gap-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                      </span>
                      <span className="text-[10px] font-medium text-slate-700">Live</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Tableau de bord</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                  Suivi en temps réel de toutes vos livraisons avec historique et statistiques.
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className="inline-flex items-center px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  Voir la démo
                </button>
              </div>
            </div>

            {/* Card 6 - Support dédié */}
            <div className="bg-[#f3e8f5] dark:bg-purple-900/20 rounded-2xl p-6 flex flex-col min-h-[420px]">
              {/* Visual Mockup */}
              <div className="flex-1 relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center">
                      <Headphones className="w-14 h-14 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-white dark:bg-slate-800 rounded-lg shadow-md px-3 py-1.5 flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">En ligne</span>
                    </div>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-100 dark:bg-purple-900/50 rounded-full px-3 py-1">
                      <span className="text-xs font-medium text-purple-700 dark:text-purple-300">24/7</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Support dédié</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                  Équipe support disponible pour vous accompagner et résoudre vos problématiques.
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className="inline-flex items-center px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  Nous contacter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section - Clean Cards */}
      <section id="processus" className="py-20 px-6 bg-slate-50 dark:bg-slate-800 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">Processus</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mb-4">
              Comment fonctionne ixmoove
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Un processus simple et transparent en 4 étapes pour gérer vos échanges efficacement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Étape 01</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Demande client</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Votre client scanne le QR code et remplit le formulaire d'échange en 2 minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </div>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Étape 02</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Validation</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Vous recevez une notification et validez la demande depuis votre tableau de bord.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Étape 03</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Vérification</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Notre livreur vérifie l'état du produit sur place avec preuves photo/vidéo.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Étape 04</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Échange effectué</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Si conforme, l'échange est réalisé. Sinon, le livreur repart avec les deux articles.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 bg-slate-900 dark:bg-slate-950 rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xl font-semibold text-white">Délai moyen : 24-48h</p>
                <p className="text-slate-400">De la demande jusqu'à l'échange effectué</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/signup")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-md hover:bg-slate-100 transition-colors font-semibold whitespace-nowrap"
            >
              Commencer maintenant
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Professional */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">Pourquoi ixmoove</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mb-6">
                La solution de confiance pour vos échanges e-commerce
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                ixmoove est la seule société de livraison en Tunisie qui vérifie systématiquement chaque retour.
                Protégez votre activité contre la fraude.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Protection contre la fraude",
                    desc: "Chaque retour est vérifié sur place avec documentation obligatoire."
                  },
                  {
                    title: "Expérience client optimisée",
                    desc: "Processus d'échange simple et rapide pour vos clients."
                  },
                  {
                    title: "Gain de temps opérationnel",
                    desc: "Plus besoin de gérer les litiges, nous nous occupons de tout."
                  },
                  {
                    title: "Couverture nationale",
                    desc: "Notre réseau de livreurs couvre l'ensemble du territoire tunisien."
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial card */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8">
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                  "Depuis que nous utilisons ixmoove, nos pertes liées aux fraudes ont diminué de 95%.
                  Le processus est transparent et nos clients apprécient la simplicité."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Sami M.</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Fashion Store, Sfax</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 text-center border border-slate-100 dark:border-slate-700">
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">95%</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Réduction des fraudes</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 text-center border border-slate-100 dark:border-slate-700">
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">2x</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Plus d'échanges gérés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Comprehensive */}
      <section id="tarifs" className="py-20 px-6 bg-slate-50 dark:bg-slate-800 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">Tarification</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mb-4">
              Des formules adaptées à votre activité
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Choisissez la formule qui correspond le mieux à vos besoins. Plus vous échangez, plus vous économisez.
            </p>
          </div>

          {/* Subscription Plans */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Starter Plan */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 relative">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Starter</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pour démarrer sans engagement</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">0</span>
                  <span className="text-slate-500 dark:text-slate-400">TND/mois</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  <span className="font-semibold text-slate-900 dark:text-white">9 TND</span> par échange
                </p>
              </div>
              <ul className="space-y-3 mb-6">
                {["Livraison + récupération", "Vérification photo", "Tableau de bord", "Support email"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/signup")}
                className="w-full py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
              >
                Commencer gratuitement
              </button>
            </div>

            {/* Pro Plan - Featured */}
            <div className="bg-blue-600 rounded-2xl p-6 relative shadow-xl shadow-blue-600/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">POPULAIRE</span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">Pro</h3>
                <p className="text-sm text-blue-100">Pour les e-commerces en croissance</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">99</span>
                  <span className="text-blue-200">TND/mois</span>
                </div>
                <p className="text-sm text-blue-100 mt-2">
                  <span className="font-semibold text-white">6 TND</span> par échange
                </p>
              </div>
              <ul className="space-y-3 mb-6">
                {["Tout de Starter", "Vérification vidéo", "Support prioritaire", "Statistiques avancées", "API access"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-blue-50">
                    <Check className="w-4 h-4 text-blue-200" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/signup")}
                className="w-full py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition-colors"
              >
                Essai gratuit 14 jours
              </button>
            </div>

            {/* Business Plan */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 relative">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Business</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pour les grandes enseignes</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">249</span>
                  <span className="text-slate-500 dark:text-slate-400">TND/mois</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  <span className="font-semibold text-slate-900 dark:text-white">4 TND</span> par échange
                </p>
              </div>
              <ul className="space-y-3 mb-6">
                {["Tout de Pro", "Account manager dédié", "SLA garanti", "Intégrations custom", "Formation équipe"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => scrollToSection("contact")}
                className="w-full py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
              >
                Nous contacter
              </button>
            </div>
          </div>

          {/* Volume Pricing Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Tarifs dégressifs par volume</h3>
                <p className="text-slate-500 dark:text-slate-400">Plus vous échangez, moins ça coûte</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                <TrendingUp className="w-4 h-4" />
                Économisez jusqu'à 55%
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">Volume mensuel</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">Prix / échange</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">Économie</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { range: "1 - 50 échanges", price: "9 TND", savings: "-", highlight: false },
                    { range: "51 - 150 échanges", price: "7 TND", savings: "22%", highlight: false },
                    { range: "151 - 300 échanges", price: "5.5 TND", savings: "39%", highlight: true },
                    { range: "300+ échanges", price: "4 TND", savings: "55%", highlight: false },
                  ].map((row) => (
                    <tr key={row.range} className={`border-b border-slate-100 dark:border-slate-800 ${row.highlight ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}>
                      <td className="py-4 px-4 text-sm text-slate-700 dark:text-slate-300">{row.range}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-semibold ${row.highlight ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"}`}>{row.price}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.savings !== "-" ? (
                          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full">
                            -{row.savings}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Zone-Based Pricing */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Tarification par zone</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Basée sur la distance de livraison</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { zone: "Zone 1", desc: "Même ville", price: "7 TND", color: "emerald" },
                  { zone: "Zone 2", desc: "Même gouvernorat", price: "9 TND", color: "blue" },
                  { zone: "Zone 3", desc: "Inter-gouvernorat", price: "12 TND", color: "purple" },
                ].map((z) => (
                  <div key={z.zone} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-${z.color}-500`}></div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{z.zone}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{z.desc}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{z.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Comparison */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Options Premium</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Services additionnels à la carte</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { feature: "Livraison prioritaire (24h)", price: "+3 TND" },
                  { feature: "Vérification vidéo HD", price: "+2 TND" },
                  { feature: "Assurance produit", price: "+4 TND" },
                  { feature: "Rapport détaillé", price: "+1 TND" },
                ].map((opt) => (
                  <div key={opt.feature} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{opt.feature}</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400 text-sm">{opt.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features included in all plans */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-semibold mb-6 text-center">Inclus dans toutes les formules</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Livraison du nouveau produit",
                "Récupération de l'ancien",
                "Vérification sur place",
                "Documentation photo",
                "Encaissement si différence",
                "Suivi en temps réel",
                "Tableau de bord",
                "Support client",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-blue-50">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition-colors"
              >
                Démarrer maintenant
              </button>
              <p className="text-sm text-blue-100 mt-3">14 jours d'essai gratuit • Sans engagement</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Professional */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Prêt à optimiser vos échanges ?
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Rejoignez les e-commerçants tunisiens qui font confiance à ixmoove pour leurs livraisons d'échanges.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Démarrer gratuitement
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-slate-600 text-slate-300 rounded-md hover:bg-slate-800 transition-colors font-medium"
            >
              Contacter l'équipe commerciale
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section - Professional */}
      <section id="contact" className="py-20 px-6 scroll-mt-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">Contact</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mb-4">
                Parlons de votre projet
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Notre équipe est disponible pour répondre à vos questions et vous accompagner.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Email</h3>
                    <p className="text-slate-600 dark:text-slate-300">contact@swapp.tn</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Réponse sous 2h en jours ouvrés</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Téléphone</h3>
                    <p className="text-slate-600 dark:text-slate-300">+216 XX XXX XXX</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Lun-Ven, 9h-18h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Adresse</h3>
                    <p className="text-slate-600 dark:text-slate-300">Tunis, Tunisie</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Couverture nationale</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Envoyez-nous un message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nom</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Téléphone</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Boutique</label>
                    <input
                      type="text"
                      value={contactForm.store}
                      onChange={(e) => setContactForm({...contactForm, store: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom de votre boutique"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Comment pouvons-nous vous aider ?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Clean */}
      <footer className="py-12 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <span className="text-2xl font-bold text-white mb-4 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>ixmoove</span>
              <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                Société de livraison spécialisée dans les échanges et retours en Tunisie.
                Vérification terrain systématique de chaque produit retourné.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">Navigation</h4>
              <ul className="space-y-2">
                {[
                  { label: "Services", id: "services" },
                  { label: "Processus", id: "processus" },
                  { label: "Tarification", id: "tarifs" },
                  { label: "Contact", id: "contact" },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">Accès</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Espace Commerçant
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/delivery/login")}
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Truck className="w-3 h-3" />
                    Espace Livreur
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/signup")}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Créer un compte
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 ixmoove. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                Conditions générales
              </a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
