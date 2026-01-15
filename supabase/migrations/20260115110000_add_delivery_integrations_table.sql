-- Create delivery_integrations table for multiple delivery company integrations
CREATE TABLE IF NOT EXISTS delivery_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  delivery_company TEXT NOT NULL,
  api_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(merchant_id, delivery_company)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_delivery_integrations_merchant_id
ON delivery_integrations(merchant_id);

CREATE INDEX IF NOT EXISTS idx_delivery_integrations_status
ON delivery_integrations(status);

-- Add RLS (Row Level Security) policies
ALTER TABLE delivery_integrations ENABLE ROW LEVEL SECURITY;

-- Policy: Merchants can only see their own integrations
CREATE POLICY "Merchants can view own integrations"
ON delivery_integrations FOR SELECT
USING (auth.uid() = merchant_id);

-- Policy: Merchants can insert their own integrations
CREATE POLICY "Merchants can insert own integrations"
ON delivery_integrations FOR INSERT
WITH CHECK (auth.uid() = merchant_id);

-- Policy: Merchants can update their own integrations
CREATE POLICY "Merchants can update own integrations"
ON delivery_integrations FOR UPDATE
USING (auth.uid() = merchant_id);

-- Policy: Merchants can delete their own integrations
CREATE POLICY "Merchants can delete own integrations"
ON delivery_integrations FOR DELETE
USING (auth.uid() = merchant_id);

-- Add comments for documentation
COMMENT ON TABLE delivery_integrations IS 'Stores delivery company integrations for merchants';
COMMENT ON COLUMN delivery_integrations.delivery_company IS 'Name of the delivery company (aramex, fedex, dhl, etc.)';
COMMENT ON COLUMN delivery_integrations.api_key IS 'API key for the delivery company integration';
COMMENT ON COLUMN delivery_integrations.status IS 'Status of integration (active or inactive)';
