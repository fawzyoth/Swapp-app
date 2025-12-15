-- ============================================
-- SWAPP Financial Platform - Database Schema
-- ============================================

-- 1. Delivery Companies (for multi-partner support)
CREATE TABLE IF NOT EXISTS delivery_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL, -- Short code like 'EXP', 'RAP'
  tax_id TEXT,
  address TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  bank_name TEXT,
  bank_account TEXT,
  bank_rib TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link delivery persons to companies
ALTER TABLE delivery_persons ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES delivery_companies(id);

-- 2. Finance Users (separate from operational users)
CREATE TABLE IF NOT EXISTS finance_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'officer', 'auditor')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Chart of Accounts
CREATE TABLE IF NOT EXISTS finance_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('asset', 'liability', 'revenue', 'expense', 'equity', 'suspense')),
  parent_code TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default chart of accounts
INSERT INTO finance_accounts (code, name, name_fr, type, description) VALUES
  ('1000', 'Client Escrow', 'Compte Séquestre Client', 'liability', 'Money held from clients'),
  ('1100', 'Delivery Person Wallet', 'Portefeuille Livreur', 'liability', 'Owed to delivery persons'),
  ('1200', 'Merchant Wallet', 'Portefeuille Marchand', 'liability', 'Owed to merchants'),
  ('1300', 'Delivery Company Wallet', 'Portefeuille Société Livraison', 'liability', 'Owed to delivery companies'),
  ('2000', 'SWAPP Operating', 'Compte Exploitation SWAPP', 'asset', 'Operating account'),
  ('2100', 'SWAPP Bank', 'Compte Bancaire SWAPP', 'asset', 'Bank account'),
  ('3000', 'Exchange Fee Revenue', 'Revenus Frais Échange', 'revenue', '9 TND per exchange'),
  ('3100', 'Commission Revenue', 'Revenus Commissions', 'revenue', 'Other commissions'),
  ('4000', 'Delivery Cost', 'Coût Livraison', 'expense', 'Paid to delivery partners'),
  ('9000', 'Suspense Account', 'Compte Attente', 'suspense', 'Unreconciled amounts')
ON CONFLICT (code) DO NOTHING;

-- 4. Wallets (virtual accounts for each party)
CREATE TABLE IF NOT EXISTS finance_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL CHECK (owner_type IN (
    'delivery_person', 'delivery_company', 'merchant', 'swapp'
  )),
  owner_id UUID, -- NULL for SWAPP main wallet
  owner_name TEXT, -- Cached for display
  balance DECIMAL(12,2) DEFAULT 0,
  pending_in DECIMAL(12,2) DEFAULT 0,
  pending_out DECIMAL(12,2) DEFAULT 0,
  total_collected DECIMAL(12,2) DEFAULT 0,
  total_paid_out DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'TND',
  is_active BOOLEAN DEFAULT true,
  last_transaction_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(owner_type, owner_id)
);

-- Create SWAPP main wallet
INSERT INTO finance_wallets (owner_type, owner_id, owner_name)
VALUES ('swapp', NULL, 'SWAPP Platform')
ON CONFLICT (owner_type, owner_id) DO NOTHING;

-- 5. Financial Transactions (high-level view)
CREATE TABLE IF NOT EXISTS finance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_number TEXT UNIQUE NOT NULL, -- TXN-2025-001234
  transaction_type TEXT NOT NULL CHECK (transaction_type IN (
    'client_collection',    -- Client pays delivery person
    'swapp_fee',            -- SWAPP takes 9 TND fee
    'merchant_credit',      -- Amount credited to merchant
    'dp_to_company',        -- Delivery person settles with company
    'company_to_swapp',     -- Company deposits to SWAPP bank
    'merchant_payout',      -- SWAPP pays merchant
    'adjustment_credit',    -- Manual credit adjustment
    'adjustment_debit',     -- Manual debit adjustment
    'refund'                -- Refund to client
  )),
  from_wallet_id UUID REFERENCES finance_wallets(id),
  to_wallet_id UUID REFERENCES finance_wallets(id),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'TND',
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'completed', 'failed', 'cancelled'
  )),
  -- Reference to source record
  reference_type TEXT, -- 'exchange', 'settlement', 'payout', 'invoice'
  reference_id UUID,
  exchange_code TEXT, -- For easy lookup
  -- Descriptions
  description TEXT,
  notes TEXT,
  -- Metadata
  metadata JSONB DEFAULT '{}',
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  -- Audit
  created_by UUID,
  approved_by UUID,
  approved_at TIMESTAMPTZ
);

-- 6. Double-Entry Ledger
CREATE TABLE IF NOT EXISTS finance_ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES finance_transactions(id) ON DELETE CASCADE,
  entry_number INTEGER NOT NULL, -- 1 for debit, 2 for credit
  account_code TEXT NOT NULL REFERENCES finance_accounts(code),
  entry_type TEXT NOT NULL CHECK (entry_type IN ('debit', 'credit')),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'TND',
  balance_after DECIMAL(12,2), -- Running balance
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Payouts
CREATE TABLE IF NOT EXISTS finance_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_number TEXT UNIQUE NOT NULL, -- PAY-2025-M-001
  payout_type TEXT NOT NULL CHECK (payout_type IN (
    'merchant_payout', 'delivery_company_payout', 'refund', 'adjustment'
  )),
  recipient_type TEXT NOT NULL,
  recipient_id UUID NOT NULL,
  recipient_name TEXT,
  wallet_id UUID REFERENCES finance_wallets(id),
  -- Amount
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'TND',
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved', 'processing', 'completed', 'failed', 'rejected', 'cancelled'
  )),
  -- Payment details
  payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'cash', 'check', 'mobile')),
  bank_name TEXT,
  bank_account TEXT,
  payment_reference TEXT,
  -- Period
  period_start DATE,
  period_end DATE,
  items_count INTEGER DEFAULT 0,
  -- Workflow
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  -- Errors
  failed_at TIMESTAMPTZ,
  failed_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  -- Links
  invoice_id UUID,
  transaction_id UUID REFERENCES finance_transactions(id),
  -- Notes
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Invoices
CREATE TABLE IF NOT EXISTS finance_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL, -- INV-2025-12-M-001
  invoice_type TEXT NOT NULL CHECK (invoice_type IN (
    'merchant_fee_invoice',      -- Invoice to merchant for SWAPP fees
    'delivery_company_statement' -- Statement for delivery company
  )),
  -- Recipient
  recipient_type TEXT NOT NULL,
  recipient_id UUID NOT NULL,
  recipient_name TEXT,
  recipient_tax_id TEXT,
  recipient_address TEXT,
  -- Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  -- Amounts
  subtotal DECIMAL(12,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'TND',
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'generated', 'sent', 'paid', 'overdue', 'cancelled'
  )),
  -- Dates
  issue_date DATE,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  -- Links
  payout_id UUID REFERENCES finance_payouts(id),
  -- Files
  pdf_url TEXT,
  -- Audit
  generated_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);

-- 9. Invoice Line Items
CREATE TABLE IF NOT EXISTS finance_invoice_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES finance_invoices(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(12,2),
  total_amount DECIMAL(12,2) NOT NULL,
  -- Reference
  reference_type TEXT,
  reference_id UUID,
  exchange_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Daily Settlements (delivery person → company)
CREATE TABLE IF NOT EXISTS finance_daily_settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settlement_number TEXT UNIQUE NOT NULL, -- SET-2025-12-15-001
  settlement_date DATE NOT NULL,
  delivery_person_id UUID NOT NULL REFERENCES delivery_persons(id),
  delivery_company_id UUID REFERENCES delivery_companies(id),
  -- Amounts
  total_collected DECIMAL(12,2) NOT NULL,
  total_exchanges INTEGER NOT NULL,
  cash_amount DECIMAL(12,2) DEFAULT 0,
  card_amount DECIMAL(12,2) DEFAULT 0,
  mobile_amount DECIMAL(12,2) DEFAULT 0,
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'disputed', 'cancelled'
  )),
  -- Verification
  confirmed_by UUID,
  confirmed_at TIMESTAMPTZ,
  supervisor_name TEXT,
  -- Discrepancy
  expected_amount DECIMAL(12,2),
  actual_amount DECIMAL(12,2),
  discrepancy DECIMAL(12,2) DEFAULT 0,
  discrepancy_reason TEXT,
  -- Notes
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Reconciliations
CREATE TABLE IF NOT EXISTS finance_reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reconciliation_number TEXT UNIQUE NOT NULL, -- REC-2025-12-15-D
  reconciliation_type TEXT NOT NULL CHECK (reconciliation_type IN (
    'daily', 'weekly', 'monthly'
  )),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'in_progress', 'completed', 'failed', 'requires_review'
  )),
  -- Amounts
  expected_collections DECIMAL(12,2),
  actual_collections DECIMAL(12,2),
  expected_settlements DECIMAL(12,2),
  actual_settlements DECIMAL(12,2),
  expected_fees DECIMAL(12,2),
  actual_fees DECIMAL(12,2),
  -- Discrepancies
  total_discrepancy DECIMAL(12,2) DEFAULT 0,
  discrepancy_items JSONB DEFAULT '[]',
  unmatched_items JSONB DEFAULT '[]',
  -- Audit
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Alerts & Anomalies
CREATE TABLE IF NOT EXISTS finance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_number TEXT UNIQUE NOT NULL, -- ALT-2025-001234
  alert_type TEXT NOT NULL CHECK (alert_type IN (
    'collection_mismatch',
    'large_transaction',
    'unsettled_cash',
    'duplicate_transaction',
    'delayed_settlement',
    'failed_payout',
    'reconciliation_gap',
    'unusual_pattern',
    'manual_review'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  -- Reference
  reference_type TEXT,
  reference_id UUID,
  -- Amounts
  expected_amount DECIMAL(12,2),
  actual_amount DECIMAL(12,2),
  difference DECIMAL(12,2),
  -- Status
  status TEXT DEFAULT 'open' CHECK (status IN (
    'open', 'investigating', 'resolved', 'dismissed', 'escalated'
  )),
  -- Assignment
  assigned_to UUID REFERENCES finance_users(id),
  assigned_at TIMESTAMPTZ,
  -- Resolution
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES finance_users(id),
  resolution_type TEXT,
  resolution_notes TEXT,
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Audit Log
CREATE TABLE IF NOT EXISTS finance_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID,
  user_email TEXT,
  user_role TEXT,
  action TEXT NOT NULL CHECK (action IN (
    'view', 'create', 'update', 'approve', 'reject',
    'cancel', 'adjust', 'export', 'login', 'logout'
  )),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  entity_number TEXT, -- Human-readable number
  old_value JSONB,
  new_value JSONB,
  changes JSONB, -- Summary of what changed
  ip_address TEXT,
  user_agent TEXT,
  reason TEXT,
  session_id TEXT
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_finance_wallets_owner ON finance_wallets(owner_type, owner_id);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_type ON finance_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_status ON finance_transactions(status);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_date ON finance_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_ref ON finance_transactions(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_finance_ledger_txn ON finance_ledger_entries(transaction_id);
CREATE INDEX IF NOT EXISTS idx_finance_ledger_account ON finance_ledger_entries(account_code);
CREATE INDEX IF NOT EXISTS idx_finance_payouts_status ON finance_payouts(status);
CREATE INDEX IF NOT EXISTS idx_finance_payouts_recipient ON finance_payouts(recipient_type, recipient_id);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_recipient ON finance_invoices(recipient_type, recipient_id);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_status ON finance_invoices(status);
CREATE INDEX IF NOT EXISTS idx_finance_alerts_status ON finance_alerts(status);
CREATE INDEX IF NOT EXISTS idx_finance_alerts_severity ON finance_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_finance_audit_entity ON finance_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_finance_audit_user ON finance_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_finance_audit_time ON finance_audit_log(timestamp);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE finance_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_daily_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_companies ENABLE ROW LEVEL SECURITY;

-- Allow all access (will be restricted in production)
CREATE POLICY "Allow all on finance_wallets" ON finance_wallets FOR ALL USING (true);
CREATE POLICY "Allow all on finance_transactions" ON finance_transactions FOR ALL USING (true);
CREATE POLICY "Allow all on finance_ledger_entries" ON finance_ledger_entries FOR ALL USING (true);
CREATE POLICY "Allow all on finance_payouts" ON finance_payouts FOR ALL USING (true);
CREATE POLICY "Allow all on finance_invoices" ON finance_invoices FOR ALL USING (true);
CREATE POLICY "Allow all on finance_invoice_lines" ON finance_invoice_lines FOR ALL USING (true);
CREATE POLICY "Allow all on finance_daily_settlements" ON finance_daily_settlements FOR ALL USING (true);
CREATE POLICY "Allow all on finance_reconciliations" ON finance_reconciliations FOR ALL USING (true);
CREATE POLICY "Allow all on finance_alerts" ON finance_alerts FOR ALL USING (true);
CREATE POLICY "Allow all on finance_audit_log" ON finance_audit_log FOR ALL USING (true);
CREATE POLICY "Allow all on finance_users" ON finance_users FOR ALL USING (true);
CREATE POLICY "Allow all on finance_accounts" ON finance_accounts FOR ALL USING (true);
CREATE POLICY "Allow all on delivery_companies" ON delivery_companies FOR ALL USING (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Generate transaction number
CREATE OR REPLACE FUNCTION generate_transaction_number()
RETURNS TEXT AS $$
DECLARE
  seq INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(transaction_number FROM 10) AS INTEGER)), 0) + 1
  INTO seq
  FROM finance_transactions
  WHERE transaction_number LIKE 'TXN-' || TO_CHAR(NOW(), 'YYYY') || '-%';

  RETURN 'TXN-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Generate payout number
CREATE OR REPLACE FUNCTION generate_payout_number(p_type TEXT)
RETURNS TEXT AS $$
DECLARE
  seq INTEGER;
  prefix TEXT;
BEGIN
  prefix := CASE
    WHEN p_type = 'merchant_payout' THEN 'M'
    WHEN p_type = 'delivery_company_payout' THEN 'D'
    ELSE 'X'
  END;

  SELECT COALESCE(MAX(CAST(SUBSTRING(payout_number FROM 14) AS INTEGER)), 0) + 1
  INTO seq
  FROM finance_payouts
  WHERE payout_number LIKE 'PAY-' || TO_CHAR(NOW(), 'YYYY-MM') || '-' || prefix || '-%';

  RETURN 'PAY-' || TO_CHAR(NOW(), 'YYYY-MM') || '-' || prefix || '-' || LPAD(seq::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number(i_type TEXT)
RETURNS TEXT AS $$
DECLARE
  seq INTEGER;
  prefix TEXT;
BEGIN
  prefix := CASE
    WHEN i_type = 'merchant_fee_invoice' THEN 'M'
    WHEN i_type = 'delivery_company_statement' THEN 'D'
    ELSE 'X'
  END;

  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 14) AS INTEGER)), 0) + 1
  INTO seq
  FROM finance_invoices
  WHERE invoice_number LIKE 'INV-' || TO_CHAR(NOW(), 'YYYY-MM') || '-' || prefix || '-%';

  RETURN 'INV-' || TO_CHAR(NOW(), 'YYYY-MM') || '-' || prefix || '-' || LPAD(seq::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Generate alert number
CREATE OR REPLACE FUNCTION generate_alert_number()
RETURNS TEXT AS $$
DECLARE
  seq INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(alert_number FROM 10) AS INTEGER)), 0) + 1
  INTO seq
  FROM finance_alerts
  WHERE alert_number LIKE 'ALT-' || TO_CHAR(NOW(), 'YYYY') || '-%';

  RETURN 'ALT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;
