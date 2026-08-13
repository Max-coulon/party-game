import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { PassGate } from '@/shared/ui/PassGate'
import { Screen } from '@/shared/layout/Screen'
import type { UndercoverState } from '../engine'
import { PlayerWordCard } from './PlayerWordCard'

interface RevealScreenProps {
  state: UndercoverState
  onNext: () => void
}

export function RevealScreen({ state, onNext }: RevealScreenProps) {
  // Le `key` remet le sas en place à chaque joueur : le mot précédent ne peut
  // pas rester affiché pendant que le téléphone change de main.
  return <RevealTurn key={state.revealIndex} state={state} onNext={onNext} />
}

function RevealTurn({ state, onNext }: RevealScreenProps) {
  const [opened, setOpened] = useState(false)
  const player = state.players[state.revealIndex]
  if (!player) return null

  const isLast = state.revealIndex === state.players.length - 1
  const step = `${state.revealIndex + 1} / ${state.players.length}`

  if (!opened) {
    return (
      <Screen className="justify-center">
        <PassGate
          holder={player.name}
          step={step}
          instruction="Ne touche à rien tant que ce n'est pas ton tour : personne d'autre ne doit voir ton mot."
          onReady={() => setOpened(true)}
        />
      </Screen>
    )
  }

  return (
    <Screen
      className="justify-center"
      footer={
        <Button full onClick={onNext}>
          {isLast ? 'Tout le monde a son mot' : "J'ai vu mon mot"}
        </Button>
      }
    >
      <p className="text-muted text-center text-xs tracking-[0.2em] uppercase">{step}</p>

      <PlayerWordCard player={player} />

      <p className="text-muted px-1 text-center text-xs text-balance">
        Retiens-le bien. En cas de trou de mémoire, tu pourras le revoir pendant la discussion.
      </p>
    </Screen>
  )
}
