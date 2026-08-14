import { defaultRng, shuffle } from '@/shared/lib/random'
import type { Rng } from '@/shared/lib/random'
import { PUANT_ID, buildDeck, extractPairs, findPartner } from './cards'
import type { Card, DeckSize, PairingRule } from './cards'

/**
 * Le Puant — pouilleux, mistigri, vieux garçon. Un seul téléphone qui passe de
 * main en main : l'écran ne montre jamais que la main de celui qui le tient,
 * et l'éventail du voisin n'est qu'une grille de dos, remélangée à chaque
 * présentation pour que personne ne mémorise une position.
 */

export type PuantPhase = 'pass' | 'hand' | 'draw' | 'drawn' | 'end'

/** De quel côté on pioche : chez le joueur précédent, ou chez le suivant. */
export type Direction = 'left' | 'right'

export interface PuantRules {
  pairing: PairingRule
  deckSize: DeckSize
  direction: Direction
  /** Gorgées pour celui qui finit avec le puant. 0 pour jouer à sec. */
  forfeitSips: number
}

export interface PuantPlayer {
  id: string
  name: string
  hand: Card[]
  pairs: Card[][]
  /** Plus une carte en main : sorti du jeu, donc sauvé. */
  out: boolean
  /** Ordre de sortie, 1 pour le premier débarrassé. `null` tant qu'il joue. */
  outAt: number | null
}

export interface PuantState {
  phase: PuantPhase
  rules: PuantRules
  players: PuantPlayer[]
  /** Qui tient le téléphone et pioche. */
  turnIndex: number
  /** Chez qui il pioche. */
  sourceIndex: number
  /** Ordre d'affichage des dos de l'éventail présenté. */
  fanOrder: string[]
  drawn: Card | null
  /** La paire que la carte piochée vient de compléter, s'il y en a une. */
  matched: [Card, Card] | null
  /** Joueurs sortis à la fin du tour précédent, pour l'annoncer une fois. */
  wentOut: string[]
  turn: number
  loserId: string | null
}

export const MIN_PLAYERS = 3
export const MAX_PLAYERS = 8

export const DEFAULT_RULES: PuantRules = {
  pairing: 'color',
  deckSize: 52,
  direction: 'left',
  forfeitSips: 2,
}

export function isSetupValid(playerCount: number): boolean {
  return playerCount >= MIN_PLAYERS && playerCount <= MAX_PLAYERS
}

// — Lecture d'état ————————————————————————————————————————————————————

export const activePlayers = (state: PuantState): PuantPlayer[] =>
  state.players.filter((player) => !player.out)

export const currentPlayer = (state: PuantState): PuantPlayer | undefined =>
  state.players[state.turnIndex]

export const sourcePlayer = (state: PuantState): PuantPlayer | undefined =>
  state.players[state.sourceIndex]

export const playerById = (state: PuantState, id: string): PuantPlayer | undefined =>
  state.players.find((player) => player.id === id)

/** Les sauvés, dans leur ordre de sortie. */
export const savedOrder = (state: PuantState): PuantPlayer[] =>
  state.players
    .filter((player) => player.outAt !== null)
    .sort((a, b) => (a.outAt ?? 0) - (b.outAt ?? 0))

/** Qui détient le valet de pique. Réservé à l'écran de fin, évidemment. */
export const puantHolder = (state: PuantState): PuantPlayer | undefined =>
  state.players.find((player) => player.hand.some((card) => card.id === PUANT_ID))

const holdsPuant = (player: PuantPlayer | undefined): boolean =>
  player?.hand.some((card) => card.id === PUANT_ID) ?? false

/**
 * Le duel final, à deux joueurs. Ce qui reste en jeu est toujours le puant plus
 * des paires entières — la défausse ne sort que des paires complètes — et
 * personne ne garde une paire en main : chacune de ces paires est donc coupée
 * en deux, une moitié chez chaque joueur.
 *
 * Il en découle deux choses. Le porteur du puant a exactement une carte de plus
 * que l'autre, donc tout le monde sait qui l'a : ça se compte, ici comme autour
 * d'une vraie table. Et toutes les cartes de son adversaire ont leur jumelle
 * dans sa propre main, donc s'il piochait il ferait une paire à tous les coups.
 * Son tour n'aurait aucun enjeu : on le lui retire, et l'autre pioche jusqu'à
 * se vider — ou jusqu'à ramasser le puant, ce qui échange les rôles.
 *
 * À trois joueurs et plus, sauter le tour de quelqu'un révélerait qu'il tient
 * le puant : la règle ne vaut qu'à deux, là où l'information est déjà publique.
 */
export const isFinalDuel = (state: PuantState): boolean =>
  state.phase !== 'end' && activePlayers(state).length === 2

// — Mécanique ——————————————————————————————————————————————————————————

/** Le premier joueur encore en jeu en partant de `from`, dans le sens `step`. */
function neighbourIndex(players: readonly PuantPlayer[], from: number, step: number): number {
  const count = players.length
  for (let offset = 1; offset < count; offset += 1) {
    const index = (((from + step * offset) % count) + count) % count
    const player = players[index]
    if (player && !player.out) return index
  }
  return -1
}

/**
 * Marque comme sortis les joueurs qui viennent de vider leur main. Un joueur
 * sorti ne pioche plus et ne se fait plus piocher : il est simplement sauté.
 */
function markExits(players: readonly PuantPlayer[]): { players: PuantPlayer[]; wentOut: string[] } {
  let rank = players.reduce((max, player) => Math.max(max, player.outAt ?? 0), 0)
  const wentOut: string[] = []

  const next = players.map((player) => {
    if (player.out || player.hand.length > 0) return player
    rank += 1
    wentOut.push(player.id)
    return { ...player, out: true, outAt: rank }
  })

  return { players: next, wentOut }
}

/**
 * Prépare le tour à jouer : qui présente son éventail, et dans quel ordre.
 * S'il ne reste qu'un joueur avec des cartes, il ne peut en avoir qu'une — le
 * valet de pique — et la partie est finie.
 */
function settle(state: PuantState, rng: Rng): PuantState {
  const active = activePlayers(state)
  if (active.length <= 1) {
    return {
      ...state,
      phase: 'end',
      loserId: active[0]?.id ?? null,
      fanOrder: [],
      drawn: null,
      matched: null,
    }
  }

  const step = state.rules.direction === 'left' ? -1 : 1
  let turnIndex = state.turnIndex
  let sourceIndex = neighbourIndex(state.players, turnIndex, step)

  // Le duel final. Voir `isFinalDuel` : à deux, le porteur du puant ne pioche
  // plus, c'est l'autre qui vient se servir chez lui jusqu'à se vider.
  if (active.length === 2 && holdsPuant(state.players[turnIndex])) {
    const holder = turnIndex
    turnIndex = sourceIndex
    sourceIndex = holder
  }

  const source = state.players[sourceIndex]
  if (!source) return state

  return {
    ...state,
    phase: 'pass',
    turnIndex,
    sourceIndex,
    // Remélangé à chaque présentation : sinon on retient « le puant était en
    // troisième position » d'un tour sur l'autre.
    fanOrder: shuffle(
      source.hand.map((card) => card.id),
      rng,
    ),
    drawn: null,
    matched: null,
  }
}

export function createGame(
  names: readonly string[],
  rules: PuantRules,
  rng: Rng = defaultRng,
): PuantState {
  const deck = shuffle(buildDeck(rules.deckSize, rules.pairing), rng)
  const hands: Card[][] = names.map(() => [])

  deck.forEach((card, index) => {
    hands[index % names.length]?.push(card)
  })

  const dealt: PuantPlayer[] = names.map((name, index) => {
    const { kept, pairs } = extractPairs(hands[index] ?? [], rules.pairing)
    return { id: `p${index}`, name, hand: kept, pairs, out: false, outAt: null }
  })

  // Une main entièrement appariée à la donne est rare mais possible : ce
  // joueur est sauvé sans avoir joué un seul tour.
  const { players, wentOut } = markExits(dealt)
  const first = players.findIndex((player) => !player.out)

  return settle(
    {
      phase: 'pass',
      rules,
      players,
      turnIndex: first === -1 ? 0 : first,
      sourceIndex: 0,
      fanOrder: [],
      drawn: null,
      matched: null,
      wentOut,
      turn: 1,
      loserId: null,
    },
    rng,
  )
}

export type PuantAction =
  | { type: 'takePhone' }
  | { type: 'openFan' }
  | { type: 'drawAt'; position: number }
  | { type: 'endTurn' }

export function puantReducer(
  state: PuantState,
  action: PuantAction,
  rng: Rng = defaultRng,
): PuantState {
  switch (action.type) {
    case 'takePhone': {
      if (state.phase !== 'pass') return state
      return { ...state, phase: 'hand', wentOut: [] }
    }

    case 'openFan': {
      if (state.phase !== 'hand') return state
      return { ...state, phase: 'draw' }
    }

    case 'drawAt': {
      if (state.phase !== 'draw') return state
      const drawnId = state.fanOrder[action.position]
      const source = state.players[state.sourceIndex]
      const drawer = state.players[state.turnIndex]
      if (!drawnId || !source || !drawer) return state

      const card = source.hand.find((candidate) => candidate.id === drawnId)
      if (!card) return state

      const partner = findPartner(drawer.hand, card, state.rules.pairing)

      const players = state.players.map((player, index) => {
        if (index === state.sourceIndex) {
          return { ...player, hand: player.hand.filter((held) => held.id !== card.id) }
        }
        if (index !== state.turnIndex) return player
        if (!partner) return { ...player, hand: [...player.hand, card] }
        return {
          ...player,
          hand: player.hand.filter((held) => held.id !== partner.id),
          pairs: [...player.pairs, [partner, card]],
        }
      })

      return {
        ...state,
        phase: 'drawn',
        players,
        drawn: card,
        matched: partner ? [card, partner] : null,
        fanOrder: state.fanOrder.filter((id) => id !== card.id),
      }
    }

    case 'endTurn': {
      if (state.phase !== 'drawn') return state
      const { players, wentOut } = markExits(state.players)
      const next = neighbourIndex(players, state.turnIndex, 1)
      return settle(
        {
          ...state,
          players,
          wentOut,
          turnIndex: next === -1 ? state.turnIndex : next,
          turn: state.turn + 1,
        },
        rng,
      )
    }

    default:
      return state
  }
}
