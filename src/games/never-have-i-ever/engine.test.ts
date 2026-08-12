import { describe, expect, it } from 'vitest'
import { createRng } from '@/shared/lib/random'
import {
  DEFAULT_RULES,
  SIPS_BY_INTENSITY,
  createGame,
  currentQuestion,
  nheReducer,
  ranking,
  resolveRound,
} from './engine'
import type { NheConfig, NheState } from './engine'
import { NHE_QUESTIONS, filterQuestions } from './questions'

const QUESTION = {
  id: 'q1',
  text: 'dansé sur une table',
  intensity: 'hot' as const,
  theme: 'soiree' as const,
}

function config(players: string[], overrides: Partial<NheConfig> = {}): NheConfig {
  return { players, questionCount: 10, rules: DEFAULT_RULES, ...overrides }
}

function game(players: string[], questionCount = 3): NheState {
  return createGame(config(players, { questionCount }), NHE_QUESTIONS, createRng(5))
}

describe('répartition des gorgées', () => {
  it('donne les gorgées de l’intensité à chaque buveur', () => {
    const result = resolveRound(QUESTION, [true, true, false, false], {
      loneWolf: false,
      survivor: false,
    })
    expect(result.sips).toEqual([2, 2, 0, 0])
    expect(result.triggeredRule).toBeNull()
  })

  it('respecte le barème par intensité', () => {
    expect(SIPS_BY_INTENSITY).toEqual({ soft: 1, hot: 2, hardcore: 3 })
    const soft = resolveRound({ ...QUESTION, intensity: 'soft' }, [true, false], {
      loneWolf: false,
      survivor: false,
    })
    expect(soft.sips).toEqual([1, 0])
  })

  it('double la mise du seul joueur qui boit', () => {
    const result = resolveRound(QUESTION, [true, false, false, false], DEFAULT_RULES)
    expect(result.triggeredRule).toBe('loneWolf')
    expect(result.sips).toEqual([4, 0, 0, 0])
  })

  it('double la mise du seul joueur qui ne boit pas', () => {
    const result = resolveRound(QUESTION, [true, true, true, false], DEFAULT_RULES)
    expect(result.triggeredRule).toBe('survivor')
    expect(result.sips).toEqual([2, 2, 2, 4])
  })

  it('ne déclenche aucune règle quand personne ne boit', () => {
    const result = resolveRound(QUESTION, [false, false, false], DEFAULT_RULES)
    expect(result.sips).toEqual([0, 0, 0])
    expect(result.triggeredRule).toBeNull()
    expect(result.drinkerIndexes).toEqual([])
  })

  it('ne déclenche aucune règle quand tout le monde boit', () => {
    const result = resolveRound(QUESTION, [true, true, true], DEFAULT_RULES)
    expect(result.sips).toEqual([2, 2, 2])
    expect(result.triggeredRule).toBeNull()
  })

  it('à deux joueurs, celui qui boit seul prime sur le survivant', () => {
    const result = resolveRound(QUESTION, [true, false], DEFAULT_RULES)
    expect(result.triggeredRule).toBe('loneWolf')
    expect(result.sips).toEqual([4, 0])
  })

  it('n’applique que les règles activées', () => {
    const result = resolveRound(QUESTION, [true, false, false], {
      loneWolf: false,
      survivor: true,
    })
    expect(result.triggeredRule).toBeNull()
    expect(result.sips).toEqual([2, 0, 0])
  })
})

describe('déroulé de la partie', () => {
  it('constitue un paquet de la taille demandée, sans doublon', () => {
    const state = game(['A', 'B'], 12)
    expect(state.deck).toHaveLength(12)
    expect(new Set(state.deck.map((question) => question.id)).size).toBe(12)
  })

  it('ne dépasse jamais le nombre de questions disponibles', () => {
    const state = createGame(config(['A', 'B'], { questionCount: 10_000 }), NHE_QUESTIONS)
    expect(state.deck).toHaveLength(NHE_QUESTIONS.length)
  })

  it('cumule les gorgées au fil des questions', () => {
    let state = game(['A', 'B'], 2)
    const firstSips = SIPS_BY_INTENSITY[currentQuestion(state)!.intensity]

    state = nheReducer(state, { type: 'toggleAnswer', playerIndex: 0 })
    state = nheReducer(state, { type: 'toggleAnswer', playerIndex: 1 })
    state = nheReducer(state, { type: 'confirmAnswers' })
    expect(state.phase).toBe('result')
    expect(state.scores).toEqual([firstSips, firstSips])

    state = nheReducer(state, { type: 'nextQuestion' })
    expect(state.phase).toBe('question')
    expect(state.selection).toEqual([false, false])

    const secondSips = SIPS_BY_INTENSITY[currentQuestion(state)!.intensity]
    state = nheReducer(state, { type: 'toggleAnswer', playerIndex: 0 })
    state = nheReducer(state, { type: 'toggleAnswer', playerIndex: 1 })
    state = nheReducer(state, { type: 'confirmAnswers' })
    expect(state.scores).toEqual([firstSips + secondSips, firstSips + secondSips])
  })

  it('termine la partie après la dernière question', () => {
    let state = game(['A', 'B'], 1)
    state = nheReducer(state, { type: 'confirmAnswers' })
    state = nheReducer(state, { type: 'nextQuestion' })
    expect(state.phase).toBe('end')
  })

  it('ignore une réponse envoyée pendant l’écran de résultat', () => {
    let state = game(['A', 'B'], 2)
    state = nheReducer(state, { type: 'confirmAnswers' })
    const unchanged = nheReducer(state, { type: 'toggleAnswer', playerIndex: 0 })
    expect(unchanged).toBe(state)
  })

  it('permet de tout cocher ou tout décocher d’un coup', () => {
    let state = game(['A', 'B', 'C'], 2)
    state = nheReducer(state, { type: 'selectAll' })
    expect(state.selection).toEqual([true, true, true])
    state = nheReducer(state, { type: 'clearSelection' })
    expect(state.selection).toEqual([false, false, false])
  })

  it('garde l’historique de chaque tour', () => {
    let state = game(['A', 'B'], 2)
    state = nheReducer(state, { type: 'toggleAnswer', playerIndex: 0 })
    state = nheReducer(state, { type: 'confirmAnswers' })
    expect(state.history).toHaveLength(1)
    expect(state.history[0]?.drinkerIndexes).toEqual([0])
  })
})

describe('classement', () => {
  it('classe par gorgées et donne le même rang aux ex æquo', () => {
    const state = { ...game(['A', 'B', 'C'], 1), scores: [4, 4, 1] }
    const rows = ranking(state)
    expect(rows.map((row) => row.rank)).toEqual([1, 1, 3])
    expect(rows[2]?.name).toBe('C')
  })
})

describe('catalogue de questions', () => {
  it('ne contient aucun identifiant en double', () => {
    const ids = NHE_QUESTIONS.map((question) => question.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('propose les trois intensités en quantité', () => {
    for (const intensity of ['soft', 'hot', 'hardcore'] as const) {
      expect(filterQuestions([intensity], []).length).toBeGreaterThanOrEqual(40)
    }
  })

  it('croise intensité et thème', () => {
    const filtered = filterQuestions(['soft'], ['soiree'])
    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered.every((q) => q.intensity === 'soft' && q.theme === 'soiree')).toBe(true)
  })

  it('inclut les questions ajoutées par les joueurs', () => {
    const custom = [{ id: 'custom-1', text: 'testé', intensity: 'soft' as const, theme: 'general' as const }]
    expect(filterQuestions(['soft'], [], custom).some((q) => q.id === 'custom-1')).toBe(true)
  })
})
