import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { plural } from '@/shared/lib/format'
import type { GuessState } from '../engine'

interface TurnEndScreenProps {
  state: GuessState
  onContinue: () => void
}

export function TurnEndScreen({ state, onContinue }: TurnEndScreenProps) {
  const team = state.config.teams[state.teamIndex]
  const found = state.turn.foundIds
    .map((id) => state.roundDeck.find((card) => card.id === id))
    .filter((card): card is NonNullable<typeof card> => card !== undefined)

  const deckEmpty = state.deck.length === 0

  return (
    <Screen
      className="justify-center"
      footer={
        <Button full onClick={onContinue}>
          {deckEmpty ? 'Fin de la manche' : 'Équipe suivante'}
        </Button>
      }
    >
      <div className="surface rounded-card animate-deal-in flex flex-col items-center gap-2 p-6 text-center">
        <p className="text-muted text-xs tracking-[0.2em] uppercase">Temps écoulé</p>
        <p className="font-display text-6xl font-extrabold" style={{ color: team?.color }}>
          {found.length}
        </p>
        <p className="text-muted text-sm">
          {plural(found.length, 'carte')} pour {team?.name}
        </p>
      </div>

      {found.length > 0 && (
        <Panel title="Ce tour">
          <ul className="flex flex-wrap gap-2">
            {found.map((card) => (
              <li
                key={card.id}
                className="bg-ink border-ink-edge text-chalk rounded-full border px-3 py-1.5 text-sm"
              >
                {card.text}
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </Screen>
  )
}
