import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Package,
  Video,
  Handshake,
  ShoppingBag,
  Truck,
  CheckCircle,
  Lock,
  Star,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/Logo.png"
              alt="Revixio"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center max-w-4xl mx-auto px-6">
          {/* Hero Text */}
          <h1 className="text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Every exchange,
            <br />
            verified.
          </h1>
          <p className="text-xl text-slate-600 mb-16 max-w-2xl mx-auto">
            The trusted platform for e-commerce returns and exchanges
          </p>

          {/* Floating Card */}
          <div
            className="relative mx-auto mb-8"
            style={{
              transform: `translateY(${Math.sin(scrollY * 0.002) * 8}px)`,
            }}
          >
            <div
              className="w-[640px] bg-white rounded-3xl shadow-2xl p-8 mx-auto"
              style={{
                transform: "rotate(-2deg)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              }}
            >
              <div className="grid grid-cols-2 gap-6">
                {/* Left: Product */}
                <div className="bg-slate-100 rounded-2xl h-64 flex items-center justify-center">
                  <Package className="w-16 h-16 text-slate-400" />
                </div>
                {/* Right: Verification */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    14:32:18 UTC
                  </div>
                  <div className="mt-2 px-3 py-1 bg-emerald-50 rounded-full text-xs font-medium text-emerald-700">
                    Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Transition */}
      <section className="h-48 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center gap-8">
          <div
            className="w-32 h-48 bg-emerald-50 rounded-2xl transition-all duration-700"
            style={{
              transform: `translateX(${Math.max(0, 200 - scrollY * 0.5)}px)`,
              opacity: Math.min(1, scrollY * 0.002),
            }}
          />
          <div
            className="w-40 h-52 bg-blue-50 rounded-2xl transition-all duration-700"
            style={{
              transform: `translateY(${Math.max(0, 100 - scrollY * 0.3)}px)`,
              opacity: Math.min(1, scrollY * 0.002),
            }}
          />
          <div
            className="w-36 h-44 bg-slate-100 rounded-2xl transition-all duration-700"
            style={{
              transform: `translateX(${Math.max(0, -200 + scrollY * 0.5)}px)`,
              opacity: Math.min(1, scrollY * 0.002),
            }}
          />
        </div>
      </section>

      {/* Problem Section */}
      <section className="min-h-screen bg-slate-50 flex items-center justify-center py-24 relative overflow-hidden">
        <div className="relative w-full max-w-4xl px-6">
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Without verification
            </h2>
            <p className="text-lg text-slate-600">
              Disputes, fraud, and broken trust
            </p>
          </div>
          {/* Chaotic Cards */}
          <div
            className="absolute top-20 left-10 w-80 h-48 bg-white rounded-xl border border-slate-200 shadow-lg p-6"
            style={{ transform: "rotate(-8deg)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <div className="text-sm text-slate-600">Unverified Exchange</div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          </div>

          <div
            className="absolute top-40 right-20 w-72 h-56 bg-white rounded-xl border border-red-200 shadow-lg p-6"
            style={{ transform: "rotate(12deg)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <div className="text-sm text-slate-600">Disputed Return</div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-200 rounded w-full" />
            </div>
          </div>

          <div
            className="absolute bottom-32 left-1/3 w-64 h-52 bg-white rounded-xl border border-slate-200 shadow-lg p-6"
            style={{ transform: "rotate(-5deg)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <div className="text-sm text-slate-600">No Proof</div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          </div>

          {/* Broken connections */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <line
              x1="25%"
              y1="30%"
              x2="65%"
              y2="50%"
              stroke="#EF4444"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1="60%"
              y1="35%"
              x2="45%"
              y2="70%"
              stroke="#EF4444"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        </div>
      </section>

      {/* Solution Section */}
      <section className="min-h-screen bg-white flex items-center justify-center py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              With SWAPP
            </h2>
            <p className="text-lg text-slate-600">
              Every step verified, every party protected
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center justify-center h-32 bg-slate-50 rounded-xl mb-4">
                <Package className="w-12 h-12 text-slate-400" />
              </div>
              <div className="h-2 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-2 bg-slate-200 rounded w-1/2" />
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center justify-center h-32 bg-slate-50 rounded-xl mb-4">
                <Video className="w-12 h-12 text-slate-400" />
              </div>
              <div className="h-2 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-2 bg-slate-200 rounded w-1/2" />
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center justify-center h-32 bg-slate-50 rounded-xl mb-4">
                <Shield className="w-12 h-12 text-slate-400" />
              </div>
              <div className="h-2 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-2 bg-slate-200 rounded w-1/2" />
            </div>
          </div>

          {/* Connecting lines */}
          <svg
            className="w-full h-24 mt-8"
            viewBox="0 0 800 100"
            fill="none"
          >
            <line
              x1="133"
              y1="0"
              x2="266"
              y2="0"
              stroke="#10B981"
              strokeWidth="2"
            />
            <line
              x1="534"
              y1="0"
              x2="667"
              y2="0"
              stroke="#10B981"
              strokeWidth="2"
            />
            <polygon points="270,0 260,-5 260,5" fill="#10B981" />
            <polygon points="671,0 661,-5 661,5" fill="#10B981" />
          </svg>
        </div>
      </section>

      {/* Process Section */}
      <section className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-600">
              Simple, fast, verified
            </p>
          </div>
          <div className="flex items-center gap-16 justify-center">
          {/* Node 1 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center shadow-lg">
              <Package className="w-10 h-10 text-emerald-600" />
            </div>
          </div>

          <div className="w-24 h-0.5 bg-slate-300" />

          {/* Node 2 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center">
              <Video className="w-10 h-10 text-slate-400" />
            </div>
          </div>

          <div className="w-24 h-0.5 bg-slate-300" />

          {/* Node 3 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center">
              <Shield className="w-10 h-10 text-slate-400" />
            </div>
          </div>

          <div className="w-24 h-0.5 bg-slate-300" />

          {/* Node 4 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center">
              <Handshake className="w-10 h-10 text-slate-400" />
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Proof Section */}
      <section className="min-h-screen flex items-center justify-center py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Video proof
            </h2>
            <p className="text-lg text-slate-600">
              Timestamped, encrypted, immutable
            </p>
          </div>
          <div className="relative">
          {/* Video Player Mockup */}
          <div
            className="w-[560px] bg-slate-900 rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
          >
            {/* Video Frame */}
            <div className="aspect-video bg-slate-800 relative flex items-center justify-center">
              <Package className="w-24 h-24 text-slate-600" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-8 border-l-slate-900 border-y-6 border-y-transparent ml-1" />
                </div>
              </div>

              {/* Timestamp */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 rounded text-xs font-mono text-white">
                14:32:18 UTC
              </div>

              {/* Lock Icon */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 bg-emerald-500/90 rounded">
                <Lock className="w-4 h-4 text-white" />
                <span className="text-xs font-medium text-white">Verified</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="min-h-screen bg-white flex items-center justify-center py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Neutral third party
            </h2>
            <p className="text-lg text-slate-600">
              Independent verification for everyone
            </p>
          </div>
          <div className="relative w-96 h-96 mx-auto">
          {/* Triangle connections */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
            <line
              x1="200"
              y1="80"
              x2="100"
              y2="280"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            <line
              x1="200"
              y1="80"
              x2="300"
              y2="280"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            <line
              x1="100"
              y1="280"
              x2="300"
              y2="280"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
          </svg>

          {/* Top: Merchant */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <div className="w-32 h-32 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-12 h-12 text-slate-600" />
            </div>
          </div>

          {/* Bottom Left: Platform */}
          <div className="absolute bottom-8 left-8">
            <div className="w-32 h-32 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center shadow-lg">
              <Shield className="w-12 h-12 text-emerald-600" />
            </div>
          </div>

          {/* Bottom Right: Delivery */}
          <div className="absolute bottom-8 right-8">
            <div className="w-32 h-32 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center shadow-lg">
              <Truck className="w-12 h-12 text-slate-600" />
            </div>
          </div>

          {/* Center Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Standard Section */}
      <section className="h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            The new standard
          </h2>
          <p className="text-lg text-slate-600 mb-16">
            Trusted by merchants and customers
          </p>
        </div>
        <div className="relative w-60 h-60">
          {/* Badge */}
          <div
            className="w-full h-full rounded-full flex items-center justify-center relative"
            style={{
              background:
                "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
              boxShadow: "0 10px 40px rgba(16,185,129,0.3)",
            }}
          >
            {/* Inner ring with dots */}
            <div className="absolute inset-4 rounded-full border-2 border-white/30" />

            {/* Center checkmark */}
            <CheckCircle className="w-24 h-24 text-white relative z-10" />
          </div>
        </div>

        <div className="mt-12 text-xs uppercase tracking-widest text-slate-500 font-medium">
          Standard
        </div>
      </section>

      {/* Scale Section */}
      <section className="min-h-screen bg-white flex items-center justify-center py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Built to scale
            </h2>
            <p className="text-lg text-slate-600">
              From startups to enterprise
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`w-40 h-40 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                i === 4
                  ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-200 scale-110"
                  : i % 2 === 0
                    ? "border-slate-200 bg-white"
                    : "border-slate-200 bg-white opacity-40"
              }`}
            >
              <CheckCircle
                className={`w-10 h-10 ${i === 4 ? "text-emerald-600" : "text-slate-300"}`}
              />
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center py-24">
        <div className="text-center max-w-2xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-slate-900 mb-4">
            Get started
          </h2>
          <p className="text-lg text-slate-600 mb-12">
            Join merchants protecting their exchanges
          </p>

          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-slate-600" />
            </div>
          </div>

          {/* Card */}
          <div
            className="w-[480px] bg-white rounded-3xl border border-slate-200 p-12 mx-auto"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.06)" }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent mb-4"
            />
            <button
              onClick={() => navigate("/signup")}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Start
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-48 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/Logo.png"
              alt="Revixio"
              className="h-6 w-auto opacity-60"
            />
          </div>
          <div className="flex gap-8 text-xs text-slate-600">
            <button onClick={() => navigate("/merchant/dashboard")}>
              Merchants
            </button>
            <button onClick={() => navigate("/delivery/dashboard")}>
              Delivery
            </button>
            <a href="#" className="hover:text-slate-900">
              Docs
            </a>
          </div>
          <div className="flex gap-8 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-900">
              Terms
            </a>
            <a href="#" className="hover:text-slate-900">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
