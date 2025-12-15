-- =====================================================
-- SWAPP Complete Database Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Add missing columns to MERCHANTS TABLE (if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'merchants' AND column_name = 'address') THEN
    ALTER TABLE merchants ADD COLUMN address TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'merchants' AND column_name = 'city') THEN
    ALTER TABLE merchants ADD COLUMN city TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'merchants' AND column_name = 'postal_code') THEN
    ALTER TABLE merchants ADD COLUMN postal_code TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'merchants' AND column_name = 'country') THEN
    ALTER TABLE merchants ADD COLUMN country TEXT DEFAULT 'Tunisia';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'merchants' AND column_name = 'logo_url') THEN
    ALTER TABLE merchants ADD COLUMN logo_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'merchants' AND column_name = 'primary_color') THEN
    ALTER TABLE merchants ADD COLUMN primary_color TEXT DEFAULT '#f59e0b';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'merchants' AND column_name = 'secondary_color') THEN
    ALTER TABLE merchants ADD COLUMN secondary_color TEXT DEFAULT '#1e293b';
  END IF;
END $$;

-- 2. Add missing columns to EXCHANGES TABLE (if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exchanges' AND column_name = 'bag_id') THEN
    ALTER TABLE exchanges ADD COLUMN bag_id TEXT;
  END IF;
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
    ALTER TABLE exchanges ADD COLUMN settlement_status TEXT DEFAULT 'not_applicable';
  END IF;
END $$;

-- 3. Create DELIVERY_PERSONS TABLE
CREATE TABLE IF NOT EXISTS delivery_persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE delivery_persons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read delivery_persons" ON delivery_persons;
CREATE POLICY "Allow public read delivery_persons" ON delivery_persons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert delivery_persons" ON delivery_persons;
CREATE POLICY "Allow authenticated insert delivery_persons" ON delivery_persons FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update delivery_persons" ON delivery_persons;
CREATE POLICY "Allow authenticated update delivery_persons" ON delivery_persons FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete delivery_persons" ON delivery_persons;
CREATE POLICY "Allow authenticated delete delivery_persons" ON delivery_persons FOR DELETE USING (true);

-- 4. Create DELIVERY_VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS delivery_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_id UUID,
  delivery_person_id UUID,
  status TEXT,
  rejection_reason TEXT,
  bag_id TEXT,
  payment_collected BOOLEAN DEFAULT false,
  amount_collected DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT,
  collection_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE delivery_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read delivery_verifications" ON delivery_verifications;
CREATE POLICY "Allow public read delivery_verifications" ON delivery_verifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert delivery_verifications" ON delivery_verifications;
CREATE POLICY "Allow authenticated insert delivery_verifications" ON delivery_verifications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update delivery_verifications" ON delivery_verifications;
CREATE POLICY "Allow authenticated update delivery_verifications" ON delivery_verifications FOR UPDATE USING (true);

-- 5. Create FINANCIAL_TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_id UUID,
  delivery_person_id UUID,
  merchant_id UUID,
  settlement_id UUID,
  invoice_id UUID,
  transaction_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'TND',
  direction TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  description TEXT,
  reference_code TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_financial_transactions_exchange ON financial_transactions(exchange_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_delivery_person ON financial_transactions(delivery_person_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_created_at ON financial_transactions(created_at DESC);

ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read financial_transactions" ON financial_transactions;
CREATE POLICY "Allow public read financial_transactions" ON financial_transactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert financial_transactions" ON financial_transactions;
CREATE POLICY "Allow authenticated insert financial_transactions" ON financial_transactions FOR INSERT WITH CHECK (true);

-- 6. Create DELIVERY_PERSON_SETTLEMENTS TABLE
CREATE TABLE IF NOT EXISTS delivery_person_settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_person_id UUID NOT NULL,
  settlement_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'TND',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  exchanges_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  confirmed_by UUID,
  confirmed_at TIMESTAMPTZ,
  confirmation_notes TEXT,
  receipt_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settlements_delivery_person ON delivery_person_settlements(delivery_person_id);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON delivery_person_settlements(status);

ALTER TABLE delivery_person_settlements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read delivery_person_settlements" ON delivery_person_settlements;
CREATE POLICY "Allow public read delivery_person_settlements" ON delivery_person_settlements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert delivery_person_settlements" ON delivery_person_settlements;
CREATE POLICY "Allow authenticated insert delivery_person_settlements" ON delivery_person_settlements FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update delivery_person_settlements" ON delivery_person_settlements;
CREATE POLICY "Allow authenticated update delivery_person_settlements" ON delivery_person_settlements FOR UPDATE USING (true);

-- 7. Create WEEKLY_INVOICES TABLE
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
  status TEXT DEFAULT 'draft',
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

CREATE INDEX IF NOT EXISTS idx_invoices_status ON weekly_invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_period ON weekly_invoices(year DESC, week_number DESC);

ALTER TABLE weekly_invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read weekly_invoices" ON weekly_invoices;
CREATE POLICY "Allow public read weekly_invoices" ON weekly_invoices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert weekly_invoices" ON weekly_invoices;
CREATE POLICY "Allow authenticated insert weekly_invoices" ON weekly_invoices FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update weekly_invoices" ON weekly_invoices;
CREATE POLICY "Allow authenticated update weekly_invoices" ON weekly_invoices FOR UPDATE USING (true);

-- 8. Create INVOICE_LINE_ITEMS TABLE
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES weekly_invoices(id) ON DELETE CASCADE,
  line_type TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  exchange_id UUID,
  delivery_person_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_line_items_invoice ON invoice_line_items(invoice_id);

ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read invoice_line_items" ON invoice_line_items;
CREATE POLICY "Allow public read invoice_line_items" ON invoice_line_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert invoice_line_items" ON invoice_line_items;
CREATE POLICY "Allow authenticated insert invoice_line_items" ON invoice_line_items FOR INSERT WITH CHECK (true);

-- 9. Insert demo delivery person
INSERT INTO delivery_persons (email, name, phone)
VALUES ('demo@livreur.com', 'Livreur Demo', '+216 99 999 999')
ON CONFLICT (email) DO NOTHING;

-- Done!
SELECT 'SWAPP database schema updated successfully!' as status;
