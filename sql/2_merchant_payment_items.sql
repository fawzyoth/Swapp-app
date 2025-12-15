-- Run this SECOND in Supabase SQL Editor

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
