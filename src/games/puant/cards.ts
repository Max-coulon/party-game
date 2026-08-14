/**
 * Le jeu de cartes du Puant. Une seule carte compte vraiment : le valet de
 * pique, dont le jumeau a été retiré du paquet avant la distribution. Toutes
 * les autres finissent forcément appariées, donc la dernière carte en jeu est
 * toujours la même — c'est toute la mécanique du jeu.
 */

export type Suit = 'pique' | 'coeur' | 'carreau' | 'trefle'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'V' | 'D' | 'R' | 'A'

export interface Card {
  /** `V-pique` : stable d'une partie à l'autre, donc sérialisable tel quel. */
  id: string
  rank: Rank
  suit: Suit
}

/** 52 cartes, ou le jeu français de 32 pour finir en trois minutes. */
export type DeckSize = 52 | 32

/**
 * `color` : même valeur **et** même couleur rouge/noir — la règle classique,
 * celle qu'on oublie toujours. `rank` : même valeur seulement, pour les
 * enfants ; il faut alors retirer trois valets au lieu d'un.
 */
export type PairingRule = 'color' | 'rank'

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

export const cardId = (rank: Rank, suit: Suit): string => `${rank}-${suit}`

/** Le valet de pique : celui qui ne trouvera jamais son double. */
export const PUANT_ID = cardId('V', 'pique')

export const isRed = (card: Card): boolean => card.suit === 'coeur' || card.suit === 'carreau'

export const isPuant = (card: Card): boolean => card.id === PUANT_ID

/** Une carte se marie avec une autre valeur identique — et couleur identique. */
export function isPair(a: Card, b: Card, rule: PairingRule): boolean {
  if (a.id === b.id) return false
  if (a.rank !== b.rank) return false
  return rule === 'rank' || isRed(a) === isRed(b)
}

/** `V♠`, pour la carte dessinée. */
export const cardLabel = (card: Card): string => `${card.rank}${SUIT_SYMBOLS[card.suit]}`

/** « valet de pique », pour les lecteurs d'écran et les phrases. */
export const cardName = (card: Card): string =>
  `${RANK_NAMES[card.rank]} de ${SUIT_LABELS[card.suit]}`

/**
 * Les cartes retirées avant la donne. En couleur, seul le valet de trèfle
 * part : chaque valeur-couleur n'existe plus qu'en double exemplaire, donc
 * l'appariement d'une main est unique et se calcule sans demander l'avis du
 * joueur. En valeur seule, il faut retirer les trois autres valets pour que le
 * pique reste orphelin.
 */
function removedIds(rule: PairingRule): string[] {
  return rule === 'rank'
    ? [cardId('V', 'trefle'), cardId('V', 'coeur'), cardId('V', 'carreau')]
    : [cardId('V', 'trefle')]
}

export function buildDeck(size: DeckSize, rule: PairingRule): Card[] {
  const ranks = size === 32 ? SHORT_RANKS : RANKS
  const removed = new Set(removedIds(rule))
  const deck: Card[] = []
  for (const rank of ranks) {
    for (const suit of SUITS) {
      const id = cardId(rank, suit)
      if (removed.has(id)) continue
      deck.push({ id, rank, suit })
    }
  }
  return deck
}

/** Nombre de cartes distribuées, pour l'écran de réglages. */
export const deckCount = (size: DeckSize, rule: PairingRule): number =>
  buildDeck(size, rule).length

/** La carte de la main qui se marie avec `card`, s'il y en a une. */
export function findPartner(
  hand: readonly Card[],
  card: Card,
  rule: PairingRule,
): Card | undefined {
  return hand.find((candidate) => isPair(candidate, card, rule))
}

/**
 * La défausse d'entrée de jeu : on sort toutes les paires possibles d'un coup.
 * Le parcours est déterministe, et en règle `color` il n'existe de toute façon
 * qu'un seul appariement possible.
 */
export function extractPairs(
  cards: readonly Card[],
  rule: PairingRule,
): { kept: Card[]; pairs: Card[][] } {
  const kept: Card[] = []
  const pairs: Card[][] = []

  for (const card of cards) {
    const partner = findPartner(kept, card, rule)
    if (partner) {
      kept.splice(kept.indexOf(partner), 1)
      pairs.push([partner, card])
    } else {
      kept.push(card)
    }
  }

  return { kept, pairs }
}
