import { useEffect } from 'react'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { TimerBar } from '@/shared/ui/TimerBar'
import { Screen } from '@/shared/layout/Screen'
import { useCountdown } from '@/shared/hooks/useCountdown'
import { alivePlayers, playerById } from '../engine'
import type { UndercoverState } from '../engine'
import { EliminationHistory } from './EliminationHistory'

interface DiscussionScreenProps {
  state: UndercoverState
  onVote: () => void
}

export function DiscussionScreen({ state, onVote }: DiscussionScreenProps) {
  const hasTimer = state.rules.discussionSeconds > 0
  const countdown = useCountdown(state.rules.discussionSeconds)
  const { start } = countdown

  useEffect(() => {
    if (hasTimer) start()
  }, [hasTimer, start, state.round])

  const alive = alivePlayers(state)
  const firstSpeaker = state.firstSpeakerId ? playerById(state, state.firstSpeakerId) : undefined

  return (
    <Screen
      footer={
        <Button full onClick={onVote}>
          Passer au vote
        </Button>
      }
    >
      <header className="px-1 pt-2">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
          Manche {state.round}
        </p>
        <h2 className="mt-2 text-3xl">
          {firstSpeaker ? `${firstSpeaker.name} commence.` : 'À vous de parler.'}
        </h2>
        <p className="text-muted mt-2 text-sm text-balance">
          Un mot chacun pour décrire le sien, dans le sens des aiguilles d'une montre. Ni le mot
          lui-même, ni un mot déjà utilisé.
        </p>
      </header>

      {hasTimer && (
        <TimerBar msLeft={countdown.msLeft} totalSeconds={state.rules.discussionSeconds} />
      )}

      <Panel title="Encore en jeu" hint={`${alive.length}`}>
        <ul className="flex flex-wrap gap-2">
          {alive.map((player) => (
            <li
              key={player.id}
              className="bg-ink border-ink-edge text-chalk rounded-full border px-3 py-1.5 text-sm"
            >
              {player.name}
            </li>
          ))}
        </ul>
      </Panel>

      <EliminationHistory state={state} />
    </Screen>
  )
}
