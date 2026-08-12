import { describe, expect, it } from 'vitest'
import { createRng } from '@/shared/lib/random'
import { DEFAULT_CONFIG, createGame, ranking, todReducer } from './engine'
import type { TodConfig, TodState } from './engine'
import { TOD_CARDS, filterCards, hasBothTypes } from './cards'

function config(players: string[], overrides: Partial<TodConfig> = {}): TodConfig {
  return { players, ...DEFAULT_CONFIG, ...overrides }
}

function game(players: string[], overrides: Partial<TodConfig> = {}, seed = 9): TodState {
  return createGame(config(players, overrides), TOD_CARDS, createRng(seed))
}

/** Enchaîne un tour complet : choix puis résolution. */
function playTurn(state: TodState, choice: 'truth' | 'dare', completed: boolean): TodState {
  const drawn = todReducer(state, { type: 'choose', choice }, createRng(1))
  return todReducer(drawn, { type: 'resolve', completed }, createRng(2))
}

describe('déroulé des tours', () => {
  it('pioche une carte du type choisi', () => {
    const state = todReducer(game(['A', 'B']), { type: 'choose', choice: 'dare' })
    expect(state.phase).toBe('card')
    expect(state.currentCard?.type).toBe('dare')
    expect(state.currentType).toBe('dare')
  })

  it('fait tourner les joueurs dans l’ordre', () => {
    let state = game(['A', 'B', 'C'], { selectionMode: 'rotation' })
    expect(state.currentPlayerIndex).toBe(0)
    state = playTurn(state, 'truth', true)
    expect(state.currentPlayerIndex).toBe(1)
    state = playTurn(state, 'truth', true)
    expect(state.currentPlayerIndex).toBe(2)
    state = playTurn(state, 'truth', true)
    expect(state.currentPlayerIndex).toBe(0)
  })

  it('ne redonne jamais la main au même joueur en mode aléatoire', () => {
    let state = game(['A', 'B', 'C', 'D'], { selectionMode: 'random', maxTurns: 0 })
    for (let turn = 0; turn < 30; turn += 1) {
      const previous = state.currentPlayerIndex
      state = playTurn(state, 'dare', true)
      expect(state.currentPlayerIndex).not.toBe(previous)
    }
  })

  it('ne ressort pas deux fois la même carte tant que le paquet dure', () => {
    let state = game(['A', 'B'], { maxTurns: 0 })
    const seen = new Set<string>()
    for (let turn = 0; turn < 20; turn += 1) {
      state = todReducer(state, { type: 'choose', choice: 'truth' })
      const id = state.currentCard!.id
      expect(seen.has(id)).toBe(false)
      seen.add(id)
      state = todReducer(state, { type: 'resolve', completed: true })
    }
  })

  it('remélange le paquet une fois épuisé plutôt que de bloquer', () => {
    const singleCard = TOD_CARDS.filter((card) => card.type === 'truth').slice(0, 1)
    let state = createGame(config(['A', 'B'], { maxTurns: 0 }), singleCard, createRng(1))
    state = todReducer(state, { type: 'choose', choice: 'truth' })
    expect(state.currentCard).not.toBeNull()
    state = todReducer(state, { type: 'resolve', completed: true })
    state = todReducer(state, { type: 'choose', choice: 'truth' })
    expect(state.currentCard).not.toBeNull()
  })

  it('permet de passer une carte impossible sans compter de refus', () => {
    let state = todReducer(game(['A', 'B']), { type: 'choose', choice: 'dare' })
    const first = state.currentCard!.id
    state = todReducer(state, { type: 'skipCard' })
    expect(state.currentCard!.id).not.toBe(first)
    expect(state.stats[0]?.refusals).toBe(0)
    expect(state.turn).toBe(1)
  })
})

describe('comptage', () => {
  it('compte séparément les vérités et les actions réussies', () => {
    let state = game(['A', 'B'], { maxTurns: 0 })
    state = playTurn(state, 'truth', true)
    state = playTurn(state, 'dare', true)
    expect(state.stats[0]?.truthsAnswered).toBe(1)
    expect(state.stats[1]?.daresCompleted).toBe(1)
  })

  it('facture les gorgées du refus au bon joueur', () => {
    let state = game(['A', 'B'], { refusalSips: 3, maxTurns: 0 })
    state = playTurn(state, 'dare', false)
    expect(state.stats[0]).toMatchObject({ refusals: 1, sips: 3 })
    expect(state.stats[1]?.sips).toBe(0)
  })

  it('ne facture rien quand le refus est gratuit', () => {
    let state = game(['A', 'B'], { refusalSips: 0, maxTurns: 0 })
    state = playTurn(state, 'dare', false)
    expect(state.stats[0]).toMatchObject({ refusals: 1, sips: 0 })
  })

  it('garde la trace de chaque tour', () => {
    const state = playTurn(game(['A', 'B'], { maxTurns: 0 }), 'truth', false)
    expect(state.history).toHaveLength(1)
    expect(state.history[0]).toMatchObject({ turn: 1, playerIndex: 0, completed: false })
  })
})

describe('fin de partie', () => {
  it('s’arrête au nombre de tours prévu', () => {
    let state = game(['A', 'B'], { maxTurns: 3 })
    state = playTurn(state, 'truth', true)
    state = playTurn(state, 'truth', true)
    expect(state.phase).toBe('choice')
    state = playTurn(state, 'truth', true)
    expect(state.phase).toBe('end')
  })

  it('ne s’arrête jamais toute seule en mode illimité', () => {
    let state = game(['A', 'B'], { maxTurns: 0 })
    for (let turn = 0; turn < 40; turn += 1) state = playTurn(state, 'truth', true)
    expect(state.phase).toBe('choice')
  })

  it('peut être arrêtée à la main', () => {
    const state = todReducer(game(['A', 'B'], { maxTurns: 0 }), { type: 'stop' })
    expect(state.phase).toBe('end')
  })
})

describe('classement', () => {
  it('classe par défis relevés, puis par refus', () => {
    const base = game(['A', 'B', 'C'], { maxTurns: 0 })
    const state: TodState = {
      ...base,
      stats: [
        { truthsAnswered: 1, daresCompleted: 1, refusals: 3, sips: 6 },
        { truthsAnswered: 2, daresCompleted: 0, refusals: 0, sips: 0 },
        { truthsAnswered: 0, daresCompleted: 0, refusals: 5, sips: 10 },
      ],
    }
    const rows = ranking(state)
    expect(rows.map((row) => row.name)).toEqual(['B', 'A', 'C'])
  })
})

describe('catalogue de cartes', () => {
  it('ne contient aucun identifiant en double', () => {
    const ids = TOD_CARDS.map((card) => card.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('fournit action et vérité pour chaque intensité', () => {
    for (const intensity of ['soft', 'hot', 'hardcore'] as const) {
      const cards = filterCards([intensity])
      expect(hasBothTypes(cards)).toBe(true)
      expect(cards.length).toBeGreaterThanOrEqual(40)
    }
  })

  it('signale une sélection qui ne propose qu’un seul type', () => {
    expect(hasBothTypes(TOD_CARDS.filter((card) => card.type === 'truth'))).toBe(false)
  })
})
