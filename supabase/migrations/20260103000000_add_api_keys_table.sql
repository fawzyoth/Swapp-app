-- Add API-related columns to merchants table
ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS api_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS api_key_hash TEXT;

-- Create merchant API keys table for multiple keys support
CREATE TABLE IF NOT EXISTS merchant_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL, -- First few characters for identification
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  rate_limit_per_minute INTEGER DEFAULT 100,
  permissions JSONB DEFAULT '{"create": true, "read": true, "update": true, "delete": false}'::jsonb,
  UNIQUE(key_hash)
);

-- Create index for faster lookups
CREATE INDEX idx_merchant_api_keys_merchant ON merchant_api_keys(merchant_id);
CREATE INDEX idx_merchant_api_keys_hash ON merchant_api_keys(key_hash) WHERE is_active = true;

-- Add api_created column to exchanges table to track API-created exchanges
ALTER TABLE exchanges
ADD COLUMN IF NOT EXISTS api_created BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Create API usage tracking table
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES merchant_api_keys(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for analytics
CREATE INDEX idx_api_usage_merchant ON api_usage_logs(merchant_id, created_at DESC);
CREATE INDEX idx_api_usage_endpoint ON api_usage_logs(endpoint, created_at DESC);

-- Row Level Security for API keys table
ALTER TABLE merchant_api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Merchants can only see their own API keys
CREATE POLICY merchant_api_keys_select ON merchant_api_keys
  FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Policy: Merchants can create their own API keys
CREATE POLICY merchant_api_keys_insert ON merchant_api_keys
  FOR INSERT
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Policy: Merchants can update their own API keys
CREATE POLICY merchant_api_keys_update ON merchant_api_keys
  FOR UPDATE
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Policy: Merchants can delete their own API keys
CREATE POLICY merchant_api_keys_delete ON merchant_api_keys
  FOR DELETE
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Function to generate API key
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := 'swapp_';
  i INTEGER;
BEGIN
  FOR i IN 1..32 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to hash API key (simplified - use bcrypt in production)
CREATE OR REPLACE FUNCTION hash_api_key(key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(key, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Comment on tables
COMMENT ON TABLE merchant_api_keys IS 'Stores API keys for third-party integrations';
COMMENT ON TABLE api_usage_logs IS 'Tracks API usage for analytics and billing';
