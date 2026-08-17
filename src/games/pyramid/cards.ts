/**
 * Le paquet de la Pyramide. Quatre cartes partent en main, une par une, le
 * triangle se pose avec ce qui reste. Rien n'est retiré avant la donne.
 */

export type Suit = 'pique' | 'coeur' | 'carreau' | 'trefle'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'V' | 'D' | 'R' | 'A'
export type DeckSize = 52 | 32

export interface Card {
  /** `R-coeur` : stable d'une partie à l'autre, donc sérialisable tel quel. */
  id: string
  rank: Rank
  suit: Suit
}

export const SUITS: readonly Suit[] = ['pique', 'coeur', 'carreau', 'trefle']

export const SUIT_SYMBOLS: Record<Suit, string> = {
  pique: '♠',
  coeur: '♥',
  carreau: '♦',
  trefle: '♣',
}

export const SUIT_LABELS: Record<Suit, string> = {
  pique: 'pique',
  coeur: 'cœur',
  carreau: 'carreau',
  trefle: 'trèfle',
}

const RANKS: readonly Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'V', 'D', 'R', 'A']

/** Le jeu français de 32 commence au 7. */
const SHORT_RANKS: readonly Rank[] = ['7', '8', '9', '10', 'V', 'D', 'R', 'A']

const RANK_NAMES: Record<Rank, string> = {
  '2': 'deux',
  '3': 'trois',
  '4': 'quatre',
  '5': 'cinq',
  '6': 'six',
  '7': 'sept',
  '8': 'huit',
  '9': 'neuf',
  '10': 'dix',
  V: 'valet',
  D: 'dame',
  R: 'roi',
  A: 'as',
}

export const RANK_ORDER: Record<Rank, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  V: 11,
  D: 12,
  R: 13,
  A: 14,
}

export const cardId = (rank: Rank, suit: Suit): string => `${rank}-${suit}`

export const isRed = (card: Card): boolean => card.suit === 'coeur' || card.suit === 'carreau'

/** `R♥`, pour la carte dessinée. */
export const cardLabel = (card: Card): string => `${card.rank}${SUIT_SYMBOLS[card.suit]}`

/** « roi de cœur », pour les lecteurs d'écran et les phrases. */
export const cardName = (card: Card): string =>
  `${RANK_NAMES[card.rank]} de ${SUIT_LABELS[card.suit]}`

/** « un roi », « un as » — ce qu'on demande à la table. */
export const rankName = (rank: Rank): string => RANK_NAMES[rank]

/** « un as », « une dame » — pour les phrases de la table. */
export const rankPhrase = (rank: Rank): string => {
  if (rank === 'D') return 'une dame'
  if (rank === 'A') return 'un as'
  return `un ${RANK_NAMES[rank]}`
}

export function buildDeck(size: DeckSize): Card[] {
  const ranks = size === 32 ? SHORT_RANKS : RANKS
  const deck: Card[] = []
  for (const rank of ranks) {
    for (const suit of SUITS) {
      deck.push({ id: cardId(rank, suit), rank, suit })
    }
  }
  return deck
}

export const deckCount = (size: DeckSize): number => buildDeck(size).length

/** Même valeur d'abord, pique-cœur-carreau-trèfle ensuite : une main lisible. */
export function sortHand(cards: readonly Card[]): Card[] {
  return cards.slice().sort((left, right) => {
    const byRank = RANK_ORDER[left.rank] - RANK_ORDER[right.rank]
    if (byRank !== 0) return byRank
    return SUITS.indexOf(left.suit) - SUITS.indexOf(right.suit)
  })
}
