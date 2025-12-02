import { useState, useCallback } from "react";
import { NheMode, NheQuestion, Player } from "@/types";
import {
  getQuestionsByModes,
  shuffleQuestions,
} from "@/data/neverHaveIEverQuestions";

/**
 * Interface de retour du hook
 */
interface UseNeverHaveIEverGame {
  // État du jeu
  selectedModes: NheMode[];
  questionCount: number; // Nombre de questions sélectionné
  currentQuestionIndex: number;
  currentQuestion: NheQuestion | null;
  questions: NheQuestion[];
  isGameStarted: boolean;
  isGameFinished: boolean;
  players: Player[];

  // Actions
  toggleMode: (mode: NheMode) => void;
  setQuestionCount: (count: number) => void; // Nouvelle action
  startGame: (gamePlayers: Player[]) => void;
  submitAnswers: (playerIds: string[]) => void;
  nextQuestion: () => void;
  restartGame: () => void;
  resetGame: () => void;
}

/**
 * Configuration des options de nombre de questions
 * Centralisation pour faciliter les modifications futures
 */
export const QUESTION_COUNT_OPTIONS = [10, 20, 30, 50] as const;
export const DEFAULT_QUESTION_COUNT = 20;

/**
 * Hook personnalisé pour gérer la logique du jeu "Je n'ai jamais"
 *
 * Ce hook centralise toute la logique métier :
 * - Sélection des modes (soft/hot/hardcore)
 * - Choix du nombre de questions
 * - Filtrage et mélange des questions
 * - Gestion de la progression
 * - Calcul des scores
 *
 * Architecture extensible : facile à brancher sur une API en remplaçant
 * getQuestionsByModes() par un appel fetch()
 */
export const useNeverHaveIEverGame = (): UseNeverHaveIEverGame => {
  // État des modes sélectionnés
  const [selectedModes, setSelectedModes] = useState<NheMode[]>(["soft"]);

  // État du nombre de questions souhaité
  const [questionCount, setQuestionCount] = useState<number>(
    DEFAULT_QUESTION_COUNT
  );

  // État du jeu
  const [questions, setQuestions] = useState<NheQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  // État des joueurs (copie locale pour gérer les scores pendant la partie)
  const [players, setPlayers] = useState<Player[]>([]);

  /**
   * Question actuelle
   */
  const currentQuestion = questions[currentQuestionIndex] || null;

  /**
   * Toggle un mode (ajoute ou retire)
   */
  const toggleMode = useCallback((mode: NheMode) => {
    setSelectedModes((prev) => {
      if (prev.includes(mode)) {
        // Ne pas permettre de tout désélectionner
        if (prev.length === 1) return prev;
        return prev.filter((m) => m !== mode);
      } else {
        return [...prev, mode];
      }
    });
  }, []);

  /**
   * Démarre le jeu avec les joueurs fournis
   *
   * Processus :
   * 1. Récupère les questions selon les modes sélectionnés
   * 2. Mélange aléatoirement les questions (algorithme Fisher-Yates)
   * 3. Tronque la liste au nombre de questions demandé
   * 4. Initialise l'état du jeu
   *
   * Note : Pour brancher sur une API, remplacer getQuestionsByModes()
   * par un appel fetch, par exemple :
   * const response = await fetch(`/api/questions?modes=${selectedModes.join(',')}`);
   * const allQuestions = await response.json();
   */
  const startGame = useCallback(
    (gamePlayers: Player[]) => {
      // Étape 1 : Récupérer les questions des modes sélectionnés
      // Plus tard : remplacer par un appel API
      const filteredQuestions = getQuestionsByModes(selectedModes);

      // Étape 2 : Mélanger les questions pour plus de variété
      // Chaque partie sera différente grâce à l'aléatoire
      const shuffled = shuffleQuestions(filteredQuestions);

      // Étape 3 : Tronquer au nombre de questions demandé
      // Si questionCount est supérieur au nombre disponible, on prend tout
      const finalQuestions = shuffled.slice(
        0,
        Math.min(questionCount, shuffled.length)
      );

      // Étape 4 : Initialiser l'état du jeu
      setQuestions(finalQuestions);
      setPlayers(gamePlayers.map((p) => ({ ...p, score: 0 }))); // Reset scores
      setCurrentQuestionIndex(0);
      setIsGameStarted(true);
      setIsGameFinished(false);
    },
    [selectedModes, questionCount]
  );

  /**
   * Soumet les réponses des joueurs pour la question actuelle
   * @param playerIds IDs des joueurs qui "ont déjà fait" l'action
   */
  const submitAnswers = useCallback(
    (playerIds: string[]) => {
      if (!currentQuestion) return;

      // Ajouter les points aux joueurs qui ont répondu "oui"
      setPlayers((prev) =>
        prev.map((player) => {
          if (playerIds.includes(player.id)) {
            return {
              ...player,
              score: player.score + currentQuestion.points,
            };
          }
          return player;
        })
      );
    },
    [currentQuestion]
  );

  /**
   * Passe à la question suivante
   */
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Fin du jeu
      setIsGameFinished(true);
    }
  }, [currentQuestionIndex, questions.length]);

  /**
   * Redémarre le jeu avec les mêmes paramètres
   */
  const restartGame = useCallback(() => {
    setCurrentQuestionIndex(0);
    setIsGameFinished(false);
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));

    // Remélanger les questions
    const shuffled = shuffleQuestions(questions);
    setQuestions(shuffled);
  }, [questions]);

  /**
   * Reset complet du jeu (retour à la sélection des modes)
   */
  const resetGame = useCallback(() => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setIsGameStarted(false);
    setIsGameFinished(false);
    setPlayers([]);
    setSelectedModes(["soft"]);
    setQuestionCount(DEFAULT_QUESTION_COUNT);
  }, []);

  return {
    // État
    selectedModes,
    questionCount,
    currentQuestionIndex,
    currentQuestion,
    questions,
    isGameStarted,
    isGameFinished,
    players,

    // Actions
    toggleMode,
    setQuestionCount,
    startGame,
    submitAnswers,
    nextQuestion,
    restartGame,
    resetGame,
  };
};
