-- ============================================================
-- WriteMyWords — Supabase schema (v2, auth-based ownership)
-- Run this once in your Supabase project's SQL Editor
-- (Project → SQL Editor → New query → paste → Run)
--
-- This version replaces the earlier "anyone can insert a lead"
-- model with real Supabase Auth accounts: every row is owned by
-- a specific auth.users row, and Row Level Security only ever
-- lets people read or write their OWN data. Nobody, including a
-- leaked anon key, can read another user's email/WhatsApp/requests.
-- ============================================================

-- ------------------------------------------------------------
-- profiles: one row per signed-up user (student or expert)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  whatsapp text not null check (whatsapp ~ '^\+?[0-9]{8,15}$'),
  role text not null check (role in ('student','expert')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A user may create/read/update only their own profile row.
create policy "users manage their own profile"
  on public.profiles for all
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ------------------------------------------------------------
-- requests: posted by students, claimed & fulfilled by experts
-- ------------------------------------------------------------
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 150),
  category text check (char_length(category) <= 60),
  subject text check (char_length(subject) <= 80),
  academic_level text check (char_length(academic_level) <= 40),
  description text check (char_length(description) <= 2000),
  budget_min numeric check (budget_min >= 0),
  budget_max numeric check (budget_max >= 0),
  deadline text check (char_length(deadline) <= 40),
  status text not null default 'open' check (status in ('open','in_progress','submitted','completed','revision_requested')),
  expert_id uuid references auth.users(id) on delete set null,
  expert_name text check (char_length(expert_name) <= 100),
  submission_notes text check (char_length(submission_notes) <= 3000),
  submission_files jsonb default '[]'::jsonb,
  submitted_at timestamptz,
  revision_notes text check (char_length(revision_notes) <= 2000),
  student_rating integer check (student_rating between 1 and 5),
  student_feedback text check (char_length(student_feedback) <= 1000),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.requests enable row level security;

-- Students can insert requests only under their own user_id
create policy "owners can insert their own requests"
  on public.requests for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Students can read their own requests; assigned experts can read their active jobs
create policy "users can read related requests"
  on public.requests for select
  to authenticated
  using (auth.uid() = user_id or auth.uid() = expert_id);

-- Students can update their own requests (or approve/request revision); experts can claim open requests or update submissions
create policy "users can update related requests"
  on public.requests for update
  to authenticated
  using (
    auth.uid() = user_id 
    or auth.uid() = expert_id 
    or (status = 'open' and expert_id is null)
  );

-- Only student owner can delete their request
create policy "owners can delete their own requests"
  on public.requests for delete
  to authenticated
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- requests_public: what experts / logged-out visitors can browse.
-- Deliberately excludes user_id and private contact info.
-- ------------------------------------------------------------
create or replace view public.requests_public as
  select id, title, category, subject, academic_level, description,
         budget_min, budget_max, deadline, status, created_at
  from public.requests
  where status in ('open', 'in_progress')
  order by created_at desc;

grant select on public.requests_public to anon, authenticated;

-- ============================================================
-- Recommended dashboard settings (can't be set from SQL):
--  • Authentication → Providers → Email: keep "Confirm email" ON,
--    so an unverified address can't be used to spam requests.
--  • Authentication → Rate Limits: leave Supabase's defaults on,
--    or lower them further for a small site.
--  • Authentication → Settings → enable a CAPTCHA (hCaptcha or
--    Turnstile) for extra protection against bot signups.
--  • Never expose the "service_role" key anywhere in the frontend
--    or in this repo — only the "anon public" key belongs there.
-- ============================================================
