import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface WordCardProps {
  /** Change à chaque nouvelle carte : relance l'animation d'entrée. */
  cardKey: string
  eyebrow?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

/** La grande carte posée sur le tapis : mot à faire deviner, question, défi. */
export function WordCard({ cardKey, eyebrow, children, footer, className }: WordCardProps) {
  return (
    <div
      key={cardKey}
      className={cn(
        'surface rounded-card animate-deal-in flex min-h-56 flex-col items-center justify-center gap-4 p-6 text-center',
        className,
      )}
    >
      {eyebrow && (
        <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
          {eyebrow}
        </span>
      )}
      <div className="font-display text-3xl leading-tight font-extrabold text-balance">
        {children}
      </div>
      {footer}
    </div>
  )
}
