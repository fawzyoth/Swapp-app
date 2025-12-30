import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Merchant = {
  id: string;
  email: string;
  name: string;
  phone: string;
  created_at: string;
};

export type MiniDepot = {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  created_at: string;
};

export type Transporter = {
  id: string;
  name: string;
  phone: string;
  created_at: string;
};

export type Exchange = {
  id: string;
  exchange_code: string;
  merchant_id: string;
  client_name: string;
  client_phone: string;
  reason: string;
  status: string;
  photos: string[];
  mini_depot_id?: string;
  transporter_id?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  exchange_id: string;
  sender_type: "client" | "merchant";
  message: string;
  created_at: string;
};

export type StatusHistory = {
  id: string;
  exchange_id: string;
  status: string;
  created_at: string;
};

export const EXCHANGE_STATUSES = {
  PENDING: "pending",
  VALIDATED: "validated",
  PREPARING: "preparing",
  IN_TRANSIT: "in_transit",
  COMPLETED: "completed",
  RETURNED: "returned",
  REJECTED: "rejected",
} as const;

export const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  validated: "Validé",
  preparing: "Préparation mini-dépôt",
  in_transit: "En route",
  completed: "Échange effectué",
  returned: "Produit retourné",
  rejected: "Rejeté",
};

// Review types
export type Review = {
  id: string;
  exchange_code?: string;
  client_name: string;
  client_phone: string;
  merchant_id?: string;
  rating: number;
  comment?: string;
  is_published: boolean;
  merchant_response?: string;
  merchant_response_at?: string;
  created_at: string;
};

// Video Call types
export type VideoCall = {
  id: string;
  exchange_id?: string;
  merchant_id?: string;
  client_phone: string;
  client_name: string;
  room_id: string;
  status: "pending" | "active" | "completed" | "expired" | "cancelled";
  max_duration_seconds: number;
  started_at?: string;
  ended_at?: string;
  duration_seconds?: number;
  recording_url?: string;
  recording_consent: boolean;
  sms_sent_at?: string;
  created_at: string;
};

// SMS Log types
export type SMSLog = {
  id: string;
  video_call_id?: string;
  recipient_phone: string;
  message_content: string;
  status: "pending" | "sent" | "delivered" | "failed";
  sent_at?: string;
  created_at: string;
};

// Video Call status labels
export const VIDEO_CALL_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  active: "En cours",
  completed: "Terminé",
  expired: "Expiré",
  cancelled: "Annulé",
};
