export interface RosterPlayer {
  id: string
  name: string
  emoji: string
}

export const AVATARS = [
  '🦊',
  '🐙',
  '🦁',
  '🐼',
  '🦉',
  '🐸',
  '🦄',
  '🐝',
  '🦈',
  '🐨',
  '🦋',
  '🐺',
  '🦩',
  '🐯',
  '🦔',
  '🐧',
] as const

export const MAX_PLAYERS = 20
export const MAX_NAME_LENGTH = 16

/** Avatar stable : le même joueur garde son emoji d'une soirée à l'autre. */
export function avatarForIndex(index: number): string {
  return AVATARS[index % AVATARS.length] as string
}

export function normalizeName(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').slice(0, MAX_NAME_LENGTH)
}

export type NameError = 'empty' | 'duplicate' | null

/** Un nom vide ou déjà pris casse l'identification des joueurs pendant la partie. */
export function validateName(raw: string, existing: readonly string[]): NameError {
  const name = normalizeName(raw)
  if (name.length === 0) return 'empty'
  const taken = existing.some((other) => other.toLocaleLowerCase() === name.toLocaleLowerCase())
  return taken ? 'duplicate' : null
}

export const NAME_ERROR_MESSAGES: Record<Exclude<NameError, null>, string> = {
  empty: 'Entre un prénom.',
  duplicate: 'Ce prénom est déjà pris.',
}
