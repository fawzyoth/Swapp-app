-- =====================================================
-- SWAPP Fresh Database Schema
-- Run this in Supabase SQL Editor
-- Creates ALL tables from scratch
-- =====================================================

-- 1. MERCHANTS TABLE
CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Tunisia',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#f59e0b',
  secondary_color TEXT DEFAULT '#1e293b',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "merchants_select" ON merchants;
DROP POLICY IF EXISTS "merchants_insert" ON merchants;
DROP POLICY IF EXISTS "merchants_update" ON merchants;
DROP POLICY IF EXISTS "merchants_delete" ON merchants;
CREATE POLICY "merchants_select" ON merchants FOR SELECT USING (true);
CREATE POLICY "merchants_insert" ON merchants FOR INSERT WITH CHECK (true);
CREATE POLICY "merchants_update" ON merchants FOR UPDATE USING (true);
CREATE POLICY "merchants_delete" ON merchants FOR DELETE USING (true);

-- 2. DELIVERY_PERSONS TABLE
CREATE TABLE IF NOT EXISTS delivery_persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE delivery_persons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "delivery_persons_select" ON delivery_persons;
DROP POLICY IF EXISTS "delivery_persons_insert" ON delivery_persons;
DROP POLICY IF EXISTS "delivery_persons_update" ON delivery_persons;
DROP POLICY IF EXISTS "delivery_persons_delete" ON delivery_persons;
CREATE POLICY "delivery_persons_select" ON delivery_persons FOR SELECT USING (true);
CREATE POLICY "delivery_persons_insert" ON delivery_persons FOR INSERT WITH CHECK (true);
CREATE POLICY "delivery_persons_update" ON delivery_persons FOR UPDATE USING (true);
CREATE POLICY "delivery_persons_delete" ON delivery_persons FOR DELETE USING (true);

-- 3. EXCHANGES TABLE
CREATE TABLE IF NOT EXISTS exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_code TEXT UNIQUE NOT NULL,
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  client_address TEXT,
  client_city TEXT,
  client_postal_code TEXT,
  client_country TEXT DEFAULT 'Tunisia',
  product_name TEXT,
  reason TEXT,
  video TEXT,
  photos TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  bag_id TEXT,
  amount_collected DECIMAL(10,2) DEFAULT 0,
  collection_date TIMESTAMPTZ,
  collected_by UUID,
  settlement_status TEXT DEFAULT 'not_applicable',
  transporter_id UUID,
  mini_depot_id UUID,
  bordereau_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE exchanges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "exchanges_select" ON exchanges;
DROP POLICY IF EXISTS "exchanges_insert" ON exchanges;
DROP POLICY IF EXISTS "exchanges_update" ON exchanges;
DROP POLICY IF EXISTS "exchanges_delete" ON exchanges;
CREATE POLICY "exchanges_select" ON exchanges FOR SELECT USING (true);
CREATE POLICY "exchanges_insert" ON exchanges FOR INSERT WITH CHECK (true);
CREATE POLICY "exchanges_update" ON exchanges FOR UPDATE USING (true);
CREATE POLICY "exchanges_delete" ON exchanges FOR DELETE USING (true);

-- 4. STATUS_HISTORY TABLE
CREATE TABLE IF NOT EXISTS status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_id UUID REFERENCES exchanges(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "status_history_select" ON status_history;
DROP POLICY IF EXISTS "status_history_insert" ON status_history;
CREATE POLICY "status_history_select" ON status_history FOR SELECT USING (true);
CREATE POLICY "status_history_insert" ON status_history FOR INSERT WITH CHECK (true);

-- 5. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_id UUID REFERENCES exchanges(id) ON DELETE CASCADE,
  sender_type TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "messages_select" ON messages;
DROP POLICY IF EXISTS "messages_insert" ON messages;
CREATE POLICY "messages_select" ON messages FOR SELECT USING (true);
CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (true);

-- 6. TRANSPORTERS TABLE
CREATE TABLE IF NOT EXISTS transporters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transporters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "transporters_select" ON transporters;
DROP POLICY IF EXISTS "transporters_insert" ON transporters;
CREATE POLICY "transporters_select" ON transporters FOR SELECT USING (true);
CREATE POLICY "transporters_insert" ON transporters FOR INSERT WITH CHECK (true);

-- 7. MINI_DEPOTS TABLE
CREATE TABLE IF NOT EXISTS mini_depots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mini_depots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mini_depots_select" ON mini_depots;
DROP POLICY IF EXISTS "mini_depots_insert" ON mini_depots;
CREATE POLICY "mini_depots_select" ON mini_depots FOR SELECT USING (true);
CREATE POLICY "mini_depots_insert" ON mini_depots FOR INSERT WITH CHECK (true);

-- 8. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "clients_select" ON clients;
DROP POLICY IF EXISTS "clients_insert" ON clients;
DROP POLICY IF EXISTS "clients_update" ON clients;
CREATE POLICY "clients_select" ON clients FOR SELECT USING (true);
CREATE POLICY "clients_insert" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "clients_update" ON clients FOR UPDATE USING (true);

-- 9. DELIVERY_VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS delivery_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_id UUID REFERENCES exchanges(id) ON DELETE CASCADE,
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
DROP POLICY IF EXISTS "delivery_verifications_select" ON delivery_verifications;
DROP POLICY IF EXISTS "delivery_verifications_insert" ON delivery_verifications;
DROP POLICY IF EXISTS "delivery_verifications_update" ON delivery_verifications;
CREATE POLICY "delivery_verifications_select" ON delivery_verifications FOR SELECT USING (true);
CREATE POLICY "delivery_verifications_insert" ON delivery_verifications FOR INSERT WITH CHECK (true);
CREATE POLICY "delivery_verifications_update" ON delivery_verifications FOR UPDATE USING (true);

-- 10. DELIVERY_ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS delivery_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_id UUID REFERENCES exchanges(id) ON DELETE CASCADE,
  attempt_number INTEGER DEFAULT 1,
  status TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE delivery_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "delivery_attempts_select" ON delivery_attempts;
DROP POLICY IF EXISTS "delivery_attempts_insert" ON delivery_attempts;
CREATE POLICY "delivery_attempts_select" ON delivery_attempts FOR SELECT USING (true);
CREATE POLICY "delivery_attempts_insert" ON delivery_attempts FOR INSERT WITH CHECK (true);

-- 11. MERCHANT_BORDEREAUX TABLE
CREATE TABLE IF NOT EXISTS merchant_bordereaux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  bordereau_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  exchange_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE merchant_bordereaux ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "merchant_bordereaux_select" ON merchant_bordereaux;
DROP POLICY IF EXISTS "merchant_bordereaux_insert" ON merchant_bordereaux;
DROP POLICY IF EXISTS "merchant_bordereaux_update" ON merchant_bordereaux;
CREATE POLICY "merchant_bordereaux_select" ON merchant_bordereaux FOR SELECT USING (true);
CREATE POLICY "merchant_bordereaux_insert" ON merchant_bordereaux FOR INSERT WITH CHECK (true);
CREATE POLICY "merchant_bordereaux_update" ON merchant_bordereaux FOR UPDATE USING (true);

-- 12. FINANCIAL_TRANSACTIONS TABLE
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

CREATE INDEX IF NOT EXISTS idx_fin_trans_exchange ON financial_transactions(exchange_id);
CREATE INDEX IF NOT EXISTS idx_fin_trans_delivery ON financial_transactions(delivery_person_id);
CREATE INDEX IF NOT EXISTS idx_fin_trans_created ON financial_transactions(created_at DESC);

ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "financial_transactions_select" ON financial_transactions;
DROP POLICY IF EXISTS "financial_transactions_insert" ON financial_transactions;
CREATE POLICY "financial_transactions_select" ON financial_transactions FOR SELECT USING (true);
CREATE POLICY "financial_transactions_insert" ON financial_transactions FOR INSERT WITH CHECK (true);

-- 13. DELIVERY_PERSON_SETTLEMENTS TABLE
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

CREATE INDEX IF NOT EXISTS idx_settlements_dp ON delivery_person_settlements(delivery_person_id);
CREATE INDEX IF NOT EXISTS idx_settlements_st ON delivery_person_settlements(status);

ALTER TABLE delivery_person_settlements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settlements_select" ON delivery_person_settlements;
DROP POLICY IF EXISTS "settlements_insert" ON delivery_person_settlements;
DROP POLICY IF EXISTS "settlements_update" ON delivery_person_settlements;
CREATE POLICY "settlements_select" ON delivery_person_settlements FOR SELECT USING (true);
CREATE POLICY "settlements_insert" ON delivery_person_settlements FOR INSERT WITH CHECK (true);
CREATE POLICY "settlements_update" ON delivery_person_settlements FOR UPDATE USING (true);

-- 14. WEEKLY_INVOICES TABLE
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

CREATE INDEX IF NOT EXISTS idx_invoices_st ON weekly_invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_period ON weekly_invoices(year DESC, week_number DESC);

ALTER TABLE weekly_invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "invoices_select" ON weekly_invoices;
DROP POLICY IF EXISTS "invoices_insert" ON weekly_invoices;
DROP POLICY IF EXISTS "invoices_update" ON weekly_invoices;
CREATE POLICY "invoices_select" ON weekly_invoices FOR SELECT USING (true);
CREATE POLICY "invoices_insert" ON weekly_invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "invoices_update" ON weekly_invoices FOR UPDATE USING (true);

-- 15. INVOICE_LINE_ITEMS TABLE
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

CREATE INDEX IF NOT EXISTS idx_line_items_inv ON invoice_line_items(invoice_id);

ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "line_items_select" ON invoice_line_items;
DROP POLICY IF EXISTS "line_items_insert" ON invoice_line_items;
CREATE POLICY "line_items_select" ON invoice_line_items FOR SELECT USING (true);
CREATE POLICY "line_items_insert" ON invoice_line_items FOR INSERT WITH CHECK (true);

-- =====================================================
-- INSERT DEMO DATA
-- =====================================================

-- Demo Merchant (use different email than delivery person!)
INSERT INTO merchants (email, name, phone, address, city, postal_code)
VALUES ('demo@merchant.com', 'Boutique Demo', '+216 71 000 000', '123 Rue du Commerce', 'Tunis', '1000')
ON CONFLICT (email) DO NOTHING;

-- Demo Delivery Person (different email!)
INSERT INTO delivery_persons (email, name, phone)
VALUES ('demo@livreur.com', 'Livreur Demo', '+216 99 999 999')
ON CONFLICT (email) DO NOTHING;

-- Demo Transporter
INSERT INTO transporters (name, phone)
VALUES ('Transporteur Demo', '+216 70 000 000')
ON CONFLICT DO NOTHING;

-- Demo Mini Depot
INSERT INTO mini_depots (name, address, city)
VALUES ('Mini Depot Central', 'Zone Industrielle', 'Tunis')
ON CONFLICT DO NOTHING;

-- =====================================================
SELECT 'SWAPP database created successfully!' as result;
SELECT 'Demo Merchant: demo@merchant.com' as info;
SELECT 'Demo Delivery: demo@livreur.com' as info;
