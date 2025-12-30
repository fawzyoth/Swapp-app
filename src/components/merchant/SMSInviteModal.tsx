import { useState } from 'react';
import { X, Video, Send, Phone, User, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { sendVideoCallInviteSMS, generateRoomId, generateVideoCallLink } from '../../services/smsService';

interface SMSInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  clientPhone: string;
  exchangeId?: string;
  onSuccess?: (videoCallId: string, roomId: string) => void;
}

export default function SMSInviteModal({
  isOpen,
  onClose,
  clientName,
  clientPhone,
  exchangeId,
  onSuccess,
}: SMSInviteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [videoCallLink, setVideoCallLink] = useState('');

  if (!isOpen) return null;

  const handleSendInvite = async () => {
    setLoading(true);
    setError('');

    try {
      const merchantId = '11111111-1111-1111-1111-111111111111';
      const roomId = generateRoomId();
      const link = generateVideoCallLink(roomId);

      // Create video call record
      const { data: videoCall, error: createError } = await supabase
        .from('video_calls')
        .insert({
          exchange_id: exchangeId || null,
          merchant_id: merchantId,
          client_phone: clientPhone,
          client_name: clientName,
          room_id: roomId,
          status: 'pending',
          max_duration_seconds: 300,
          recording_consent: false,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Send SMS
      const smsResult = await sendVideoCallInviteSMS({
        clientPhone,
        clientName,
        videoCallLink: link,
        videoCallId: videoCall.id,
      });

      if (!smsResult.success) {
        throw new Error(smsResult.message);
      }

      setVideoCallLink(link);
      setSuccess(true);

      if (onSuccess) {
        onSuccess(videoCall.id, roomId);
      }
    } catch (err: any) {
      console.error('Error sending invite:', err);
      setError(err.message || 'Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setVideoCallLink('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 rounded-lg">
                <Video className="w-6 h-6 text-sky-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Inviter a un appel video
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {success ? (
            // Success state
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <Send className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Invitation envoyee !
              </h3>
              <p className="text-slate-600 mb-4">
                Un SMS a ete envoye a {clientName}
              </p>
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-slate-500 mb-1">Lien de l'appel:</p>
                <p className="text-sm font-mono text-sky-600 break-all">{videoCallLink}</p>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Consultez la console du navigateur pour voir le SMS simule
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          ) : (
            // Form state
            <>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <User className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Client</p>
                    <p className="font-medium text-slate-900">{clientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Phone className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Telephone</p>
                    <p className="font-medium text-slate-900">{clientPhone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-xs text-amber-600">Duree maximale</p>
                    <p className="font-medium text-amber-700">5 minutes</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-6">
                Un SMS sera envoye au client avec un lien pour rejoindre l'appel video.
                L'appel peut etre enregistre avec le consentement du client.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendInvite}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
                >
                  <Send className="w-5 h-5" />
                  {loading ? 'Envoi...' : 'Envoyer SMS'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
