import { defaultRng, randomInt, shuffle } from '@/shared/lib/random'
import type { Rng } from '@/shared/lib/random'

export type FingerMode = 'pick' | 'teams'

export interface Finger {
  /** `pointerId` du navigateur : identifie le doigt tant qu'il reste posé. */
  id: number
  x: number
  y: number
}

export const FINGER_COLORS = [
  '#ffd166',
  '#2ec4b6',
  '#ff4d6d',
  '#7c5cff',
  '#ff9f1c',
  '#4cc9f0',
  '#b5e48c',
  '#f72585',
  '#90e0ef',
  '#ffadad',
] as const

export const MIN_FINGERS = 2
export const MAX_TEAMS = 5
export const COUNTDOWN_SECONDS = 3

export function colorFor(index: number): string {
  return FINGER_COLORS[index % FINGER_COLORS.length] as string
}

/** Désigne un doigt au hasard. `null` si personne n'a posé le doigt. */
export function pickWinner(ids: readonly number[], rng: Rng = defaultRng): number | null {
  if (ids.length === 0) return null
  return ids[randomInt(ids.length, rng)] as number
}

/**
 * Répartit les doigts en équipes de tailles aussi proches que possible :
 * on mélange puis on distribue une par une, comme des cartes.
 */
export function splitIntoTeams(
  ids: readonly number[],
  teamCount: number,
  rng: Rng = defaultRng,
): number[][] {
  const count = Math.max(1, Math.min(teamCount, Math.max(1, ids.length)))
  const teams: number[][] = Array.from({ length: count }, () => [])
  shuffle(ids, rng).forEach((id, index) => {
    ;(teams[index % count] as number[]).push(id)
  })
  return teams
}

/** `pointerId` → index de son équipe, pour colorer chaque doigt. */
export function teamOf(teams: readonly (readonly number[])[]): Map<number, number> {
  const map = new Map<number, number>()
  teams.forEach((team, index) => {
    for (const id of team) map.set(id, index)
  })
  return map
}
