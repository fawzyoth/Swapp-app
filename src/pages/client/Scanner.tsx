import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ScanLine, KeyRound, Package, Star, X } from "lucide-react";
import ClientLayout from "../../components/ClientLayout";

const VALID_CODES = [
  "EXC-2025-001",
  "EXC-2025-002",
  "EXC-2025-003",
  "EXC-2025-004",
  "EXC-2025-005",
];

export default function ClientScanner() {
  const [error, setError] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!useManualEntry) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false,
      );

      scanner.render(onScanSuccess, onScanError);

      return () => {
        scanner.clear();
      };
    }
  }, [useManualEntry]);

  const onScanSuccess = (decodedText: string) => {
    validateAndNavigate(decodedText);
  };

  const onScanError = () => {};

  const validateAndNavigate = (code: string) => {
    if (VALID_CODES.includes(code)) {
      setScannedCode(code);
      setShowChoiceModal(true);
      setError("");
    } else {
      setError("Code d'échange invalide. Veuillez réessayer.");
    }
  };

  const handleChoiceExchange = () => {
    setShowChoiceModal(false);
    navigate(`/client/exchange/new?code=${scannedCode}`);
  };

  const handleChoiceReview = () => {
    setShowChoiceModal(false);
    navigate(`/client/review/new?code=${scannedCode}`);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      validateAndNavigate(manualCode.trim());
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <ScanLine className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Scanner le QR Code
          </h1>
          <p className="text-slate-600">
            Scannez le code sur votre colis pour démarrer l'échange
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
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
                Entrer le code manuellement
              </button>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Code d'échange
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="EXC-2025-XXX"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                >
                  Valider le code
                </button>
                <button
                  type="button"
                  onClick={() => setUseManualEntry(false)}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  Retour au scanner
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 p-4 bg-sky-50 rounded-lg">
            <p className="text-sm text-sky-800 font-medium mb-2">
              Codes de test disponibles:
            </p>
            <ul className="text-sm text-sky-700 space-y-1">
              {VALID_CODES.map((code) => (
                <li key={code} className="font-mono">
                  • {code}
                </li>
              ))}
            </ul>
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
                  Que souhaitez-vous faire ?
                </h2>
                <button
                  onClick={() => setShowChoiceModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <p className="text-slate-600 mb-6">
                Code scanné :{" "}
                <span className="font-mono font-medium text-emerald-600">
                  {scannedCode}
                </span>
              </p>

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
                      Demander un échange
                    </h3>
                    <p className="text-sm text-slate-600">
                      Échanger votre produit contre un autre
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
                      Laisser un avis
                    </h3>
                    <p className="text-sm text-slate-600">
                      Partagez votre expérience avec le marchand
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
