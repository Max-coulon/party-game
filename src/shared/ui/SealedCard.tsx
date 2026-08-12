import type { ReactNode } from 'react'
import { useHold } from '@/shared/hooks/useHold'
import { cn } from '@/shared/lib/cn'

interface SealedCardProps {
  /** Nom du joueur à qui le téléphone est destiné. */
  holder: string
  /** Ce qui apparaît tant que le doigt reste appuyé. */
  children: ReactNode
  /** Consigne affichée sous le sceau. */
  instruction?: string
  className?: string
}

/**
 * Le sceau : l'élément signature du pass-and-play.
 * Le secret n'est visible que pendant l'appui, jamais après. Un téléphone posé
 * sur la table n'affiche donc jamais le rôle de personne.
 */
export function SealedCard({
  holder,
  children,
  instruction = 'Maintiens le doigt appuyé pour voir',
  className,
}: SealedCardProps) {
  const { held, handlers } = useHold()

  return (
    <div
      {...handlers}
      role="button"
      tabIndex={0}
      aria-label={`Carte de ${holder}. Maintenir appuyé, ou garder Espace enfoncé, pour révéler.`}
      aria-pressed={held}
      className={cn(
        'rounded-card relative flex min-h-[22rem] w-full touch-none flex-col items-center justify-center overflow-hidden p-6 text-center select-none',
        'transition-transform duration-200 active:scale-[0.99]',
        held
          ? 'bg-ink-raised border-accent border-2'
          : 'surface border-ink-edge border-2 border-dashed',
        className,
      )}
    >
      {held ? (
        <div className="animate-rise flex flex-col items-center gap-3">{children}</div>
      ) : (
        <>
          {/* Le sceau : un disque à l'accent du jeu, qui respire. */}
          <span
            className="bg-accent/15 border-accent/40 mb-6 flex h-24 w-24 items-center justify-center rounded-full border"
            style={{ animation: 'pulse-ring 2.2s ease-out infinite' }}
            aria-hidden
          >
            <span className="bg-accent h-10 w-10 rounded-full" />
          </span>
          <p className="text-muted text-xs tracking-[0.2em] uppercase">Téléphone à</p>
          <p className="font-display mt-1 text-4xl font-extrabold">{holder}</p>
          <p className="text-muted mt-6 max-w-56 text-sm text-balance">{instruction}</p>
        </>
      )}
    </div>
  )
}
