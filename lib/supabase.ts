import { createClient } from '@supabase/supabase-js'

// Client-side (safe to use in browser components)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-side only (uses service role key — full access, bypasses RLS)
// Only import this in server components, API routes, or server actions — never in client components
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
