import React from 'react';
import { Player } from '@/types';
import { PlayerScoreBoard } from '@/components/players/PlayerScoreBoard';

interface NheSummaryProps {
  players: Player[];
  onRestart: () => void;
  onBackToMenu: () => void;
}

/**
 * Écran de fin de partie avec classement et cul sec pour le premier
 * Design amélioré avec animations et effets visuels
 */
export const NheSummary: React.FC<NheSummaryProps> = ({ 
  players, 
  onRestart,
  onBackToMenu,
}) => {
  // Trouver le joueur avec le plus de points
  const winner = [...players].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header avec confettis animés */}
      <div className="text-center space-y-4 py-8 animate-slide-down">
        <div className="relative inline-block">
          <div className="text-8xl animate-bounce-slow">🎉</div>
          {/* Confettis décoratifs */}
          <span className="absolute -top-4 -left-4 text-4xl animate-pulse-slow">✨</span>
          <span className="absolute -top-4 -right-4 text-4xl animate-pulse-slow" style={{ animationDelay: '0.5s' }}>🎊</span>
          <span className="absolute -bottom-2 left-0 text-3xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎈</span>
          <span className="absolute -bottom-2 right-0 text-3xl animate-bounce" style={{ animationDelay: '0.7s' }}>🎈</span>
        </div>
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 animate-scale-in">
          Partie terminée !
        </h2>
        <p className="text-lg text-dark-300 font-medium">Voici le classement final</p>
      </div>

      {/* Classement avec animation d'entrée */}
      <div className="animate-slide-up">
        <PlayerScoreBoard players={players} />
      </div>

      {/* Message du cul sec avec effet spectaculaire */}
      {winner && winner.score > 0 && (
        <div className="
          p-8 
          bg-gradient-to-br from-yellow-500/30 via-orange-500/25 to-red-500/20 
          border-3 border-yellow-400
          rounded-3xl 
          text-center 
          space-y-4
          shadow-2xl shadow-yellow-500/30
          backdrop-blur-sm
          animate-scale-in
          relative overflow-hidden
        ">
          {/* Effet de brillance en arrière-plan */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          
          <div className="relative z-10">
            <div className="text-7xl mb-4 animate-bounce-slow">🍺</div>
            <p className="text-2xl font-bold text-white mb-2">
              🏆 {winner.name}, tu as gagné ! 🏆
            </p>
            <div className="py-4 px-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-xl inline-block">
              <p className="text-3xl font-extrabold text-dark-900 uppercase tracking-wide animate-pulse-slow">
                TU DOIS BOIRE UN CUL SEC ! 🔥
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Boutons d'action améliorés */}
      <div className="space-y-4 pt-4 animate-fade-in">
        <button
          onClick={onRestart}
          className="
            w-full py-5 
            bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 
            hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 
            active:from-primary-800 active:to-primary-900 
            text-white text-xl font-bold rounded-2xl 
            shadow-2xl shadow-primary-500/30
            transition-all duration-300 
            transform hover:scale-[1.03] active:scale-95
            border-2 border-primary-500/50
            relative overflow-hidden
            group
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="relative flex items-center justify-center gap-3">
            <span className="text-2xl">🔄</span>
            <span>Rejouer</span>
          </span>
        </button>
        
        <button
          onClick={onBackToMenu}
          className="
            w-full py-5 
            bg-dark-700/70 
            hover:bg-dark-700 
            active:bg-dark-600 
            text-white text-lg font-semibold rounded-2xl 
            border-2 border-dark-600 
            hover:border-dark-500 
            transition-all duration-300
            transform hover:scale-[1.02] active:scale-95
            backdrop-blur-sm
            shadow-lg
          "
        >
          <span className="flex items-center justify-center gap-3">
            <span className="text-xl">🏠</span>
            <span>Retour au menu</span>
          </span>
        </button>
      </div>
    </div>
  );
};
