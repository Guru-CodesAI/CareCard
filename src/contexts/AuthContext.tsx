import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured, isDemoModeActive } from '@/lib/supabase'
import { demoAuth, initDemoData } from '@/lib/demoStore'

interface User {
  id: string
  email: string
  full_name?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isDemo: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const isDemo = isDemoModeActive()

  useEffect(() => {
    if (isDemo) {
      initDemoData()
      const demoUser = demoAuth.getUser()
      if (demoUser) {
        setUser({
          id: demoUser.id,
          email: demoUser.email,
          full_name: demoUser.full_name,
        })
      }
      setLoading(false)
      return
    }

    // Supabase auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name,
        })
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name,
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [isDemo])

  const signUp = useCallback(async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
    if (isDemo) {
      const result = demoAuth.signUp(email, password, fullName)
      if (result.error) return { error: result.error.message }
      const demoUser = demoAuth.getUser()
      if (demoUser) {
        setUser({ id: demoUser.id, email: demoUser.email, full_name: demoUser.full_name })
      }
      return {}
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    if (error) return { error: error.message }
    return {}
  }, [isDemo])

  const signIn = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    if (isDemo) {
      const result = demoAuth.signIn(email, password)
      if (result.error) return { error: result.error.message }
      const demoUser = demoAuth.getUser()
      if (demoUser) {
        setUser({ id: demoUser.id, email: demoUser.email, full_name: demoUser.full_name })
      }
      return {}
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return {}
  }, [isDemo])

  const signOut = useCallback(async () => {
    if (isDemo) {
      demoAuth.signOut()
      setUser(null)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
  }, [isDemo])

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
