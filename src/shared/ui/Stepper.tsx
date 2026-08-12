interface StepperProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (value: number) => void
}

export function Stepper({ label, value, min, max, step = 1, suffix, onChange }: StepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next))

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-chalk text-sm">{label}</span>
      <div className="bg-ink-raised border-ink-edge flex items-center gap-1 rounded-2xl border p-1">
        <button
          type="button"
          aria-label={`Diminuer ${label}`}
          disabled={value <= min}
          onClick={() => onChange(clamp(value - step))}
          className="text-chalk h-10 w-10 rounded-xl text-xl leading-none disabled:opacity-30"
        >
          −
        </button>
        <span
          aria-live="polite"
          className="font-display min-w-14 text-center text-lg font-bold tabular-nums"
        >
          {value}
          {suffix && <span className="text-muted ml-0.5 text-xs font-medium">{suffix}</span>}
        </span>
        <button
          type="button"
          aria-label={`Augmenter ${label}`}
          disabled={value >= max}
          onClick={() => onChange(clamp(value + step))}
          className="text-chalk h-10 w-10 rounded-xl text-xl leading-none disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  )
}
