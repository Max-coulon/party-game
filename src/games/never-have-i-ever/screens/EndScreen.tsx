import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { avatarForIndex } from '@/players/roster'
import { plural } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { ranking } from '../engine'
import type { NheState } from '../engine'

interface EndScreenProps {
  state: NheState
  onReplay: () => void
  onNewSetup: () => void
}

export function EndScreen({ state, onReplay, onNewSetup }: EndScreenProps) {
  const rows = ranking(state)
  const champion = rows[0]
  const totalSips = state.scores.reduce((sum, score) => sum + score, 0)

  return (
    <Screen
      footer={
        <>
          <Button full onClick={onReplay}>
            Relancer une série
          </Button>
          <Button full variant="ghost" size="md" onClick={onNewSetup}>
            Changer les réglages
          </Button>
        </>
      }
    >
      <header className="animate-deal-in px-1 pt-4 text-center">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
          {state.deck.length} questions
        </p>
        <h2 className="mt-2 text-4xl">
          {champion && champion.sips > 0 ? `${champion.name} a tout vécu.` : 'Personne n’a craqué.'}
        </h2>
        <p className="text-muted mt-3 text-sm text-balance">
          {champion && champion.sips > 0
            ? `${plural(champion.sips, 'gorgée')} au compteur. Cul sec pour la route.`
            : `${plural(totalSips, 'gorgée')} en tout. Il faudra monter l’intensité.`}
        </p>
      </header>

      <Panel title="Classement">
        <ul className="flex flex-col gap-2">
          {rows.map((row) => (
            <li key={row.playerIndex} className="flex items-center gap-3">
              <span
                className={cn(
                  'font-display w-6 shrink-0 text-center text-lg font-bold',
                  row.rank === 1 ? 'text-accent' : 'text-muted/60',
                )}
              >
                {row.rank}
              </span>
              <span aria-hidden className="text-lg">
                {avatarForIndex(row.playerIndex)}
              </span>
              <span className="flex-1 truncate">{row.name}</span>
              <span className="text-muted text-sm tabular-nums">{plural(row.sips, 'gorgée')}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <p className="text-muted/60 px-1 text-center text-xs text-balance">
        Buvez avec modération. Un verre d'eau entre deux tournées ne coûte rien.
      </p>
    </Screen>
  )
}
