import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Composant PageContainer
 * Container principal pour les pages avec layout mobile-first centré
 * Design moderne avec fond animé et dégradés
 */
export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 relative overflow-hidden ${className}`}>
      {/* Effet de particules en arrière-plan (optionnel, design moderne) */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-32 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Contenu principal centré avec padding-top pour la TopBar fixe */}
      <div className="max-w-mobile-lg mx-auto relative z-10 pt-16">
        {children}
      </div>
    </div>
  );
};
