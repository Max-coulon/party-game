import { describe, expect, it } from 'vitest'
import { createRng } from '@/shared/lib/random'
import {
  DEFAULT_RULES,
  alivePlayers,
  createGame,
  isSetupValid,
  maxImpostors,
  normalizeGuess,
  undercoverReducer,
  voteTargets,
  votingOrder,
} from './engine'
import type { UndercoverRules, UndercoverState } from './engine'
import { WORD_PAIRS, drawPair, pairsForThemes } from './words'

const PAIR = { id: 'test', civil: 'Cinéma', undercover: 'Théâtre', theme: 'culture' as const }

function newGame(
  names: string[],
  overrides: Partial<UndercoverRules> = {},
  seed = 42,
): UndercoverState {
  return createGame(names, PAIR, { ...DEFAULT_RULES, ...overrides }, createRng(seed))
}

/** Fait défiler la distribution des rôles jusqu'à la discussion. */
function skipReveal(state: UndercoverState): UndercoverState {
  let current = state
  while (current.phase === 'reveal') {
    current = undercoverReducer(current, { type: 'nextReveal' })
  }
  return current
}

/** Chaque joueur vivant vote pour `targetId`, sauf lui-même (il vote ailleurs). */
function everyoneVotes(
  state: UndercoverState,
  targetId: string,
  fallbackId: string,
  rng = createRng(7),
): UndercoverState {
  let current = state
  while (current.phase === 'vote') {
    const voter = votingOrder(current)[current.voterIndex]
    if (!voter) break
    const target = voter.id === targetId ? fallbackId : targetId
    current = undercoverReducer(
      current,
      { type: 'castVote', voterId: voter.id, targetId: target },
      rng,
    )
  }
  return current
}

describe('configuration', () => {
  it('impose des civils majoritaires au départ', () => {
    expect(maxImpostors(4)).toBe(1)
    expect(maxImpostors(5)).toBe(2)
    expect(maxImpostors(8)).toBe(3)
  })

  it('refuse une partie à moins de 4 joueurs ou sans imposteur', () => {
    expect(isSetupValid(3, DEFAULT_RULES)).toBe(false)
    expect(isSetupValid(4, { ...DEFAULT_RULES, undercoverCount: 0 })).toBe(false)
    expect(isSetupValid(4, { ...DEFAULT_RULES, undercoverCount: 2 })).toBe(false)
    expect(isSetupValid(4, DEFAULT_RULES)).toBe(true)
  })
})

describe('distribution des rôles', () => {
  const names = ['Léa', 'Tom', 'Ana', 'Rafi', 'Nour', 'Sam']

  it('donne exactement le nombre de rôles demandé', () => {
    const state = newGame(names, { undercoverCount: 2, mrWhiteCount: 1 })
    const roles = state.players.map((player) => player.role)
    expect(roles.filter((role) => role === 'undercover')).toHaveLength(2)
    expect(roles.filter((role) => role === 'mrwhite')).toHaveLength(1)
    expect(roles.filter((role) => role === 'civil')).toHaveLength(3)
  })

  it('donne le bon mot à chacun, et aucun à Mr White', () => {
    const state = newGame(names, { undercoverCount: 2, mrWhiteCount: 1 })
    for (const player of state.players) {
      if (player.role === 'civil') expect(player.word).toBe('Cinéma')
      if (player.role === 'undercover') expect(player.word).toBe('Théâtre')
      if (player.role === 'mrwhite') expect(player.word).toBeNull()
    }
  })

  it('conserve tous les joueurs sans doublon de nom ni d’identifiant', () => {
    const state = newGame(names)
    expect(state.players).toHaveLength(names.length)
    expect(new Set(state.players.map((p) => p.id)).size).toBe(names.length)
    expect([...state.players.map((p) => p.name)].sort()).toEqual([...names].sort())
  })

  it('garde l’ordre de la liste pour la distribution des mots', () => {
    for (let seed = 0; seed < 20; seed += 1) {
      const state = newGame(names, { undercoverCount: 1, mrWhiteCount: 1 }, seed)
      expect(state.players.map((player) => player.name)).toEqual(names)
    }
  })

  it('ne fait jamais parler Mr White en premier', () => {
    for (let seed = 0; seed < 40; seed += 1) {
      const state = newGame(names, { undercoverCount: 1, mrWhiteCount: 1 }, seed)
      const speaker = state.players.find((player) => player.id === state.firstSpeakerId)
      expect(speaker?.role).not.toBe('mrwhite')
    }
  })
})

describe('découverte des mots', () => {
  it('passe en discussion une fois le dernier joueur servi', () => {
    let state = newGame(['A', 'B', 'C', 'D'])
    expect(state.phase).toBe('reveal')
    for (let i = 0; i < 3; i += 1) {
      state = undercoverReducer(state, { type: 'nextReveal' })
      expect(state.phase).toBe('reveal')
    }
    state = undercoverReducer(state, { type: 'nextReveal' })
    expect(state.phase).toBe('discussion')
  })
})

describe('vote secret', () => {
  it('interdit de voter pour soi-même', () => {
    const state = skipReveal(newGame(['A', 'B', 'C', 'D']))
    const voting = undercoverReducer(state, { type: 'startVote' })
    const first = votingOrder(voting)[0]!
    expect(voteTargets(voting, first.id).map((p) => p.id)).not.toContain(first.id)

    const unchanged = undercoverReducer(voting, {
      type: 'castVote',
      voterId: first.id,
      targetId: first.id,
    })
    expect(unchanged.voterIndex).toBe(0)
    expect(unchanged.votes).toEqual({})
  })

  it('ignore un vote émis hors de son tour', () => {
    const voting = undercoverReducer(skipReveal(newGame(['A', 'B', 'C', 'D'])), {
      type: 'startVote',
    })
    const order = votingOrder(voting)
    const result = undercoverReducer(voting, {
      type: 'castVote',
      voterId: order[2]!.id,
      targetId: order[0]!.id,
    })
    expect(result).toBe(voting)
  })

  it('permet de revenir sur le vote précédent', () => {
    const voting = undercoverReducer(skipReveal(newGame(['A', 'B', 'C', 'D'])), {
      type: 'startVote',
    })
    const order = votingOrder(voting)
    const afterVote = undercoverReducer(voting, {
      type: 'castVote',
      voterId: order[0]!.id,
      targetId: order[1]!.id,
    })
    expect(afterVote.voterIndex).toBe(1)

    const undone = undercoverReducer(afterVote, { type: 'undoVote' })
    expect(undone.voterIndex).toBe(0)
    expect(undone.votes).toEqual({})
  })

  it('désigne le joueur le plus voté', () => {
    const voting = undercoverReducer(skipReveal(newGame(['A', 'B', 'C', 'D'])), {
      type: 'startVote',
    })
    const order = votingOrder(voting)
    const victim = order[0]!.id
    const resolved = everyoneVotes(voting, victim, order[1]!.id)
    expect(resolved.phase).toBe('voteResult')
    expect(resolved.pendingEliminationId).toBe(victim)
  })
})

describe('égalités', () => {
  it('élimine sans second tour quand un seul joueur est en tête', () => {
    const voting = undercoverReducer(skipReveal(newGame(['A', 'B', 'C', 'D'])), {
      type: 'startVote',
    })
    const order = votingOrder(voting)
    const [p0, p1, p2, p3] = order as [
      (typeof order)[number],
      (typeof order)[number],
      (typeof order)[number],
      (typeof order)[number],
    ]
    let state = voting
    state = undercoverReducer(state, { type: 'castVote', voterId: p0.id, targetId: p2.id })
    state = undercoverReducer(state, { type: 'castVote', voterId: p1.id, targetId: p2.id })
    state = undercoverReducer(state, { type: 'castVote', voterId: p2.id, targetId: p3.id })
    state = undercoverReducer(state, { type: 'castVote', voterId: p3.id, targetId: p1.id })
    // p2 : 2 voix, p3 : 1, p1 : 1 → pas d'égalité en tête
    expect(state.phase).toBe('voteResult')
    expect(state.pendingEliminationId).toBe(p2.id)
  })

  it('relance un vote restreint aux ex æquo, puis tranche au sort', () => {
    // Deux joueurs, deux voix chacun : égalité stricte.
    let state = undercoverReducer(
      skipReveal(newGame(['A', 'B', 'C', 'D'], { tieBreak: 'revote' })),
      { type: 'startVote' },
    )
    const order = votingOrder(state)
    const [p0, p1, p2, p3] = order as [
      (typeof order)[number],
      (typeof order)[number],
      (typeof order)[number],
      (typeof order)[number],
    ]
    state = undercoverReducer(state, { type: 'castVote', voterId: p0.id, targetId: p2.id })
    state = undercoverReducer(state, { type: 'castVote', voterId: p1.id, targetId: p2.id })
    state = undercoverReducer(state, { type: 'castVote', voterId: p2.id, targetId: p0.id })
    state = undercoverReducer(state, { type: 'castVote', voterId: p3.id, targetId: p0.id })

    // 2 voix contre p0 et p2 → second tour restreint à ces deux-là.
    expect(state.phase).toBe('vote')
    expect(state.isRevote).toBe(true)
    expect(state.candidateIds?.sort()).toEqual([p0.id, p2.id].sort())

    // Même égalité au second tour : le sort tranche, on ne repart pas en vote.
    state = undercoverReducer(state, { type: 'castVote', voterId: p0.id, targetId: p2.id })
    state = undercoverReducer(state, { type: 'castVote', voterId: p1.id, targetId: p2.id })
    state = undercoverReducer(state, { type: 'castVote', voterId: p2.id, targetId: p0.id })
    state = undercoverReducer(state, { type: 'castVote', voterId: p3.id, targetId: p0.id })

    expect(state.phase).toBe('voteResult')
    expect([p0.id, p2.id]).toContain(state.pendingEliminationId)
  })

  it('respecte la règle « au hasard » sans second tour', () => {
    const state = undercoverReducer(
      skipReveal(newGame(['A', 'B', 'C', 'D'], { tieBreak: 'random' })),
      { type: 'startVote' },
    )
    const order = votingOrder(state)
    const [p0, p1, p2, p3] = order as [
      (typeof order)[number],
      (typeof order)[number],
      (typeof order)[number],
      (typeof order)[number],
    ]
    let current = state
    current = undercoverReducer(current, { type: 'castVote', voterId: p0.id, targetId: p2.id })
    current = undercoverReducer(current, { type: 'castVote', voterId: p1.id, targetId: p2.id })
    current = undercoverReducer(current, { type: 'castVote', voterId: p2.id, targetId: p0.id })
    current = undercoverReducer(current, { type: 'castVote', voterId: p3.id, targetId: p0.id })

    expect(current.phase).toBe('voteResult')
    expect(current.isRevote).toBe(false)
  })
})

describe('vote de groupe', () => {
  it('élimine directement le joueur désigné à voix haute', () => {
    const state = undercoverReducer(
      skipReveal(newGame(['A', 'B', 'C', 'D'], { voteMode: 'group' })),
      { type: 'startVote' },
    )
    const target = alivePlayers(state)[1]!
    const result = undercoverReducer(state, { type: 'groupVote', targetId: target.id })
    expect(result.phase).toBe('voteResult')
    expect(result.pendingEliminationId).toBe(target.id)
  })

  it('refuse de désigner un joueur déjà éliminé', () => {
    let state = undercoverReducer(
      skipReveal(newGame(['A', 'B', 'C', 'D'], { voteMode: 'group' })),
      { type: 'startVote' },
    )
    const victim = alivePlayers(state)[0]!
    state = undercoverReducer(state, { type: 'groupVote', targetId: victim.id })
    state = undercoverReducer(state, { type: 'confirmElimination' })
    if (state.phase === 'mrWhiteGuess') return
    state = undercoverReducer(state, { type: 'startVote' })
    const unchanged = undercoverReducer(state, { type: 'groupVote', targetId: victim.id })
    expect(unchanged).toBe(state)
  })
})

describe('fin de partie', () => {
  function eliminate(state: UndercoverState, playerId: string): UndercoverState {
    const voting =
      state.phase === 'vote' ? state : undercoverReducer(state, { type: 'startVote' })
    const designated = undercoverReducer(voting, { type: 'groupVote', targetId: playerId })
    return undercoverReducer(designated, { type: 'confirmElimination' })
  }

  it('donne la victoire aux civils quand le dernier imposteur tombe', () => {
    const state = skipReveal(
      newGame(['A', 'B', 'C', 'D', 'E'], { voteMode: 'group', undercoverCount: 1 }),
    )
    const undercover = state.players.find((player) => player.role === 'undercover')!
    const result = eliminate(state, undercover.id)
    expect(result.phase).toBe('end')
    expect(result.winner).toBe('civils')
  })

  it('donne la victoire aux imposteurs dès qu’ils égalent les civils', () => {
    let state = skipReveal(
      newGame(['A', 'B', 'C', 'D', 'E'], { voteMode: 'group', undercoverCount: 2 }),
    )
    const civils = state.players.filter((player) => player.role === 'civil')
    // 3 civils / 2 undercover : un civil éliminé suffit à faire 2-2.
    state = eliminate(state, civils[0]!.id)
    expect(state.phase).toBe('end')
    expect(state.winner).toBe('imposteurs')
  })

  it('enregistre chaque élimination dans l’historique', () => {
    const state = skipReveal(
      newGame(['A', 'B', 'C', 'D', 'E'], { voteMode: 'group', undercoverCount: 1 }),
    )
    const civil = state.players.find((player) => player.role === 'civil')!
    const result = eliminate(state, civil.id)
    expect(result.history).toHaveLength(1)
    expect(result.history[0]).toMatchObject({
      round: 1,
      playerId: civil.id,
      playerName: civil.name,
      role: 'civil',
    })
  })
})

describe('Mr White', () => {
  function gameWithMrWhite() {
    let state = skipReveal(
      newGame(['A', 'B', 'C', 'D', 'E', 'F'], {
        voteMode: 'group',
        undercoverCount: 1,
        mrWhiteCount: 1,
      }),
    )
    const mrWhite = state.players.find((player) => player.role === 'mrwhite')!
    state = undercoverReducer(state, { type: 'startVote' })
    state = undercoverReducer(state, { type: 'groupVote', targetId: mrWhite.id })
    state = undercoverReducer(state, { type: 'confirmElimination' })
    return { state, mrWhite }
  }

  it('lui laisse deviner le mot des civils quand il est éliminé', () => {
    const { state, mrWhite } = gameWithMrWhite()
    expect(state.phase).toBe('mrWhiteGuess')
    expect(state.mrWhiteGuessingId).toBe(mrWhite.id)
  })

  it('lui donne la victoire immédiate s’il trouve le mot', () => {
    const { state } = gameWithMrWhite()
    const result = undercoverReducer(state, { type: 'submitMrWhiteGuess', guess: '  cinema ' })
    expect(result.phase).toBe('end')
    expect(result.winner).toBe('mrwhite')
  })

  it('poursuit la partie s’il se trompe', () => {
    const { state } = gameWithMrWhite()
    const missed = undercoverReducer(state, { type: 'submitMrWhiteGuess', guess: 'Piscine' })
    expect(missed.mrWhiteGuessCorrect).toBe(false)
    expect(missed.phase).toBe('mrWhiteGuess')

    const next = undercoverReducer(missed, { type: 'continueAfterGuess' })
    expect(next.phase).toBe('discussion')
    expect(next.round).toBe(2)
    expect(next.votes).toEqual({})
  })

  it('compare les mots sans tenir compte des accents ni de la casse', () => {
    expect(normalizeGuess('Café ')).toBe(normalizeGuess('cafe'))
    expect(normalizeGuess("Jus d'orange")).toBe(normalizeGuess('jusdorange'))
    expect(normalizeGuess('Théâtre')).not.toBe(normalizeGuess('Cinéma'))
  })
})

describe('liste de mots', () => {
  it('ne contient aucun identifiant en double', () => {
    const ids = WORD_PAIRS.map((pair) => pair.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('ne contient aucune paire dont les deux mots sont identiques', () => {
    for (const pair of WORD_PAIRS) {
      expect(normalizeGuess(pair.civil)).not.toBe(normalizeGuess(pair.undercover))
    }
  })

  it('propose assez de paires pour une longue soirée', () => {
    expect(WORD_PAIRS.length).toBeGreaterThanOrEqual(440)
  })

  it('ne propose jamais deux fois la même paire', () => {
    const seen = new Map<string, string>()
    for (const pair of WORD_PAIRS) {
      const key = [normalizeGuess(pair.civil), normalizeGuess(pair.undercover)].sort().join('|')
      expect(seen.has(key)).toBe(false)
      seen.set(key, pair.id)
    }
  })

  it("n'emploie jamais le même mot dans deux paires différentes", () => {
    // Un mot partagé par deux paires peut sortir deux fois dans la soirée, une
    // fois côté civil et une fois côté undercover — les joueurs le
    // reconnaissent et la partie perd tout son intérêt.
    const owner = new Map<string, string>()
    for (const pair of WORD_PAIRS) {
      for (const word of [pair.civil, pair.undercover]) {
        const key = normalizeGuess(word)
        expect(owner.get(key) ?? pair.id).toBe(pair.id)
        owner.set(key, pair.id)
      }
    }
  })

  it('écarte les mots que le joueur risque de lire de travers', () => {
    // Le mot est affiché seul, sans son thème. Ceux-ci se lisent d'abord comme
    // un verbe ou comme un tout autre objet : deux civils les comprendraient
    // différemment et décriraient deux choses.
    const ambigus = [
      'applique',
      'souris',
      'coffre',
      'essence',
      'bleu',
      'mousse',
      'toast',
      'broche',
      'voile',
      'basket',
      'batterie',
      'flute',
      'manchot',
      'judas',
      'varan',
      'blaireau',
    ]
    const employes = new Set(
      WORD_PAIRS.flatMap((pair) => [normalizeGuess(pair.civil), normalizeGuess(pair.undercover)]),
    )
    for (const mot of ambigus) expect(employes.has(mot)).toBe(false)
  })

  it('filtre par thème', () => {
    const sport = pairsForThemes(['sport'])
    expect(sport.length).toBeGreaterThan(15)
    expect(sport.every((pair) => pair.theme === 'sport')).toBe(true)
    expect(pairsForThemes([]).length).toBe(WORD_PAIRS.length)
  })

  it('ne retire jamais deux fois la même paire tant qu’il en reste', () => {
    const pool = pairsForThemes(['sport'])
    const used: string[] = []
    const rng = createRng(3)
    for (let i = 0; i < pool.length; i += 1) {
      const pair = drawPair(pool, used, rng)
      expect(pair).not.toBeNull()
      expect(used).not.toContain(pair!.id)
      used.push(pair!.id)
    }
    // Épuisé : on recommence plutôt que de renvoyer null.
    expect(drawPair(pool, used, rng)).not.toBeNull()
  })

  it('tire parfois la paire dans un sens, parfois dans l’autre', () => {
    const pool = [{ id: 'x', civil: 'Un', undercover: 'Deux', theme: 'sport' as const }]
    const rng = createRng(11)
    const seen = new Set<string>()
    for (let i = 0; i < 30; i += 1) seen.add(drawPair(pool, [], rng)!.civil)
    expect(seen).toEqual(new Set(['Un', 'Deux']))
  })
})
