import React from "react";
import { PartyGuessTeam } from "@/types";

interface PartyGuessScoreboardProps {
  teams: PartyGuessTeam[];
  currentTeamIndex: number;
  compact?: boolean;
}

/**
 * Tableau des scores
 */
export const PartyGuessScoreboard: React.FC<PartyGuessScoreboardProps> = ({
  teams,
  currentTeamIndex,
  compact = false,
}) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className={`px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
              index === currentTeamIndex
                ? "ring-2 ring-white ring-offset-2 ring-offset-dark-900 scale-110"
                : "opacity-70"
            }`}
            style={{ backgroundColor: team.color }}
          >
            <span className="text-white">{team.name}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-white">
              {team.score}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-4 border border-dark-700">
      <h3 className="text-lg font-bold text-white mb-3 text-center">📊 Scores</h3>

      <div className="space-y-2">
        {sortedTeams.map((team, index) => {
          const isCurrentTeam = teams.indexOf(team) === currentTeamIndex;

          return (
            <div
              key={team.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                isCurrentTeam ? "bg-white/10 ring-2 ring-white/50" : "bg-dark-700/50"
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-600 text-white font-bold text-sm">
                {index + 1}
              </div>

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

              <div
                className="w-12 h-10 flex items-center justify-center rounded-xl text-white font-bold text-lg"
                style={{ backgroundColor: team.color }}
              >
                {team.score}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
