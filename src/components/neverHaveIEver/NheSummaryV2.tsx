import React, { useEffect } from 'react';
import { Player } from '@/types';
import { PlayerScoreBoard } from '@/components/players/PlayerScoreBoard';

interface NheSummaryV2Props {
  players: Player[];
  onRestart: () => void;
  onReplayWithSameSettings: () => void;
  onBackToMenu: () => void;
}

/**
 * Écran de fin amélioré avec confettis et options de rejeu
 */
export const NheSummaryV2: React.FC<NheSummaryV2Props> = ({
  players,
  onRestart,
  onReplayWithSameSettings,
  onBackToMenu,
}) => {
  // Trouver le joueur avec le plus de points
  const winner = [...players].sort((a, b) => b.score - a.score)[0];

  // Effet confettis à l'ouverture
  useEffect(() => {
    // Vous pouvez ajouter une librairie de confettis ici (ex: canvas-confetti)
    // ou utiliser une animation CSS pure
  }, []);

  return (
    <div className="space-y-8 animate-fade-in relative overflow-hidden">
      {/* Confettis animés en arrière-plan */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl animate-bounce-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          >
            {['🎉', '🎊', '✨', '🎈', '🏆'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Header avec animation */}
      <div className="text-center space-y-4 py-8 animate-slide-down relative z-10">
        <div className="relative inline-block">
          <div className="text-8xl animate-bounce-slow">🎉</div>
          {/* Confettis décoratifs */}
          <span className="absolute -top-4 -left-4 text-4xl animate-pulse-slow">✨</span>
          <span
            className="absolute -top-4 -right-4 text-4xl animate-pulse-slow"
            style={{ animationDelay: '0.5s' }}
          >
            🎊
          </span>
          <span
            className="absolute -bottom-2 left-0 text-3xl animate-bounce"
            style={{ animationDelay: '0.3s' }}
          >
            🎈
          </span>
          <span
            className="absolute -bottom-2 right-0 text-3xl animate-bounce"
            style={{ animationDelay: '0.7s' }}
          >
            🎈
          </span>
        </div>
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 animate-scale-in">
          Partie terminée !
        </h2>
        <p className="text-lg text-dark-300 font-medium">Voici le classement final</p>
      </div>

      {/* Classement */}
      <div className="animate-slide-up relative z-10">
        <PlayerScoreBoard players={players} />
      </div>

      {/* Message du cul sec */}
      {winner && winner.score > 0 && (
        <div
          className="
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
          z-10
        "
        >
          {/* Effet de brillance */}
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

      {/* Options de rejeu améliorées */}
      <div className="space-y-3 pt-4 animate-fade-in relative z-10">
        {/* Rejouer avec mêmes paramètres */}
        <button
          onClick={onReplayWithSameSettings}
          className="
            w-full py-5
            bg-gradient-to-r from-green-600 via-green-700 to-green-800
            hover:from-green-700 hover:via-green-800 hover:to-green-900
            active:from-green-800 active:to-green-900
            text-white text-xl font-bold rounded-2xl
            shadow-2xl shadow-green-500/30
            transition-all duration-300
            transform hover:scale-[1.03] active:scale-95
            border-2 border-green-500/50
            relative overflow-hidden
            group
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="relative flex items-center justify-center gap-3">
            <span className="text-2xl">🔄</span>
            <span>Rejouer à l'identique</span>
          </span>
        </button>

        {/* Nouvelle partie avec mêmes joueurs */}
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
            <span className="text-2xl">🎮</span>
            <span>Nouvelle partie</span>
          </span>
        </button>

        {/* Retour au menu */}
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

      {/* Petit texte encourageant */}
      <div className="text-center text-dark-400 text-sm pt-4 relative z-10">
        <p>Merci d'avoir joué ! 🎉</p>
        <p className="text-xs mt-2">Les statistiques ont été mises à jour</p>
      </div>
    </div>
  );
};
