import { useEffect } from 'react'
import { readStored, removeStored, writeStored } from '@/shared/lib/storage'

const key = (gameId: string) => `save:${gameId}`

export function readGameSave<T>(gameId: string): T | null {
  return readStored<T | null>(key(gameId), null)
}

export function clearGameSave(gameId: string): void {
  removeStored(key(gameId))
}

/**
 * Sauvegarde la partie en cours à chaque changement d'état : fermer l'onglet
 * au milieu d'une manche ne fait plus perdre la partie. La sauvegarde disparaît
 * dès que la partie est terminée — inutile de proposer de reprendre un écran
 * de résultats.
 */
export function useGameSave<T>(gameId: string, state: T | null, finished: boolean): void {
  useEffect(() => {
    if (state === null || finished) {
      clearGameSave(gameId)
      return
    }
    writeStored(key(gameId), state)
  }, [gameId, state, finished])
}
