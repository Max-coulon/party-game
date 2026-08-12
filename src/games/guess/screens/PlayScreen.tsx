import { useEffect } from 'react'
import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { TimerBar } from '@/shared/ui/TimerBar'
import { WordCard } from '@/shared/ui/WordCard'
import { useCountdown } from '@/shared/hooks/useCountdown'
import { canSkip, currentCard, currentMode } from '../engine'
import type { GuessState } from '../engine'
import { MODES } from '../modes'

interface PlayScreenProps {
  state: GuessState
  onFound: () => void
  onSkip: () => void
  onTimeUp: () => void
}

export function PlayScreen({ state, onFound, onSkip, onTimeUp }: PlayScreenProps) {
  const countdown = useCountdown(state.config.turnSeconds, { onExpire: onTimeUp })
  const { start } = countdown
  const card = currentCard(state)
  const mode = MODES[currentMode(state)]

  useEffect(() => {
    start()
  }, [start])

  if (!card) return null

  const skipAllowed = canSkip(state)
  const skipsLeft = state.config.maxSkips - state.turn.skipsUsed

  return (
    <Screen
      className="justify-between pt-2"
      footer={
        <>
          <Button full onClick={onFound}>
            Trouvé
          </Button>
          {state.config.allowSkip && (
            <Button full variant="secondary" size="md" disabled={!skipAllowed} onClick={onSkip}>
              Passer
              {state.config.maxSkips > 0 && ` — ${Math.max(0, skipsLeft)} restantes`}
            </Button>
          )}
        </>
      }
    >
      <TimerBar msLeft={countdown.msLeft} totalSeconds={state.config.turnSeconds} />

      <WordCard cardKey={card.id} eyebrow={mode.name}>
        {card.text}
      </WordCard>

      {mode.needsTaboo && card.taboo && card.taboo.length > 0 && (
        <div className="border-danger/30 bg-danger/10 rounded-2xl border px-4 py-3">
          <p className="text-danger text-xs font-semibold tracking-[0.2em] uppercase">Interdit</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {card.taboo.map((word) => (
              <li key={word} className="text-chalk text-sm">
                {word}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between px-1">
        <span className="text-muted text-xs">
          {state.turn.foundIds.length} trouvée{state.turn.foundIds.length > 1 ? 's' : ''} ce tour
        </span>
        <span className="text-muted text-xs">{state.deck.length} dans le paquet</span>
      </div>
    </Screen>
  )
}
