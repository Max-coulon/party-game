import { cn } from '@/shared/lib/cn'
import type { PyramidSlot } from '../engine'
import { CardBack, CardFace } from './PlayingCard'

interface PyramidBoardProps {
  slots: readonly PyramidSlot[]
  rows: number
  /** Index de la prochaine carte encore face cachée. */
  nextIndex: number
  currentIndex: number
  onFlip: () => void
}

function rowsOf(slots: readonly PyramidSlot[], rows: number): PyramidSlot[][] {
  const grid: PyramidSlot[][] = []
  let index = 0
  for (let row = 1; row <= rows; row += 1) {
    grid.push(slots.slice(index, index + row) as PyramidSlot[])
    index += row
  }
  return grid
}

/**
 * Le triangle au centre de la table. Toutes les cartes ont la largeur de la
 * base, pour que la pyramide tienne sur un téléphone sans se déformer.
 */
export function PyramidBoard({
  slots,
  rows,
  nextIndex,
  currentIndex,
  onFlip,
}: PyramidBoardProps) {
  const grid = rowsOf(slots, rows)
  const cardWidth = `min(3.15rem, calc((100% - ${(rows - 1) * 0.3}rem) / ${rows}))`

  return (
    <div className="flex w-full flex-col items-center gap-1.5">
      {grid.map((row, rowIndex) => (
        <ul key={rowIndex} className="flex justify-center gap-1.5">
          {row.map((slot, column) => {
            const index = (rowIndex * (rowIndex + 1)) / 2 + column
            const isNext = index === nextIndex && !slot.revealed
            const isCurrent = index === currentIndex && slot.revealed
            return (
              <li
                key={slot.card.id}
                style={{ width: cardWidth, animationDelay: `${index * 18}ms` }}
                className="animate-tile-in"
              >
                <PyramidTile
                  slot={slot}
                  highlighted={isCurrent}
                  next={isNext}
                  onFlip={isNext ? onFlip : undefined}
                />
              </li>
            )
          })}
        </ul>
      ))}
    </div>
  )
}

interface PyramidTileProps {
  slot: PyramidSlot
  highlighted: boolean
  next: boolean
  onFlip?: () => void
}

function PyramidTile({ slot, highlighted, next, onFlip }: PyramidTileProps) {
  return (
    <div className={cn('flip-scene relative w-full', highlighted && 'z-10')}>
      {highlighted && (
        <span
          aria-hidden
          className="animate-breathe absolute -inset-1 rounded-2xl blur-[3px]"
          style={{ background: 'color-mix(in oklab, var(--accent) 50%, transparent)' }}
        />
      )}
      <div data-flipped={slot.revealed} className="flip-inner relative block aspect-[2/3] w-full">
        <span className="flip-face absolute inset-0">
          <CardBack
            label={next ? 'Retourner la prochaine carte' : 'Carte face cachée'}
            onClick={onFlip}
            highlighted={next}
            className="h-full w-full"
          />
        </span>
        <span className="flip-face flip-back absolute inset-0">
          <CardFace card={slot.card} size="sm" className="h-full w-full rounded-lg" />
        </span>
      </div>
    </div>
  )
}
