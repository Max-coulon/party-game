import { cn } from '@/shared/lib/cn'
import { formatClock } from '@/shared/lib/format'

interface TimerBarProps {
  msLeft: number
  totalSeconds: number
  className?: string
}

export function TimerBar({ msLeft, totalSeconds, className }: TimerBarProps) {
  const total = Math.max(1, totalSeconds * 1000)
  const ratio = Math.min(1, Math.max(0, msLeft / total))
  const urgent = msLeft <= 10_000

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        className="font-display text-center text-5xl font-extrabold tabular-nums"
        style={{ color: urgent ? 'var(--color-danger)' : undefined }}
        role="timer"
        aria-live="off"
      >
        {formatClock(msLeft / 1000)}
      </div>
      <div className="bg-ink-edge h-2 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full transition-[width] duration-100 ease-linear"
          style={{
            width: `${ratio * 100}%`,
            backgroundColor: urgent ? 'var(--color-danger)' : 'var(--accent)',
          }}
        />
      </div>
    </div>
  )
}
