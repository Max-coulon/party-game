import { useCallback, useEffect, useRef, useState } from 'react'

export type CountdownStatus = 'idle' | 'running' | 'paused' | 'expired'

interface CountdownOptions {
  /** Appelé une seule fois quand le compte à rebours atteint zéro. */
  onExpire?: () => void
}

export interface Countdown {
  status: CountdownStatus
  /** Secondes restantes, arrondies au supérieur (ce qu'on affiche). */
  secondsLeft: number
  /** Millisecondes restantes, pour les barres de progression. */
  msLeft: number
  start: () => void
  pause: () => void
  resume: () => void
  /** Remet à `durationSeconds` (ou à la durée passée) et repasse en `idle`. */
  reset: (durationSeconds?: number) => void
}

const TICK_MS = 100

/**
 * Compte à rebours basé sur une échéance absolue plutôt que sur une
 * décrémentation. Un onglet mis en arrière-plan bride les timers : décrémenter
 * dérive, comparer à `Date.now()` non. Le temps est donc juste au retour.
 */
export function useCountdown(durationSeconds: number, options: CountdownOptions = {}): Countdown {
  const { onExpire } = options

  const [status, setStatus] = useState<CountdownStatus>('idle')
  const [msLeft, setMsLeft] = useState(durationSeconds * 1000)

  const deadlineRef = useRef<number | null>(null)
  const remainingRef = useRef(durationSeconds * 1000)
  const onExpireRef = useRef(onExpire)
  const statusRef = useRef(status)

  // Les refs se mettent à jour après le rendu : y écrire pendant le rendu est
  // impur et se voit dès qu'un rendu est rejoué ou abandonné.
  useEffect(() => {
    onExpireRef.current = onExpire
    statusRef.current = status
  })

  // Changer la durée alors que rien ne tourne réinitialise l'affichage.
  useEffect(() => {
    if (deadlineRef.current === null) {
      remainingRef.current = durationSeconds * 1000
      setMsLeft(durationSeconds * 1000)
    }
  }, [durationSeconds])

  useEffect(() => {
    if (status !== 'running') return

    const tick = () => {
      const deadline = deadlineRef.current
      if (deadline === null) return
      const left = deadline - Date.now()
      if (left <= 0) {
        deadlineRef.current = null
        remainingRef.current = 0
        setMsLeft(0)
        setStatus('expired')
        onExpireRef.current?.()
        return
      }
      setMsLeft(left)
    }

    const interval = window.setInterval(tick, TICK_MS)
    // Au retour d'un arrière-plan, on recale immédiatement au lieu d'attendre.
    document.addEventListener('visibilitychange', tick)
    tick()

    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [status])

  const start = useCallback(() => {
    remainingRef.current = durationSeconds * 1000
    deadlineRef.current = Date.now() + remainingRef.current
    setMsLeft(remainingRef.current)
    setStatus('running')
  }, [durationSeconds])

  // La mise à jour des refs vit hors des updaters de `setStatus` : React peut
  // rejouer un updater (mode strict, rendu concurrent), et une pause rejouée
  // lirait une échéance déjà remise à zéro — le chrono tomberait à 0:00.
  const pause = useCallback(() => {
    if (statusRef.current !== 'running') return
    const deadline = deadlineRef.current
    remainingRef.current = deadline === null ? 0 : Math.max(0, deadline - Date.now())
    deadlineRef.current = null
    setMsLeft(remainingRef.current)
    setStatus('paused')
  }, [])

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused') return
    deadlineRef.current = Date.now() + remainingRef.current
    setStatus('running')
  }, [])

  const reset = useCallback(
    (nextDurationSeconds?: number) => {
      const ms = (nextDurationSeconds ?? durationSeconds) * 1000
      deadlineRef.current = null
      remainingRef.current = ms
      setMsLeft(ms)
      setStatus('idle')
    },
    [durationSeconds],
  )

  return {
    status,
    msLeft,
    secondsLeft: Math.ceil(msLeft / 1000),
    start,
    pause,
    resume,
    reset,
  }
}
