-- Admin users lookup table
create table if not exists admin_users (
  email text primary key
);
insert into admin_users (email) values ('abrahamadiwidodo@gmail.com')
  on conflict do nothing;

-- Allow admins to read all onboard submissions
create policy "admin_read_all" on onboard_submissions
  for select using (
    exists (select 1 from admin_users where email = (auth.jwt() ->> 'email'))
  );

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
    and exists (select 1 from admin_users where email = (auth.jwt() ->> 'email'))
  );
