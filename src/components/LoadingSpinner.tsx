import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size]

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3" role="status" aria-label={message}>
      <Loader2 className={`${sizeClass} animate-spin text-brand-500`} />
      <p className="text-sm text-warmgray-500">{message}</p>
    </div>
  )
}
