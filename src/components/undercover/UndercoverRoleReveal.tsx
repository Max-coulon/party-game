import React, { useState } from "react";
import { UndercoverPlayer } from "@/types";

interface UndercoverRoleRevealProps {
  player: UndercoverPlayer;
  playerIndex: number;
  totalPlayers: number;
  onConfirm: () => void;
}

/**
 * Écran de révélation de rôle pass-and-play
 */
export const UndercoverRoleReveal: React.FC<UndercoverRoleRevealProps> = ({
  player,
  playerIndex,
  totalPlayers,
  onConfirm,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const handleReveal = () => {
    // Petite vibration si disponible
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setIsRevealed(true);
  };

  const handleConfirm = () => {
    setHasConfirmed(true);
    // Reset pour le prochain joueur
    setTimeout(() => {
      setIsRevealed(false);
      setHasConfirmed(false);
      onConfirm();
    }, 300);
  };

  // Écran "Passe le téléphone"
  if (hasConfirmed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center space-y-6">
          <span className="text-8xl block animate-bounce-slow">📱</span>
          <h2 className="text-3xl font-bold text-white">
            Passe le téléphone !
          </h2>
          <p className="text-dark-400 text-lg">
            Au joueur suivant...
          </p>
        </div>
      </div>
    );
  }

  // Écran principal
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progression */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalPlayers }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i < playerIndex
                ? "bg-green-500"
                : i === playerIndex
                ? "bg-primary-500 scale-125"
                : "bg-dark-600"
            }`}
          />
        ))}
      </div>

      {/* Info joueur */}
      <div className="text-center space-y-2 py-4">
        <p className="text-dark-400">Joueur {playerIndex + 1} / {totalPlayers}</p>
        <h2 className="text-3xl font-bold text-white">{player.name}</h2>
      </div>

      {/* Zone de révélation */}
      {!isRevealed ? (
        // Bouton pour révéler
        <div className="flex flex-col items-center justify-center py-12 animate-scale-in">
          <div className="relative">
            {/* Animation pulse - derrière le bouton */}
            <div className="absolute inset-0 rounded-full bg-primary-500/30 animate-ping pointer-events-none" />
            
            <button
              onClick={handleReveal}
              type="button"
              className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 hover:from-primary-400 hover:to-primary-600 text-white font-bold text-xl shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex flex-col items-center justify-center gap-3 border-4 border-primary-400/30"
            >
              <span className="text-5xl">👁️</span>
              <span>Voir mon rôle</span>
            </button>
          </div>

          <p className="text-dark-500 text-sm mt-6 text-center max-w-xs">
            ⚠️ Assure-toi que personne ne regarde ton écran
          </p>
        </div>
      ) : (
        // Affichage du mot (sans révéler le rôle)
        <div className="space-y-6 animate-scale-in">
          {/* Carte du mot */}
          <div
            className={`relative p-6 rounded-3xl border-2 shadow-2xl ${
              player.word
                ? "bg-gradient-to-br from-primary-900/80 to-primary-950/80 border-primary-500/50"
                : "bg-gradient-to-br from-purple-900/80 to-purple-950/80 border-purple-500/50"
            }`}
          >
            {/* Icône */}
            <div className="text-center mb-6">
              <span className="text-6xl block mb-3">
                {player.word ? "🎯" : "👻"}
              </span>
              <h3 className="text-2xl font-bold text-primary-400">
                {player.word ? "TON MOT" : "MR WHITE"}
              </h3>
            </div>

            {/* Mot ou message */}
            <div className="text-center py-4 px-6 bg-black/30 rounded-2xl">
              {player.word ? (
                <>
                  <p className="text-dark-400 text-sm mb-2">Mémorise bien :</p>
                  <p className="text-4xl font-bold text-white">
                    {player.word}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-purple-300 text-lg">
                    Tu n'as pas de mot ! 🤫
                  </p>
                  <p className="text-dark-400 text-sm mt-2">
                    Écoute les autres et essaie de deviner...
                  </p>
                </>
              )}
            </div>

            {/* Instructions génériques */}
            <div className="mt-6 p-4 bg-black/20 rounded-xl">
              <p className="text-dark-300 text-sm text-center">
                {player.word ? (
                  <>
                    🎭 Décris ton mot de façon subtile.
                    <br />
                    Pas trop précis, pas trop vague !
                  </>
                ) : (
                  <>
                    👻 Passe inaperçu jusqu'à la fin !
                    <br />
                    Si tu es éliminé, devine le mot pour gagner.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Bouton confirmer */}
          <button
            onClick={handleConfirm}
            className="w-full py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3"
          >
            <span className="text-2xl">✓</span>
            <span>J'ai mémorisé</span>
          </button>

          <p className="text-dark-500 text-xs text-center">
            Ton rôle disparaîtra après confirmation
          </p>
        </div>
      )}
    </div>
  );
};
