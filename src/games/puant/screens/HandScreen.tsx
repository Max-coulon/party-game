import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { PassGate } from '@/shared/ui/PassGate'
import { joinNames, plural } from '@/shared/lib/format'
import { currentPlayer, playerById, sourcePlayer } from '../engine'
import type { PuantState } from '../engine'
import { CardFace } from './PlayingCard'

interface HandScreenProps {
  state: PuantState
  onTake: () => void
  onOpenFan: () => void
}

/**
 * Le sas puis la main. Rien de secret n'est à l'écran tant que le bon joueur
 * n'a pas confirmé qu'il tient le téléphone, et une fois passé le sas on ne
 * voit jamais que sa propre main.
 */
export function HandScreen({ state, onTake, onOpenFan }: HandScreenProps) {
  const player = currentPlayer(state)
  const source = sourcePlayer(state)
  if (!player || !source) return null

  const exits = state.wentOut
    .map((id) => playerById(state, id)?.name)
    .filter((name): name is string => Boolean(name))

  if (state.phase === 'pass') {
    return (
      <Screen className="justify-center">
        <PassGate
          holder={player.name}
          step={`Tour ${state.turn}`}
          instruction="Personne d'autre ne doit voir ta main. Prends le téléphone bien à toi."
          onReady={onTake}
        />
        {exits.length > 0 && (
          <p className="text-muted animate-rise text-center text-sm text-balance">
            {joinNames(exits)} {exits.length > 1 ? "n'ont" : "n'a"} plus de cartes :{' '}
            {exits.length > 1 ? 'sortis' : 'sorti'} du jeu.
          </p>
        )}
      </Screen>
    )
  }

  return (
    <Screen
      footer={
        <Button full onClick={onOpenFan}>
          Piocher chez {source.name}
        </Button>
      }
    >
      <header className="px-1 pt-2">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
          Tour {state.turn}
        </p>
        <h2 className="mt-2 text-3xl">Ta main</h2>
        <p className="text-muted mt-2 text-sm text-balance">
          {plural(player.hand.length, 'carte')} en main, {plural(player.pairs.length, 'paire')}{' '}
          {player.pairs.length > 1 ? 'défaussées' : 'défaussée'}.
        </p>
      </header>

      <ul className="grid grid-cols-5 gap-2">
        {player.hand.map((card) => (
          <li key={card.id} className="animate-deal-in">
            <CardFace card={card} size="md" />
          </li>
        ))}
      </ul>

      <p className="text-muted/70 px-1 text-center text-xs text-balance">
        Les paires partent toutes seules :{' '}
        {state.rules.pairing === 'color' ? 'même valeur, même couleur' : 'même valeur'}.
      </p>
    </Screen>
  )
}
