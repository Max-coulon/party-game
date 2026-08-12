export type GuessMode = 'libre' | 'unMot' | 'mime' | 'tabou' | 'chante' | 'bruitage'

export interface ModeInfo {
  name: string
  rule: string
  /** Le mode n'accepte que les cartes qui portent des mots interdits. */
  needsTaboo: boolean
}

export const MODES: Record<GuessMode, ModeInfo> = {
  libre: {
    name: 'Description libre',
    rule: 'Autant de mots que tu veux, sauf le mot lui-même.',
    needsTaboo: false,
  },
  unMot: {
    name: 'Un seul mot',
    rule: 'Un seul mot d’indice. Un seul. Puis tu te tais.',
    needsTaboo: false,
  },
  mime: {
    name: 'Mime',
    rule: 'Pas un son. Le corps, et rien d’autre.',
    needsTaboo: false,
  },
  tabou: {
    name: 'Interdit',
    rule: 'Décris sans jamais prononcer les mots interdits.',
    needsTaboo: true,
  },
  chante: {
    name: 'Chante-le',
    rule: 'Chante ou fredonne pour faire deviner.',
    needsTaboo: false,
  },
  bruitage: {
    name: 'Bruitages',
    rule: 'Que des bruits. Aucun mot, aucun geste.',
    needsTaboo: false,
  },
}

export const ALL_MODES = Object.keys(MODES) as GuessMode[]

/** Les trois manches du Time’s Up classique, jouées sur le même paquet. */
export const TIMES_UP_MODES: GuessMode[] = ['libre', 'unMot', 'mime']
