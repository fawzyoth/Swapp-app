import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Merchant = {
  id: string;
  email: string;
  name: string;
  phone: string;
  qr_code_data?: string;
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

export type DeliveryPerson = {
  id: string;
  email: string;
  name: string;
  phone: string;
  created_at: string;
};

export type DeliveryVerification = {
  id: string;
  exchange_id: string;
  delivery_person_id: string;
  status: "accepted" | "rejected";
  rejection_reason?: string;
  bag_id?: string;
  created_at: string;
};

export const EXCHANGE_STATUSES = {
  PENDING: "pending",
  VALIDATED: "validated",
  PREPARING: "preparing",
  IN_TRANSIT: "in_transit",
  DELIVERY_VERIFIED: "delivery_verified",
  DELIVERY_REJECTED: "delivery_rejected",
  COMPLETED: "completed",
  RETURNED: "returned",
  REJECTED: "rejected",
} as const;

export const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  validated: "Validé",
  preparing: "Préparation mini-dépôt",
  in_transit: "En route",
  delivery_verified: "Vérifié par livreur",
  delivery_rejected: "Refusé par livreur",
  completed: "Échange effectué",
  returned: "Produit retourné",
  rejected: "Rejeté",
};
