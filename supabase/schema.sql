-- ==========================================
-- AI HEALTH RECORD TRANSLATOR DATABASE SCHEMA
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Reports Table
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default 'Medical Report',
  file_name text,
  file_url text,
  status text default 'processing', -- 'processing' | 'done' | 'error'
  uploaded_at timestamp with time zone default now()
);

-- 2. Report Extracted Values Table
create table if not exists public.report_values (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete cascade not null,
  test_name text not null,
  value numeric,
  unit text,
  reference_range text,
  status text default 'normal', -- 'normal' | 'high' | 'low'
  explanation text
);

-- 3. Report Summaries Table
create table if not exists public.summaries (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete cascade not null,
  overall_score integer check (overall_score >= 0 and overall_score <= 100),
  summary_text text,
  key_takeaways text[],
  areas_to_monitor text[]
);

-- 4. Suggested Questions Table
create table if not exists public.suggested_questions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete cascade not null,
  question_text text not null,
  reasoning text
);

-- 5. Precautions & Health Guidance Table
create table if not exists public.precautions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete cascade not null,
  precaution_text text not null,
  category text default 'general' check (category in ('diet', 'lifestyle', 'urgent', 'general'))
);

-- 6. QA Messages Table (Interactive Chat)
create table if not exists public.qa_messages (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  message text not null,
  created_at timestamp with time zone default now()
);

-- Indexes for rapid lookup and trend analytics
create index if not exists idx_reports_user_id on public.reports(user_id);
create index if not exists idx_report_values_report_id on public.report_values(report_id);
create index if not exists idx_report_values_test_name on public.report_values(test_name);
create index if not exists idx_precautions_report_id on public.precautions(report_id);
create index if not exists idx_qa_messages_report_id on public.qa_messages(report_id);

-- Enable Row Level Security (RLS)
alter table public.reports enable row level security;
alter table public.report_values enable row level security;
alter table public.summaries enable row level security;
alter table public.suggested_questions enable row level security;
alter table public.precautions enable row level security;
alter table public.qa_messages enable row level security;

-- Policies for Reports
drop policy if exists "Users can view their own reports" on public.reports;
create policy "Users can view their own reports"
  on public.reports for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own reports" on public.reports;
create policy "Users can insert their own reports"
  on public.reports for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own reports" on public.reports;
create policy "Users can update their own reports"
  on public.reports for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own reports" on public.reports;
create policy "Users can delete their own reports"
  on public.reports for delete
  using (auth.uid() = user_id);

-- Policies for Report Values
drop policy if exists "Users can view values for their reports" on public.report_values;
create policy "Users can view values for their reports"
  on public.report_values for select
  using (exists (select 1 from public.reports where id = report_values.report_id and user_id = auth.uid()));

drop policy if exists "Users can insert values for their reports" on public.report_values;
create policy "Users can insert values for their reports"
  on public.report_values for insert
  with check (exists (select 1 from public.reports where id = report_values.report_id and user_id = auth.uid()));

-- Policies for Summaries
drop policy if exists "Users can view summaries for their reports" on public.summaries;
create policy "Users can view summaries for their reports"
  on public.summaries for select
  using (exists (select 1 from public.reports where id = summaries.report_id and user_id = auth.uid()));

drop policy if exists "Users can insert summaries for their reports" on public.summaries;
create policy "Users can insert summaries for their reports"
  on public.summaries for insert
  with check (exists (select 1 from public.reports where id = summaries.report_id and user_id = auth.uid()));

-- Policies for Suggested Questions
drop policy if exists "Users can view questions for their reports" on public.suggested_questions;
create policy "Users can view questions for their reports"
  on public.suggested_questions for select
  using (exists (select 1 from public.reports where id = suggested_questions.report_id and user_id = auth.uid()));

drop policy if exists "Users can insert questions for their reports" on public.suggested_questions;
create policy "Users can insert questions for their reports"
  on public.suggested_questions for insert
  with check (exists (select 1 from public.reports where id = suggested_questions.report_id and user_id = auth.uid()));

-- Policies for Precautions
drop policy if exists "Users can view precautions for their reports" on public.precautions;
create policy "Users can view precautions for their reports"
  on public.precautions for select
  using (exists (select 1 from public.reports where id = precautions.report_id and user_id = auth.uid()));

drop policy if exists "Users can insert precautions for their reports" on public.precautions;
create policy "Users can insert precautions for their reports"
  on public.precautions for insert
  with check (exists (select 1 from public.reports where id = precautions.report_id and user_id = auth.uid()));

-- Policies for QA Messages
drop policy if exists "Users can view their QA messages" on public.qa_messages;
create policy "Users can view their QA messages"
  on public.qa_messages for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert QA messages" on public.qa_messages;
create policy "Users can insert QA messages"
  on public.qa_messages for insert
  with check (auth.uid() = user_id);
