/**
 * Toute la logique de jeu prend un `Rng` en paramètre plutôt que d'appeler
 * `Math.random` directement : c'est ce qui rend les moteurs testables.
 */
export type Rng = () => number

export const defaultRng: Rng = Math.random

/** Générateur déterministe (mulberry32) — utilisé par les tests. */
export function createRng(seed: number): Rng {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Entier dans [0, maxExclusive[. */
export function randomInt(maxExclusive: number, rng: Rng = defaultRng): number {
  return Math.floor(rng() * maxExclusive)
}

/** Fisher-Yates, sans mutation de l'entrée. */
export function shuffle<T>(items: readonly T[], rng: Rng = defaultRng): T[] {
  const result = items.slice()
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1, rng)
    const a = result[i] as T
    const b = result[j] as T
    result[i] = b
    result[j] = a
  }
  return result
}

/** Un élément au hasard, ou `undefined` si la liste est vide. */
export function pick<T>(items: readonly T[], rng: Rng = defaultRng): T | undefined {
  if (items.length === 0) return undefined
  return items[randomInt(items.length, rng)]
}

/**
 * `count` éléments distincts tirés au hasard. Si la liste est plus courte que
 * `count`, renvoie toute la liste mélangée — jamais de doublon.
 */
export function sample<T>(items: readonly T[], count: number, rng: Rng = defaultRng): T[] {
  return shuffle(items, rng).slice(0, Math.max(0, count))
}
