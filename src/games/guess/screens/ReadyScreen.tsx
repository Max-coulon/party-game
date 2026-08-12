import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { plural } from '@/shared/lib/format'
import { currentMode } from '../engine'
import type { GuessState } from '../engine'
import { MODES } from '../modes'

interface ReadyScreenProps {
  state: GuessState
  onStart: () => void
}

export function ReadyScreen({ state, onStart }: ReadyScreenProps) {
  const team = state.config.teams[state.teamIndex]
  const mode = MODES[currentMode(state)]

  return (
    <Screen
      className="justify-center"
      footer={
        <Button full onClick={onStart}>
          Démarrer le tour
        </Button>
      }
    >
      <div className="surface rounded-card animate-deal-in flex flex-col items-center gap-3 p-8 text-center">
        <p className="text-muted text-xs tracking-[0.2em] uppercase">
          Manche {state.round + 1} / {state.config.modes.length}
        </p>
        <h2 className="font-display text-4xl font-extrabold" style={{ color: team?.color }}>
          {team?.name}
        </h2>
        <p className="text-accent mt-4 text-lg font-semibold">{mode.name}</p>
        <p className="text-muted max-w-60 text-sm text-balance">{mode.rule}</p>
        <p className="text-muted/60 mt-6 text-xs">
          {plural(state.deck.length, 'carte')} restantes · {state.config.turnSeconds} secondes
        </p>
      </div>
      <p className="text-muted text-center text-xs text-balance">
        Celui qui fait deviner tient le téléphone. Les autres ne doivent pas voir l'écran.
      </p>
    </Screen>
  )
}
