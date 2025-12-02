import React, { useState } from 'react';
import { getStats, getMostPlayedMode, resetStats } from '@/utils/statsManager';
import { Player } from '@/types';

interface StatsDisplayProps {
  players: Player[];
}

/**
 * Composant pour afficher les statistiques du jeu
 */
export const StatsDisplay: React.FC<StatsDisplayProps> = ({ players }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const stats = getStats();
  const mostPlayedMode = getMostPlayedMode();

  const handleReset = () => {
    resetStats();
    setShowResetConfirm(false);
    setIsOpen(false);
  };

  // Trouver les noms des joueurs à partir de leurs IDs
  const getPlayerStatsWithNames = () => {
    return Object.entries(stats.playerWins)
      .map(([playerId, wins]) => {
        const player = players.find(p => p.id === playerId);
        return {
          id: playerId,
          name: player?.name || 'Joueur inconnu',
          avatar: player?.avatar || '👤',
          wins,
        };
      })
      .sort((a, b) => b.wins - a.wins);
  };

  const playerStats = getPlayerStatsWithNames();

  return (
    <>
      {/* Bouton pour ouvrir les stats */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          w-full p-4
          bg-dark-700/50 hover:bg-dark-700
          border-2 border-dark-600 hover:border-purple-500
          rounded-2xl
          transition-all duration-300
          flex items-center justify-between
        "
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <p className="text-sm text-dark-400">
              {stats.totalGamesPlayed} partie{stats.totalGamesPlayed !== 1 ? 's' : ''} jouée{stats.totalGamesPlayed !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Modal des statistiques */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="
            relative z-10 w-full max-w-lg
            bg-dark-800 rounded-3xl
            shadow-2xl border border-dark-700
            overflow-hidden
            animate-scale-in
          ">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 p-6 border-b-2 border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  <h2 className="text-2xl font-bold text-white">Statistiques</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-all"
                  aria-label="Fermer"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-6">
              {/* Stats générales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-dark-700/50 rounded-xl border border-dark-600 text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {stats.totalGamesPlayed}
                  </div>
                  <div className="text-sm text-dark-300 mt-1">
                    Parties jouées
                  </div>
                </div>
                <div className="p-4 bg-dark-700/50 rounded-xl border border-dark-600 text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {mostPlayedMode ? (
                      <span className="uppercase">{mostPlayedMode}</span>
                    ) : (
                      '-'
                    )}
                  </div>
                  <div className="text-sm text-dark-300 mt-1">
                    Mode favori
                  </div>
                </div>
              </div>

              {/* Classement des joueurs */}
              {playerStats.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🏆</span>
                    <span>Champions</span>
                  </h3>
                  {playerStats.map((player, index) => (
                    <div
                      key={player.id}
                      className={`
                        p-3 rounded-xl flex items-center justify-between
                        ${index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30' : 'bg-dark-700/50 border border-dark-600'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                          ${index === 0 ? 'bg-yellow-500 text-yellow-900' : index === 1 ? 'bg-gray-400 text-gray-900' : index === 2 ? 'bg-orange-500 text-orange-900' : 'bg-dark-600 text-dark-300'}
                        `}>
                          {index + 1}
                        </div>
                        <span className="text-2xl">{player.avatar}</span>
                        <span className="text-white font-medium">{player.name}</span>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${index === 0 ? 'text-yellow-400' : 'text-white'}`}>
                          {player.wins}
                        </div>
                        <div className="text-xs text-dark-400">
                          victoire{player.wins !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {stats.totalGamesPlayed === 0 && (
                <div className="text-center py-8 text-dark-400">
                  <p className="text-5xl mb-3">🎮</p>
                  <p>Aucune statistique pour le moment</p>
                  <p className="text-sm mt-2">Jouez une partie pour commencer !</p>
                </div>
              )}

              {/* Bouton de réinitialisation */}
              {stats.totalGamesPlayed > 0 && (
                <div className="pt-4 border-t border-dark-700">
                  {!showResetConfirm ? (
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="
                        w-full py-3
                        bg-red-600/20 hover:bg-red-600/30
                        border border-red-500/30
                        text-red-400 font-medium
                        rounded-xl
                        transition-all duration-200
                      "
                    >
                      Réinitialiser les statistiques
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-yellow-400 text-center mb-3">
                        ⚠️ Êtes-vous sûr ? Cette action est irréversible.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="
                            py-2 px-4
                            bg-dark-700 hover:bg-dark-600
                            text-white font-medium
                            rounded-xl
                            transition-all duration-200
                          "
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleReset}
                          className="
                            py-2 px-4
                            bg-red-600 hover:bg-red-700
                            text-white font-medium
                            rounded-xl
                            transition-all duration-200
                          "
                        >
                          Confirmer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
