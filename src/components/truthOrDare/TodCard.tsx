import React from 'react';
import { TodItem } from '@/types';

interface TodCardProps {
  card: TodItem;
  onComplete: () => void;
  onRefuse: () => void;
}

/**
 * Composant pour afficher une carte Action ou Vérité avec boutons de résolution
 */
export const TodCard: React.FC<TodCardProps> = ({ card, onComplete, onRefuse }) => {
  const isTruth = card.type === 'truth';
  
  // Couleurs selon le type
  const bgGradient = isTruth
    ? 'from-blue-600 to-blue-800'
    : 'from-orange-600 to-red-700';
  const borderColor = isTruth ? 'border-blue-400' : 'border-orange-400';
  const badgeBg = isTruth ? 'bg-blue-500' : 'bg-orange-500';
  const icon = isTruth ? '🤔' : '🔥';

  return (
    <div className="animate-scale-in">
      <div
        className={`relative p-4 md:p-6 rounded-2xl border-3 ${borderColor} bg-gradient-to-br ${bgGradient} shadow-2xl`}
      >
        {/* Badge Type */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div
            className={`${badgeBg} px-4 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5`}
          >
            <span className="text-lg">{icon}</span>
            <span className="text-white font-bold text-sm uppercase">
              {isTruth ? 'Vérité' : 'Action'}
            </span>
          </div>
        </div>

        {/* Niveau */}
        <div className="absolute top-2 right-3">
          <span className="text-white/70 text-xs font-semibold uppercase">
            {card.level}
          </span>
        </div>

        {/* Texte de la carte */}
        <div className="mt-6 mb-4">
          <p className="text-white text-lg md:text-xl font-bold text-center leading-snug">
            {card.text}
          </p>
        </div>

        {/* Boutons de résolution */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onComplete}
            className="flex-1 py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold text-base rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            {isTruth ? "✅ Répondu" : "✅ Fait"}
          </button>
          <button
            onClick={onRefuse}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold text-base rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            ❌ Refusé
          </button>
        </div>

        {/* Note personnalisée */}
        {card.isCustom && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
              🎨 Personnalisée
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
