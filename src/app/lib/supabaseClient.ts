// src/app/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// Ambil variabel dari environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and/or Anon Key are not defined in your .env.local file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)