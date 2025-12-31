import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Star, Send, Check, Video, X, Circle, StopCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import StarRating from '../../components/common/StarRating';
import ClientLayout from '../../components/ClientLayout';

export default function ClientReviewForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const exchangeCode = searchParams.get('code') || '';
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [formData, setFormData] = useState({ clientName: '', clientPhone: '', rating: 0, comment: '' });
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [cameraError, setCameraError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [previousDataFound, setPreviousDataFound] = useState(false);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const MAX_RECORDING_TIME = 60;


  useEffect(() => {
    const phone = localStorage.getItem('lastClientPhone');
    if (phone) loadPreviousData(phone);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME) { stopRecording(); return prev; }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const loadPreviousData = async (phone: string) => {
    setLoadingPrevious(true);
    try {
      const { data } = await supabase.from('exchanges').select('*').eq('client_phone', phone).order('created_at', { ascending: false }).limit(1);
      if (data && data.length > 0) {
        setFormData((prev) => ({ ...prev, clientName: data[0].client_name || '', clientPhone: phone }));
        setPreviousDataFound(true);
      }
    } catch (err) { console.error(err); }
    finally { setLoadingPrevious(false); }
  };

  const handlePhoneChange = (phone: string) => {
    setFormData({ ...formData, clientPhone: phone });
    if (phone.length >= 8) loadPreviousData(phone);
  };

  const startCamera = async () => {
    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch { setCameraError("Impossible d'acceder a la camera"); }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(streamRef.current);
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedVideo(URL.createObjectURL(blob));
      setRecordedBlob(blob);
      stopCamera();
    };
    mediaRecorderRef.current = mr;
    mr.start();
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setShowCamera(false);
  };

  const removeVideo = () => {
    if (recordedVideo) URL.revokeObjectURL(recordedVideo);
    setRecordedVideo(null); setRecordedBlob(null); setRecordingTime(0);
  };

  const cancelCamera = () => { stopRecording(); stopCamera(); };
  const formatTime = (s: number) => Math.floor(s/60) + ':' + (s%60).toString().padStart(2,'0');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) { setError('Veuillez selectionner une note'); return; }
    setLoading(true); setError('');
    try {
      if (recordedBlob) console.log('[REVIEW] Video:', recordedBlob.size, 'bytes');
      const { error: insertError } = await supabase.from('reviews').insert({
        exchange_code: exchangeCode || null,
        merchant_id: searchParams.get('merchant') || null,
        client_name: formData.clientName,
        client_phone: formData.clientPhone,
        rating: formData.rating,
        comment: formData.comment || null,
        
        is_published: true,
      });
      if (insertError) throw insertError;
      localStorage.setItem('lastClientPhone', formData.clientPhone);
      setSuccess(true);
    } catch (err: any) { setError('Erreur: ' + (err.message || 'Reessayez')); }
    finally { setLoading(false); }
  };

  if (success) return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4"><Check className="w-8 h-8 text-emerald-600" /></div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Merci pour votre avis !</h1>
          <p className="text-slate-600 mb-6">Votre retour nous aide a ameliorer nos services.</p>
          <StarRating rating={formData.rating} readonly size="lg" />
          <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium">Retour</button>
        </div>
      </div>
    </ClientLayout>
  );


  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-600 hover:text-slate-900 mb-6"><ArrowLeft className="w-5 h-5 mr-2" /><span className="font-medium">Retour</span></button>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4"><Star className="w-8 h-8 text-amber-600" /></div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Laisser un avis</h1>
          <p className="text-slate-600">Partagez votre experience</p>
        </div>
        {previousDataFound && <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4"><div className="flex items-center gap-2 text-emerald-700"><Check className="w-5 h-5" /><span className="font-medium">Informations retrouvees</span></div></div>}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Vos informations</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Nom complet *</label><input type="text" required value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Telephone *</label><input type="tel" required value={formData.clientPhone} onChange={(e) => handlePhoneChange(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500" /></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Votre avis</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-3">Note *</label><div className="flex items-center gap-4"><StarRating rating={formData.rating} onRatingChange={(r) => setFormData({ ...formData, rating: r })} size="lg" />{formData.rating > 0 && <span className="text-lg font-semibold text-amber-600">{formData.rating}/5</span>}</div></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Commentaire</label><textarea value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} rows={4} maxLength={500} className="w-full px-4 py-3 border border-slate-300 rounded-lg resize-none" /></div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Video (max 1 min)</label>
                  {!showCamera && !recordedVideo && <button type="button" onClick={startCamera} className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-amber-500 hover:bg-amber-50"><Video className="w-10 h-10 text-slate-400 mx-auto mb-3" /><p className="text-sm text-slate-600 font-medium">Enregistrer une video</p></button>}
                  {showCamera && (
                    <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-black">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full min-h-[300px] object-cover" />
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 rounded-full flex items-center gap-2">{isRecording && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />}<span className={"text-2xl font-mono font-bold " + (isRecording ? "text-red-400" : "text-white")}>{formatTime(MAX_RECORDING_TIME - recordingTime)}</span></div>
                      {isRecording && <div className="absolute bottom-20 left-4 right-4"><div className="h-2 bg-white/30 rounded-full"><div className="h-full bg-red-500 rounded-full transition-all" style={{width: (recordingTime/MAX_RECORDING_TIME*100) + "%"}} /></div></div>}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">{!isRecording ? <><button type="button" onClick={cancelCamera} className="px-4 py-2 bg-slate-600 text-white rounded-lg">Annuler</button><button type="button" onClick={startRecording} className="px-6 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2"><Circle className="w-5 h-5 fill-current" />Enregistrer</button></> : <button type="button" onClick={stopRecording} className="px-6 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 animate-pulse"><StopCircle className="w-5 h-5" />Arreter</button>}</div>
                    </div>
                  )}
                  {recordedVideo && <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-black"><video src={recordedVideo} controls className="w-full aspect-video" /><button type="button" onClick={removeVideo} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button><div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">{formatTime(recordingTime)}</div></div>}
                  {cameraError && <p className="text-sm text-red-600 mt-2">{cameraError}</p>}
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading || formData.rating === 0} className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white rounded-lg font-semibold">{loading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />Envoi...</> : <><Send className="w-5 h-5" />Envoyer</>}</button>
          </form>
        </div>
      </div>
    </ClientLayout>
  );
}

