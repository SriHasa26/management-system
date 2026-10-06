-- ==============================================================================
-- SRI SAI TUITION & LEARNING CENTRE — COMPLETE DATABASE SCHEMA (PHASE 1 - 4)
-- PostgreSQL / Supabase Migration
-- Founder / Head Faculty: Mrs. Telu Dhana Lakshmi (M.Sc, B.Ed)
-- Location: Sri Sai Tuition Point, Patamata, Vijayawada, Andhra Pradesh
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. ENUMS & CUSTOM TYPES
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'parent', 'admin', 'teacher');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE board_type AS ENUM ('CBSE', 'State Board', 'ICSE', 'MPC', 'BiPC', 'MEC');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE class_category AS ENUM ('Early Learning', 'Primary', 'Middle School', 'High School', 'Intermediate');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE fee_status AS ENUM ('Pending', 'Paid', 'Partially Paid', 'Overdue', 'Waived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE attendance_status AS ENUM ('Present', 'Absent', 'Late', 'Half Day', 'Excused');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE doubt_status AS ENUM ('Open', 'In Progress', 'Answered', 'Closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE question_type AS ENUM ('MCQ', 'Multiple Correct', 'True/False', 'Short Answer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE question_difficulty AS ENUM ('Easy', 'Medium', 'Hard');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE test_status AS ENUM ('Draft', 'Published', 'Live', 'Completed', 'Archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE attempt_status AS ENUM ('In Progress', 'Submitted', 'Auto-Submitted', 'Evaluated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE announcement_priority AS ENUM ('Normal', 'Important', 'Urgent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE target_audience AS ENUM ('All', 'Students', 'Parents', 'Teachers', 'Specific Class', 'Specific Batch');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ==============================================================================
-- 2. CORE USERS & PROFILES TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ==============================================================================
-- 3. ACADEMIC STRUCTURE (Classes, Batches, Subjects, Teachers)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category class_category NOT NULL,
  boards board_type[] NOT NULL DEFAULT '{CBSE,"State Board"}',
  monthly_fee NUMERIC(10, 2) NOT NULL DEFAULT 1500.00,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  qualification TEXT NOT NULL,
  subjects TEXT[] NOT NULL DEFAULT '{}',
  classes_handled TEXT[] NOT NULL DEFAULT '{}',
  joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL,
  timing TEXT NOT NULL,
  room TEXT NOT NULL DEFAULT 'Room 1',
  capacity INTEGER NOT NULL DEFAULT 25,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  class_id TEXT REFERENCES classes(id) ON DELETE CASCADE,
  icon_name TEXT DEFAULT 'BookOpen',
  color_code TEXT DEFAULT '#C99A3D',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. PARENTS & STUDENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  alternate_phone TEXT,
  occupation TEXT,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES parents(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT 'Male',
  dob DATE,
  grade TEXT NOT NULL,
  board board_type NOT NULL DEFAULT 'State Board',
  batch_id TEXT REFERENCES batches(id) ON DELETE SET NULL,
  batch_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_relation TEXT NOT NULL DEFAULT 'Father',
  address TEXT NOT NULL,
  overall_attendance NUMERIC(5, 2) DEFAULT 92.00,
  fee_status fee_status NOT NULL DEFAULT 'Paid',
  monthly_fee NUMERIC(10, 2) NOT NULL DEFAULT 2000.00,
  due_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  last_test_score NUMERIC(5, 2) DEFAULT 88.50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. ATTENDANCE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  class_id TEXT,
  class_name TEXT NOT NULL DEFAULT 'Class 10',
  batch_id TEXT REFERENCES batches(id) ON DELETE SET NULL,
  batch_name TEXT,
  date DATE NOT NULL,
  status attendance_status NOT NULL DEFAULT 'Present',
  subject TEXT,
  remarks TEXT,
  marked_by TEXT DEFAULT 'Faculty',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_student_date_subject UNIQUE (student_id, date, subject)
);

CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_batch ON attendance(batch_id);

-- ==============================================================================
-- 6. STUDY MATERIALS & ASSIGNMENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  class_id TEXT,
  class_name TEXT NOT NULL,
  batch_id TEXT REFERENCES batches(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  file_size TEXT NOT NULL DEFAULT '1.5 MB',
  file_url TEXT NOT NULL,
  download_url TEXT,
  video_url TEXT,
  uploaded_by TEXT NOT NULL DEFAULT 'Mrs. Telu Dhana Lakshmi',
  download_count INTEGER NOT NULL DEFAULT 0,
  is_important BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  class_id TEXT,
  class_name TEXT NOT NULL,
  batch_id TEXT REFERENCES batches(id) ON DELETE SET NULL,
  batch_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  chapter TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_marks INTEGER NOT NULL DEFAULT 25,
  attachment_url TEXT,
  instructions TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'Submitted',
  marks_obtained INTEGER,
  feedback TEXT,
  graded_at TIMESTAMPTZ,
  graded_by TEXT,
  CONSTRAINT unique_assignment_student UNIQUE (assignment_id, student_id)
);

-- ==============================================================================
-- 7. QUESTION BANK & MOCK TESTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL DEFAULT 'MCQ',
  difficulty question_difficulty NOT NULL DEFAULT 'Medium',
  class_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  options JSONB,
  correct_answer JSONB NOT NULL,
  explanation TEXT,
  marks INTEGER NOT NULL DEFAULT 1,
  negative_marks NUMERIC(4, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  class_name TEXT NOT NULL,
  batch_id TEXT REFERENCES batches(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  chapter TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  total_marks INTEGER NOT NULL DEFAULT 50,
  passing_marks INTEGER NOT NULL DEFAULT 18,
  attempt_limit INTEGER NOT NULL DEFAULT 1,
  negative_marking BOOLEAN NOT NULL DEFAULT FALSE,
  negative_mark_value NUMERIC(4, 2) DEFAULT 0.25,
  status test_status NOT NULL DEFAULT 'Draft',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL DEFAULT 1,
  marks INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT unique_test_question UNIQUE (test_id, question_id)
);

CREATE TABLE IF NOT EXISTS test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  time_taken_seconds INTEGER DEFAULT 0,
  total_marks NUMERIC(6, 2) NOT NULL DEFAULT 0,
  marks_obtained NUMERIC(6, 2) NOT NULL DEFAULT 0,
  percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  incorrect_count INTEGER NOT NULL DEFAULT 0,
  unanswered_count INTEGER NOT NULL DEFAULT 0,
  status attempt_status NOT NULL DEFAULT 'In Progress',
  grade TEXT,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_options JSONB,
  text_answer TEXT,
  is_correct BOOLEAN,
  marks_awarded NUMERIC(5, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_attempt_question UNIQUE (attempt_id, question_id)
);

-- ==============================================================================
-- 8. PHASE 4: FEES, PAYMENTS & INVOICES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  class_name TEXT NOT NULL DEFAULT 'Class 10',
  batch_name TEXT NOT NULL DEFAULT 'Morning Star',
  academic_year TEXT NOT NULL DEFAULT '2026-27',
  month TEXT NOT NULL, -- e.g. "October 2026"
  amount NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  due_date DATE NOT NULL,
  status fee_status NOT NULL DEFAULT 'Pending',
  last_payment_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_student_month_academic_year UNIQUE (student_id, month, academic_year)
);

CREATE INDEX IF NOT EXISTS idx_fees_student ON fees(student_id);
CREATE INDEX IF NOT EXISTS idx_fees_month ON fees(month);
CREATE INDEX IF NOT EXISTS idx_fees_status ON fees(status);

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
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id ON payments(razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL;

-- Payment Orders Table (stores trusted server-created Razorpay orders)
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

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  sms_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 9. DOUBTS, TIMETABLE, ANNOUNCEMENTS, NOTIFICATIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS doubts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  class_name TEXT NOT NULL DEFAULT 'Class 10',
  subject TEXT NOT NULL,
  chapter TEXT,
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  attachment_url TEXT,
  status doubt_status NOT NULL DEFAULT 'Open',
  answer TEXT,
  teacher_name TEXT,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doubt_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doubt_id UUID NOT NULL REFERENCES doubts(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role user_role NOT NULL,
  message TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS timetables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  class_id TEXT,
  class_name TEXT NOT NULL,
  batch_id TEXT REFERENCES batches(id) ON DELETE SET NULL,
  batch_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  teacher_name TEXT NOT NULL DEFAULT 'Mrs. Telu Dhana Lakshmi',
  room TEXT NOT NULL DEFAULT 'Room 1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority announcement_priority NOT NULL DEFAULT 'Normal',
  audience target_audience NOT NULL DEFAULT 'All',
  target_class TEXT,
  target_batch TEXT,
  author TEXT NOT NULL DEFAULT 'Mrs. Telu Dhana Lakshmi',
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  target_role user_role,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. AUTOMATED OVERDUE DETECTION TRIGGER FUNCTION
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.update_overdue_fees()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.fees
  SET status = 'Overdue',
      updated_at = NOW()
  WHERE due_date < CURRENT_DATE
    AND paid_amount < (amount - discount)
    AND status = 'Pending';
    
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fees Policies
CREATE POLICY "Fees readable by linked student, parent, or admin"
  ON fees FOR SELECT TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR
    student_id IN (SELECT s.id FROM students s JOIN parents p ON s.parent_id = p.id WHERE p.profile_id = auth.uid()) OR
    is_admin_user()
  );

CREATE POLICY "Admin has full write access on fees"
  ON fees FOR ALL TO authenticated
  USING (is_admin_user());

-- Payments Policies
CREATE POLICY "Payments viewable by payer and admin"
  ON payments FOR SELECT TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR
    student_id IN (SELECT s.id FROM students s JOIN parents p ON s.parent_id = p.id WHERE p.profile_id = auth.uid()) OR
    is_admin_user()
  );

CREATE POLICY "Admin manage payments"
  ON payments FOR ALL TO authenticated
  USING (is_admin_user());

-- Payment Orders Policies
CREATE POLICY "Payment orders readable by linked student, parent, or admin"
  ON payment_orders FOR SELECT TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR
    student_id IN (SELECT s.id FROM students s JOIN parents p ON s.parent_id = p.id WHERE p.profile_id = auth.uid()) OR
    is_admin_user()
  );

CREATE POLICY "Admin manage payment orders"
  ON payment_orders FOR ALL TO authenticated
  USING (is_admin_user());

-- Invoices Policies
CREATE POLICY "Invoices viewable by linked students, parents and admin"
  ON invoices FOR SELECT TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR
    student_id IN (SELECT s.id FROM students s JOIN parents p ON s.parent_id = p.id WHERE p.profile_id = auth.uid()) OR
    is_admin_user()
  );

CREATE POLICY "Admin manage invoices"
  ON invoices FOR ALL TO authenticated
  USING (is_admin_user());

-- Notification Preferences Policies
CREATE POLICY "Users can view and update own preferences"
  ON notification_preferences FOR ALL TO authenticated
  USING (user_id = auth.uid()::text OR is_admin_user());

-- ==============================================================================
-- 12. SEED SAMPLE FEES & PAYMENTS
-- ==============================================================================

INSERT INTO fees (student_id, student_name, class_name, batch_name, academic_year, month, amount, discount, paid_amount, due_date, status)
VALUES
('SRI-2026-001', 'Rahul Sharma', 'Class 10', 'Morning Star (CBSE)', '2026-27', 'October 2026', 2000.00, 0.00, 0.00, '2026-10-10', 'Pending'),
('SRI-2026-001', 'Rahul Sharma', 'Class 10', 'Morning Star (CBSE)', '2026-27', 'September 2026', 2000.00, 0.00, 2000.00, '2026-09-10', 'Paid'),
('SRI-2026-002', 'Priya Patel', 'Class 10', 'Morning Star (CBSE)', '2026-27', 'October 2026', 2000.00, 0.00, 0.00, '2026-10-10', 'Pending'),
('SRI-2026-003', 'Aditya Varma', 'Intermediate 1st Year', 'Inter MPC Focus', '2026-27', 'October 2026', 2500.00, 0.00, 0.00, '2026-10-05', 'Overdue')
ON CONFLICT (student_id, month, academic_year) DO NOTHING;

-- ==============================================================================
-- PHASE 5 — AI DOUBT BUDDY TABLES
-- ==============================================================================

-- 13. AI CONVERSATIONS
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  context_class TEXT,
  context_board TEXT,
  context_subject TEXT,
  context_chapter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_updated ON ai_conversations(updated_at DESC);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students own their conversations"
  ON ai_conversations FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- 14. AI MESSAGES
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  input_type TEXT DEFAULT 'text' CHECK (input_type IN ('text','image','voice','document')),
  mode TEXT DEFAULT 'normal' CHECK (mode IN ('normal','explain_simply','step_by_step','hint','summarize','example','quiz_me')),
  source_type TEXT DEFAULT 'GENERAL_AI' CHECK (source_type IN ('SRI_SAI_MATERIAL','CURRICULUM','GENERAL_AI','WEB')),
  source_metadata JSONB,
  model_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created ON ai_messages(created_at);

ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students access own conversation messages"
  ON ai_messages FOR ALL TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM ai_conversations WHERE user_id = auth.uid()
    )
  );

-- 15. AI ATTACHMENTS
CREATE TABLE IF NOT EXISTS ai_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES ai_messages(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image','audio','pdf','document')),
  file_name TEXT NOT NULL,
  file_size INTEGER,
  storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_attachments_user ON ai_attachments(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_attachments_conversation ON ai_attachments(conversation_id);

ALTER TABLE ai_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students own their AI attachments"
  ON ai_attachments FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- 16. AI SOURCES (RAG citations per message)
CREATE TABLE IF NOT EXISTS ai_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES ai_messages(id) ON DELETE CASCADE,
  material_id UUID REFERENCES study_materials(id) ON DELETE SET NULL,
  material_title TEXT,
  subject TEXT,
  chapter TEXT,
  page_or_section TEXT,
  snippet TEXT,
  confidence NUMERIC(4,3) DEFAULT 0.8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_sources_message ON ai_sources(message_id);

ALTER TABLE ai_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students access own AI sources"
  ON ai_sources FOR ALL TO authenticated
  USING (
    message_id IN (
      SELECT m.id FROM ai_messages m
      JOIN ai_conversations c ON m.conversation_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

-- 17. AI USAGE TRACKING
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE SET NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('text','image','voice','document','summary')),
  input_type TEXT,
  model_used TEXT,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON ai_usage(created_at DESC);

ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin reads all AI usage"
  ON ai_usage FOR SELECT TO authenticated
  USING (is_admin_user());

CREATE POLICY "Students can insert own usage"
  ON ai_usage FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 18. AI DOCUMENT CHUNKS (RAG knowledge base)
CREATE TABLE IF NOT EXISTS ai_document_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID REFERENCES study_materials(id) ON DELETE CASCADE,
  class_name TEXT,
  board TEXT,
  subject TEXT,
  chapter TEXT,
  title TEXT,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER DEFAULT 0,
  word_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_chunks_material ON ai_document_chunks(material_id);
CREATE INDEX IF NOT EXISTS idx_ai_chunks_class_subject ON ai_document_chunks(class_name, subject);

ALTER TABLE ai_document_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read document chunks"
  ON ai_document_chunks FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin can manage document chunks"
  ON ai_document_chunks FOR ALL TO authenticated
  USING (is_admin_user());

