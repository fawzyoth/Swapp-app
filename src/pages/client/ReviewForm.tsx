import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Send,
  Check,
  Video,
  X,
  Circle,
  StopCircle,
  Store,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import StarRating from "../../components/common/StarRating";

const MAX_RECORDING_TIME = 60; // 1 minute max

// Arabic translations
const translations = {
  ar: {
    backToScan: "العودة",
    leaveReview: "اترك تقييمك",
    shareExperience: "شارك تجربتك مع التاجر",
    infoFound: "تم العثور على معلوماتك",
    infoAutoFilled: "تم ملء معلوماتك تلقائيًا",
    yourInfo: "معلوماتك",
    fullName: "الاسم الكامل",
    yourName: "اسمك",
    phone: "الهاتف",
    phonePlaceholder: "+216 XX XXX XXX",
    searchingInfo: "جاري البحث عن معلوماتك...",
    yourReview: "تقييمك",
    rating: "التقييم",
    comment: "تعليق (اختياري)",
    describeExperience: "صف تجربتك...",
    characters: "حرف",
    video: "فيديو (اختياري)",
    recordVideo: "تسجيل فيديو",
    maxDuration: "مدة أقصاها دقيقة واحدة",
    startRecording: "بدء التسجيل",
    stopRecording: "إيقاف التسجيل",
    deleteVideo: "حذف الفيديو",
    videoRecorded: "تم تسجيل الفيديو",
    sending: "جاري الإرسال...",
    sendReview: "إرسال التقييم",
    selectRating: "يرجى اختيار تقييم",
    errorSubmitting: "خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",
    thankYou: "شكرًا لتقييمك!",
    feedbackHelps: "ملاحظاتك تساعدنا على تحسين خدماتنا.",
    backToHome: "العودة إلى الصفحة الرئيسية",
    exchangeCode: "رمز التبادل",
    close: "إغلاق",
    cameraPermission: "يرجى السماح بالوصول إلى الكاميرا",
  },
  fr: {
    backToScan: "Retour",
    leaveReview: "Laisser un avis",
    shareExperience: "Partagez votre expérience avec le marchand",
    infoFound: "Informations retrouvées",
    infoAutoFilled: "Vos informations ont été automatiquement remplies",
    yourInfo: "Vos informations",
    fullName: "Nom complet",
    yourName: "Votre nom",
    phone: "Téléphone",
    phonePlaceholder: "+216 XX XXX XXX",
    searchingInfo: "Recherche de vos informations...",
    yourReview: "Votre avis",
    rating: "Note",
    comment: "Commentaire (optionnel)",
    describeExperience: "Décrivez votre expérience...",
    characters: "caractères",
    video: "Vidéo (optionnel)",
    recordVideo: "Enregistrer une vidéo",
    maxDuration: "Durée maximum 1 minute",
    startRecording: "Démarrer",
    stopRecording: "Arrêter",
    deleteVideo: "Supprimer la vidéo",
    videoRecorded: "Vidéo enregistrée",
    sending: "Envoi en cours...",
    sendReview: "Envoyer mon avis",
    selectRating: "Veuillez sélectionner une note",
    errorSubmitting: "Erreur lors de la soumission. Veuillez réessayer.",
    thankYou: "Merci pour votre avis !",
    feedbackHelps: "Votre retour nous aide à améliorer nos services.",
    backToHome: "Retour à l'accueil",
    exchangeCode: "Code d'échange",
    close: "Fermer",
    cameraPermission: "Veuillez autoriser l'accès à la caméra",
  },
};

export default function ClientReviewForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const exchangeCode = searchParams.get("code") || "";
  const merchantId = searchParams.get("merchant") || "";

  // Language state - default to Arabic
  const [lang, setLang] = useState<"ar" | "fr">("ar");
  const t = translations[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [merchant, setMerchant] = useState<any>(null);
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [previousDataFound, setPreviousDataFound] = useState(false);

  // Camera/Recording states
  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (merchantId) {
      fetchMerchant();
    }
    const phone = localStorage.getItem("lastClientPhone");
    if (phone) {
      loadPreviousData(phone);
    }
  }, [merchantId]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const fetchMerchant = async () => {
    try {
      const { data } = await supabase
        .from("merchants")
        .select("*")
        .eq("id", merchantId)
        .maybeSingle();
      if (data) setMerchant(data);
    } catch (err) {
      console.error("Error fetching merchant:", err);
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
        setFormData((prev) => ({
          ...prev,
          clientName: lastExchange.client_name || "",
          clientPhone: phone,
        }));
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

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(t.cameraPermission);
    }
  };

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
      const url = URL.createObjectURL(blob);
      setRecordedVideo(url);
      setRecordedBlob(blob);
      stopCamera();
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const deleteVideo = () => {
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
    }
    setRecordedVideo(null);
    setRecordedBlob(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      setError(t.selectRating);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const targetMerchantId =
        merchantId || "11111111-1111-1111-1111-111111111111";

      const { error: insertError } = await supabase.from("reviews").insert({
        exchange_code: exchangeCode || null,
        merchant_id: targetMerchantId,
        client_name: formData.clientName,
        client_phone: formData.clientPhone,
        rating: formData.rating,
        comment: formData.comment || null,
        is_published: true,
      });

      if (insertError) throw insertError;

      localStorage.setItem("lastClientPhone", formData.clientPhone);
      setSuccess(true);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(t.errorSubmitting);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4"
        dir={dir}
      >
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {t.thankYou}
            </h1>
            <p className="text-slate-600 mb-6">{t.feedbackHelps}</p>
            <div className="flex justify-center mb-6">
              <StarRating rating={formData.rating} readonly size="lg" />
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              {t.backToHome}
            </button>
          </div>
          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Powered by{" "}
              <span className="font-semibold text-emerald-400">SWAPP</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      dir={dir}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Language Toggle */}
        <div className="max-w-2xl mx-auto mb-4 flex justify-end gap-2">
          <button
            onClick={() => setLang("ar")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              lang === "ar"
                ? "bg-emerald-600 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            العربية
          </button>
          <button
            onClick={() => setLang("fr")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              lang === "fr"
                ? "bg-emerald-600 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Français
          </button>
        </div>

        <button
          onClick={() => navigate("/client/scan")}
          className="flex items-center text-white/70 hover:text-white mb-6 transition-colors max-w-2xl mx-auto"
        >
          <ArrowLeft
            className={`w-5 h-5 ${lang === "ar" ? "ml-2 rotate-180" : "mr-2"}`}
          />
          <span className="font-medium">{t.backToScan}</span>
        </button>

        <div className="max-w-2xl mx-auto">
          {/* Header with Merchant Logo */}
          <div className="text-center mb-8">
            {merchant?.logo_url ? (
              <img
                src={merchant.logo_url}
                alt={merchant.store_name}
                className="w-20 h-20 mx-auto rounded-2xl object-cover shadow-lg mb-4 border-2 border-white/20"
              />
            ) : (
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <Star className="w-10 h-10 text-white" />
              </div>
            )}
            <h1 className="text-3xl font-bold text-white mb-2">
              {t.leaveReview}
            </h1>
            <p className="text-slate-300">{t.shareExperience}</p>
            {merchant && (
              <p className="text-emerald-400 font-medium mt-2">
                {merchant.store_name}
              </p>
            )}
          </div>

          {previousDataFound && (
            <div className="mb-6 bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-5 h-5" />
                <span className="font-medium">{t.infoFound}</span>
              </div>
              <p className="text-sm text-emerald-300 mt-1">
                {t.infoAutoFilled}
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {exchangeCode && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.exchangeCode}
                  </label>
                  <input
                    type="text"
                    value={exchangeCode}
                    disabled
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-semibold"
                  />
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {t.yourInfo}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) =>
                        setFormData({ ...formData, clientName: e.target.value })
                      }
                      placeholder={t.yourName}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.clientPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      dir="ltr"
                    />
                    {loadingPrevious && (
                      <p className="text-xs text-slate-500 mt-1">
                        {t.searchingInfo}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {t.yourReview}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      {t.rating} *
                    </label>
                    <div className="flex items-center gap-4">
                      <StarRating
                        rating={formData.rating}
                        onRatingChange={(rating) =>
                          setFormData({ ...formData, rating })
                        }
                        size="lg"
                      />
                      {formData.rating > 0 && (
                        <span className="text-lg font-semibold text-amber-600">
                          {formData.rating}/5
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.comment}
                    </label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      placeholder={t.describeExperience}
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    />
                    <p className="text-xs text-slate-500 mt-1 text-right">
                      {formData.comment.length}/500 {t.characters}
                    </p>
                  </div>

                  {/* Video Recording Section */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.video}
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      {t.maxDuration}
                    </p>

                    {!showCamera && !recordedVideo && (
                      <button
                        type="button"
                        onClick={startCamera}
                        className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-colors"
                      >
                        <Video className="w-6 h-6 text-slate-400" />
                        <span className="text-slate-600 font-medium">
                          {t.recordVideo}
                        </span>
                      </button>
                    )}

                    {showCamera && (
                      <div className="relative rounded-xl overflow-hidden bg-black">
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-full min-h-[300px] object-cover"
                        />

                        {/* Recording Timer */}
                        {isRecording && (
                          <div className="absolute top-4 left-4 right-4">
                            <div className="flex items-center justify-between text-white mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                <span className="font-mono font-bold">
                                  {formatTime(recordingTime)}
                                </span>
                              </div>
                              <span className="text-sm opacity-75">
                                {formatTime(MAX_RECORDING_TIME)}
                              </span>
                            </div>
                            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 transition-all duration-1000"
                                style={{
                                  width: `${(recordingTime / MAX_RECORDING_TIME) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Camera Controls */}
                        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                          {!isRecording ? (
                            <>
                              <button
                                type="button"
                                onClick={stopCamera}
                                className="p-3 bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition-colors"
                              >
                                <X className="w-6 h-6 text-white" />
                              </button>
                              <button
                                type="button"
                                onClick={startRecording}
                                className="p-4 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                              >
                                <Circle className="w-8 h-8 text-white fill-white" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={stopRecording}
                              className="p-4 bg-red-500 rounded-full hover:bg-red-600 transition-colors animate-pulse"
                            >
                              <StopCircle className="w-8 h-8 text-white" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {recordedVideo && (
                      <div className="space-y-3">
                        <div className="relative rounded-xl overflow-hidden bg-black">
                          <video
                            src={recordedVideo}
                            controls
                            className="w-full min-h-[200px]"
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <div className="flex items-center gap-2 text-emerald-700">
                            <Check className="w-5 h-5" />
                            <span className="font-medium">
                              {t.videoRecorded}
                            </span>
                            <span className="text-sm text-emerald-600">
                              ({formatTime(recordingTime)})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={deleteVideo}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || formData.rating === 0}
                className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors shadow-lg"
              >
                <Send className="w-5 h-5" />
                {loading ? t.sending : t.sendReview}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Powered by{" "}
              <span className="font-semibold text-emerald-400">SWAPP</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
