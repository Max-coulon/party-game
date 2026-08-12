import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/shared/ui/Button'
import { Screen } from '@/shared/layout/Screen'
import { playerById } from '../engine'
import type { UndercoverState } from '../engine'

interface MrWhiteScreenProps {
  state: UndercoverState
  onGuess: (guess: string) => void
  onContinue: () => void
}

export function MrWhiteScreen({ state, onGuess, onContinue }: MrWhiteScreenProps) {
  const [guess, setGuess] = useState('')
  const mrWhite = state.mrWhiteGuessingId ? playerById(state, state.mrWhiteGuessingId) : undefined
  if (!mrWhite) return null

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (guess.trim().length === 0) return
    onGuess(guess)
  }

  // Raté : on ne dévoile surtout pas le mot, la partie continue sans lui.
  if (state.mrWhiteGuessCorrect === false) {
    return (
      <Screen
        className="justify-center"
        footer={
          <Button full onClick={onContinue}>
            La partie continue
          </Button>
        }
      >
        <div className="surface rounded-card animate-deal-in flex flex-col items-center gap-3 p-6 text-center">
          <p className="font-display text-danger text-4xl font-extrabold">Raté</p>
          <p className="text-muted text-sm text-balance">
            « {state.mrWhiteGuess} » n'était pas le mot des civils. {mrWhite.name} quitte la table.
          </p>
        </div>
      </Screen>
    )
  }

  return (
    <Screen className="justify-center">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="surface rounded-card animate-deal-in flex flex-col items-center gap-3 p-6 text-center">
          <p className="text-muted text-xs tracking-[0.2em] uppercase">Mr White démasqué</p>
          <p className="font-display text-4xl font-extrabold">{mrWhite.name}</p>
          <p className="text-muted max-w-60 text-sm text-balance">
            Une dernière chance : quel était le mot des civils ? Trouve-le et tu gagnes seul.
          </p>
          <input
            value={guess}
            onChange={(event) => setGuess(event.target.value)}
            placeholder="Le mot des civils"
            aria-label="Le mot des civils"
            autoComplete="off"
            autoFocus
            className="bg-ink border-ink-edge text-chalk placeholder:text-muted/60 mt-2 min-h-14 w-full rounded-2xl border px-4 text-center text-lg outline-none focus:border-[var(--accent)]"
          />
        </div>
        <Button type="submit" full disabled={guess.trim().length === 0}>
          C'est mon dernier mot
        </Button>
      </form>
    </Screen>
  )
}
