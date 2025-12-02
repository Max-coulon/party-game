import React from 'react';
import { Game } from '@/types';

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

/**
 * Carte représentant un jeu dans le menu
 * Design amélioré avec animations et effets visuels
 */
export const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        w-full p-6 
        bg-gradient-to-br from-dark-700/70 to-dark-800/70 
        hover:from-primary-600/30 hover:to-primary-700/30 
        border-2 border-dark-600 
        hover:border-primary-500 
        rounded-3xl 
        transition-all duration-300 
        transform hover:scale-[1.03] active:scale-95 
        shadow-xl hover:shadow-2xl hover:shadow-primary-500/20
        backdrop-blur-sm
        relative overflow-hidden
        group
      "
    >
      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      
      <div className="relative z-10 flex items-center gap-5">
        {/* Icône du jeu avec animation */}
        <div className="
          flex items-center justify-center 
          w-20 h-20 
          bg-gradient-to-br from-primary-500 to-primary-700 
          rounded-2xl 
          text-4xl 
          shadow-2xl shadow-primary-500/30
          transform group-hover:scale-110 group-hover:rotate-6
          transition-all duration-300
        ">
          {game.icon}
        </div>

        {/* Infos du jeu */}
        <div className="flex-1 text-left">
          <h3 className="text-2xl font-extrabold text-white mb-1 group-hover:text-primary-300 transition-colors">
            {game.name}
          </h3>
          <p className="text-sm text-dark-300 mb-3 font-medium">{game.description}</p>
          <div className="flex items-center gap-2 text-xs text-dark-400 bg-dark-800/50 rounded-full px-3 py-1 inline-flex">
            <span>👥</span>
            <span className="font-semibold">{game.minPlayers}+ joueurs</span>
          </div>
        </div>

        {/* Flèche animée */}
        <svg 
          className="w-7 h-7 text-primary-400 transform group-hover:translate-x-2 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </div>
    </button>
  );
};
