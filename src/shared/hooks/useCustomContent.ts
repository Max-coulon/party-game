import { useCallback } from 'react'
import { usePersistentState } from './usePersistentState'

interface Identified {
  id: string
}

export interface CustomContent<T extends Identified> {
  items: T[]
  add: (item: T) => void
  remove: (id: string) => void
  clear: () => void
}

/**
 * Contenus ajoutés par les joueurs (questions, gages, mots), conservés d'une
 * soirée à l'autre.
 */
export function useCustomContent<T extends Identified>(key: string): CustomContent<T> {
  const [items, setItems] = usePersistentState<T[]>(key, [], (stored) =>
    Array.isArray(stored) ? (stored as T[]) : null,
  )

  const add = useCallback(
    (item: T) => {
      setItems((current) => [...current, item])
    },
    [setItems],
  )

  const remove = useCallback(
    (id: string) => {
      setItems((current) => current.filter((item) => item.id !== id))
    },
    [setItems],
  )

  const clear = useCallback(() => setItems([]), [setItems])

  return { items, add, remove, clear }
}
