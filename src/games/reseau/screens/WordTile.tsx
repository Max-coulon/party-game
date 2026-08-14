import type { CSSProperties } from 'react'
import { cn } from '@/shared/lib/cn'
import type { ReseauCard } from '../engine'
import { ROLE_COLORS, ROLE_INK, ROLE_LABELS } from '../palette'

interface WordTileProps {
  card: ReseauCard
  index: number
  selected: boolean
  /** La dernière retournée reste cerclée le temps d'un tour. */
  highlighted?: boolean
  /** Vue du chef de réseau : l'appartenance transparaît sous le mot. */
  showKey: boolean
  onSelect?: (index: number) => void
}

/** Les longs mots passent en plus petit plutôt que de déborder de la case. */
const sizeFor = (word: string): string =>
  word.length > 9 ? 'text-[0.5rem]' : word.length > 7 ? 'text-[0.58rem]' : 'text-[0.66rem]'

export function WordTile({
  card,
  index,
  selected,
  highlighted = false,
  showKey,
  onSelect,
}: WordTileProps) {
  const color = ROLE_COLORS[card.role]
  const interactive = Boolean(onSelect) && !card.revealed
  const isTaupe = card.role === 'taupe'

  const keyStyle: CSSProperties = showKey
    ? {
        background: isTaupe
          ? 'radial-gradient(circle at 50% 30%, #241322, #0a0810)'
          : `linear-gradient(155deg, color-mix(in oklab, ${color} 32%, var(--color-ink-raised)), color-mix(in oklab, ${color} 10%, var(--color-ink)))`,
        borderColor: isTaupe ? '#ff5470' : `color-mix(in oklab, ${color} 55%, transparent)`,
        borderStyle: isTaupe ? 'dashed' : 'solid',
      }
    : {}

  return (
    <button
      type="button"
      disabled={!interactive}
      aria-pressed={interactive ? selected : undefined}
      aria-label={
        card.revealed
          ? `${card.word}, retournée, ${ROLE_LABELS[card.role]}`
          : showKey
            ? `${card.word}, ${ROLE_LABELS[card.role]}`
            : card.word
      }
      onClick={onSelect ? () => onSelect(index) : undefined}
      style={{ animationDelay: `${index * 14}ms` }}
      className={cn(
        'flip-scene animate-tile-in relative aspect-[5/6] w-full rounded-xl transition-transform duration-200',
        interactive && 'active:scale-95',
        selected && 'z-10 scale-105',
        highlighted && 'ring-chalk/30 ring-2 ring-offset-2 ring-offset-[var(--color-ink)]',
      )}
    >
      {/* Le halo de la carte visée : elle respire tant qu'elle n'est pas validée. */}
      {selected && (
        <span
          aria-hidden
          className="animate-breathe absolute -inset-1 rounded-2xl blur-[3px]"
          style={{ background: 'color-mix(in oklab, var(--accent) 55%, transparent)' }}
        />
      )}

      <span
        data-flipped={card.revealed}
        className="flip-inner relative block h-full w-full [transform:translateZ(0)]"
      >
        {/* Face visible de tous : le mot seul. */}
        <span
          style={keyStyle}
          className={cn(
            'flip-face bg-ink-raised border-ink-edge absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl border px-1 text-center',
            selected && 'border-accent',
          )}
        >
          <span
            className={cn(
              'text-chalk font-display leading-none font-extrabold tracking-[0.03em] break-words uppercase',
              sizeFor(card.word),
            )}
          >
            {card.word}
          </span>

          {showKey && !isTaupe && (
            <span
              aria-hidden
              className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full"
              style={{ background: color }}
            />
          )}
        </span>

        {/* Face retournée : l'appartenance, une bonne fois pour toutes. */}
        <span
          style={{
            background: isTaupe
              ? 'radial-gradient(circle at 50% 35%, #2a0f1c, #08060d)'
              : `linear-gradient(155deg, ${color}, color-mix(in oklab, ${color} 72%, #000))`,
            color: ROLE_INK[card.role],
            boxShadow: isTaupe ? 'inset 0 0 0 1.5px #ff5470' : undefined,
          }}
          className="flip-face flip-back absolute inset-0 flex flex-col items-center justify-center gap-0.5 overflow-hidden rounded-xl px-1 text-center"
        >
          {isTaupe && (
            <span aria-hidden className="text-[0.7rem] leading-none font-black">
              ✕
            </span>
          )}
          <span
            className={cn(
              'font-display leading-none font-extrabold tracking-[0.03em] break-words uppercase opacity-90',
              sizeFor(card.word),
            )}
          >
            {card.word}
          </span>
        </span>
      </span>
    </button>
  )
}
