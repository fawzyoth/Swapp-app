/*
  # Add Delivery Attempts Tracking

  ## Description
  
  This migration creates a table to track delivery attempts for the original package
  that the customer wants to exchange. This helps merchants make informed decisions
  by seeing:
  - How many delivery attempts were made
  - When each attempt occurred
  - Why delivery failed (customer absent, wrong address, etc.)
  - If customer eventually accepted the package
  
  ## Changes
  
  1. New Table: `delivery_attempts`
    - Links to the exchange (the product being exchanged)
    - Tracks each delivery attempt with timestamp
    - Records failure reason if delivery failed
    - Indicates which attempt was successful
  
  2. Fields Added to `exchanges` table:
    - `original_order_number` (text): Reference to the original order/package
    - `delivery_accepted_on_attempt` (integer): Which attempt succeeded (1, 2, 3, etc.)
    - `total_delivery_attempts` (integer): Total number of attempts made
  
  ## Security
  - RLS enabled on delivery_attempts table
  - Only authenticated merchants can view/manage delivery attempts
*/

-- Create delivery_attempts table
CREATE TABLE IF NOT EXISTS delivery_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_id uuid REFERENCES exchanges(id) ON DELETE CASCADE,
  attempt_number integer NOT NULL,
  attempt_date timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL CHECK (status IN ('failed', 'successful')),
  failure_reason text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Add delivery tracking fields to exchanges table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exchanges' AND column_name = 'original_order_number'
  ) THEN
    ALTER TABLE exchanges ADD COLUMN original_order_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exchanges' AND column_name = 'delivery_accepted_on_attempt'
  ) THEN
    ALTER TABLE exchanges ADD COLUMN delivery_accepted_on_attempt integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exchanges' AND column_name = 'total_delivery_attempts'
  ) THEN
    ALTER TABLE exchanges ADD COLUMN total_delivery_attempts integer;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE delivery_attempts ENABLE ROW LEVEL SECURITY;

-- Policies for delivery_attempts
CREATE POLICY "Authenticated users can view delivery attempts"
  ON delivery_attempts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert delivery attempts"
  ON delivery_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update delivery attempts"
  ON delivery_attempts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_delivery_attempts_exchange_id 
  ON delivery_attempts(exchange_id);

CREATE INDEX IF NOT EXISTS idx_delivery_attempts_attempt_date 
  ON delivery_attempts(attempt_date DESC);
