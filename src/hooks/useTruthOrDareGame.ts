import { useState, useCallback } from "react";
import {
  Player,
  TodGameConfig,
  TodGameState,
  TruthOrDareType,
  TodCardResolution,
  TodHistoryEntry,
  TodPlayerStats,
} from "@/types";
import { getRandomItem } from "@/data/truthOrDareData";

/**
 * Interface de retour du hook
 */
interface UseTruthOrDareGame {
  // État
  state: TodGameState;
  currentPlayer: Player | null;

  // Actions de configuration
  startGame: (config: TodGameConfig) => void;

  // Actions de jeu
  chooseTruthOrDare: (choice: TruthOrDareType) => void;
  resolveCurrentCard: (resolution: TodCardResolution) => void;
  nextPlayer: () => void;
  skipPlayer: () => void;

  // Actions de fin
  endGame: () => void;
  restartGame: () => void;
  replayWithSameSettings: () => void;
  resetGame: () => void;

  // Utilitaires
  getSummary: () => {
    playerStats: TodPlayerStats[];
    totalRounds: number;
    completionRate: number;
  };
}

/**
 * État initial
 */
const INITIAL_STATE: TodGameState = {
  config: {
    players: [],
    enabledLevels: ["soft"],
    selectionMode: "round-robin",
    maxRounds: undefined,
    penaltyType: "none",
  },
  currentRound: 0,
  currentPlayerIndex: 0,
  currentCard: null,
  currentChoice: null,
  isGameStarted: false,
  isGameFinished: false,
  players: [],
  history: [],
  playerStats: [],
};

/**
 * Hook principal pour gérer le jeu "Action ou Vérité"
 */
export const useTruthOrDareGame = (): UseTruthOrDareGame => {
  const [state, setState] = useState<TodGameState>(INITIAL_STATE);

  /**
   * Joueur actuellement actif
   */
  const currentPlayer = state.players[state.currentPlayerIndex] || null;

  /**
   * Initialise les stats des joueurs
   */
  const initializePlayerStats = useCallback(
    (players: Player[]): TodPlayerStats[] => {
      return players.map((player) => ({
        playerId: player.id,
        playerName: player.name,
        daresCompleted: 0,
        daresRefused: 0,
        truthsAnswered: 0,
        truthsRefused: 0,
        totalPenalties: 0,
        score: 0,
      }));
    },
    []
  );

  /**
   * Démarre une nouvelle partie
   */
  const startGame = useCallback(
    (config: TodGameConfig) => {
      const playersCopy = config.players.map((p) => ({ ...p, score: 0 }));
      const initialStats = initializePlayerStats(config.players);

      setState({
        config,
        currentRound: 1,
        currentPlayerIndex: 0,
        currentCard: null,
        currentChoice: null,
        isGameStarted: true,
        isGameFinished: false,
        players: playersCopy,
        history: [],
        playerStats: initialStats,
      });
    },
    [initializePlayerStats]
  );

  /**
   * Le joueur choisit Action ou Vérité
   */
  const chooseTruthOrDare = useCallback(
    (choice: TruthOrDareType) => {
      if (!state.isGameStarted || state.isGameFinished) {
        return;
      }

      // Récupérer les IDs des cartes déjà utilisées
      const usedCardIds = state.history.map((entry) => entry.card.id);

      // Tirer une carte aléatoire
      const card = getRandomItem(
        choice,
        state.config.enabledLevels,
        usedCardIds
      );

      if (!card) {
        console.error("Aucune carte disponible pour ce choix et ces niveaux");
        return;
      }

      setState((prev) => ({
        ...prev,
        currentChoice: choice,
        currentCard: card,
      }));
    },
    [
      state.isGameStarted,
      state.isGameFinished,
      state.history,
      state.config.enabledLevels,
    ]
  );

  /**
   * Résout la carte actuelle (completed: true/false)
   */
  const resolveCurrentCard = useCallback(
    (resolution: TodCardResolution) => {
      if (!state.currentCard || !state.currentChoice || !currentPlayer) {
        return;
      }

      const { completed } = resolution;
      const { config, currentRound, playerStats } = state;

      // Créer l'entrée d'historique
      const historyEntry: TodHistoryEntry = {
        roundNumber: currentRound,
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        choice: state.currentChoice,
        card: state.currentCard,
        completed,
        timestamp: Date.now(),
      };

      // Appliquer la pénalité si refus
      let penaltyApplied = undefined;
      if (!completed && config.penaltyType !== "none") {
        penaltyApplied = {
          type: config.penaltyType,
          drinkValue: config.penaltyDrinkValue,
          pointsValue: config.penaltyPointsValue,
        };
        historyEntry.penaltyApplied = penaltyApplied;
      }

      // Mettre à jour les stats du joueur
      const updatedStats = playerStats.map((stat) => {
        if (stat.playerId !== currentPlayer.id) {
          return stat;
        }

        const newStat = { ...stat };

        if (state.currentChoice === "dare") {
          if (completed) {
            newStat.daresCompleted += 1;
          } else {
            newStat.daresRefused += 1;
          }
        } else {
          if (completed) {
            newStat.truthsAnswered += 1;
          } else {
            newStat.truthsRefused += 1;
          }
        }

        if (!completed && penaltyApplied) {
          newStat.totalPenalties += 1;
          if (
            penaltyApplied.type === "points" ||
            penaltyApplied.type === "both"
          ) {
            newStat.score -= config.penaltyPointsValue || 0;
          }
        }

        return newStat;
      });

      // Mettre à jour le score du joueur dans la liste des players
      const updatedPlayers = state.players.map((p) => {
        if (p.id === currentPlayer.id && !completed && penaltyApplied) {
          if (
            penaltyApplied.type === "drink" ||
            penaltyApplied.type === "both"
          ) {
            return { ...p, score: p.score + (config.penaltyDrinkValue || 0) };
          }
          if (
            penaltyApplied.type === "points" ||
            penaltyApplied.type === "both"
          ) {
            return { ...p, score: p.score - (config.penaltyPointsValue || 0) };
          }
        }
        return p;
      });

      setState((prev) => ({
        ...prev,
        history: [...prev.history, historyEntry],
        playerStats: updatedStats,
        players: updatedPlayers,
        // On réinitialise la carte et le choix
        currentCard: null,
        currentChoice: null,
      }));
    },
    [state, currentPlayer]
  );

  /**
   * Passe au joueur suivant
   */
  const nextPlayer = useCallback(() => {
    if (!state.isGameStarted || state.isGameFinished) {
      return;
    }

    let nextIndex: number;
    let nextRound = state.currentRound;

    if (state.config.selectionMode === "round-robin") {
      // Mode tour par tour
      nextIndex = (state.currentPlayerIndex + 1) % state.players.length;

      // Si on revient au premier joueur, on incrémente le round
      if (nextIndex === 0) {
        nextRound += 1;
      }
    } else {
      // Mode aléatoire
      nextIndex = Math.floor(Math.random() * state.players.length);
      nextRound += 1;
    }

    // Vérifier si on a atteint le nombre maximum de rounds
    const shouldEndGame =
      state.config.maxRounds && nextRound > state.config.maxRounds;

    setState((prev) => ({
      ...prev,
      currentPlayerIndex: nextIndex,
      currentRound: nextRound,
      currentCard: null,
      currentChoice: null,
      isGameFinished: shouldEndGame || false,
    }));
  }, [state]);

  /**
   * Saute le tour du joueur actuel (sans action ni vérité)
   */
  const skipPlayer = useCallback(() => {
    nextPlayer();
  }, [nextPlayer]);

  /**
   * Termine la partie manuellement
   */
  const endGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isGameFinished: true,
      currentCard: null,
      currentChoice: null,
    }));
  }, []);

  /**
   * Redémarre une nouvelle partie avec les mêmes paramètres
   */
  const restartGame = useCallback(() => {
    startGame(state.config);
  }, [state.config, startGame]);

  /**
   * Rejoue avec exactement les mêmes paramètres
   */
  const replayWithSameSettings = useCallback(() => {
    startGame(state.config);
  }, [state.config, startGame]);

  /**
   * Réinitialise complètement le jeu
   */
  const resetGame = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  /**
   * Récupère un résumé de la partie
   */
  const getSummary = useCallback(() => {
    const totalCompleted = state.playerStats.reduce(
      (sum, stat) => sum + stat.daresCompleted + stat.truthsAnswered,
      0
    );
    const totalRefused = state.playerStats.reduce(
      (sum, stat) => sum + stat.daresRefused + stat.truthsRefused,
      0
    );
    const totalActions = totalCompleted + totalRefused;
    const completionRate =
      totalActions > 0 ? (totalCompleted / totalActions) * 100 : 0;

    return {
      playerStats: state.playerStats,
      totalRounds: state.currentRound,
      completionRate,
    };
  }, [state]);

  return {
    state,
    currentPlayer,
    startGame,
    chooseTruthOrDare,
    resolveCurrentCard,
    nextPlayer,
    skipPlayer,
    endGame,
    restartGame,
    replayWithSameSettings,
    resetGame,
    getSummary,
  };
};
