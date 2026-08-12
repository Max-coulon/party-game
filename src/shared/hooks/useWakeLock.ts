import { useEffect } from 'react'

interface WakeLockSentinelLike {
  release: () => Promise<void>
}

/**
 * Garde l'écran allumé pendant une partie. L'API n'existe pas partout et peut
 * être refusée : l'échec est silencieux, ce n'est qu'un confort.
 */
export function useWakeLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinelLike> }
    }
    if (!nav.wakeLock) return

    let sentinel: WakeLockSentinelLike | null = null
    let cancelled = false

    const acquire = async () => {
      try {
        const lock = await nav.wakeLock!.request('screen')
        if (cancelled) {
          void lock.release()
          return
        }
        sentinel = lock
      } catch {
        // Refusé par le navigateur (onglet caché, batterie faible) : on laisse.
      }
    }

    // Le verrou saute quand l'onglet passe en arrière-plan : on le reprend.
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void acquire()
    }

    void acquire()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibility)
      void sentinel?.release()
    }
  }, [enabled])
}
