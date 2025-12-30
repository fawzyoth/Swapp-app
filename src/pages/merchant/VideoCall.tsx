import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, VideoOff, Mic, MicOff, Phone, Clock, AlertCircle, CheckCircle, User, Circle } from 'lucide-react';
import { supabase, VideoCall as VideoCallType } from '../../lib/supabase';
import MerchantLayout from '../../components/MerchantLayout';

export default function MerchantVideoCall() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [videoCall, setVideoCall] = useState<VideoCallType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchVideoCall();
  }, [roomId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasJoined && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleEndCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [hasJoined, timeRemaining]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/merchant/login');
    }
  };

  const fetchVideoCall = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('video_calls')
        .select('*')
        .eq('room_id', roomId)
        .single();

      if (fetchError) throw fetchError;

      if (!data) {
        setError('Appel video non trouve');
        return;
      }

      setVideoCall(data);

      if (data.status === 'active' && data.started_at) {
        const startTime = new Date(data.started_at).getTime();
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimeRemaining(Math.max(0, 300 - elapsed));
        setHasJoined(true);
      }
    } catch (err) {
      console.error('Error fetching video call:', err);
      setError('Erreur lors du chargement de l\'appel');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCall = async () => {
    if (!videoCall) return;

    try {
      if (videoCall.status === 'pending') {
        await supabase
          .from('video_calls')
          .update({
            status: 'active',
            started_at: new Date().toISOString(),
          })
          .eq('id', videoCall.id);
      }

      setHasJoined(true);
    } catch (err) {
      console.error('Error joining call:', err);
    }
  };

  const handleEndCall = async () => {
    if (!videoCall) return;

    const duration = 300 - timeRemaining;

    try {
      await supabase
        .from('video_calls')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString(),
          duration_seconds: duration,
        })
        .eq('id', videoCall.id);

      setCallEnded(true);
      setHasJoined(false);
    } catch (err) {
      console.error('Error ending call:', err);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    console.log(isRecording ? 'Stopping recording...' : 'Starting recording...');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (error) {
    return (
      <MerchantLayout>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Erreur</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/merchant/video-calls')}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors"
          >
            Retour aux appels
          </button>
        </div>
      </MerchantLayout>
    );
  }

  if (callEnded) {
    return (
      <MerchantLayout>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Appel termine</h1>
          <p className="text-slate-600 mb-6">
            L'appel avec {videoCall?.client_name} est termine.
          </p>
          <button
            onClick={() => navigate('/merchant/video-calls')}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors"
          >
            Retour aux appels
          </button>
        </div>
      </MerchantLayout>
    );
  }

  if (!hasJoined) {
    return (
      <MerchantLayout>
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4">
                <Video className="w-8 h-8 text-sky-600" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-2">
                Appel video avec {videoCall?.client_name}
              </h1>
              <p className="text-slate-600">
                Rejoignez l'appel pour discuter avec le client
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <User className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Client</p>
                  <p className="font-medium text-slate-900">{videoCall?.client_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Phone className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Telephone</p>
                  <p className="font-medium text-slate-900">{videoCall?.client_phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <Clock className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-xs text-amber-600">Duree maximale</p>
                  <p className="font-medium text-amber-700">5 minutes</p>
                </div>
              </div>

              {videoCall?.recording_consent && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <Circle className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-emerald-600">Enregistrement</p>
                    <p className="font-medium text-emerald-700">Le client a consenti a l'enregistrement</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleJoinCall}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
            >
              <Video className="w-5 h-5" />
              Rejoindre l'appel
            </button>
          </div>
        </div>
      </MerchantLayout>
    );
  }

  // Active call UI
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Timer bar */}
      <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${timeRemaining <= 60 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            <span className="text-white font-medium">Appel avec {videoCall?.client_name}</span>
          </div>
          {isRecording && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full">
              <Circle className="w-3 h-3 text-white fill-white animate-pulse" />
              <span className="text-white text-sm font-medium">Enregistrement</span>
            </div>
          )}
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeRemaining <= 60 ? 'bg-red-600' : 'bg-slate-700'}`}>
          <Clock className="w-4 h-4 text-white" />
          <span className="text-white font-mono">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Video area (placeholder) */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl w-full max-w-4xl aspect-video flex items-center justify-center">
          <div className="text-center">
            <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Zone video</p>
            <p className="text-slate-500 text-sm mt-2">
              Votre implementation WebRTC sera integree ici
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800 px-4 py-6">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-4 rounded-full transition-colors ${
              isMicOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'
            }`}
            title={isMicOn ? 'Couper le micro' : 'Activer le micro'}
          >
            {isMicOn ? (
              <Mic className="w-6 h-6 text-white" />
            ) : (
              <MicOff className="w-6 h-6 text-white" />
            )}
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-4 rounded-full transition-colors ${
              isVideoOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'
            }`}
            title={isVideoOn ? 'Couper la video' : 'Activer la video'}
          >
            {isVideoOn ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </button>

          {videoCall?.recording_consent && (
            <button
              onClick={toggleRecording}
              className={`p-4 rounded-full transition-colors ${
                isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-600'
              }`}
              title={isRecording ? 'Arreter l\'enregistrement' : 'Demarrer l\'enregistrement'}
            >
              <Circle className={`w-6 h-6 text-white ${isRecording ? 'fill-white' : ''}`} />
            </button>
          )}

          <button
            onClick={handleEndCall}
            className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            title="Terminer l'appel"
          >
            <Phone className="w-6 h-6 text-white rotate-[135deg]" />
          </button>
        </div>
      </div>
    </div>
  );
}
