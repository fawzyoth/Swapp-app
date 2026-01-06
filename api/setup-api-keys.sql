-- Run this SQL in Supabase SQL Editor to set up API keys functionality
-- Go to: Supabase Dashboard > SQL Editor > New Query > Paste and Run

-- Step 1: Add API columns to merchants table
ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS api_enabled BOOLEAN DEFAULT true;

-- Step 2: Create merchant API keys table
CREATE TABLE IF NOT EXISTS merchant_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  rate_limit_per_minute INTEGER DEFAULT 100,
  UNIQUE(key_hash)
);

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_merchant_api_keys_merchant ON merchant_api_keys(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_api_keys_hash ON merchant_api_keys(key_hash) WHERE is_active = true;

-- Step 4: Add metadata column to exchanges table for API data
ALTER TABLE exchanges
ADD COLUMN IF NOT EXISTS api_created BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Step 5: Enable Row Level Security
ALTER TABLE merchant_api_keys ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS merchant_api_keys_select ON merchant_api_keys;
DROP POLICY IF EXISTS merchant_api_keys_insert ON merchant_api_keys;
DROP POLICY IF EXISTS merchant_api_keys_update ON merchant_api_keys;
DROP POLICY IF EXISTS merchant_api_keys_delete ON merchant_api_keys;

-- Policy: Merchants can view their own API keys
CREATE POLICY merchant_api_keys_select ON merchant_api_keys
  FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE email = (auth.jwt() ->> 'email')
    )
  );

-- Policy: Merchants can create their own API keys
CREATE POLICY merchant_api_keys_insert ON merchant_api_keys
  FOR INSERT
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE email = (auth.jwt() ->> 'email')
    )
  );

-- Policy: Merchants can update their own API keys
CREATE POLICY merchant_api_keys_update ON merchant_api_keys
  FOR UPDATE
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE email = (auth.jwt() ->> 'email')
    )
  );

-- Policy: Merchants can delete their own API keys
CREATE POLICY merchant_api_keys_delete ON merchant_api_keys
  FOR DELETE
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE email = (auth.jwt() ->> 'email')
    )
  );

-- Step 7: Verify setup
SELECT
  'Setup completed successfully!' as status,
  (SELECT COUNT(*) FROM merchant_api_keys) as total_api_keys,
  (SELECT COUNT(*) FROM merchants WHERE api_enabled = true) as api_enabled_merchants;

-- You're all set!
-- Now you can go to the merchant dashboard and create API keys.
