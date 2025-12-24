import React from "react";
import {
  PartyGuessSummary,
  PartyGuessVariant,
  PARTY_GUESS_VARIANTS,
} from "@/types";

interface PartyGuessGameEndProps {
  summary: PartyGuessSummary;
  variants: PartyGuessVariant[];
  onReplay: () => void;
  onChangeMode: () => void;
  onBackToMenu: () => void;
}

/**
 * Écran de fin de partie
 */
export const PartyGuessGameEnd: React.FC<PartyGuessGameEndProps> = ({
  summary,
  variants,
  onReplay,
  onChangeMode,
  onBackToMenu,
}) => {
  const { teams, winner, isTie } = summary;

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4 py-6 animate-slide-down">
        <span className="text-8xl block animate-bounce-slow">🏆</span>
        <h2 className="text-4xl font-bold text-white">Partie terminée !</h2>

        {isTie ? (
          <div className="space-y-2">
            <p className="text-2xl text-yellow-400 font-bold">Égalité !</p>
            <p className="text-dark-300">Bravo à tous !</p>
          </div>
        ) : winner ? (
          <div className="space-y-2">
            <p className="text-dark-300">Le gagnant est</p>
            <div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl shadow-xl"
              style={{ backgroundColor: winner.color }}
            >
              <span className="text-3xl">👑</span>
              <span className="text-white text-2xl font-bold">{winner.name}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-white font-bold text-xl">
                {winner.score} pts
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Classement final */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-dark-700 animate-slide-up">
        <div className="flex items-center justify-center gap-2 mb-4">
          {variants.map(v => (
            <span key={v} className="text-xl">{PARTY_GUESS_VARIANTS[v].icon}</span>
          ))}
          <h3 className="text-xl font-bold text-white">Classement final</h3>
        </div>

        <div className="space-y-3">
          {sortedTeams.map((team, index) => {
            const isWinner = index === 0;

            return (
              <div
                key={team.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  isWinner ? "bg-yellow-500/20 ring-2 ring-yellow-500/50" : "bg-dark-700/50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                    index === 0
                      ? "bg-yellow-500 text-dark-900"
                      : index === 1
                      ? "bg-gray-400 text-dark-900"
                      : index === 2
                      ? "bg-orange-600 text-white"
                      : "bg-dark-600 text-white"
                  }`}
                >
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                </div>

                <div
                  className="w-5 h-5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: team.color }}
                />
                <span className="flex-1 font-semibold text-white text-lg">{team.name}</span>

                <div
                  className="px-4 py-2 rounded-xl font-bold text-xl text-white min-w-[60px] text-center"
                  style={{ backgroundColor: team.color }}
                >
                  {team.score}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dark-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-dark-900 text-dark-400 text-sm font-medium">
            Et maintenant ?
          </span>
        </div>
      </div>

      {/* Boutons */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <button
          onClick={onReplay}
          className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <div className="flex items-center justify-center gap-3">
            <span>🔄</span>
            <span>Rejouer avec les mêmes équipes</span>
          </div>
        </button>

        <button
          onClick={onChangeMode}
          className="w-full py-4 bg-dark-700 hover:bg-dark-600 text-white font-bold text-lg rounded-xl border-2 border-dark-600 transition-all transform hover:scale-105 active:scale-95"
        >
          <div className="flex items-center justify-center gap-3">
            <span>🎯</span>
            <span>Changer de mode</span>
          </div>
        </button>

        <button
          onClick={onBackToMenu}
          className="w-full py-4 bg-transparent hover:bg-dark-800 text-dark-300 hover:text-white font-semibold text-lg rounded-xl border-2 border-dark-700 transition-all"
        >
          <div className="flex items-center justify-center gap-3">
            <span>🏠</span>
            <span>Retour au menu</span>
          </div>
        </button>
      </div>
    </div>
  );
};
