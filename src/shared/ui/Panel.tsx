import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface PanelProps {
  children: ReactNode
  className?: string
  /** Titre de section affiché au-dessus du panneau. */
  title?: string
  hint?: string
}

export function Panel({ children, className, title, hint }: PanelProps) {
  return (
    <section className="flex flex-col gap-2">
      {title && (
        <header className="flex items-baseline justify-between gap-3 px-1">
          <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">{title}</h2>
          {hint && <span className="text-xs text-muted/70">{hint}</span>}
        </header>
      )}
      <div className={cn('surface rounded-3xl p-4', className)}>{children}</div>
    </section>
  )
}
