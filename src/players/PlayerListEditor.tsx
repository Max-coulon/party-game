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
  /** Affiche la liste en colonne avec des flèches : pour les jeux où l'ordre compte. */
  orderable?: boolean
}

export function PlayerListEditor({
  names,
  onChange,
  minPlayers,
  syncToRoster = true,
  orderable = false,
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

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= names.length) return
    const next = [...names]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved as string)
    onChange(next)
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

      {orderable ? (
        <ol className="flex flex-col gap-2">
          {names.map((name, index) => (
            <li
              key={`${name}-${index}`}
              className="bg-ink-raised border-ink-edge flex min-h-12 items-center gap-1 rounded-2xl border pr-1 pl-3"
            >
              <span aria-hidden className="text-muted w-5 text-xs tabular-nums">
                {index + 1}
              </span>
              <span aria-hidden>{avatarForIndex(index)}</span>
              <span className="text-chalk flex-1 truncate pl-1 text-sm">{name}</span>
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Monter ${name}`}
                className="text-muted flex h-10 w-9 items-center justify-center text-lg leading-none disabled:opacity-25"
              >
                <span aria-hidden>↑</span>
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === names.length - 1}
                aria-label={`Descendre ${name}`}
                className="text-muted flex h-10 w-9 items-center justify-center text-lg leading-none disabled:opacity-25"
              >
                <span aria-hidden>↓</span>
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Retirer ${name}`}
                className="text-muted flex h-10 w-9 items-center justify-center text-lg leading-none"
              >
                <span aria-hidden>×</span>
              </button>
            </li>
          ))}
        </ol>
      ) : (
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
      )}

      {missingCount > 0 && (
        <p className="text-muted px-1 text-xs">
          Encore {missingCount} joueur{missingCount > 1 ? 's' : ''} pour lancer la partie.
        </p>
      )}
    </div>
  )
}
