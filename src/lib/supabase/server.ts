import { createServerClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

export const createServerSupabaseClient = (cookies: any) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );
}; 