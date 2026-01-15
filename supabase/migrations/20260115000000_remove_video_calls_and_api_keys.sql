-- Remove video calls and API keys functionality
-- This migration removes tables and columns related to video calls and API keys

-- Drop API-related tables
DROP TABLE IF EXISTS api_usage_logs CASCADE;
DROP TABLE IF EXISTS merchant_api_keys CASCADE;

-- Drop video call related tables
DROP TABLE IF EXISTS sms_logs CASCADE;
DROP TABLE IF EXISTS video_calls CASCADE;

-- Drop API-related functions
DROP FUNCTION IF EXISTS generate_api_key() CASCADE;
DROP FUNCTION IF EXISTS hash_api_key(TEXT) CASCADE;

-- Remove API-related columns from merchants table
ALTER TABLE merchants
DROP COLUMN IF EXISTS api_enabled,
DROP COLUMN IF EXISTS api_key_hash;

-- Remove API-related columns from exchanges table
ALTER TABLE exchanges
DROP COLUMN IF EXISTS api_created,
DROP COLUMN IF EXISTS metadata;

-- Comment
COMMENT ON SCHEMA public IS 'Removed video calls and API keys functionality';
