import React from 'react';
import { TodStatsDisplay } from '@/components/truthOrDare/TodStatsDisplay';
import { TodPlayerStats } from '@/types';

interface TruthOrDareSummaryProps {
  playerStats: TodPlayerStats[];
  totalRounds: number;
  completionRate: number;
  onReplayWithSameSettings: () => void;
  onNewGame: () => void;
  onBackToMenu: () => void;
}

/**
 * Écran de résumé / fin de partie
 */
export const TruthOrDareSummary: React.FC<TruthOrDareSummaryProps> = ({
  playerStats,
  totalRounds,
  completionRate,
  onReplayWithSameSettings,
  onNewGame,
  onBackToMenu,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4 py-6 animate-slide-down">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-7xl animate-bounce-slow">🎉</span>
        </div>
        <h2 className="text-4xl font-bold text-white">Partie terminée !</h2>
        <p className="text-dark-300 text-lg">Bravo à tous les participants</p>
      </div>

      {/* Statistiques détaillées */}
      <div className="animate-slide-up">
        <TodStatsDisplay
          stats={playerStats}
          totalRounds={totalRounds}
          completionRate={completionRate}
        />
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

      {/* Boutons d'action */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {/* Rejouer à l'identique */}
        <button
          onClick={onReplayWithSameSettings}
          className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 active:from-primary-800 active:to-primary-900 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <div className="flex items-center justify-center gap-3">
            <span>🔄</span>
            <span>Rejouer à l'identique</span>
          </div>
        </button>

        {/* Nouvelle partie */}
        <button
          onClick={onNewGame}
          className="w-full py-4 bg-dark-700 hover:bg-dark-600 active:bg-dark-800 text-white font-bold text-lg rounded-xl border-2 border-dark-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <div className="flex items-center justify-center gap-3">
            <span>🎮</span>
            <span>Nouvelle partie</span>
          </div>
        </button>

        {/* Retour au menu */}
        <button
          onClick={onBackToMenu}
          className="w-full py-4 bg-transparent hover:bg-dark-800 text-dark-300 hover:text-white font-semibold text-lg rounded-xl border-2 border-dark-700 transition-all duration-300"
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
