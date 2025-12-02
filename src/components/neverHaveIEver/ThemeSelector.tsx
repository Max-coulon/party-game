import React from 'react';
import { NheTheme } from '@/types';

interface ThemeSelectorProps {
  selectedThemes: NheTheme[];
  onToggleTheme: (theme: NheTheme) => void;
}

/**
 * Composant pour sélectionner les thèmes de questions
 */
export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedThemes,
  onToggleTheme,
}) => {
  const themes: Array<{
    value: NheTheme;
    label: string;
    emoji: string;
    description: string;
    color: string;
  }> = [
    {
      value: 'soirees',
      label: 'Soirées',
      emoji: '🎉',
      description: 'Moments embarrassants en soirée',
      color: 'from-pink-500 to-purple-500',
    },
    {
      value: 'amour',
      label: 'Amour & Ex',
      emoji: '💘',
      description: 'Relations amoureuses',
      color: 'from-red-500 to-pink-500',
    },
    {
      value: 'vacances',
      label: 'Vacances',
      emoji: '✈️',
      description: 'Expériences de voyage',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      value: 'travail',
      label: 'Travail / Études',
      emoji: '💼',
      description: 'Vie professionnelle et académique',
      color: 'from-gray-500 to-slate-500',
    },
    {
      value: 'general',
      label: 'Général',
      emoji: '🎯',
      description: 'Questions variées',
      color: 'from-green-500 to-teal-500',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🏷️</span>
        <h3 className="text-xl font-bold text-white">Thèmes</h3>
      </div>

      <p className="text-sm text-dark-400 mb-4">
        Sélectionnez des thèmes pour filtrer les questions (optionnel)
      </p>

      <div className="grid grid-cols-2 gap-3">
        {themes.map((theme) => {
          const isSelected = selectedThemes.includes(theme.value);

          return (
            <button
              key={theme.value}
              onClick={() => onToggleTheme(theme.value)}
              className={`
                relative p-4 rounded-2xl border-2
                transition-all duration-300
                transform hover:scale-[1.05] active:scale-95
                overflow-hidden
                ${
                  isSelected
                    ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                    : 'border-dark-600 hover:border-dark-500'
                }
              `}
            >
              {/* Background gradient si sélectionné */}
              {isSelected && (
                <div
                  className={`
                    absolute inset-0 opacity-20
                    bg-gradient-to-br ${theme.color}
                  `}
                />
              )}

              <div className="relative z-10">
                {/* Emoji et Checkbox */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{theme.emoji}</span>
                  <div
                    className={`
                      flex items-center justify-center w-6 h-6 rounded-full border-2
                      transition-all duration-200
                      ${
                        isSelected
                          ? 'bg-primary-500 border-primary-400 scale-110'
                          : 'bg-transparent border-dark-400'
                      }
                    `}
                  >
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-white"
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
                </div>

                {/* Label et Description */}
                <div className="text-left">
                  <h4 className="text-sm font-bold text-white mb-1">
                    {theme.label}
                  </h4>
                  <p className="text-xs text-dark-400 leading-tight">
                    {theme.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info */}
      <div className="p-3 bg-dark-800/50 rounded-xl border border-dark-700 mt-4">
        <p className="text-xs text-dark-400 text-center">
          {selectedThemes.length === 0
            ? '💡 Aucun thème = toutes les questions disponibles'
            : `✓ ${selectedThemes.length} thème${selectedThemes.length > 1 ? 's' : ''} sélectionné${selectedThemes.length > 1 ? 's' : ''}`}
        </p>
      </div>
    </div>
  );
};
