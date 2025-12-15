-- =====================================================
-- SWAPP Financial System Migration
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Add financial columns to exchanges table (if not exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exchanges' AND column_name = 'amount_collected') THEN
    ALTER TABLE exchanges ADD COLUMN amount_collected DECIMAL(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exchanges' AND column_name = 'collection_date') THEN
    ALTER TABLE exchanges ADD COLUMN collection_date TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exchanges' AND column_name = 'collected_by') THEN
    ALTER TABLE exchanges ADD COLUMN collected_by UUID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exchanges' AND column_name = 'settlement_status') THEN
    ALTER TABLE exchanges ADD COLUMN settlement_status TEXT DEFAULT 'not_applicable'
      CHECK (settlement_status IN ('not_applicable', 'pending_settlement', 'settled', 'disputed'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exchanges' AND column_name = 'bag_id') THEN
    ALTER TABLE exchanges ADD COLUMN bag_id TEXT;
  END IF;
END $$;

-- 2. Create delivery_verifications table (stores payment collection info)
CREATE TABLE IF NOT EXISTS delivery_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_id UUID REFERENCES exchanges(id) ON DELETE CASCADE,
  delivery_person_id UUID,
  status TEXT CHECK (status IN ('accepted', 'rejected')),
  rejection_reason TEXT,
  bag_id TEXT,
  payment_collected BOOLEAN DEFAULT false,
  amount_collected DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'mobile_payment', 'other')),
  collection_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE delivery_verifications ENABLE ROW LEVEL SECURITY;

-- Policies for delivery_verifications
DROP POLICY IF EXISTS "Allow public read delivery_verifications" ON delivery_verifications;
CREATE POLICY "Allow public read delivery_verifications" ON delivery_verifications
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert delivery_verifications" ON delivery_verifications;
CREATE POLICY "Allow authenticated insert delivery_verifications" ON delivery_verifications
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update delivery_verifications" ON delivery_verifications;
CREATE POLICY "Allow authenticated update delivery_verifications" ON delivery_verifications
  FOR UPDATE USING (true);

-- 3. Create financial_transactions table
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_id UUID REFERENCES exchanges(id) ON DELETE SET NULL,
  delivery_person_id UUID,
  merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
  settlement_id UUID,
  invoice_id UUID,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN (
    'collection_from_client',
    'settlement_to_partner',
    'settlement_to_admin',
    'merchant_charge',
    'refund_to_client',
    'fee_deduction',
    'invoice_generated',
    'invoice_paid',
    'adjustment'
  )),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'TND',
  direction TEXT NOT NULL CHECK (direction IN ('credit', 'debit')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled', 'disputed')),
  description TEXT,
  reference_code TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Indexes for financial_transactions
CREATE INDEX IF NOT EXISTS idx_financial_transactions_exchange ON financial_transactions(exchange_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_delivery_person ON financial_transactions(delivery_person_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_created_at ON financial_transactions(created_at DESC);

-- Enable RLS
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for financial_transactions
DROP POLICY IF EXISTS "Allow public read financial_transactions" ON financial_transactions;
CREATE POLICY "Allow public read financial_transactions" ON financial_transactions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert financial_transactions" ON financial_transactions;
CREATE POLICY "Allow authenticated insert financial_transactions" ON financial_transactions
  FOR INSERT WITH CHECK (true);

-- 4. Create delivery_person_settlements table
CREATE TABLE IF NOT EXISTS delivery_person_settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_person_id UUID NOT NULL,
  settlement_type TEXT NOT NULL CHECK (settlement_type IN ('to_delivery_partner', 'to_admin', 'bank_transfer')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'TND',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  exchanges_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'disputed', 'cancelled')),
  confirmed_by UUID,
  confirmed_at TIMESTAMPTZ,
  confirmation_notes TEXT,
  receipt_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_settlements_delivery_person ON delivery_person_settlements(delivery_person_id);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON delivery_person_settlements(status);

-- Enable RLS
ALTER TABLE delivery_person_settlements ENABLE ROW LEVEL SECURITY;

-- Policies for delivery_person_settlements
DROP POLICY IF EXISTS "Allow public read delivery_person_settlements" ON delivery_person_settlements;
CREATE POLICY "Allow public read delivery_person_settlements" ON delivery_person_settlements
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert delivery_person_settlements" ON delivery_person_settlements;
CREATE POLICY "Allow authenticated insert delivery_person_settlements" ON delivery_person_settlements
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update delivery_person_settlements" ON delivery_person_settlements;
CREATE POLICY "Allow authenticated update delivery_person_settlements" ON delivery_person_settlements
  FOR UPDATE USING (true);

-- 5. Create weekly_invoices table
CREATE TABLE IF NOT EXISTS weekly_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_exchanges_handled INTEGER DEFAULT 0,
  total_amount_collected DECIMAL(10,2) DEFAULT 0,
  total_fees DECIMAL(10,2) DEFAULT 0,
  total_commissions DECIMAL(10,2) DEFAULT 0,
  net_payable DECIMAL(10,2) DEFAULT 0,
  delivery_person_breakdown JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'sent', 'paid', 'disputed', 'cancelled')),
  payment_due_date DATE,
  paid_at TIMESTAMPTZ,
  paid_amount DECIMAL(10,2),
  payment_reference TEXT,
  generated_by UUID,
  generated_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(year, week_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_status ON weekly_invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_period ON weekly_invoices(year DESC, week_number DESC);

-- Enable RLS
ALTER TABLE weekly_invoices ENABLE ROW LEVEL SECURITY;

-- Policies for weekly_invoices
DROP POLICY IF EXISTS "Allow public read weekly_invoices" ON weekly_invoices;
CREATE POLICY "Allow public read weekly_invoices" ON weekly_invoices
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert weekly_invoices" ON weekly_invoices;
CREATE POLICY "Allow authenticated insert weekly_invoices" ON weekly_invoices
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update weekly_invoices" ON weekly_invoices;
CREATE POLICY "Allow authenticated update weekly_invoices" ON weekly_invoices
  FOR UPDATE USING (true);

-- 6. Create invoice_line_items table
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES weekly_invoices(id) ON DELETE CASCADE,
  line_type TEXT NOT NULL CHECK (line_type IN ('exchange_handling', 'collection_amount', 'delivery_fee', 'commission', 'adjustment', 'penalty', 'bonus')),
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  exchange_id UUID REFERENCES exchanges(id) ON DELETE SET NULL,
  delivery_person_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_line_items_invoice ON invoice_line_items(invoice_id);

-- Enable RLS
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;

-- Policies for invoice_line_items
DROP POLICY IF EXISTS "Allow public read invoice_line_items" ON invoice_line_items;
CREATE POLICY "Allow public read invoice_line_items" ON invoice_line_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert invoice_line_items" ON invoice_line_items;
CREATE POLICY "Allow authenticated insert invoice_line_items" ON invoice_line_items
  FOR INSERT WITH CHECK (true);

-- Done!
SELECT 'Financial system tables created successfully!' as status;
