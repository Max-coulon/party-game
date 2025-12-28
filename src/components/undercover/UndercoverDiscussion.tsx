import React from "react";
import { UndercoverPlayer, UndercoverEliminationEntry } from "@/types";

interface UndercoverDiscussionProps {
  players: UndercoverPlayer[];
  currentRound: number;
  timeLeft: number;
  hasTimer: boolean;
  eliminationHistory: UndercoverEliminationEntry[];
  showHistory: boolean;
  onSkipTimer: () => void;
  onStartVote: () => void;
}

/**
 * Écran de phase de discussion
 */
export const UndercoverDiscussion: React.FC<UndercoverDiscussionProps> = ({
  players,
  currentRound,
  timeLeft,
  hasTimer,
  eliminationHistory,
  showHistory,
  onSkipTimer,
  onStartVote,
}) => {
  const alivePlayers = players.filter((p) => !p.isEliminated);

  // Formater le temps
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Couleur du timer selon le temps restant
  const getTimerColor = () => {
    if (timeLeft <= 10) return "text-red-500";
    if (timeLeft <= 30) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-full border border-dark-700">
          <span className="text-lg">🔄</span>
          <span className="text-white font-semibold">Manche {currentRound}</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Phase de Discussion</h2>
        <p className="text-dark-400">
          Chacun décrit son mot en une phrase !
        </p>
      </div>

      {/* Timer (si activé) */}
      {hasTimer && timeLeft > 0 && (
        <div className="text-center py-6 animate-scale-in">
          <div className={`text-7xl font-bold ${getTimerColor()} tabular-nums`}>
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={onSkipTimer}
            className="mt-4 px-6 py-2 bg-dark-700 hover:bg-dark-600 text-dark-300 rounded-xl transition-all text-sm"
          >
            Passer au vote →
          </button>
        </div>
      )}

      {/* Sans timer: bouton pour passer au vote */}
      {!hasTimer && (
        <div className="text-center py-6">
          <span className="text-6xl block mb-4">💬</span>
          <p className="text-dark-400 mb-6">
            Discutez entre vous, puis passez au vote quand vous êtes prêts.
          </p>
          <button
            onClick={onStartVote}
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            🗳️ Passer au vote
          </button>
        </div>
      )}

      {/* Ordre de parole suggéré */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-dark-700">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">👥</span>
          <span className="text-white font-bold">Joueurs en vie ({alivePlayers.length})</span>
        </div>

        <div className="space-y-2">
          {alivePlayers.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-xl"
            >
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold">
                {index + 1}
              </div>
              <span className="text-white">{player.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Historique des éliminations */}
      {showHistory && eliminationHistory.length > 0 && (
        <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-dark-700">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📜</span>
            <span className="text-white font-bold">Éliminés</span>
          </div>

          <div className="space-y-2">
            {eliminationHistory.map((entry) => (
              <div
                key={entry.playerId}
                className="flex items-center justify-between p-3 bg-dark-700/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-dark-500">M{entry.round}</span>
                  <span className="text-dark-400 line-through">{entry.playerName}</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                    entry.role === "civil"
                      ? "bg-blue-500/20 text-blue-400"
                      : entry.role === "undercover"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  {entry.role === "civil"
                    ? "Civil"
                    : entry.role === "undercover"
                    ? "Undercover"
                    : "Mr White"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div className="text-sm">
            <p className="text-yellow-400 font-semibold mb-1">Conseil</p>
            <p className="text-dark-300">
              Soyez subtils dans vos descriptions ! Trop précis = vous exposez les Civils.
              Trop vague = vous ressemblez à un Undercover.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
