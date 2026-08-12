import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/shared/ui/Button'
import { useRoster } from './rosterContext'
import {
  MAX_NAME_LENGTH,
  MAX_PLAYERS,
  NAME_ERROR_MESSAGES,
  avatarForIndex,
  normalizeName,
  validateName,
} from './roster'
import type { NameError } from './roster'

interface PlayerListEditorProps {
  names: string[]
  onChange: (names: string[]) => void
  minPlayers: number
  /** Ajoute aussi le joueur au trombinoscope réutilisable entre les jeux. */
  syncToRoster?: boolean
}

export function PlayerListEditor({
  names,
  onChange,
  minPlayers,
  syncToRoster = true,
}: PlayerListEditorProps) {
  const { players: rosterPlayers, addPlayer: addToRoster } = useRoster()
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<NameError>(null)

  const full = names.length >= MAX_PLAYERS

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const problem = validateName(draft, names)
    if (problem) {
      setError(problem)
      return
    }
    const name = normalizeName(draft)
    onChange([...names, name])
    if (syncToRoster) addToRoster(name)
    setDraft('')
    setError(null)
  }

  const remove = (index: number) => {
    onChange(names.filter((_, i) => i !== index))
  }

  const importRoster = () => {
    const missing = rosterPlayers
      .map((player) => player.name)
      .filter(
        (name) =>
          !names.some((existing) => existing.toLocaleLowerCase() === name.toLocaleLowerCase()),
      )
    onChange([...names, ...missing].slice(0, MAX_PLAYERS))
  }

  const missingCount = minPlayers - names.length

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value)
            if (error) setError(null)
          }}
          maxLength={MAX_NAME_LENGTH}
          placeholder="Prénom"
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="done"
          aria-label="Prénom du joueur"
          aria-invalid={error !== null}
          disabled={full}
          className="bg-ink-raised border-ink-edge text-chalk placeholder:text-muted/60 min-h-12 flex-1 rounded-2xl border px-4 outline-none focus:border-[var(--accent)] disabled:opacity-40"
        />
        <Button type="submit" size="md" disabled={full || draft.trim().length === 0}>
          Ajouter
        </Button>
      </form>

      {error && (
        <p role="alert" className="text-danger -mt-2 px-1 text-xs">
          {NAME_ERROR_MESSAGES[error]}
        </p>
      )}
      {full && <p className="text-muted -mt-2 px-1 text-xs">Maximum {MAX_PLAYERS} joueurs.</p>}

      {names.length === 0 && rosterPlayers.length > 0 && (
        <Button variant="secondary" size="md" onClick={importRoster}>
          Reprendre mes {rosterPlayers.length} joueurs
        </Button>
      )}

      <ul className="flex flex-wrap gap-2">
        {names.map((name, index) => (
          <li key={`${name}-${index}`}>
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={`Retirer ${name}`}
              className="bg-ink-raised border-ink-edge text-chalk flex min-h-10 items-center gap-2 rounded-full border pr-2 pl-3 text-sm"
            >
              <span aria-hidden>{avatarForIndex(index)}</span>
              {name}
              <span aria-hidden className="text-muted px-1 text-base leading-none">
                ×
              </span>
            </button>
          </li>
        ))}
      </ul>

      {missingCount > 0 && (
        <p className="text-muted px-1 text-xs">
          Encore {missingCount} joueur{missingCount > 1 ? 's' : ''} pour lancer la partie.
        </p>
      )}
    </div>
  )
}
