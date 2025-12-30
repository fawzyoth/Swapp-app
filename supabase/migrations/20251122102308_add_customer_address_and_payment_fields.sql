/*
  # Add Customer Address and Payment Fields

  ## Changes
  
  1. New Columns Added to `exchanges` table:
    - `client_address` (text): Full street address
    - `client_city` (text): City name
    - `client_postal_code` (text): Postal/ZIP code
    - `client_country` (text): Country name with default 'Tunisia'
    - `payment_amount` (decimal): Amount customer needs to pay for exchange (0 for free)
    - `payment_status` (text): Payment status (pending, paid, free)
    - `product_name` (text): Name of product being exchanged
    - `product_sku` (text): Product SKU/identifier
    
  2. Notes:
    - Address fields help merchants understand delivery logistics
    - Payment amount allows for paid exchanges with price differences
    - Product info enables better tracking and history analysis
    - All fields nullable to maintain backward compatibility
*/

DO $$
BEGIN
  -- Add client address fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exchanges' AND column_name = 'client_address'
  ) THEN
    ALTER TABLE exchanges ADD COLUMN client_address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exchanges' AND column_name = 'client_city'
  ) THEN
    ALTER TABLE exchanges ADD COLUMN client_city text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exchanges' AND column_name = 'client_postal_code'
  ) THEN
    ALTER TABLE exchanges ADD COLUMN client_postal_code text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exchanges' AND column_name = 'client_country'
  ) THEN
    ALTER TABLE exchanges ADD COLUMN client_country text DEFAULT 'Tunisia';
  END IF;

  -- Add payment fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exchanges' AND column_name = 'payment_amount'
  ) THEN
    ALTER TABLE exchanges ADD COLUMN payment_amount decimal(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exchanges' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE exchanges ADD COLUMN payment_status text DEFAULT 'free';
  END IF;

  -- Add product information fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exchanges' AND column_name = 'product_name'
  ) THEN
    ALTER TABLE exchanges ADD COLUMN product_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exchanges' AND column_name = 'product_sku'
  ) THEN
    ALTER TABLE exchanges ADD COLUMN product_sku text;
  END IF;
END $$;
