import { describe, expect, it } from 'vitest'
import { createRng } from '@/shared/lib/random'
import { FINGER_COLORS, colorFor, pickWinner, splitIntoTeams, teamOf } from './engine'

describe('désignation', () => {
  it('ne désigne personne quand aucun doigt n’est posé', () => {
    expect(pickWinner([], createRng(1))).toBeNull()
  })

  it('désigne toujours un doigt présent', () => {
    const ids = [3, 7, 11]
    for (let seed = 0; seed < 50; seed += 1) {
      expect(ids).toContain(pickWinner(ids, createRng(seed)))
    }
  })

  it('ne favorise pas systématiquement le même doigt', () => {
    const rng = createRng(2)
    const seen = new Set<number>()
    for (let i = 0; i < 60; i += 1) seen.add(pickWinner([1, 2, 3], rng)!)
    expect(seen.size).toBe(3)
  })
})

describe('formation des équipes', () => {
  it('répartit tous les doigts, une seule fois chacun', () => {
    const ids = [1, 2, 3, 4, 5, 6, 7]
    const teams = splitIntoTeams(ids, 3, createRng(8))
    expect(teams.flat().sort((a, b) => a - b)).toEqual(ids)
  })

  it('équilibre les effectifs à un près', () => {
    const teams = splitIntoTeams([1, 2, 3, 4, 5, 6, 7], 3, createRng(8))
    const sizes = teams.map((team) => team.length).sort()
    expect(sizes[sizes.length - 1]! - sizes[0]!).toBeLessThanOrEqual(1)
  })

  it('ne crée jamais plus d’équipes que de doigts posés', () => {
    const teams = splitIntoTeams([1, 2], 5, createRng(3))
    expect(teams).toHaveLength(2)
    expect(teams.every((team) => team.length > 0)).toBe(true)
  })

  it('accepte une seule équipe', () => {
    expect(splitIntoTeams([1, 2, 3], 1, createRng(3))).toEqual([expect.arrayContaining([1, 2, 3])])
  })

  it('associe chaque doigt à son équipe', () => {
    const teams = [
      [10, 20],
      [30, 40],
    ]
    const map = teamOf(teams)
    expect(map.get(10)).toBe(0)
    expect(map.get(40)).toBe(1)
    expect(map.get(99)).toBeUndefined()
  })
})

describe('couleurs', () => {
  it('boucle sur la palette au-delà du nombre de couleurs', () => {
    expect(colorFor(0)).toBe(FINGER_COLORS[0])
    expect(colorFor(FINGER_COLORS.length)).toBe(FINGER_COLORS[0])
  })
})
