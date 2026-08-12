export type GameId = 'undercover' | 'never-have-i-ever' | 'truth-or-dare' | 'guess' | 'finger-picker'

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
    id: 'finger-picker',
    name: 'Tirage au doigt',
    tagline: 'Tout le monde pose un doigt. Le sort tranche.',
    accent: '#ffd166',
    path: '/tirage',
    playersLabel: '2 doigts et plus',
    minPlayers: 2,
  },
] as const

export function gameById(id: GameId): GameMeta {
  const game = GAMES.find((candidate) => candidate.id === id)
  if (!game) throw new Error(`Jeu inconnu : ${id}`)
  return game
}
