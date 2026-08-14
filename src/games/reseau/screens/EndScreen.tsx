import { useEffect, useState } from 'react'
import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { plural } from '@/shared/lib/format'
import { TEAM_LABELS, other } from '../engine'
import type { ClueRecord, ReseauState } from '../engine'
import { TEAM_COLORS } from '../palette'
import { Board } from './Board'
import { ScoreBar } from './ScoreBar'

interface EndScreenProps {
  state: ReseauState
  onReplay: () => void
  onNewSetup: () => void
}

const OUTCOMES: Record<NonNullable<ClueRecord['outcome']>, string> = {
  gagne: 'partie gagnée',
  taupe: 'la taupe',
  adversaire: 'carte adverse',
  neutre: 'un passant',
  quota: 'quota épuisé',
  passe: 'arrêt volontaire',
}

export function EndScreen({ state, onReplay, onNewSetup }: EndScreenProps) {
  const byTaupe = state.endReason === 'taupe'
  const [flash, setFlash] = useState(byTaupe)

  useEffect(() => {
    if (!byTaupe) return
    navigator.vibrate?.([50, 70, 140])
    const timer = window.setTimeout(() => setFlash(false), 1800)
    return () => window.clearTimeout(timer)
  }, [byTaupe])

  const winner = state.winner
  const loser = winner ? other(winner) : null
  const color = winner ? TEAM_COLORS[winner] : 'var(--accent)'

  // La clé complète tombe à la fin : les perdants ont le droit de voir de
  // quel cheveu tenait leur défaite.
  const revealed = state.cards.map((card) => ({ ...card, revealed: true }))

  return (
    <>
      {flash && (
        <div
          aria-hidden
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        >
          <span
            className="animate-flood absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, #6b0f24 0%, #1b0410 55%, #05040a 100%)',
            }}
          />
          <div className="animate-shake relative px-6 text-center">
            <p className="font-display text-6xl leading-none font-black text-[#ff5470]">
              LA TAUPE
            </p>
            <p className="text-chalk/70 mt-4 text-sm tracking-[0.2em] uppercase">
              Réseau {loser ? TEAM_LABELS[loser] : ''} grillé
            </p>
          </div>
        </div>
      )}

      <Screen
        footer={
          <>
            <Button full onClick={onReplay}>
              Nouvelle grille
            </Button>
            <Button full variant="ghost" size="md" onClick={onNewSetup}>
              Changer les chefs de réseau
            </Button>
          </>
        }
      >
        <header className="animate-deal-in px-1 pt-3 text-center">
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase"
            style={{ color }}
          >
            {state.round} tours
          </p>
          <h2 className="mt-2 text-4xl">
            {winner ? `Le réseau ${TEAM_LABELS[winner]} l'emporte.` : 'Terminé.'}
          </h2>
          <p className="text-muted mt-3 text-sm text-balance">
            {byTaupe
              ? `${loser ? TEAM_LABELS[loser] : ''} a retourné la taupe. La partie s'arrête là, quoi qu'il restait à trouver.`
              : 'Tous ses agents retrouvés avant l’autre camp.'}
          </p>
        </header>

        <ScoreBar state={state} showTurn={false} />

        <Board cards={revealed} selected={null} showKey={false} />

        {state.history.length > 0 && (
          <Panel title="Les indices" hint={`${state.history.length}`}>
            <ul className="flex flex-col gap-2.5">
              {state.history.map((record, index) => (
                <li key={`${record.word}-${index}`} className="flex items-center gap-3 text-sm">
                  <span
                    aria-hidden
                    className="h-6 w-1 shrink-0 rounded-full"
                    style={{ background: TEAM_COLORS[record.team] }}
                  />
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-semibold uppercase">{record.word}</span>
                    <span className="text-muted"> · {record.count === 0 ? '∞' : record.count}</span>
                  </span>
                  <span className="text-muted shrink-0 text-xs">
                    {plural(record.found, 'trouvé')} · {record.outcome ? OUTCOMES[record.outcome] : ''}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </Screen>
    </>
  )
}
