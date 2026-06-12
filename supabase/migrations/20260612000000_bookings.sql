-- Bookings: appointment slots booked via client sites.
-- Stored centrally in Dorza's main Supabase hub.

create table if not exists bookings (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  client_id    text        not null,
  booking_date date        not null,
  booking_time time        not null,
  name         text        not null,
  email        text        not null,
  phone        text,
  message      text,
  status       text        not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  metadata     jsonb,
  raw_payload  jsonb
);

-- Prevent double-booking: only one non-cancelled booking per slot per client.
create unique index if not exists bookings_slot_unique
  on bookings (client_id, booking_date, booking_time)
  where status != 'cancelled';

create index if not exists bookings_client_date_idx on bookings (client_id, booking_date);
create index if not exists bookings_created_at_idx  on bookings (created_at desc);

alter table bookings enable row level security;

-- Service role (edge function) bypasses RLS — no insert policy needed.
create policy "admin_read_all_bookings" on bookings
  for select using (public.is_admin());

create policy "admin_update_bookings" on bookings
  for update using (public.is_admin()) with check (public.is_admin());
