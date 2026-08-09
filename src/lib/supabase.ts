import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true'

if (!supabaseUrl || !supabaseAnonKey) {
  if (isDemo) {
    console.warn(
      'Supabase credentials not found. Running in SECURE DEMO mode (VITE_DEMO_MODE=true).'
    )
  } else {
    console.error(
      'CRITICAL: Supabase credentials missing in production/non-demo environment!'
    )
  }
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

export const isDemoModeActive = (): boolean => {
  return !isSupabaseConfigured() && isDemo
}

