import React from 'react';

interface TopBarProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

/**
 * Composant TopBar
 * Barre de navigation en haut de l'écran avec titre et bouton retour
 * Design moderne avec dégradé et ombres
 */
export const TopBar: React.FC<TopBarProps> = ({ 
  title, 
  onBack, 
  showBackButton = true 
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 shadow-2xl border-b-2 border-primary-500/20 backdrop-blur-sm">
      {/* Safe area for iPhone notch */}
      <div className="pt-safe" />
      <div className="flex items-center justify-between h-16 px-5 max-w-mobile-lg mx-auto">
        {/* Bouton retour avec animation */}
        <div className="w-12">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl hover:bg-white/10 active:bg-white/20 transition-all duration-200 transform hover:scale-110 active:scale-95"
              aria-label="Retour"
            >
              <svg 
                className="w-6 h-6 text-white drop-shadow-lg" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </button>
          )}
        </div>

        {/* Titre avec effet de texte */}
        <h1 className="flex-1 text-xl font-bold text-white text-center drop-shadow-lg tracking-wide">
          {title}
        </h1>

        {/* Espace pour équilibrer le layout */}
        <div className="w-12" />
      </div>
    </div>
  );
};
