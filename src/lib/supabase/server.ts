import { createServerClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';
import { CookieOptions } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_DONEBY_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_DONEBY_SUPABASE_ANON_KEY!;

export const createClient = () => {
  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookies().set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookies().set({ name, value: '', ...options })
        },
      },
    }
  )
} 