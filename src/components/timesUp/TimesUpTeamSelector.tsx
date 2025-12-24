import React, { useState } from "react";
import { TimesUpTeam } from "@/types";
import { TEAM_COLORS, DEFAULT_TEAM_NAMES } from "@/data/timesUpWords";

interface TimesUpTeamSelectorProps {
  teams: TimesUpTeam[];
  onTeamsChange: (teams: TimesUpTeam[]) => void;
  minTeams?: number;
  maxTeams?: number;
}

/**
 * Sélecteur d'équipes pour Time's Up
 */
export const TimesUpTeamSelector: React.FC<TimesUpTeamSelectorProps> = ({
  teams,
  onTeamsChange,
  minTeams = 2,
  maxTeams = 6,
}) => {
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  const handleAddTeam = () => {
    if (teams.length >= maxTeams) return;

    const newTeam: TimesUpTeam = {
      id: `team-${Date.now()}`,
      name: DEFAULT_TEAM_NAMES[teams.length] || `Équipe ${teams.length + 1}`,
      color: TEAM_COLORS[teams.length % TEAM_COLORS.length],
      scores: [0, 0, 0],
    };

    onTeamsChange([...teams, newTeam]);
  };

  const handleRemoveTeam = (teamId: string) => {
    if (teams.length <= minTeams) return;
    onTeamsChange(teams.filter((t) => t.id !== teamId));
  };

  const handleUpdateTeamName = (teamId: string, name: string) => {
    onTeamsChange(
      teams.map((t) => (t.id === teamId ? { ...t, name } : t))
    );
  };

  const handleColorChange = (teamId: string, color: string) => {
    onTeamsChange(
      teams.map((t) => (t.id === teamId ? { ...t, color } : t))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">👥</span>
        <h3 className="text-xl font-bold text-white">Équipes</h3>
        <span className="text-dark-400 text-sm ml-auto">
          {teams.length} / {maxTeams}
        </span>
      </div>

      {/* Liste des équipes */}
      <div className="space-y-3">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className="bg-dark-700/50 rounded-xl p-4 border border-dark-600 hover:border-dark-500 transition-colors"
          >
            <div className="flex items-center gap-3">
              {/* Numéro */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                style={{ backgroundColor: team.color }}
              >
                {index + 1}
              </div>

              {/* Nom éditable */}
              {editingTeamId === team.id ? (
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => handleUpdateTeamName(team.id, e.target.value)}
                  onBlur={() => setEditingTeamId(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingTeamId(null)}
                  autoFocus
                  className="flex-1 bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                  maxLength={20}
                />
              ) : (
                <button
                  onClick={() => setEditingTeamId(team.id)}
                  className="flex-1 text-left text-white font-semibold hover:text-primary-300 transition-colors"
                >
                  {team.name}
                  <span className="ml-2 text-dark-500 text-xs">✏️</span>
                </button>
              )}

              {/* Sélecteur de couleur */}
              <div className="flex gap-1">
                {TEAM_COLORS.slice(0, 4).map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(team.id, color)}
                    className={`w-6 h-6 rounded-full transition-all ${
                      team.color === color
                        ? "ring-2 ring-white ring-offset-2 ring-offset-dark-700 scale-110"
                        : "opacity-50 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Bouton supprimer */}
              {teams.length > minTeams && (
                <button
                  onClick={() => handleRemoveTeam(team.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bouton ajouter */}
      {teams.length < maxTeams && (
        <button
          onClick={handleAddTeam}
          className="w-full py-3 border-2 border-dashed border-dark-600 hover:border-primary-500 rounded-xl text-dark-400 hover:text-primary-400 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span className="text-xl">➕</span>
          <span>Ajouter une équipe</span>
        </button>
      )}

      {/* Info minimum */}
      {teams.length < minTeams && (
        <p className="text-yellow-400 text-sm text-center animate-pulse">
          ⚠️ Ajoutez au moins {minTeams} équipes pour jouer
        </p>
      )}
    </div>
  );
};
