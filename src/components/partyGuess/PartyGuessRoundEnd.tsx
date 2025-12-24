import React from "react";
import { PartyGuessTeam, PartyGuessVariant, PARTY_GUESS_VARIANTS } from "@/types";

interface PartyGuessRoundEndProps {
  teams: PartyGuessTeam[];
  currentRound: number;
  totalRounds: number;
  onNextRound: () => void;
  isLastRound: boolean;
  nextVariant?: PartyGuessVariant;
}

/**
 * Écran de fin de manche
 */
export const PartyGuessRoundEnd: React.FC<PartyGuessRoundEndProps> = ({
  teams,
  currentRound,
  // totalRounds non utilisé mais gardé pour cohérence de l'interface
  onNextRound,
  isLastRound,
  nextVariant,
}) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const topScore = sortedTeams[0]?.score || 0;
  const nextVariantInfo = nextVariant ? PARTY_GUESS_VARIANTS[nextVariant] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4 py-6">
        <span className="text-7xl block animate-bounce-slow">🎉</span>
        <h2 className="text-3xl font-bold text-white">
          {isLastRound ? "Partie terminée !" : `Manche ${currentRound} terminée !`}
        </h2>
      </div>

      {/* Classement */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-dark-700">
        <h3 className="text-lg font-bold text-white mb-4 text-center">
          📊 {isLastRound ? "Classement final" : "Scores"}
        </h3>

        <div className="space-y-3">
          {sortedTeams.map((team, index) => {
            const isWinner = team.score === topScore && topScore > 0;

            return (
              <div
                key={team.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  isWinner ? "bg-yellow-500/20 ring-2 ring-yellow-500/50" : "bg-dark-700/50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
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
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: team.color }}
                />
                <span className="flex-1 font-semibold text-white">{team.name}</span>

                <div
                  className="px-4 py-2 rounded-xl font-bold text-lg text-white"
                  style={{ backgroundColor: team.color }}
                >
                  {team.score}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Aperçu prochaine manche */}
      {!isLastRound && nextVariantInfo && (
        <div className="p-4 bg-primary-500/10 rounded-xl border border-primary-500/30 animate-slide-up">
          <p className="text-primary-300 text-sm font-medium text-center">
            Prochaine manche : <span className="text-xl">{nextVariantInfo.icon}</span> {nextVariantInfo.name}
          </p>
          <p className="text-dark-400 text-xs text-center mt-1">{nextVariantInfo.rule}</p>
        </div>
      )}

      {/* Bouton suivant */}
      <div className="pt-4">
        <button
          onClick={onNextRound}
          className="w-full py-5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3"
        >
          {isLastRound ? (
            <>
              <span className="text-3xl">🏆</span>
              <span>Voir les résultats</span>
            </>
          ) : (
            <>
              <span className="text-3xl">{nextVariantInfo?.icon || "▶️"}</span>
              <span>Manche {currentRound + 1}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
