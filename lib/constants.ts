// Single source of truth for cross-surface values.
//
// Admin email is also seeded by 20260516000000_admin_and_storage.sql and read
// by edge functions via the ADMIN_NOTIFICATION_EMAIL Supabase secret. If
// changing the admin, update all three places (this constant, the env secret,
// and add a new migration to update the admin_users row).
export const ADMIN_EMAIL = "dorza.app@gmail.com";

export type ServiceOption =
  | "Custom websites"
  | "Social media management"
  | "Research & strategy"
  | "AI assistant"
  | "Not sure yet";

export const SERVICE_OPTIONS: readonly ServiceOption[] = [
  "Custom websites",
  "Social media management",
  "Research & strategy",
  "AI assistant",
  "Not sure yet",
] as const;
