import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { useRoster } from './rosterContext'
import { MAX_NAME_LENGTH, MAX_PLAYERS, NAME_ERROR_MESSAGES, validateName } from './roster'
import type { NameError } from './roster'

/** Le trombinoscope de la soirée : rempli une fois, réutilisé par tous les jeux. */
export function RosterPanel() {
  const { players, names, addPlayer, removePlayer } = useRoster()
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<NameError>(null)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const problem = validateName(draft, names)
    if (problem) {
      setError(problem)
      return
    }
    addPlayer(draft)
    setDraft('')
    setError(null)
  }

  return (
    <Panel
      title="Mes joueurs"
      hint={players.length > 0 ? `${players.length}/${MAX_PLAYERS}` : undefined}
    >
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value)
            if (error) setError(null)
          }}
          maxLength={MAX_NAME_LENGTH}
          placeholder="Ajouter un prénom"
          aria-label="Ajouter un prénom"
          aria-invalid={error !== null}
          autoComplete="off"
          autoCapitalize="words"
          disabled={players.length >= MAX_PLAYERS}
          className="bg-ink border-ink-edge text-chalk placeholder:text-muted/60 min-h-11 flex-1 rounded-xl border px-3 text-sm outline-none focus:border-[var(--accent)] disabled:opacity-40"
        />
        <Button type="submit" size="sm" disabled={draft.trim().length === 0}>
          Ajouter
        </Button>
      </form>

      {error && (
        <p role="alert" className="text-danger mt-2 text-xs">
          {NAME_ERROR_MESSAGES[error]}
        </p>
      )}

      {players.length === 0 ? (
        <p className="text-muted mt-3 text-xs">
          Enregistre les prénoms une fois : chaque jeu te les proposera ensuite.
        </p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {players.map((player) => (
            <li key={player.id}>
              <button
                type="button"
                onClick={() => removePlayer(player.id)}
                aria-label={`Retirer ${player.name}`}
                className="bg-ink border-ink-edge text-chalk flex min-h-9 items-center gap-1.5 rounded-full border pr-2 pl-3 text-sm"
              >
                <span aria-hidden>{player.emoji}</span>
                {player.name}
                <span aria-hidden className="text-muted px-1 leading-none">
                  ×
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
