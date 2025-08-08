import { createClient } from '@supabase/supabase-js'

// These environment variables are automatically provided by Lovable for Supabase projects
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)