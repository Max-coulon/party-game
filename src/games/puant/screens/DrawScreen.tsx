import { Screen } from '@/shared/layout/Screen'
import { plural } from '@/shared/lib/format'
import { currentPlayer, sourcePlayer } from '../engine'
import type { PuantState } from '../engine'
import { CardBack } from './PlayingCard'

interface DrawScreenProps {
  state: PuantState
  onDraw: (position: number) => void
}

/**
 * L'éventail du voisin, tendu face cachée. L'ordre des dos est remélangé par
 * le moteur à chaque présentation : impossible de retenir une position d'un
 * tour sur l'autre, et la main du voisin n'existe nulle part à l'écran.
 */
export function DrawScreen({ state, onDraw }: DrawScreenProps) {
  const source = sourcePlayer(state)
  const player = currentPlayer(state)
  if (!source || !player) return null

  return (
    <Screen>
      <header className="px-1 pt-2">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
          Tour {state.turn}
        </p>
        <h2 className="mt-2 text-3xl">L'éventail de {source.name}</h2>
        <p className="text-muted mt-2 text-sm text-balance">
          {plural(state.fanOrder.length, 'carte')}, toutes pareilles vues de dos. Tape celle que tu
          sens.
        </p>
      </header>

      <ul className="grid grid-cols-4 gap-2.5">
        {state.fanOrder.map((cardId, position) => (
          <li key={cardId} className="animate-deal-in">
            <CardBack
              label={`Piocher la carte ${position + 1} sur ${state.fanOrder.length}`}
              onClick={() => onDraw(position)}
              className="w-full"
            />
          </li>
        ))}
      </ul>
    </Screen>
  )
}
