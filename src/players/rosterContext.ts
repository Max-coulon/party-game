import { createContext, useContext } from 'react'
import type { RosterPlayer } from './roster'

export interface RosterContextValue {
  players: RosterPlayer[]
  names: string[]
  addPlayer: (name: string) => void
  removePlayer: (id: string) => void
  renamePlayer: (id: string, name: string) => void
  clear: () => void
}

/**
 * Le contexte et son hook vivent hors du fichier du provider : un module qui
 * exporte à la fois un composant et autre chose casse le Fast Refresh.
 */
export const RosterContext = createContext<RosterContextValue | null>(null)

export function useRoster(): RosterContextValue {
  const context = useContext(RosterContext)
  if (!context) throw new Error('useRoster doit être utilisé dans un RosterProvider')
  return context
}
