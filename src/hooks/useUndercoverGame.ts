import { useState, useCallback, useEffect, useRef } from "react";
import {
  UndercoverGameState,
  UndercoverGameConfig,
  UndercoverPlayer,
  UndercoverRole,
  UndercoverVote,
  UndercoverSummary,
  UndercoverEliminationEntry,
} from "@/types";
import { shuffleArray, getRandomWordPair } from "@/data/undercoverData";

/**
 * Clé localStorage
 */
const STORAGE_KEY = "undercover-game-state";

/**
 * État initial
 */
const INITIAL_STATE: UndercoverGameState = {
  phase: "setup",
  config: {
    playerNames: [],
    undercoverCount: 1,
    hasMrWhite: false,
    wordPair: { id: "", civilWord: "", undercoverWord: "" },
    rules: {
      discussionDuration: 0,
      allowSelfVote: false,
      revealRoleOnElimination: true,
      showEliminationHistory: true,
      tieBreakMode: "random",
    },
  },
  players: [],
  currentRound: 1,
  currentRevealIndex: 0,
  discussionTimeLeft: 0,
  currentVoterIndex: 0,
  votes: [],
  lastEliminatedId: null,
  tiedPlayerIds: [],
  isRevote: false,
  mrWhiteGuessCorrect: null,
  eliminationHistory: [],
  isGameStarted: false,
  isGameFinished: false,
  winner: null,
};

/**
 * Interface de retour du hook
 */
interface UseUndercoverGame {
  // État
  state: UndercoverGameState;
  
  // Joueurs helpers
  currentRevealPlayer: UndercoverPlayer | null;
  currentVoter: UndercoverPlayer | null;
  alivePlayers: UndercoverPlayer[];
  lastEliminated: UndercoverPlayer | null;
  
  // Actions de configuration
  startGame: (config: UndercoverGameConfig) => void;
  goBackToSetup: () => void;
  
  // Actions de révélation des rôles
  confirmRoleSeen: () => void;
  
  // Actions de discussion
  startDiscussion: () => void;
  skipDiscussionTimer: () => void;
  
  // Actions de vote
  submitVote: (targetId: string) => void;
  
  // Actions post-vote
  confirmVoteResult: () => void;
  confirmElimination: () => void;
  
  // Actions Mr White
  submitMrWhiteGuess: (guess: string) => void;
  
  // Actions de fin
  resetGame: () => void;
  replayGame: () => void;
  
  // Utilitaires
  getSummary: () => UndercoverSummary;
  hasSavedGame: () => boolean;
  loadSavedGame: () => boolean;
  clearSavedGame: () => void;
}

/**
 * Hook principal pour gérer le jeu Undercover
 */
export const useUndercoverGame = (): UseUndercoverGame => {
  const [state, setState] = useState<UndercoverGameState>(INITIAL_STATE);
  const timerRef = useRef<number | null>(null);

  // ============================================
  // Helpers
  // ============================================

  const currentRevealPlayer = state.players[state.currentRevealIndex] || null;
  
  const alivePlayers = state.players.filter((p) => !p.isEliminated);
  
  const currentVoter = alivePlayers[state.currentVoterIndex] || null;
  
  const lastEliminated = state.lastEliminatedId
    ? state.players.find((p) => p.id === state.lastEliminatedId) || null
    : null;

  // ============================================
  // Persistence localStorage
  // ============================================

  const saveToStorage = useCallback((gameState: UndercoverGameState) => {
    try {
      if (
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

  const hasSavedGame = useCallback((): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  }, []);

  const loadSavedGame = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as UndercoverGameState;
        setState(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const clearSavedGame = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  // ============================================
  // Timer pour la discussion
  // ============================================

  useEffect(() => {
    if (state.phase === "discussion" && state.discussionTimeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setState((prev) => {
          const newTime = prev.discussionTimeLeft - 1;
          if (newTime <= 0) {
            // Timer écoulé, passer au vote
            return {
              ...prev,
              discussionTimeLeft: 0,
              phase: "voting",
              currentVoterIndex: 0,
              votes: [],
            };
          }
          return { ...prev, discussionTimeLeft: newTime };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.phase, state.discussionTimeLeft]);

  // Sauvegarde automatique
  useEffect(() => {
    saveToStorage(state);
  }, [state, saveToStorage]);

  // ============================================
  // Actions
  // ============================================

  /**
   * Démarre une nouvelle partie
   */
  const startGame = useCallback((config: UndercoverGameConfig) => {
    // Créer et assigner les rôles
    const roles: UndercoverRole[] = [];
    
    // Ajouter les undercovers
    for (let i = 0; i < config.undercoverCount; i++) {
      roles.push("undercover");
    }
    
    // Ajouter Mr White si activé
    if (config.hasMrWhite) {
      roles.push("mrwhite");
    }
    
    // Remplir le reste avec des civils
    while (roles.length < config.playerNames.length) {
      roles.push("civil");
    }
    
    // Mélanger les rôles
    const shuffledRoles = shuffleArray(roles);
    
    // Créer les joueurs
    const players: UndercoverPlayer[] = config.playerNames.map((name, index) => {
      const role = shuffledRoles[index];
      let word: string | null = null;
      
      if (role === "civil") {
        word = config.wordPair.civilWord;
      } else if (role === "undercover") {
        word = config.wordPair.undercoverWord;
      }
      // Mr White n'a pas de mot (word reste null)
      
      return {
        id: `player-${index}-${Date.now()}`,
        name,
        role,
        word,
        isEliminated: false,
        votesReceived: 0,
      };
    });

    setState({
      ...INITIAL_STATE,
      phase: "roleReveal",
      config,
      players,
      currentRound: 1,
      currentRevealIndex: 0,
      isGameStarted: true,
    });
  }, []);

  /**
   * Retour à la configuration
   */
  const goBackToSetup = useCallback(() => {
    clearSavedGame();
    setState(INITIAL_STATE);
  }, [clearSavedGame]);

  /**
   * Confirme que le joueur a vu son rôle
   */
  const confirmRoleSeen = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentRevealIndex + 1;
      
      if (nextIndex >= prev.players.length) {
        // Tous les joueurs ont vu leur rôle, passer à la discussion
        return {
          ...prev,
          phase: "discussion",
          discussionTimeLeft: prev.config.rules.discussionDuration,
        };
      }
      
      return {
        ...prev,
        currentRevealIndex: nextIndex,
      };
    });
  }, []);

  /**
   * Démarre la phase de discussion (si pas de timer)
   */
  const startDiscussion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: "discussion",
      discussionTimeLeft: prev.config.rules.discussionDuration,
    }));
  }, []);

  /**
   * Passe directement au vote (skip le timer)
   */
  const skipDiscussionTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setState((prev) => ({
      ...prev,
      phase: "voting",
      discussionTimeLeft: 0,
      currentVoterIndex: 0,
      votes: [],
    }));
  }, []);

  /**
   * Soumet un vote
   */
  const submitVote = useCallback((targetId: string) => {
    setState((prev) => {
      const voter = prev.players.filter((p) => !p.isEliminated)[prev.currentVoterIndex];
      if (!voter) return prev;

      const newVote: UndercoverVote = {
        voterId: voter.id,
        targetId,
      };

      const newVotes = [...prev.votes, newVote];
      const aliveCount = prev.players.filter((p) => !p.isEliminated).length;
      const nextVoterIndex = prev.currentVoterIndex + 1;

      // Vérifier si tous les joueurs vivants ont voté
      if (nextVoterIndex >= aliveCount) {
        // Calculer les résultats du vote
        return calculateVoteResults({
          ...prev,
          votes: newVotes,
        });
      }

      return {
        ...prev,
        votes: newVotes,
        currentVoterIndex: nextVoterIndex,
      };
    });
  }, []);

  /**
   * Calcule les résultats du vote
   */
  const calculateVoteResults = (currentState: UndercoverGameState): UndercoverGameState => {
    // Compter les votes par joueur
    const voteCounts: Record<string, number> = {};
    
    currentState.votes.forEach((vote) => {
      voteCounts[vote.targetId] = (voteCounts[vote.targetId] || 0) + 1;
    });

    // Trouver le maximum de votes
    const maxVotes = Math.max(...Object.values(voteCounts));
    
    // Trouver tous les joueurs avec le maximum de votes
    const mostVotedIds = Object.entries(voteCounts)
      .filter(([, count]) => count === maxVotes)
      .map(([id]) => id);

    // Mettre à jour les votes reçus sur les joueurs
    const updatedPlayers = currentState.players.map((p) => ({
      ...p,
      votesReceived: voteCounts[p.id] || 0,
    }));

    // Égalité ?
    if (mostVotedIds.length > 1) {
      if (currentState.config.rules.tieBreakMode === "revote" && !currentState.isRevote) {
        // Revote entre les joueurs à égalité
        return {
          ...currentState,
          players: updatedPlayers,
          phase: "voteResult",
          tiedPlayerIds: mostVotedIds,
          isRevote: true,
        };
      } else {
        // Tie-break aléatoire
        const randomIndex = Math.floor(Math.random() * mostVotedIds.length);
        const eliminatedId = mostVotedIds[randomIndex];
        
        return {
          ...currentState,
          players: updatedPlayers,
          phase: "voteResult",
          lastEliminatedId: eliminatedId,
          tiedPlayerIds: [],
          isRevote: false,
        };
      }
    }

    // Un seul joueur éliminé
    return {
      ...currentState,
      players: updatedPlayers,
      phase: "voteResult",
      lastEliminatedId: mostVotedIds[0],
      tiedPlayerIds: [],
      isRevote: false,
    };
  };

  /**
   * Confirme le résultat du vote (pour passer à l'élimination ou revote)
   */
  const confirmVoteResult = useCallback(() => {
    setState((prev) => {
      // Si revote nécessaire
      if (prev.tiedPlayerIds.length > 0 && prev.isRevote) {
        return {
          ...prev,
          phase: "voting",
          currentVoterIndex: 0,
          votes: [],
          // Les joueurs ne peuvent voter que pour les joueurs à égalité
        };
      }

      // Sinon, passer à l'élimination
      return {
        ...prev,
        phase: "elimination",
      };
    });
  }, []);

  /**
   * Confirme l'élimination et vérifie les conditions de victoire
   */
  const confirmElimination = useCallback(() => {
    setState((prev) => {
      if (!prev.lastEliminatedId) return prev;

      const eliminatedPlayer = prev.players.find((p) => p.id === prev.lastEliminatedId);
      if (!eliminatedPlayer) return prev;

      // Marquer le joueur comme éliminé
      const updatedPlayers = prev.players.map((p) =>
        p.id === prev.lastEliminatedId
          ? { ...p, isEliminated: true, eliminatedAtRound: prev.currentRound }
          : { ...p, votesReceived: 0 } // Reset votes pour le prochain tour
      );

      // Ajouter à l'historique
      const newHistoryEntry: UndercoverEliminationEntry = {
        round: prev.currentRound,
        playerId: eliminatedPlayer.id,
        playerName: eliminatedPlayer.name,
        role: eliminatedPlayer.role,
        votesReceived: eliminatedPlayer.votesReceived,
      };

      const newHistory = [...prev.eliminationHistory, newHistoryEntry];

      // Si c'est Mr White qui est éliminé, lui donner une chance de deviner
      if (eliminatedPlayer.role === "mrwhite") {
        return {
          ...prev,
          players: updatedPlayers,
          eliminationHistory: newHistory,
          phase: "mrWhiteGuess",
        };
      }

      // Vérifier les conditions de victoire
      const remainingPlayers = updatedPlayers.filter((p) => !p.isEliminated);
      const remainingUndercovers = remainingPlayers.filter((p) => p.role === "undercover");
      const remainingMrWhite = remainingPlayers.filter((p) => p.role === "mrwhite");
      const remainingCivils = remainingPlayers.filter((p) => p.role === "civil");

      // Victoire des civils: tous les undercovers et Mr White éliminés
      if (remainingUndercovers.length === 0 && remainingMrWhite.length === 0) {
        return {
          ...prev,
          players: updatedPlayers,
          eliminationHistory: newHistory,
          phase: "gameEnd",
          isGameFinished: true,
          winner: "civils",
        };
      }

      // Victoire des undercovers: ils sont majoritaires ou égalitaires
      if (remainingUndercovers.length >= remainingCivils.length) {
        return {
          ...prev,
          players: updatedPlayers,
          eliminationHistory: newHistory,
          phase: "gameEnd",
          isGameFinished: true,
          winner: "undercover",
        };
      }

      // Le jeu continue: nouveau tour
      return {
        ...prev,
        players: updatedPlayers,
        eliminationHistory: newHistory,
        phase: "discussion",
        currentRound: prev.currentRound + 1,
        discussionTimeLeft: prev.config.rules.discussionDuration,
        lastEliminatedId: null,
        votes: [],
        currentVoterIndex: 0,
      };
    });
  }, []);

  /**
   * Mr White soumet sa supposition
   */
  const submitMrWhiteGuess = useCallback((guess: string) => {
    setState((prev) => {
      const civilWord = prev.config.wordPair.civilWord.toLowerCase().trim();
      const guessNormalized = guess.toLowerCase().trim();
      const isCorrect = guessNormalized === civilWord;

      if (isCorrect) {
        // Mr White gagne !
        return {
          ...prev,
          mrWhiteGuessCorrect: true,
          phase: "gameEnd",
          isGameFinished: true,
          winner: "mrwhite",
        };
      }

      // Mr White a échoué, vérifier les conditions de victoire
      const remainingPlayers = prev.players.filter((p) => !p.isEliminated);
      const remainingUndercovers = remainingPlayers.filter((p) => p.role === "undercover");
      const remainingCivils = remainingPlayers.filter((p) => p.role === "civil");

      // Victoire des civils si plus d'undercovers
      if (remainingUndercovers.length === 0) {
        return {
          ...prev,
          mrWhiteGuessCorrect: false,
          phase: "gameEnd",
          isGameFinished: true,
          winner: "civils",
        };
      }

      // Victoire des undercovers s'ils sont majoritaires
      if (remainingUndercovers.length >= remainingCivils.length) {
        return {
          ...prev,
          mrWhiteGuessCorrect: false,
          phase: "gameEnd",
          isGameFinished: true,
          winner: "undercover",
        };
      }

      // Le jeu continue
      return {
        ...prev,
        mrWhiteGuessCorrect: false,
        phase: "discussion",
        currentRound: prev.currentRound + 1,
        discussionTimeLeft: prev.config.rules.discussionDuration,
        lastEliminatedId: null,
        votes: [],
        currentVoterIndex: 0,
      };
    });
  }, []);

  /**
   * Reset complet
   */
  const resetGame = useCallback(() => {
    clearSavedGame();
    setState(INITIAL_STATE);
  }, [clearSavedGame]);

  /**
   * Rejouer avec les mêmes joueurs mais nouvelles cartes
   */
  const replayGame = useCallback(() => {
    setState((prev) => {
      const newWordPair = getRandomWordPair([prev.config.wordPair.id]);
      
      return {
        ...INITIAL_STATE,
        config: {
          ...prev.config,
          wordPair: newWordPair,
        },
        phase: "setup",
      };
    });
  }, []);

  /**
   * Retourne le résumé de fin de partie
   */
  const getSummary = useCallback((): UndercoverSummary => {
    return {
      winner: state.winner,
      players: state.players,
      eliminationHistory: state.eliminationHistory,
      wordPair: state.config.wordPair,
      totalRounds: state.currentRound,
    };
  }, [state]);

  return {
    state,
    currentRevealPlayer,
    currentVoter,
    alivePlayers,
    lastEliminated,
    startGame,
    goBackToSetup,
    confirmRoleSeen,
    startDiscussion,
    skipDiscussionTimer,
    submitVote,
    confirmVoteResult,
    confirmElimination,
    submitMrWhiteGuess,
    resetGame,
    replayGame,
    getSummary,
    hasSavedGame,
    loadSavedGame,
    clearSavedGame,
  };
};
