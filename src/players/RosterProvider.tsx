import { useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { usePersistentState } from '@/shared/hooks/usePersistentState'
import { uid } from '@/shared/lib/id'
import { avatarForIndex, MAX_PLAYERS, normalizeName } from './roster'
import type { RosterPlayer } from './roster'
import { RosterContext } from './rosterContext'
import type { RosterContextValue } from './rosterContext'

function isRosterPlayer(value: unknown): value is RosterPlayer {
  if (typeof value !== 'object' || value === null) return false
  const player = value as Partial<RosterPlayer>
  return typeof player.id === 'string' && typeof player.name === 'string'
}

/** Une valeur stockée d'un ancien format ne doit pas casser l'app au démarrage. */
function migrate(stored: unknown): RosterPlayer[] | null {
  if (!Array.isArray(stored)) return null
  const players = stored.filter(isRosterPlayer)
  return players.map((player, index) => ({
    id: player.id,
    name: player.name,
    emoji: player.emoji ?? avatarForIndex(index),
  }))
}

export function RosterProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = usePersistentState<RosterPlayer[]>('roster', [], migrate)

  const addPlayer = useCallback(
    (rawName: string) => {
      const name = normalizeName(rawName)
      if (name.length === 0) return
      setPlayers((current) => {
        if (current.length >= MAX_PLAYERS) return current
        const exists = current.some(
          (player) => player.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
        )
        if (exists) return current
        return [...current, { id: uid('player'), name, emoji: avatarForIndex(current.length) }]
      })
    },
    [setPlayers],
  )

  const removePlayer = useCallback(
    (id: string) => {
      setPlayers((current) => current.filter((player) => player.id !== id))
    },
    [setPlayers],
  )

  const renamePlayer = useCallback(
    (id: string, rawName: string) => {
      const name = normalizeName(rawName)
      if (name.length === 0) return
      setPlayers((current) =>
        current.map((player) => (player.id === id ? { ...player, name } : player)),
      )
    },
    [setPlayers],
  )

  const clear = useCallback(() => setPlayers([]), [setPlayers])

  const value = useMemo<RosterContextValue>(
    () => ({
      players,
      names: players.map((player) => player.name),
      addPlayer,
      removePlayer,
      renamePlayer,
      clear,
    }),
    [players, addPlayer, removePlayer, renamePlayer, clear],
  )

  return <RosterContext.Provider value={value}>{children}</RosterContext.Provider>
}
