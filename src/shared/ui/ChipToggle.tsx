import { cn } from '@/shared/lib/cn'

interface ChipToggleProps {
  label: string
  count?: number
  selected: boolean
  onToggle: () => void
}

export function ChipToggle({ label, count, selected, onToggle }: ChipToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        'min-h-9 rounded-full border px-3 text-sm transition-colors',
        selected
          ? 'bg-accent text-ink border-transparent font-semibold'
          : 'bg-ink border-ink-edge text-muted',
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn('ml-1.5 text-xs', selected ? 'text-ink/60' : 'text-muted/50')}>
          {count}
        </span>
      )}
    </button>
  )
}
