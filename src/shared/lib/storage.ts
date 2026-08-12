const PREFIX = 'party-game:v1:'

function getStore(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    // Navigation privée sur certains navigateurs : l'accès lui-même jette.
    return null
  }
}

export function readStored<T>(key: string, fallback: T): T {
  const store = getStore()
  if (!store) return fallback
  try {
    const raw = store.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStored(key: string, value: unknown): void {
  const store = getStore()
  if (!store) return
  try {
    store.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Quota dépassé ou stockage désactivé : la partie continue en mémoire.
  }
}

export function removeStored(key: string): void {
  const store = getStore()
  if (!store) return
  try {
    store.removeItem(PREFIX + key)
  } catch {
    // idem
  }
}
