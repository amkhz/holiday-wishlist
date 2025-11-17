import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey)

if (!hasSupabaseConfig) {
  console.error('Missing Supabase environment variables')
  console.error('Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  console.error('Current values:', { 
    url: supabaseUrl || 'MISSING', 
    key: supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'MISSING' 
  })
} else {
  console.log('Supabase configuration loaded successfully')
}

export const supabase: SupabaseClient = hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : (createClient('https://placeholder.supabase.co', 'placeholder-key') as SupabaseClient)

