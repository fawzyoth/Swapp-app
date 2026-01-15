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
  Eye,
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
  BarChart3,
  ExternalLink,
  Copy,
  Download,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  supabase,
  SocialPlatform,
  SocialQRCode,
  SOCIAL_PLATFORM_LABELS,
  SOCIAL_PLATFORM_COLORS,
} from "../../lib/supabase";
import MerchantLayout from "../../components/MerchantLayout";

type TabType = "exchange-paper" | "social-qr" | "branding";

// Social Media Icons as SVG components
const FacebookIcon = ({
  size = 24,
  color = "#1877F2",
}: {
  size?: number;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({
  size = 24,
  color = "#E4405F",
}: {
  size?: number;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TikTokIcon = ({
  size = 24,
  color = "#000000",
}: {
  size?: number;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const getSocialIcon = (platform: SocialPlatform, size = 24) => {
  switch (platform) {
    case "facebook":
      return <FacebookIcon size={size} />;
    case "instagram":
      return <InstagramIcon size={size} />;
    case "tiktok":
      return <TikTokIcon size={size} />;
  }
};

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

  // Social QR states
  const [socialQRCodes, setSocialQRCodes] = useState<SocialQRCode[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>("facebook");
  const [savingSocial, setSavingSocial] = useState(false);
  const [selectedQR, setSelectedQR] = useState<SocialQRCode | null>(null);
  const [scanStats, setScanStats] = useState<{ date: string; count: number }[]>(
    [],
  );

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

  useEffect(() => {
    if (merchantId) {
      fetchSocialQRCodes();
    }
  }, [merchantId]);

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

  const fetchSocialQRCodes = async () => {
    try {
      const { data, error } = await supabase
        .from("social_qr_codes")
        .select("*")
        .eq("merchant_id", merchantId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setSocialQRCodes(data);
      }
    } catch (err) {
      console.error("Error fetching social QR codes:", err);
    }
  };

  const generateShortCode = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const detectPlatform = (url: string): SocialPlatform => {
    if (url.includes("facebook.com") || url.includes("fb.com"))
      return "facebook";
    if (url.includes("instagram.com")) return "instagram";
    if (url.includes("tiktok.com")) return "tiktok";
    return "facebook";
  };

  const handleAddSocialQR = async () => {
    if (!newSocialUrl.trim()) {
      setError("Veuillez entrer une URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(newSocialUrl);
    } catch {
      setError("URL invalide");
      return;
    }

    setSavingSocial(true);
    setError("");

    try {
      const platform = detectPlatform(newSocialUrl);
      const shortCode = generateShortCode();

      const { data, error: insertError } = await supabase
        .from("social_qr_codes")
        .insert({
          merchant_id: merchantId,
          platform,
          social_url: newSocialUrl.trim(),
          short_code: shortCode,
          scan_count: 0,
          is_active: true,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (data) {
        setSocialQRCodes([data, ...socialQRCodes]);
      }

      setNewSocialUrl("");
      setShowAddModal(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error adding social QR:", err);
      setError("Erreur lors de l'ajout du QR code");
    } finally {
      setSavingSocial(false);
    }
  };

  const handleDeleteSocialQR = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce QR code ?")) return;

    try {
      const { error } = await supabase
        .from("social_qr_codes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSocialQRCodes(socialQRCodes.filter((qr) => qr.id !== id));
      if (selectedQR?.id === id) setSelectedQR(null);
    } catch (err) {
      console.error("Error deleting social QR:", err);
      setError("Erreur lors de la suppression");
    }
  };

  const fetchScanStats = async (qrCodeId: string) => {
    try {
      const { data, error } = await supabase
        .from("social_qr_scans")
        .select("scanned_at")
        .eq("qr_code_id", qrCodeId)
        .order("scanned_at", { ascending: false });

      if (!error && data) {
        // Group by date
        const grouped: Record<string, number> = {};
        data.forEach((scan) => {
          const date = new Date(scan.scanned_at).toLocaleDateString("fr-FR");
          grouped[date] = (grouped[date] || 0) + 1;
        });

        const stats = Object.entries(grouped)
          .slice(0, 7)
          .map(([date, count]) => ({ date, count }))
          .reverse();

        setScanStats(stats);
      }
    } catch (err) {
      console.error("Error fetching scan stats:", err);
    }
  };

  const getQRCodeUrl = (shortCode: string) => {
    return `https://swapp-app.pages.dev/#/go/${shortCode}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const downloadQRCode = (platform: SocialPlatform, shortCode: string) => {
    const svg = document.getElementById(`qr-${shortCode}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 400, 400);
        ctx.drawImage(img, 50, 50, 300, 300);
      }

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-${platform}-${shortCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
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
    const url = `https://swapp-app.pages.dev/#/client/exchange/new?merchant=${merchantId}`;
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header with Description */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-100 rounded-xl">
                <Palette className="w-7 h-7 text-pink-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Ma Marque</h1>
                <p className="text-slate-600">Personnalisez vos QR codes et gérez votre identité de marque</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation - Improved Design */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          <button
            onClick={() => setActiveTab("exchange-paper")}
            className={`flex items-center justify-center sm:flex-1 gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
              activeTab === "exchange-paper"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md transform scale-[1.02]"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span>Fiche QR Code</span>
          </button>
          <button
            onClick={() => setActiveTab("social-qr")}
            className={`flex items-center justify-center sm:flex-1 gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
              activeTab === "social-qr"
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md transform scale-[1.02]"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Réseaux Sociaux</span>
            {socialQRCodes.length > 0 && (
              <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {socialQRCodes.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("branding")}
            className={`flex items-center justify-center sm:flex-1 gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
              activeTab === "branding"
                ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md transform scale-[1.02]"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Palette className="w-5 h-5" />
            <span>Marque & Logo</span>
          </button>
        </div>

        {/* Alerts - Fixed Position at Top */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-emerald-900 font-medium">
              Modifications enregistrées avec succès !
            </span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-red-900 font-medium">{error}</span>
          </div>
        )}

        {/* Exchange Paper Tab */}
        {activeTab === "exchange-paper" && (
          <div className="space-y-8">
            {/* Main Preview Card with Print Button */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              {/* Top Action Bar */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-white">
                  <h2 className="text-xl font-bold mb-1">Fiche d'Échange QR Code</h2>
                  <p className="text-emerald-50 text-sm sm:text-base">
                    Imprimez cette fiche et glissez-la dans vos colis pour faciliter les échanges
                  </p>
                </div>
                <button
                  onClick={printExchangePaper}
                  className="flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 hover:shadow-xl transition-all font-bold shadow-lg whitespace-nowrap transform hover:scale-105"
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
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowCustomization(!showCustomization)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${showCustomization ? 'bg-emerald-100' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                    <Settings className={`w-5 h-5 ${showCustomization ? 'text-emerald-600' : 'text-slate-600'}`} />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-slate-900 block">
                      Personnaliser le contenu
                    </span>
                    <span className="text-sm text-slate-500">
                      Modifiez le texte et les options d'affichage
                    </span>
                  </div>
                </div>
                {showCustomization ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
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
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2 text-lg">
                    💡 Comment ça marche ?
                  </h4>
                  <p className="text-blue-800 leading-relaxed">
                    Imprimez cette fiche et glissez-la dans chaque colis. Vos
                    clients scannent le QR code pour demander un échange
                    facilement. <span className="font-semibold">Plus besoin d'imprimer un bordereau pour chaque
                    échange !</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social QR Tab */}
        {activeTab === "social-qr" && (
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-white">
                  <h2 className="text-xl font-bold mb-1">
                    QR Codes Réseaux Sociaux
                  </h2>
                  <p className="text-pink-50 text-sm sm:text-base">
                    Créez des QR codes pour vos pages sociales et suivez les statistiques de scan
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-purple-50 hover:shadow-xl transition-all font-bold shadow-lg whitespace-nowrap transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter
                </button>
              </div>
            </div>

            {/* QR Codes Grid */}
            {socialQRCodes.length === 0 ? (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-lg border-2 border-purple-200 p-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md">
                  <QrCode className="w-12 h-12 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Créez votre premier QR code social
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto text-lg">
                  Ajoutez vos liens Facebook, Instagram ou TikTok pour créer des
                  QR codes trackables et mesurer votre impact
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-bold transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Créer mon premier QR code
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialQRCodes.map((qr) => (
                  <div
                    key={qr.id}
                    className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all cursor-pointer transform hover:scale-[1.02] ${
                      selectedQR?.id === qr.id
                        ? "border-purple-500 ring-4 ring-purple-200 scale-[1.02]"
                        : "border-slate-200 hover:border-purple-300 hover:shadow-xl"
                    }`}
                    onClick={() => {
                      setSelectedQR(qr);
                      fetchScanStats(qr.id);
                    }}
                  >
                    {/* Platform Header */}
                    <div
                      className={`px-4 py-3 ${SOCIAL_PLATFORM_COLORS[qr.platform].bg} text-white flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-2">
                        {getSocialIcon(qr.platform, 20)}
                        <span className="font-semibold">
                          {SOCIAL_PLATFORM_LABELS[qr.platform]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-sm font-medium">
                          {qr.scan_count} scans
                        </span>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="p-4 flex justify-center bg-slate-50">
                      <div className="bg-white p-3 rounded-xl shadow-md relative">
                        <QRCodeSVG
                          id={`qr-${qr.short_code}`}
                          value={getQRCodeUrl(qr.short_code)}
                          size={120}
                          level="M"
                          imageSettings={{
                            src:
                              qr.platform === "facebook"
                                ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzE4NzdGMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjQgMTIuMDczYzAtNi42MjctNS4zNzMtMTItMTItMTJzLTEyIDUuMzczLTEyIDEyYzAgNS45OSA0LjM4OCAxMC45NTQgMTAuMTI1IDExLjg1NHYtOC4zODVINy4wNzh2LTMuNDdoMy4wNDdWOS40M2MwLTMuMDA3IDEuNzkyLTQuNjY5IDQuNTMzLTQuNjY5IDEuMzEyIDAgMi42ODYuMjM1IDIuNjg2LjIzNXYyLjk1M0gxNS44M2MtMS40OTEgMC0xLjk1Ni45MjUtMS45NTYgMS44NzR2Mi4yNWgzLjMyOGwtLjUzMiAzLjQ3aC0yLjc5NnY4LjM4NUMxOS42MTIgMjMuMDI3IDI0IDE4LjA2MiAyNCAxMi4wNzN6Ii8+PC9zdmc+"
                                : qr.platform === "instagram"
                                  ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0U0NDA1RiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMi4xNjNjMy4yMDQgMCAzLjU4NC4wMTIgNC44NS4wNyAzLjI1Mi4xNDggNC43NzEgMS42OTEgNC45MTkgNC45MTkuMDU4IDEuMjY1LjA2OSAxLjY0NS4wNjkgNC44NDkgMCAzLjIwNS0uMDEyIDMuNTg0LS4wNjkgNC44NDktLjE0OSAzLjIyNS0xLjY2NCA0Ljc3MS00LjkxOSA0LjkxOS0xLjI2Ni4wNTgtMS42NDQuMDctNC44NS4wNy0zLjIwNCAwLTMuNTg0LS4wMTItNC44NDktLjA3LTMuMjYtLjE0OS00Ljc3MS0xLjY5OS00LjkxOS00LjkyLS4wNTgtMS4yNjUtLjA3LTEuNjQ0LS4wNy00Ljg0OSAwLTMuMjA0LjAxMy0zLjU4My4wNy00Ljg0OS4xNDktMy4yMjcgMS42NjQtNC43NzEgNC45MTktNC45MTkgMS4yNjYtLjA1NyAxLjY0NS0uMDY5IDQuODQ5LS4wNjl6bTAtMi4xNjNjLTMuMjU5IDAtMy42NjcuMDE0LTQuOTQ3LjA3Mi00LjM1OC4yLTYuNzggMi42MTgtNi45OCA2Ljk4LS4wNTkgMS4yODEtLjA3MyAxLjY4OS0uMDczIDQuOTQ4IDAgMy4yNTkuMDE0IDMuNjY4LjA3MiA0Ljk0OC4yIDQuMzU4IDIuNjE4IDYuNzggNi45OCA2Ljk4IDEuMjgxLjA1OCAxLjY4OS4wNzIgNC45NDguMDcyIDMuMjU5IDAgMy42NjgtLjAxNCA0Ljk0OC0uMDcyIDQuMzU0LS4yIDYuNzgyLTIuNjE4IDYuOTc5LTYuOTguMDU5LTEuMjguMDczLTEuNjg5LjA3My00Ljk0OCAwLTMuMjU5LS4wMTQtMy42NjctLjA3Mi00Ljk0Ny0uMTk2LTQuMzU0LTIuNjE3LTYuNzgtNi45NzktNi45OC0xLjI4MS0uMDU5LTEuNjktLjA3My00Ljk0OS0uMDczem0wIDUuODM4Yy0zLjQwMyAwLTYuMTYyIDIuNzU5LTYuMTYyIDYuMTYyczIuNzU5IDYuMTYzIDYuMTYyIDYuMTYzIDYuMTYyLTIuNzU5IDYuMTYyLTYuMTYzYzAtMy40MDMtMi43NTktNi4xNjItNi4xNjItNi4xNjJ6bTAgMTAuMTYyYy0yLjIwOSAwLTQtMS43OS00LTQgMC0yLjIwOSAxLjc5MS00IDQtNHM0IDEuNzkxIDQgNGMwIDIuMjEtMS43OTEgNC00IDR6bTYuNDA2LTExLjg0NWMtLjc5NiAwLTEuNDQxLjY0NS0xLjQ0MSAxLjQ0cy42NDUgMS40NCAxLjQ0MSAxLjQ0Yy43OTUgMCAxLjQzOS0uNjQ1IDEuNDM5LTEuNDRzLS42NDQtMS40NC0xLjQzOS0xLjQ0eiIvPjwvc3ZnPg=="
                                  : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwMDAwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkuNTkgNi42OWE0LjgzIDQuODMgMCAwIDEtMy43Ny00LjI1VjJoLTMuNDV2MTMuNjdhMi44OSAyLjg5IDAgMCAxLTUuMiAxLjc0IDIuODkgMi44OSAwIDAgMSAyLjMxLTQuNjQgMi45MyAyLjkzIDAgMCAxIC44OC4xM1Y5LjRhNi44NCA2Ljg0IDAgMCAwLTEtLjA1QTYuMzMgNi4zMyAwIDAgMCA1IDIwLjFhNi4zNCA2LjM0IDAgMCAwIDEwLjg2LTQuNDN2LTdhOC4xNiA4LjE2IDAgMCAwIDQuNzcgMS41MnYtMy40YTQuODUgNC44NSAwIDAgMS0xLS4xeiIvPjwvc3ZnPg==",
                            height: 24,
                            width: 24,
                            excavate: true,
                          }}
                        />
                      </div>
                    </div>

                    {/* URL Preview */}
                    <div className="px-4 py-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500 truncate">
                        {qr.social_url}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="px-4 py-3 bg-slate-50 flex items-center justify-between gap-2 border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(getQRCodeUrl(qr.short_code));
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        Copier
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadQRCode(qr.platform, qr.short_code);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSocialQR(qr.id);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Panel */}
            {selectedQR && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getSocialIcon(selectedQR.platform, 24)}
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Statistiques
                      </h3>
                      <p className="text-sm text-slate-500">
                        {SOCIAL_PLATFORM_LABELS[selectedQR.platform]}
                      </p>
                    </div>
                  </div>
                  <a
                    href={selectedQR.social_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir la page
                  </a>
                </div>

                <div className="p-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-slate-900">
                        {selectedQR.scan_count}
                      </div>
                      <div className="text-sm text-slate-500">Total scans</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-slate-900">
                        {scanStats.length > 0
                          ? scanStats[scanStats.length - 1]?.count || 0
                          : 0}
                      </div>
                      <div className="text-sm text-slate-500">Aujourd'hui</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-slate-900">
                        {scanStats.reduce((sum, s) => sum + s.count, 0)}
                      </div>
                      <div className="text-sm text-slate-500">
                        Cette semaine
                      </div>
                    </div>
                  </div>

                  {/* Chart */}
                  {scanStats.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Scans des 7 derniers jours
                      </h4>
                      <div className="flex items-end gap-2 h-32">
                        {scanStats.map((stat, index) => {
                          const maxCount = Math.max(
                            ...scanStats.map((s) => s.count),
                            1,
                          );
                          const height = (stat.count / maxCount) * 100;
                          return (
                            <div
                              key={index}
                              className="flex-1 flex flex-col items-center"
                            >
                              <div
                                className={`w-full ${SOCIAL_PLATFORM_COLORS[selectedQR.platform].bg} rounded-t-md transition-all`}
                                style={{ height: `${Math.max(height, 4)}%` }}
                              />
                              <div className="text-xs text-slate-500 mt-2 truncate w-full text-center">
                                {stat.date.split("/").slice(0, 2).join("/")}
                              </div>
                              <div className="text-xs font-medium text-slate-700">
                                {stat.count}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                      <p>Aucun scan enregistré</p>
                      <p className="text-sm">
                        Les statistiques apparaîtront ici
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-purple-900 mb-2 text-lg">
                    💡 Comment ça marche ?
                  </h4>
                  <p className="text-purple-800 leading-relaxed">
                    Ajoutez vos liens Facebook, Instagram ou TikTok. Nous
                    générons un QR code unique avec le logo du réseau social.
                    <span className="font-semibold"> Chaque scan est comptabilisé</span> pour vous permettre de mesurer
                    l'efficacité de vos supports marketing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Branding Tab */}
        {activeTab === "branding" && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Logo Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                  <Upload className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Logo de l'entreprise</h2>
                  <p className="text-sm text-slate-500">Affichez votre logo sur vos fiches d'échange</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-40 h-40 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shadow-inner">
                  {formData.logo_base64 ? (
                    <img
                      src={formData.logo_base64}
                      alt="Logo"
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <Building2 className="w-16 h-16 text-slate-400" />
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
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl hover:from-sky-600 hover:to-blue-600 cursor-pointer transition-all shadow-md hover:shadow-lg font-semibold"
                  >
                    <Upload className="w-5 h-5" />
                    Télécharger une image
                  </label>

                  {formData.logo_base64 && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="ml-3 inline-flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  )}

                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Format recommandé:</span> PNG ou JPG, max 500 Ko
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Informations de l'entreprise</h2>
                  <p className="text-sm text-slate-500">Détails affichés sur vos documents</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    placeholder="Nom de votre entreprise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone
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
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Adresse</h2>
                  <p className="text-sm text-slate-500">Localisation de votre entreprise</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Adresse complète
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
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    placeholder="Rue, numéro, etc."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="Tunis"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end sticky bottom-6 z-10">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl hover:from-sky-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl font-bold transform hover:scale-105"
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

      {/* Add Social QR Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-3xl">
              <h3 className="text-2xl font-bold text-white">
                Ajouter un QR code social
              </h3>
              <p className="text-purple-100 text-sm mt-1">
                Connectez vos réseaux sociaux en un clic
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Lien de votre page sociale
                </label>
                <input
                  type="url"
                  value={newSocialUrl}
                  onChange={(e) => {
                    setNewSocialUrl(e.target.value);
                    setNewPlatform(detectPlatform(e.target.value));
                  }}
                  placeholder="https://facebook.com/votre-page"
                  className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-base"
                  autoFocus
                />
              </div>

              {newSocialUrl && (
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex-shrink-0">
                    {getSocialIcon(newPlatform, 32)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-lg block">
                      {SOCIAL_PLATFORM_LABELS[newPlatform]}
                    </span>
                    <span className="text-sm text-slate-600">Détecté automatiquement</span>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900 leading-relaxed">
                  💡 <span className="font-semibold">Astuce:</span> Collez le lien de votre page Facebook, Instagram ou TikTok. Le
                  réseau social sera détecté automatiquement.
                </p>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 rounded-b-3xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewSocialUrl("");
                }}
                className="px-6 py-3 text-slate-600 hover:text-slate-900 font-semibold transition-colors rounded-xl hover:bg-slate-200"
              >
                Annuler
              </button>
              <button
                onClick={handleAddSocialQR}
                disabled={!newSocialUrl.trim() || savingSocial}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-xl transition-all font-bold shadow-lg disabled:shadow-none transform hover:scale-105 disabled:scale-100"
              >
                {savingSocial ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Créer le QR code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </MerchantLayout>
  );
}
