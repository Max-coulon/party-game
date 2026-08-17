import { describe, expect, it } from 'vitest'
import { createRng } from '@/shared/lib/random'
import {
  DEFAULT_RULES,
  currentRank,
  createGame,
  hasRank,
  isSetupValid,
  matchingCards,
  playerById,
  pyramidCount,
  pyramidReducer,
  ranking,
  sipsFor,
  unrevealedCount,
} from './engine'
import type { PyramidPlayer, PyramidRules, PyramidSlot, PyramidState } from './engine'
import { buildDeck, cardId, deckCount } from './cards'
import type { Card, Rank, Suit } from './cards'

const NAMES = ['Léa', 'Tom', 'Ana', 'Sam']

const card = (rank: Rank, suit: Suit): Card => ({
  id: cardId(rank, suit),
  rank,
  suit,
})

function rules(overrides: Partial<PyramidRules> = {}): PyramidRules {
  return { ...DEFAULT_RULES, ...overrides }
}

function player(index: number, hand: Card[], extras: Partial<PyramidPlayer> = {}): PyramidPlayer {
  return {
    id: `p${index}`,
    name: NAMES[index] ?? `J${index}`,
    hand,
    given: 0,
    received: 0,
    ...extras,
  }
}

function slot(held: Card, row: number, revealed = true): PyramidSlot {
  return { card: held, row, revealed }
}

function playState(overrides: Partial<PyramidState> = {}): PyramidState {
  const revealed = card('A', 'coeur')
  return {
    phase: 'play',
    rules: DEFAULT_RULES,
    players: [
      player(0, [card('A', 'pique'), card('7', 'trefle')]),
      player(1, [card('R', 'coeur')]),
      player(2, [card('A', 'carreau'), card('A', 'trefle')]),
    ],
    slots: [slot(revealed, 1), slot(card('D', 'pique'), 2, false)],
    cursor: 0,
    dealIndex: 3,
    giverId: null,
    lastGift: null,
    history: [],
    ...overrides,
  }
}

describe('le paquet', () => {
  it('compte 52 ou 32 cartes, rien n’est retiré', () => {
    expect(buildDeck(52)).toHaveLength(52)
    expect(buildDeck(32)).toHaveLength(32)
    expect(deckCount(52)).toBe(52)
    expect(buildDeck(32).every((held) => held.rank !== '6')).toBe(true)
  })

  it('identifie une carte de façon stable', () => {
    expect(cardId('V', 'pique')).toBe('V-pique')
  })
})

describe('la configuration', () => {
  it('refuse moins de deux joueurs et plus de douze', () => {
    expect(isSetupValid(1, DEFAULT_RULES)).toBe(false)
    expect(isSetupValid(2, DEFAULT_RULES)).toBe(true)
    expect(isSetupValid(12, DEFAULT_RULES)).toBe(true)
    expect(isSetupValid(13, DEFAULT_RULES)).toBe(false)
  })

  it('exige au moins une carte en main pour chacun', () => {
    expect(pyramidCount(5)).toBe(15)
    expect(isSetupValid(4, rules({ rows: 7, deckSize: 32 }))).toBe(true)
    expect(isSetupValid(5, rules({ rows: 7, deckSize: 32 }))).toBe(false)
    expect(isSetupValid(12, rules({ rows: 7, deckSize: 52 }))).toBe(true)
    expect(isSetupValid(12, rules({ rows: 7, deckSize: 32 }))).toBe(false)
  })
})

describe('la distribution', () => {
  it('pose exactement le triangle, le reste va aux joueurs', () => {
    const state = createGame(NAMES, DEFAULT_RULES, createRng(7))
    expect(state.phase).toBe('deal')
    expect(state.slots).toHaveLength(15)
    expect(state.slots.every((item) => !item.revealed)).toBe(true)
    expect(state.slots[0]?.row).toBe(1)
    expect(state.slots[14]?.row).toBe(5)

    const dealt = state.slots.length + state.players.reduce((sum, item) => sum + item.hand.length, 0)
    expect(dealt).toBe(52)
    expect(state.players.every((item) => item.hand.length >= 1)).toBe(true)
  })

  it('fait tourner le sas jusqu’à la table', () => {
    let state = createGame(NAMES, DEFAULT_RULES, createRng(3))
    expect(state.dealIndex).toBe(0)
    state = pyramidReducer(state, { type: 'seenHand' })
    state = pyramidReducer(state, { type: 'seenHand' })
    state = pyramidReducer(state, { type: 'seenHand' })
    expect(state.phase).toBe('deal')
    state = pyramidReducer(state, { type: 'seenHand' })
    expect(state.phase).toBe('play')
    expect(state.cursor).toBe(-1)
    expect(unrevealedCount(state)).toBe(15)
  })
})

describe('le retournement', () => {
  it('révèle les cartes du sommet vers la base, une par une', () => {
    let state = createGame(NAMES, DEFAULT_RULES, createRng(11))
    for (let i = 0; i < NAMES.length; i += 1) state = pyramidReducer(state, { type: 'seenHand' })

    state = pyramidReducer(state, { type: 'flip' })
    expect(state.cursor).toBe(0)
    expect(state.slots[0]?.revealed).toBe(true)
    expect(state.slots[0]?.row).toBe(1)
    expect(sipsFor(state.slots[0]!)).toBe(1)
    expect(unrevealedCount(state)).toBe(14)

    state = pyramidReducer(state, { type: 'flip' })
    expect(state.cursor).toBe(1)
    expect(state.slots[1]?.row).toBe(2)
    expect(sipsFor(state.slots[1]!)).toBe(2)
  })

  it('ignore un retournement pendant qu’on désigne', () => {
    const state = playState({ phase: 'give', giverId: 'p0' })
    expect(pyramidReducer(state, { type: 'flip' })).toBe(state)
  })
})

describe('le don', () => {
  it('refuse une réclamation sans la valeur', () => {
    const state = playState()
    expect(hasRank(state.players[1]!, 'A')).toBe(false)
    expect(pyramidReducer(state, { type: 'claim', playerId: 'p1' })).toBe(state)
  })

  it('refuse de se faire boire soi-même', () => {
    const claimed = pyramidReducer(playState(), { type: 'claim', playerId: 'p0' })
    expect(claimed.phase).toBe('give')
    expect(pyramidReducer(claimed, { type: 'give', targetId: 'p0' })).toEqual(claimed)
  })

  it('retire la carte, attribue les gorgées du rang, et revient à la table', () => {
    const claimed = pyramidReducer(playState(), { type: 'claim', playerId: 'p0' })
    const given = pyramidReducer(claimed, { type: 'give', targetId: 'p1' })

    expect(given.phase).toBe('play')
    expect(given.giverId).toBeNull()
    expect(given.lastGift?.fromId).toBe('p0')
    expect(given.lastGift?.toId).toBe('p1')
    expect(given.lastGift?.sips).toBe(1)
    expect(given.lastGift?.card.id).toBe('A-pique')
    expect(playerById(given, 'p0')?.hand.map((held) => held.id)).toEqual(['7-trefle'])
    expect(playerById(given, 'p0')?.given).toBe(1)
    expect(playerById(given, 'p1')?.received).toBe(1)
    expect(given.history).toHaveLength(1)
  })

  it('permet de rejouer une deuxième carte de la même valeur', () => {
    const first = pyramidReducer(
      pyramidReducer(playState(), { type: 'claim', playerId: 'p2' }),
      { type: 'give', targetId: 'p0' },
    )
    expect(matchingCards(playerById(first, 'p2')!.hand, 'A')).toHaveLength(1)

    const second = pyramidReducer(
      pyramidReducer(first, { type: 'claim', playerId: 'p2' }),
      { type: 'give', targetId: 'p1' },
    )
    expect(playerById(second, 'p2')?.hand).toHaveLength(0)
    expect(playerById(second, 'p2')?.given).toBe(2)
    expect(playerById(second, 'p0')?.received).toBe(1)
    expect(playerById(second, 'p1')?.received).toBe(1)
  })

  it('annule une désignation commencée', () => {
    const claimed = pyramidReducer(playState(), { type: 'claim', playerId: 'p0' })
    const cancelled = pyramidReducer(claimed, { type: 'cancelGive' })
    expect(cancelled.phase).toBe('play')
    expect(cancelled.giverId).toBeNull()
    expect(playerById(cancelled, 'p0')?.hand).toHaveLength(2)
  })

  it('prend les gorgées du rang, pas un forfait fixe', () => {
    const state = playState({
      slots: [slot(card('R', 'pique'), 4)],
      players: [player(0, [card('R', 'coeur')]), player(1, [])],
    })
    const given = pyramidReducer(
      pyramidReducer(state, { type: 'claim', playerId: 'p0' }),
      { type: 'give', targetId: 'p1' },
    )
    expect(given.lastGift?.sips).toBe(4)
  })
})

describe('la fin', () => {
  it('fait boire les cartes restantes', () => {
    const state = playState({
      slots: [slot(card('D', 'coeur'), 2)],
      players: [player(0, [card('7', 'pique'), card('8', 'pique')]), player(1, [])],
    })
    const ended = pyramidReducer(state, { type: 'flip' })
    expect(ended.phase).toBe('end')
    expect(playerById(ended, 'p0')?.received).toBe(2)
    expect(ended.history.filter((gift) => gift.source === 'leftover')).toHaveLength(2)
  })

  it('laisse les mains telles quelles si on joue sans le forfait', () => {
    const state = playState({
      rules: rules({ leftoverSips: false }),
      slots: [slot(card('D', 'coeur'), 2)],
      players: [player(0, [card('7', 'pique')]), player(1, [])],
    })
    const ended = pyramidReducer(state, { type: 'flip' })
    expect(ended.phase).toBe('end')
    expect(playerById(ended, 'p0')?.received).toBe(0)
    expect(playerById(ended, 'p0')?.hand).toHaveLength(1)
  })

  it('classe par gorgées reçues', () => {
    const state = playState({
      phase: 'end',
      players: [
        player(0, [], { received: 6, given: 1 }),
        player(1, [], { received: 6, given: 4 }),
        player(2, [], { received: 2, given: 9 }),
      ],
    })
    const rows = ranking(state)
    expect(rows.map((row) => row.rank)).toEqual([1, 1, 3])
    expect(rows[2]?.playerId).toBe('p2')
  })
})

describe('une partie entière', () => {
  it('termine toujours, cartes conservées', () => {
    let state = createGame(NAMES, rules({ rows: 4, leftoverSips: true }), createRng(42))
    const total =
      state.slots.length + state.players.reduce((sum, item) => sum + item.hand.length, 0)

    for (let i = 0; i < NAMES.length; i += 1) state = pyramidReducer(state, { type: 'seenHand' })

    for (let guard = 0; guard < 400; guard += 1) {
      if (state.phase === 'end') break
      if (state.phase === 'give') {
        const giver = playerById(state, state.giverId ?? '')
        const target = state.players.find((item) => item.id !== giver?.id)
        state = pyramidReducer(state, { type: 'give', targetId: target?.id ?? 'p0' })
        continue
      }

      const rank = currentRank(state)
      const claimant = rank
        ? state.players.find((item) => hasRank(item, rank))
        : undefined
      if (claimant) {
        state = pyramidReducer(state, { type: 'claim', playerId: claimant.id })
      } else {
        state = pyramidReducer(state, { type: 'flip' })
      }
    }

    expect(state.phase).toBe('end')
    const remaining = state.players.reduce((sum, item) => sum + item.hand.length, 0)
    const played = state.history.filter((gift) => gift.source === 'pyramid').length
    expect(played + remaining + state.slots.length).toBe(total)
  })
})
