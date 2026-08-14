import { describe, expect, it } from 'vitest'
import { createRng, randomInt } from '@/shared/lib/random'
import type { Rng } from '@/shared/lib/random'
import {
  DEFAULT_RULES,
  MIN_PLAYERS,
  activePlayers,
  createGame,
  isSetupValid,
  puantReducer,
  puantHolder,
  savedOrder,
} from './engine'
import type { PuantRules, PuantState } from './engine'
import { PUANT_ID, buildDeck, cardId, deckCount, extractPairs, isPair } from './cards'
import type { Card } from './cards'

const NAMES = ['Léa', 'Tom', 'Ana', 'Sam']

function rules(overrides: Partial<PuantRules> = {}): PuantRules {
  return { ...DEFAULT_RULES, ...overrides }
}

const card = (id: string): Card => {
  const [rank = 'A', suit = 'pique'] = id.split('-')
  return { id, rank, suit } as Card
}

const handIds = (state: PuantState, index: number) =>
  (state.players[index]?.hand ?? []).map((held) => held.id)

const totalCards = (state: PuantState) =>
  state.players.reduce(
    (sum, player) => sum + player.hand.length + player.pairs.length * 2,
    0,
  )

/** Vérifie à chaque étape ce qui doit rester vrai du début à la fin. */
function checkInvariants(state: PuantState, expectedCards: number) {
  expect(totalCards(state)).toBe(expectedCards)

  for (const player of state.players) {
    // Une paire qui traîne en main, c'est une défausse ratée.
    expect(extractPairs(player.hand, state.rules.pairing).pairs).toHaveLength(0)
    if (player.out) expect(player.hand).toHaveLength(0)
  }

  if (state.phase === 'end') return

  const turn = state.players[state.turnIndex]
  const source = state.players[state.sourceIndex]
  expect(turn?.out).toBe(false)
  expect(source?.out).toBe(false)
  expect(state.turnIndex).not.toBe(state.sourceIndex)

  if (state.phase === 'pass' || state.phase === 'hand' || state.phase === 'draw') {
    expect([...state.fanOrder].sort()).toEqual([...(source?.hand ?? []).map((c) => c.id)].sort())
  }
}

function playToEnd(start: PuantState, rng: Rng, expectedCards: number): PuantState {
  let state = start
  for (let guard = 0; guard < 10_000; guard += 1) {
    checkInvariants(state, expectedCards)
    if (state.phase === 'end') return state

    if (state.phase === 'pass') state = puantReducer(state, { type: 'takePhone' }, rng)
    else if (state.phase === 'hand') state = puantReducer(state, { type: 'openFan' }, rng)
    else if (state.phase === 'draw')
      state = puantReducer(
        state,
        { type: 'drawAt', position: randomInt(state.fanOrder.length, rng) },
        rng,
      )
    else state = puantReducer(state, { type: 'endTurn' }, rng)
  }
  throw new Error('la partie ne se termine pas')
}

describe('le paquet', () => {
  it('retire le valet de trèfle et laisse le pique orphelin', () => {
    const deck = buildDeck(52, 'color')
    expect(deck).toHaveLength(51)
    expect(deck.some((c) => c.id === cardId('V', 'trefle'))).toBe(false)
    expect(deck.some((c) => c.id === PUANT_ID)).toBe(true)
  })

  it('retire les trois autres valets quand on apparie à la valeur seule', () => {
    const deck = buildDeck(52, 'rank')
    expect(deck).toHaveLength(49)
    expect(deck.filter((c) => c.rank === 'V')).toHaveLength(1)
  })

  it('démarre au 7 en jeu de 32', () => {
    const deck = buildDeck(32, 'color')
    expect(deck).toHaveLength(31)
    expect(deck.some((c) => c.rank === '6')).toBe(false)
    expect(deck.some((c) => c.id === PUANT_ID)).toBe(true)
  })

  it('laisse toujours exactement une carte non appariable', () => {
    for (const size of [52, 32] as const) {
      for (const pairing of ['color', 'rank'] as const) {
        const { kept } = extractPairs(buildDeck(size, pairing), pairing)
        expect(kept.map((c) => c.id)).toEqual([PUANT_ID])
      }
    }
  })
})

describe('la règle des paires', () => {
  it('exige la même valeur et la même couleur', () => {
    expect(isPair(card('7-coeur'), card('7-carreau'), 'color')).toBe(true)
    expect(isPair(card('7-trefle'), card('7-pique'), 'color')).toBe(true)
    expect(isPair(card('7-coeur'), card('7-pique'), 'color')).toBe(false)
    expect(isPair(card('7-coeur'), card('8-carreau'), 'color')).toBe(false)
  })

  it('se contente de la valeur en règle simplifiée', () => {
    expect(isPair(card('7-coeur'), card('7-pique'), 'rank')).toBe(true)
  })

  it('ne marie pas une carte avec elle-même', () => {
    expect(isPair(card('7-coeur'), card('7-coeur'), 'color')).toBe(false)
  })
})

describe('la donne', () => {
  it('distribue tout le paquet et défausse les paires d’entrée', () => {
    const state = createGame(NAMES, rules(), createRng(7))
    expect(totalCards(state)).toBe(deckCount(52, 'color'))
    for (const player of state.players) {
      expect(extractPairs(player.hand, 'color').pairs).toHaveLength(0)
    }
  })

  it('présente l’éventail du voisin, jamais celui du joueur actif', () => {
    const state = createGame(NAMES, rules(), createRng(3))
    expect(state.phase).toBe('pass')
    expect(state.sourceIndex).not.toBe(state.turnIndex)
    expect([...state.fanOrder].sort()).toEqual([...handIds(state, state.sourceIndex)].sort())
  })

  it('pioche à gauche ou à droite selon le réglage', () => {
    const left = createGame(NAMES, rules({ direction: 'left' }), createRng(11))
    expect(left.sourceIndex).toBe((left.turnIndex + NAMES.length - 1) % NAMES.length)

    const right = createGame(NAMES, rules({ direction: 'right' }), createRng(11))
    expect(right.sourceIndex).toBe((right.turnIndex + 1) % NAMES.length)
  })

  it('refuse une table trop petite ou trop grande', () => {
    expect(isSetupValid(MIN_PLAYERS - 1)).toBe(false)
    expect(isSetupValid(MIN_PLAYERS)).toBe(true)
    expect(isSetupValid(9)).toBe(false)
  })
})

describe('la pioche', () => {
  it('déplace la carte du voisin vers celui qui pioche', () => {
    const rng = createRng(21)
    let state = createGame(NAMES, rules(), rng)
    state = puantReducer(state, { type: 'takePhone' }, rng)
    state = puantReducer(state, { type: 'openFan' }, rng)

    const target = state.fanOrder[0] as string
    const before = handIds(state, state.turnIndex).length
    const sourceBefore = handIds(state, state.sourceIndex).length

    const after = puantReducer(state, { type: 'drawAt', position: 0 }, rng)

    expect(after.phase).toBe('drawn')
    expect(after.drawn?.id).toBe(target)
    expect(handIds(after, after.sourceIndex)).not.toContain(target)
    expect(handIds(after, after.sourceIndex)).toHaveLength(sourceBefore - 1)

    // Soit la carte rejoint la main, soit elle emporte sa jumelle avec elle.
    const drawerHand = handIds(after, after.turnIndex).length
    expect(after.matched ? drawerHand === before - 1 : drawerHand === before + 1).toBe(true)
  })

  it('défausse aussitôt la paire complétée', () => {
    const rng = createRng(4)
    let state = createGame(['A', 'B', 'C'], rules(), rng)
    state = puantReducer(state, { type: 'takePhone' }, rng)
    state = puantReducer(state, { type: 'openFan' }, rng)

    const drawer = state.players[state.turnIndex]
    const source = state.players[state.sourceIndex]
    const position = state.fanOrder.findIndex((id) => {
      const candidate = source?.hand.find((held) => held.id === id)
      return candidate ? Boolean(drawer?.hand.some((held) => isPair(held, candidate, 'color'))) : false
    })
    expect(position).toBeGreaterThanOrEqual(0)

    const after = puantReducer(state, { type: 'drawAt', position }, rng)
    expect(after.matched).not.toBeNull()
    expect(after.players[after.turnIndex]?.pairs).toHaveLength(
      (drawer?.pairs.length ?? 0) + 1,
    )
  })

  it('ignore une action qui ne correspond pas à la phase', () => {
    const rng = createRng(9)
    const state = createGame(NAMES, rules(), rng)
    expect(puantReducer(state, { type: 'drawAt', position: 0 }, rng)).toBe(state)
    expect(puantReducer(state, { type: 'endTurn' }, rng)).toBe(state)
    expect(puantReducer(state, { type: 'openFan' }, rng)).toBe(state)
  })
})

describe('la partie complète', () => {
  it('finit toujours sur le valet de pique, seul en main', () => {
    for (let seed = 1; seed <= 40; seed += 1) {
      const rng = createRng(seed)
      const players = NAMES.slice(0, 3 + (seed % 5))
      const config = rules({
        deckSize: seed % 2 === 0 ? 52 : 32,
        pairing: seed % 3 === 0 ? 'rank' : 'color',
        direction: seed % 4 === 0 ? 'right' : 'left',
      })
      const names = players.length >= 3 ? players : NAMES

      const end = playToEnd(
        createGame(names, config, rng),
        rng,
        deckCount(config.deckSize, config.pairing),
      )

      const loser = end.players.find((player) => player.id === end.loserId)
      expect(loser).toBeDefined()
      expect(loser?.hand.map((held) => held.id)).toEqual([PUANT_ID])
      expect(puantHolder(end)?.id).toBe(end.loserId)
      expect(activePlayers(end)).toHaveLength(1)
    }
  })

  it('sauve tout le monde sauf un, dans l’ordre où ils se vident', () => {
    const rng = createRng(77)
    const end = playToEnd(createGame(NAMES, rules(), rng), rng, deckCount(52, 'color'))

    const saved = savedOrder(end)
    expect(saved).toHaveLength(NAMES.length - 1)
    expect(saved.map((player) => player.outAt)).toEqual([1, 2, 3])
    expect(saved.some((player) => player.id === end.loserId)).toBe(false)
  })

  it('annonce les sorties une seule fois', () => {
    const rng = createRng(31)
    let state = createGame(NAMES, rules(), rng)
    let announced = 0

    for (let guard = 0; guard < 10_000 && state.phase !== 'end'; guard += 1) {
      if (state.phase === 'pass') {
        announced += state.wentOut.length
        state = puantReducer(state, { type: 'takePhone' }, rng)
        expect(state.wentOut).toHaveLength(0)
      } else if (state.phase === 'hand') state = puantReducer(state, { type: 'openFan' }, rng)
      else if (state.phase === 'draw')
        state = puantReducer(state, { type: 'drawAt', position: 0 }, rng)
      else state = puantReducer(state, { type: 'endTurn' }, rng)
    }

    expect(state.phase).toBe('end')
    // Chaque sauvé est annoncé au tour suivant sa sortie — sauf le dernier,
    // dont la sortie met fin à la partie : l'écran de fin prend le relais.
    expect(announced + state.wentOut.length).toBe(NAMES.length - 1)
  })
})
