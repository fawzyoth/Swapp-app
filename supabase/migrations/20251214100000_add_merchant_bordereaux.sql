-- Add branding fields to merchants table
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS logo_base64 TEXT;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS business_address TEXT;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS business_city TEXT;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS business_postal_code TEXT;

-- Create merchant_bordereaux table for tracking pre-printed bordereaux
CREATE TABLE IF NOT EXISTS merchant_bordereaux (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID REFERENCES merchants(id) NOT NULL,
  bordereau_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'used')),
  exchange_id UUID REFERENCES exchanges(id),
  printed_at TIMESTAMPTZ,
  assigned_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_merchant_bordereaux_merchant ON merchant_bordereaux(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_bordereaux_code ON merchant_bordereaux(bordereau_code);
CREATE INDEX IF NOT EXISTS idx_merchant_bordereaux_status ON merchant_bordereaux(status);

-- Enable RLS
ALTER TABLE merchant_bordereaux ENABLE ROW LEVEL SECURITY;

-- RLS policies for merchant_bordereaux
CREATE POLICY "Merchants can view their own bordereaux"
  ON merchant_bordereaux FOR SELECT
  USING (merchant_id IN (SELECT id FROM merchants WHERE email = auth.email()));

CREATE POLICY "Merchants can insert their own bordereaux"
  ON merchant_bordereaux FOR INSERT
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE email = auth.email()));

CREATE POLICY "Merchants can update their own bordereaux"
  ON merchant_bordereaux FOR UPDATE
  USING (merchant_id IN (SELECT id FROM merchants WHERE email = auth.email()));
