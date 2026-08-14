import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { currentPlayer, sourcePlayer } from '../engine'
import type { PuantState } from '../engine'
import { CardFace } from './PlayingCard'

interface DrawnScreenProps {
  state: PuantState
  onEndTurn: () => void
}

/**
 * La carte tirée, révélée à celui qui l'a tirée. Le valet de pique est affiché
 * exactement comme les autres : aucun cadre rouge, aucune animation de
 * catastrophe. Le voisin qui jette un œil ne doit rien pouvoir lire sur
 * l'écran — seulement sur le visage d'en face.
 */
export function DrawnScreen({ state, onEndTurn }: DrawnScreenProps) {
  const player = currentPlayer(state)
  const source = sourcePlayer(state)
  const drawn = state.drawn
  if (!player || !source || !drawn) return null

  const matched = state.matched
  const emptied = player.hand.length === 0

  return (
    <Screen
      className="justify-center"
      footer={
        <Button full onClick={onEndTurn}>
          {emptied ? "J'ai fini" : 'Fin de mon tour'}
        </Button>
      }
    >
      <p className="text-muted text-center text-xs tracking-[0.2em] uppercase">
        Piochée chez {source.name}
      </p>

      <div key={drawn.id} className="animate-deal-in flex justify-center">
        <CardFace card={drawn} size="lg" className="w-40" />
      </div>

      {matched ? (
        <div className="animate-rise flex flex-col items-center gap-3">
          <p className="font-display text-accent text-2xl font-extrabold">Paire !</p>
          <div className="flex items-center gap-2">
            <CardFace card={matched[0]} size="sm" className="w-12" />
            <CardFace card={matched[1]} size="sm" className="w-12" />
          </div>
          <p className="text-muted text-center text-sm text-balance">
            Son double attendait dans ta main. Les deux partent à la défausse.
          </p>
        </div>
      ) : (
        <p className="text-muted animate-rise text-center text-sm text-balance">
          Rien à marier : elle rejoint ta main.
        </p>
      )}

      {emptied && (
        <p className="text-success animate-rise text-center text-sm font-semibold text-balance">
          Plus une seule carte. Tu es sorti du jeu.
        </p>
      )}
    </Screen>
  )
}
