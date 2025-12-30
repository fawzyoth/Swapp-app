import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ScanLine, KeyRound, Package, Star, X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function ClientScanner() {
  const [error, setError] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [scannedMerchantId, setScannedMerchantId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t, dir, lang } = useLanguage();

  useEffect(() => {
    if (!useManualEntry) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false,
      );

      scanner.render(onScanSuccess, onScanError);

    
  const handleChoiceExchange = () => {
    setShowChoiceModal(false);
    if (scannedMerchantId) {
      navigate(`/client/exchange/new?merchant=${scannedMerchantId}`);
    } else if (scannedCode) {
      navigate(`/client/exchange/new?code=${scannedCode}`);
    }
  };

  const handleChoiceReview = () => {
    setShowChoiceModal(false);
    const params = new URLSearchParams();
    if (scannedCode) params.set('code', scannedCode);
    if (scannedMerchantId) params.set('merchant', scannedMerchantId);
    navigate(`/client/review/new?${params.toString()}`);
  };

  return () => {
        scanner.clear();
      };
    }
  }, [useManualEntry]);

  const onScanSuccess = (decodedText: string) => {
    validateAndNavigate(decodedText);
  };

  const onScanError = () => {};

  const validateAndNavigate = async (scannedData: string) => {
    setLoading(true);
    setError("");

    try {
      // Check if it's a bordereau URL (most common case for re-scanning)
      if (scannedData.includes("/client/exchange/new?bordereau=")) {
        // Extract bordereau code from URL
        let bordereauCode: string | null = null;
        try {
          const url = new URL(scannedData);
          bordereauCode = url.searchParams.get("bordereau");
        } catch {
          // If URL parsing fails, try to extract from hash
          const match = scannedData.match(/bordereau=([^&]+)/);
          if (match) {
            bordereauCode = match[1];
          }
        }

        if (bordereauCode) {
          // Check if this bordereau has an associated exchange
          const { data: bordereau } = await supabase
            .from("merchant_bordereaux")
            .select("status, exchange_id")
            .eq("bordereau_code", bordereauCode)
            .maybeSingle();

          if (
            bordereau &&
            bordereau.status !== "available" &&
            bordereau.exchange_id
          ) {
            // Bordereau is used - get the exchange and redirect to tracking
            const { data: exchange } = await supabase
              .from("exchanges")
              .select("exchange_code")
              .eq("id", bordereau.exchange_id)
              .single();

            if (exchange) {
              navigate(`/client/tracking/${exchange.exchange_code}`);
              return;
            }
          }

          // Also check exchanges table directly by bordereau_code
          const { data: exchangeByBordereau } = await supabase
            .from("exchanges")
            .select("exchange_code")
            .eq("bordereau_code", bordereauCode)
            .maybeSingle();

          if (exchangeByBordereau) {
            navigate(`/client/tracking/${exchangeByBordereau.exchange_code}`);
            return;
          }

          // Bordereau available - redirect to exchange form
          navigate(`/client/exchange/new?bordereau=${bordereauCode}`);
          return;
        }
      }

      // Check if it's a direct URL with merchant
      if (scannedData.includes("/client/exchange/new?merchant=")) {
        const url = new URL(scannedData);
        const merchantId = url.searchParams.get("merchant");
        if (merchantId) {
          navigate(`/client/exchange/new?merchant=${merchantId}`);
          return;
        }
      }

      // Check if it's a tracking URL
      if (scannedData.includes("/client/tracking/")) {
        const url = new URL(scannedData);
        const pathParts = url.pathname.split("/");
        const exchangeCode = pathParts[pathParts.length - 1];
        if (exchangeCode) {
          navigate(`/client/tracking/${exchangeCode}`);
          return;
        }
      }

      // Try to parse as JSON (new format with merchant info)
      let merchantId: string | null = null;
      let qrCode: string | null = null;

      try {
        const parsed = JSON.parse(scannedData);
        merchantId = parsed.merchant_id;
        qrCode = parsed.code;
      } catch {
        // If not JSON, treat as QR code string
        qrCode = scannedData;
      }

      // Check if this is an exchange code (starts with EXC-)
      if (qrCode && qrCode.startsWith("EXC-")) {
        // This is an exchange code - redirect to tracking
        const { data: exchange } = await supabase
          .from("exchanges")
          .select("exchange_code")
          .eq("exchange_code", qrCode)
          .maybeSingle();

        if (exchange) {
          navigate(`/client/tracking/${exchange.exchange_code}`);
          return;
        }
      }

      // Check if this is a bordereau code (starts with BDX-)
      if (qrCode && qrCode.startsWith("BDX-")) {
        // Check if this bordereau has an associated exchange
        const { data: bordereau } = await supabase
          .from("merchant_bordereaux")
          .select("status, exchange_id")
          .eq("bordereau_code", qrCode)
          .maybeSingle();

        if (
          bordereau &&
          bordereau.status !== "available" &&
          bordereau.exchange_id
        ) {
          // Bordereau is used - get the exchange and redirect to tracking
          const { data: exchange } = await supabase
            .from("exchanges")
            .select("exchange_code")
            .eq("id", bordereau.exchange_id)
            .single();

          if (exchange) {
            navigate(`/client/tracking/${exchange.exchange_code}`);
            return;
          }
        }

        // Bordereau available or not found - redirect to exchange form (it handles the logic)
        navigate(`/client/exchange/new?bordereau=${qrCode}`);
        return;
      }

      // Look up merchant by QR code or ID
      let query = supabase.from("merchants").select("*");

      if (merchantId) {
        query = query.eq("id", merchantId);
      } else if (qrCode) {
        query = query.eq("qr_code_data", qrCode);
      }

      const { data: merchant, error: fetchError } = await query.maybeSingle();

      if (fetchError) throw fetchError;

      if (merchant) {
        // Navigate to exchange form with merchant ID
        navigate(`/client/exchange/new?merchant=${merchant.id}`);
      } else {
        setError(t("invalidQRCode"));
      }
    } catch (err) {
      console.error("Error validating QR code:", err);
      setError(t("invalidQRCode"));
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      validateAndNavigate(manualCode.trim());
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50"
      dir={dir}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Language Switcher */}
        <div className="flex justify-end mb-6">
          <LanguageSwitcher />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <ScanLine className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {t("scanQRCode")}
            </h1>
            <p className="text-slate-600">{t("scanDescription")}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {loading && (
              <div className="mb-4 p-4 bg-sky-50 border border-sky-200 rounded-lg text-sky-700 flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-600"></div>
                {t("loading")}
              </div>
            )}

            {!useManualEntry ? (
              <div>
                <div id="qr-reader" className="mb-4"></div>
                <button
                  onClick={() => setUseManualEntry(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  <KeyRound className="w-5 h-5" />
                  {lang === "ar"
                    ? "إدخال الرمز يدوياً"
                    : "Entrer le code manuellement"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleManualSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {lang === "ar" ? "رمز التاجر" : "Code du commerçant"}
                  </label>
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="SWAPP-XXXXXXXX"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-lg font-medium transition-colors"
                  >
                    {loading
                      ? t("loading")
                      : lang === "ar"
                        ? "التحقق من الرمز"
                        : "Valider le code"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseManualEntry(false)}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    {lang === "ar" ? "العودة للماسح" : "Retour au scanner"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-800">
                {lang === "ar"
                  ? "امسح رمز QR المقدم من التاجر لتقديم طلب تبديل المنتج."
                  : "Scannez le QR code fourni par votre commerçant pour soumettre une demande d'échange de produit."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Choice Modal */}
      {showChoiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {lang === "ar" ? "ماذا تريد أن تفعل؟" : "Que souhaitez-vous faire ?"}
                </h2>
                <button
                  onClick={() => setShowChoiceModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={handleChoiceExchange}
                  className="flex items-center gap-4 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-100 transition-all text-left"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {lang === "ar" ? "طلب استبدال" : "Demander un échange"}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {lang === "ar" ? "استبدال منتجك بآخر" : "Échanger votre produit contre un autre"}
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleChoiceReview}
                  className="flex items-center gap-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl hover:border-amber-500 hover:bg-amber-100 transition-all text-left"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {lang === "ar" ? "ترك تقييم" : "Laisser un avis"}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {lang === "ar" ? "شارك تجربتك مع التاجر" : "Partagez votre expérience avec le marchand"}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
