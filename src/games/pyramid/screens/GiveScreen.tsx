import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { plural } from '@/shared/lib/format'
import { rankPhrase } from '../cards'
import { currentSlot, matchingCards, playerById, sipsFor } from '../engine'
import type { PyramidState } from '../engine'
import { CardFace } from './PlayingCard'

interface GiveScreenProps {
  state: PyramidState
  onGive: (targetId: string) => void
  onCancel: () => void
}

export function GiveScreen({ state, onGive, onCancel }: GiveScreenProps) {
  const giver = state.giverId ? playerById(state, state.giverId) : undefined
  const slot = currentSlot(state)
  if (!giver || !slot) return null

  const matches = matchingCards(giver.hand, slot.card.rank)
  const played = matches[0]
  const sips = sipsFor(slot)
  const others = state.players.filter((player) => player.id !== giver.id)

  return (
    <Screen
      className="justify-center"
      footer={
        <Button full variant="ghost" size="md" onClick={onCancel}>
          Ce n'est pas moi
        </Button>
      }
    >
      <header className="px-1 text-center">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
          {giver.name}
        </p>
        <h2 className="mt-2 text-3xl">À qui tu fais boire ?</h2>
        <p className="text-muted mt-2 text-sm text-balance">
          {plural(sips, 'gorgée')} pour {rankPhrase(slot.card.rank)}.
          {matches.length > 1
            ? ` Tu en as ${matches.length} : tu rejoueras juste après.`
            : ''}
        </p>
      </header>

      {played && (
        <div className="flex justify-center">
          <CardFace card={played} size="lg" className="w-28" />
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {others.map((player) => (
          <li key={player.id}>
            <button
              type="button"
              onClick={() => onGive(player.id)}
              className="surface flex min-h-14 w-full items-center rounded-2xl px-4 text-left font-semibold transition-transform active:scale-[0.99]"
            >
              {player.name}
            </button>
          </li>
        ))}
      </ul>
    </Screen>
  )
}
