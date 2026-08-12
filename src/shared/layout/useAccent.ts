import { useEffect } from 'react'

const DEFAULT_ACCENT = '#7c5cff'

/**
 * Applique la couleur du jeu courant à toute l'app : boutons, sceau, et la
 * nappe de lumière du fond (qui vit sur `body`, donc au-dessus de tout
 * conteneur React — d'où l'écriture directe sur `documentElement`).
 */
export function useAccent(color: string | undefined): void {
  useEffect(() => {
    const root = document.documentElement
    const next = color ?? DEFAULT_ACCENT
    root.style.setProperty('--accent', next)
    root.style.setProperty('--color-accent', next)
    return () => {
      root.style.setProperty('--accent', DEFAULT_ACCENT)
      root.style.setProperty('--color-accent', DEFAULT_ACCENT)
    }
  }, [color])
}
