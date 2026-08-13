import { defaultRng, randomInt, shuffle } from '@/shared/lib/random'
import type { Rng } from '@/shared/lib/random'
import type { WordPair } from './words'

export type Role = 'civil' | 'undercover' | 'mrwhite'
export type Winner = 'civils' | 'imposteurs' | 'mrwhite'

export interface UndercoverPlayer {
  id: string
  name: string
  role: Role
  /** `null` pour Mr White : il n'a aucun mot. */
  word: string | null
  eliminated: boolean
  eliminatedRound: number | null
}

export type VoteMode = 'secret' | 'group'
export type TieBreak = 'revote' | 'random'

export interface UndercoverRules {
  undercoverCount: number
  mrWhiteCount: number
  /** 0 = discussion sans chrono. */
  discussionSeconds: number
  voteMode: VoteMode
  tieBreak: TieBreak
  revealRoleOnElimination: boolean
}

export type Phase = 'reveal' | 'discussion' | 'vote' | 'voteResult' | 'mrWhiteGuess' | 'end'

export interface EliminationEntry {
  round: number
  playerId: string
  playerName: string
  role: Role
  votes: number
}

export interface TallyEntry {
  playerId: string
  votes: number
}

export interface UndercoverState {
  phase: Phase
  rules: UndercoverRules
  pair: WordPair
  players: UndercoverPlayer[]
  round: number
  /** Index du joueur en train de découvrir son mot. */
  revealIndex: number
  /** Qui parle en premier ce tour — jamais Mr White, ce serait injouable pour lui. */
  firstSpeakerId: string | null
  /** Index dans `votingOrder` du joueur en train de voter. */
  voterIndex: number
  votes: Record<string, string>
  /** Cibles autorisées : restreint aux ex æquo pendant un second tour de vote. */
  candidateIds: string[] | null
  isRevote: boolean
  pendingEliminationId: string | null
  lastTally: TallyEntry[]
  mrWhiteGuessingId: string | null
  mrWhiteGuess: string | null
  mrWhiteGuessCorrect: boolean | null
  history: EliminationEntry[]
  winner: Winner | null
}

export const DISCUSSION_DURATIONS = [0, 60, 90, 120, 180] as const

export const DEFAULT_RULES: UndercoverRules = {
  undercoverCount: 1,
  mrWhiteCount: 0,
  discussionSeconds: 0,
  voteMode: 'secret',
  tieBreak: 'revote',
  revealRoleOnElimination: true,
}

export const MIN_PLAYERS = 4

/**
 * Les civils doivent être strictement majoritaires au départ, sinon les
 * imposteurs gagnent avant même le premier vote.
 */
export function maxImpostors(playerCount: number): number {
  return Math.max(1, Math.floor((playerCount - 1) / 2))
}

export function isSetupValid(playerCount: number, rules: UndercoverRules): boolean {
  if (playerCount < MIN_PLAYERS) return false
  const impostors = rules.undercoverCount + rules.mrWhiteCount
  return impostors >= 1 && impostors <= maxImpostors(playerCount)
}

export function alivePlayers(state: UndercoverState): UndercoverPlayer[] {
  return state.players.filter((player) => !player.eliminated)
}

export function playerById(state: UndercoverState, id: string): UndercoverPlayer | undefined {
  return state.players.find((player) => player.id === id)
}

/** Ordre de vote : les éliminés ne votent pas. */
export function votingOrder(state: UndercoverState): UndercoverPlayer[] {
  return alivePlayers(state)
}

/** Cibles possibles pour un votant : jamais soi-même, jamais un éliminé. */
export function voteTargets(state: UndercoverState, voterId: string): UndercoverPlayer[] {
  const allowed = state.candidateIds
  return alivePlayers(state).filter(
    (player) => player.id !== voterId && (allowed === null || allowed.includes(player.id)),
  )
}

function pickFirstSpeaker(players: UndercoverPlayer[], rng: Rng): string | null {
  const eligible = players.filter((player) => !player.eliminated && player.role !== 'mrwhite')
  const pool = eligible.length > 0 ? eligible : players.filter((player) => !player.eliminated)
  if (pool.length === 0) return null
  return (pool[randomInt(pool.length, rng)] as UndercoverPlayer).id
}

export function createGame(
  names: readonly string[],
  pair: WordPair,
  rules: UndercoverRules,
  rng: Rng = defaultRng,
): UndercoverState {
  const roles: Role[] = []
  for (let i = 0; i < rules.undercoverCount; i += 1) roles.push('undercover')
  for (let i = 0; i < rules.mrWhiteCount; i += 1) roles.push('mrwhite')
  while (roles.length < names.length) roles.push('civil')

  // Seuls les rôles sont mélangés : l'ordre des joueurs reste celui de la
  // liste du setup, que l'on veut pouvoir régler pour le tour de table.
  const shuffledRoles = shuffle(roles, rng)

  const players: UndercoverPlayer[] = names.map((name, index) => {
    const role = shuffledRoles[index] as Role
    return {
      id: `p${index}`,
      name,
      role,
      word: role === 'mrwhite' ? null : role === 'undercover' ? pair.undercover : pair.civil,
      eliminated: false,
      eliminatedRound: null,
    }
  })

  return {
    phase: 'reveal',
    rules,
    pair,
    players,
    round: 1,
    revealIndex: 0,
    firstSpeakerId: pickFirstSpeaker(players, rng),
    voterIndex: 0,
    votes: {},
    candidateIds: null,
    isRevote: false,
    pendingEliminationId: null,
    lastTally: [],
    mrWhiteGuessingId: null,
    mrWhiteGuess: null,
    mrWhiteGuessCorrect: null,
    history: [],
    winner: null,
  }
}

function tallyVotes(state: UndercoverState): TallyEntry[] {
  const counts = new Map<string, number>()
  for (const player of alivePlayers(state)) counts.set(player.id, 0)
  for (const targetId of Object.values(state.votes)) {
    counts.set(targetId, (counts.get(targetId) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([playerId, votes]) => ({ playerId, votes }))
    .sort((a, b) => b.votes - a.votes)
}

/**
 * Fin de partie. Les imposteurs l'emportent dès qu'ils ne sont plus en
 * infériorité : à égalité, les civils ne peuvent plus les sortir au vote.
 */
function resolveWinner(players: UndercoverPlayer[]): Winner | null {
  const alive = players.filter((player) => !player.eliminated)
  const impostors = alive.filter((player) => player.role !== 'civil')
  const civils = alive.filter((player) => player.role === 'civil')
  if (impostors.length === 0) return 'civils'
  if (impostors.length >= civils.length) return 'imposteurs'
  return null
}

function startNextRound(state: UndercoverState, rng: Rng): UndercoverState {
  const winner = resolveWinner(state.players)
  if (winner) return { ...state, phase: 'end', winner }
  return {
    ...state,
    phase: 'discussion',
    round: state.round + 1,
    firstSpeakerId: pickFirstSpeaker(state.players, rng),
    voterIndex: 0,
    votes: {},
    candidateIds: null,
    isRevote: false,
    pendingEliminationId: null,
    lastTally: [],
    mrWhiteGuessingId: null,
    mrWhiteGuess: null,
    mrWhiteGuessCorrect: null,
  }
}

/** Compare deux mots à la tolérance près : casse, accents, ponctuation, espaces. */
export function normalizeGuess(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export type UndercoverAction =
  | { type: 'nextReveal' }
  | { type: 'startVote' }
  | { type: 'castVote'; voterId: string; targetId: string }
  | { type: 'undoVote' }
  | { type: 'groupVote'; targetId: string }
  | { type: 'confirmElimination' }
  | { type: 'submitMrWhiteGuess'; guess: string }
  | { type: 'continueAfterGuess' }

export function undercoverReducer(
  state: UndercoverState,
  action: UndercoverAction,
  rng: Rng = defaultRng,
): UndercoverState {
  switch (action.type) {
    case 'nextReveal': {
      if (state.phase !== 'reveal') return state
      const next = state.revealIndex + 1
      if (next >= state.players.length) {
        return { ...state, phase: 'discussion', revealIndex: next }
      }
      return { ...state, revealIndex: next }
    }

    case 'startVote': {
      if (state.phase !== 'discussion') return state
      return { ...state, phase: 'vote', voterIndex: 0, votes: {} }
    }

    case 'castVote': {
      if (state.phase !== 'vote' || state.rules.voteMode !== 'secret') return state
      const order = votingOrder(state)
      const voter = order[state.voterIndex]
      // Un vote ne peut venir que du joueur dont c'est le tour.
      if (!voter || voter.id !== action.voterId) return state
      if (!voteTargets(state, action.voterId).some((target) => target.id === action.targetId)) {
        return state
      }

      const votes = { ...state.votes, [action.voterId]: action.targetId }
      const nextIndex = state.voterIndex + 1
      if (nextIndex < order.length) {
        return { ...state, votes, voterIndex: nextIndex }
      }
      return resolveVotes({ ...state, votes, voterIndex: nextIndex }, rng)
    }

    case 'undoVote': {
      if (state.phase !== 'vote' || state.voterIndex === 0) return state
      const order = votingOrder(state)
      const previous = order[state.voterIndex - 1]
      if (!previous) return state
      const votes = { ...state.votes }
      delete votes[previous.id]
      return { ...state, votes, voterIndex: state.voterIndex - 1 }
    }

    case 'groupVote': {
      if (state.phase !== 'vote' || state.rules.voteMode !== 'group') return state
      const target = playerById(state, action.targetId)
      if (!target || target.eliminated) return state
      if (state.candidateIds && !state.candidateIds.includes(action.targetId)) return state
      return {
        ...state,
        phase: 'voteResult',
        pendingEliminationId: action.targetId,
        lastTally: [],
      }
    }

    case 'confirmElimination': {
      if (state.phase !== 'voteResult' || !state.pendingEliminationId) return state
      const eliminatedId = state.pendingEliminationId
      const target = playerById(state, eliminatedId)
      if (!target) return state

      const players = state.players.map((player) =>
        player.id === eliminatedId
          ? { ...player, eliminated: true, eliminatedRound: state.round }
          : player,
      )
      const votes = state.lastTally.find((entry) => entry.playerId === eliminatedId)?.votes ?? 0
      const history: EliminationEntry[] = [
        ...state.history,
        {
          round: state.round,
          playerId: target.id,
          playerName: target.name,
          role: target.role,
          votes,
        },
      ]
      const next = { ...state, players, history, pendingEliminationId: null }

      // Mr White éliminé garde une chance : deviner le mot des civils.
      if (target.role === 'mrwhite') {
        return { ...next, phase: 'mrWhiteGuess', mrWhiteGuessingId: target.id }
      }
      return startNextRound(next, rng)
    }

    case 'submitMrWhiteGuess': {
      if (state.phase !== 'mrWhiteGuess') return state
      const correct = normalizeGuess(action.guess) === normalizeGuess(state.pair.civil)
      if (correct) {
        return {
          ...state,
          phase: 'end',
          mrWhiteGuess: action.guess,
          mrWhiteGuessCorrect: true,
          winner: 'mrwhite',
        }
      }
      return { ...state, mrWhiteGuess: action.guess, mrWhiteGuessCorrect: false }
    }

    case 'continueAfterGuess': {
      if (state.phase !== 'mrWhiteGuess' || state.mrWhiteGuessCorrect !== false) return state
      return startNextRound(state, rng)
    }

    default:
      return state
  }
}

/** Dépouillement : un seul en tête élimine, sinon on applique la règle d'égalité. */
function resolveVotes(state: UndercoverState, rng: Rng): UndercoverState {
  const tally = tallyVotes(state)
  const eligible = state.candidateIds
    ? tally.filter((entry) => state.candidateIds?.includes(entry.playerId))
    : tally
  const top = eligible[0]
  if (!top) return { ...state, phase: 'voteResult', lastTally: tally }

  const leaders = eligible.filter((entry) => entry.votes === top.votes)

  if (leaders.length === 1) {
    return {
      ...state,
      phase: 'voteResult',
      lastTally: tally,
      pendingEliminationId: top.playerId,
    }
  }

  // Un second tour déjà ex æquo repartirait en boucle : on tranche au sort.
  if (state.isRevote || state.rules.tieBreak === 'random') {
    const chosen = leaders[randomInt(leaders.length, rng)] as TallyEntry
    return {
      ...state,
      phase: 'voteResult',
      lastTally: tally,
      pendingEliminationId: chosen.playerId,
    }
  }

  return {
    ...state,
    phase: 'vote',
    lastTally: tally,
    candidateIds: leaders.map((entry) => entry.playerId),
    isRevote: true,
    votes: {},
    voterIndex: 0,
  }
}
