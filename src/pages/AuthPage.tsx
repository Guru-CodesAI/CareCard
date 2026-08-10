import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Heart, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { SEO } from '@/components/SEO'

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp, signIn, isDemo } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          setError('Please enter your name.')
          setLoading(false)
          return
        }
        const result = await signUp(email, password, fullName)
        if (result.error) {
          setError(result.error)
          setLoading(false)
          return
        }
      } else {
        const result = await signIn(email, password)
        if (result.error) {
          setError(result.error)
          setLoading(false)
          return
        }
      }
      navigate('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter min-h-[calc(100dvh-4rem)] flex items-center justify-center py-8 px-4">
      <SEO
        title="Sign In / Sign Up | CareCard"
        description="Manage your privacy-first QR safety emergency contact profiles on CareCard."
        path="/auth"
        noindex
      />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-warmgray-900">
            {mode === 'signup' ? 'Welcome to CareCard' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-warmgray-500">
            {mode === 'signup'
              ? 'Create your account to start protecting your loved ones.'
              : 'Sign in to manage your CareCards.'
            }
          </p>
        </div>

        {/* Demo mode notice */}
        {isDemo && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
            <p className="font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Demo Mode
            </p>
            <p className="mt-1 text-xs text-amber-600">
              Supabase is not configured. Data is stored in memory and will be lost on refresh.
              Use any email and password to try the app.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-4">
          {/* Toggle */}
          <div className="flex rounded-xl bg-warmgray-100 p-1">
            <button
              type="button"
              onClick={() => { setMode('signup'); setError('') }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-white text-warmgray-900 shadow-sm'
                  : 'text-warmgray-500 hover:text-warmgray-700'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setMode('signin'); setError('') }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === 'signin'
                  ? 'bg-white text-warmgray-900 shadow-sm'
                  : 'text-warmgray-500 hover:text-warmgray-700'
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Name field (signup only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-name" className="label">Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
                <input
                  id="auth-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Arun"
                  maxLength={100}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="auth-email" className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="arun@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="auth-password" className="label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 pr-10"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warmgray-400 hover:text-warmgray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
            id="auth-submit"
          >
            {loading ? (
              'Please wait...'
            ) : (
              <>
                {mode === 'signup' ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-warmgray-400 mt-6">
          By continuing, you agree to CareCard's{' '}
          <Link to="/privacy" className="underline hover:text-warmgray-600">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
