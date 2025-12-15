-- Run this FIRST in Supabase SQL Editor

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
