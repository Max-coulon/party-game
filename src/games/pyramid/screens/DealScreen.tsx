import { useState } from 'react'
import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { PassGate } from '@/shared/ui/PassGate'
import { plural } from '@/shared/lib/format'
import { visibleHand } from '../engine'
import type { PyramidState } from '../engine'
import { CardFace } from './PlayingCard'

interface DealScreenProps {
  state: PyramidState
  onSeen: () => void
}

export function DealScreen({ state, onSeen }: DealScreenProps) {
  return <DealTurn key={state.dealIndex} state={state} onSeen={onSeen} />
}

function DealTurn({ state, onSeen }: DealScreenProps) {
  const [opened, setOpened] = useState(false)
  const player = state.players[state.dealIndex]
  if (!player) return null

  const isLast = state.dealIndex === state.players.length - 1
  const step = `${state.dealIndex + 1} / ${state.players.length}`
  const hand = visibleHand(player)

  if (!opened) {
    return (
      <Screen className="justify-center">
        <PassGate
          holder={player.name}
          step={step}
          instruction="Personne d'autre ne doit voir tes cartes. Prends le téléphone bien à toi."
          onReady={() => setOpened(true)}
        />
      </Screen>
    )
  }

  return (
    <Screen
      footer={
        <Button full onClick={onSeen}>
          {isLast ? "Tout le monde a vu. On pose le téléphone." : "J'ai retenu ma main"}
        </Button>
      }
    >
      <header className="px-1 pt-2">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">{step}</p>
        <h2 className="mt-2 text-3xl">Ta main, {player.name}</h2>
        <p className="text-muted mt-2 text-sm text-balance">
          {plural(hand.length, 'carte')}. Retiens-les : dès que le téléphone est au centre, elles
          n'apparaissent plus.
        </p>
      </header>

      <ul className="grid grid-cols-5 gap-2">
        {hand.map((held) => (
          <li key={held.id} className="animate-deal-in">
            <CardFace card={held} size="md" />
          </li>
        ))}
      </ul>
    </Screen>
  )
}
