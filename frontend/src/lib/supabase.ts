import { createClient } from '@supabase/supabase-js';

// Use the public environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials are missing. Check your .env.local file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
