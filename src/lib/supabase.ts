import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Running in demo mode. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to connect.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

export const isSupabaseConfigured = (): boolean => {
  const hasValidUrl = supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co'
  const hasValidKey = supabaseAnonKey && supabaseAnonKey !== 'placeholder-key'
  return !!(hasValidUrl && hasValidKey)
}

