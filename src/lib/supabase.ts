import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xlwznudjklezjkitzqeg.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsd3pudWRqa2xlempraXR6cWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NTg5MDAsImV4cCI6MjA4MTEzNDkwMH0.jKCxu7hTM50bcGqM-Cbi4KTM1QS_N12MoUmo3ib_aEA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      "x-client-info": "swapp-web",
    },
  },
  db: {
    schema: "public",
  },
});

export type Merchant = {
  id: string;
  email: string;
  name: string;
  phone: string;
  qr_code_data?: string;
  logo_base64?: string;
  business_name?: string;
  business_address?: string;
  business_city?: string;
  business_postal_code?: string;
  platform_fee?: number; // Custom SWAPP fee per exchange (default: 9 TND)
  delivery_fee?: number; // Custom delivery fee per exchange (default: 5 TND)
  jax_token?: string; // JAX Delivery API token for bordereau generation
  created_at: string;
};

export type MerchantBordereau = {
  id: string;
  merchant_id: string;
  bordereau_code: string;
  status: "available" | "assigned" | "used";
  exchange_id?: string;
  printed_at?: string;
  assigned_at?: string;
  used_at?: string;
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
  images?: string[];
  video?: string;
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



// Review System Types
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
  video_url?: string;
  created_at: string;
};

// Video Call Types
export type VideoCallStatus = 'pending' | 'active' | 'completed' | 'expired' | 'cancelled';

export type VideoCall = {
  id: string;
  exchange_id?: string;
  merchant_id?: string;
  client_phone: string;
  client_name: string;
  room_id: string;
  status: VideoCallStatus;
  max_duration_seconds: number;
  started_at?: string;
  ended_at?: string;
  duration_seconds?: number;
  recording_url?: string;
  recording_consent: boolean;
  sms_sent_at?: string;
  created_at: string;
};

// SMS Log Types
export type SMSLogStatus = 'pending' | 'sent' | 'delivered' | 'failed';

export type SMSLog = {
  id: string;
  video_call_id?: string;
  recipient_phone: string;
  message_content: string;
  status: SMSLogStatus;
  sent_at?: string;
  created_at: string;
};

export const VIDEO_CALL_STATUS_LABELS: Record<VideoCallStatus, string> = {
  pending: 'En attente',
  active: 'En cours',
  completed: 'Terminé',
  expired: 'Expiré',
  cancelled: 'Annulé',
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
  payment_collected?: boolean;
  amount_collected?: number;
  payment_method?: "cash" | "card" | "mobile_payment" | "other";
  collection_notes?: string;
  created_at: string;
};

// Financial Transaction Types
export type TransactionType =
  | "collection_from_client"
  | "settlement_to_partner"
  | "settlement_to_admin"
  | "merchant_charge"
  | "refund_to_client"
  | "fee_deduction"
  | "invoice_generated"
  | "invoice_paid"
  | "adjustment";

export type TransactionStatus =
  | "pending"
  | "completed"
  | "cancelled"
  | "disputed";

export type FinancialTransaction = {
  id: string;
  exchange_id?: string;
  delivery_person_id?: string;
  merchant_id?: string;
  settlement_id?: string;
  invoice_id?: string;
  transaction_type: TransactionType;
  amount: number;
  currency: string;
  direction: "credit" | "debit";
  status: TransactionStatus;
  description?: string;
  reference_code?: string;
  created_by?: string;
  created_at: string;
  metadata?: Record<string, unknown>;
};

// Settlement Types
export type SettlementType =
  | "to_delivery_partner"
  | "to_admin"
  | "bank_transfer";
export type SettlementStatus =
  | "pending"
  | "confirmed"
  | "disputed"
  | "cancelled";

export type DeliveryPersonSettlement = {
  id: string;
  delivery_person_id: string;
  settlement_type: SettlementType;
  amount: number;
  currency: string;
  period_start: string;
  period_end: string;
  exchanges_count: number;
  status: SettlementStatus;
  confirmed_by?: string;
  confirmed_at?: string;
  confirmation_notes?: string;
  receipt_reference?: string;
  created_at: string;
};

// Invoice Types
export type InvoiceStatus =
  | "draft"
  | "generated"
  | "sent"
  | "paid"
  | "disputed"
  | "cancelled";

export type WeeklyInvoice = {
  id: string;
  invoice_number: string;
  week_number: number;
  year: number;
  period_start: string;
  period_end: string;
  total_exchanges_handled: number;
  total_amount_collected: number;
  total_fees: number;
  total_commissions: number;
  net_payable: number;
  delivery_person_breakdown?: DeliveryPersonBreakdown[];
  status: InvoiceStatus;
  payment_due_date?: string;
  paid_at?: string;
  paid_amount?: number;
  payment_reference?: string;
  generated_by?: string;
  generated_at?: string;
  notes?: string;
  created_at: string;
};

export type DeliveryPersonBreakdown = {
  delivery_person_id: string;
  delivery_person_name: string;
  exchanges_handled: number;
  amount_collected: number;
  amount_settled: number;
  pending_settlement: number;
};

export type InvoiceLineItemType =
  | "exchange_handling"
  | "collection_amount"
  | "delivery_fee"
  | "commission"
  | "adjustment"
  | "penalty"
  | "bonus";

export type InvoiceLineItem = {
  id: string;
  invoice_id: string;
  line_type: InvoiceLineItemType;
  description: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  exchange_id?: string;
  delivery_person_id?: string;
  created_at: string;
};

// Financial Summary Types
export type DeliveryPersonFinancialSummary = {
  total_collected: number;
  total_settled: number;
  pending_settlement: number;
  exchanges_with_collection: number;
  last_settlement_date?: string;
};

export type AdminFinancialSummary = {
  total_collected_from_clients: number;
  total_merchant_charges: number;
  total_settled_by_delivery: number;
  total_pending_settlement: number;
  total_transferred_to_partner: number;
  outstanding_from_partner: number;
  current_week_stats: {
    exchanges_count: number;
    amount_collected: number;
    settlements_count: number;
  };
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
  ready_for_pickup: "Prêt pour ramassage",
  preparing: "Préparation mini-dépôt",
  in_transit: "En route",
  delivery_verified: "Vérifié par livreur",
  delivery_rejected: "Refusé par livreur",
  completed: "Échange effectué",
  returned: "Produit retourné",
  rejected: "Rejeté",
};

// ============================================
// MERCHANT PAYMENT SYSTEM
// ============================================

// Fixed exchange fee kept by SWAPP
export const SWAPP_EXCHANGE_FEE = 9; // TND

// Merchant Payment Types
export type MerchantPaymentStatus =
  | "pending"
  | "approved"
  | "paid"
  | "accepted"
  | "disputed";

export type MerchantPayment = {
  id: string;
  merchant_id: string;
  payment_number: string;
  period_number: number; // 1 or 2 (bi-weekly)
  year: number;
  month: number;
  period_start: string;
  period_end: string;
  total_exchanges: number;
  total_collected: number; // Total client payments
  total_swapp_fees: number; // platform_fee × exchanges
  total_delivery_fees: number; // delivery_fee × exchanges
  amount_due: number; // collected - platform_fees - delivery_fees
  status: MerchantPaymentStatus;
  approved_by?: string;
  approved_at?: string;
  paid_at?: string;
  payment_method?: string; // cash only for now
  payment_reference?: string;
  // Merchant acceptance
  merchant_accepted?: boolean;
  merchant_accepted_at?: string;
  dispute_reason?: string;
  notes?: string;
  created_at: string;
  // Joined data
  merchant?: Merchant;
};

// Delivery Deposit - Cash deposit from delivery person to SWAPP
export type DeliveryDepositStatus = "pending" | "confirmed" | "disputed";

export type DeliveryDeposit = {
  id: string;
  deposit_number: string; // DEP-2025-001
  delivery_person_id: string;
  deposit_date: string;
  total_collected: number; // Total collected from clients
  total_exchanges: number; // Number of exchanges
  amount_deposited: number; // Cash deposited at SWAPP office
  discrepancy: number; // collected - deposited (should be 0)
  status: DeliveryDepositStatus;
  received_by?: string; // Admin who received the deposit
  received_at?: string;
  notes?: string;
  created_at: string;
  // Joined data
  delivery_person?: DeliveryPerson;
};

// Delivery Deposit Items - Individual exchanges in a deposit
export type DeliveryDepositItem = {
  id: string;
  deposit_id: string;
  exchange_id: string;
  exchange_code: string;
  merchant_id: string;
  merchant_name?: string;
  amount_collected: number;
  collection_date: string;
  created_at: string;
};

// Default fees
export const DEFAULT_PLATFORM_FEE = 9; // TND
export const DEFAULT_DELIVERY_FEE = 5; // TND

// Get merchant fees (uses custom or default)
export const getMerchantFees = (
  merchant: Merchant,
): { platformFee: number; deliveryFee: number } => {
  return {
    platformFee: merchant.platform_fee ?? DEFAULT_PLATFORM_FEE,
    deliveryFee: merchant.delivery_fee ?? DEFAULT_DELIVERY_FEE,
  };
};

// Calculate merchant payment amount (what merchant receives)
export const calculateMerchantPayment = (
  amountCollected: number,
  platformFee: number,
  deliveryFee: number,
): number => {
  return Math.max(0, amountCollected - platformFee - deliveryFee);
};

export type MerchantPaymentItem = {
  id: string;
  payment_id: string;
  exchange_id: string;
  exchange_code: string;
  client_name: string;
  amount_collected: number; // What client paid
  swapp_fee: number; // Fixed 9 TND
  merchant_amount: number; // collected - 9
  collection_date: string;
  created_at: string;
};

export type MerchantFinancialSummary = {
  total_pending: number;
  total_paid: number;
  current_period_amount: number;
  exchanges_this_period: number;
  last_payment_date?: string;
  last_payment_amount?: number;
};

// Calculate merchant amount from collected amount
export const calculateMerchantAmount = (amountCollected: number): number => {
  return Math.max(0, amountCollected - SWAPP_EXCHANGE_FEE);
};

// Get current bi-weekly period info
export const getCurrentPeriod = (): {
  periodNumber: number;
  year: number;
  month: number;
  start: Date;
  end: Date;
} => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if (day <= 15) {
    // Period 1: 1st - 15th
    return {
      periodNumber: 1,
      year,
      month,
      start: new Date(year, month - 1, 1),
      end: new Date(year, month - 1, 15, 23, 59, 59),
    };
  } else {
    // Period 2: 16th - end of month
    const lastDay = new Date(year, month, 0).getDate();
    return {
      periodNumber: 2,
      year,
      month,
      start: new Date(year, month - 1, 16),
      end: new Date(year, month - 1, lastDay, 23, 59, 59),
    };
  }
};

// Generate payment number: PAY-2025-P24-001 (P = period count from start of year)
export const generatePaymentNumber = (
  year: number,
  month: number,
  periodNumber: number,
  sequence: number,
): string => {
  const periodCount = (month - 1) * 2 + periodNumber;
  return `PAY-${year}-P${periodCount.toString().padStart(2, "0")}-${sequence.toString().padStart(3, "0")}`;
};

// Payment status labels in French
export const PAYMENT_STATUS_LABELS: Record<MerchantPaymentStatus, string> = {
  pending: "En attente",
  approved: "Approuvé",
  paid: "Payé",
  accepted: "Accepté",
  disputed: "Contesté",
};

// Deposit status labels in French
export const DEPOSIT_STATUS_LABELS: Record<DeliveryDepositStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  disputed: "Contesté",
};

// Generate deposit number: DEP-2025-001
export const generateDepositNumber = (sequence: number): string => {
  const year = new Date().getFullYear();
  return `DEP-${year}-${sequence.toString().padStart(3, "0")}`;
};

// ============================================
// FINANCE PLATFORM TYPES
// ============================================

// Delivery Company (for multi-partner support)
export type DeliveryCompany = {
  id: string;
  name: string;
  code: string;
  tax_id?: string;
  address?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  bank_name?: string;
  bank_account?: string;
  bank_rib?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Finance User Roles
export type FinanceUserRole = "admin" | "officer" | "auditor";

export type FinanceUser = {
  id: string;
  email: string;
  name: string;
  role: FinanceUserRole;
  is_active: boolean;
  last_login?: string;
  created_at: string;
};

// Chart of Accounts
export type FinanceAccountType =
  | "asset"
  | "liability"
  | "revenue"
  | "expense"
  | "equity"
  | "suspense";

export type FinanceAccount = {
  id: string;
  code: string;
  name: string;
  name_fr: string;
  type: FinanceAccountType;
  parent_code?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
};

// Wallet (virtual account for each party)
export type WalletOwnerType =
  | "delivery_person"
  | "delivery_company"
  | "merchant"
  | "swapp";

export type WalletType =
  | "merchant"
  | "delivery_person"
  | "delivery_company"
  | "swapp_main"
  | "swapp_fee";

export type FinanceWallet = {
  id: string;
  wallet_number: string;
  wallet_type: WalletType;
  merchant_id?: string;
  delivery_person_id?: string;
  delivery_company_id?: string;
  balance: number;
  pending_in: number;
  pending_out: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Transaction Types
export type FinanceTransactionType =
  | "client_collection"
  | "swapp_fee"
  | "merchant_credit"
  | "dp_to_company"
  | "company_to_swapp"
  | "merchant_payout"
  | "adjustment_credit"
  | "adjustment_debit"
  | "refund";

export type FinanceTransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type FinanceTransaction = {
  id: string;
  transaction_number: string;
  transaction_type: FinanceTransactionType;
  wallet_id?: string;
  from_wallet_id?: string;
  to_wallet_id?: string;
  amount: number;
  currency: string;
  status: FinanceTransactionStatus;
  reference_type?: string;
  reference_id?: string;
  reference?: string;
  exchange_code?: string;
  description?: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  completed_at?: string;
  created_by?: string;
  approved_by?: string;
  approved_at?: string;
  // Joined data
  wallet?: { wallet_number: string; wallet_type: string };
  from_wallet?: FinanceWallet;
  to_wallet?: FinanceWallet;
};

// Ledger Entry (double-entry)
export type LedgerEntryType = "debit" | "credit";

export type FinanceLedgerEntry = {
  id: string;
  transaction_id: string;
  entry_number: number;
  account_code: string;
  entry_type: LedgerEntryType;
  amount: number;
  currency: string;
  balance_after?: number;
  description?: string;
  created_at: string;
};

// Payout
export type PayoutType =
  | "merchant_payout"
  | "delivery_company_payout"
  | "refund"
  | "adjustment";
export type PayoutStatus =
  | "pending"
  | "approved"
  | "processing"
  | "completed"
  | "failed"
  | "rejected"
  | "cancelled";
export type PaymentMethod = "bank_transfer" | "cash" | "check" | "mobile";

export type PayeeType = "merchant" | "delivery_person" | "delivery_company";

export type FinancePayout = {
  id: string;
  payout_number: string;
  payee_type: PayeeType;
  merchant_id?: string;
  delivery_person_id?: string;
  delivery_company_id?: string;
  wallet_id?: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  payment_method?: string;
  payment_reference?: string;
  period_start?: string;
  period_end?: string;
  approved_at?: string;
  approved_by?: string;
  paid_at?: string;
  notes?: string;
  created_at: string;
};

// Invoice
export type InvoiceType = "merchant_fee_invoice" | "delivery_company_statement";
export type InvoiceStatus =
  | "draft"
  | "generated"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled";

export type FinanceInvoice = {
  id: string;
  invoice_number: string;
  invoice_type: InvoiceType;
  recipient_type: string;
  recipient_id: string;
  recipient_name?: string;
  recipient_tax_id?: string;
  recipient_address?: string;
  period_start: string;
  period_end: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  status: InvoiceStatus;
  issue_date?: string;
  due_date?: string;
  paid_at?: string;
  payout_id?: string;
  pdf_url?: string;
  generated_at?: string;
  sent_at?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
};

export type FinanceInvoiceLine = {
  id: string;
  invoice_id: string;
  line_number: number;
  description: string;
  quantity: number;
  unit_price?: number;
  total_amount: number;
  reference_type?: string;
  reference_id?: string;
  exchange_code?: string;
  created_at: string;
};

// Daily Settlement (delivery person → company)
export type DailySettlementStatus =
  | "pending"
  | "confirmed"
  | "disputed"
  | "cancelled";

export type FinanceDailySettlement = {
  id: string;
  settlement_number: string;
  settlement_date: string;
  delivery_person_id: string;
  delivery_company_id?: string;
  total_collected: number;
  total_exchanges: number;
  cash_amount: number;
  card_amount: number;
  mobile_amount: number;
  status: DailySettlementStatus;
  confirmed_by?: string;
  confirmed_at?: string;
  supervisor_name?: string;
  expected_amount?: number;
  actual_amount?: number;
  discrepancy: number;
  discrepancy_reason?: string;
  notes?: string;
  created_at: string;
  // Joined
  delivery_person?: DeliveryPerson;
};

// Reconciliation
export type ReconciliationType = "daily" | "weekly" | "monthly";
export type ReconciliationStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed"
  | "requires_review";

export type FinanceReconciliation = {
  id: string;
  reconciliation_number: string;
  reconciliation_type: ReconciliationType;
  delivery_company_id?: string;
  period_start: string;
  period_end: string;
  status: ReconciliationStatus;
  expected_amount: number;
  actual_amount: number;
  discrepancy_amount: number;
  started_at?: string;
  completed_at?: string;
  completed_by?: string;
  notes?: string;
  created_at: string;
};

// Alerts
export type AlertType =
  | "collection_mismatch"
  | "large_transaction"
  | "unsettled_cash"
  | "duplicate_transaction"
  | "delayed_settlement"
  | "failed_payout"
  | "reconciliation_gap"
  | "unusual_pattern"
  | "manual_review";

export type AlertSeverity = "low" | "medium" | "high" | "critical";
export type AlertStatus =
  | "open"
  | "investigating"
  | "resolved"
  | "dismissed"
  | "escalated";

export type FinanceAlert = {
  id: string;
  alert_number: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  title: string;
  description?: string;
  reference_type?: string;
  reference_id?: string;
  expected_amount?: number;
  actual_amount?: number;
  difference?: number;
  status: AlertStatus;
  assigned_to?: string;
  assigned_at?: string;
  resolved_at?: string;
  resolved_by?: string;
  resolution_type?: string;
  resolution_notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
};

// Audit Log
export type AuditAction =
  | "view"
  | "create"
  | "update"
  | "approve"
  | "reject"
  | "cancel"
  | "adjust"
  | "export"
  | "login"
  | "logout";

export type FinanceAuditLog = {
  id: string;
  timestamp: string;
  user_id?: string;
  user_email?: string;
  user_role?: string;
  action: AuditAction;
  entity_type: string;
  entity_id?: string;
  entity_number?: string;
  old_value?: any;
  new_value?: any;
  changes?: any;
  ip_address?: string;
  user_agent?: string;
  reason?: string;
  session_id?: string;
};

// Finance Dashboard Summary
export type FinanceDashboardSummary = {
  // Wallet totals
  total_merchant_balance: number;
  total_delivery_balance: number;
  total_company_balance: number;
  swapp_balance: number;
  // Today's activity
  today_collections: number;
  today_settlements: number;
  today_payouts: number;
  today_fees: number;
  // Pending items
  pending_settlements: number;
  pending_payouts: number;
  open_alerts: number;
  // Period stats
  period_collections: number;
  period_fees: number;
  period_payouts: number;
};

// Labels
export const TRANSACTION_TYPE_LABELS: Record<FinanceTransactionType, string> = {
  client_collection: "Encaissement Client",
  swapp_fee: "Frais SWAPP",
  merchant_credit: "Crédit Marchand",
  dp_to_company: "Règlement Livreur → Société",
  company_to_swapp: "Dépôt Société → SWAPP",
  merchant_payout: "Paiement Marchand",
  adjustment_credit: "Ajustement Crédit",
  adjustment_debit: "Ajustement Débit",
  refund: "Remboursement",
};

export const TRANSACTION_STATUS_LABELS: Record<
  FinanceTransactionStatus,
  string
> = {
  pending: "En attente",
  processing: "En cours",
  completed: "Terminé",
  failed: "Échoué",
  cancelled: "Annulé",
};

export const PAYOUT_STATUS_LABELS: Record<PayoutStatus, string> = {
  pending: "En attente",
  approved: "Approuvé",
  processing: "En cours",
  completed: "Payé",
  failed: "Échoué",
  rejected: "Rejeté",
  cancelled: "Annulé",
};

export const ALERT_SEVERITY_LABELS: Record<AlertSeverity, string> = {
  low: "Faible",
  medium: "Moyen",
  high: "Élevé",
  critical: "Critique",
};

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  open: "Ouvert",
  investigating: "En investigation",
  resolved: "Résolu",
  dismissed: "Ignoré",
  escalated: "Escaladé",
};

export const RECONCILIATION_STATUS_LABELS: Record<
  ReconciliationStatus,
  string
> = {
  pending: "En attente",
  in_progress: "En cours",
  completed: "Terminé",
  failed: "Échoué",
  requires_review: "À vérifier",
};

export const WALLET_TYPE_LABELS: Record<string, string> = {
  merchant: "Marchand",
  delivery_person: "Livreur",
  delivery_company: "Société Livraison",
  swapp_main: "SWAPP Principal",
  swapp_fee: "SWAPP Commissions",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: "Virement Bancaire",
  cash: "Espèces",
  check: "Chèque",
  mobile: "Paiement Mobile",
};

// Aliases for component imports
export const walletTypeLabels = WALLET_TYPE_LABELS;
export const transactionTypeLabels = TRANSACTION_TYPE_LABELS;
export const transactionStatusLabels = TRANSACTION_STATUS_LABELS;
export const payoutStatusLabels = PAYOUT_STATUS_LABELS;
export const paymentMethodLabels = PAYMENT_METHOD_LABELS;
export const alertSeverityLabels = ALERT_SEVERITY_LABELS;
export const alertStatusLabels = ALERT_STATUS_LABELS;
export const reconciliationStatusLabels = RECONCILIATION_STATUS_LABELS;
