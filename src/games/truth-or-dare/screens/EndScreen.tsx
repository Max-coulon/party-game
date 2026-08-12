import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { avatarForIndex } from '@/players/roster'
import { plural } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { ranking } from '../engine'
import type { TodState } from '../engine'

interface EndScreenProps {
  state: TodState
  onReplay: () => void
  onNewSetup: () => void
}

export function EndScreen({ state, onReplay, onNewSetup }: EndScreenProps) {
  const rows = ranking(state)
  const bravest = rows[0]
  const chicken = [...rows].sort((a, b) => b.refusals - a.refusals)[0]

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
          {state.history.length} tours
        </p>
        <h2 className="mt-2 text-4xl">
          {bravest && bravest.completed > 0 ? `${bravest.name} n'a rien refusé.` : 'Table timide.'}
        </h2>
        {chicken && chicken.refusals > 0 && (
          <p className="text-muted mt-3 text-sm text-balance">
            {chicken.name} s'est défilé {plural(chicken.refusals, 'fois', 'fois')}.
          </p>
        )}
      </header>

      <Panel title="Qui a joué le jeu">
        <ul className="flex flex-col gap-2">
          {rows.map((row, position) => (
            <li key={row.playerIndex} className="flex items-center gap-3">
              <span
                className={cn(
                  'font-display w-6 shrink-0 text-center text-lg font-bold',
                  position === 0 ? 'text-accent' : 'text-muted/60',
                )}
              >
                {position + 1}
              </span>
              <span aria-hidden className="text-lg">
                {avatarForIndex(row.playerIndex)}
              </span>
              <span className="flex-1 truncate">{row.name}</span>
              <span className="text-muted text-right text-xs">
                {row.completed} relevé{row.completed > 1 ? 's' : ''}
                {row.refusals > 0 && <span className="text-danger"> · {row.refusals} refus</span>}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      {state.config.refusalSips > 0 && (
        <Panel title="Gorgées encaissées">
          <ul className="flex flex-col gap-2">
            {rows
              .filter((row) => row.sips > 0)
              .map((row) => (
                <li key={row.playerIndex} className="flex items-center justify-between gap-3">
                  <span className="truncate">{row.name}</span>
                  <span className="text-accent font-display font-bold">
                    {plural(row.sips, 'gorgée')}
                  </span>
                </li>
              ))}
            {rows.every((row) => row.sips === 0) && (
              <li className="text-muted text-sm">Personne n'a refusé. Chapeau.</li>
            )}
          </ul>
        </Panel>
      )}
    </Screen>
  )
}
