import React from 'react';
import { TodPlayerStats } from '@/types';

interface TodStatsDisplayProps {
  stats: TodPlayerStats[];
  totalRounds: number;
  completionRate: number;
}

/**
 * Composant pour afficher les statistiques de fin de partie
 */
export const TodStatsDisplay: React.FC<TodStatsDisplayProps> = ({
  stats,
  totalRounds,
  completionRate,
}) => {
  // Trier les joueurs par différents critères pour les titres
  const mostDaresCompleted = [...stats].sort(
    (a, b) => b.daresCompleted - a.daresCompleted
  )[0];
  
  const mostTruthsAnswered = [...stats].sort(
    (a, b) => b.truthsAnswered - a.truthsAnswered
  )[0];
  
  const mostRefusals = [...stats].sort(
    (a, b) => (b.daresRefused + b.truthsRefused) - (a.daresRefused + a.truthsRefused)
  )[0];
  
  const bravest = [...stats].sort(
    (a, b) => (b.daresCompleted + b.truthsAnswered) - (a.daresCompleted + a.truthsAnswered)
  )[0];

  return (
    <div className="space-y-6">
      {/* Résumé général */}
      <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          📊 Résumé de la partie
        </h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-dark-400 text-sm">Tours joués</p>
            <p className="text-white text-3xl font-bold">{totalRounds}</p>
          </div>
          <div>
            <p className="text-dark-400 text-sm">Taux de réussite</p>
            <p className="text-white text-3xl font-bold">{completionRate.toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Titres spéciaux */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-white text-center mb-4">
          🏆 Mentions spéciales
        </h3>

        {mostDaresCompleted && mostDaresCompleted.daresCompleted > 0 && (
          <div className="bg-gradient-to-r from-orange-600/20 to-red-700/20 p-4 rounded-xl border-2 border-orange-500/50">
            <p className="text-orange-300 text-sm font-semibold mb-1">
              🔥 Le/la plus courageux(se)
            </p>
            <p className="text-white text-lg font-bold">
              {mostDaresCompleted.playerName} - {mostDaresCompleted.daresCompleted} actions réussies
            </p>
          </div>
        )}

        {mostTruthsAnswered && mostTruthsAnswered.truthsAnswered > 0 && (
          <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 p-4 rounded-xl border-2 border-blue-500/50">
            <p className="text-blue-300 text-sm font-semibold mb-1">
              💎 Le/la plus honnête
            </p>
            <p className="text-white text-lg font-bold">
              {mostTruthsAnswered.playerName} - {mostTruthsAnswered.truthsAnswered} vérités partagées
            </p>
          </div>
        )}

        {mostRefusals && (mostRefusals.daresRefused + mostRefusals.truthsRefused) > 0 && (
          <div className="bg-gradient-to-r from-gray-600/20 to-gray-800/20 p-4 rounded-xl border-2 border-gray-500/50">
            <p className="text-gray-300 text-sm font-semibold mb-1">
              🙈 Le/la plus timide
            </p>
            <p className="text-white text-lg font-bold">
              {mostRefusals.playerName} - {mostRefusals.daresRefused + mostRefusals.truthsRefused} refus
            </p>
          </div>
        )}

        {bravest && (bravest.daresCompleted + bravest.truthsAnswered) > 0 && (
          <div className="bg-gradient-to-r from-purple-600/20 to-indigo-700/20 p-4 rounded-xl border-2 border-purple-500/50">
            <p className="text-purple-300 text-sm font-semibold mb-1">
              👑 MVP de la soirée
            </p>
            <p className="text-white text-lg font-bold">
              {bravest.playerName} - {bravest.daresCompleted + bravest.truthsAnswered} défis relevés
            </p>
          </div>
        )}
      </div>

      {/* Stats détaillées par joueur */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-white text-center mb-4">
          📈 Statistiques détaillées
        </h3>

        {stats.map((stat) => (
          <div
            key={stat.playerId}
            className="bg-dark-800 p-4 rounded-xl border border-dark-700"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white text-lg font-bold">{stat.playerName}</h4>
              {stat.totalPenalties > 0 && (
                <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm font-semibold">
                  {stat.totalPenalties} pénalité{stat.totalPenalties > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-orange-500/10 p-2 rounded-lg">
                <p className="text-orange-300">🔥 Actions</p>
                <p className="text-white font-semibold">
                  ✅ {stat.daresCompleted} / ❌ {stat.daresRefused}
                </p>
              </div>
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <p className="text-blue-300">🤔 Vérités</p>
                <p className="text-white font-semibold">
                  ✅ {stat.truthsAnswered} / ❌ {stat.truthsRefused}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
