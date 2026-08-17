export type GameId =
  | 'undercover'
  | 'never-have-i-ever'
  | 'truth-or-dare'
  | 'guess'
  | 'finger-picker'
  | 'puant'
  | 'pyramid'
  | 'reseau'

export interface GameMeta {
  id: GameId
  name: string
  tagline: string
  /** Couleur d'identité : suit le joueur du menu jusqu'à la fin de partie. */
  accent: string
  path: string
  playersLabel: string
  minPlayers: number
}

export const GAMES: readonly GameMeta[] = [
  {
    id: 'undercover',
    name: 'Undercover',
    tagline: 'Un mot différent, un imposteur, et personne ne sait qui.',
    accent: '#7c5cff',
    path: '/undercover',
    playersLabel: '4 à 20 joueurs',
    minPlayers: 4,
  },
  {
    id: 'never-have-i-ever',
    name: "Je n'ai jamais",
    tagline: 'Avoue ce que tu as fait, ou bois. Souvent les deux.',
    accent: '#ff4d6d',
    path: '/je-n-ai-jamais',
    playersLabel: '2 joueurs et plus',
    minPlayers: 2,
  },
  {
    id: 'truth-or-dare',
    name: 'Action ou Vérité',
    tagline: 'Choisis ton camp. Refuser se paie.',
    accent: '#ff9f1c',
    path: '/action-ou-verite',
    playersLabel: '2 joueurs et plus',
    minPlayers: 2,
  },
  {
    id: 'guess',
    name: 'Fais deviner',
    tagline: 'Décris, mime, chante. Le chrono ne pardonne pas.',
    accent: '#2ec4b6',
    path: '/fais-deviner',
    playersLabel: '4 joueurs et plus, en équipes',
    minPlayers: 4,
  },
  {
    id: 'reseau',
    name: 'Le Réseau',
    tagline: 'Un mot, un chiffre, et tout ton camp qui suit.',
    accent: '#3a9bff',
    path: '/le-reseau',
    playersLabel: '4 joueurs et plus, en deux camps',
    minPlayers: 4,
  },
  {
    id: 'puant',
    name: 'Le Puant',
    tagline: 'Une carte ne se marie avec personne. Ne finis pas avec.',
    accent: '#7fd858',
    path: '/le-puant',
    playersLabel: '3 à 8 joueurs',
    minPlayers: 3,
  },
  {
    id: 'pyramid',
    name: 'La Pyramide',
    tagline: 'Une carte se retourne. Si tu l’as, quelqu’un boit.',
    accent: '#ff6b4a',
    path: '/la-pyramide',
    playersLabel: '2 à 12 joueurs',
    minPlayers: 2,
  },
  {
    id: 'finger-picker',
    name: 'Chooser',
    tagline: 'Tout le monde pose un doigt. Le sort tranche.',
    accent: '#ffd166',
    path: '/chooser',
    playersLabel: '2 doigts et plus',
    minPlayers: 2,
  },
] as const

export function gameById(id: GameId): GameMeta {
  const game = GAMES.find((candidate) => candidate.id === id)
  if (!game) throw new Error(`Jeu inconnu : ${id}`)
  return game
}
