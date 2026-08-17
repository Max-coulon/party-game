import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { plural } from '@/shared/lib/format'
import { rankPhrase } from '../cards'
import { currentSlot, playerById, sipsFor } from '../engine'
import type { PyramidState } from '../engine'

interface ChallengeScreenProps {
  state: PyramidState
  onAccept: () => void
  onCallLiar: () => void
}

export function ChallengeScreen({ state, onAccept, onCallLiar }: ChallengeScreenProps) {
  const giver = state.giverId ? playerById(state, state.giverId) : undefined
  const target = state.targetId ? playerById(state, state.targetId) : undefined
  const slot = currentSlot(state)
  if (!giver || !target || !slot) return null

  const sips = sipsFor(slot)

  return (
    <Screen className="justify-center">
      <header className="px-1 text-center">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
          {target.name}
        </p>
        <h2 className="mt-2 text-3xl">
          {giver.name} dit avoir {rankPhrase(slot.card.rank)}.
        </h2>
        <p className="text-muted mt-3 text-sm text-balance">
          Tu bois {plural(sips, 'gorgée')}. Ou tu l'accuses de mentir : si {giver.name} montre la
          carte, tu bois {plural(sips * 2, 'gorgée')} ; s'il n'a rien, c'est lui qui les prend.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <Button full onClick={onAccept}>
          Je bois · {plural(sips, 'gorgée')}
        </Button>
        <Button full variant="danger" onClick={onCallLiar}>
          Tu mens
        </Button>
      </div>
    </Screen>
  )
}
