import type { CardRole, Team } from './engine'

/**
 * Les deux camps ont chacun leur couleur, et c'est elle qui suit le joueur :
 * l'accent de l'app bascule à chaque changement de main, donc la nappe de
 * lumière du fond dit à qui est le tour avant même qu'on lise l'écran.
 */
export const TEAM_COLORS: Record<Team, string> = {
  rouge: '#ff4d6d',
  bleu: '#3a9bff',
}

export const ROLE_COLORS: Record<CardRole, string> = {
  rouge: TEAM_COLORS.rouge,
  bleu: TEAM_COLORS.bleu,
  neutre: '#a9a2c6',
  taupe: '#120d18',
}

export const ROLE_LABELS: Record<CardRole, string> = {
  rouge: 'agent rouge',
  bleu: 'agent bleu',
  neutre: 'passant',
  taupe: 'la taupe',
}

/** Texte lisible sur la face retournée. */
export const ROLE_INK: Record<CardRole, string> = {
  rouge: '#1a0209',
  bleu: '#04101f',
  neutre: '#161129',
  taupe: '#ff5470',
}
