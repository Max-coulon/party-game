import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { PassGate } from '@/shared/ui/PassGate'
import { Screen } from '@/shared/layout/Screen'
import type { UndercoverState } from '../engine'

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
          instruction="Ne touche à rien tant que ce n'est pas ton tour : le mot ne s'affiche qu'une fois."
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

      <div className="surface rounded-card animate-deal-in flex min-h-[22rem] flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-muted text-xs tracking-[0.2em] uppercase">{player.name}</p>
        {player.word === null ? (
          <>
            <p className="font-display text-accent text-4xl font-extrabold">Mr White</p>
            <p className="text-muted max-w-60 text-sm text-balance">
              Tu n'as pas de mot. Écoute les autres, devine-le, et fais comme si tu le savais
              depuis le début.
            </p>
          </>
        ) : (
          <>
            <p className="text-muted text-xs tracking-[0.2em] uppercase">Ton mot</p>
            <p className="font-display text-5xl font-extrabold text-balance">{player.word}</p>
            <p className="text-muted max-w-60 text-sm text-balance">
              Tout le monde n'a pas le même. Décris-le sans le dire.
            </p>
          </>
        )}
      </div>

      <p className="text-muted px-1 text-center text-xs text-balance">
        Retiens-le bien : une fois validé, tu ne pourras plus le revoir.
      </p>
    </Screen>
  )
}
