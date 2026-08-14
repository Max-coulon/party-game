import { defaultRng, sample, shuffle } from '@/shared/lib/random'
import type { Rng } from '@/shared/lib/random'
import { normalizeWord } from './words'

/**
 * Le Réseau — deux camps, une grille de vingt-cinq mots, et deux chefs de
 * réseau qui seuls savent qui est à eux. Le chef donne un mot et un chiffre,
 * son équipe touche des cartes. Un mot pour l'adversaire et le tour s'arrête ;
 * la taupe, et la partie s'arrête tout court.
 */

export type Team = 'rouge' | 'bleu'
export type CardRole = Team | 'neutre' | 'taupe'
export type Phase = 'brief' | 'clue' | 'guess' | 'turnEnd' | 'end'

/** Pourquoi le tour s'est arrêté — l'écran de passage le raconte. */
export type TurnEndReason = 'neutre' | 'adversaire' | 'quota' | 'passe'

/** `reseau` : tous ses agents trouvés. `taupe` : quelqu'un l'a réveillée. */
export type EndReason = 'reseau' | 'taupe'

export const GRID_SIZE = 25
export const FIRST_TEAM_AGENTS = 9
export const SECOND_TEAM_AGENTS = 8
export const NEUTRAL_CARDS = 7
export const MAX_CLUE_COUNT = 9

export interface ReseauCard {
  word: string
  role: CardRole
  revealed: boolean
}

export interface Clue {
  team: Team
  word: string
  /** 0 = autant de propositions que l'équipe veut. */
  count: number
}

export interface ClueRecord extends Clue {
  /** Agents de l'équipe effectivement trouvés sur cet indice. */
  found: number
  outcome: TurnEndReason | 'gagne' | 'taupe' | null
}

export interface ReseauState {
  phase: Phase
  spymasters: Record<Team, string>
  cards: ReseauCard[]
  /** L'équipe qui a la main. */
  turn: Team
  /** Celle qui a commencé, donc celle qui a neuf agents. */
  starter: Team
  clue: Clue | null
  /** `null` = illimité (indice donné à 0). */
  guessesLeft: number | null
  guessesMade: number
  /** Carte visée, pas encore retournée : rien n'est irréversible sur un doigt qui glisse. */
  selected: number | null
  lastReveal: { index: number; role: CardRole } | null
  turnEndReason: TurnEndReason | null
  history: ClueRecord[]
  winner: Team | null
  endReason: EndReason | null
  round: number
}

export const TEAMS: readonly Team[] = ['rouge', 'bleu']

export const TEAM_LABELS: Record<Team, string> = { rouge: 'Rouge', bleu: 'Bleu' }

export const other = (team: Team): Team => (team === 'rouge' ? 'bleu' : 'rouge')

export const agentsFor = (state: ReseauState, team: Team): number =>
  team === state.starter ? FIRST_TEAM_AGENTS : SECOND_TEAM_AGENTS

/** Agents encore sur la table pour cette équipe. */
export const remaining = (state: ReseauState, team: Team): number =>
  state.cards.filter((card) => card.role === team && !card.revealed).length

export const found = (state: ReseauState, team: Team): number =>
  agentsFor(state, team) - remaining(state, team)

export function isSetupValid(spymasters: Record<Team, string>): boolean {
  const rouge = spymasters.rouge.trim()
  const bleu = spymasters.bleu.trim()
  return rouge.length > 0 && bleu.length > 0 && normalizeWord(rouge) !== normalizeWord(bleu)
}

export type ClueError = 'vide' | 'surLaTable'

/**
 * Un indice ne peut pas être un mot encore posé sur la table. On s'arrête là :
 * les formes dérivées se discutent entre joueurs, et une vérification trop
 * zélée refuserait « chat » à cause de « château ».
 */
export function clueError(state: ReseauState, word: string): ClueError | null {
  const candidate = normalizeWord(word)
  if (candidate.length === 0) return 'vide'
  const onTable = state.cards.some(
    (card) => !card.revealed && normalizeWord(card.word) === candidate,
  )
  return onTable ? 'surLaTable' : null
}

function buildRoles(starter: Team, rng: Rng): CardRole[] {
  const roles: CardRole[] = [
    ...Array.from({ length: FIRST_TEAM_AGENTS }, () => starter),
    ...Array.from({ length: SECOND_TEAM_AGENTS }, () => other(starter)),
    ...Array.from({ length: NEUTRAL_CARDS }, (): CardRole => 'neutre'),
    'taupe',
  ]
  return shuffle(roles, rng)
}

export function createGame(
  spymasters: Record<Team, string>,
  pool: readonly string[],
  rng: Rng = defaultRng,
): ReseauState {
  const words = sample(pool, GRID_SIZE, rng)
  const starter: Team = rng() < 0.5 ? 'rouge' : 'bleu'
  const roles = buildRoles(starter, rng)

  return {
    phase: 'brief',
    spymasters,
    cards: words.map((word, index) => ({
      word,
      role: roles[index] ?? 'neutre',
      revealed: false,
    })),
    turn: starter,
    starter,
    clue: null,
    guessesLeft: null,
    guessesMade: 0,
    selected: null,
    lastReveal: null,
    turnEndReason: null,
    history: [],
    winner: null,
    endReason: null,
    round: 1,
  }
}

/** Met à jour la ligne d'historique du tour en cours. */
function withLastRecord(
  history: readonly ClueRecord[],
  change: (record: ClueRecord) => ClueRecord,
): ClueRecord[] {
  if (history.length === 0) return [...history]
  return history.map((record, index) => (index === history.length - 1 ? change(record) : record))
}

function endTurn(state: ReseauState, reason: TurnEndReason): ReseauState {
  return {
    ...state,
    phase: 'turnEnd',
    turnEndReason: reason,
    selected: null,
    history: withLastRecord(state.history, (record) => ({ ...record, outcome: reason })),
  }
}

function win(state: ReseauState, winner: Team, endReason: EndReason): ReseauState {
  return {
    ...state,
    phase: 'end',
    winner,
    endReason,
    selected: null,
    history: withLastRecord(state.history, (record) => ({
      ...record,
      outcome: endReason === 'taupe' ? 'taupe' : 'gagne',
    })),
  }
}

function reveal(state: ReseauState, index: number): ReseauState {
  const card = state.cards[index]
  if (!card || card.revealed) return state

  const cards = state.cards.map((current, position) =>
    position === index ? { ...current, revealed: true } : current,
  )

  const next: ReseauState = {
    ...state,
    cards,
    selected: null,
    guessesMade: state.guessesMade + 1,
    lastReveal: { index, role: card.role },
    history: withLastRecord(state.history, (record) => ({
      ...record,
      found: record.found + (card.role === state.turn ? 1 : 0),
    })),
  }

  if (card.role === 'taupe') return win(next, other(state.turn), 'taupe')

  // Découvrir le dernier agent d'un camp le fait gagner, même si c'est
  // l'adversaire qui vient de le retourner pour vous.
  const owner = card.role === 'rouge' || card.role === 'bleu' ? card.role : null
  if (owner && remaining(next, owner) === 0) return win(next, owner, 'reseau')

  if (card.role === state.turn) {
    const left = next.guessesLeft === null ? null : next.guessesLeft - 1
    if (left !== null && left <= 0) return endTurn({ ...next, guessesLeft: 0 }, 'quota')
    return { ...next, guessesLeft: left }
  }

  return endTurn(next, card.role === 'neutre' ? 'neutre' : 'adversaire')
}

export type ReseauAction =
  | { type: 'takePhone' }
  | { type: 'submitClue'; word: string; count: number }
  | { type: 'selectCard'; index: number }
  | { type: 'confirmSelection' }
  | { type: 'pass' }
  | { type: 'nextTurn' }

export function reseauReducer(state: ReseauState, action: ReseauAction): ReseauState {
  switch (action.type) {
    case 'takePhone': {
      if (state.phase !== 'brief') return state
      return { ...state, phase: 'clue' }
    }

    case 'submitClue': {
      if (state.phase !== 'clue') return state
      if (clueError(state, action.word)) return state
      const count = Math.max(0, Math.min(MAX_CLUE_COUNT, Math.round(action.count)))
      const clue: Clue = { team: state.turn, word: action.word.trim(), count }
      return {
        ...state,
        phase: 'guess',
        clue,
        guessesLeft: count === 0 ? null : count + 1,
        guessesMade: 0,
        selected: null,
        lastReveal: null,
        turnEndReason: null,
        history: [...state.history, { ...clue, found: 0, outcome: null }],
      }
    }

    case 'selectCard': {
      if (state.phase !== 'guess') return state
      const card = state.cards[action.index]
      if (!card || card.revealed) return state
      return { ...state, selected: state.selected === action.index ? null : action.index }
    }

    case 'confirmSelection': {
      if (state.phase !== 'guess' || state.selected === null) return state
      return reveal(state, state.selected)
    }

    case 'pass': {
      // On ne passe pas sans avoir tenté au moins une carte : donner un indice
      // puis renoncer reviendrait à sauter son tour.
      if (state.phase !== 'guess' || state.guessesMade === 0) return state
      return endTurn(state, 'passe')
    }

    case 'nextTurn': {
      if (state.phase !== 'turnEnd') return state
      return {
        ...state,
        phase: 'brief',
        turn: other(state.turn),
        clue: null,
        guessesLeft: null,
        guessesMade: 0,
        selected: null,
        lastReveal: null,
        turnEndReason: null,
        round: state.round + 1,
      }
    }

    default:
      return state
  }
}
