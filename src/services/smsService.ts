import { supabase } from '../lib/supabase';

interface SendSMSParams {
  clientPhone: string;
  clientName: string;
  videoCallLink: string;
  videoCallId: string;
}

interface SMSResult {
  success: boolean;
  message: string;
  smsLogId?: string;
}

/**
 * Console-based SMS simulation service
 * Logs SMS to console and saves to database
 * Ready to be replaced with real SMS provider (Twilio, Infobip, etc.)
 */
export async function sendVideoCallInviteSMS(params: SendSMSParams): Promise<SMSResult> {
  const { clientPhone, clientName, videoCallLink, videoCallId } = params;

  // Build SMS message
  const messageContent = `Bonjour ${clientName}, vous etes invite a un appel video.
Lien: ${videoCallLink}
Duree max: 5 minutes. L'appel peut etre enregistre.`;

  // Console simulation
  console.log('='.repeat(50));
  console.log('[SMS SIMULATION]');
  console.log('='.repeat(50));
  console.log(`To: ${clientPhone}`);
  console.log(`Message:`);
  console.log(messageContent);
  console.log('='.repeat(50));

  try {
    // Save to database
    const { data: smsLog, error } = await supabase
      .from('sms_logs')
      .insert({
        video_call_id: videoCallId,
        recipient_phone: clientPhone,
        message_content: messageContent,
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving SMS log:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'envoi du SMS',
      };
    }

    // Update video call with SMS sent timestamp
    await supabase
      .from('video_calls')
      .update({ sms_sent_at: new Date().toISOString() })
      .eq('id', videoCallId);

    return {
      success: true,
      message: 'SMS envoye avec succes (simulation)',
      smsLogId: smsLog?.id,
    };
  } catch (error) {
    console.error('SMS service error:', error);
    return {
      success: false,
      message: 'Erreur technique lors de l\'envoi',
    };
  }
}

/**
 * Generate a unique room ID for video calls
 */
export function generateRoomId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `room-${timestamp}-${randomPart}`;
}

/**
 * Generate video call link
 */
export function generateVideoCallLink(roomId: string): string {
  // Use current origin for the link
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  return `${baseUrl}/call/${roomId}`;
}
