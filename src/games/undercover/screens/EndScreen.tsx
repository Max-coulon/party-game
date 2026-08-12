import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { Screen } from '@/shared/layout/Screen'
import { cn } from '@/shared/lib/cn'
import type { UndercoverState } from '../engine'
import { ROLE_LABELS, WINNER_SUBTITLES, WINNER_TITLES } from '../labels'

interface EndScreenProps {
  state: UndercoverState
  onReplay: () => void
  onNewSetup: () => void
}

export function EndScreen({ state, onReplay, onNewSetup }: EndScreenProps) {
  if (!state.winner) return null

  const ordered = [...state.players].sort((a, b) => {
    const rank = { civil: 2, undercover: 1, mrwhite: 0 } as const
    return rank[a.role] - rank[b.role]
  })

  return (
    <Screen
      footer={
        <>
          <Button full onClick={onReplay}>
            Rejouer avec les mêmes joueurs
          </Button>
          <Button full variant="ghost" size="md" onClick={onNewSetup}>
            Changer les réglages
          </Button>
        </>
      }
    >
      <header className="animate-deal-in px-1 pt-4 text-center">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
          {state.round} manche{state.round > 1 ? 's' : ''}
        </p>
        <h2 className="mt-2 text-4xl">{WINNER_TITLES[state.winner]}</h2>
        <p className="text-muted mt-3 text-sm text-balance">{WINNER_SUBTITLES[state.winner]}</p>
      </header>

      <Panel title="Les mots">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="text-muted text-xs">Civils</p>
            <p className="font-display mt-1 text-xl font-bold">{state.pair.civil}</p>
          </div>
          <div>
            <p className="text-muted text-xs">Undercover</p>
            <p className="font-display text-accent mt-1 text-xl font-bold">
              {state.pair.undercover}
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="Qui était qui">
        <ul className="flex flex-col gap-2">
          {ordered.map((player) => (
            <li key={player.id} className="flex items-center justify-between gap-3 text-sm">
              <span className={cn('flex-1 truncate', player.eliminated && 'text-muted')}>
                {player.name}
                {player.eliminated && (
                  <span className="text-muted/60 ml-1.5 text-xs">
                    sorti manche {player.eliminatedRound}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-semibold',
                  player.role === 'civil'
                    ? 'bg-ink-edge text-muted'
                    : 'bg-accent/15 text-accent border-accent/30 border',
                )}
              >
                {ROLE_LABELS[player.role]}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </Screen>
  )
}
