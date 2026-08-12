import { cn } from '@/shared/lib/cn'

export interface SegmentOption<T extends string | number> {
  value: T
  label: string
  hint?: string
}

interface SegmentedControlProps<T extends string | number> {
  options: readonly SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  columns?: number
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  label,
  columns,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('grid gap-2', columns ? undefined : 'grid-flow-col auto-cols-fr')}
      style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex min-h-12 flex-col items-center justify-center rounded-2xl px-3 py-2 text-center transition-colors',
              selected
                ? 'bg-accent text-ink font-semibold'
                : 'bg-ink-raised text-muted border-ink-edge border',
            )}
          >
            <span className="text-sm leading-tight">{option.label}</span>
            {option.hint && (
              <span className={cn('text-[0.7rem]', selected ? 'text-ink/70' : 'text-muted/60')}>
                {option.hint}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
