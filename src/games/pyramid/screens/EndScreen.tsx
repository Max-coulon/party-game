import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { avatarForIndex } from '@/players/roster'
import { plural } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { ranking } from '../engine'
import type { PyramidState } from '../engine'

interface EndScreenProps {
  state: PyramidState
  onReplay: () => void
  onNewSetup: () => void
}

export function EndScreen({ state, onReplay, onNewSetup }: EndScreenProps) {
  const rows = ranking(state)
  const champion = rows[0]
  const total = state.players.reduce((sum, player) => sum + player.received, 0)
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
      <header className="animate-deal-in px-1 pt-4 text-center">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
          {state.slots.length} cartes retournées
        </p>
        <h2 className="mt-2 text-4xl">
          {champion && champion.received > 0
            ? `${champion.name} a tout bu.`
            : 'Personne n’a touché un verre.'}
        </h2>
        <p className="text-muted mt-3 text-sm text-balance">
          {plural(total, 'gorgée')} en tout.
        </p>
      </header>

      <Panel title="Classement">
        <ul className="flex flex-col gap-2">
          {rows.map((row) => {
            const seat = state.players.findIndex((player) => player.id === row.playerId)
            return (
            <li key={row.playerId} className="flex items-center gap-3">
              <span
                className={cn(
                  'font-display w-6 shrink-0 text-center text-lg font-bold',
                  row.rank === 1 ? 'text-accent' : 'text-muted/60',
                )}
              >
                {row.rank}
              </span>
              <span aria-hidden className="text-lg">
                {avatarForIndex(seat)}
              </span>
              <span className="min-w-0 flex-1 truncate">{row.name}</span>
              <span className="text-muted shrink-0 text-right text-xs tabular-nums">
                {plural(row.received, 'gorgée')}
                {row.given > 0 && (
                  <span className="text-muted/60 mt-0.5 block">donné {row.given}</span>
                )}
              </span>
            </li>
            )
          })}
        </ul>
      </Panel>

      <p className="text-muted/60 px-1 text-center text-xs text-balance">
        Buvez avec modération. Un verre d'eau entre deux tournées ne coûte rien.
      </p>
    </Screen>
  )
}
