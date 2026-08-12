import { useCallback, useEffect, useState } from 'react'
import { readStored, writeStored } from '@/shared/lib/storage'

/**
 * `useState` dont la valeur survit au rechargement.
 * `migrate` permet de rejeter une valeur stockée devenue invalide (ancien
 * format, données corrompues) plutôt que de faire planter l'écran.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T,
  migrate?: (stored: unknown) => T | null,
): [T, (value: T | ((current: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = readStored<unknown>(key, null)
    if (stored === null) return initialValue
    if (migrate) return migrate(stored) ?? initialValue
    return stored as T
  })

  useEffect(() => {
    writeStored(key, value)
  }, [key, value])

  const update = useCallback((next: T | ((current: T) => T)) => {
    setValue(next)
  }, [])

  return [value, update]
}
