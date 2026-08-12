import { Panel } from '@/shared/ui/Panel'
import type { UndercoverState } from '../engine'
import { ROLE_LABELS } from '../labels'

interface EliminationHistoryProps {
  state: UndercoverState
}

export function EliminationHistory({ state }: EliminationHistoryProps) {
  if (state.history.length === 0) return null

  return (
    <Panel title="Éliminés">
      <ul className="flex flex-col gap-2">
        {state.history.map((entry) => (
          <li
            key={`${entry.round}-${entry.playerId}`}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="text-muted/70 w-16 shrink-0 text-xs">Manche {entry.round}</span>
            <span className="text-chalk flex-1 truncate line-through">{entry.playerName}</span>
            {state.rules.revealRoleOnElimination && (
              <span className="text-muted text-xs">{ROLE_LABELS[entry.role]}</span>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  )
}
