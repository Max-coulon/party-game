import React from "react";
import { UndercoverPlayer } from "@/types";

interface UndercoverVoteResultProps {
  players: UndercoverPlayer[];
  eliminatedPlayer: UndercoverPlayer | null;
  tiedPlayers: UndercoverPlayer[];
  isRevote: boolean;
  onConfirm: () => void;
}

/**
 * Écran de résultat du vote
 */
export const UndercoverVoteResult: React.FC<UndercoverVoteResultProps> = ({
  players,
  eliminatedPlayer,
  tiedPlayers,
  isRevote,
  onConfirm,
}) => {
  const alivePlayers = players.filter((p) => !p.isEliminated);

  // Trier par votes reçus (décroissant)
  const sortedPlayers = [...alivePlayers].sort(
    (a, b) => b.votesReceived - a.votesReceived
  );

  // Cas d'égalité nécessitant un revote
  if (tiedPlayers.length > 1 && isRevote) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4 py-6">
          <span className="text-8xl block">⚖️</span>
          <h2 className="text-3xl font-bold text-yellow-400">Égalité !</h2>
          <p className="text-dark-400">
            Un revote est nécessaire entre les joueurs à égalité
          </p>
        </div>

        {/* Joueurs à égalité */}
        <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-yellow-500/30">
          <p className="text-dark-400 text-sm mb-4 text-center">
            Joueurs concernés par le revote :
          </p>
          <div className="space-y-2">
            {tiedPlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👤</span>
                  <span className="text-white font-semibold">{player.name}</span>
                </div>
                <span className="text-yellow-400 font-bold">
                  {player.votesReceived} vote{player.votesReceived > 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton */}
        <button
          onClick={onConfirm}
          className="w-full py-5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-dark-900 font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🗳️</span>
          <span>Passer au revote</span>
        </button>
      </div>
    );
  }

  // Résultat normal avec un éliminé
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-6xl block mb-2">📊</span>
        <h2 className="text-2xl font-bold text-white">Résultats du vote</h2>
      </div>

      {/* Tableau des votes */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-dark-700">
        <div className="space-y-2">
          {sortedPlayers.map((player, index) => {
            const isEliminated = eliminatedPlayer?.id === player.id;
            const maxVotes = sortedPlayers[0]?.votesReceived || 0;
            const percentage = maxVotes > 0 ? (player.votesReceived / maxVotes) * 100 : 0;

            return (
              <div
                key={player.id}
                className={`relative p-4 rounded-xl overflow-hidden ${
                  isEliminated
                    ? "bg-red-500/20 border-2 border-red-500"
                    : "bg-dark-700/50"
                }`}
              >
                {/* Barre de progression */}
                <div
                  className={`absolute inset-y-0 left-0 ${
                    isEliminated ? "bg-red-500/30" : "bg-primary-500/20"
                  }`}
                  style={{ width: `${percentage}%` }}
                />

                {/* Contenu */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {isEliminated ? "💀" : index === 0 ? "⚠️" : "👤"}
                    </span>
                    <span
                      className={`font-semibold ${
                        isEliminated ? "text-red-400" : "text-white"
                      }`}
                    >
                      {player.name}
                    </span>
                  </div>

                  <span
                    className={`font-bold ${
                      isEliminated ? "text-red-400" : "text-dark-300"
                    }`}
                  >
                    {player.votesReceived} vote{player.votesReceived !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Annonce de l'éliminé */}
      {eliminatedPlayer && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 text-center animate-scale-in">
          <span className="text-5xl block mb-3">💀</span>
          <p className="text-dark-400 mb-2">Le groupe a décidé d'éliminer</p>
          <h3 className="text-3xl font-bold text-red-400">
            {eliminatedPlayer.name}
          </h3>
        </div>
      )}

      {/* Bouton */}
      <button
        onClick={onConfirm}
        className="w-full py-5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3"
      >
        <span className="text-2xl">▶️</span>
        <span>Continuer</span>
      </button>
    </div>
  );
};
