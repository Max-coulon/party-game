import { Screen } from '@/shared/layout/Screen'
import { PassGate } from '@/shared/ui/PassGate'
import { TEAM_LABELS, remaining } from '../engine'
import type { ReseauState } from '../engine'
import { TEAM_COLORS } from '../palette'

interface BriefScreenProps {
  state: ReseauState
  onTake: () => void
}

/** Le sas : le téléphone quitte la table pour la main d'un chef de réseau. */
export function BriefScreen({ state, onTake }: BriefScreenProps) {
  const team = state.turn
  const color = TEAM_COLORS[team]

  return (
    <Screen className="justify-center">
      <p
        className="animate-rise text-center text-xs font-semibold tracking-[0.3em] uppercase"
        style={{ color }}
      >
        Équipe {TEAM_LABELS[team]}
      </p>

      <PassGate
        holder={state.spymasters[team]}
        step={`Tour ${state.round}`}
        instruction="Toi seul verras qui est à toi. Éloigne l'écran de la table avant de continuer."
        onReady={onTake}
      />

      <p className="text-muted animate-rise text-center text-sm text-balance">
        {remaining(state, team)} agents encore à faire trouver.
      </p>
    </Screen>
  )
}
