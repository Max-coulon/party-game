import React from 'react';

interface ChallengeDisplayProps {
  challenge: string;
}

/**
 * Composant pour afficher un défi/gage
 */
export const ChallengeDisplay: React.FC<ChallengeDisplayProps> = ({ challenge }) => {
  return (
    <div className="
      p-6 
      bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20
      border-3 border-yellow-400/50
      rounded-3xl
      shadow-2xl shadow-yellow-500/20
      backdrop-blur-sm
      animate-scale-in
      relative overflow-hidden
    ">
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      
      <div className="relative z-10 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl animate-bounce-slow">🎭</span>
          <h3 className="text-xl font-extrabold text-yellow-400 uppercase tracking-wider">
            Défi Bonus !
          </h3>
        </div>

        {/* Défi */}
        <div className="
          p-4 
          bg-dark-800/70 backdrop-blur-md
          rounded-2xl
          border border-yellow-500/30
        ">
          <p className="text-white text-center text-lg font-medium leading-relaxed">
            {challenge}
          </p>
        </div>

        {/* Info */}
        <p className="text-center text-sm text-yellow-300/80 font-medium">
          ⚡ En plus des gorgées habituelles
        </p>
      </div>
    </div>
  );
};
