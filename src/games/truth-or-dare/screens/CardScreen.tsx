import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { WordCard } from '@/shared/ui/WordCard'
import { plural } from '@/shared/lib/format'
import type { TodState } from '../engine'
import { TYPE_LABELS } from '../cards'

interface CardScreenProps {
  state: TodState
  onResolve: (completed: boolean) => void
  onSkipCard: () => void
}

export function CardScreen({ state, onResolve, onSkipCard }: CardScreenProps) {
  const card = state.currentCard
  if (!card) return null

  const name = state.config.players[state.currentPlayerIndex] ?? ''
  const refusalCost = state.config.refusalSips

  return (
    <Screen
      className="justify-center"
      footer={
        <>
          <Button full onClick={() => onResolve(true)}>
            C'est fait
          </Button>
          <Button full variant="danger" size="md" onClick={() => onResolve(false)}>
            Je passe
            {refusalCost > 0 && ` — ${plural(refusalCost, 'gorgée')}`}
          </Button>
        </>
      }
    >
      <p className="text-muted px-1 text-center text-xs tracking-[0.2em] uppercase">
        {name} · {TYPE_LABELS[card.type]}
      </p>

      <WordCard cardKey={card.id} eyebrow={TYPE_LABELS[card.type]}>
        {card.text}
      </WordCard>

      <button
        type="button"
        onClick={onSkipCard}
        className="text-muted mx-auto text-sm underline underline-offset-4"
      >
        Impossible ici — tirer une autre carte
      </button>
    </Screen>
  )
}
