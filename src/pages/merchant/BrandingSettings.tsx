import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Palette,
  Upload,
  Save,
  Building2,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Trash2,
  QrCode,
  Printer,
  FileText,
  Eye,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "../../lib/supabase";
import MerchantLayout from "../../components/MerchantLayout";

type TabType = "exchange-paper" | "branding";

export default function BrandingSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [merchantId, setMerchantId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("exchange-paper");
  const [showCustomization, setShowCustomization] = useState(false);

  const [formData, setFormData] = useState({
    logo_base64: "",
    business_name: "",
    phone: "",
    business_address: "",
    business_city: "",
    business_postal_code: "",
  });

  // Exchange paper customization
  const [exchangePaper, setExchangePaper] = useState({
    title: "Besoin d'echanger votre article ?",
    subtitle: "Scannez le QR code ci-dessous",
    instruction1: "1. Scannez le QR code avec votre telephone",
    instruction2: "2. Remplissez le formulaire d'echange",
    instruction3: "3. Nous vous contacterons sous 24h",
    footerText: "Service client disponible 7j/7",
    showLogo: true,
    showPhone: true,
  });

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/merchant/login");
        return;
      }

      const { data: merchant } = await supabase
        .from("merchants")
        .select("*")
        .eq("email", session.user.email)
        .maybeSingle();

      if (merchant) {
        setMerchantId(merchant.id);
        setFormData({
          logo_base64: merchant.logo_base64 || "",
          business_name: merchant.business_name || merchant.name || "",
          phone: merchant.phone || "",
          business_address: merchant.business_address || "",
          business_city: merchant.business_city || "",
          business_postal_code: merchant.business_postal_code || "",
        });
      }
    } catch (err) {
      console.error("Error fetching merchant data:", err);
      setError("Erreur lors du chargement des donnees");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500000) {
      setError("L'image ne doit pas depasser 500 Ko");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        logo_base64: reader.result as string,
      }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logo_base64: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Generate QR code URL for exchange form
  const getExchangeFormUrl = () => {
    const url = `https://fawzyoth.github.io/Swapp-app/#/client/exchange/new?merchant=${merchantId}`;
    console.log("QR Code URL:", url, "MerchantId:", merchantId);
    return url;
  };

  // Print exchange paper
  const printExchangePaper = () => {
    const printWindow = window.open("", "", "height=800,width=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Fiche d'echange - ${formData.business_name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { size: A5; margin: 10mm; }
            body {
              font-family: Arial, Helvetica, sans-serif;
              padding: 20px;
              max-width: 500px;
              margin: 0 auto;
              color: #1e293b;
            }
            .paper {
              border: 2px solid #0ea5e9;
              border-radius: 16px;
              padding: 24px;
              text-align: center;
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            }
            .header {
              margin-bottom: 20px;
            }
            .logo {
              max-width: 120px;
              max-height: 60px;
              margin-bottom: 12px;
            }
            .business-name {
              font-size: 18px;
              font-weight: bold;
              color: #0369a1;
              margin-bottom: 4px;
            }
            .phone {
              font-size: 14px;
              color: #64748b;
            }
            .title {
              font-size: 22px;
              font-weight: bold;
              color: #0c4a6e;
              margin-bottom: 8px;
            }
            .subtitle {
              font-size: 14px;
              color: #475569;
              margin-bottom: 20px;
            }
            .qr-container {
              background: white;
              padding: 16px;
              border-radius: 12px;
              display: inline-block;
              margin-bottom: 20px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .qr-container img {
              display: block;
            }
            .instructions {
              text-align: left;
              background: white;
              padding: 16px;
              border-radius: 12px;
              margin-bottom: 16px;
            }
            .instruction {
              font-size: 14px;
              color: #334155;
              padding: 8px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            .instruction:last-child {
              border-bottom: none;
            }
            .footer {
              font-size: 12px;
              color: #64748b;
              margin-top: 16px;
            }
            .swapp-branding {
              margin-top: 20px;
              padding-top: 12px;
              border-top: 1px dashed #cbd5e1;
              font-size: 11px;
              color: #94a3b8;
            }
          </style>
        </head>
        <body>
          <div class="paper">
            <div class="header">
              ${exchangePaper.showLogo && formData.logo_base64 ? `<img src="${formData.logo_base64}" alt="Logo" class="logo" />` : ""}
              <div class="business-name">${formData.business_name || "Votre Boutique"}</div>
              ${exchangePaper.showPhone && formData.phone ? `<div class="phone">${formData.phone}</div>` : ""}
            </div>

            <div class="title">${exchangePaper.title}</div>
            <div class="subtitle">${exchangePaper.subtitle}</div>

            <div class="qr-container">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(getExchangeFormUrl())}" alt="QR Code" width="180" height="180" />
            </div>

            <div class="instructions">
              <div class="instruction">${exchangePaper.instruction1}</div>
              <div class="instruction">${exchangePaper.instruction2}</div>
              <div class="instruction">${exchangePaper.instruction3}</div>
            </div>

            <div class="footer">${exchangePaper.footerText}</div>

            <div class="swapp-branding">
              Powered by SWAPP - Plateforme d'echange
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const { error: updateError } = await supabase
        .from("merchants")
        .update({
          logo_base64: formData.logo_base64 || null,
          business_name: formData.business_name || null,
          phone: formData.phone,
          business_address: formData.business_address || null,
          business_city: formData.business_city || null,
          business_postal_code: formData.business_postal_code || null,
        })
        .eq("id", merchantId);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving branding:", err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MerchantLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Parametres</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("exchange-paper")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === "exchange-paper"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <QrCode className="w-5 h-5" />
            Fiche QR Code
          </button>
          <button
            onClick={() => setActiveTab("branding")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === "branding"
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Palette className="w-5 h-5" />
            Marque & Logo
          </button>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-800">
              Modifications enregistrees avec succes
            </span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Exchange Paper Tab */}
        {activeTab === "exchange-paper" && (
          <div className="space-y-6">
            {/* Main Preview Card with Print Button */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Top Action Bar */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-lg font-bold">Fiche d'Echange</h2>
                  <p className="text-emerald-100 text-sm">
                    Imprimez cette fiche et glissez-la dans vos colis
                  </p>
                </div>
                <button
                  onClick={printExchangePaper}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors font-semibold shadow-lg"
                >
                  <Printer className="w-5 h-5" />
                  Imprimer
                </button>
              </div>

              {/* Preview */}
              <div className="p-6 bg-slate-50">
                <div className="max-w-sm mx-auto">
                  <div
                    className="border-2 border-sky-400 rounded-2xl p-6 text-center shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                    }}
                  >
                    {/* Header */}
                    <div className="mb-4">
                      {exchangePaper.showLogo && formData.logo_base64 && (
                        <img
                          src={formData.logo_base64}
                          alt="Logo"
                          className="max-w-[80px] max-h-[40px] mx-auto mb-2 object-contain"
                        />
                      )}
                      <div className="text-base font-bold text-sky-700">
                        {formData.business_name || "Votre Boutique"}
                      </div>
                      {exchangePaper.showPhone && formData.phone && (
                        <div className="text-xs text-slate-500">
                          {formData.phone}
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div className="text-lg font-bold text-sky-900 mb-1">
                      {exchangePaper.title}
                    </div>
                    <div className="text-xs text-slate-600 mb-4">
                      {exchangePaper.subtitle}
                    </div>

                    {/* QR Code */}
                    <div className="bg-white p-3 rounded-xl inline-block mb-4 shadow-md">
                      <QRCodeSVG
                        value={getExchangeFormUrl()}
                        size={120}
                        level="M"
                      />
                    </div>

                    {/* Instructions */}
                    <div className="bg-white rounded-xl p-3 text-left mb-3">
                      <div className="text-xs text-slate-700 py-1.5 border-b border-slate-100">
                        {exchangePaper.instruction1}
                      </div>
                      <div className="text-xs text-slate-700 py-1.5 border-b border-slate-100">
                        {exchangePaper.instruction2}
                      </div>
                      <div className="text-xs text-slate-700 py-1.5">
                        {exchangePaper.instruction3}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="text-[10px] text-slate-500">
                      {exchangePaper.footerText}
                    </div>

                    {/* Swapp Branding */}
                    <div className="mt-3 pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-400">
                      Powered by SWAPP
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Customization */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowCustomization(!showCustomization)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-slate-500" />
                  <span className="font-medium text-slate-700">
                    Personnaliser le contenu
                  </span>
                </div>
                {showCustomization ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {showCustomization && (
                <div className="px-6 pb-6 border-t border-slate-100">
                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Titre principal
                      </label>
                      <input
                        type="text"
                        value={exchangePaper.title}
                        onChange={(e) =>
                          setExchangePaper((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Sous-titre
                      </label>
                      <input
                        type="text"
                        value={exchangePaper.subtitle}
                        onChange={(e) =>
                          setExchangePaper((prev) => ({
                            ...prev,
                            subtitle: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Instruction 1
                      </label>
                      <input
                        type="text"
                        value={exchangePaper.instruction1}
                        onChange={(e) =>
                          setExchangePaper((prev) => ({
                            ...prev,
                            instruction1: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Instruction 2
                      </label>
                      <input
                        type="text"
                        value={exchangePaper.instruction2}
                        onChange={(e) =>
                          setExchangePaper((prev) => ({
                            ...prev,
                            instruction2: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Instruction 3
                      </label>
                      <input
                        type="text"
                        value={exchangePaper.instruction3}
                        onChange={(e) =>
                          setExchangePaper((prev) => ({
                            ...prev,
                            instruction3: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Pied de page
                      </label>
                      <input
                        type="text"
                        value={exchangePaper.footerText}
                        onChange={(e) =>
                          setExchangePaper((prev) => ({
                            ...prev,
                            footerText: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-6 mt-4 pt-4 border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exchangePaper.showLogo}
                        onChange={(e) =>
                          setExchangePaper((prev) => ({
                            ...prev,
                            showLogo: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-700">
                        Afficher le logo
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exchangePaper.showPhone}
                        onChange={(e) =>
                          setExchangePaper((prev) => ({
                            ...prev,
                            showPhone: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-700">
                        Afficher le telephone
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">
                    Comment ca marche ?
                  </h4>
                  <p className="text-sm text-blue-700">
                    Imprimez cette fiche et glissez-la dans chaque colis. Vos
                    clients scannent le QR code pour demander un echange
                    facilement. Plus besoin d'imprimer un bordereau pour chaque
                    echange !
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Branding Tab */}
        {activeTab === "branding" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-sky-600" />
                Logo de l'entreprise
              </h2>

              <div className="flex items-start gap-6">
                <div className="w-32 h-32 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                  {formData.logo_base64 ? (
                    <img
                      src={formData.logo_base64}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-slate-400" />
                  )}
                </div>

                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Telecharger une image
                  </label>

                  {formData.logo_base64 && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="ml-3 inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  )}

                  <p className="text-sm text-slate-500 mt-3">
                    Format recommande: PNG ou JPG, max 500 Ko
                  </p>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-600" />
                Informations de l'entreprise
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nom commercial
                  </label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        business_name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Nom de votre entreprise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Telephone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600" />
                Adresse
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={formData.business_address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        business_address: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Rue, numero, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={formData.business_city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          business_city: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Tunis"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Code postal
                    </label>
                    <input
                      type="text"
                      value={formData.business_postal_code}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          business_postal_code: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </MerchantLayout>
  );
}
