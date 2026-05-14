create table onboard_submissions (
  id              uuid        primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  email           text        not null,
  business_name   text,
  owner_name      text,
  markdown_content text,
  state_json      jsonb,
  user_id         uuid        references auth.users(id),
  status          text        not null default 'pending'
    check (status in ('pending', 'provisioned'))
);

alter table onboard_submissions enable row level security;

-- Service role (Edge Function) bypasses RLS — no insert policy needed.
-- Users can read their own row once provisioned.
create policy "users_read_own" on onboard_submissions
  for select using (auth.uid() = user_id);
