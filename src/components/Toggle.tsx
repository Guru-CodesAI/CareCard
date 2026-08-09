interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  id: string
}

export function Toggle({ checked, onChange, label, description, id }: ToggleProps) {
  return (
    <div className="flex items-start gap-3">
      <button
        role="switch"
        id={id}
        aria-checked={checked}
        data-state={checked ? 'checked' : 'unchecked'}
        className="toggle-switch mt-0.5 shrink-0"
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span className="toggle-switch-thumb" />
      </button>
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-warmgray-800 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-xs text-warmgray-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  )
}
