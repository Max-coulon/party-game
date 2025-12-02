import React from 'react';
import { TodLevel } from '@/types';

interface TodLevelSelectorProps {
  enabledLevels: TodLevel[];
  onToggleLevel: (level: TodLevel) => void;
}

const LEVELS: Array<{
  key: TodLevel;
  label: string;
  emoji: string;
  description: string;
  color: string;
}> = [
  {
    key: 'soft',
    label: 'Soft',
    emoji: '😊',
    description: 'Doux et familial',
    color: 'from-green-500 to-green-700',
  },
  {
    key: 'hot',
    label: 'Hot',
    emoji: '🔥',
    description: 'Chaud et épicé',
    color: 'from-orange-500 to-red-600',
  },
  {
    key: 'hardcore',
    label: 'Hardcore',
    emoji: '🌶️',
    description: 'Extrême et osé',
    color: 'from-red-600 to-red-900',
  },
  {
    key: 'fun',
    label: 'Fun',
    emoji: '🎉',
    description: 'Amusant et léger',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    key: 'deep',
    label: 'Deep',
    emoji: '💭',
    description: 'Profond et émotionnel',
    color: 'from-purple-500 to-indigo-700',
  },
  {
    key: 'sexual',
    label: 'Sexual',
    emoji: '💋',
    description: 'Intime et coquin (couples)',
    color: 'from-pink-500 to-rose-700',
  },
];

/**
 * Composant pour sélectionner les niveaux de jeu
 */
export const TodLevelSelector: React.FC<TodLevelSelectorProps> = ({
  enabledLevels,
  onToggleLevel,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎯</span>
        <h3 className="text-xl font-bold text-white">Niveaux de jeu</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LEVELS.map((level) => {
          const isEnabled = enabledLevels.includes(level.key);
          
          return (
            <button
              key={level.key}
              onClick={() => onToggleLevel(level.key)}
              className={`
                relative p-4 rounded-2xl border-2 text-left
                transition-all duration-300 transform hover:scale-105 active:scale-95
                ${
                  isEnabled
                    ? `bg-gradient-to-br ${level.color} border-white shadow-lg`
                    : 'bg-dark-700 border-dark-600 hover:border-dark-500'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div
                  className={`
                    flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                    transition-all duration-200
                    ${
                      isEnabled
                        ? 'bg-white border-white'
                        : 'bg-transparent border-dark-400'
                    }
                  `}
                >
                  {isEnabled && (
                    <svg
                      className="w-4 h-4 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{level.emoji}</span>
                    <h4 className="text-lg font-bold text-white">
                      {level.label}
                    </h4>
                  </div>
                  <p
                    className={`text-sm ${
                      isEnabled ? 'text-white/90' : 'text-dark-300'
                    }`}
                  >
                    {level.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {enabledLevels.length === 0 && (
        <p className="text-center text-secondary-300 mt-4 text-sm">
          ⚠️ Sélectionnez au moins un niveau pour jouer
        </p>
      )}
    </div>
  );
};
