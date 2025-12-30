import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, VideoOff, Mic, MicOff, Phone, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase, VideoCall as VideoCallType } from '../../lib/supabase';

export default function ClientVideoCall() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [videoCall, setVideoCall] = useState<VideoCallType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recordingConsent, setRecordingConsent] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [callEnded, setCallEnded] = useState(false);

  useEffect(() => {
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

      if (data.status === 'completed' || data.status === 'expired' || data.status === 'cancelled') {
        setError('Cet appel video n\'est plus disponible');
        return;
      }

      setVideoCall(data);
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
      await supabase
        .from('video_calls')
        .update({
          status: 'active',
          started_at: new Date().toISOString(),
          recording_consent: recordingConsent,
        })
        .eq('id', videoCall.id);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Appel non disponible</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
          >
            Retour a l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (callEnded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Appel termine</h1>
          <p className="text-slate-600 mb-6">
            Merci d'avoir participe a cet appel video.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            Retour a l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4">
              <Video className="w-8 h-8 text-sky-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">
              Rejoindre l'appel video
            </h1>
            <p className="text-slate-600">
              Vous etes invite a un appel video avec le marchand
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-slate-900">Duree maximale: 5 minutes</span>
            </div>
            <p className="text-sm text-slate-600">
              L'appel se terminera automatiquement apres 5 minutes
            </p>
          </div>

          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={recordingConsent}
                onChange={(e) => setRecordingConsent(e.target.checked)}
                className="mt-1 w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
              />
              <span className="text-sm text-slate-700">
                J'accepte que cet appel puisse etre enregistre a des fins de qualite de service
              </span>
            </label>
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
    );
  }

  // Active call UI (placeholder for your WebRTC implementation)
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Timer bar */}
      <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${timeRemaining <= 60 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
          <span className="text-white font-medium">Appel en cours</span>
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
          >
            {isVideoOn ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </button>

          <button
            onClick={handleEndCall}
            className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
          >
            <Phone className="w-6 h-6 text-white rotate-[135deg]" />
          </button>
        </div>
      </div>
    </div>
  );
}
