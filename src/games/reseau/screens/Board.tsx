import { cn } from '@/shared/lib/cn'
import type { ReseauCard } from '../engine'
import { WordTile } from './WordTile'

interface BoardProps {
  cards: readonly ReseauCard[]
  selected: number | null
  /** La dernière carte retournée : le bandeau parle d'elle, on la souligne. */
  highlight?: number | null
  showKey: boolean
  onSelect?: (index: number) => void
  className?: string
}

/** Les vingt-cinq mots, cinq par cinq, comme sur la table. */
export function Board({
  cards,
  selected,
  highlight = null,
  showKey,
  onSelect,
  className,
}: BoardProps) {
  return (
    <div className={cn('grid grid-cols-5 gap-1.5', className)}>
      {cards.map((card, index) => (
        <WordTile
          key={card.word}
          card={card}
          index={index}
          selected={selected === index}
          highlighted={highlight === index}
          showKey={showKey}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
