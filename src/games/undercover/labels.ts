import type { Role, Winner } from './engine'

export const ROLE_LABELS: Record<Role, string> = {
  civil: 'Civil',
  undercover: 'Undercover',
  mrwhite: 'Mr White',
}

export const WINNER_TITLES: Record<Winner, string> = {
  civils: 'Les civils gagnent',
  imposteurs: 'Les imposteurs gagnent',
  mrwhite: 'Mr White gagne',
}

export const WINNER_SUBTITLES: Record<Winner, string> = {
  civils: 'Plus aucun imposteur autour de la table.',
  imposteurs: 'Ils sont aussi nombreux que les civils : le vote ne peut plus les sortir.',
  mrwhite: 'Sans jamais avoir vu le mot, il l’a trouvé.',
}
