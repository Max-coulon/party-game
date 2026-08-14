import { cn } from '@/shared/lib/cn'
import { TEAMS, TEAM_LABELS, agentsFor, found, remaining } from '../engine'
import type { ReseauState } from '../engine'
import { TEAM_COLORS } from '../palette'

interface ScoreBarProps {
  state: ReseauState
  /** Le tour en cours est signalé — sauf sur l'écran de fin. */
  showTurn?: boolean
}

/** Combien d'agents chaque camp a encore sur la table, d'un coup d'œil. */
export function ScoreBar({ state, showTurn = true }: ScoreBarProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TEAMS.map((team) => {
        const color = TEAM_COLORS[team]
        const active = showTurn && state.turn === team
        const total = agentsFor(state, team)

        return (
          <div
            key={team}
            className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border p-3"
            style={{
              borderColor: `color-mix(in oklab, ${color} ${active ? 70 : 26}%, transparent)`,
              background: `linear-gradient(150deg, color-mix(in oklab, ${color} ${active ? 22 : 9}%, var(--color-ink-raised)), var(--color-ink))`,
            }}
          >
            {active && (
              <span
                aria-hidden
                className="animate-breathe absolute -top-8 -right-6 h-16 w-16 rounded-full blur-xl"
                style={{ background: color }}
              />
            )}

            <div className="relative flex items-baseline justify-between gap-2">
              <span
                className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase"
                style={{ color }}
              >
                {TEAM_LABELS[team]}
              </span>
              <span className="font-display text-2xl leading-none font-extrabold tabular-nums">
                {remaining(state, team)}
              </span>
            </div>

            <div className="relative flex gap-[3px]" aria-hidden>
              {Array.from({ length: total }, (_, index) => (
                <span
                  key={index}
                  className={cn('h-1.5 flex-1 rounded-full transition-colors duration-500')}
                  style={{
                    background: index < found(state, team) ? color : 'var(--color-ink-edge)',
                  }}
                />
              ))}
            </div>

            <span className="sr-only">
              {found(state, team)} agents trouvés sur {total}
              {active ? ', à eux de jouer' : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}
