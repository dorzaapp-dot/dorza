import { createClient } from '@supabase/supabase-js'

// Fallback placeholders allow the static build to complete when env vars aren't
// set locally. In production (Vercel), the real values are set at build time.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'
)
