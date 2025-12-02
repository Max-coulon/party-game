import React from 'react';
import { NheMode } from '@/types';

interface NheModeSelectorProps {
  selectedModes: NheMode[];
  onToggleMode: (mode: NheMode) => void;
}

const modeConfig = {
  soft: {
    label: 'Soft',
    emoji: '😊',
    description: 'Questions légères et fun',
    color: 'from-mode-soft-light to-mode-soft',
    hoverColor: 'hover:from-mode-soft hover:to-mode-soft-dark',
    borderColor: 'border-mode-soft',
    bgInactive: 'bg-dark-700/50',
  },
  hot: {
    label: 'Hot',
    emoji: '🔥',
    description: 'Questions osées',
    color: 'from-mode-hot-light to-mode-hot',
    hoverColor: 'hover:from-mode-hot hover:to-mode-hot-dark',
    borderColor: 'border-mode-hot',
    bgInactive: 'bg-dark-700/50',
  },
  hardcore: {
    label: 'Hardcore',
    emoji: '💀',
    description: 'Questions extrêmes',
    color: 'from-mode-hardcore-light to-mode-hardcore',
    hoverColor: 'hover:from-mode-hardcore hover:to-mode-hardcore-dark',
    borderColor: 'border-mode-hardcore',
    bgInactive: 'bg-dark-700/50',
  },
};

/**
 * Composant pour sélectionner les modes de jeu avec design moderne
 * Utilise les couleurs thématiques définies dans tailwind.config.js
 */
export const NheModeSelector: React.FC<NheModeSelectorProps> = ({ 
  selectedModes, 
  onToggleMode 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>🎯</span>
        <span>Choisis les modes de jeu</span>
      </h3>
      
      {(Object.keys(modeConfig) as NheMode[]).map((mode) => {
        const config = modeConfig[mode];
        const isSelected = selectedModes.includes(mode);
        
        return (
          <button
            key={mode}
            onClick={() => onToggleMode(mode)}
            className={`
              w-full p-6 rounded-2xl border-2 transition-all duration-300 transform
              ${
                isSelected
                  ? `bg-gradient-to-r ${config.color} ${config.borderColor} shadow-2xl scale-105`
                  : `${config.bgInactive} border-dark-600 hover:border-dark-500`
              }
              hover:scale-105 active:scale-95 cursor-pointer
              backdrop-blur-sm
            `}
          >
            <div className="flex items-center gap-4">
              {/* Emoji avec animation */}
              <div className={`flex items-center justify-center w-16 h-16 rounded-xl text-4xl transition-transform ${isSelected ? 'animate-bounce-slow' : ''}`}
                style={{ 
                  background: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {config.emoji}
              </div>

              {/* Texte */}
              <div className="flex-1 text-left">
                <h4 className="text-2xl font-bold text-white mb-1">
                  {config.label}
                </h4>
                <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-dark-400'} transition-colors`}>
                  {config.description}
                </p>
              </div>

              {/* Checkbox moderne */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isSelected
                    ? 'bg-white border-white scale-110'
                    : 'bg-transparent border-dark-400'
                }`}
              >
                {isSelected && (
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
