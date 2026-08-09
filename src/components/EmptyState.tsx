import { AlertTriangle } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-warmgray-100 flex items-center justify-center mb-4">
        {icon || <AlertTriangle className="w-7 h-7 text-warmgray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-warmgray-800 mb-2">{title}</h3>
      <p className="text-sm text-warmgray-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  )
}
