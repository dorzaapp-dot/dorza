-- Enquiries: top-of-funnel leads from the homepage waitlist form and modal.
-- Distinct from onboard_submissions (which holds full intake briefs after the
-- admin promotes a lead through /onboard).

create table if not exists enquiries (
  id                   uuid        primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  name                 text        not null,
  email                text        not null,
  business_type        text,
  suburb               text,
  services_interested  text[]      not null default '{}',
  message              text,
  source               text        not null default 'inline'
    check (source in ('inline', 'modal')),
  status               text        not null default 'new'
    check (status in ('new', 'contacted', 'converted', 'archived')),
  state_json           jsonb
);

create index if not exists enquiries_created_at_idx on enquiries (created_at desc);
create index if not exists enquiries_status_idx     on enquiries (status);

alter table enquiries enable row level security;

-- Service role (edge function) bypasses RLS — no insert policy needed for the
-- public submit path. Admins read via the existing is_admin() helper.
create policy "admin_read_all_enquiries" on enquiries
  for select using (public.is_admin());

create policy "admin_update_enquiries" on enquiries
  for update using (public.is_admin()) with check (public.is_admin());
