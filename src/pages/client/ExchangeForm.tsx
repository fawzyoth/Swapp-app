import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Video, X, MapPin, Check, Square, Store } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function ClientExchangeForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, lang, dir } = useLanguage();
  const merchantId = searchParams.get("merchant") || "";

  const REASONS = [
    { key: 'incorrectSize', fr: 'Taille incorrecte', ar: 'مقاس غير صحيح' },
    { key: 'wrongColor', fr: 'Couleur non conforme', ar: 'لون غير مطابق' },
    { key: 'defectiveProduct', fr: 'Produit défectueux', ar: 'منتج معيب' },
    { key: 'damagedProduct', fr: 'Produit endommagé', ar: 'منتج تالف' },
    { key: 'notAsDescribed', fr: 'Ne correspond pas à la description', ar: 'لا يتطابق مع الوصف' },
    { key: 'changedMind', fr: 'Changement d\'avis', ar: 'تغيير الرأي' },
    { key: 'other', fr: 'Autre', ar: 'أخرى' },
  ];

  const [merchant, setMerchant] = useState<any>(null);
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    clientAddress: "",
    clientCity: "",
    clientPostalCode: "",
    clientCountry: "Tunisia",
    productName: "",
    reason: "",
  });
  const [video, setVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMerchant, setLoadingMerchant] = useState(true);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [error, setError] = useState("");
  const [previousDataFound, setPreviousDataFound] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (merchantId) {
      loadMerchant();
    } else {
      setLoadingMerchant(false);
      setError(t('noMerchantSpecified'));
    }
  }, [merchantId]);

  useEffect(() => {
    const phone = localStorage.getItem("lastClientPhone");
    if (phone) {
      loadPreviousData(phone);
    }
  }, []);

  const loadMerchant = async () => {
    try {
      const { data, error } = await supabase
        .from("merchants")
        .select("*")
        .eq("id", merchantId)
        .single();

      if (error) throw error;
      setMerchant(data);
    } catch (err) {
      console.error("Error loading merchant:", err);
      setError(t('merchantNotFound'));
    } finally {
      setLoadingMerchant(false);
    }
  };

  const loadPreviousData = async (phone: string) => {
    setLoadingPrevious(true);
    try {
      const { data: exchanges } = await supabase
        .from("exchanges")
        .select("*")
        .eq("client_phone", phone)
        .order("created_at", { ascending: false })
        .limit(1);

      if (exchanges && exchanges.length > 0) {
        const lastExchange = exchanges[0];
        setFormData({
          clientName: lastExchange.client_name || "",
          clientPhone: phone,
          clientAddress: lastExchange.client_address || "",
          clientCity: lastExchange.client_city || "",
          clientPostalCode: lastExchange.client_postal_code || "",
          clientCountry: lastExchange.client_country || "Tunisia",
          productName: "",
          reason: "",
        });
        setPreviousDataFound(true);
      }
    } catch (err) {
      console.error("Error loading previous data:", err);
    } finally {
      setLoadingPrevious(false);
    }
  };

  const handlePhoneChange = async (phone: string) => {
    setFormData({ ...formData, clientPhone: phone });

    if (phone.length >= 8) {
      loadPreviousData(phone);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(t('cameraAccessError'));
    }
  };

  useEffect(() => {
    if (showCamera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
      });
    }
  }, [showCamera]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setIsRecording(false);
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: "video/webm",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideo(reader.result as string);
      };
      reader.readAsDataURL(blob);
      stopCamera();
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const generateExchangeCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EXC-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const exchangeCode = generateExchangeCode();

      const { data: exchange, error: insertError } = await supabase
        .from("exchanges")
        .insert({
          exchange_code: exchangeCode,
          merchant_id: merchantId,
          client_name: formData.clientName,
          client_phone: formData.clientPhone,
          client_address: formData.clientAddress,
          client_city: formData.clientCity,
          client_postal_code: formData.clientPostalCode,
          client_country: formData.clientCountry,
          product_name: formData.productName,
          reason: formData.reason,
          video: video,
          status: "pending",
          payment_status: "pending",
          payment_amount: 0,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await supabase.from("status_history").insert({
        exchange_id: exchange.id,
        status: "pending",
      });

      localStorage.setItem("lastClientPhone", formData.clientPhone);

      // Redirect to success page instead of tracking
      navigate(`/client/success/${exchangeCode}`);
    } catch (err) {
      console.error("Error submitting exchange:", err);
      setError(t('submissionError'));
    } finally {
      setLoading(false);
    }
  };

  if (loadingMerchant) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen bg-slate-50" dir={dir}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-end mb-6">
            <LanguageSwitcher />
          </div>
          <div className="max-w-md mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-red-700 mb-4">{error || t('merchantNotFound')}</p>
              <button
                onClick={() => navigate("/client/scan")}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                {t('scanQRCode')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" dir={dir}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/client/scan")}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 me-2" />
            <span className="font-medium">{t('back')}</span>
          </button>
          <LanguageSwitcher />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {t('exchangeRequest')}
            </h1>
            <p className="text-slate-600">
              {t('fillFormToSubmit')}
            </p>
          </div>

          {/* Merchant Info */}
          <div className="mb-6 bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-purple-900">{merchant.name}</p>
                <p className="text-sm text-purple-600">{t('merchant')}</p>
              </div>
            </div>
          </div>

          {previousDataFound && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <Check className="w-5 h-5" />
                <span className="font-medium">{t('infoFound')}</span>
              </div>
              <p className="text-sm text-emerald-600 mt-1">
                {t('infoFoundDescription')}
              </p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {t('yourInformation')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('fullName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) =>
                        setFormData({ ...formData, clientName: e.target.value })
                      }
                      placeholder={t('yourName')}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.clientPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="+216 XX XXX XXX"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      dir="ltr"
                    />
                    {loadingPrevious && (
                      <p className="text-xs text-slate-500 mt-1">
                        {t('searchingInfo')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    {t('deliveryAddress')}
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('address')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clientAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          clientAddress: e.target.value,
                        })
                      }
                      placeholder={t('streetNumber')}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t('city')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientCity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientCity: e.target.value,
                          })
                        }
                        placeholder={t('city')}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t('postalCode')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientPostalCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientPostalCode: e.target.value,
                          })
                        }
                        placeholder="1000"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('country')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clientCountry}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          clientCountry: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {t('productDetails')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('productName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.productName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productName: e.target.value,
                        })
                      }
                      placeholder={t('productNamePlaceholder')}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('exchangeReason')} *
                    </label>
                    <select
                      required
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">{t('selectReason')}</option>
                      {REASONS.map((reason) => (
                        <option key={reason.key} value={reason.fr}>
                          {lang === 'ar' ? reason.ar : reason.fr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('productVideo')} *
                    </label>
                    <p className="text-xs text-slate-600 mb-3">
                      {t('videoDescription')}
                    </p>
                    <div className="space-y-4">
                      {showCamera ? (
                        <div className="relative">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-64 object-cover rounded-lg border border-slate-200 bg-black"
                          />
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                            {!isRecording ? (
                              <button
                                type="button"
                                onClick={startRecording}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                              >
                                <Video className="w-5 h-5" />
                                {t('record')}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={stopRecording}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg animate-pulse"
                              >
                                <Square className="w-5 h-5" />
                                {t('stop')}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={stopCamera}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-500 text-white rounded-full hover:bg-slate-600 transition-colors shadow-lg"
                            >
                              <X className="w-5 h-5" />
                              {t('cancel')}
                            </button>
                          </div>
                        </div>
                      ) : video ? (
                        <div className="relative">
                          <video
                            src={video}
                            controls
                            className="w-full h-64 object-cover rounded-lg border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={removeVideo}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={startCamera}
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors"
                        >
                          <Video className="w-8 h-8 text-slate-400 mb-2" />
                          <span className="text-sm text-slate-500">
                            {t('clickToRecord')}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !video}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors shadow-sm"
              >
                {loading ? t('submitting') : t('submitRequest')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
