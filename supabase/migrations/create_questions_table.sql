-- Migration: Create questions table for AI-generated practice questions
-- Description: Stores bulk-uploaded practice questions with multiple-choice options.

CREATE TABLE IF NOT EXISTS public.questions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_name TEXT NOT NULL,
    question_text TEXT NOT NULL,
    option_a    TEXT NOT NULL,
    option_b    TEXT NOT NULL,
    option_c    TEXT NOT NULL,
    option_d    TEXT NOT NULL,
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    explanation TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on module_name for filtering questions by module
CREATE INDEX IF NOT EXISTS idx_questions_module_name ON public.questions (module_name);

-- Enable Row-Level Security but allow public read access for authenticated users
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Allow only authenticated users to read questions
CREATE POLICY "Questions are visible to authenticated users"
    ON public.questions
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Only the service role (admin) can insert/update/delete
-- (supabase-js with service_role_key bypasses RLS entirely)