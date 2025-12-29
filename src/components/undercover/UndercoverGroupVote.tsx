import React, { useState } from "react";
import { UndercoverPlayer } from "@/types";

interface UndercoverGroupVoteProps {
  players: UndercoverPlayer[];
  currentRound: number;
  onEliminate: (targetId: string) => void;
}

/**
 * Écran de vote de groupe - On clique pour révéler le rôle puis éliminer
 */
export const UndercoverGroupVote: React.FC<UndercoverGroupVoteProps> = ({
  players,
  currentRound,
  onEliminate,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [showRoleReveal, setShowRoleReveal] = useState(false);

  // Joueurs vivants (candidats à l'élimination)
  const candidates = players.filter((p) => !p.isEliminated);

  const handleSelectPlayer = (playerId: string) => {
    setSelectedTarget(playerId);
    setShowRoleReveal(true);
  };

  const handleConfirmElimination = () => {
    if (selectedTarget) {
      onEliminate(selectedTarget);
    }
  };

  const handleCancel = () => {
    setSelectedTarget(null);
    setShowRoleReveal(false);
  };

  const selectedPlayer = players.find((p) => p.id === selectedTarget);

  // Fonction pour obtenir le nom du rôle en français
  const getRoleName = (role: string) => {
    switch (role) {
      case "civil":
        return "Civil";
      case "undercover":
        return "Undercover";
      case "mrwhite":
        return "Mr White";
      default:
        return role;
    }
  };

  // Fonction pour obtenir la couleur du rôle
  const getRoleColor = (role: string) => {
    switch (role) {
      case "civil":
        return "from-blue-500 to-blue-700";
      case "undercover":
        return "from-red-500 to-red-700";
      case "mrwhite":
        return "from-purple-500 to-purple-700";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  // Fonction pour obtenir l'émoji du rôle
  const getRoleEmoji = (role: string) => {
    switch (role) {
      case "civil":
        return "👤";
      case "undercover":
        return "🕵️";
      case "mrwhite":
        return "👻";
      default:
        return "❓";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-full border border-dark-700">
          <span className="text-lg">🗳️</span>
          <span className="text-white font-semibold">Manche {currentRound}</span>
        </div>
        
        <h2 className="text-2xl font-bold text-white">Qui éliminez-vous ?</h2>
        <p className="text-dark-400">
          Vote oral : cliquez pour révéler le rôle
        </p>
      </div>

      {/* Info */}
      <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div className="text-sm">
            <p className="text-primary-400 font-semibold mb-1">Décision de groupe</p>
            <p className="text-dark-300">
              Discutez oralement pour choisir qui éliminer. Une fois décidé, cliquez sur le joueur pour révéler son rôle.
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
            className="w-full p-4 rounded-xl border-2 bg-dark-800/80 border-dark-700 hover:border-red-500/50 hover:bg-red-500/10 transition-all transform active:scale-98"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center text-2xl">
                  👤
                </div>
                <span className="font-semibold text-lg text-white">
                  {player.name}
                </span>
              </div>

              <span className="text-2xl">→</span>
            </div>
          </button>
        ))}
      </div>

      {/* Modal de révélation du rôle */}
      {showRoleReveal && selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleCancel}
          />
          <div className="relative z-10 w-full max-w-sm bg-gradient-to-br from-dark-800 to-dark-900 rounded-3xl shadow-2xl border-2 border-primary-500/50 p-6 animate-scale-in">
            {/* Nom du joueur */}
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedPlayer.name}
              </h3>
            </div>

            {/* Révélation du rôle avec animation */}
            <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${getRoleColor(selectedPlayer.role)} mb-6 animate-pulse-slow`}>
              <div className="text-center">
                <span className="text-7xl block mb-3">
                  {getRoleEmoji(selectedPlayer.role)}
                </span>
                <p className="text-white text-3xl font-bold mb-2">
                  {getRoleName(selectedPlayer.role)}
                </p>
                {selectedPlayer.word && (
                  <p className="text-white/80 text-lg">
                    Mot : <span className="font-bold">{selectedPlayer.word}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Message selon le rôle */}
            <div className="text-center mb-6">
              <p className="text-dark-300 text-sm">
                {selectedPlayer.role === "civil" && "❌ Ce n'était pas l'Undercover !"}
                {selectedPlayer.role === "undercover" && "✅ Vous avez trouvé l'Undercover !"}
                {selectedPlayer.role === "mrwhite" && "👻 C'était Mr White !"}
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
