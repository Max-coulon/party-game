import { cn } from '@/shared/lib/cn'
import { SUIT_SYMBOLS, cardName, isRed } from '../cards'
import type { Card } from '../cards'

type Size = 'sm' | 'md' | 'lg'

const FACE_SIZES: Record<Size, string> = {
  sm: 'text-base gap-0',
  md: 'text-2xl gap-0.5',
  lg: 'text-6xl gap-1',
}

interface CardFaceProps {
  card: Card
  size?: Size
  className?: string
}

/** Une vraie carte : fond clair, valeur en haut, couleur en dessous. */
export function CardFace({ card, size = 'sm', className }: CardFaceProps) {
  return (
    <span
      role="img"
      aria-label={cardName(card)}
      className={cn(
        'bg-chalk font-display flex aspect-[2/3] flex-col items-center justify-center rounded-xl font-extrabold shadow-[0_0.5rem_1rem_-0.5rem_rgba(0,0,0,0.6)]',
        isRed(card) ? 'text-[#c81e45]' : 'text-ink',
        FACE_SIZES[size],
        className,
      )}
    >
      <span className="leading-none">{card.rank}</span>
      <span aria-hidden className="leading-none">
        {SUIT_SYMBOLS[card.suit]}
      </span>
    </span>
  )
}

interface CardBackProps {
  label: string
  onClick?: () => void
  highlighted?: boolean
  className?: string
}

/** Le dos d'une carte de la pyramide. Rien ne le distingue d'un autre. */
export function CardBack({ label, onClick, highlighted = false, className }: CardBackProps) {
  const face = (
    <span
      aria-hidden
      className={cn(
        'border-accent/30 bg-ink-raised absolute inset-0 rounded-xl border',
        highlighted && 'border-accent animate-breathe',
      )}
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, color-mix(in oklab, var(--accent) 26%, transparent) 0 0.25rem, transparent 0.25rem 0.5rem)',
      }}
    />
  )

  if (!onClick) {
    return (
      <span className={cn('relative block aspect-[2/3]', className)}>
        {face}
        <span className="sr-only">{label}</span>
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'relative aspect-[2/3] transition-transform duration-150 active:scale-95',
        className,
      )}
    >
      {face}
    </button>
  )
}
