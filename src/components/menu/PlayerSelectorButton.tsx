import React from 'react';

interface PlayerSelectorButtonProps {
  playerCount: number;
  onClick: () => void;
}

/**
 * Bouton pour ouvrir la modal de sélection des joueurs
 * Affiche le nombre de joueurs sélectionnés
 * Design amélioré avec animations
 */
export const PlayerSelectorButton: React.FC<PlayerSelectorButtonProps> = ({ 
  playerCount, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className="
        w-full p-6 
        bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 
        hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 
        active:from-primary-800 active:to-primary-900 
        text-white rounded-2xl 
        shadow-2xl shadow-primary-500/30
        transition-all duration-300 
        transform hover:scale-[1.03] active:scale-95
        border-2 border-primary-500/50
        relative overflow-hidden
        group
      "
    >
      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icône améliorée */}
          <div className="
            flex items-center justify-center 
            w-14 h-14 
            bg-white/25 backdrop-blur-sm
            rounded-xl 
            shadow-lg
            transform group-hover:scale-110 group-hover:rotate-6
            transition-all duration-300
          ">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          
          {/* Texte amélioré */}
          <div className="text-left">
            <p className="text-sm font-semibold opacity-90 uppercase tracking-wide">Gérer les joueurs</p>
            <p className="text-xl font-extrabold mt-1">
              {playerCount === 0 ? (
                <span className="text-yellow-300 animate-pulse-slow">⚠️ Aucun joueur</span>
              ) : (
                <span>{playerCount} joueur{playerCount > 1 ? 's' : ''} ✓</span>
              )}
            </p>
          </div>
        </div>
        
        {/* Flèche animée */}
        <svg 
          className="w-7 h-7 transform group-hover:translate-x-2 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};
