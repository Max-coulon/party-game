import { defaultRng, shuffle } from '@/shared/lib/random'
import type { Rng } from '@/shared/lib/random'
import { RANK_ORDER, SUIT_LABELS, isRed, rankName, sortHand } from './cards'
import type { Card, DeckSize, Rank, Suit } from './cards'
import { buildDeck } from './cards'

/**
 * La Pyramide. D'abord quatre cartes, une par une : couleur, plus ou moins,
 * inter ou exter, puis le signe. Qui trouve distribue une gorgée, qui se
 * trompe boit. Ensuite le triangle au centre. Qui dit avoir la valeur désigne
 * quelqu'un — et celui-là peut l'accuser de mentir. Menteur démasqué, ou
 * vérité montrée : la mise double.
 */

export type PyramidRows = 4 | 5 | 6 | 7
export type Phase = 'deal' | 'play' | 'give' | 'challenge' | 'end'
export type DealStep = 'guess' | 'reveal' | 'give'
export type DealKind = 'couleur' | 'plusMoins' | 'interExter' | 'signe'

export type DealGuess =
  | { kind: 'couleur'; value: 'rouge' | 'noir' }
  | { kind: 'plusMoins'; value: 'plus' | 'moins' }
  | { kind: 'interExter'; value: 'inter' | 'exter' }
  | { kind: 'signe'; value: Suit }

export type GiftOutcome = 'dealHit' | 'dealMiss' | 'accepted' | 'shown' | 'lied'

export interface PyramidRules {
  rows: PyramidRows
  deckSize: DeckSize
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
  card: Card | null
  sips: number
  source: 'deal' | 'pyramid'
  outcome: GiftOutcome
}

export interface PyramidState {
  phase: Phase
  rules: PyramidRules
  players: PyramidPlayer[]
  slots: PyramidSlot[]
  drawPile: Card[]
  cursor: number
  dealIndex: number
  dealCardIndex: number
  dealStep: DealStep
  pendingCard: Card | null
  pendingGuess: DealGuess | null
  pendingCorrect: boolean | null
  giverId: string | null
  targetId: string | null
  lastGift: Gift | null
  history: Gift[]
}

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 10
export const HAND_SIZE = 4
export const DEAL_SIPS = 1
export const ROW_OPTIONS: readonly PyramidRows[] = [4, 5, 6, 7]
export const DEAL_KINDS: readonly DealKind[] = ['couleur', 'plusMoins', 'interExter', 'signe']

export const DEFAULT_RULES: PyramidRules = {
  rows: 5,
  deckSize: 52,
}

export const pyramidCount = (rows: number): number => (rows * (rows + 1)) / 2

export const cardsNeeded = (playerCount: number, rules: PyramidRules): number =>
  playerCount * HAND_SIZE + pyramidCount(rules.rows)

export function isSetupValid(playerCount: number, rules: PyramidRules): boolean {
  if (playerCount < MIN_PLAYERS || playerCount > MAX_PLAYERS) return false
  return cardsNeeded(playerCount, rules) <= rules.deckSize
}

export const dealKind = (cardIndex: number): DealKind =>
  DEAL_KINDS[cardIndex] ?? 'couleur'

export const playerById = (state: PyramidState, id: string): PyramidPlayer | undefined =>
  state.players.find((player) => player.id === id)

export const currentDealPlayer = (state: PyramidState): PyramidPlayer | undefined =>
  state.players[state.dealIndex]

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

/**
 * La carte tombe-t-elle dans le pari ? À égalité, plus et moins sont faux ;
 * inter exige d'être strictement entre les deux bornes, exter d'être
 * strictement dehors. Tomber pile sur une borne, c'est rater.
 */
export function isGuessCorrect(guess: DealGuess, card: Card, previous: readonly Card[]): boolean {
  switch (guess.kind) {
    case 'couleur':
      return guess.value === 'rouge' ? isRed(card) : !isRed(card)
    case 'plusMoins': {
      const prior = previous[previous.length - 1]
      if (!prior) return false
      const delta = RANK_ORDER[card.rank] - RANK_ORDER[prior.rank]
      if (delta === 0) return false
      return guess.value === 'plus' ? delta > 0 : delta < 0
    }
    case 'interExter': {
      const first = previous[0]
      const second = previous[1]
      if (!first || !second) return false
      const low = Math.min(RANK_ORDER[first.rank], RANK_ORDER[second.rank])
      const high = Math.max(RANK_ORDER[first.rank], RANK_ORDER[second.rank])
      const value = RANK_ORDER[card.rank]
      if (value === low || value === high) return false
      const inside = value > low && value < high
      return guess.value === 'inter' ? inside : !inside
    }
    case 'signe':
      return guess.value === card.suit
  }
}

export function dealPrompt(kind: DealKind, previous: readonly Card[]): string {
  if (kind === 'couleur') return 'Rouge ou noir ?'
  if (kind === 'plusMoins') {
    const prior = previous[previous.length - 1]
    return prior
      ? `Plus haut ou plus bas que ${rankName(prior.rank)} ?`
      : 'Plus haut ou plus bas ?'
  }
  if (kind === 'interExter') {
    const first = previous[0]
    const second = previous[1]
    if (first && second) {
      return `Entre ${rankName(first.rank)} et ${rankName(second.rank)}, ou à l'extérieur ?`
    }
    return 'Inter ou exter ?'
  }
  return 'De quel signe ?'
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

function addToHand(players: readonly PyramidPlayer[], playerId: string, card: Card): PyramidPlayer[] {
  return players.map((player) =>
    player.id === playerId ? { ...player, hand: [...player.hand, card] } : player,
  )
}

function removeCard(players: readonly PyramidPlayer[], playerId: string, cardId: string): PyramidPlayer[] {
  return players.map((player) =>
    player.id === playerId
      ? { ...player, hand: player.hand.filter((held) => held.id !== cardId) }
      : player,
  )
}

function applyGift(
  state: PyramidState,
  gift: Gift,
  players: readonly PyramidPlayer[],
): { players: PyramidPlayer[]; history: Gift[]; lastGift: Gift } {
  const next = players.map((player) => {
    if (player.id === gift.toId && player.id === gift.fromId) {
      return { ...player, received: player.received + gift.sips }
    }
    if (player.id === gift.toId) {
      return { ...player, received: player.received + gift.sips }
    }
    if (player.id === gift.fromId) {
      return { ...player, given: player.given + gift.sips }
    }
    return player
  })
  return { players: next, history: [...state.history, gift], lastGift: gift }
}

function clearPending(state: PyramidState): PyramidState {
  return {
    ...state,
    pendingCard: null,
    pendingGuess: null,
    pendingCorrect: null,
    giverId: null,
    targetId: null,
  }
}

function advanceDeal(state: PyramidState): PyramidState {
  const cleared = clearPending(state)
  const nextCard = state.dealCardIndex + 1
  if (nextCard < HAND_SIZE) {
    return { ...cleared, dealCardIndex: nextCard, dealStep: 'guess' }
  }
  const nextPlayer = state.dealIndex + 1
  if (nextPlayer < state.players.length) {
    return {
      ...cleared,
      dealIndex: nextPlayer,
      dealCardIndex: 0,
      dealStep: 'guess',
    }
  }
  return {
    ...cleared,
    phase: 'play',
    dealIndex: nextPlayer,
    dealCardIndex: HAND_SIZE,
    dealStep: 'guess',
  }
}

export function createGame(
  names: readonly string[],
  rules: PyramidRules,
  rng: Rng = defaultRng,
): PyramidState {
  const deck = shuffle(buildDeck(rules.deckSize), rng)
  const count = pyramidCount(rules.rows)
  const split = Math.max(0, deck.length - count)
  const drawPile = deck.slice(0, split)
  const slots = buildSlots(deck.slice(split), rules.rows)

  return {
    phase: 'deal',
    rules,
    players: names.map((name, index) => ({
      id: `p${index}`,
      name,
      hand: [],
      given: 0,
      received: 0,
    })),
    slots,
    drawPile,
    cursor: -1,
    dealIndex: 0,
    dealCardIndex: 0,
    dealStep: 'guess',
    pendingCard: null,
    pendingGuess: null,
    pendingCorrect: null,
    giverId: null,
    targetId: null,
    lastGift: null,
    history: [],
  }
}

export type PyramidAction =
  | { type: 'guess'; guess: DealGuess }
  | { type: 'ackReveal' }
  | { type: 'dealGive'; targetId: string }
  | { type: 'flip' }
  | { type: 'claim'; playerId: string }
  | { type: 'give'; targetId: string }
  | { type: 'cancelGive' }
  | { type: 'accept' }
  | { type: 'callLiar' }

export function pyramidReducer(state: PyramidState, action: PyramidAction): PyramidState {
  switch (action.type) {
    case 'guess': {
      if (state.phase !== 'deal' || state.dealStep !== 'guess') return state
      const player = currentDealPlayer(state)
      const card = state.drawPile[0]
      if (!player || !card) return state
      if (action.guess.kind !== dealKind(state.dealCardIndex)) return state

      return {
        ...state,
        drawPile: state.drawPile.slice(1),
        pendingCard: card,
        pendingGuess: action.guess,
        pendingCorrect: isGuessCorrect(action.guess, card, player.hand),
        dealStep: 'reveal',
      }
    }

    case 'ackReveal': {
      if (state.phase !== 'deal' || state.dealStep !== 'reveal' || !state.pendingCard) return state
      const player = currentDealPlayer(state)
      if (!player) return state

      const withCard = {
        ...state,
        players: addToHand(state.players, player.id, state.pendingCard),
      }

      if (state.pendingCorrect) {
        return { ...withCard, dealStep: 'give', giverId: player.id }
      }

      const gift: Gift = {
        fromId: player.id,
        toId: player.id,
        card: state.pendingCard,
        sips: DEAL_SIPS,
        source: 'deal',
        outcome: 'dealMiss',
      }
      const applied = applyGift(withCard, gift, withCard.players)
      return advanceDeal({ ...withCard, ...applied })
    }

    case 'dealGive': {
      if (state.phase !== 'deal' || state.dealStep !== 'give' || !state.pendingCard) return state
      const player = currentDealPlayer(state)
      const target = playerById(state, action.targetId)
      if (!player || !target || target.id === player.id) return state

      const gift: Gift = {
        fromId: player.id,
        toId: target.id,
        card: state.pendingCard,
        sips: DEAL_SIPS,
        source: 'deal',
        outcome: 'dealHit',
      }
      const applied = applyGift(state, gift, state.players)
      return advanceDeal({ ...state, ...applied })
    }

    case 'flip': {
      if (state.phase !== 'play') return state
      const next = state.slots.findIndex((slot) => !slot.revealed)
      if (next === -1) {
        return { ...state, phase: 'end', giverId: null, targetId: null }
      }
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
      if (!rank || !player) return state
      return { ...state, phase: 'give', giverId: player.id, targetId: null }
    }

    case 'give': {
      if (state.phase !== 'give' || !state.giverId) return state
      const target = playerById(state, action.targetId)
      const giver = playerById(state, state.giverId)
      if (!target || !giver || target.id === giver.id) return state
      return { ...state, phase: 'challenge', targetId: target.id }
    }

    case 'cancelGive': {
      if (state.phase !== 'give') return state
      return { ...state, phase: 'play', giverId: null, targetId: null }
    }

    case 'accept': {
      if (state.phase !== 'challenge' || !state.giverId || !state.targetId) return state
      const rank = currentRank(state)
      const slot = currentSlot(state)
      const giver = playerById(state, state.giverId)
      const target = playerById(state, state.targetId)
      if (!rank || !slot || !giver || !target) return state

      const played = matchingCards(giver.hand, rank)[0] ?? null
      const sips = sipsFor(slot)
      const gift: Gift = {
        fromId: giver.id,
        toId: target.id,
        card: played,
        sips,
        source: 'pyramid',
        outcome: 'accepted',
      }
      const hands = played ? removeCard(state.players, giver.id, played.id) : state.players
      const applied = applyGift(state, gift, hands)
      return {
        ...state,
        ...applied,
        phase: 'play',
        giverId: null,
        targetId: null,
      }
    }

    case 'callLiar': {
      if (state.phase !== 'challenge' || !state.giverId || !state.targetId) return state
      const rank = currentRank(state)
      const slot = currentSlot(state)
      const giver = playerById(state, state.giverId)
      const target = playerById(state, state.targetId)
      if (!rank || !slot || !giver || !target) return state

      const played = matchingCards(giver.hand, rank)[0] ?? null
      const sips = sipsFor(slot) * 2

      if (played) {
        const gift: Gift = {
          fromId: giver.id,
          toId: target.id,
          card: played,
          sips,
          source: 'pyramid',
          outcome: 'shown',
        }
        const hands = removeCard(state.players, giver.id, played.id)
        const applied = applyGift(state, gift, hands)
        return { ...state, ...applied, phase: 'play', giverId: null, targetId: null }
      }

      const gift: Gift = {
        fromId: target.id,
        toId: giver.id,
        card: null,
        sips,
        source: 'pyramid',
        outcome: 'lied',
      }
      const applied = applyGift(state, gift, state.players)
      return { ...state, ...applied, phase: 'play', giverId: null, targetId: null }
    }

    default:
      return state
  }
}

export const visibleHand = (player: PyramidPlayer): Card[] => sortHand(player.hand)

export const suitPhrase = (suit: Suit): string => SUIT_LABELS[suit]
