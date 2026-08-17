import { describe, expect, it } from 'vitest'
import { createRng } from '@/shared/lib/random'
import {
  DEFAULT_RULES,
  DEAL_SIPS,
  HAND_SIZE,
  cardsNeeded,
  createGame,
  currentDealPlayer,
  dealKind,
  hasRank,
  isGuessCorrect,
  isSetupValid,
  playerById,
  pyramidCount,
  pyramidReducer,
  ranking,
} from './engine'
import type { PyramidPlayer, PyramidRules, PyramidSlot, PyramidState } from './engine'
import { cardId } from './cards'
import type { Card, Rank, Suit } from './cards'

const NAMES = ['Léa', 'Tom', 'Ana']

const card = (rank: Rank, suit: Suit): Card => ({
  id: cardId(rank, suit),
  rank,
  suit,
})

function rules(overrides: Partial<PyramidRules> = {}): PyramidRules {
  return { ...DEFAULT_RULES, ...overrides }
}

function player(index: number, hand: Card[], extras: Partial<PyramidPlayer> = {}): PyramidPlayer {
  return {
    id: `p${index}`,
    name: NAMES[index] ?? `J${index}`,
    hand,
    given: 0,
    received: 0,
    ...extras,
  }
}

function slot(held: Card, row: number, revealed = true): PyramidSlot {
  return { card: held, row, revealed }
}

function playState(overrides: Partial<PyramidState> = {}): PyramidState {
  return {
    phase: 'play',
    rules: DEFAULT_RULES,
    players: [
      player(0, [card('A', 'pique'), card('7', 'trefle')]),
      player(1, [card('R', 'coeur')]),
      player(2, [card('9', 'carreau')]),
    ],
    slots: [slot(card('A', 'coeur'), 1), slot(card('D', 'pique'), 2, false)],
    drawPile: [],
    cursor: 0,
    dealIndex: 3,
    dealCardIndex: HAND_SIZE,
    dealStep: 'guess',
    pendingCard: null,
    pendingGuess: null,
    pendingCorrect: null,
    giverId: null,
    targetId: null,
    lastGift: null,
    history: [],
    ...overrides,
  }
}

describe('la configuration', () => {
  it('compte quatre cartes par joueur plus le triangle', () => {
    expect(cardsNeeded(4, DEFAULT_RULES)).toBe(4 * 4 + 15)
    expect(pyramidCount(5)).toBe(15)
  })

  it('refuse ce qui ne tient pas dans le paquet', () => {
    expect(isSetupValid(1, DEFAULT_RULES)).toBe(false)
    expect(isSetupValid(2, DEFAULT_RULES)).toBe(true)
    expect(isSetupValid(9, DEFAULT_RULES)).toBe(true)
    expect(isSetupValid(10, DEFAULT_RULES)).toBe(false)
    expect(isSetupValid(5, rules({ rows: 7, deckSize: 32 }))).toBe(false)
    expect(isSetupValid(2, rules({ rows: 4, deckSize: 32 }))).toBe(true)
  })
})

describe('les paris de la donne', () => {
  it('suit l’ordre couleur, plus ou moins, inter ou exter, signe', () => {
    expect(dealKind(0)).toBe('couleur')
    expect(dealKind(1)).toBe('plusMoins')
    expect(dealKind(2)).toBe('interExter')
    expect(dealKind(3)).toBe('signe')
  })

  it('reconnaît la couleur', () => {
    expect(isGuessCorrect({ kind: 'couleur', value: 'rouge' }, card('7', 'coeur'), [])).toBe(true)
    expect(isGuessCorrect({ kind: 'couleur', value: 'noir' }, card('7', 'coeur'), [])).toBe(false)
    expect(isGuessCorrect({ kind: 'couleur', value: 'noir' }, card('A', 'pique'), [])).toBe(true)
  })

  it('compare à la carte précédente, et l’égalité est perdue', () => {
    const seven = [card('7', 'pique')]
    expect(isGuessCorrect({ kind: 'plusMoins', value: 'plus' }, card('R', 'coeur'), seven)).toBe(true)
    expect(isGuessCorrect({ kind: 'plusMoins', value: 'moins' }, card('3', 'trefle'), seven)).toBe(
      true,
    )
    expect(isGuessCorrect({ kind: 'plusMoins', value: 'plus' }, card('7', 'coeur'), seven)).toBe(
      false,
    )
    expect(isGuessCorrect({ kind: 'plusMoins', value: 'moins' }, card('7', 'coeur'), seven)).toBe(
      false,
    )
  })

  it('place inter et exter entre les deux premières cartes', () => {
    const bounds = [card('5', 'pique'), card('D', 'coeur')]
    expect(isGuessCorrect({ kind: 'interExter', value: 'inter' }, card('9', 'trefle'), bounds)).toBe(
      true,
    )
    expect(isGuessCorrect({ kind: 'interExter', value: 'exter' }, card('A', 'pique'), bounds)).toBe(
      true,
    )
    expect(isGuessCorrect({ kind: 'interExter', value: 'inter' }, card('5', 'coeur'), bounds)).toBe(
      false,
    )
    expect(isGuessCorrect({ kind: 'interExter', value: 'exter' }, card('D', 'pique'), bounds)).toBe(
      false,
    )
  })

  it('n’a pas d’intérieur quand les deux bornes sont égales', () => {
    const twins = [card('8', 'pique'), card('8', 'coeur')]
    expect(isGuessCorrect({ kind: 'interExter', value: 'inter' }, card('9', 'trefle'), twins)).toBe(
      false,
    )
    expect(isGuessCorrect({ kind: 'interExter', value: 'exter' }, card('9', 'trefle'), twins)).toBe(
      true,
    )
  })

  it('vérifie le signe', () => {
    expect(isGuessCorrect({ kind: 'signe', value: 'coeur' }, card('A', 'coeur'), [])).toBe(true)
    expect(isGuessCorrect({ kind: 'signe', value: 'pique' }, card('A', 'coeur'), [])).toBe(false)
  })
})

describe('la distribution', () => {
  it('réserve le triangle et laisse quatre cartes à piocher par joueur', () => {
    const state = createGame(NAMES, DEFAULT_RULES, createRng(7))
    expect(state.phase).toBe('deal')
    expect(state.slots).toHaveLength(15)
    expect(state.slots.every((item) => !item.revealed)).toBe(true)
    expect(state.drawPile).toHaveLength(52 - 15)
    expect(state.players).toHaveLength(3)
    expect(state.players.every((item) => item.hand.length === 0)).toBe(true)
  })

  it('fait boire celui qui se trompe et passe à la carte suivante', () => {
    let state = createGame(NAMES, DEFAULT_RULES, createRng(3))
    const drawn = state.drawPile[0]!
    const wrong = drawn.suit === 'coeur' || drawn.suit === 'carreau' ? 'noir' : 'rouge'
    state = pyramidReducer(state, { type: 'guess', guess: { kind: 'couleur', value: wrong } })
    expect(state.dealStep).toBe('reveal')
    expect(state.pendingCorrect).toBe(false)
    expect(state.pendingCard?.id).toBe(drawn.id)

    state = pyramidReducer(state, { type: 'ackReveal' })
    expect(state.dealCardIndex).toBe(1)
    expect(state.dealStep).toBe('guess')
    expect(currentDealPlayer(state)?.hand).toHaveLength(1)
    expect(currentDealPlayer(state)?.received).toBe(DEAL_SIPS)
    expect(state.history[0]?.outcome).toBe('dealMiss')
  })

  it('fait désigner après un bon pari', () => {
    let state = createGame(NAMES, DEFAULT_RULES, createRng(3))
    const drawn = state.drawPile[0]!
    const right = drawn.suit === 'coeur' || drawn.suit === 'carreau' ? 'rouge' : 'noir'
    state = pyramidReducer(state, { type: 'guess', guess: { kind: 'couleur', value: right } })
    expect(state.pendingCorrect).toBe(true)
    state = pyramidReducer(state, { type: 'ackReveal' })
    expect(state.dealStep).toBe('give')
    expect(pyramidReducer(state, { type: 'dealGive', targetId: 'p0' }).dealStep).toBe('give')

    state = pyramidReducer(state, { type: 'dealGive', targetId: 'p1' })
    expect(state.dealCardIndex).toBe(1)
    expect(playerById(state, 'p0')?.hand).toHaveLength(1)
    expect(playerById(state, 'p0')?.given).toBe(DEAL_SIPS)
    expect(playerById(state, 'p1')?.received).toBe(DEAL_SIPS)
    expect(state.history[0]?.outcome).toBe('dealHit')
  })

  it('enchaîne les quatre cartes puis le joueur suivant, puis la table', () => {
    let state = createGame(['Léa', 'Tom'], rules({ rows: 4 }), createRng(11))
    for (let guard = 0; guard < 80 && state.phase === 'deal'; guard += 1) {
      if (state.dealStep === 'guess') {
        const kind = dealKind(state.dealCardIndex)
        const guess =
          kind === 'couleur'
            ? ({ kind, value: 'rouge' } as const)
            : kind === 'plusMoins'
              ? ({ kind, value: 'plus' } as const)
              : kind === 'interExter'
                ? ({ kind, value: 'inter' } as const)
                : ({ kind, value: 'pique' } as const)
        state = pyramidReducer(state, { type: 'guess', guess })
      } else if (state.dealStep === 'reveal') {
        state = pyramidReducer(state, { type: 'ackReveal' })
      } else {
        const other = state.players.find((item) => item.id !== currentDealPlayer(state)?.id)
        state = pyramidReducer(state, { type: 'dealGive', targetId: other?.id ?? 'p1' })
      }
    }
    expect(state.phase).toBe('play')
    expect(state.players.every((item) => item.hand.length === HAND_SIZE)).toBe(true)
    expect(state.slots.every((item) => !item.revealed)).toBe(true)
  })
})

describe('la pyramide', () => {
  it('laisse bluffer : on désigne même sans la valeur', () => {
    const state = playState()
    expect(hasRank(state.players[1]!, 'A')).toBe(false)
    const claimed = pyramidReducer(state, { type: 'claim', playerId: 'p1' })
    expect(claimed.phase).toBe('give')
    expect(claimed.giverId).toBe('p1')
  })

  it('boit la mise du rang si on accepte', () => {
    const claimed = pyramidReducer(playState(), { type: 'claim', playerId: 'p0' })
    const aimed = pyramidReducer(claimed, { type: 'give', targetId: 'p1' })
    expect(aimed.phase).toBe('challenge')
    const accepted = pyramidReducer(aimed, { type: 'accept' })
    expect(accepted.phase).toBe('play')
    expect(accepted.lastGift?.outcome).toBe('accepted')
    expect(accepted.lastGift?.sips).toBe(1)
    expect(playerById(accepted, 'p1')?.received).toBe(1)
    expect(playerById(accepted, 'p0')?.hand.map((held) => held.id)).toEqual(['7-trefle'])
  })

  it('laisse le bluff passer si on n’accuse pas', () => {
    const claimed = pyramidReducer(playState(), { type: 'claim', playerId: 'p1' })
    const accepted = pyramidReducer(
      pyramidReducer(claimed, { type: 'give', targetId: 'p0' }),
      { type: 'accept' },
    )
    expect(playerById(accepted, 'p1')?.hand).toHaveLength(1)
    expect(playerById(accepted, 'p0')?.received).toBe(1)
    expect(accepted.lastGift?.card).toBeNull()
  })

  it('double la mise de l’accusé s’il avait la carte', () => {
    const challenged = pyramidReducer(
      pyramidReducer(pyramidReducer(playState(), { type: 'claim', playerId: 'p0' }), {
        type: 'give',
        targetId: 'p1',
      }),
      { type: 'callLiar' },
    )
    expect(challenged.lastGift?.outcome).toBe('shown')
    expect(challenged.lastGift?.sips).toBe(2)
    expect(challenged.lastGift?.card?.id).toBe('A-pique')
    expect(playerById(challenged, 'p1')?.received).toBe(2)
    expect(playerById(challenged, 'p0')?.hand.map((held) => held.id)).toEqual(['7-trefle'])
  })

  it('double la mise du menteur s’il n’avait rien', () => {
    const challenged = pyramidReducer(
      pyramidReducer(pyramidReducer(playState(), { type: 'claim', playerId: 'p1' }), {
        type: 'give',
        targetId: 'p0',
      }),
      { type: 'callLiar' },
    )
    expect(challenged.lastGift?.outcome).toBe('lied')
    expect(challenged.lastGift?.sips).toBe(2)
    expect(playerById(challenged, 'p1')?.received).toBe(2)
    expect(playerById(challenged, 'p1')?.hand).toHaveLength(1)
    expect(playerById(challenged, 'p0')?.received).toBe(0)
  })

  it('prend le rang pour la mise, pas un forfait fixe', () => {
    const state = playState({
      slots: [slot(card('R', 'pique'), 4)],
      players: [player(0, [card('R', 'coeur')]), player(1, [])],
    })
    const challenged = pyramidReducer(
      pyramidReducer(pyramidReducer(state, { type: 'claim', playerId: 'p0' }), {
        type: 'give',
        targetId: 'p1',
      }),
      { type: 'callLiar' },
    )
    expect(challenged.lastGift?.sips).toBe(8)
  })

  it('ignore un retournement pendant le défi', () => {
    const state = playState({ phase: 'challenge', giverId: 'p0', targetId: 'p1' })
    expect(pyramidReducer(state, { type: 'flip' })).toBe(state)
  })

  it('termine quand plus rien n’est caché', () => {
    const state = playState({
      slots: [slot(card('D', 'coeur'), 2)],
    })
    const ended = pyramidReducer(state, { type: 'flip' })
    expect(ended.phase).toBe('end')
  })

  it('classe par gorgées reçues', () => {
    const state = playState({
      phase: 'end',
      players: [
        player(0, [], { received: 6, given: 1 }),
        player(1, [], { received: 6, given: 4 }),
        player(2, [], { received: 2, given: 9 }),
      ],
    })
    const rows = ranking(state)
    expect(rows.map((row) => row.rank)).toEqual([1, 1, 3])
  })
})
