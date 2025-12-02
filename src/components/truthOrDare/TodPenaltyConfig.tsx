import React from 'react';
import { TodPenaltyType } from '@/types';

interface TodPenaltyConfigProps {
  penaltyType: TodPenaltyType;
  drinkValue?: number;
  pointsValue?: number;
  onPenaltyTypeChange: (type: TodPenaltyType) => void;
  onDrinkValueChange: (value: number) => void;
  onPointsValueChange: (value: number) => void;
}

/**
 * Composant pour configurer les pénalités en cas de refus
 */
export const TodPenaltyConfig: React.FC<TodPenaltyConfigProps> = ({
  penaltyType,
  drinkValue = 2,
  pointsValue = 1,
  onPenaltyTypeChange,
  onDrinkValueChange,
  onPointsValueChange,
}) => {
  const penaltyOptions: Array<{
    value: TodPenaltyType;
    label: string;
    emoji: string;
  }> = [
    { value: 'none', label: 'Aucune pénalité', emoji: '😌' },
    { value: 'drink', label: 'Gorgées', emoji: '🍺' },
    { value: 'points', label: 'Points de pénalité', emoji: '📉' },
    { value: 'both', label: 'Gorgées + Points', emoji: '💥' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⚖️</span>
        <h3 className="text-xl font-bold text-white">Pénalité en cas de refus</h3>
      </div>

      {/* Sélection du type */}
      <div className="grid grid-cols-2 gap-3">
        {penaltyOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onPenaltyTypeChange(option.value)}
            className={`
              p-4 rounded-xl border-2 text-center transition-all duration-300
              transform hover:scale-105 active:scale-95
              ${
                penaltyType === option.value
                  ? 'bg-primary-600 border-primary-400 shadow-lg'
                  : 'bg-dark-700 border-dark-600 hover:border-dark-500'
              }
            `}
          >
            <div className="text-3xl mb-2">{option.emoji}</div>
            <p className="text-white text-sm font-semibold">{option.label}</p>
          </button>
        ))}
      </div>

      {/* Configuration des valeurs */}
      {(penaltyType === 'drink' || penaltyType === 'both') && (
        <div className="bg-dark-800 p-4 rounded-xl border border-dark-700">
          <label className="block text-white font-semibold mb-2">
            🍺 Nombre de gorgées
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="5"
              value={drinkValue}
              onChange={(e) => onDrinkValueChange(Number(e.target.value))}
              className="flex-1 accent-primary-500"
            />
            <span className="text-white text-xl font-bold w-12 text-center">
              {drinkValue}
            </span>
          </div>
        </div>
      )}

      {(penaltyType === 'points' || penaltyType === 'both') && (
        <div className="bg-dark-800 p-4 rounded-xl border border-dark-700">
          <label className="block text-white font-semibold mb-2">
            📉 Points de pénalité
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              value={pointsValue}
              onChange={(e) => onPointsValueChange(Number(e.target.value))}
              className="flex-1 accent-primary-500"
            />
            <span className="text-white text-xl font-bold w-12 text-center">
              -{pointsValue}
            </span>
          </div>
        </div>
      )}

      {penaltyType === 'none' && (
        <div className="p-3 bg-dark-800/50 rounded-xl border border-dark-700">
          <p className="text-xs text-dark-400 text-center">
            💡 Aucune conséquence si un joueur refuse
          </p>
        </div>
      )}
    </div>
  );
};
