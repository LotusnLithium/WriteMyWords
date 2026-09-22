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
-- requests: posted by students, owned by auth.uid()
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
  created_at timestamptz not null default now()
);

alter table public.requests enable row level security;

-- Students can insert requests only under their own user_id — this is the
-- check that stops anyone from forging another student's name/contact info
-- onto a request; there IS no separate name/email/whatsapp column here
-- anymore, because that data lives once, in profiles, and is looked up by
-- user_id rather than copy-pasted onto every row.
create policy "owners can insert their own requests"
  on public.requests for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Owners can read, update, and delete only their own requests (which is how
-- the student dashboard sees full detail — join profiles on user_id if you
-- need the poster's contact info from a trusted server context).
create policy "owners manage their own requests"
  on public.requests for select
  to authenticated
  using (auth.uid() = user_id);

create policy "owners can update their own requests"
  on public.requests for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owners can delete their own requests"
  on public.requests for delete
  to authenticated
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- requests_public: what experts / logged-out visitors can browse.
-- Deliberately excludes user_id and any contact info — nobody
-- reads another student's email/WhatsApp through this.
-- ------------------------------------------------------------
create or replace view public.requests_public as
  select id, title, category, subject, academic_level, description,
         budget_min, budget_max, deadline, created_at
  from public.requests
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
