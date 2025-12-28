import React, { useRef, useEffect, useState } from "react";
import { useFingerChooser } from "@/hooks/useFingerChooser";
import { FingerToken } from "./FingerToken";
import { CountdownDisplay } from "./CountdownDisplay";

interface FingerChooserGameProps {
  onBack: () => void;
}

const HEADER_HEIGHT = 56; // Hauteur du bandeau en pixels

type GameMode = "simple" | "tournament";
type TournamentPhase = "setup" | "round1" | "round2" | "final" | "winner";

/**
 * Composant principal du jeu Finger Chooser
 * Gère la zone de jeu multi-touch en plein écran
 */
export const FingerChooserGame: React.FC<FingerChooserGameProps> = ({
  onBack,
}) => {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  
  // Mode de jeu
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  
  // État du tournoi
  const [tournamentPhase, setTournamentPhase] = useState<TournamentPhase>("setup");
  const [finalists, setFinalists] = useState<string[]>([]);
  const [tournamentWinner, setTournamentWinner] = useState<string | null>(null);

  const {
    status,
    activeFingers,
    timeLeft,
    winnerPointerId,
    winnerFinger,
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
    if (!gameArea) {
      console.error("[FingerChooser] gameAreaRef is null!");
      return;
    }
    console.log("[FingerChooser] Attaching event listeners to gameArea", gameArea);

    gameArea.addEventListener("pointerdown", handlePointerDown);
    gameArea.addEventListener("pointermove", handlePointerMove);
    gameArea.addEventListener("pointerup", handlePointerUp);
    gameArea.addEventListener("pointercancel", handlePointerUp);
    // Note: on n'utilise PAS pointerleave car il peut être déclenché 
    // incorrectement lors de multi-touch sur certains appareils

    return () => {
      gameArea.removeEventListener("pointerdown", handlePointerDown);
      gameArea.removeEventListener("pointermove", handlePointerMove);
      gameArea.removeEventListener("pointerup", handlePointerUp);
      gameArea.removeEventListener("pointercancel", handlePointerUp);
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

  // Gestion du tournoi - passer à la phase suivante
  const handleTournamentNext = () => {
    if (!winnerFinger) return;
    
    if (tournamentPhase === "round1") {
      setFinalists([`Groupe 1: ${winnerFinger.color}`]);
      setTournamentPhase("round2");
      reset();
    } else if (tournamentPhase === "round2") {
      setFinalists(prev => [...prev, `Groupe 2: ${winnerFinger.color}`]);
      setTournamentPhase("final");
      reset();
    } else if (tournamentPhase === "final") {
      setTournamentWinner(winnerFinger.color);
      setTournamentPhase("winner");
    }
  };

  const resetTournament = () => {
    setTournamentPhase("setup");
    setFinalists([]);
    setTournamentWinner(null);
    setGameMode(null);
    reset();
  };

  const getPhaseTitle = () => {
    switch (tournamentPhase) {
      case "round1": return "🏆 Tournoi - Groupe 1 (joueurs 1-5)";
      case "round2": return "🏆 Tournoi - Groupe 2 (joueurs 6-10)";
      case "final": return "🏆 FINALE - Les 2 qualifiés !";
      default: return "Finger Chooser";
    }
  };

  // Écran de sélection du mode
  if (gameMode === null) {
    return (
      <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
        <header 
          className="flex-shrink-0 flex items-center px-4 bg-dark-900/95 border-b border-dark-700 z-50"
          style={{ height: HEADER_HEIGHT }}
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 text-white font-medium active:scale-95 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Retour</span>
          </button>
          <h1 className="ml-4 text-lg font-semibold text-white">Finger Chooser</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
            Choisir le mode
          </h2>
          
          <button
            onClick={() => setGameMode("simple")}
            className="w-full max-w-sm p-6 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <div className="text-4xl mb-2">👆</div>
            <div className="text-xl font-bold">Mode Simple</div>
            <div className="text-primary-200 text-sm mt-1">2-5 joueurs (limite écran)</div>
          </button>

          <button
            onClick={() => { setGameMode("tournament"); setTournamentPhase("round1"); }}
            className="w-full max-w-sm p-6 rounded-2xl bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-xl font-bold">Mode Tournoi</div>
            <div className="text-yellow-200 text-sm mt-1">6-10 joueurs (2 groupes + finale)</div>
          </button>

          <p className="text-dark-400 text-center text-sm mt-4 max-w-sm">
            💡 L'iPhone limite à 5 doigts simultanés.<br/>
            Le mode Tournoi permet de jouer à 10 !
          </p>
        </div>
      </div>
    );
  }

  // Écran du gagnant final du tournoi
  if (gameMode === "tournament" && tournamentPhase === "winner") {
    return (
      <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
          <div className="text-8xl animate-bounce">🏆</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
            Vainqueur du Tournoi !
          </h2>
          <div 
            className="w-32 h-32 rounded-full shadow-2xl animate-pulse"
            style={{ 
              backgroundColor: tournamentWinner || "#fff",
              boxShadow: `0 0 60px 20px ${tournamentWinner}80`
            }}
          />
          <button
            onClick={resetTournament}
            className="mt-8 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-xl font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            🔄 Nouveau tournoi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {/* Bandeau de retour - HORS zone de jeu */}
      <header 
        className="flex-shrink-0 flex items-center px-4 bg-dark-900/95 border-b border-dark-700 z-50"
        style={{ height: HEADER_HEIGHT }}
      >
        <button
          onClick={gameMode === "tournament" ? resetTournament : onBack}
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
        <h1 className="ml-4 text-lg font-semibold text-white">
          {gameMode === "tournament" ? getPhaseTitle() : "Finger Chooser"}
        </h1>
      </header>

      {/* Indicateur des finalistes (mode tournoi) */}
      {gameMode === "tournament" && finalists.length > 0 && tournamentPhase !== "final" && (
        <div className="bg-yellow-600/20 border-b border-yellow-600/50 px-4 py-2 flex items-center justify-center gap-4">
          <span className="text-yellow-300 text-sm font-medium">
            🏅 Qualifiés: {finalists.length}/2
          </span>
          {finalists.map((f, i) => (
            <div key={i} className="flex items-center gap-1">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: f.split(": ")[1] }}
              />
              <span className="text-yellow-200 text-xs">{f.split(": ")[0]}</span>
            </div>
          ))}
        </div>
      )}

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
                {gameMode === "tournament" && tournamentPhase === "round1" && "Groupe 1 - Posez vos doigts !"}
                {gameMode === "tournament" && tournamentPhase === "round2" && "Groupe 2 - Posez vos doigts !"}
                {gameMode === "tournament" && tournamentPhase === "final" && "FINALE - Les 2 qualifiés !"}
                {gameMode === "simple" && "Posez vos doigts !"}
              </h2>
              <p className="text-dark-300 text-lg md:text-xl">
                {gameMode === "tournament" 
                  ? tournamentPhase === "final" 
                    ? "Les 2 qualifiés s'affrontent !" 
                    : "Jusqu'à 5 joueurs par groupe"
                  : "Limite selon votre écran (souvent 5 max)"
                }
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
                {gameMode === "tournament" && tournamentPhase !== "final" 
                  ? "Qualifié pour la finale !" 
                  : gameMode === "tournament" && tournamentPhase === "final"
                    ? "Champion !"
                    : "Tu es choisi !"}
                <span className="text-4xl">🎉</span>
              </span>
            </div>
          </div>
        )}

        {/* Boutons après choix */}
        {status === "chosen" && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-50 pointer-events-none">
            {/* Mode simple : juste recommencer */}
            {gameMode === "simple" && (
              <button
                onClick={reset}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-xl font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fade-in pointer-events-auto"
                style={{ touchAction: "manipulation" }}
              >
                <div className="flex items-center gap-3">
                  <span>🔄</span>
                  <span>Recommencer</span>
                </div>
              </button>
            )}

            {/* Mode tournoi : passer au round suivant */}
            {gameMode === "tournament" && (
              <>
                <button
                  onClick={reset}
                  className="px-6 py-4 bg-dark-700 hover:bg-dark-600 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fade-in pointer-events-auto"
                  style={{ touchAction: "manipulation" }}
                >
                  🔄 Refaire
                </button>
                <button
                  onClick={handleTournamentNext}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white text-xl font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fade-in pointer-events-auto"
                  style={{ touchAction: "manipulation" }}
                >
                  <div className="flex items-center gap-3">
                    <span>➡️</span>
                    <span>
                      {tournamentPhase === "round1" && "Groupe 2"}
                      {tournamentPhase === "round2" && "Finale !"}
                      {tournamentPhase === "final" && "Voir le champion"}
                    </span>
                  </div>
                </button>
              </>
            )}
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
