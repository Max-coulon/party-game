import { Screen } from '@/shared/layout/Screen'
import { avatarForIndex } from '@/players/roster'
import type { TodState } from '../engine'
import type { TodType } from '../cards'

interface ChoiceScreenProps {
  state: TodState
  onChoose: (choice: TodType) => void
}

export function ChoiceScreen({ state, onChoose }: ChoiceScreenProps) {
  const name = state.config.players[state.currentPlayerIndex] ?? ''

  return (
    <Screen className="justify-center">
      <div className="animate-deal-in text-center">
        <p className="text-muted text-xs tracking-[0.2em] uppercase">
          Tour {state.turn}
          {state.config.maxTurns > 0 && ` / ${state.config.maxTurns}`}
        </p>
        <p className="mt-4 text-6xl" aria-hidden>
          {avatarForIndex(state.currentPlayerIndex)}
        </p>
        <h2 className="mt-3 text-4xl">{name}</h2>
        <p className="text-muted mt-2 text-sm">À toi de choisir.</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChoose('dare')}
          className="bg-accent text-ink rounded-card flex min-h-40 flex-col items-center justify-center gap-1 font-semibold transition-transform active:scale-[0.98]"
        >
          <span className="font-display text-3xl font-extrabold">Action</span>
          <span className="text-ink/70 text-xs">tu la fais</span>
        </button>
        <button
          type="button"
          onClick={() => onChoose('truth')}
          className="surface text-chalk rounded-card flex min-h-40 flex-col items-center justify-center gap-1 transition-transform active:scale-[0.98]"
        >
          <span className="font-display text-3xl font-extrabold">Vérité</span>
          <span className="text-muted text-xs">tu la dis</span>
        </button>
      </div>
    </Screen>
  )
}
