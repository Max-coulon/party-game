let counter = 0

/** Identifiant unique pour la durée de la session. */
export function uid(prefix = 'id'): string {
  counter += 1
  return `${prefix}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
