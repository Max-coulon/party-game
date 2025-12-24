import React from "react";
import {
  TimesUpTeam,
  TimesUpRoundNumber,
  TIMES_UP_ROUND_LABELS,
} from "@/types";

interface TimesUpRoundEndProps {
  teams: TimesUpTeam[];
  currentRound: TimesUpRoundNumber;
  onNextRound: () => void;
  isLastRound: boolean;
}

/**
 * Écran de fin de manche
 */
export const TimesUpRoundEnd: React.FC<TimesUpRoundEndProps> = ({
  teams,
  currentRound,
  onNextRound,
  isLastRound,
}) => {
  const roundInfo = TIMES_UP_ROUND_LABELS[currentRound];

  // Trier les équipes par score de cette manche
  const sortedTeams = [...teams].sort(
    (a, b) => b.scores[currentRound - 1] - a.scores[currentRound - 1]
  );

  const topScore = sortedTeams[0]?.scores[currentRound - 1] || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4 py-6">
        <span className="text-7xl block animate-bounce-slow">🎉</span>
        <h2 className="text-3xl font-bold text-white">
          Manche {currentRound} terminée !
        </h2>
        <div className="flex items-center justify-center gap-2 text-dark-300">
          <span className="text-2xl">{roundInfo.icon}</span>
          <span>{roundInfo.name}</span>
        </div>
      </div>

      {/* Classement de la manche */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-dark-700">
        <h3 className="text-lg font-bold text-white mb-4 text-center">
          📊 Résultats de la manche
        </h3>

        <div className="space-y-3">
          {sortedTeams.map((team, index) => {
            const isWinner =
              team.scores[currentRound - 1] === topScore && topScore > 0;
            const score = team.scores[currentRound - 1];

            return (
              <div
                key={team.id}
                className={`
                  flex items-center gap-4 p-4 rounded-xl transition-all
                  ${isWinner ? "bg-yellow-500/20 ring-2 ring-yellow-500/50" : "bg-dark-700/50"}
                `}
              >
                {/* Position */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                    ${
                      index === 0
                        ? "bg-yellow-500 text-dark-900"
                        : index === 1
                        ? "bg-gray-400 text-dark-900"
                        : index === 2
                        ? "bg-orange-600 text-white"
                        : "bg-dark-600 text-white"
                    }
                  `}
                >
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                </div>

                {/* Équipe */}
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: team.color }}
                />
                <span className="flex-1 font-semibold text-white">
                  {team.name}
                </span>

                {/* Score manche */}
                <div
                  className="px-4 py-2 rounded-xl font-bold text-lg text-white"
                  style={{ backgroundColor: team.color }}
                >
                  +{score}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score total */}
      <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
        <h4 className="text-center text-dark-400 mb-3 font-medium">
          Score total
        </h4>
        <div className="flex justify-center gap-4 flex-wrap">
          {[...teams]
            .sort(
              (a, b) =>
                b.scores.reduce((x, y) => x + y, 0) -
                a.scores.reduce((x, y) => x + y, 0)
            )
            .map((team) => (
              <div
                key={team.id}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: team.color }}
              >
                <span className="text-white font-semibold">{team.name}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-white font-bold">
                  {team.scores.reduce((a, b) => a + b, 0)}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Bouton suivant */}
      <div className="pt-4">
        <button
          onClick={onNextRound}
          className="w-full py-5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 text-white font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3"
        >
          {isLastRound ? (
            <>
              <span className="text-3xl">🏆</span>
              <span>Voir les résultats finaux</span>
            </>
          ) : (
            <>
              <span className="text-3xl">
                {TIMES_UP_ROUND_LABELS[(currentRound + 1) as TimesUpRoundNumber]?.icon}
              </span>
              <span>
                Manche {currentRound + 1} :{" "}
                {TIMES_UP_ROUND_LABELS[(currentRound + 1) as TimesUpRoundNumber]?.name}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
