-- ==============================================================================
-- SRI SAI TUITION & LEARNING CENTRE
-- Migration: Razorpay Payments & Fee Management Schema (Safe & Idempotent)
-- Date: 2026-10-06 (Corrected Foreign Key Types)
-- ==============================================================================

-- 1. Ensure UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create parent_child_links if not exists
-- Note: parents.id is UUID, students.id is TEXT
CREATE TABLE IF NOT EXISTS parent_child_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'Parent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_parent_student_link UNIQUE (parent_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_parent_child_parent ON parent_child_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_student ON parent_child_links(student_id);

-- 3. Create payments table if not exists
-- Note: fees.id is UUID, students.id is TEXT
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fee_id UUID REFERENCES fees(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL, -- 'Razorpay UPI', 'Razorpay Card', 'Razorpay NetBanking', 'Cash', 'Direct UPI', 'Cheque'
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT NOT NULL DEFAULT 'SUCCESS', -- 'SUCCESS', 'FAILED', 'PENDING'
  payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  transaction_ref TEXT NOT NULL UNIQUE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_fee ON payments(fee_id);
CREATE INDEX IF NOT EXISTS idx_payments_tx_ref ON payments(transaction_ref);

-- Unique index to prevent duplicate Razorpay payment captures (Idempotency)
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id 
  ON payments(razorpay_payment_id) 
  WHERE razorpay_payment_id IS NOT NULL;

-- 4. Create payment_orders table (Stores trusted server-created Razorpay orders)
-- Note: fees.id is UUID, students.id is TEXT, user_id is auth.users UUID
CREATE TABLE IF NOT EXISTS payment_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL UNIQUE, -- Razorpay order_id e.g. "order_XXXXX"
  fee_id UUID NOT NULL REFERENCES fees(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount_in_paise BIGINT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  receipt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'CREATED', -- 'CREATED', 'PAID', 'FAILED', 'EXPIRED'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_order_id ON payment_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_fee_id ON payment_orders(fee_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_student_id ON payment_orders(student_id);

-- 5. Create invoices table if not exists
-- Note: fees.id is UUID, payments.id is UUID, students.id is TEXT
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL UNIQUE, -- e.g. "SRI-INV-2026-1001"
  fee_id UUID REFERENCES fees(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_grade TEXT NOT NULL,
  batch_name TEXT NOT NULL,
  fee_month TEXT NOT NULL,
  amount_paid NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_ref TEXT NOT NULL,
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'PAID',
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_student ON invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_invoices_num ON invoices(invoice_number);

-- 6. Create notifications & preferences table if not exists
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  target_role TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  sms_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Admin check helper function
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Enable Row Level Security (RLS)
ALTER TABLE parent_child_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- 9. Idempotent RLS Policies

-- Parent-Child Links Policies
DROP POLICY IF EXISTS "Parent child links readable by involved users or admin" ON parent_child_links;
CREATE POLICY "Parent child links readable by involved users or admin"
  ON parent_child_links FOR SELECT TO authenticated
  USING (
    parent_id IN (SELECT id FROM parents WHERE profile_id = auth.uid()) OR
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR
    is_admin_user()
  );

DROP POLICY IF EXISTS "Admin manage parent child links" ON parent_child_links;
CREATE POLICY "Admin manage parent child links"
  ON parent_child_links FOR ALL TO authenticated
  USING (is_admin_user());

-- Fees Policies
DROP POLICY IF EXISTS "Fees readable by linked student, parent, or admin" ON fees;
CREATE POLICY "Fees readable by linked student, parent, or admin"
  ON fees FOR SELECT TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR
    student_id IN (SELECT s.id FROM students s JOIN parents p ON s.parent_id = p.id WHERE p.profile_id = auth.uid()) OR
    student_id IN (SELECT pcl.student_id FROM parent_child_links pcl JOIN parents p ON pcl.parent_id = p.id WHERE p.profile_id = auth.uid()) OR
    is_admin_user()
  );

DROP POLICY IF EXISTS "Admin has full write access on fees" ON fees;
CREATE POLICY "Admin has full write access on fees"
  ON fees FOR ALL TO authenticated
  USING (is_admin_user());

-- Payments Policies
DROP POLICY IF EXISTS "Payments viewable by payer and admin" ON payments;
CREATE POLICY "Payments viewable by payer and admin"
  ON payments FOR SELECT TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR
    student_id IN (SELECT s.id FROM students s JOIN parents p ON s.parent_id = p.id WHERE p.profile_id = auth.uid()) OR
    student_id IN (SELECT pcl.student_id FROM parent_child_links pcl JOIN parents p ON pcl.parent_id = p.id WHERE p.profile_id = auth.uid()) OR
    is_admin_user()
  );

DROP POLICY IF EXISTS "Admin manage payments" ON payments;
CREATE POLICY "Admin manage payments"
  ON payments FOR ALL TO authenticated
  USING (is_admin_user());

-- Payment Orders Policies
DROP POLICY IF EXISTS "Payment orders readable by linked student, parent, or admin" ON payment_orders;
CREATE POLICY "Payment orders readable by linked student, parent, or admin"
  ON payment_orders FOR SELECT TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR
    student_id IN (SELECT s.id FROM students s JOIN parents p ON s.parent_id = p.id WHERE p.profile_id = auth.uid()) OR
    student_id IN (SELECT pcl.student_id FROM parent_child_links pcl JOIN parents p ON pcl.parent_id = p.id WHERE p.profile_id = auth.uid()) OR
    is_admin_user()
  );

DROP POLICY IF EXISTS "Admin manage payment orders" ON payment_orders;
CREATE POLICY "Admin manage payment orders"
  ON payment_orders FOR ALL TO authenticated
  USING (is_admin_user());

-- Invoices Policies
DROP POLICY IF EXISTS "Invoices viewable by linked students, parents and admin" ON invoices;
CREATE POLICY "Invoices viewable by linked students, parents and admin"
  ON invoices FOR SELECT TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR
    student_id IN (SELECT s.id FROM students s JOIN parents p ON s.parent_id = p.id WHERE p.profile_id = auth.uid()) OR
    student_id IN (SELECT pcl.student_id FROM parent_child_links pcl JOIN parents p ON pcl.parent_id = p.id WHERE p.profile_id = auth.uid()) OR
    is_admin_user()
  );

DROP POLICY IF EXISTS "Admin manage invoices" ON invoices;
CREATE POLICY "Admin manage invoices"
  ON invoices FOR ALL TO authenticated
  USING (is_admin_user());

-- Notifications Policies
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid()::text OR is_admin_user());

-- Notification Preferences Policies
DROP POLICY IF EXISTS "Users can view and update own preferences" ON notification_preferences;
CREATE POLICY "Users can view and update own preferences"
  ON notification_preferences FOR ALL TO authenticated
  USING (user_id = auth.uid()::text OR is_admin_user());
