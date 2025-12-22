import { useState, useCallback, useRef, useEffect, useSyncExternalStore } from "react";
import { FingerToken, FingerChooserStatus } from "@/types";

/**
 * Palette de couleurs pour les doigts
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

const COUNTDOWN_DURATION = 5;
const MAX_FINGERS = 10;

/**
 * Interface de retour du hook useFingerChooser
 */
interface UseFingerChooser {
  status: FingerChooserStatus;
  activeFingers: Map<number, FingerToken>;
  timeLeft: number;
  winnerPointerId: number | null;
  winnerFinger: FingerToken | null;
  handlePointerDown: (e: PointerEvent) => void;
  handlePointerMove: (e: PointerEvent) => void;
  handlePointerUp: (e: PointerEvent) => void;
  reset: () => void;
}

/**
 * Store externe pour les positions des doigts (évite les re-renders React)
 */
class FingerStore {
  private fingers = new Map<number, FingerToken>();
  private listeners = new Set<() => void>();
  private colorIndex = 0;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.fingers;

  private notify = () => {
    this.listeners.forEach((l) => l());
  };

  getNextColor = (): string => {
    const color = FINGER_COLORS[this.colorIndex % FINGER_COLORS.length];
    this.colorIndex++;
    return color;
  };

  addFinger = (pointerId: number, x: number, y: number): boolean => {
    if (this.fingers.size >= MAX_FINGERS) return false;
    if (this.fingers.has(pointerId)) return false;

    const newMap = new Map(this.fingers);
    newMap.set(pointerId, {
      pointerId,
      x,
      y,
      color: this.getNextColor(),
      startedAt: Date.now(),
    });
    this.fingers = newMap;
    this.notify();
    return true;
  };

  updateFinger = (pointerId: number, x: number, y: number) => {
    const finger = this.fingers.get(pointerId);
    if (!finger) return;

    // Mise à jour directe sans créer de nouvelle Map si position identique
    if (finger.x === x && finger.y === y) return;

    const newMap = new Map(this.fingers);
    newMap.set(pointerId, { ...finger, x, y });
    this.fingers = newMap;
    this.notify();
  };

  removeFinger = (pointerId: number) => {
    if (!this.fingers.has(pointerId)) return;

    const newMap = new Map(this.fingers);
    newMap.delete(pointerId);
    this.fingers = newMap;
    this.notify();
  };

  clear = () => {
    this.fingers = new Map();
    this.colorIndex = 0;
    this.notify();
  };

  get size() {
    return this.fingers.size;
  }
}

/**
 * Hook personnalisé optimisé pour le jeu Finger Chooser
 */
export const useFingerChooser = (): UseFingerChooser => {
  const [status, setStatus] = useState<FingerChooserStatus>("waiting");
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_DURATION);
  const [winnerPointerId, setWinnerPointerId] = useState<number | null>(null);

  // Store externe pour les doigts (optimisation)
  const storeRef = useRef<FingerStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = new FingerStore();
  }
  const store = storeRef.current;

  // Sync avec le store externe
  const activeFingers = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );

  // Refs pour accès synchrone dans les handlers
  const statusRef = useRef(status);
  const winnerRef = useRef(winnerPointerId);
  statusRef.current = status;
  winnerRef.current = winnerPointerId;

  // Ref pour l'interval
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Démarre le décompte
   */
  const startCountdown = useCallback(() => {
    if (countdownRef.current) return;

    setStatus("countdown");
    setTimeLeft(COUNTDOWN_DURATION);

    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
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
   * Arrête le décompte
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
   * Choisit un gagnant
   */
  const chooseWinner = useCallback(() => {
    const fingerIds = Array.from(activeFingers.keys());
    if (fingerIds.length === 0) return;

    const randomIndex = Math.floor(Math.random() * fingerIds.length);
    const winnerId = fingerIds[randomIndex];

    setWinnerPointerId(winnerId);
    setStatus("chosen");
  }, [activeFingers]);

  // Effet pour gérer la fin du décompte
  useEffect(() => {
    if (status === "countdown" && timeLeft === 0) {
      chooseWinner();
    }
  }, [status, timeLeft, chooseWinner]);

  // Effet pour gérer le nombre de doigts
  useEffect(() => {
    if (status === "chosen") return;

    const fingerCount = activeFingers.size;

    if (fingerCount >= 2 && status === "waiting") {
      startCountdown();
    } else if (fingerCount < 2 && status === "countdown") {
      stopCountdown();
    }
  }, [activeFingers.size, status, startCountdown, stopCountdown]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  /**
   * Handler pointerdown - optimisé, pas de dépendance React
   */
  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (statusRef.current === "chosen") return;

    const { pointerId, clientX, clientY } = e;
    store.addFinger(pointerId, clientX, clientY);
  }, [store]);

  /**
   * Handler pointermove - optimisé avec RAF
   */
  const rafRef = useRef<Map<number, number>>(new Map());
  
  const handlePointerMove = useCallback((e: PointerEvent) => {
    const { pointerId, clientX, clientY } = e;

    // Annuler le RAF précédent pour ce pointer
    const existingRaf = rafRef.current.get(pointerId);
    if (existingRaf) {
      cancelAnimationFrame(existingRaf);
    }

    // Programmer la mise à jour sur le prochain frame
    const rafId = requestAnimationFrame(() => {
      store.updateFinger(pointerId, clientX, clientY);
      rafRef.current.delete(pointerId);
    });
    rafRef.current.set(pointerId, rafId);
  }, [store]);

  /**
   * Handler pointerup
   */
  const handlePointerUp = useCallback((e: PointerEvent) => {
    const { pointerId } = e;

    // Annuler tout RAF en attente
    const existingRaf = rafRef.current.get(pointerId);
    if (existingRaf) {
      cancelAnimationFrame(existingRaf);
      rafRef.current.delete(pointerId);
    }

    // Ne pas retirer le gagnant
    if (statusRef.current === "chosen" && pointerId === winnerRef.current) {
      return;
    }

    store.removeFinger(pointerId);
  }, [store]);

  /**
   * Reset
   */
  const reset = useCallback(() => {
    stopCountdown();
    store.clear();
    setWinnerPointerId(null);
    setStatus("waiting");
  }, [stopCountdown, store]);

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
    reset,
  };
};
