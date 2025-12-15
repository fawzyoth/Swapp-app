-- Merchant Payments Table
-- Tracks bi-weekly payments to merchants for exchange fees collected above 9 TND

CREATE TABLE merchant_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  payment_number TEXT UNIQUE NOT NULL,
  period_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_exchanges INTEGER DEFAULT 0,
  total_collected DECIMAL(10,2) DEFAULT 0,
  total_swapp_fees DECIMAL(10,2) DEFAULT 0,
  amount_due DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'disputed')),
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(merchant_id, year, month, period_number)
);

-- Merchant Payment Items Table
-- Line items showing each exchange included in a payment

CREATE TABLE merchant_payment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES merchant_payments(id) ON DELETE CASCADE,
  exchange_id UUID NOT NULL REFERENCES exchanges(id),
  exchange_code TEXT NOT NULL,
  client_name TEXT,
  amount_collected DECIMAL(10,2) NOT NULL,
  swapp_fee DECIMAL(10,2) DEFAULT 9.00,
  merchant_amount DECIMAL(10,2) NOT NULL,
  collection_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE merchant_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_payment_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies (permissive for now, can be tightened later)
CREATE POLICY "Allow all on merchant_payments" ON merchant_payments FOR ALL USING (true);
CREATE POLICY "Allow all on merchant_payment_items" ON merchant_payment_items FOR ALL USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_merchant_payments_merchant_id ON merchant_payments(merchant_id);
CREATE INDEX idx_merchant_payments_status ON merchant_payments(status);
CREATE INDEX idx_merchant_payments_period ON merchant_payments(year, month, period_number);
CREATE INDEX idx_merchant_payment_items_payment_id ON merchant_payment_items(payment_id);
CREATE INDEX idx_merchant_payment_items_exchange_id ON merchant_payment_items(exchange_id);
