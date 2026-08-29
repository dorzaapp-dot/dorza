-- Allow authenticated clients to read their own contact messages.
-- client_id in contact_messages references onboard_submissions.id (as text).
create policy "client_read_own_contact_messages" on contact_messages
  for select using (
    client_id in (
      select id::text from onboard_submissions where user_id = auth.uid()
    )
  );
