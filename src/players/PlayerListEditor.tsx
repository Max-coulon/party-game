import { useEffect, useRef, useState } from 'react'
import type { FormEvent, PointerEvent as ReactPointerEvent } from 'react'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/cn'
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
  /** Liste en colonne réordonnable au doigt : pour les jeux où l'ordre compte. */
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
        <OrderableList names={names} onChange={onChange} onRemove={remove} />
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

interface OrderableListProps {
  names: string[]
  onChange: (names: string[]) => void
  onRemove: (index: number) => void
}

function swapped(names: readonly string[], from: number, to: number): string[] {
  const next = [...names]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved as string)
  return next
}

/**
 * Réordonnancement au doigt. Les écouteurs vivent sur `window` et l'état du
 * geste dans une ref : la ligne saisie est déplacée dans le DOM à chaque
 * croisement, elle ne peut donc pas porter la capture du pointeur.
 */
function OrderableList({ names, onChange, onRemove }: OrderableListProps) {
  const listRef = useRef<HTMLOListElement>(null)
  // Le geste lit la liste à jour sans dépendre du cycle de rendu : un
  // pointermove peut arriver avant que React n'ait commité l'échange précédent.
  const namesRef = useRef(names)
  useEffect(() => {
    namesRef.current = names
  }, [names])

  const gesture = useRef({ pointerY: 0, index: 0, step: 0 })
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [offset, setOffset] = useState(0)

  const dragging = dragIndex !== null

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= names.length) return
    onChange(swapped(names, index, target))
  }

  const startDrag = (index: number, event: ReactPointerEvent<HTMLElement>) => {
    const rows = listRef.current?.children
    if (!rows || rows.length < 2) return
    const row = rows[index] as HTMLElement | undefined
    const neighbour = (rows[1] as HTMLElement).offsetTop - (rows[0] as HTMLElement).offsetTop
    if (!row) return
    // Le pas inclut l'écart entre deux lignes : on le mesure au lieu de le supposer.
    gesture.current = { pointerY: event.clientY, index, step: Math.abs(neighbour) || row.offsetHeight }
    setDragIndex(index)
    setOffset(0)
  }

  useEffect(() => {
    if (!dragging) return

    const handleMove = (event: PointerEvent) => {
      const { step } = gesture.current
      let index = gesture.current.index
      let dy = event.clientY - gesture.current.pointerY
      let list = namesRef.current
      let reordered = false

      // Une ligne franchie = un échange, et le repère glisse d'autant.
      while (dy > step / 2 && index < list.length - 1) {
        list = swapped(list, index, index + 1)
        index += 1
        gesture.current.pointerY += step
        dy -= step
        reordered = true
      }
      while (dy < -step / 2 && index > 0) {
        list = swapped(list, index, index - 1)
        index -= 1
        gesture.current.pointerY -= step
        dy += step
        reordered = true
      }

      // En butée, la ligne ne suit plus le doigt : sinon elle dérive hors de la
      // liste, et il faudrait revenir sur toute la sur-course pour la rebouger.
      const limit = step / 2
      if (dy > limit) {
        gesture.current.pointerY += dy - limit
        dy = limit
      } else if (dy < -limit) {
        gesture.current.pointerY += dy + limit
        dy = -limit
      }

      gesture.current.index = index
      if (reordered) {
        namesRef.current = list
        onChange(list)
      }
      setDragIndex(index)
      setOffset(dy)
    }

    const stop = () => {
      setDragIndex(null)
      setOffset(0)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
  }, [dragging, onChange])

  return (
    <ol ref={listRef} className="flex flex-col gap-2">
      {names.map((name, index) => {
        const held = index === dragIndex
        return (
          <li
            key={name}
            style={held ? { transform: `translateY(${offset}px)` } : undefined}
            className={cn(
              'bg-ink-raised border-ink-edge relative flex min-h-12 items-center gap-1 rounded-2xl border pr-1 pl-1',
              held && 'border-accent z-10 shadow-lg',
            )}
          >
            <button
              type="button"
              onPointerDown={(event) => startDrag(index, event)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowUp') {
                  event.preventDefault()
                  move(index, -1)
                } else if (event.key === 'ArrowDown') {
                  event.preventDefault()
                  move(index, 1)
                }
              }}
              aria-label={`Déplacer ${name}, position ${index + 1} sur ${names.length}. Flèches haut et bas pour changer l'ordre.`}
              className={cn(
                'text-muted flex h-11 w-8 touch-none items-center justify-center text-base leading-none select-none',
                held ? 'text-accent cursor-grabbing' : 'cursor-grab',
              )}
            >
              <span aria-hidden>⠿</span>
            </button>
            <span aria-hidden className="text-muted w-4 text-xs tabular-nums">
              {index + 1}
            </span>
            <span aria-hidden>{avatarForIndex(index)}</span>
            <span className="text-chalk flex-1 truncate pl-1 text-sm">{name}</span>
            <button
              type="button"
              onClick={() => onRemove(index)}
              aria-label={`Retirer ${name}`}
              className="text-muted flex h-10 w-9 items-center justify-center text-lg leading-none"
            >
              <span aria-hidden>×</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
