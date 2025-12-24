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

// ============================================
// Types pour le jeu "Action ou Vérité"
// ============================================

/**
 * Type d'élément : Action ou Vérité
 */
export type TruthOrDareType = "truth" | "dare";

/**
 * Niveau de difficulté / intensité
 */
export type TodLevel = "soft" | "hot" | "hardcore" | "fun" | "deep" | "sexual";

/**
 * Interface pour une action ou vérité
 */
export interface TodItem {
  id: string;
  type: TruthOrDareType;
  level: TodLevel;
  text: string;
  isCustom?: boolean; // Ajouté par les joueurs pour cette partie
}

/**
 * Mode de sélection des joueurs
 */
export type TodSelectionMode = "round-robin" | "random";

/**
 * Type de pénalité en cas de refus
 */
export type TodPenaltyType = "none" | "drink" | "points" | "both";

/**
 * Configuration de la partie Action ou Vérité
 */
export interface TodGameConfig {
  players: Player[];
  enabledLevels: TodLevel[];
  selectionMode: TodSelectionMode;
  maxRounds?: number; // undefined = illimité
  penaltyType: TodPenaltyType;
  penaltyDrinkValue?: number; // Nombre de gorgées si penalty = drink ou both
  penaltyPointsValue?: number; // Points de pénalité si penalty = points ou both
}

/**
 * Résolution d'une carte (action ou vérité)
 */
export interface TodCardResolution {
  completed: boolean; // true = fait/répondu, false = refusé
}

/**
 * Entrée dans l'historique d'un tour
 */
export interface TodHistoryEntry {
  roundNumber: number;
  playerId: string;
  playerName: string;
  choice: TruthOrDareType; // 'truth' ou 'dare'
  card: TodItem;
  completed: boolean;
  penaltyApplied?: {
    type: TodPenaltyType;
    drinkValue?: number;
    pointsValue?: number;
  };
  timestamp: number;
}

/**
 * Statistiques par joueur pour Action ou Vérité
 */
export interface TodPlayerStats {
  playerId: string;
  playerName: string;
  daresCompleted: number;
  daresRefused: number;
  truthsAnswered: number;
  truthsRefused: number;
  totalPenalties: number;
  score: number; // Score négatif si pénalités points
}

/**
 * État complet du jeu Action ou Vérité
 */
export interface TodGameState {
  config: TodGameConfig;
  currentRound: number;
  currentPlayerIndex: number;
  currentCard: TodItem | null;
  currentChoice: TruthOrDareType | null;
  isGameStarted: boolean;
  isGameFinished: boolean;
  players: Player[];
  history: TodHistoryEntry[];
  playerStats: TodPlayerStats[];
}

// ============================================
// Types pour le jeu "Finger Chooser" (Chwazi)
// ============================================

/**
 * Représente un doigt/pointeur actif sur l'écran
 */
export interface FingerToken {
  pointerId: number;
  x: number;
  y: number;
  color: string;
  startedAt: number;
}

/**
 * État du jeu Finger Chooser
 */
export type FingerChooserStatus = "waiting" | "countdown" | "chosen";

/**
 * État complet du jeu Finger Chooser
 */
export interface FingerChooserState {
  status: FingerChooserStatus;
  activeFingers: Map<number, FingerToken>;
  timeLeft: number; // Secondes restantes (5 → 0)
  winnerPointerId: number | null;
}

// ============================================
// Types pour le jeu "Time's Up"
// ============================================

/**
 * Représente une équipe dans le jeu Time's Up
 */
export interface TimesUpTeam {
  id: string;
  name: string;
  color: string;
  scores: number[]; // Score par manche [manche1, manche2, manche3]
}

/**
 * Représente une carte/mot dans le jeu Time's Up
 */
export interface TimesUpCard {
  id: string;
  word: string;
  isCustom?: boolean;
}

/**
 * Phases du jeu Time's Up
 */
export type TimesUpPhase = "setup" | "round" | "turn" | "roundEnd" | "summary";

/**
 * Numéro de manche (1, 2 ou 3)
 */
export type TimesUpRoundNumber = 1 | 2 | 3;

/**
 * Labels des manches
 */
export const TIMES_UP_ROUND_LABELS: Record<
  TimesUpRoundNumber,
  { name: string; description: string; icon: string }
> = {
  1: {
    name: "Description libre",
    description: "Décris avec autant de mots que tu veux !",
    icon: "🗣️",
  },
  2: {
    name: "Un seul mot",
    description: "Un seul mot pour faire deviner !",
    icon: "☝️",
  },
  3: { name: "Mime", description: "Mime sans parler !", icon: "🎭" },
};

/**
 * Configuration de la partie Time's Up
 */
export interface TimesUpGameConfig {
  teams: TimesUpTeam[];
  turnDuration: number; // Durée d'un tour en secondes (30, 45, 60)
  allowSkip: boolean; // Autoriser le bouton "Passer"
  maxSkipsPerTurn: number; // Nombre max de passes par tour (0 = illimité si allowSkip)
  cards: TimesUpCard[]; // Paquet de cartes initial
}

/**
 * État d'un tour actif
 */
export interface TimesUpTurnState {
  isActive: boolean;
  timeLeft: number;
  currentCardIndex: number;
  skipsUsed: number;
  cardsFoundThisTurn: string[]; // IDs des cartes trouvées ce tour
}

/**
 * État complet du jeu Time's Up
 */
export interface TimesUpGameState {
  phase: TimesUpPhase;
  config: TimesUpGameConfig;
  currentRound: TimesUpRoundNumber;
  currentTeamIndex: number;
  teams: TimesUpTeam[];

  // Deck management
  originalDeck: TimesUpCard[]; // Deck original (mélangé une fois)
  currentDeck: TimesUpCard[]; // Cartes restantes dans la manche en cours
  foundCardsThisRound: TimesUpCard[]; // Cartes trouvées dans la manche

  // Tour actif
  turn: TimesUpTurnState;

  // Historique
  isGameStarted: boolean;
  isGameFinished: boolean;
}

/**
 * Résumé final du jeu Time's Up
 */
export interface TimesUpSummary {
  teams: TimesUpTeam[];
  winner: TimesUpTeam | null;
  isTie: boolean;
}

// ============================================
// Types pour le jeu "Party Guess"
// ============================================

/**
 * Les 7 variantes de Party Guess
 */
export type PartyGuessVariant =
  | "interdit" // Taboo-like
  | "mime" // Mimer
  | "oneWord" // Un seul mot
  | "lyrics" // Finis les paroles
  | "singIt" // Chanter titre + artiste
  | "celebrities" // Célébrités
  | "sports"; // Sport

/**
 * Infos sur chaque variante
 */
export const PARTY_GUESS_VARIANTS: Record<
  PartyGuessVariant,
  { name: string; description: string; icon: string; rule: string }
> = {
  interdit: {
    name: "Interdit",
    description: "Faire deviner sans dire le mot",
    icon: "🚫",
    rule: "Décris sans prononcer le mot !",
  },
  mime: {
    name: "Mime",
    description: "Mimer pour faire deviner",
    icon: "🎭",
    rule: "Mime uniquement, pas de paroles !",
  },
  oneWord: {
    name: "Un seul mot",
    description: "Un seul indice autorisé",
    icon: "☝️",
    rule: "Donne un seul mot comme indice !",
  },
  lyrics: {
    name: "Finis les paroles",
    description: "Continuer les paroles",
    icon: "🎤",
    rule: "Lis le début, les autres continuent !",
  },
  singIt: {
    name: "Chante-le !",
    description: "Chanter pour faire deviner",
    icon: "🎵",
    rule: "Chante la chanson pour faire deviner !",
  },
  celebrities: {
    name: "Célébrités",
    description: "Faire deviner des personnalités",
    icon: "⭐",
    rule: "Fais deviner la célébrité !",
  },
  sports: {
    name: "Sport",
    description: "Termes sportifs",
    icon: "⚽",
    rule: "Fais deviner le terme sportif !",
  },
};

/**
 * Types de cartes selon la variante
 */
export interface PartyGuessCardBase {
  id: string;
  isCustom?: boolean;
}

export interface PartyGuessCardWord extends PartyGuessCardBase {
  type: "word";
  word: string;
}

export interface PartyGuessCardLyrics extends PartyGuessCardBase {
  type: "lyrics";
  promptStart: string;
  expectedContinuation?: string;
}

export interface PartyGuessCardSong extends PartyGuessCardBase {
  type: "song";
  title: string;
  artist: string;
}

export type PartyGuessCard =
  | PartyGuessCardWord
  | PartyGuessCardLyrics
  | PartyGuessCardSong;

/**
 * Équipe Party Guess
 */
export interface PartyGuessTeam {
  id: string;
  name: string;
  color: string;
  score: number;
}

/**
 * Phases du jeu
 */
export type PartyGuessPhase =
  | "pickVariant"
  | "setup"
  | "playing"
  | "betweenTurns"
  | "roundEnd"
  | "gameEnd";

/**
 * Configuration d'une manche (round)
 */
export interface PartyGuessRoundConfig {
  variant: PartyGuessVariant;
  cards: PartyGuessCard[];
  cardsPerRound: number; // 0 = toutes les cartes
}

/**
 * Configuration du jeu
 */
export interface PartyGuessGameConfig {
  variants: PartyGuessVariant[]; // Liste des variantes sélectionnées
  rounds: PartyGuessRoundConfig[]; // Config par manche
  teams: PartyGuessTeam[];
  turnDuration: number;
  allowSkip: boolean;
  maxSkipsPerTurn: number;
  totalRounds: number;
  cardsPerRound: number; // Nombre de cartes par manche (0 = toutes)
}

/**
 * État d'un tour
 */
export interface PartyGuessTurnState {
  isActive: boolean;
  timeLeft: number;
  skipsUsed: number;
  cardsFoundThisTurn: string[];
}

/**
 * État complet du jeu
 */
export interface PartyGuessGameState {
  phase: PartyGuessPhase;
  config: PartyGuessGameConfig;
  currentRound: number;
  currentRoundVariant: PartyGuessVariant; // Variante de la manche en cours
  currentTeamIndex: number;
  teams: PartyGuessTeam[];

  // Deck
  originalDeck: PartyGuessCard[];
  currentDeck: PartyGuessCard[];
  foundCardsThisRound: PartyGuessCard[];

  // Tour
  turn: PartyGuessTurnState;

  // État
  isGameStarted: boolean;
  isGameFinished: boolean;
}

/**
 * Résumé final
 */
export interface PartyGuessSummary {
  teams: PartyGuessTeam[];
  winner: PartyGuessTeam | null;
  isTie: boolean;
  totalCardsFound: number;
}
