import { defaultRng, randomInt, shuffle } from '@/shared/lib/random'
import type { Rng } from '@/shared/lib/random'
import type { TodCard, TodType } from './cards'

export type SelectionMode = 'rotation' | 'random'

export interface TodConfig {
  players: string[]
  selectionMode: SelectionMode
  /** 0 = partie sans fin, on s'arrête quand on veut. */
  maxTurns: number
  /** Gorgées encaissées en cas de refus. 0 = refuser ne coûte rien. */
  refusalSips: number
}

export type TodPhase = 'choice' | 'card' | 'end'

export interface TodStats {
  truthsAnswered: number
  daresCompleted: number
  refusals: number
  sips: number
}

export interface TodHistoryEntry {
  turn: number
  playerIndex: number
  type: TodType
  cardId: string
  cardText: string
  completed: boolean
}

export interface TodState {
  phase: TodPhase
  config: TodConfig
  turn: number
  currentPlayerIndex: number
  currentType: TodType | null
  currentCard: TodCard | null
  /** Cartes restantes, par type : on ne repasse pas deux fois la même. */
  decks: Record<TodType, TodCard[]>
  /** Paquet complet, pour remélanger quand un type est épuisé. */
  pools: Record<TodType, TodCard[]>
  stats: TodStats[]
  history: TodHistoryEntry[]
}

export const MIN_PLAYERS = 2
export const TURN_COUNTS = [0, 10, 20, 30] as const

export const DEFAULT_CONFIG: Omit<TodConfig, 'players'> = {
  selectionMode: 'rotation',
  maxTurns: 20,
  refusalSips: 2,
}

function emptyStats(): TodStats {
  return { truthsAnswered: 0, daresCompleted: 0, refusals: 0, sips: 0 }
}

export function createGame(
  config: TodConfig,
  cards: readonly TodCard[],
  rng: Rng = defaultRng,
): TodState {
  const truths = cards.filter((card) => card.type === 'truth')
  const dares = cards.filter((card) => card.type === 'dare')

  return {
    phase: 'choice',
    config,
    turn: 1,
    currentPlayerIndex: config.selectionMode === 'random' ? randomInt(config.players.length, rng) : 0,
    currentType: null,
    currentCard: null,
    decks: { truth: shuffle(truths, rng), dare: shuffle(dares, rng) },
    pools: { truth: truths, dare: dares },
    stats: config.players.map(emptyStats),
    history: [],
  }
}

/**
 * Choisit le joueur suivant. En mode aléatoire, on évite de retomber sur celui
 * qui vient de jouer : deux tours d'affilée, c'est ce qui casse le rythme.
 */
function nextPlayerIndex(state: TodState, rng: Rng): number {
  const count = state.config.players.length
  if (state.config.selectionMode === 'rotation') {
    return (state.currentPlayerIndex + 1) % count
  }
  if (count < 2) return 0
  const offset = 1 + randomInt(count - 1, rng)
  return (state.currentPlayerIndex + offset) % count
}

/** Pioche une carte du type demandé, en remélangeant le paquet une fois épuisé. */
function drawCard(
  state: TodState,
  type: TodType,
  rng: Rng,
): { card: TodCard | null; decks: TodState['decks'] } {
  const remaining = state.decks[type]
  if (remaining.length > 0) {
    const [card, ...rest] = remaining as [TodCard, ...TodCard[]]
    return { card, decks: { ...state.decks, [type]: rest } }
  }
  const refreshed = shuffle(state.pools[type], rng)
  if (refreshed.length === 0) return { card: null, decks: state.decks }
  const [card, ...rest] = refreshed as [TodCard, ...TodCard[]]
  return { card, decks: { ...state.decks, [type]: rest } }
}

export type TodAction =
  | { type: 'choose'; choice: TodType }
  | { type: 'resolve'; completed: boolean }
  | { type: 'skipCard' }
  | { type: 'stop' }

export function todReducer(state: TodState, action: TodAction, rng: Rng = defaultRng): TodState {
  switch (action.type) {
    case 'choose': {
      if (state.phase !== 'choice') return state
      const { card, decks } = drawCard(state, action.choice, rng)
      if (!card) return state
      return { ...state, phase: 'card', currentType: action.choice, currentCard: card, decks }
    }

    // Une carte impossible à réaliser ici ne doit pas obliger à refuser :
    // on en tire une autre sans rien compter.
    case 'skipCard': {
      if (state.phase !== 'card' || !state.currentType) return state
      const { card, decks } = drawCard(state, state.currentType, rng)
      if (!card) return state
      return { ...state, currentCard: card, decks }
    }

    case 'resolve': {
      if (state.phase !== 'card' || !state.currentCard || !state.currentType) return state

      const playerIndex = state.currentPlayerIndex
      const stats = state.stats.map((entry, index) => {
        if (index !== playerIndex) return entry
        if (action.completed) {
          return state.currentType === 'truth'
            ? { ...entry, truthsAnswered: entry.truthsAnswered + 1 }
            : { ...entry, daresCompleted: entry.daresCompleted + 1 }
        }
        return {
          ...entry,
          refusals: entry.refusals + 1,
          sips: entry.sips + state.config.refusalSips,
        }
      })

      const history: TodHistoryEntry[] = [
        ...state.history,
        {
          turn: state.turn,
          playerIndex,
          type: state.currentType,
          cardId: state.currentCard.id,
          cardText: state.currentCard.text,
          completed: action.completed,
        },
      ]

      const isLastTurn = state.config.maxTurns > 0 && state.turn >= state.config.maxTurns
      if (isLastTurn) {
        return { ...state, phase: 'end', stats, history, currentCard: null, currentType: null }
      }

      return {
        ...state,
        phase: 'choice',
        turn: state.turn + 1,
        currentPlayerIndex: nextPlayerIndex(state, rng),
        currentType: null,
        currentCard: null,
        stats,
        history,
      }
    }

    case 'stop': {
      if (state.phase === 'end') return state
      return { ...state, phase: 'end', currentCard: null, currentType: null }
    }

    default:
      return state
  }
}

export interface TodRanking {
  playerIndex: number
  name: string
  completed: number
  refusals: number
  sips: number
}

/** Classement par défis relevés, les refus départagent les ex æquo. */
export function ranking(state: TodState): TodRanking[] {
  return state.config.players
    .map((name, playerIndex) => {
      const stats = state.stats[playerIndex] ?? emptyStats()
      return {
        playerIndex,
        name,
        completed: stats.truthsAnswered + stats.daresCompleted,
        refusals: stats.refusals,
        sips: stats.sips,
      }
    })
    .sort((a, b) => b.completed - a.completed || a.refusals - b.refusals)
}
