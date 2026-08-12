import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { plural } from '@/shared/lib/format'
import type { NheState } from '../engine'

interface ResultScreenProps {
  state: NheState
  onNext: () => void
}

const RULE_TITLES = {
  loneWolf: 'Cavalier seul',
  survivor: 'Le survivant',
} as const

const RULE_MESSAGES = {
  loneWolf: 'Seul à l’avoir fait : la dose est doublée.',
  survivor: 'Seul à ne pas l’avoir fait. Il rate trop de choses : il boit double.',
} as const

export function ResultScreen({ state, onNext }: ResultScreenProps) {
  const result = state.lastResult
  if (!result) return null

  const drinkers = result.sips
    .map((sips, index) => ({ sips, name: state.config.players[index] ?? '' }))
    .filter((row) => row.sips > 0)

  const isLast = state.index === state.deck.length - 1

  return (
    <Screen
      className="justify-center"
      footer={
        <Button full onClick={onNext}>
          {isLast ? 'Voir le classement' : 'Question suivante'}
        </Button>
      }
    >
      <div className="surface rounded-card animate-deal-in p-6 text-center">
        <p className="text-muted text-xs tracking-[0.2em] uppercase">Je n'ai jamais</p>
        <p className="mt-2 text-lg text-balance">{result.questionText}</p>
      </div>

      {result.triggeredRule && (
        <div className="bg-accent/12 border-accent/30 rounded-2xl border px-4 py-3 text-center">
          <p className="text-accent font-display text-lg font-bold">
            {RULE_TITLES[result.triggeredRule]}
          </p>
          <p className="text-muted mt-1 text-sm text-balance">
            {RULE_MESSAGES[result.triggeredRule]}
          </p>
        </div>
      )}

      {drinkers.length === 0 ? (
        <p className="text-muted py-6 text-center text-sm">
          Personne ne boit. Table étonnamment sage.
        </p>
      ) : (
        <Panel title="On boit">
          <ul className="flex flex-col gap-2">
            {drinkers.map((row) => (
              <li key={row.name} className="flex items-center justify-between gap-3">
                <span className="truncate">{row.name}</span>
                <span className="text-accent font-display font-bold">
                  {plural(row.sips, 'gorgée')}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </Screen>
  )
}
