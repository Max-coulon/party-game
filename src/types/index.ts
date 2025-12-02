/**
 * Type représentant un joueur
 */
export interface Player {
  id: string;
  name: string;
  score: number; // Nombre total de gorgées/points
  avatar: string; // Emoji avatar aléatoire
}

/**
 * Mode de jeu pour "Je n'ai jamais"
 */
export type NheMode = "soft" | "hot" | "hardcore";

/**
 * Interface pour une question du jeu "Je n'ai jamais"
 */
export interface NheQuestion {
  id: string;
  text: string;
  mode: NheMode;
  sips: number; // Nombre de gorgées à boire
  points: number; // Points attribués pour le scoring
}

/**
 * État du jeu "Je n'ai jamais"
 */
export interface NheGameState {
  selectedModes: NheMode[];
  currentQuestionIndex: number;
  questions: NheQuestion[];
  players: Player[];
  isGameStarted: boolean;
  isGameFinished: boolean;
}

/**
 * Type représentant un jeu disponible
 */
export interface Game {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  icon: string; // Emoji ou nom d'icône
}

/**
 * Réponse d'un joueur à une question
 */
export interface PlayerAnswer {
  playerId: string;
  hasDoIt: boolean; // true si le joueur "a déjà fait" l'action
}
