import { useState, useCallback, useRef, useEffect } from "react";
import { FingerToken, FingerChooserStatus } from "@/types";

/**
 * Palette de couleurs pour les doigts
 * Couleurs vives et distinctes pour différencier chaque joueur
 */
const FINGER_COLORS = [
  "#ef4444", // Rouge
  "#3b82f6", // Bleu
  "#22c55e", // Vert
  "#f59e0b", // Orange
  "#8b5cf6", // Violet
  "#ec4899", // Rose
  "#14b8a6", // Teal
  "#f97316", // Orange foncé
  "#6366f1", // Indigo
  "#84cc16", // Lime
];

/**
 * Durée du décompte en secondes
 */
const COUNTDOWN_DURATION = 5;

/**
 * Interface de retour du hook useFingerChooser
 */
interface UseFingerChooser {
  // État
  status: FingerChooserStatus;
  activeFingers: Map<number, FingerToken>;
  timeLeft: number;
  winnerPointerId: number | null;
  winnerFinger: FingerToken | null;

  // Handlers pour les événements pointer
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  handlePointerCancel: (e: React.PointerEvent) => void;

  // Actions
  reset: () => void;
}

/**
 * Hook personnalisé pour gérer la logique du jeu Finger Chooser
 *
 * Gère :
 * - Le suivi multi-touch via Pointer Events
 * - Le décompte automatique quand >= 2 doigts
 * - Le tirage aléatoire du gagnant
 * - Le reset du jeu
 */
export const useFingerChooser = (): UseFingerChooser => {
  const [status, setStatus] = useState<FingerChooserStatus>("waiting");
  const [activeFingers, setActiveFingers] = useState<Map<number, FingerToken>>(
    new Map()
  );
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_DURATION);
  const [winnerPointerId, setWinnerPointerId] = useState<number | null>(null);

  // Ref pour l'interval du countdown
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Ref pour les couleurs assignées (persistant)
  const colorIndexRef = useRef(0);

  /**
   * Obtient une couleur pour un nouveau doigt
   */
  const getNextColor = useCallback((): string => {
    const color = FINGER_COLORS[colorIndexRef.current % FINGER_COLORS.length];
    colorIndexRef.current++;
    return color;
  }, []);

  /**
   * Démarre le décompte
   */
  const startCountdown = useCallback(() => {
    if (countdownRef.current) return; // Déjà en cours

    setStatus("countdown");
    setTimeLeft(COUNTDOWN_DURATION);

    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Fin du décompte
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  /**
   * Arrête le décompte et reset
   */
  const stopCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setStatus("waiting");
    setTimeLeft(COUNTDOWN_DURATION);
  }, []);

  /**
   * Choisit un gagnant aléatoirement parmi les doigts actifs
   */
  const chooseWinner = useCallback(() => {
    setActiveFingers((currentFingers) => {
      const fingerIds = Array.from(currentFingers.keys());
      if (fingerIds.length === 0) return currentFingers;

      const randomIndex = Math.floor(Math.random() * fingerIds.length);
      const winnerId = fingerIds[randomIndex];

      setWinnerPointerId(winnerId);
      setStatus("chosen");

      return currentFingers;
    });
  }, []);

  /**
   * Effet pour gérer la fin du décompte
   */
  useEffect(() => {
    if (status === "countdown" && timeLeft === 0) {
      chooseWinner();
    }
  }, [status, timeLeft, chooseWinner]);

  /**
   * Effet pour gérer le nombre de doigts actifs
   */
  useEffect(() => {
    // Ne rien faire si déjà choisi
    if (status === "chosen") return;

    const fingerCount = activeFingers.size;

    if (fingerCount >= 2 && status === "waiting") {
      startCountdown();
    } else if (fingerCount < 2 && status === "countdown") {
      stopCountdown();
    }
  }, [activeFingers.size, status, startCountdown, stopCountdown]);

  /**
   * Cleanup à la destruction du composant
   */
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  /**
   * Handler pour pointerdown
   */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Ignorer les nouveaux doigts si le gagnant est déjà choisi
      if (status === "chosen") return;

      const { pointerId, clientX, clientY } = e;

      // Capture le pointer pour un suivi fiable
      (e.target as HTMLElement).setPointerCapture(pointerId);

      setActiveFingers((prev) => {
        const newMap = new Map(prev);
        newMap.set(pointerId, {
          pointerId,
          x: clientX,
          y: clientY,
          color: getNextColor(),
          startedAt: Date.now(),
        });
        return newMap;
      });
    },
    [status, getNextColor]
  );

  /**
   * Handler pour pointermove
   */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const { pointerId, clientX, clientY } = e;

      setActiveFingers((prev) => {
        if (!prev.has(pointerId)) return prev;

        const newMap = new Map(prev);
        const finger = newMap.get(pointerId)!;
        newMap.set(pointerId, {
          ...finger,
          x: clientX,
          y: clientY,
        });
        return newMap;
      });
    },
    []
  );

  /**
   * Handler pour pointerup et pointercancel
   */
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const { pointerId } = e;

      // Relâche la capture
      try {
        (e.target as HTMLElement).releasePointerCapture(pointerId);
      } catch {
        // Ignore si déjà relâché
      }

      // Ne pas retirer le doigt gagnant après le choix
      if (status === "chosen" && pointerId === winnerPointerId) {
        return;
      }

      setActiveFingers((prev) => {
        const newMap = new Map(prev);
        newMap.delete(pointerId);
        return newMap;
      });
    },
    [status, winnerPointerId]
  );

  /**
   * Reset complet du jeu
   */
  const reset = useCallback(() => {
    stopCountdown();
    setActiveFingers(new Map());
    setWinnerPointerId(null);
    setStatus("waiting");
    colorIndexRef.current = 0;
  }, [stopCountdown]);

  /**
   * Récupère le finger gagnant
   */
  const winnerFinger =
    winnerPointerId !== null ? activeFingers.get(winnerPointerId) ?? null : null;

  return {
    status,
    activeFingers,
    timeLeft,
    winnerPointerId,
    winnerFinger,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel: handlePointerUp, // Même comportement
    reset,
  };
};
