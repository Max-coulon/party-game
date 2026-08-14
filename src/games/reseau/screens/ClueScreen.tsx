import { useState } from 'react'
import type { FormEvent } from 'react'
import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/cn'
import { MAX_CLUE_COUNT, TEAM_LABELS, clueError, other, remaining } from '../engine'
import type { ReseauState } from '../engine'
import { TEAM_COLORS } from '../palette'
import { Board } from './Board'

interface ClueScreenProps {
  state: ReseauState
  onSubmit: (word: string, count: number) => void
}

/**
 * L'écran du chef de réseau : la clé apparaît sous les mots. C'est le seul
 * moment où le téléphone quitte le centre de la table, et il n'y revient
 * qu'une fois l'indice donné — donc sans la clé à l'écran.
 */
export function ClueScreen({ state, onSubmit }: ClueScreenProps) {
  const [word, setWord] = useState('')
  const [count, setCount] = useState(2)

  const team = state.turn
  const color = TEAM_COLORS[team]
  const error = word.trim().length > 0 ? clueError(state, word) : null
  const ready = word.trim().length > 0 && error === null

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!ready) return
    onSubmit(word.trim(), count)
  }

  const step = (delta: number) =>
    setCount((current) => Math.max(0, Math.min(MAX_CLUE_COUNT, current + delta)))

  return (
    <Screen
      footer={
        <form onSubmit={submit} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              value={word}
              onChange={(event) => setWord(event.target.value)}
              placeholder="Ton indice"
              aria-label="Mot de l'indice"
              aria-invalid={error !== null}
              autoComplete="off"
              autoCorrect="off"
              maxLength={24}
              className={cn(
                'bg-ink border-ink-edge text-chalk placeholder:text-muted/60 min-h-12 min-w-0 flex-1 rounded-2xl border px-4 outline-none focus:border-[var(--accent)]',
                error && 'border-danger',
              )}
            />
            <div className="bg-ink-raised border-ink-edge flex items-center rounded-2xl border p-1">
              <button
                type="button"
                aria-label="Un mot de moins"
                onClick={() => step(-1)}
                disabled={count === 0}
                className="text-chalk h-10 w-9 rounded-xl text-xl leading-none disabled:opacity-30"
              >
                −
              </button>
              <span
                aria-live="polite"
                className="font-display min-w-8 text-center text-lg font-bold tabular-nums"
              >
                {count === 0 ? '∞' : count}
              </span>
              <button
                type="button"
                aria-label="Un mot de plus"
                onClick={() => step(1)}
                disabled={count === MAX_CLUE_COUNT}
                className="text-chalk h-10 w-9 rounded-xl text-xl leading-none disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>

          {error === 'surLaTable' ? (
            <p role="alert" className="text-danger text-xs">
              Ce mot est posé sur la table. Il en faut un autre.
            </p>
          ) : (
            <p className="text-muted/70 text-xs">
              Un seul mot, un chiffre. Zéro veut dire « autant que vous voulez ».
            </p>
          )}

          <Button type="submit" full disabled={!ready}>
            Donner l'indice
          </Button>
        </form>
      }
    >
      <header className="flex items-center justify-between gap-3 px-1 pt-1">
        <div>
          <p
            className="text-[0.65rem] font-semibold tracking-[0.25em] uppercase"
            style={{ color }}
          >
            Chef {TEAM_LABELS[team]}
          </p>
          <h2 className="mt-1 text-2xl">{state.spymasters[team]}, à toi.</h2>
        </div>
        <span className="border-danger/40 text-danger rounded-full border px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.15em] uppercase">
          Écran secret
        </span>
      </header>

      <div className="text-muted flex items-center gap-3 px-1 text-xs">
        <span className="text-chalk font-semibold" style={{ color }}>
          {remaining(state, team)} à toi
        </span>
        <span style={{ color: TEAM_COLORS[other(team)] }}>{remaining(state, other(team))} à eux</span>
        <span>7 passants</span>
        <span className="text-danger">1 taupe</span>
      </div>

      <Board cards={state.cards} selected={null} showKey />

      <p className="text-muted/60 px-1 text-center text-[0.7rem] text-balance">
        Dis ton indice à voix haute, tape-le, puis repose le téléphone au milieu de la table.
      </p>
    </Screen>
  )
}
