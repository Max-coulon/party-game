import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { cn } from '@/shared/lib/cn'
import { ranking } from '../engine'
import type { GuessState } from '../engine'
import { MODES } from '../modes'

interface EndScreenProps {
  state: GuessState
  onReplay: () => void
  onNewSetup: () => void
}

export function EndScreen({ state, onReplay, onNewSetup }: EndScreenProps) {
  const rows = ranking(state)
  const winners = rows.filter((row) => row.rank === 1)
  const tie = winners.length > 1

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
          {state.config.modes.length} manche{state.config.modes.length > 1 ? 's' : ''}
        </p>
        <h2 className="mt-2 text-4xl">
          {tie
            ? 'Égalité parfaite.'
            : `${winners[0]?.team.name} l'emporte.`}
        </h2>
        <p className="text-muted mt-3 text-sm">
          {tie
            ? `${winners.map((row) => row.team.name).join(' et ')} finissent à ${winners[0]?.total} cartes.`
            : `${winners[0]?.total} cartes trouvées.`}
        </p>
      </header>

      <Panel title="Classement">
        <ul className="flex flex-col gap-3">
          {rows.map((row) => (
            <li key={row.team.id} className="flex items-center gap-3">
              <span
                className={cn(
                  'font-display w-6 shrink-0 text-center text-lg font-bold',
                  row.rank === 1 ? 'text-accent' : 'text-muted/60',
                )}
              >
                {row.rank}
              </span>
              <span
                aria-hidden
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: row.team.color }}
              />
              <span className="flex-1 truncate">{row.team.name}</span>
              <span className="font-display text-lg font-bold tabular-nums">{row.total}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Détail par manche">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-left text-xs">
              <th className="pb-2 font-medium">Équipe</th>
              {state.config.modes.map((mode, index) => (
                <th key={`${mode}-${index}`} className="pb-2 text-right font-medium">
                  {MODES[mode].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.team.id} className="border-ink-edge border-t">
                <td className="truncate py-2">{row.team.name}</td>
                {row.perRound.map((score, index) => (
                  <td key={index} className="py-2 text-right tabular-nums">
                    {score}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </Screen>
  )
}
