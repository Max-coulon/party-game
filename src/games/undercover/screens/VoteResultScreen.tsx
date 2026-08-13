import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { Screen } from '@/shared/layout/Screen'
import { plural } from '@/shared/lib/format'
import { playerById } from '../engine'
import type { UndercoverState } from '../engine'
import { ROLE_LABELS } from '../labels'

interface VoteResultScreenProps {
  state: UndercoverState
  onContinue: () => void
}

export function VoteResultScreen({ state, onContinue }: VoteResultScreenProps) {
  const eliminated = state.pendingEliminationId
    ? playerById(state, state.pendingEliminationId)
    : undefined
  if (!eliminated) return null

  const maxVotes = Math.max(1, ...state.lastTally.map((entry) => entry.votes))
  const showTally = state.rules.voteMode === 'secret' && state.lastTally.length > 0

  return (
    <Screen
      className="justify-center"
      footer={
        <Button full onClick={onContinue}>
          Continuer
        </Button>
      }
    >
      <div className="surface rounded-card animate-deal-in flex flex-col items-center gap-3 p-6 text-center">
        <p className="text-muted text-xs tracking-[0.2em] uppercase">Éliminé</p>
        <p className="font-display text-4xl font-extrabold">{eliminated.name}</p>
        {/* Le rôle seul : afficher son mot révélerait la paire à toute la table. */}
        {state.rules.revealRoleOnElimination ? (
          <p className="text-accent text-lg font-semibold">{ROLE_LABELS[eliminated.role]}</p>
        ) : (
          <p className="text-muted text-sm">Son rôle restera secret jusqu'à la fin.</p>
        )}
      </div>

      {showTally && (
        <Panel title="Dépouillement">
          <ul className="flex flex-col gap-2">
            {state.lastTally.map((entry) => {
              const player = playerById(state, entry.playerId)
              if (!player) return null
              return (
                <li key={entry.playerId} className="flex items-center gap-3 text-sm">
                  <span className="w-24 shrink-0 truncate">{player.name}</span>
                  <span className="bg-ink-edge h-2 flex-1 overflow-hidden rounded-full">
                    <span
                      className="bg-accent block h-full rounded-full"
                      style={{ width: `${(entry.votes / maxVotes) * 100}%` }}
                    />
                  </span>
                  <span className="text-muted w-16 shrink-0 text-right text-xs">
                    {plural(entry.votes, 'voix', 'voix')}
                  </span>
                </li>
              )
            })}
          </ul>
        </Panel>
      )}
    </Screen>
  )
}
