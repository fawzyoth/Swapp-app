-- Add delivery integration columns to merchants table
ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS delivery_company TEXT,
ADD COLUMN IF NOT EXISTS delivery_api_key TEXT,
ADD COLUMN IF NOT EXISTS delivery_integration_status TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_merchants_delivery_status
ON merchants(delivery_integration_status);

-- Add comment for documentation
COMMENT ON COLUMN merchants.delivery_company IS 'Name of the delivery company (e.g., aramex, fedex, dhl)';
COMMENT ON COLUMN merchants.delivery_api_key IS 'API key for delivery company integration';
COMMENT ON COLUMN merchants.delivery_integration_status IS 'Status of delivery integration (active, inactive, null)';
