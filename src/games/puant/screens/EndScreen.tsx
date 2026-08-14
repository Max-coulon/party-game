import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { plural } from '@/shared/lib/format'
import { PUANT_ID } from '../cards'
import { playerById, savedOrder } from '../engine'
import type { PuantState } from '../engine'
import { CardFace } from './PlayingCard'

interface EndScreenProps {
  state: PuantState
  onReplay: () => void
  onNewSetup: () => void
}

const PUANT = { id: PUANT_ID, rank: 'V', suit: 'pique' } as const

const ordinal = (position: number): string => (position === 1 ? '1er' : `${position}e`)

export function EndScreen({ state, onReplay, onNewSetup }: EndScreenProps) {
  const loser = state.loserId ? playerById(state, state.loserId) : undefined
  const saved = savedOrder(state)
  const sips = state.rules.forfeitSips

  return (
    <Screen
      footer={
        <>
          <Button full onClick={onReplay}>
            Rejouer
          </Button>
          <Button full variant="ghost" size="md" onClick={onNewSetup}>
            Changer les réglages
          </Button>
        </>
      }
    >
      <header className="animate-deal-in flex flex-col items-center px-1 pt-4 text-center">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
          {state.turn} tours
        </p>
        <h2 className="mt-2 text-4xl">{loser ? `${loser.name} reste avec le Puant.` : 'Terminé.'}</h2>

        <CardFace card={PUANT} size="lg" className="mt-6 w-32" />

        <p className="text-muted mt-5 text-sm text-balance">
          Le valet de pique n'avait aucun jumeau. Il devait bien finir chez quelqu'un.
        </p>

        {loser && sips > 0 && (
          <p className="text-chalk mt-3 text-base font-semibold text-balance">
            {plural(sips, 'gorgée')} pour {loser.name}.
          </p>
        )}
      </header>

      {saved.length > 0 && (
        <Panel title="Sauvés" hint={`${saved.length}`}>
          <ul className="flex flex-col gap-2">
            {saved.map((player, position) => (
              <li key={player.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-chalk">
                  <span className="text-muted mr-2 tabular-nums">{ordinal(position + 1)}</span>
                  {player.name}
                </span>
                <span className="text-muted text-xs">{plural(player.pairs.length, 'paire')}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </Screen>
  )
}
