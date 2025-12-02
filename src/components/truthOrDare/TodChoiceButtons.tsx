import React from 'react';
import { TruthOrDareType } from '@/types';

interface TodChoiceButtonsProps {
  onChoose: (choice: TruthOrDareType) => void;
  disabled?: boolean;
}

/**
 * Composant pour les deux gros boutons Action / Vérité
 */
export const TodChoiceButtons: React.FC<TodChoiceButtonsProps> = ({
  onChoose,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* Bouton Vérité */}
      <button
        onClick={() => onChoose('truth')}
        disabled={disabled}
        className="group relative p-8 bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 active:from-blue-700 active:to-blue-900 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-3xl border-4 border-blue-400 shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:transform-none"
      >
        <div className="text-center space-y-4">
          <div className="text-7xl animate-wiggle">🤔</div>
          <h3 className="text-white text-3xl font-bold uppercase tracking-wider">
            Vérité
          </h3>
          <p className="text-blue-200 text-sm">
            Réponds honnêtement à une question
          </p>
        </div>
        
        {/* Effet de brillance au survol */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-tr from-transparent via-white to-transparent"></div>
      </button>

      {/* Bouton Action */}
      <button
        onClick={() => onChoose('dare')}
        disabled={disabled}
        className="group relative p-8 bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 active:from-orange-700 active:to-red-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-3xl border-4 border-orange-400 shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:transform-none"
      >
        <div className="text-center space-y-4">
          <div className="text-7xl animate-wiggle" style={{ animationDelay: '0.2s' }}>
            🔥
          </div>
          <h3 className="text-white text-3xl font-bold uppercase tracking-wider">
            Action
          </h3>
          <p className="text-orange-200 text-sm">
            Réalise un défi ou une épreuve
          </p>
        </div>
        
        {/* Effet de brillance au survol */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-tr from-transparent via-white to-transparent"></div>
      </button>
    </div>
  );
};
