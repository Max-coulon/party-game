import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { currentMode, isLastRound, totalScore } from '../engine'
import type { GuessState } from '../engine'
import { MODES } from '../modes'

interface RoundEndScreenProps {
  state: GuessState
  onContinue: () => void
}

export function RoundEndScreen({ state, onContinue }: RoundEndScreenProps) {
  const mode = MODES[currentMode(state)]
  const nextMode = state.config.modes[state.round + 1]
  const last = isLastRound(state)

  return (
    <Screen
      footer={
        <Button full onClick={onContinue}>
          {last ? 'Voir le classement' : `Manche ${state.round + 2} — ${MODES[nextMode!].name}`}
        </Button>
      }
    >
      <header className="animate-deal-in px-1 pt-6 text-center">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
          Manche {state.round + 1} terminée
        </p>
        <h2 className="mt-2 text-4xl">{mode.name}</h2>
      </header>

      <Panel title="Scores">
        <ul className="flex flex-col gap-3">
          {state.config.teams.map((team, index) => (
            <li key={team.id} className="flex items-center gap-3">
              <span
                aria-hidden
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: team.color }}
              />
              <span className="flex-1 truncate">{team.name}</span>
              <span className="text-muted text-sm tabular-nums">
                +{state.scores[state.round]?.[index] ?? 0}
              </span>
              <span className="font-display w-10 text-right text-lg font-bold tabular-nums">
                {totalScore(state, index)}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      {!last && state.config.sameDeck && (
        <p className="text-muted px-1 text-center text-sm text-balance">
          Les mêmes cartes reviennent. Tout le monde les a déjà entendues une fois — c'est là que
          ça devient intéressant.
        </p>
      )}
    </Screen>
  )
}
