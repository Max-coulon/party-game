import { useCallback, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'

export interface HoldBinding {
  held: boolean
  handlers: {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void
    onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void
    onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void
    onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void
    onKeyUp: (event: ReactKeyboardEvent<HTMLElement>) => void
    onBlur: () => void
    onContextMenu: (event: { preventDefault: () => void }) => void
  }
}

const HOLD_KEYS = [' ', 'Enter']

/**
 * « Maintenir pour révéler ». Le doigt qui relâche re-cache immédiatement :
 * un rôle secret ne reste jamais affiché à l'écran sans main dessus.
 * `setPointerCapture` garantit qu'on reçoit le relâchement même si le doigt
 * glisse hors de la carte.
 */
export function useHold(): HoldBinding {
  const [held, setHeld] = useState(false)

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    event.preventDefault()
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Pas de capture disponible : le pointerup global suffira.
    }
    setHeld(true)
  }, [])

  const release = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    } catch {
      // idem
    }
    setHeld(false)
  }, [])

  // Équivalent clavier : maintenir Espace ou Entrée révèle, relâcher referme.
  const onKeyDown = useCallback((event: ReactKeyboardEvent<HTMLElement>) => {
    if (!HOLD_KEYS.includes(event.key)) return
    event.preventDefault()
    setHeld(true)
  }, [])

  const onKeyUp = useCallback((event: ReactKeyboardEvent<HTMLElement>) => {
    if (!HOLD_KEYS.includes(event.key)) return
    event.preventDefault()
    setHeld(false)
  }, [])

  // Perdre le focus touche maintenue laisserait le secret affiché.
  const onBlur = useCallback(() => setHeld(false), [])

  const preventDefault = useCallback((event: { preventDefault: () => void }) => {
    event.preventDefault()
  }, [])

  return {
    held,
    handlers: {
      onPointerDown,
      onPointerUp: release,
      onPointerCancel: release,
      onKeyDown,
      onKeyUp,
      onBlur,
      onContextMenu: preventDefault,
    },
  }
}
