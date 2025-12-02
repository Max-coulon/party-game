import { useState, useCallback } from "react";
import {
  NheMode,
  NheTheme,
  NheQuestion,
  Player,
  NheSpecialRules,
  NheHistoryEntry,
  NheGameConfig,
} from "@/types";
import {
  getQuestionsByModes,
  shuffleQuestions,
} from "@/data/neverHaveIEverQuestions";
import { recordGamePlayed } from "@/utils/statsManager";

/**
 * Interface de retour du hook amélioré
 */
interface UseNeverHaveIEverGameV2 {
  // Configuration
  config: NheGameConfig;

  // État du jeu
  currentQuestionIndex: number;
  currentQuestion: NheQuestion | null;
  currentChallenge: string | null;
  questions: NheQuestion[];
  isGameStarted: boolean;
  isGameFinished: boolean;
  players: Player[];
  history: NheHistoryEntry[];
  customQuestions: NheQuestion[];

  // Actions de configuration
  toggleMode: (mode: NheMode) => void;
  toggleTheme: (theme: NheTheme) => void;
  setQuestionCount: (count: number) => void;
  toggleSpecialRule: (rule: keyof NheSpecialRules) => void;
  addCustomQuestion: (text: string, mode: NheMode, sips: number) => void;
  removeCustomQuestion: (id: string) => void;

  // Actions de jeu
  startGame: (gamePlayers: Player[]) => void;
  submitAnswers: (playerIds: string[], mutedPlayerIds?: string[]) => void;
  nextQuestion: () => void;
  restartGame: () => void;
  replayWithSameSettings: () => void;
  resetGame: () => void;
}

/**
 * Configuration par défaut
 */
const DEFAULT_CONFIG: NheGameConfig = {
  selectedModes: ["soft"],
  selectedThemes: [],
  questionCount: 20,
  specialRules: {
    doubleShot: false,
    muteRule: false,
  },
};

export const QUESTION_COUNT_OPTIONS = [10, 20, 30, 50] as const;

/**
 * Hook v2 du jeu "Je n'ai jamais" avec toutes les nouvelles fonctionnalités
 */
export const useNeverHaveIEverGameV2 = (): UseNeverHaveIEverGameV2 => {
  // Configuration
  const [config, setConfig] = useState<NheGameConfig>(DEFAULT_CONFIG);

  // Questions personnalisées
  const [customQuestions, setCustomQuestions] = useState<NheQuestion[]>([]);

  // État du jeu
  const [questions, setQuestions] = useState<NheQuestion[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(
    new Set()
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [history, setHistory] = useState<NheHistoryEntry[]>([]);

  // Question actuelle
  const currentQuestion = questions[currentQuestionIndex] || null;

  /**
   * Toggle un mode
   */
  const toggleMode = useCallback((mode: NheMode) => {
    setConfig((prev) => {
      const newModes = prev.selectedModes.includes(mode)
        ? prev.selectedModes.filter((m) => m !== mode)
        : [...prev.selectedModes, mode];

      // Au moins un mode doit être sélectionné
      if (newModes.length === 0) return prev;

      return { ...prev, selectedModes: newModes };
    });
  }, []);

  /**
   * Toggle un thème
   */
  const toggleTheme = useCallback((theme: NheTheme) => {
    setConfig((prev) => ({
      ...prev,
      selectedThemes: prev.selectedThemes.includes(theme)
        ? prev.selectedThemes.filter((t) => t !== theme)
        : [...prev.selectedThemes, theme],
    }));
  }, []);

  /**
   * Définir le nombre de questions
   */
  const setQuestionCount = useCallback((count: number) => {
    setConfig((prev) => ({ ...prev, questionCount: count }));
  }, []);

  /**
   * Toggle une règle spéciale
   */
  const toggleSpecialRule = useCallback((rule: keyof NheSpecialRules) => {
    setConfig((prev) => ({
      ...prev,
      specialRules: {
        ...prev.specialRules,
        [rule]: !prev.specialRules[rule],
      },
    }));
  }, []);

  /**
   * Ajouter une question personnalisée
   */
  const addCustomQuestion = useCallback(
    (text: string, mode: NheMode, sips: number) => {
      const newQuestion: NheQuestion = {
        id: `custom-${Date.now()}-${Math.random()}`,
        text,
        mode,
        sips,
        points: sips,
        isCustom: true,
      };
      setCustomQuestions((prev) => [...prev, newQuestion]);
    },
    []
  );

  /**
   * Supprimer une question personnalisée
   */
  const removeCustomQuestion = useCallback((id: string) => {
    setCustomQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  /**
   * Démarre le jeu
   */
  const startGame = useCallback(
    (gamePlayers: Player[]) => {
      // Récupérer les questions des modes sélectionnés
      let allQuestions = getQuestionsByModes(config.selectedModes);

      // Filtrer par thèmes si des thèmes sont sélectionnés
      if (config.selectedThemes.length > 0) {
        allQuestions = allQuestions.filter(
          (q) => q.theme && config.selectedThemes.includes(q.theme)
        );
      }

      // Ajouter les questions personnalisées
      allQuestions = [...allQuestions, ...customQuestions];

      // Exclure les questions déjà utilisées (si rejeu)
      allQuestions = allQuestions.filter((q) => !usedQuestionIds.has(q.id));

      // Mélanger et tronquer
      const shuffled = shuffleQuestions(allQuestions);
      const finalQuestions = shuffled.slice(
        0,
        Math.min(config.questionCount, shuffled.length)
      );

      setQuestions(finalQuestions);
      setPlayers(gamePlayers.map((p) => ({ ...p, score: 0 })));
      setCurrentQuestionIndex(0);
      setCurrentChallenge(null);
      setIsGameStarted(true);
      setIsGameFinished(false);
      setHistory([]);
    },
    [config, customQuestions, usedQuestionIds]
  );

  /**
   * Soumet les réponses avec gestion des règles spéciales
   */
  const submitAnswers = useCallback(
    (playerIds: string[], mutedPlayerIds: string[] = []) => {
      if (!currentQuestion) return;

      const { specialRules } = config;
      let sipsPerPlayer = currentQuestion.sips;
      let specialRuleTriggered: string | undefined;

      // Règle Mute : joueurs qui refusent de répondre
      // const mutedPlayers = mutedPlayerIds.map((id) => ({ id, muted: true }));
      const mutedSips = specialRules.muteRule ? 2 : 0;

      // Joueurs qui ont répondu "oui"
      const respondingPlayers = playerIds.filter(
        (id) => !mutedPlayerIds.includes(id)
      );

      // Règle Double Shot : si tous sauf un boivent, le survivant boit 2 fois
      if (
        specialRules.doubleShot &&
        respondingPlayers.length === players.length - 1
      ) {
        const survivor = players.find(
          (p) =>
            !respondingPlayers.includes(p.id) && !mutedPlayerIds.includes(p.id)
        );
        if (survivor) {
          respondingPlayers.push(survivor.id);
          sipsPerPlayer = 2;
          specialRuleTriggered = "Double Shot";
        }
      }

      // Mettre à jour les scores
      setPlayers((prev) =>
        prev.map((player) => {
          const isMuted = mutedPlayerIds.includes(player.id);
          const hasResponded = respondingPlayers.includes(player.id);

          if (isMuted) {
            return { ...player, score: player.score + mutedSips };
          } else if (hasResponded) {
            return { ...player, score: player.score + sipsPerPlayer };
          }
          return player;
        })
      );

      // Ajouter à l'historique
      setHistory((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          questionText: currentQuestion.text,
          playerIds: [...respondingPlayers, ...mutedPlayerIds],
          sipsPerPlayer,
          timestamp: Date.now(),
          specialRuleTriggered,
        },
      ]);

      // Marquer la question comme utilisée
      setUsedQuestionIds((prev) => new Set([...prev, currentQuestion.id]));
    },
    [currentQuestion, config, players]
  );

  /**
   * Passe à la question suivante
   */
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentChallenge(null);
    } else {
      // Fin de partie
      setIsGameFinished(true);

      // Enregistrer les stats
      const winner = [...players].sort((a, b) => b.score - a.score)[0];
      if (winner) {
        recordGamePlayed(winner.id, config.selectedModes);
      }
    }
  }, [currentQuestionIndex, questions.length, config, players]);

  /**
   * Redémarre une nouvelle partie avec les mêmes joueurs
   */
  const restartGame = useCallback(() => {
    startGame(players);
  }, [players, startGame]);

  /**
   * Rejoue avec exactement les mêmes paramètres
   */
  const replayWithSameSettings = useCallback(() => {
    startGame(players);
  }, [players, startGame]);

  /**
   * Réinitialise complètement le jeu
   */
  const resetGame = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setCustomQuestions([]);
    setQuestions([]);
    setUsedQuestionIds(new Set());
    setCurrentQuestionIndex(0);
    setCurrentChallenge(null);
    setIsGameStarted(false);
    setIsGameFinished(false);
    setPlayers([]);
    setHistory([]);
  }, []);

  return {
    config,
    currentQuestionIndex,
    currentQuestion,
    currentChallenge,
    questions,
    isGameStarted,
    isGameFinished,
    players,
    history,
    customQuestions,
    toggleMode,
    toggleTheme,
    setQuestionCount,
    toggleSpecialRule,
    addCustomQuestion,
    removeCustomQuestion,
    startGame,
    submitAnswers,
    nextQuestion,
    restartGame,
    replayWithSameSettings,
    resetGame,
  };
};
