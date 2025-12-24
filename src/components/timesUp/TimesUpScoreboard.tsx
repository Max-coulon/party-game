import React from "react";
import { TimesUpTeam } from "@/types";

interface TimesUpScoreboardProps {
  teams: TimesUpTeam[];
  currentTeamIndex: number;
  currentRound: number;
  compact?: boolean;
}

/**
 * Tableau des scores pour Time's Up
 */
export const TimesUpScoreboard: React.FC<TimesUpScoreboardProps> = ({
  teams,
  currentTeamIndex,
  currentRound,
  compact = false,
}) => {
  // Calcule le score total d'une équipe
  const getTotalScore = (team: TimesUpTeam) =>
    team.scores.reduce((a, b) => a + b, 0);

  // Trie par score total (décroissant)
  const sortedTeams = [...teams].sort(
    (a, b) => getTotalScore(b) - getTotalScore(a)
  );

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className={`
              px-3 py-1.5 rounded-full text-sm font-bold
              flex items-center gap-2 transition-all duration-300
              ${
                index === currentTeamIndex
                  ? "ring-2 ring-white ring-offset-2 ring-offset-dark-900 scale-110"
                  : "opacity-70"
              }
            `}
            style={{ backgroundColor: team.color }}
          >
            <span className="text-white">{team.name}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-white">
              {getTotalScore(team)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-4 border border-dark-700">
      <h3 className="text-lg font-bold text-white mb-3 text-center">
        📊 Scores
      </h3>

      <div className="space-y-2">
        {sortedTeams.map((team, index) => {
          const isCurrentTeam = teams.indexOf(team) === currentTeamIndex;
          const totalScore = getTotalScore(team);

          return (
            <div
              key={team.id}
              className={`
                flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                ${
                  isCurrentTeam
                    ? "bg-white/10 ring-2 ring-white/50"
                    : "bg-dark-700/50"
                }
              `}
            >
              {/* Position */}
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-600 text-white font-bold text-sm">
                {index + 1}
              </div>

              {/* Couleur & Nom */}
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: team.color }}
              />
              <span
                className={`flex-1 font-semibold ${
                  isCurrentTeam ? "text-white" : "text-dark-300"
                }`}
              >
                {team.name}
                {isCurrentTeam && (
                  <span className="ml-2 text-xs bg-primary-500/30 text-primary-300 px-2 py-0.5 rounded-full">
                    À jouer
                  </span>
                )}
              </span>

              {/* Scores par manche */}
              <div className="flex gap-1">
                {[1, 2, 3].map((round) => (
                  <div
                    key={round}
                    className={`
                      w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold
                      ${
                        round <= currentRound
                          ? "bg-dark-600 text-white"
                          : "bg-dark-700 text-dark-500"
                      }
                    `}
                  >
                    {team.scores[round - 1]}
                  </div>
                ))}
              </div>

              {/* Score total */}
              <div
                className="w-12 h-10 flex items-center justify-center rounded-xl text-white font-bold text-lg"
                style={{ backgroundColor: team.color }}
              >
                {totalScore}
              </div>
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="mt-3 pt-3 border-t border-dark-700 flex justify-center gap-4 text-xs text-dark-400">
        <span>🗣️ M1</span>
        <span>☝️ M2</span>
        <span>🎭 M3</span>
        <span className="font-bold text-white">Total</span>
      </div>
    </div>
  );
};
