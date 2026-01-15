-- Add delivery_company column to exchanges table to track which delivery company is used
ALTER TABLE exchanges
ADD COLUMN IF NOT EXISTS delivery_company TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_exchanges_delivery_company
ON exchanges(delivery_company);

-- Add comment for documentation
COMMENT ON COLUMN exchanges.delivery_company IS 'Name of the delivery company used for this exchange (aramex, fedex, dhl, etc.)';
