import { defaultRng, shuffle } from '@/shared/lib/random'
import type { Rng } from '@/shared/lib/random'
import type { GuessCard } from './cards'
import type { GuessMode } from './modes'
import { MODES } from './modes'

export interface GuessTeam {
  id: string
  name: string
  color: string
}

export interface GuessConfig {
  teams: GuessTeam[]
  /** Une entrée par manche, dans l'ordre. */
  modes: GuessMode[]
  turnSeconds: number
  /** 0 = tout le paquet disponible. */
  cardsPerRound: number
  allowSkip: boolean
  /** 0 = passes illimitées (si autorisées). */
  maxSkips: number
  /** Time's Up : les mêmes cartes reviennent à chaque manche. */
  sameDeck: boolean
}

export type GuessPhase = 'ready' | 'playing' | 'turnEnd' | 'roundEnd' | 'end'

export interface TurnState {
  foundIds: string[]
  skipsUsed: number
}

export interface GuessState {
  phase: GuessPhase
  config: GuessConfig
  /** Index dans `config.modes`. */
  round: number
  teamIndex: number
  /** Paquet de la manche en cours, cartes restantes en tête. */
  deck: GuessCard[]
  /** Paquet complet de la manche, rejoué tel quel si `sameDeck`. */
  roundDeck: GuessCard[]
  /** Réserve où puiser les manches suivantes quand le paquet n'est pas rejoué. */
  reserve: GuessCard[]
  turn: TurnState
  /** `scores[manche][équipe]`. */
  scores: number[][]
}

export const MIN_TEAMS = 2
export const MAX_TEAMS = 6
export const TURN_DURATIONS = [30, 45, 60, 90] as const
export const CARDS_PER_ROUND = [20, 30, 40, 0] as const

export const TEAM_COLORS = ['#2ec4b6', '#ff9f1c', '#7c5cff', '#ff4d6d', '#ffd166', '#4cc9f0']

export function defaultTeams(count = 2): GuessTeam[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `team-${index}`,
    name: `Équipe ${index + 1}`,
    color: TEAM_COLORS[index % TEAM_COLORS.length] as string,
  }))
}

/**
 * Sélectionne les cartes jouables. Dès qu'une manche « Interdit » est prévue,
 * tout le paquet doit porter des mots interdits : les manches suivantes puisent
 * dans la même réserve, et une carte sans mots interdits rendrait la consigne
 * impossible à appliquer.
 */
export function buildPool(cards: readonly GuessCard[], modes: readonly GuessMode[]): GuessCard[] {
  const needsTaboo = modes.some((mode) => MODES[mode].needsTaboo)
  return needsTaboo ? cards.filter((card) => card.taboo && card.taboo.length > 0) : [...cards]
}

function takeDeck(pool: readonly GuessCard[], count: number): GuessCard[] {
  return count > 0 ? pool.slice(0, count) : [...pool]
}

export function createGame(
  config: GuessConfig,
  pool: readonly GuessCard[],
  rng: Rng = defaultRng,
): GuessState {
  const shuffled = shuffle(pool, rng)
  const roundDeck = takeDeck(shuffled, config.cardsPerRound)
  const reserve = shuffled.slice(roundDeck.length)

  return {
    phase: 'ready',
    config,
    round: 0,
    teamIndex: 0,
    deck: roundDeck,
    roundDeck,
    reserve,
    turn: { foundIds: [], skipsUsed: 0 },
    scores: config.modes.map(() => config.teams.map(() => 0)),
  }
}

export function currentMode(state: GuessState): GuessMode {
  return (state.config.modes[state.round] ?? 'libre') as GuessMode
}

export function currentCard(state: GuessState): GuessCard | undefined {
  return state.deck[0]
}

export function isLastRound(state: GuessState): boolean {
  return state.round >= state.config.modes.length - 1
}

export function canSkip(state: GuessState): boolean {
  if (!state.config.allowSkip) return false
  // Passer la dernière carte du paquet la remettrait aussitôt en main.
  if (state.deck.length < 2) return false
  return state.config.maxSkips === 0 || state.turn.skipsUsed < state.config.maxSkips
}

export function totalScore(state: GuessState, teamIndex: number): number {
  return state.scores.reduce((sum, round) => sum + (round[teamIndex] ?? 0), 0)
}

export interface GuessRanking {
  teamIndex: number
  team: GuessTeam
  total: number
  perRound: number[]
  rank: number
}

export function ranking(state: GuessState): GuessRanking[] {
  const rows = state.config.teams
    .map((team, teamIndex) => ({
      teamIndex,
      team,
      total: totalScore(state, teamIndex),
      perRound: state.scores.map((round) => round[teamIndex] ?? 0),
    }))
    .sort((a, b) => b.total - a.total)

  let lastTotal: number | null = null
  let lastRank = 0
  return rows.map((row, position) => {
    const rank = row.total === lastTotal ? lastRank : position + 1
    lastTotal = row.total
    lastRank = rank
    return { ...row, rank }
  })
}

function addScore(scores: number[][], round: number, teamIndex: number, delta: number): number[][] {
  return scores.map((row, index) =>
    index === round ? row.map((value, team) => (team === teamIndex ? value + delta : value)) : row,
  )
}

export type GuessAction =
  | { type: 'startTurn' }
  | { type: 'found' }
  | { type: 'skip' }
  | { type: 'endTurn' }
  | { type: 'nextTurn' }
  | { type: 'nextRound' }

export function guessReducer(
  state: GuessState,
  action: GuessAction,
  rng: Rng = defaultRng,
): GuessState {
  switch (action.type) {
    case 'startTurn': {
      if (state.phase !== 'ready') return state
      return { ...state, phase: 'playing', turn: { foundIds: [], skipsUsed: 0 } }
    }

    case 'found': {
      if (state.phase !== 'playing') return state
      const card = currentCard(state)
      if (!card) return state

      const deck = state.deck.slice(1)
      const next: GuessState = {
        ...state,
        deck,
        turn: { ...state.turn, foundIds: [...state.turn.foundIds, card.id] },
        scores: addScore(state.scores, state.round, state.teamIndex, 1),
      }
      // Paquet vidé en pleine manche : le tour s'arrête là, chrono ou pas.
      return deck.length === 0 ? { ...next, phase: 'turnEnd' } : next
    }

    case 'skip': {
      if (state.phase !== 'playing' || !canSkip(state)) return state
      const [card, ...rest] = state.deck as [GuessCard, ...GuessCard[]]
      return {
        ...state,
        deck: [...rest, card],
        turn: { ...state.turn, skipsUsed: state.turn.skipsUsed + 1 },
      }
    }

    case 'endTurn': {
      if (state.phase !== 'playing') return state
      return { ...state, phase: 'turnEnd' }
    }

    case 'nextTurn': {
      if (state.phase !== 'turnEnd') return state
      const teamIndex = (state.teamIndex + 1) % state.config.teams.length
      if (state.deck.length === 0) {
        return { ...state, phase: 'roundEnd', teamIndex }
      }
      return { ...state, phase: 'ready', teamIndex, turn: { foundIds: [], skipsUsed: 0 } }
    }

    case 'nextRound': {
      if (state.phase !== 'roundEnd') return state
      if (isLastRound(state)) return { ...state, phase: 'end' }

      const round = state.round + 1
      if (state.config.sameDeck) {
        return {
          ...state,
          phase: 'ready',
          round,
          deck: shuffle(state.roundDeck, rng),
          turn: { foundIds: [], skipsUsed: 0 },
        }
      }

      const roundDeck = takeDeck(state.reserve, state.config.cardsPerRound)
      // Réserve épuisée : on rejoue le paquet précédent plutôt que de bloquer.
      const fallback = roundDeck.length > 0 ? roundDeck : shuffle(state.roundDeck, rng)
      return {
        ...state,
        phase: 'ready',
        round,
        deck: fallback,
        roundDeck: fallback,
        reserve: state.reserve.slice(roundDeck.length),
        turn: { foundIds: [], skipsUsed: 0 },
      }
    }

    default:
      return state
  }
}
