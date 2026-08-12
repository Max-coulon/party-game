import { describe, expect, it } from 'vitest'
import { createRng } from '@/shared/lib/random'
import {
  buildPool,
  canSkip,
  createGame,
  currentCard,
  currentMode,
  defaultTeams,
  guessReducer,
  isLastRound,
  ranking,
  totalScore,
} from './engine'
import type { GuessConfig, GuessState } from './engine'
import { GUESS_CARDS, countByCategory, filterCards } from './cards'
import type { GuessCard } from './cards'
import { TIMES_UP_MODES } from './modes'

function cards(count: number, withTaboo = false): GuessCard[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `c${index}`,
    text: `Mot ${index}`,
    category: 'general' as const,
    ...(withTaboo ? { taboo: ['a', 'b', 'c'] } : {}),
  }))
}

function config(overrides: Partial<GuessConfig> = {}): GuessConfig {
  return {
    teams: defaultTeams(2),
    modes: ['libre'],
    turnSeconds: 45,
    cardsPerRound: 0,
    allowSkip: true,
    maxSkips: 0,
    sameDeck: false,
    ...overrides,
  }
}

function game(overrides: Partial<GuessConfig> = {}, deck = cards(6)): GuessState {
  return createGame(config(overrides), deck, createRng(4))
}

/** Trouve `count` cartes d'affilée pendant un tour déjà lancé. */
function findCards(state: GuessState, count: number): GuessState {
  let current = state
  for (let i = 0; i < count; i += 1) current = guessReducer(current, { type: 'found' })
  return current
}

describe('constitution du paquet', () => {
  it('respecte le nombre de cartes par manche', () => {
    const state = game({ cardsPerRound: 4 }, cards(20))
    expect(state.deck).toHaveLength(4)
    expect(state.reserve).toHaveLength(16)
  })

  it('prend tout le paquet quand la limite est à zéro', () => {
    expect(game({ cardsPerRound: 0 }, cards(12)).deck).toHaveLength(12)
  })

  it('ne garde que les cartes à mots interdits pour une manche Interdit', () => {
    const mixed = [...cards(5), ...cards(5, true).map((c) => ({ ...c, id: `t${c.id}` }))]
    expect(buildPool(mixed, ['tabou'])).toHaveLength(5)
    expect(buildPool(mixed, ['libre'])).toHaveLength(10)
  })

  it('impose les mots interdits à tout le paquet dès qu’une manche Interdit est prévue', () => {
    const mixed = [...cards(5), ...cards(5, true).map((c) => ({ ...c, id: `t${c.id}` }))]
    // Les manches suivantes puisent dans la même réserve : une carte sans mots
    // interdits finirait forcément par tomber pendant la manche Interdit.
    expect(buildPool(mixed, ['libre', 'tabou'])).toHaveLength(5)
    expect(buildPool(mixed, ['libre', 'mime'])).toHaveLength(10)
    expect(buildPool(mixed, [])).toHaveLength(10)
  })
})

describe('déroulé d’un tour', () => {
  it('compte un point par carte trouvée', () => {
    let state = guessReducer(game(), { type: 'startTurn' })
    state = findCards(state, 3)
    expect(state.scores[0]?.[0]).toBe(3)
    expect(state.turn.foundIds).toHaveLength(3)
    expect(state.deck).toHaveLength(3)
  })

  it('remet la carte passée en fin de paquet', () => {
    let state = guessReducer(game(), { type: 'startTurn' })
    const first = currentCard(state)!.id
    state = guessReducer(state, { type: 'skip' })
    expect(currentCard(state)!.id).not.toBe(first)
    expect(state.deck[state.deck.length - 1]?.id).toBe(first)
    expect(state.deck).toHaveLength(6)
    expect(state.turn.skipsUsed).toBe(1)
  })

  it('bloque les passes au-delà du quota', () => {
    let state = guessReducer(game({ maxSkips: 2 }), { type: 'startTurn' })
    state = guessReducer(state, { type: 'skip' })
    state = guessReducer(state, { type: 'skip' })
    expect(canSkip(state)).toBe(false)
    const blocked = guessReducer(state, { type: 'skip' })
    expect(blocked).toBe(state)
  })

  it('interdit de passer quand la carte est la dernière du paquet', () => {
    let state = guessReducer(game({}, cards(2)), { type: 'startTurn' })
    state = guessReducer(state, { type: 'found' })
    expect(state.deck).toHaveLength(1)
    expect(canSkip(state)).toBe(false)
  })

  it('n’autorise aucune passe quand l’option est coupée', () => {
    const state = guessReducer(game({ allowSkip: false }), { type: 'startTurn' })
    expect(canSkip(state)).toBe(false)
    expect(guessReducer(state, { type: 'skip' })).toBe(state)
  })

  it('termine le tour dès que le paquet est vide', () => {
    let state = guessReducer(game({}, cards(3)), { type: 'startTurn' })
    state = findCards(state, 3)
    expect(state.phase).toBe('turnEnd')
    expect(state.deck).toHaveLength(0)
  })

  it('ignore une carte trouvée hors du tour', () => {
    const state = game()
    expect(guessReducer(state, { type: 'found' })).toBe(state)
  })
})

describe('enchaînement des équipes et des manches', () => {
  it('passe la main à l’équipe suivante', () => {
    let state = guessReducer(game({ teams: defaultTeams(3) }), { type: 'startTurn' })
    state = guessReducer(state, { type: 'endTurn' })
    state = guessReducer(state, { type: 'nextTurn' })
    expect(state.phase).toBe('ready')
    expect(state.teamIndex).toBe(1)
    expect(state.turn.foundIds).toEqual([])
  })

  it('passe en fin de manche quand le paquet est épuisé', () => {
    let state = guessReducer(game({}, cards(2)), { type: 'startTurn' })
    state = findCards(state, 2)
    state = guessReducer(state, { type: 'nextTurn' })
    expect(state.phase).toBe('roundEnd')
  })

  it('rejoue le même paquet à la manche suivante en mode Time’s Up', () => {
    let state = guessReducer(game({ modes: TIMES_UP_MODES, sameDeck: true }, cards(3)), {
      type: 'startTurn',
    })
    const original = state.deck.map((card) => card.id).sort()
    state = findCards(state, 3)
    state = guessReducer(state, { type: 'nextTurn' })
    state = guessReducer(state, { type: 'nextRound' })
    expect(state.phase).toBe('ready')
    expect(state.round).toBe(1)
    expect(currentMode(state)).toBe('unMot')
    expect(state.deck.map((card) => card.id).sort()).toEqual(original)
  })

  it('pioche un paquet neuf quand les manches ne se rejouent pas', () => {
    let state = guessReducer(
      game({ modes: ['libre', 'mime'], sameDeck: false, cardsPerRound: 3 }, cards(9)),
      { type: 'startTurn' },
    )
    const first = state.deck.map((card) => card.id)
    state = findCards(state, 3)
    state = guessReducer(state, { type: 'nextTurn' })
    state = guessReducer(state, { type: 'nextRound' })
    expect(state.deck).toHaveLength(3)
    expect(state.deck.some((card) => first.includes(card.id))).toBe(false)
  })

  it('rejoue le paquet précédent si la réserve est vide, au lieu de bloquer', () => {
    let state = guessReducer(
      game({ modes: ['libre', 'mime'], sameDeck: false, cardsPerRound: 0 }, cards(3)),
      { type: 'startTurn' },
    )
    state = findCards(state, 3)
    state = guessReducer(state, { type: 'nextTurn' })
    state = guessReducer(state, { type: 'nextRound' })
    expect(state.deck).toHaveLength(3)
    expect(state.phase).toBe('ready')
  })

  it('termine la partie après la dernière manche', () => {
    let state = guessReducer(game({ modes: ['libre'] }, cards(2)), { type: 'startTurn' })
    state = findCards(state, 2)
    state = guessReducer(state, { type: 'nextTurn' })
    expect(isLastRound(state)).toBe(true)
    state = guessReducer(state, { type: 'nextRound' })
    expect(state.phase).toBe('end')
  })
})

describe('scores', () => {
  it('additionne les manches par équipe', () => {
    const base = game({ modes: TIMES_UP_MODES, teams: defaultTeams(2), sameDeck: true })
    const state: GuessState = { ...base, scores: [[3, 1], [2, 4], [0, 5]] }
    expect(totalScore(state, 0)).toBe(5)
    expect(totalScore(state, 1)).toBe(10)
  })

  it('classe les équipes et partage le rang en cas d’égalité', () => {
    const base = game({ teams: defaultTeams(3) })
    const state: GuessState = { ...base, scores: [[4, 4, 1]] }
    const rows = ranking(state)
    expect(rows.map((row) => row.rank)).toEqual([1, 1, 3])
  })
})

describe('catalogue de cartes', () => {
  it('ne contient aucun identifiant en double', () => {
    const ids = GUESS_CARDS.map((card) => card.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('propose un paquet conséquent', () => {
    expect(GUESS_CARDS.length).toBeGreaterThanOrEqual(300)
  })

  it('fournit assez de cartes à mots interdits pour une manche complète', () => {
    expect(GUESS_CARDS.filter((card) => card.taboo?.length).length).toBeGreaterThanOrEqual(40)
  })

  it('remplit chaque catégorie', () => {
    for (const category of [
      'general',
      'celebrites',
      'films',
      'chansons',
      'sport',
      'nourriture',
      'lieux',
      'expressions',
    ] as const) {
      expect(countByCategory(category)).toBeGreaterThanOrEqual(35)
    }
  })

  it('filtre par catégorie', () => {
    const sport = filterCards(['sport'])
    expect(sport.every((card) => card.category === 'sport')).toBe(true)
    expect(filterCards([]).length).toBe(GUESS_CARDS.length)
  })
})
