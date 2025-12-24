import { useState, useCallback, useEffect, useRef } from "react";
import {
  PartyGuessGameState,
  PartyGuessGameConfig,
  PartyGuessTeam,
  PartyGuessCard,
  PartyGuessVariant,
  PartyGuessSummary,
} from "@/types";
import { shuffleArray } from "@/data/partyGuessData";

/**
 * Clé localStorage
 */
const STORAGE_KEY = "partyguess-game-state";

/**
 * Interface de retour du hook
 */
interface UsePartyGuessGame {
  // État
  state: PartyGuessGameState;
  currentTeam: PartyGuessTeam | null;
  currentCard: PartyGuessCard | null;

  // Sélection variante
  selectVariant: (variant: PartyGuessVariant) => void;

  // Actions de configuration
  startGame: (config: PartyGuessGameConfig) => void;
  goBackToSetup: () => void;
  goBackToVariantPicker: () => void;

  // Actions de jeu
  startTurn: () => void;
  cardFound: () => void;
  skipCard: () => void;
  endTurn: () => void;

  // Actions de manche/fin
  startNextRound: () => void;
  endGame: () => void;
  resetGame: () => void;
  replayGame: () => void;

  // Utilitaires
  getSummary: () => PartyGuessSummary;
  hasSavedGame: () => boolean;
  loadSavedGame: () => boolean;
  clearSavedGame: () => void;
}

/**
 * État initial
 */
const INITIAL_STATE: PartyGuessGameState = {
  phase: "pickVariant",
  config: {
    variants: [],
    rounds: [],
    teams: [],
    turnDuration: 30,
    allowSkip: true,
    maxSkipsPerTurn: 3,
    totalRounds: 1,
    cardsPerRound: 0,
  },
  currentRound: 1,
  currentRoundVariant: "interdit",
  currentTeamIndex: 0,
  teams: [],
  originalDeck: [],
  currentDeck: [],
  foundCardsThisRound: [],
  turn: {
    isActive: false,
    timeLeft: 30,
    skipsUsed: 0,
    cardsFoundThisTurn: [],
  },
  isGameStarted: false,
  isGameFinished: false,
};

/**
 * Hook principal pour gérer le jeu "Party Guess"
 */
export const usePartyGuessGame = (): UsePartyGuessGame => {
  const [state, setState] = useState<PartyGuessGameState>(INITIAL_STATE);
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
   * Sauvegarde dans localStorage
   */
  const saveToStorage = useCallback((gameState: PartyGuessGameState) => {
    try {
      if (
        gameState.phase === "pickVariant" ||
        gameState.phase === "setup" ||
        gameState.isGameFinished
      ) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.error("Erreur sauvegarde localStorage:", e);
    }
  }, []);

  /**
   * Vérifie si partie sauvegardée
   */
  const hasSavedGame = useCallback((): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  }, []);

  /**
   * Charge partie sauvegardée
   */
  const loadSavedGame = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as PartyGuessGameState;
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
   * Supprime la sauvegarde
   */
  const clearSavedGame = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  /**
   * Sélectionne une variante et passe au setup
   */
  const selectVariant = useCallback((variant: PartyGuessVariant) => {
    setState((prev) => ({
      ...prev,
      phase: "setup",
      config: {
        ...prev.config,
        variants: [variant],
      },
    }));
  }, []);

  /**
   * Retour au setup
   */
  const goBackToSetup = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: "setup",
      isGameStarted: false,
      isGameFinished: false,
    }));
  }, []);

  /**
   * Retour au choix de variante
   */
  const goBackToVariantPicker = useCallback(() => {
    setState(INITIAL_STATE);
    clearSavedGame();
  }, [clearSavedGame]);

  /**
   * Démarre une partie
   */
  const startGame = useCallback(
    (config: PartyGuessGameConfig) => {
      // Préparer le deck pour la première manche
      const firstRound = config.rounds[0];
      let deck = shuffleArray(firstRound.cards);
      
      // Limiter le nombre de cartes si configuré
      if (firstRound.cardsPerRound > 0 && deck.length > firstRound.cardsPerRound) {
        deck = deck.slice(0, firstRound.cardsPerRound);
      }

      const newState: PartyGuessGameState = {
        phase: "betweenTurns",
        config,
        currentRound: 1,
        currentRoundVariant: firstRound.variant,
        currentTeamIndex: 0,
        teams: config.teams.map((team) => ({
          ...team,
          score: 0,
        })),
        originalDeck: deck,
        currentDeck: [...deck],
        foundCardsThisRound: [],
        turn: {
          isActive: false,
          timeLeft: config.turnDuration,
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
      const newState: PartyGuessGameState = {
        ...prev,
        phase: "playing",
        turn: {
          isActive: true,
          timeLeft: prev.config.turnDuration,
          skipsUsed: 0,
          cardsFoundThisTurn: [],
        },
      };
      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  /**
   * Carte trouvée
   */
  const cardFound = useCallback(() => {
    setState((prev) => {
      if (!prev.turn.isActive || prev.currentDeck.length === 0) {
        return prev;
      }

      const foundCard = prev.currentDeck[0];
      const newCurrentDeck = prev.currentDeck.slice(1);
      const newFoundCards = [...prev.foundCardsThisRound, foundCard];

      // Mise à jour score
      const newTeams = prev.teams.map((team, index) => {
        if (index === prev.currentTeamIndex) {
          return { ...team, score: team.score + 1 };
        }
        return team;
      });

      // Manche terminée ?
      const isRoundComplete = newCurrentDeck.length === 0;

      const newState: PartyGuessGameState = {
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

      if (isRoundComplete) {
        newState.turn.isActive = false;
      }

      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  /**
   * Passer une carte
   */
  const skipCard = useCallback(() => {
    setState((prev) => {
      if (!prev.turn.isActive || prev.currentDeck.length <= 1) {
        return prev;
      }

      if (
        prev.config.maxSkipsPerTurn > 0 &&
        prev.turn.skipsUsed >= prev.config.maxSkipsPerTurn
      ) {
        return prev;
      }

      const [skippedCard, ...restDeck] = prev.currentDeck;
      const newDeck = [...restDeck, skippedCard];

      const newState: PartyGuessGameState = {
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
   * Fin du tour
   */
  const endTurn = useCallback(() => {
    setState((prev) => {
      const nextTeamIndex = (prev.currentTeamIndex + 1) % prev.teams.length;

      const newState: PartyGuessGameState = {
        ...prev,
        phase: "betweenTurns",
        currentTeamIndex: nextTeamIndex,
        turn: {
          isActive: false,
          timeLeft: prev.config.turnDuration,
          skipsUsed: 0,
          cardsFoundThisTurn: [],
        },
      };

      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  /**
   * Démarrer manche suivante
   */
  const startNextRound = useCallback(() => {
    setState((prev) => {
      const nextRound = prev.currentRound + 1;

      // Fin du jeu ?
      if (nextRound > prev.config.totalRounds) {
        const finalState: PartyGuessGameState = {
          ...prev,
          phase: "gameEnd",
          isGameFinished: true,
          turn: {
            isActive: false,
            timeLeft: prev.config.turnDuration,
            skipsUsed: 0,
            cardsFoundThisTurn: [],
          },
        };
        clearSavedGame();
        return finalState;
      }

      // Récupérer la config de la nouvelle manche
      const nextRoundConfig = prev.config.rounds[nextRound - 1];
      let newDeck = shuffleArray(nextRoundConfig.cards);
      
      // Limiter le nombre de cartes si configuré
      if (nextRoundConfig.cardsPerRound > 0 && newDeck.length > nextRoundConfig.cardsPerRound) {
        newDeck = newDeck.slice(0, nextRoundConfig.cardsPerRound);
      }

      const newState: PartyGuessGameState = {
        ...prev,
        phase: "betweenTurns",
        currentRound: nextRound,
        currentRoundVariant: nextRoundConfig.variant,
        currentTeamIndex: 0,
        originalDeck: newDeck,
        currentDeck: [...newDeck],
        foundCardsThisRound: [],
        turn: {
          isActive: false,
          timeLeft: prev.config.turnDuration,
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
            const nextTeamIndex =
              (prev.currentTeamIndex + 1) % prev.teams.length;

            const newState: PartyGuessGameState = {
              ...prev,
              phase: "betweenTurns",
              currentTeamIndex: nextTeamIndex,
              turn: {
                isActive: false,
                timeLeft: 0,
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
   * Termine le jeu
   */
  const endGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: "gameEnd",
      isGameFinished: true,
      turn: {
        ...prev.turn,
        isActive: false,
      },
    }));
    clearSavedGame();
  }, [clearSavedGame]);

  /**
   * Reset complet
   */
  const resetGame = useCallback(() => {
    setState(INITIAL_STATE);
    clearSavedGame();
  }, [clearSavedGame]);

  /**
   * Rejouer avec mêmes équipes
   */
  const replayGame = useCallback(() => {
    setState((prev) => {
      // Récupérer la config de la première manche
      const firstRound = prev.config.rounds[0];
      let newDeck = shuffleArray(firstRound.cards);
      
      // Limiter le nombre de cartes si configuré
      if (firstRound.cardsPerRound > 0 && newDeck.length > firstRound.cardsPerRound) {
        newDeck = newDeck.slice(0, firstRound.cardsPerRound);
      }

      const newState: PartyGuessGameState = {
        ...prev,
        phase: "betweenTurns",
        currentRound: 1,
        currentRoundVariant: firstRound.variant,
        currentTeamIndex: 0,
        teams: prev.teams.map((team) => ({
          ...team,
          score: 0,
        })),
        originalDeck: newDeck,
        currentDeck: [...newDeck],
        foundCardsThisRound: [],
        turn: {
          isActive: false,
          timeLeft: prev.config.turnDuration,
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
   * Résumé final
   */
  const getSummary = useCallback((): PartyGuessSummary => {
    const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score);
    const maxScore = sortedTeams[0]?.score || 0;
    const winners = sortedTeams.filter((t) => t.score === maxScore);

    return {
      teams: state.teams,
      winner: winners.length === 1 ? winners[0] : null,
      isTie: winners.length > 1,
      totalCardsFound: state.foundCardsThisRound.length,
    };
  }, [state.teams, state.foundCardsThisRound]);

  return {
    state,
    currentTeam,
    currentCard,
    selectVariant,
    startGame,
    goBackToSetup,
    goBackToVariantPicker,
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
