import { defaultRng, shuffle } from '@/shared/lib/random'
import type { Rng } from '@/shared/lib/random'
import { buildDeck, sortHand } from './cards'
import type { Card, DeckSize, Rank } from './cards'

/**
 * La Pyramide — un triangle de cartes face cachée au centre de la table, le
 * reste du paquet dans les mains. On retourne du sommet vers la base : un
 * rang, autant de gorgées. Qui a la même valeur la joue et désigne quelqu'un.
 */

export type PyramidRows = 4 | 5 | 6 | 7
export type Phase = 'deal' | 'play' | 'give' | 'end'

export interface PyramidRules {
  rows: PyramidRows
  deckSize: DeckSize
  /**
   * Chaque carte encore en main à la fin se paie d'une gorgée. C'est ce qui
   * empêche de garder un as « au cas où » jusqu'au bout.
   */
  leftoverSips: boolean
}

export interface PyramidPlayer {
  id: string
  name: string
  hand: Card[]
  given: number
  received: number
}

export interface PyramidSlot {
  card: Card
  /** 1 au sommet, `rows` à la base. C'est aussi le nombre de gorgées. */
  row: number
  revealed: boolean
}

export interface Gift {
  fromId: string
  toId: string
  card: Card
  sips: number
  /** `leftover` : les cartes qu'on n'a pas osé jouer. */
  source: 'pyramid' | 'leftover'
}

export interface PyramidState {
  phase: Phase
  rules: PyramidRules
  players: PyramidPlayer[]
  slots: PyramidSlot[]
  /**
   * Carte dont on s'occupe. `-1` tant que rien n'a été retourné. Après le
   * dernier retournement, il reste ce curseur le temps des dernières dons.
   */
  cursor: number
  /** Qui découvre sa main, à la distribution. */
  dealIndex: number
  giverId: string | null
  lastGift: Gift | null
  history: Gift[]
}

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 12
export const ROW_OPTIONS: readonly PyramidRows[] = [4, 5, 6, 7]

export const DEFAULT_RULES: PyramidRules = {
  rows: 5,
  deckSize: 52,
  leftoverSips: true,
}

export const pyramidCount = (rows: number): number => (rows * (rows + 1)) / 2

export function isSetupValid(playerCount: number, rules: PyramidRules): boolean {
  if (playerCount < MIN_PLAYERS || playerCount > MAX_PLAYERS) return false
  return pyramidCount(rules.rows) + playerCount <= rules.deckSize
}

export const playerById = (state: PyramidState, id: string): PyramidPlayer | undefined =>
  state.players.find((player) => player.id === id)

export const currentSlot = (state: PyramidState): PyramidSlot | undefined =>
  state.cursor >= 0 ? state.slots[state.cursor] : undefined

export const currentRank = (state: PyramidState): Rank | undefined => {
  const slot = currentSlot(state)
  return slot?.revealed ? slot.card.rank : undefined
}

export const matchingCards = (hand: readonly Card[], rank: Rank): Card[] =>
  hand.filter((card) => card.rank === rank)

export const hasRank = (player: PyramidPlayer, rank: Rank): boolean =>
  player.hand.some((card) => card.rank === rank)

export const sipsFor = (slot: PyramidSlot): number => slot.row

export const unrevealedCount = (state: PyramidState): number =>
  state.slots.filter((slot) => !slot.revealed).length

export interface Ranking {
  playerId: string
  name: string
  received: number
  given: number
  leftover: number
  rank: number
}

/** Classement par gorgées reçues, ex æquo au même rang. */
export function ranking(state: PyramidState): Ranking[] {
  const rows = state.players
    .map((player) => ({
      playerId: player.id,
      name: player.name,
      received: player.received,
      given: player.given,
      leftover: player.hand.length,
    }))
    .sort((left, right) => right.received - left.received || right.leftover - left.leftover)

  let lastReceived: number | null = null
  let lastRank = 0
  return rows.map((row, position) => {
    const rank = row.received === lastReceived ? lastRank : position + 1
    lastReceived = row.received
    lastRank = rank
    return { ...row, rank }
  })
}

function dealHands(names: readonly string[], rest: readonly Card[]): PyramidPlayer[] {
  const piles: Card[][] = names.map(() => [])
  rest.forEach((card, index) => {
    piles[index % names.length]?.push(card)
  })
  return names.map((name, index) => ({
    id: `p${index}`,
    name,
    hand: piles[index] ?? [],
    given: 0,
    received: 0,
  }))
}

function buildSlots(cards: readonly Card[], rows: number): PyramidSlot[] {
  const slots: PyramidSlot[] = []
  let index = 0
  for (let row = 1; row <= rows; row += 1) {
    for (let column = 0; column < row; column += 1) {
      const card = cards[index]
      if (!card) return slots
      slots.push({ card, row, revealed: false })
      index += 1
    }
  }
  return slots
}

function applyLeftovers(state: PyramidState): PyramidState {
  if (!state.rules.leftoverSips) {
    return { ...state, phase: 'end', giverId: null }
  }

  const extras: Gift[] = []
  const players = state.players.map((player) => {
    const leftover = player.hand.length
    if (leftover === 0) return player
    extras.push(
      ...player.hand.map((card) => ({
        fromId: player.id,
        toId: player.id,
        card,
        sips: 1,
        source: 'leftover' as const,
      })),
    )
    return { ...player, received: player.received + leftover }
  })

  return {
    ...state,
    phase: 'end',
    giverId: null,
    players,
    history: [...state.history, ...extras],
  }
}

export function createGame(
  names: readonly string[],
  rules: PyramidRules,
  rng: Rng = defaultRng,
): PyramidState {
  const deck = shuffle(buildDeck(rules.deckSize), rng)
  const count = pyramidCount(rules.rows)
  const slots = buildSlots(deck.slice(0, count), rules.rows)
  const players = dealHands(names, deck.slice(count))

  return {
    phase: 'deal',
    rules,
    players,
    slots,
    cursor: -1,
    dealIndex: 0,
    giverId: null,
    lastGift: null,
    history: [],
  }
}

export type PyramidAction =
  | { type: 'seenHand' }
  | { type: 'flip' }
  | { type: 'claim'; playerId: string }
  | { type: 'give'; targetId: string }
  | { type: 'cancelGive' }

export function pyramidReducer(state: PyramidState, action: PyramidAction): PyramidState {
  switch (action.type) {
    case 'seenHand': {
      if (state.phase !== 'deal') return state
      const next = state.dealIndex + 1
      if (next >= state.players.length) {
        return { ...state, phase: 'play', dealIndex: next }
      }
      return { ...state, dealIndex: next }
    }

    case 'flip': {
      if (state.phase !== 'play') return state
      const next = state.slots.findIndex((slot) => !slot.revealed)
      if (next === -1) return applyLeftovers(state)
      return {
        ...state,
        cursor: next,
        lastGift: null,
        slots: state.slots.map((slot, index) =>
          index === next ? { ...slot, revealed: true } : slot,
        ),
      }
    }

    case 'claim': {
      if (state.phase !== 'play') return state
      const rank = currentRank(state)
      const player = playerById(state, action.playerId)
      if (!rank || !player || !hasRank(player, rank)) return state
      return { ...state, phase: 'give', giverId: player.id }
    }

    case 'give': {
      if (state.phase !== 'give' || !state.giverId) return state
      const rank = currentRank(state)
      const slot = currentSlot(state)
      const giver = playerById(state, state.giverId)
      const target = playerById(state, action.targetId)
      if (!rank || !slot || !giver || !target) return state
      if (target.id === giver.id) return state

      const played = matchingCards(giver.hand, rank)[0]
      if (!played) return state

      const sips = sipsFor(slot)
      const gift: Gift = {
        fromId: giver.id,
        toId: target.id,
        card: played,
        sips,
        source: 'pyramid',
      }

      return {
        ...state,
        phase: 'play',
        giverId: null,
        lastGift: gift,
        history: [...state.history, gift],
        players: state.players.map((player) => {
          if (player.id === giver.id) {
            return {
              ...player,
              hand: player.hand.filter((card) => card.id !== played.id),
              given: player.given + sips,
            }
          }
          if (player.id === target.id) {
            return { ...player, received: player.received + sips }
          }
          return player
        }),
      }
    }

    case 'cancelGive': {
      if (state.phase !== 'give') return state
      return { ...state, phase: 'play', giverId: null }
    }

    default:
      return state
  }
}

/** Main triée, pour l'affichage seulement. */
export const visibleHand = (player: PyramidPlayer): Card[] => sortHand(player.hand)
