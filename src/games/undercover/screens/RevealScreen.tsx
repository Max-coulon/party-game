import { Button } from '@/shared/ui/Button'
import { SealedCard } from '@/shared/ui/SealedCard'
import { Screen } from '@/shared/layout/Screen'
import type { UndercoverState } from '../engine'

interface RevealScreenProps {
  state: UndercoverState
  onNext: () => void
}

export function RevealScreen({ state, onNext }: RevealScreenProps) {
  const player = state.players[state.revealIndex]
  if (!player) return null

  const isLast = state.revealIndex === state.players.length - 1

  return (
    <Screen
      className="justify-center"
      footer={
        <Button full onClick={onNext}>
          {isLast ? 'Tout le monde a son mot' : 'Suivant'}
        </Button>
      }
    >
      <p className="text-muted text-center text-xs tracking-[0.2em] uppercase">
        {state.revealIndex + 1} / {state.players.length}
      </p>

      <SealedCard holder={player.name}>
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
      </SealedCard>
    </Screen>
  )
}
