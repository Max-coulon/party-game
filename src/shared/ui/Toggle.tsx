import { cn } from '@/shared/lib/cn'

interface ToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 py-2 text-left"
    >
      <span className="flex flex-col">
        <span className="text-chalk text-sm">{label}</span>
        {description && <span className="text-muted text-xs">{description}</span>}
      </span>
      <span
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full transition-colors',
          checked ? 'bg-accent' : 'bg-ink-edge',
        )}
      >
        <span
          className={cn(
            'bg-chalk absolute top-1 h-5 w-5 rounded-full transition-[left] duration-200',
            checked ? 'left-6' : 'left-1',
          )}
        />
      </span>
    </button>
  )
}
