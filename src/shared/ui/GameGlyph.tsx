import type { ReactElement } from 'react'
import type { GameId } from '@/games/registry'

const PATHS: Record<GameId, ReactElement> = {
  // Deux cartes : la même forme, un contour différent.
  undercover: (
    <>
      <rect x="3" y="6" width="11" height="14" rx="2.5" />
      <rect x="10" y="4" width="11" height="14" rx="2.5" strokeDasharray="3 2.5" />
    </>
  ),
  // Un verre incliné, plus très plein.
  'never-have-i-ever': (
    <>
      <path d="M7 4h10l-1.4 9.5a3.6 3.6 0 0 1-7.2 0Z" />
      <path d="M12 17v3" />
      <path d="M8.6 20h6.8" />
      <path d="M7.9 9.2h8.2" />
    </>
  ),
  // Un embranchement : deux issues, une seule à choisir.
  'truth-or-dare': (
    <>
      <path d="M12 21V12" />
      <path d="M12 12 5.5 5.5" />
      <path d="M12 12 18.5 5.5" />
      <circle cx="5" cy="4.6" r="1.8" />
      <circle cx="19" cy="4.6" r="1.8" />
    </>
  ),
  // Des ondes qui partent d'un point : on décrit, ça voyage.
  guess: (
    <>
      <circle cx="5.5" cy="12" r="2" />
      <path d="M10 7.5a6.4 6.4 0 0 1 0 9" />
      <path d="M14 4.5a11 11 0 0 1 0 15" />
      <path d="M18 2a15.5 15.5 0 0 1 0 20" />
    </>
  ),
  // Des doigts posés sur l'écran, et l'un d'eux entouré.
  'finger-picker': (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="7.5" strokeDasharray="2.5 3" />
      <circle cx="12" cy="12" r="10.5" strokeDasharray="1.5 4" />
    </>
  ),
}

interface GameGlyphProps {
  id: GameId
  className?: string
}

export function GameGlyph({ id, className }: GameGlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {PATHS[id]}
    </svg>
  )
}
