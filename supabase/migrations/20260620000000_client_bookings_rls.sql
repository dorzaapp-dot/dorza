-- Allow authenticated clients to read their own bookings.
-- client_id in bookings references onboard_submissions.id (as text).
create policy "client_read_own_bookings" on bookings
  for select using (
    client_id in (
      select id::text from onboard_submissions where user_id = auth.uid()
    )
  );

-- Allow clients to update booking status (confirm/cancel their own bookings).
create policy "client_update_own_bookings" on bookings
  for update using (
    client_id in (
      select id::text from onboard_submissions where user_id = auth.uid()
    )
  ) with check (
    client_id in (
      select id::text from onboard_submissions where user_id = auth.uid()
    )
  );
