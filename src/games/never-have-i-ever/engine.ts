import { defaultRng, shuffle } from '@/shared/lib/random'
import type { Rng } from '@/shared/lib/random'
import type { NheQuestion } from './questions'

export type Intensity = 'soft' | 'hot' | 'hardcore'

export const SIPS_BY_INTENSITY: Record<Intensity, number> = {
  soft: 1,
  hot: 2,
  hardcore: 3,
}

export interface SpecialRules {
  /** Un seul joueur boit : il boit double. */
  loneWolf: boolean
  /** Tout le monde boit sauf un : le survivant boit double, il rate trop de choses. */
  survivor: boolean
}

export interface NheConfig {
  players: string[]
  questionCount: number
  rules: SpecialRules
}

export type NhePhase = 'question' | 'result' | 'end'

export interface RoundResult {
  questionId: string
  questionText: string
  /** Index des joueurs qui ont déjà fait la chose. */
  drinkerIndexes: number[]
  /** Gorgées attribuées ce tour, par index de joueur. */
  sips: number[]
  triggeredRule: 'loneWolf' | 'survivor' | null
}

export interface NheState {
  phase: NhePhase
  config: NheConfig
  deck: NheQuestion[]
  index: number
  /** Sélection en cours, par index de joueur. */
  selection: boolean[]
  lastResult: RoundResult | null
  scores: number[]
  history: RoundResult[]
}

export const DEFAULT_RULES: SpecialRules = { loneWolf: true, survivor: true }
export const QUESTION_COUNTS = [10, 20, 30, 50] as const
export const MIN_PLAYERS = 2

export function createGame(
  config: NheConfig,
  pool: readonly NheQuestion[],
  rng: Rng = defaultRng,
): NheState {
  const deck = shuffle(pool, rng).slice(0, Math.max(1, config.questionCount))
  return {
    phase: 'question',
    config,
    deck,
    index: 0,
    selection: config.players.map(() => false),
    lastResult: null,
    scores: config.players.map(() => 0),
    history: [],
  }
}

export function currentQuestion(state: NheState): NheQuestion | undefined {
  return state.deck[state.index]
}

/**
 * Répartit les gorgées du tour. Les deux règles spéciales ne peuvent pas se
 * déclencher ensemble : « seul à boire » et « seul à ne pas boire » s'excluent
 * dès qu'il y a au moins trois joueurs, et à deux joueurs on donne la priorité
 * à celui qui boit.
 */
export function resolveRound(
  question: NheQuestion,
  selection: readonly boolean[],
  rules: SpecialRules,
): RoundResult {
  const base = SIPS_BY_INTENSITY[question.intensity]
  const drinkerIndexes = selection.flatMap((drank, index) => (drank ? [index] : []))
  const total = selection.length
  const sips = selection.map(() => 0)

  let triggeredRule: RoundResult['triggeredRule'] = null

  if (rules.loneWolf && drinkerIndexes.length === 1 && total >= 2) {
    triggeredRule = 'loneWolf'
  } else if (rules.survivor && drinkerIndexes.length === total - 1 && total >= 2) {
    triggeredRule = 'survivor'
  }

  for (const index of drinkerIndexes) {
    sips[index] = triggeredRule === 'loneWolf' ? base * 2 : base
  }

  if (triggeredRule === 'survivor') {
    const survivor = selection.findIndex((drank) => !drank)
    if (survivor >= 0) sips[survivor] = base * 2
  }

  return {
    questionId: question.id,
    questionText: question.text,
    drinkerIndexes,
    sips,
    triggeredRule,
  }
}

export interface Ranking {
  playerIndex: number
  name: string
  sips: number
  rank: number
}

/** Classement par gorgées, ex æquo au même rang. */
export function ranking(state: NheState): Ranking[] {
  const rows = state.config.players
    .map((name, playerIndex) => ({ playerIndex, name, sips: state.scores[playerIndex] ?? 0 }))
    .sort((a, b) => b.sips - a.sips)

  let lastSips: number | null = null
  let lastRank = 0
  return rows.map((row, position) => {
    const rank = row.sips === lastSips ? lastRank : position + 1
    lastSips = row.sips
    lastRank = rank
    return { ...row, rank }
  })
}

export type NheAction =
  | { type: 'toggleAnswer'; playerIndex: number }
  | { type: 'selectAll' }
  | { type: 'clearSelection' }
  | { type: 'confirmAnswers' }
  | { type: 'nextQuestion' }

export function nheReducer(state: NheState, action: NheAction): NheState {
  switch (action.type) {
    case 'toggleAnswer': {
      if (state.phase !== 'question') return state
      const selection = state.selection.map((value, index) =>
        index === action.playerIndex ? !value : value,
      )
      return { ...state, selection }
    }

    case 'selectAll': {
      if (state.phase !== 'question') return state
      return { ...state, selection: state.selection.map(() => true) }
    }

    case 'clearSelection': {
      if (state.phase !== 'question') return state
      return { ...state, selection: state.selection.map(() => false) }
    }

    case 'confirmAnswers': {
      if (state.phase !== 'question') return state
      const question = currentQuestion(state)
      if (!question) return state
      const result = resolveRound(question, state.selection, state.config.rules)
      return {
        ...state,
        phase: 'result',
        lastResult: result,
        scores: state.scores.map((score, index) => score + (result.sips[index] ?? 0)),
        history: [...state.history, result],
      }
    }

    case 'nextQuestion': {
      if (state.phase !== 'result') return state
      const next = state.index + 1
      if (next >= state.deck.length) {
        return { ...state, phase: 'end' }
      }
      return {
        ...state,
        phase: 'question',
        index: next,
        selection: state.selection.map(() => false),
        lastResult: null,
      }
    }

    default:
      return state
  }
}
