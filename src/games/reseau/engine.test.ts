import { describe, expect, it } from 'vitest'
import { createRng, randomInt } from '@/shared/lib/random'
import type { Rng } from '@/shared/lib/random'
import {
  FIRST_TEAM_AGENTS,
  GRID_SIZE,
  NEUTRAL_CARDS,
  SECOND_TEAM_AGENTS,
  clueError,
  createGame,
  found,
  isSetupValid,
  other,
  remaining,
  reseauReducer,
} from './engine'
import type { CardRole, ReseauState, Team } from './engine'
import { RESEAU_WORDS, normalizeWord } from './words'

const SPYMASTERS = { rouge: 'Léa', bleu: 'Tom' }

const game = (seed = 1): ReseauState => createGame(SPYMASTERS, RESEAU_WORDS, createRng(seed))

const roleCount = (state: ReseauState, role: CardRole) =>
  state.cards.filter((card) => card.role === role).length

/** Amène la partie à l'écran de proposition, indice donné. */
function withClue(state: ReseauState, count = 2, word = 'signal'): ReseauState {
  const briefed = reseauReducer(state, { type: 'takePhone' })
  return reseauReducer(briefed, { type: 'submitClue', word, count })
}

/** Retourne la première carte du rôle demandé. */
function pick(state: ReseauState, role: CardRole): ReseauState {
  const index = state.cards.findIndex((card) => card.role === role && !card.revealed)
  expect(index).toBeGreaterThanOrEqual(0)
  const selected = reseauReducer(state, { type: 'selectCard', index })
  return reseauReducer(selected, { type: 'confirmSelection' })
}

describe('les mots', () => {
  it('sont assez nombreux pour ne pas rejouer la même grille', () => {
    expect(RESEAU_WORDS.length).toBeGreaterThanOrEqual(300)
  })

  it('sont uniques, même à l’accent près', () => {
    const seen = new Set(RESEAU_WORDS.map(normalizeWord))
    expect(seen.size).toBe(RESEAU_WORDS.length)
  })

  it('tiennent dans une case de la grille', () => {
    const tooLong = RESEAU_WORDS.filter((word) => word.length > 11)
    expect(tooLong).toEqual([])
  })

  it('sont écrits en minuscules, sans espace', () => {
    const wrong = RESEAU_WORDS.filter((word) => word !== word.toLowerCase() || /\s/.test(word))
    expect(wrong).toEqual([])
  })
})

describe('la grille', () => {
  it('compte vingt-cinq mots distincts', () => {
    const state = game(3)
    expect(state.cards).toHaveLength(GRID_SIZE)
    expect(new Set(state.cards.map((card) => card.word)).size).toBe(GRID_SIZE)
  })

  it('répartit neuf, huit, sept et la taupe', () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const state = game(seed)
      expect(roleCount(state, state.starter)).toBe(FIRST_TEAM_AGENTS)
      expect(roleCount(state, other(state.starter))).toBe(SECOND_TEAM_AGENTS)
      expect(roleCount(state, 'neutre')).toBe(NEUTRAL_CARDS)
      expect(roleCount(state, 'taupe')).toBe(1)
    }
  })

  it('fait commencer celle qui a un agent de plus', () => {
    const state = game(5)
    expect(state.turn).toBe(state.starter)
    expect(remaining(state, state.starter)).toBe(FIRST_TEAM_AGENTS)
    expect(remaining(state, other(state.starter))).toBe(SECOND_TEAM_AGENTS)
  })

  it('tire des grilles différentes d’une partie à l’autre', () => {
    const first = game(1).cards.map((card) => card.word)
    const second = game(2).cards.map((card) => card.word)
    expect(first).not.toEqual(second)
  })

  it('exige deux chefs de réseau distincts', () => {
    expect(isSetupValid({ rouge: 'Léa', bleu: 'Tom' })).toBe(true)
    expect(isSetupValid({ rouge: '', bleu: 'Tom' })).toBe(false)
    expect(isSetupValid({ rouge: 'Léa', bleu: '  ' })).toBe(false)
    expect(isSetupValid({ rouge: 'Léa', bleu: 'lea' })).toBe(false)
  })
})

describe('l’indice', () => {
  it('refuse un mot posé sur la table, accents compris', () => {
    const state = game(7)
    const onTable = state.cards[0]?.word as string
    expect(clueError(state, onTable)).toBe('surLaTable')
    expect(clueError(state, onTable.toUpperCase())).toBe('surLaTable')
    expect(clueError(state, normalizeWord(onTable))).toBe('surLaTable')
  })

  it('refuse un indice vide', () => {
    expect(clueError(game(7), '   ')).toBe('vide')
  })

  it('accepte à nouveau un mot une fois la carte retournée', () => {
    const state = withClue(game(7))
    const target = state.cards[0]?.word as string
    const revealed = reseauReducer(
      reseauReducer(state, { type: 'selectCard', index: 0 }),
      { type: 'confirmSelection' },
    )
    expect(clueError(revealed, target)).toBeNull()
  })

  it('ouvre le tour avec une proposition de plus que le chiffre', () => {
    const state = withClue(game(9), 3)
    expect(state.phase).toBe('guess')
    expect(state.guessesLeft).toBe(4)
    expect(state.clue).toEqual({ team: state.turn, word: 'signal', count: 3 })
  })

  it('laisse le champ libre sur un indice à zéro', () => {
    const state = withClue(game(9), 0)
    expect(state.guessesLeft).toBeNull()
  })
})

describe('les propositions', () => {
  it('ne retourne rien tant que la carte visée n’est pas confirmée', () => {
    const state = withClue(game(11))
    const selected = reseauReducer(state, { type: 'selectCard', index: 4 })
    expect(selected.selected).toBe(4)
    expect(selected.cards[4]?.revealed).toBe(false)

    const unselected = reseauReducer(selected, { type: 'selectCard', index: 4 })
    expect(unselected.selected).toBeNull()
  })

  it('laisse la main à l’équipe sur un de ses agents', () => {
    const state = withClue(game(11), 3)
    const after = pick(state, state.turn)
    expect(after.phase).toBe('guess')
    expect(after.turn).toBe(state.turn)
    expect(after.guessesLeft).toBe(3)
    expect(found(after, state.turn)).toBe(1)
  })

  it('arrête le tour sur une carte neutre', () => {
    const state = withClue(game(11), 3)
    const after = pick(state, 'neutre')
    expect(after.phase).toBe('turnEnd')
    expect(after.turnEndReason).toBe('neutre')
  })

  it('arrête le tour et sert l’adversaire sur une carte adverse', () => {
    const state = withClue(game(11), 3)
    const rival = other(state.turn)
    const after = pick(state, rival)
    expect(after.phase).toBe('turnEnd')
    expect(after.turnEndReason).toBe('adversaire')
    expect(found(after, rival)).toBe(1)
  })

  it('arrête le tour quand le quota est épuisé', () => {
    let state = withClue(game(13), 1)
    expect(state.guessesLeft).toBe(2)
    state = pick(state, state.turn)
    expect(state.guessesLeft).toBe(1)
    const turn = state.turn
    state = pick(state, turn)
    expect(state.phase).toBe('turnEnd')
    expect(state.turnEndReason).toBe('quota')
  })

  it('ne laisse pas passer sans avoir tenté une carte', () => {
    const state = withClue(game(13), 2)
    expect(reseauReducer(state, { type: 'pass' })).toBe(state)

    const after = pick(state, state.turn)
    const passed = reseauReducer(after, { type: 'pass' })
    expect(passed.phase).toBe('turnEnd')
    expect(passed.turnEndReason).toBe('passe')
  })

  it('passe la main à l’autre camp au tour suivant', () => {
    const state = withClue(game(13), 2)
    const stopped = pick(state, 'neutre')
    const next = reseauReducer(stopped, { type: 'nextTurn' })
    expect(next.phase).toBe('brief')
    expect(next.turn).toBe(other(state.turn))
    expect(next.clue).toBeNull()
    expect(next.round).toBe(2)
  })

  it('ignore les actions hors phase', () => {
    const state = game(17)
    expect(reseauReducer(state, { type: 'confirmSelection' })).toBe(state)
    expect(reseauReducer(state, { type: 'selectCard', index: 0 })).toBe(state)
    expect(reseauReducer(state, { type: 'nextTurn' })).toBe(state)
    expect(reseauReducer(state, { type: 'submitClue', word: 'signal', count: 2 })).toBe(state)
  })
})

describe('la fin de partie', () => {
  it('donne la victoire au camp qui trouve tout son réseau', () => {
    let state = withClue(game(19), 0)
    const team = state.turn
    for (let i = 0; i < FIRST_TEAM_AGENTS + SECOND_TEAM_AGENTS; i += 1) {
      if (state.phase !== 'guess') break
      state = pick(state, team)
    }
    expect(state.phase).toBe('end')
    expect(state.winner).toBe(team)
    expect(state.endReason).toBe('reseau')
    expect(remaining(state, team)).toBe(0)
  })

  it('fait gagner l’adversaire quand on réveille la taupe', () => {
    const state = withClue(game(21), 3)
    const after = pick(state, 'taupe')
    expect(after.phase).toBe('end')
    expect(after.endReason).toBe('taupe')
    expect(after.winner).toBe(other(state.turn))
    expect(after.history.at(-1)?.outcome).toBe('taupe')
  })

  it('fait gagner l’adversaire si on retourne son dernier agent', () => {
    let state = withClue(game(23), 0)
    const rival = other(state.turn)
    for (let i = 0; i < SECOND_TEAM_AGENTS + FIRST_TEAM_AGENTS; i += 1) {
      if (state.phase !== 'guess') break
      state = pick(state, rival)
      if (state.phase === 'turnEnd') state = reseauReducer(state, { type: 'nextTurn' })
      if (state.phase === 'brief') state = withClue(state, 0)
    }
    expect(state.phase).toBe('end')
    expect(state.winner).toBe(rival)
    expect(state.endReason).toBe('reseau')
  })
})

describe('une partie entière au hasard', () => {
  function play(state: ReseauState, rng: Rng): ReseauState {
    let current = state
    for (let guard = 0; guard < 500 && current.phase !== 'end'; guard += 1) {
      if (current.phase === 'brief') current = reseauReducer(current, { type: 'takePhone' })
      else if (current.phase === 'clue')
        current = reseauReducer(current, {
          type: 'submitClue',
          word: `indice-${current.round}`,
          count: 1 + randomInt(3, rng),
        })
      else if (current.phase === 'turnEnd') current = reseauReducer(current, { type: 'nextTurn' })
      else {
        const hidden = current.cards.flatMap((card, index) => (card.revealed ? [] : [index]))
        const index = hidden[randomInt(hidden.length, rng)] as number
        current = reseauReducer(current, { type: 'selectCard', index })
        current = reseauReducer(current, { type: 'confirmSelection' })
      }
    }
    return current
  }

  it('finit toujours sur un vainqueur cohérent', () => {
    for (let seed = 1; seed <= 30; seed += 1) {
      const rng = createRng(seed * 13)
      const end = play(game(seed), rng)

      expect(end.phase).toBe('end')
      expect(end.winner).not.toBeNull()

      const winner = end.winner as Team
      if (end.endReason === 'reseau') {
        expect(remaining(end, winner)).toBe(0)
      } else {
        expect(end.cards.some((card) => card.role === 'taupe' && card.revealed)).toBe(true)
        expect(remaining(end, winner)).toBeGreaterThan(0)
      }

      // Aucun indice ne reste ouvert une fois la partie close.
      expect(end.history.every((record) => record.outcome !== null)).toBe(true)
    }
  })
})
