import React, { useRef, useEffect } from "react";
import { useFingerChooser } from "@/hooks/useFingerChooser";
import { FingerToken } from "./FingerToken";
import { CountdownDisplay } from "./CountdownDisplay";

interface FingerChooserGameProps {
  onBack: () => void;
}

const HEADER_HEIGHT = 56; // Hauteur du bandeau en pixels

/**
 * Composant principal du jeu Finger Chooser
 * Gère la zone de jeu multi-touch en plein écran
 */
export const FingerChooserGame: React.FC<FingerChooserGameProps> = ({
  onBack,
}) => {
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const {
    status,
    activeFingers,
    timeLeft,
    winnerPointerId,
    reset,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useFingerChooser();

  /**
   * Attacher les event listeners natifs pour le multi-touch
   */
  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    gameArea.addEventListener("pointerdown", handlePointerDown);
    gameArea.addEventListener("pointermove", handlePointerMove);
    gameArea.addEventListener("pointerup", handlePointerUp);
    gameArea.addEventListener("pointercancel", handlePointerUp);
    gameArea.addEventListener("pointerleave", handlePointerUp);

    return () => {
      gameArea.removeEventListener("pointerdown", handlePointerDown);
      gameArea.removeEventListener("pointermove", handlePointerMove);
      gameArea.removeEventListener("pointerup", handlePointerUp);
      gameArea.removeEventListener("pointercancel", handlePointerUp);
      gameArea.removeEventListener("pointerleave", handlePointerUp);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  /**
   * Empêcher les comportements par défaut du navigateur
   * (scroll, zoom, gestes) sur la zone de jeu
   */
  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    // Empêcher le scroll/zoom tactile
    gameArea.addEventListener("touchstart", preventDefault, { passive: false });
    gameArea.addEventListener("touchmove", preventDefault, { passive: false });
    gameArea.addEventListener("touchend", preventDefault, { passive: false });

    // Empêcher le menu contextuel (long press)
    gameArea.addEventListener("contextmenu", preventDefault);

    // Empêcher la sélection de texte
    gameArea.addEventListener("selectstart", preventDefault);

    return () => {
      gameArea.removeEventListener("touchstart", preventDefault);
      gameArea.removeEventListener("touchmove", preventDefault);
      gameArea.removeEventListener("touchend", preventDefault);
      gameArea.removeEventListener("contextmenu", preventDefault);
      gameArea.removeEventListener("selectstart", preventDefault);
    };
  }, []);

  const fingerCount = activeFingers.size;

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {/* Bandeau de retour - HORS zone de jeu */}
      <header 
        className="flex-shrink-0 flex items-center px-4 bg-dark-900/95 border-b border-dark-700 z-50"
        style={{ height: HEADER_HEIGHT }}
      >
        <button
          onClick={onBack}
          className="
            flex items-center gap-2
            px-4 py-2 rounded-xl
            bg-dark-800 hover:bg-dark-700
            border border-dark-600
            text-white font-medium
            active:scale-95
            transition-all duration-200
          "
          aria-label="Retour au menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Retour</span>
        </button>
        <h1 className="ml-4 text-lg font-semibold text-white">Finger Chooser</h1>
      </header>

      {/* Zone de jeu - reçoit tous les événements tactiles */}
      <div
        ref={gameAreaRef}
        className="flex-1 relative touch-none select-none overflow-hidden"
        style={{
          touchAction: "none",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      >
        {/* Effet de fond animé */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Instructions (état waiting) */}
        {status === "waiting" && fingerCount === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
            <div className="text-center space-y-4 px-8 animate-fade-in">
              <div className="flex items-center justify-center gap-3">
                <span className="text-6xl md:text-7xl animate-bounce">👆</span>
                <span
                  className="text-6xl md:text-7xl animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                >
                  👆
                </span>
                <span
                  className="text-6xl md:text-7xl animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                >
                  👆
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Posez vos doigts !
              </h2>
              <p className="text-dark-300 text-lg md:text-xl">
                2 à 10 joueurs maximum
              </p>
            </div>
          </div>
        )}

        {/* Indicateur nombre de doigts (état waiting avec doigts) */}
        {status === "waiting" && fingerCount > 0 && fingerCount < 2 && (
          <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none z-20">
            <div className="px-6 py-3 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/50 animate-pulse">
              <span className="text-yellow-300 font-semibold">
                ⚠️ {fingerCount} doigt{fingerCount > 1 ? "s" : ""} - Il en faut au
                moins 2
              </span>
            </div>
          </div>
        )}

        {/* Indicateur countdown actif */}
        {status === "countdown" && (
          <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none z-20">
            <div className="px-6 py-3 bg-primary-500/20 backdrop-blur-sm rounded-full border border-primary-500/50">
              <span className="text-primary-300 font-semibold">
                ✋ {fingerCount} doigt{fingerCount > 1 ? "s" : ""} détecté
                {fingerCount > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}

        {/* Countdown Display */}
        <CountdownDisplay timeLeft={timeLeft} isVisible={status === "countdown"} />

        {/* Message gagnant */}
        {status === "chosen" && (
          <div className="absolute bottom-32 left-0 right-0 flex justify-center pointer-events-none z-40 animate-slide-up">
            <div className="px-8 py-4 bg-gradient-to-r from-green-600/90 to-green-500/90 backdrop-blur-sm rounded-2xl shadow-2xl shadow-green-500/30">
              <span className="text-white text-2xl md:text-3xl font-bold flex items-center gap-3">
                <span className="text-4xl">🎉</span>
                Tu es choisi !
                <span className="text-4xl">🎉</span>
              </span>
            </div>
          </div>
        )}

        {/* Bouton Recommencer (après choix) */}
        {status === "chosen" && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
            <button
              onClick={reset}
              className="
                px-8 py-4
                bg-gradient-to-r from-primary-600 to-primary-700
                hover:from-primary-700 hover:to-primary-800
                active:from-primary-800 active:to-primary-900
                text-white text-xl font-bold
                rounded-2xl
                shadow-lg shadow-primary-500/30
                transition-all duration-300
                transform hover:scale-105 active:scale-95
                animate-fade-in
                pointer-events-auto
              "
              style={{ touchAction: "manipulation" }}
              aria-label="Recommencer le tirage"
            >
              <div className="flex items-center gap-3">
                <span>🔄</span>
                <span>Recommencer</span>
              </div>
            </button>
          </div>
        )}

        {/* Rendu des tokens de doigts */}
        {Array.from(activeFingers.values()).map((finger) => (
          <FingerToken
            key={finger.pointerId}
            finger={finger}
            isWinner={finger.pointerId === winnerPointerId}
            isChosen={status === "chosen"}
            headerOffset={HEADER_HEIGHT}
          />
        ))}
      </div>
    </div>
  );
};
