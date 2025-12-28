import { useState, useCallback, useEffect, useRef } from "react";
import {
  TimesUpGameState,
  TimesUpGameConfig,
  TimesUpTeam,
  TimesUpCard,
  TimesUpRoundNumber,
  TimesUpSummary,
} from "@/types";
import { shuffleArray } from "@/data/timesUpWords";

/**
 * Clé localStorage pour la sauvegarde
 */
const STORAGE_KEY = "timesup-game-state";

/**
 * Interface de retour du hook
 */
interface UseTimesUpGame {
  // État
  state: TimesUpGameState;
  currentTeam: TimesUpTeam | null;
  currentCard: TimesUpCard | null;

  // Actions de configuration
  startGame: (config: TimesUpGameConfig) => void;

  // Actions de jeu
  startTurn: () => void;
  cardFound: () => void;
  skipCard: () => void;
  endTurn: () => void;

  // Actions de manche
  startNextRound: () => void;

  // Actions de fin
  endGame: () => void;
  resetGame: () => void;
  replayGame: () => void;

  // Utilitaires
  getSummary: () => TimesUpSummary;
  hasSavedGame: () => boolean;
  loadSavedGame: () => boolean;
  clearSavedGame: () => void;
}

/**
 * État initial
 */
const INITIAL_STATE: TimesUpGameState = {
  phase: "setup",
  config: {
    teams: [],
    turnDuration: 30,
    allowSkip: true,
    maxSkipsPerTurn: 3,
    cards: [],
  },
  currentRound: 1,
  currentTeamIndex: 0,
  teams: [],
  originalDeck: [],
  currentDeck: [],
  foundCardsThisRound: [],
  turn: {
    isActive: false,
    timeLeft: 30,
    currentCardIndex: 0,
    skipsUsed: 0,
    cardsFoundThisTurn: [],
  },
  isGameStarted: false,
  isGameFinished: false,
};

/**
 * Hook principal pour gérer le jeu "Time's Up"
 */
export const useTimesUpGame = (): UseTimesUpGame => {
  const [state, setState] = useState<TimesUpGameState>(INITIAL_STATE);
  const timerRef = useRef<number | null>(null);

  /**
   * Équipe actuellement active
   */
  const currentTeam = state.teams[state.currentTeamIndex] || null;

  /**
   * Carte actuellement affichée
   */
  const currentCard = state.currentDeck[0] || null;

  /**
   * Sauvegarde l'état dans localStorage
   */
  const saveToStorage = useCallback((gameState: TimesUpGameState) => {
    try {
      // Ne pas sauvegarder les parties terminées ou en setup
      if (gameState.phase === "setup" || gameState.isGameFinished) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.error("Erreur sauvegarde localStorage:", e);
    }
  }, []);

  /**
   * Vérifie s'il existe une partie sauvegardée
   */
  const hasSavedGame = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved !== null;
    } catch {
      return false;
    }
  }, []);

  /**
   * Charge une partie sauvegardée
   */
  const loadSavedGame = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as TimesUpGameState;
        // Remettre le tour en pause
        parsed.turn.isActive = false;
        setState(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  /**
   * Supprime la partie sauvegardée
   */
  const clearSavedGame = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  /**
   * Démarre une nouvelle partie
   */
  const startGame = useCallback(
    (config: TimesUpGameConfig) => {
      const shuffledDeck = shuffleArray(config.cards);

      const newState: TimesUpGameState = {
        phase: "round",
        config,
        currentRound: 1,
        currentTeamIndex: 0,
        teams: config.teams.map((team) => ({
          ...team,
          scores: [0, 0, 0],
        })),
        originalDeck: shuffledDeck,
        currentDeck: [...shuffledDeck],
        foundCardsThisRound: [],
        turn: {
          isActive: false,
          timeLeft: config.turnDuration,
          currentCardIndex: 0,
          skipsUsed: 0,
          cardsFoundThisTurn: [],
        },
        isGameStarted: true,
        isGameFinished: false,
      };

      setState(newState);
      saveToStorage(newState);
    },
    [saveToStorage]
  );

  /**
   * Démarre un tour
   */
  const startTurn = useCallback(() => {
    setState((prev) => {
      const newState: TimesUpGameState = {
        ...prev,
        phase: "turn",
        turn: {
          isActive: true,
          timeLeft: prev.config.turnDuration,
          currentCardIndex: 0,
          skipsUsed: 0,
          cardsFoundThisTurn: [],
        },
      };
      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  /**
   * Carte trouvée - ajoute les points et passe à la suivante
   */
  const cardFound = useCallback(() => {
    setState((prev) => {
      if (!prev.turn.isActive || prev.currentDeck.length === 0) {
        return prev;
      }

      const foundCard = prev.currentDeck[0];
      const newCurrentDeck = prev.currentDeck.slice(1);
      const newFoundCards = [...prev.foundCardsThisRound, foundCard];

      // Mise à jour du score de l'équipe
      const newTeams = prev.teams.map((team, index) => {
        if (index === prev.currentTeamIndex) {
          const newScores = [...team.scores];
          newScores[prev.currentRound - 1] += 1;
          return { ...team, scores: newScores };
        }
        return team;
      });

      // Vérifier si la manche est terminée (plus de cartes)
      const isRoundComplete = newCurrentDeck.length === 0;

      const newState: TimesUpGameState = {
        ...prev,
        teams: newTeams,
        currentDeck: newCurrentDeck,
        foundCardsThisRound: newFoundCards,
        turn: {
          ...prev.turn,
          cardsFoundThisTurn: [...prev.turn.cardsFoundThisTurn, foundCard.id],
        },
        phase: isRoundComplete ? "roundEnd" : prev.phase,
      };

      // Si manche terminée, arrêter le tour
      if (isRoundComplete) {
        newState.turn.isActive = false;
      }

      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  /**
   * Passer une carte (sans points)
   */
  const skipCard = useCallback(() => {
    setState((prev) => {
      if (!prev.turn.isActive || prev.currentDeck.length <= 1) {
        return prev; // On ne peut pas passer la dernière carte
      }

      // Vérifier la limite de passes
      if (
        prev.config.maxSkipsPerTurn > 0 &&
        prev.turn.skipsUsed >= prev.config.maxSkipsPerTurn
      ) {
        return prev;
      }

      // Déplacer la carte à la fin du deck
      const [skippedCard, ...restDeck] = prev.currentDeck;
      const newDeck = [...restDeck, skippedCard];

      const newState: TimesUpGameState = {
        ...prev,
        currentDeck: newDeck,
        turn: {
          ...prev.turn,
          skipsUsed: prev.turn.skipsUsed + 1,
        },
      };

      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  /**
   * Fin du tour (timer écoulé ou manuel)
   */
  const endTurn = useCallback(() => {
    setState((prev) => {
      // Passer à l'équipe suivante
      const nextTeamIndex = (prev.currentTeamIndex + 1) % prev.teams.length;

      // Rotate the deck so the next team doesn't start on the same card
      let rotatedDeck = [...prev.currentDeck];
      if (rotatedDeck.length > 1) {
        const [first, ...rest] = rotatedDeck;
        rotatedDeck = [...rest, first];
      }

      const newState: TimesUpGameState = {
        ...prev,
        phase: "round",
        currentTeamIndex: nextTeamIndex,
        currentDeck: rotatedDeck,
        turn: {
          isActive: false,
          timeLeft: prev.config.turnDuration,
          currentCardIndex: 0,
          skipsUsed: 0,
          cardsFoundThisTurn: [],
        },
      };

      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  /**
   * Démarrer la manche suivante
   */
  const startNextRound = useCallback(() => {
    setState((prev) => {
      const nextRound = (prev.currentRound + 1) as TimesUpRoundNumber;

      // Si on a fini les 3 manches, terminer le jeu
      if (nextRound > 3) {
        const finalState: TimesUpGameState = {
          ...prev,
          phase: "summary",
          isGameFinished: true,
          turn: {
            isActive: false,
            timeLeft: prev.config.turnDuration,
            currentCardIndex: 0,
            skipsUsed: 0,
            cardsFoundThisTurn: [],
          },
        };
        clearSavedGame();
        return finalState;
      }

      // Rémélanger les cartes trouvées pour la nouvelle manche
      const reshuffledDeck = shuffleArray(prev.foundCardsThisRound);

      // Alternate starting team for each round
      const startingTeamIndex = prev.teams.length
        ? (nextRound - 1) % prev.teams.length
        : 0;

      const newState: TimesUpGameState = {
        ...prev,
        phase: "round",
        currentRound: nextRound,
        currentTeamIndex: startingTeamIndex,
        currentDeck: reshuffledDeck,
        foundCardsThisRound: [],
        turn: {
          isActive: false,
          timeLeft: prev.config.turnDuration,
          currentCardIndex: 0,
          skipsUsed: 0,
          cardsFoundThisTurn: [],
        },
      };

      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage, clearSavedGame]);

  /**
   * Timer effect
   */
  useEffect(() => {
    if (state.turn.isActive && state.turn.timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setState((prev) => {
          if (!prev.turn.isActive) return prev;

          const newTimeLeft = prev.turn.timeLeft - 1;

          if (newTimeLeft <= 0) {
            // Temps écoulé - fin du tour
            const nextTeamIndex =
              (prev.currentTeamIndex + 1) % prev.teams.length;

            // Rotate deck so the next team doesn't start on the same card
            let rotatedDeck = [...prev.currentDeck];
            if (rotatedDeck.length > 1) {
              const [first, ...rest] = rotatedDeck;
              rotatedDeck = [...rest, first];
            }

            const newState: TimesUpGameState = {
              ...prev,
              phase: "round",
              currentTeamIndex: nextTeamIndex,
              currentDeck: rotatedDeck,
              turn: {
                isActive: false,
                timeLeft: 0,
                currentCardIndex: 0,
                skipsUsed: 0,
                cardsFoundThisTurn: [],
              },
            };

            saveToStorage(newState);
            return newState;
          }

          return {
            ...prev,
            turn: {
              ...prev.turn,
              timeLeft: newTimeLeft,
            },
          };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.turn.isActive, state.turn.timeLeft, saveToStorage]);

  /**
   * Termine le jeu prématurément
   */
  const endGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: "summary",
      isGameFinished: true,
      turn: {
        ...prev.turn,
        isActive: false,
      },
    }));
    clearSavedGame();
  }, [clearSavedGame]);

  /**
   * Réinitialise le jeu
   */
  const resetGame = useCallback(() => {
    setState(INITIAL_STATE);
    clearSavedGame();
  }, [clearSavedGame]);

  /**
   * Rejouer avec les mêmes équipes et cartes
   */
  const replayGame = useCallback(() => {
    setState((prev) => {
      const reshuffledDeck = shuffleArray(prev.originalDeck);

      const newState: TimesUpGameState = {
        ...prev,
        phase: "round",
        currentRound: 1,
        currentTeamIndex: 0,
        teams: prev.teams.map((team) => ({
          ...team,
          scores: [0, 0, 0],
        })),
        currentDeck: reshuffledDeck,
        foundCardsThisRound: [],
        turn: {
          isActive: false,
          timeLeft: prev.config.turnDuration,
          currentCardIndex: 0,
          skipsUsed: 0,
          cardsFoundThisTurn: [],
        },
        isGameFinished: false,
      };

      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  /**
   * Calcule le résumé final
   */
  const getSummary = useCallback((): TimesUpSummary => {
    const teamsWithTotals = state.teams.map((team) => ({
      ...team,
      totalScore: team.scores.reduce((a, b) => a + b, 0),
    }));

    const maxScore = Math.max(...teamsWithTotals.map((t) => t.totalScore));
    const winners = teamsWithTotals.filter((t) => t.totalScore === maxScore);

    return {
      teams: state.teams,
      winner: winners.length === 1 ? winners[0] : null,
      isTie: winners.length > 1,
    };
  }, [state.teams]);

  return {
    state,
    currentTeam,
    currentCard,
    startGame,
    startTurn,
    cardFound,
    skipCard,
    endTurn,
    startNextRound,
    endGame,
    resetGame,
    replayGame,
    getSummary,
    hasSavedGame,
    loadSavedGame,
    clearSavedGame,
  };
};
