-- Admin users lookup table
create table if not exists admin_users (
  email text primary key
);
insert into admin_users (email) values ('dorza.app@gmail.com')
  on conflict do nothing;

-- Security definer function so policies can join auth.users without granting broad access
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admin_users
    join auth.users on auth.users.email = public.admin_users.email
    where auth.users.id = auth.uid()
  )
$$;

-- Allow admins to read all onboard submissions
create policy "admin_read_all" on onboard_submissions
  for select using (public.is_admin());

-- Storage bucket for client assets (private)
insert into storage.buckets (id, name, public)
values ('assets', 'assets', false)
on conflict do nothing;

-- Clients can upload/read/delete only their own folder
create policy "clients_upload_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "clients_read_own" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "clients_delete_own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can read all uploaded assets
create policy "admin_read_all_assets" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'assets'
    and public.is_admin()
  );
