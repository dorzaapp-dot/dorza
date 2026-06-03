-- Contact messages: form submissions from client sites.
-- Stored centrally in Dorza's main Supabase hub.

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id text not null,
  source text not null default 'contact-form',
  name text not null,
  email text not null,
  phone text,
  message text,
  metadata jsonb,
  raw_payload jsonb
);

create index if not exists contact_messages_client_id_created_at_idx on contact_messages (client_id, created_at desc);
create index if not exists contact_messages_created_at_idx on contact_messages (created_at desc);

alter table contact_messages enable row level security;

create policy "admin_read_all_contact_messages" on contact_messages
  for select using (public.is_admin());

create policy "admin_update_contact_messages" on contact_messages
  for update using (public.is_admin()) with check (public.is_admin());
