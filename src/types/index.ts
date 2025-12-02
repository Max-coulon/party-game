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
 * Thèmes de questions
 */
export type NheTheme = "soirees" | "amour" | "vacances" | "travail" | "general";

/**
 * Interface pour une question du jeu "Je n'ai jamais"
 */
export interface NheQuestion {
  id: string;
  text: string;
  mode: NheMode;
  sips: number; // Nombre de gorgées à boire
  points: number; // Points attribués pour le scoring
  theme?: NheTheme; // Thème optionnel
  isCustom?: boolean; // Question ajoutée par les joueurs
  challenge?: string; // Défi optionnel associé à la question
}

/**
 * Règles spéciales activables
 */
export interface NheSpecialRules {
  doubleShot: boolean; // Si tous sauf un boivent, le survivant boit 2 fois
  muteRule: boolean; // Refuser de répondre = 2 gorgées automatiques
}

/**
 * Entrée dans l'historique de la partie
 */
export interface NheHistoryEntry {
  questionId: string;
  questionText: string;
  playerIds: string[]; // Joueurs qui ont bu
  sipsPerPlayer: number;
  timestamp: number;
  specialRuleTriggered?: string; // Nom de la règle spéciale déclenchée
}

/**
 * Configuration de la partie
 */
export interface NheGameConfig {
  selectedModes: NheMode[];
  selectedThemes: NheTheme[];
  questionCount: number;
  specialRules: NheSpecialRules;
}

/**
 * État du jeu "Je n'ai jamais"
 */
export interface NheGameState {
  config: NheGameConfig;
  currentQuestionIndex: number;
  questions: NheQuestion[];
  usedQuestionIds: Set<string>; // Questions déjà posées
  players: Player[];
  isGameStarted: boolean;
  isGameFinished: boolean;
  history: NheHistoryEntry[];
  currentChallenge?: string; // Défi en cours pour la question actuelle
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
  muted?: boolean; // true si le joueur refuse de répondre (règle Mute)
}

/**
 * Statistiques locales du jeu
 */
export interface GameStats {
  totalGamesPlayed: number;
  playerWins: Record<string, number>; // playerId -> nombre de victoires
  modePlayCount: Record<NheMode, number>; // Nombre de parties par mode
  lastPlayed?: number; // Timestamp de la dernière partie
}
