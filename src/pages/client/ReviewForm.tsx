import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Send,
  Check,
  Video,
  X,
  Square,
  Store,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import StarRating from "../../components/common/StarRating";

export default function ClientReviewForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, lang, dir } = useLanguage();
  const exchangeCode = searchParams.get("code") || "";
  const merchantId = searchParams.get("merchant") || "";

  // Refs for camera/recording
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_RECORDING_TIME = 60; // 1 minute max

  const [merchant, setMerchant] = useState<any>(null);
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingMerchant, setLoadingMerchant] = useState(true);
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
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    if (merchantId) {
      loadMerchant();
    } else {
      setLoadingMerchant(false);
    }
    const phone = localStorage.getItem("lastClientPhone");
    if (phone) {
      loadPreviousData(phone);
    }
  }, [merchantId]);

  // Connect video element to stream when camera is shown
  useEffect(() => {
    if (showCamera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
      });
    }
  }, [showCamera]);

  const loadMerchant = async () => {
    try {
      const { data, error } = await supabase
        .from("merchants")
        .select("*")
        .eq("id", merchantId)
        .single();

      if (!error && data) {
        setMerchant(data);
      }
    } catch (err) {
      console.error("Error loading merchant:", err);
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

  // Camera functions - same pattern as ExchangeForm
  const startCamera = async () => {
    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      streamRef.current = stream;
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(
        lang === "ar"
          ? "تعذر الوصول إلى الكاميرا"
          : "Impossible d'accéder à la caméra",
      );
    }
  };

  const stopCamera = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setIsRecording(false);
    setRecordingTime(0);
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
        const videoDataUrl = reader.result as string;
        setRecordedVideo(videoDataUrl);
        setRecordedBlob(blob);
      };
      reader.readAsDataURL(blob);
      stopCamera();
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);

    // Start recording timer
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= MAX_RECORDING_TIME) {
          stopRecording();
        }
        return newTime;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeVideo = () => {
    setRecordedVideo(null);
    setRecordedBlob(null);
    setRecordingTime(0);
  };

  const cancelCamera = () => {
    stopRecording();
    stopCamera();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      setError(
        lang === "ar" ? "يرجى اختيار تقييم" : "Veuillez sélectionner une note",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Log video for debugging
      if (recordedBlob) {
        console.log("[REVIEW] Video recorded:", recordedBlob.size, "bytes");
      }

      const { error: insertError } = await supabase.from("reviews").insert({
        exchange_code: exchangeCode || null,
        merchant_id: merchantId || null,
        client_name: formData.clientName,
        client_phone: formData.clientPhone,
        rating: formData.rating,
        comment: formData.comment || null,
        is_published: true,
      });

      if (insertError) throw insertError;

      localStorage.setItem("lastClientPhone", formData.clientPhone);
      setSuccess(true);
    } catch (err: any) {
      console.error("Error submitting review:", err);
      setError(
        lang === "ar"
          ? "خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى."
          : "Erreur lors de la soumission. Veuillez réessayer.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingMerchant) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

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
              {lang === "ar" ? "شكرًا لتقييمك!" : "Merci pour votre avis !"}
            </h1>
            <p className="text-slate-600 mb-6">
              {lang === "ar"
                ? "ملاحظاتك تساعدنا على تحسين خدماتنا."
                : "Votre retour nous aide à améliorer nos services."}
            </p>
            <div className="flex justify-center mb-6">
              <StarRating rating={formData.rating} readonly size="lg" />
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              {lang === "ar"
                ? "العودة إلى الصفحة الرئيسية"
                : "Retour à l'accueil"}
            </button>
          </div>
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
        {/* Language Switcher */}
        <div className="max-w-2xl mx-auto mb-4 flex justify-end">
          <LanguageSwitcher />
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white/70 hover:text-white mb-6 transition-colors max-w-2xl mx-auto"
        >
          <ArrowLeft
            className={`w-5 h-5 ${lang === "ar" ? "ml-2 rotate-180" : "mr-2"}`}
          />
          <span className="font-medium">
            {lang === "ar" ? "العودة" : "Retour"}
          </span>
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
              {lang === "ar" ? "اترك تقييمك" : "Laisser un avis"}
            </h1>
            <p className="text-slate-300">
              {lang === "ar"
                ? "شارك تجربتك معنا"
                : "Partagez votre expérience avec nous"}
            </p>
            {merchant && (
              <p className="text-amber-400 font-medium mt-2">
                {merchant.store_name}
              </p>
            )}
          </div>

          {previousDataFound && (
            <div className="mb-6 bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-5 h-5" />
                <span className="font-medium">
                  {lang === "ar"
                    ? "تم العثور على معلوماتك"
                    : "Informations retrouvées"}
                </span>
              </div>
              <p className="text-sm text-emerald-300 mt-1">
                {lang === "ar"
                  ? "تم ملء معلوماتك تلقائيًا"
                  : "Vos informations ont été remplies automatiquement"}
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
                    {lang === "ar" ? "رمز التبادل" : "Code d'échange"}
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
                  {lang === "ar" ? "معلوماتك" : "Vos informations"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {lang === "ar" ? "الاسم الكامل" : "Nom complet"} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) =>
                        setFormData({ ...formData, clientName: e.target.value })
                      }
                      placeholder={lang === "ar" ? "اسمك" : "Votre nom"}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {lang === "ar" ? "الهاتف" : "Téléphone"} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.clientPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="+216 XX XXX XXX"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      dir="ltr"
                    />
                    {loadingPrevious && (
                      <p className="text-xs text-slate-500 mt-1">
                        {lang === "ar"
                          ? "جاري البحث عن معلوماتك..."
                          : "Recherche de vos informations..."}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {lang === "ar" ? "تقييمك" : "Votre avis"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      {lang === "ar" ? "التقييم" : "Note"} *
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
                      {lang === "ar"
                        ? "تعليق (اختياري)"
                        : "Commentaire (optionnel)"}
                    </label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      placeholder={
                        lang === "ar"
                          ? "صف تجربتك..."
                          : "Décrivez votre expérience..."
                      }
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1 text-right">
                      {formData.comment.length}/500{" "}
                      {lang === "ar" ? "حرف" : "caractères"}
                    </p>
                  </div>

                  {/* Video Recording Section - Same pattern as ExchangeForm */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {lang === "ar" ? "فيديو (اختياري)" : "Vidéo (optionnel)"}
                    </label>
                    <p className="text-xs text-slate-600 mb-3">
                      {lang === "ar"
                        ? "مدة أقصاها دقيقة واحدة"
                        : "Durée maximum 1 minute"}
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

                          {/* Recording Timer */}
                          {isRecording && (
                            <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full shadow-lg">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              <span className="font-mono font-bold">
                                {formatTime(recordingTime)} /{" "}
                                {formatTime(MAX_RECORDING_TIME)}
                              </span>
                            </div>
                          )}

                          {/* Time remaining warning */}
                          {isRecording && recordingTime >= 50 && (
                            <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1.5 rounded-full text-sm shadow-lg">
                              {lang === "ar"
                                ? `${MAX_RECORDING_TIME - recordingTime} ثانية متبقية`
                                : `${MAX_RECORDING_TIME - recordingTime}s restantes`}
                            </div>
                          )}

                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                            {!isRecording ? (
                              <>
                                <button
                                  type="button"
                                  onClick={cancelCamera}
                                  className="flex items-center gap-2 px-4 py-2 bg-slate-500 text-white rounded-full hover:bg-slate-600 transition-colors shadow-lg"
                                >
                                  <X className="w-5 h-5" />
                                  {lang === "ar" ? "إلغاء" : "Annuler"}
                                </button>
                                <button
                                  type="button"
                                  onClick={startRecording}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                >
                                  <Video className="w-5 h-5" />
                                  {lang === "ar" ? "تسجيل" : "Enregistrer"}
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={stopRecording}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg animate-pulse"
                              >
                                <Square className="w-5 h-5" />
                                {lang === "ar" ? "إيقاف" : "Arrêter"}
                              </button>
                            )}
                          </div>
                        </div>
                      ) : recordedVideo ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <video
                              src={recordedVideo}
                              controls
                              className="w-full h-64 object-cover rounded-lg border border-slate-200"
                            />
                            {/* Re-record button */}
                            <div className="absolute top-2 right-2 flex gap-2">
                              <button
                                type="button"
                                onClick={removeVideo}
                                className="flex items-center gap-1 px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-lg text-sm"
                              >
                                <Video className="w-4 h-4" />
                                {lang === "ar"
                                  ? "إعادة التسجيل"
                                  : "Ré-enregistrer"}
                              </button>
                            </div>
                          </div>

                          {/* Success message */}
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2">
                            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-emerald-800">
                                {lang === "ar"
                                  ? "تم تسجيل الفيديو بنجاح!"
                                  : "Vidéo enregistrée avec succès !"}
                              </p>
                              <p className="text-xs text-emerald-600 mt-0.5">
                                {lang === "ar"
                                  ? "إذا أخطأت، يمكنك حذف الفيديو وتسجيله مرة أخرى"
                                  : "Si vous avez fait une erreur, vous pouvez supprimer et ré-enregistrer"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <button
                            type="button"
                            onClick={startCamera}
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors"
                          >
                            <Video className="w-8 h-8 text-slate-400 mb-2" />
                            <span className="text-sm text-slate-500">
                              {lang === "ar"
                                ? "انقر لتسجيل فيديو"
                                : "Cliquez pour enregistrer"}
                            </span>
                          </button>

                          {/* Video instructions */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800 font-medium mb-1">
                              {lang === "ar"
                                ? "📹 تعليمات التسجيل:"
                                : "📹 Instructions d'enregistrement :"}
                            </p>
                            <ul className="text-xs text-blue-700 space-y-1">
                              <li>
                                •{" "}
                                {lang === "ar"
                                  ? "الحد الأقصى للتسجيل: دقيقة واحدة (60 ثانية)"
                                  : "Durée maximale : 1 minute (60 secondes)"}
                              </li>
                              <li>
                                •{" "}
                                {lang === "ar"
                                  ? "شارك تجربتك بالفيديو"
                                  : "Partagez votre expérience en vidéo"}
                              </li>
                              <li>
                                •{" "}
                                {lang === "ar"
                                  ? "يمكنك إعادة التسجيل إذا أخطأت"
                                  : "Vous pouvez ré-enregistrer en cas d'erreur"}
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {cameraError && (
                        <p className="text-sm text-red-600">{cameraError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || formData.rating === 0}
                className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors shadow-lg"
              >
                <Send className="w-5 h-5" />
                {loading
                  ? lang === "ar"
                    ? "جاري الإرسال..."
                    : "Envoi en cours..."
                  : lang === "ar"
                    ? "إرسال التقييم"
                    : "Envoyer mon avis"}
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
