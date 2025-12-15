-- Run this THIRD in Supabase SQL Editor

ALTER TABLE merchant_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_payment_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on merchant_payments" ON merchant_payments FOR ALL USING (true);
CREATE POLICY "Allow all on merchant_payment_items" ON merchant_payment_items FOR ALL USING (true);
