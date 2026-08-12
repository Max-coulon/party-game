/** `95` → `1:35`. Toujours au moins `0:00`. */
export function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.ceil(seconds))
  const minutes = Math.floor(safe / 60)
  const rest = safe % 60
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}

/** `90` → `1 min 30`, `120` → `2 min`. Pour les libellés de réglages. */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  if (minutes === 0) return `${rest} s`
  return rest === 0 ? `${minutes} min` : `${minutes} min ${rest}`
}

/** Pluriel simple : `plural(2, 'gorgée')` → `2 gorgées`. */
export function plural(count: number, singular: string, pluralForm?: string): string {
  const word = count > 1 ? (pluralForm ?? `${singular}s`) : singular
  return `${count} ${word}`
}

/** `['Léa', 'Tom', 'Ana']` → `Léa, Tom et Ana`. */
export function joinNames(names: readonly string[]): string {
  if (names.length === 0) return ''
  if (names.length === 1) return names[0] as string
  return `${names.slice(0, -1).join(', ')} et ${names[names.length - 1]}`
}
