import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_DONEBY_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_DONEBY_SUPABASE_ANON_KEY!;

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
} 