import React, { useState } from "react";
import { UndercoverPlayer } from "@/types";

interface UndercoverGroupVoteProps {
  players: UndercoverPlayer[];
  currentRound: number;
  onEliminate: (targetId: string) => void;
}

/**
 * Écran de vote de groupe - On choisit directement qui éliminer
 */
export const UndercoverGroupVote: React.FC<UndercoverGroupVoteProps> = ({
  players,
  currentRound,
  onEliminate,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Joueurs vivants (candidats à l'élimination)
  const candidates = players.filter((p) => !p.isEliminated);

  const handleSelectPlayer = (playerId: string) => {
    setSelectedTarget(playerId);
    setShowConfirm(true);
  };

  const handleConfirmElimination = () => {
    if (selectedTarget) {
      onEliminate(selectedTarget);
    }
  };

  const handleCancel = () => {
    setSelectedTarget(null);
    setShowConfirm(false);
  };

  const selectedPlayer = players.find((p) => p.id === selectedTarget);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-full border border-dark-700">
          <span className="text-lg">🗳️</span>
          <span className="text-white font-semibold">Manche {currentRound}</span>
        </div>
        
        <h2 className="text-2xl font-bold text-white">Qui est l'Undercover ?</h2>
        <p className="text-dark-400">
          Discutez ensemble et choisissez qui éliminer
        </p>
      </div>

      {/* Info */}
      <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div className="text-sm">
            <p className="text-primary-400 font-semibold mb-1">Vote de groupe</p>
            <p className="text-dark-300">
              Débattez ensemble à voix haute, puis sélectionnez la personne que le groupe souhaite éliminer.
            </p>
          </div>
        </div>
      </div>

      {/* Liste des candidats */}
      <div className="space-y-3">
        <p className="text-dark-400 text-sm">
          {candidates.length} joueur{candidates.length > 1 ? "s" : ""} en lice :
        </p>
        
        {candidates.map((player) => (
          <button
            key={player.id}
            type="button"
            onClick={() => handleSelectPlayer(player.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all transform active:scale-98 ${
              selectedTarget === player.id
                ? "bg-red-500/20 border-red-500"
                : "bg-dark-800/80 border-dark-700 hover:border-red-500/50 hover:bg-red-500/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    selectedTarget === player.id
                      ? "bg-red-500"
                      : "bg-dark-700"
                  }`}
                >
                  {selectedTarget === player.id ? "💀" : "👤"}
                </div>
                <span
                  className={`font-semibold text-lg ${
                    selectedTarget === player.id
                      ? "text-red-400"
                      : "text-white"
                  }`}
                >
                  {player.name}
                </span>
              </div>

              <span className="text-2xl">
                {selectedTarget === player.id ? "❌" : "→"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Modal de confirmation */}
      {showConfirm && selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleCancel}
          />
          <div className="relative z-10 w-full max-w-sm bg-gradient-to-br from-dark-800 to-dark-900 rounded-3xl shadow-2xl border-2 border-red-500/50 p-6 animate-scale-in">
            {/* Icône */}
            <div className="text-center mb-4">
              <span className="text-7xl block">⚠️</span>
            </div>

            {/* Message */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Confirmer l'élimination ?
              </h3>
              <p className="text-dark-400">
                Le groupe veut éliminer
              </p>
              <p className="text-3xl font-bold text-red-400 mt-2">
                {selectedPlayer.name}
              </p>
            </div>

            {/* Boutons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleConfirmElimination}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                <span>💀</span>
                <span>Éliminer {selectedPlayer.name}</span>
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="w-full py-3 bg-dark-700 hover:bg-dark-600 text-dark-300 font-semibold rounded-xl transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Joueurs éliminés (rappel) */}
      {players.filter((p) => p.isEliminated).length > 0 && (
        <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
          <p className="text-dark-500 text-sm mb-2">Déjà éliminés :</p>
          <div className="flex flex-wrap gap-2">
            {players
              .filter((p) => p.isEliminated)
              .map((player) => (
                <span
                  key={player.id}
                  className="px-3 py-1 bg-dark-700 rounded-full text-dark-400 text-sm line-through"
                >
                  {player.name}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
