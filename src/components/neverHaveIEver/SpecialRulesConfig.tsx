import React from 'react';
import { NheSpecialRules } from '@/types';

interface SpecialRulesConfigProps {
  specialRules: NheSpecialRules;
  onToggleRule: (rule: keyof NheSpecialRules) => void;
}

/**
 * Composant pour configurer les règles spéciales
 */
export const SpecialRulesConfig: React.FC<SpecialRulesConfigProps> = ({
  specialRules,
  onToggleRule,
}) => {
  const rules: Array<{
    key: keyof NheSpecialRules;
    label: string;
    description: string;
    emoji: string;
  }> = [
    {
      key: 'doubleShot',
      label: 'Double Shot',
      description: 'Si tous sauf un boivent, le survivant boit 2 gorgées',
      emoji: '🎯',
    },
    {
      key: 'muteRule',
      label: 'Règle Mute',
      description: 'Refuser de répondre = 2 gorgées automatiques',
      emoji: '🤐',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⚡</span>
        <h3 className="text-xl font-bold text-white">Règles Spéciales</h3>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <button
            key={rule.key}
            onClick={() => onToggleRule(rule.key)}
            className={`
              w-full p-4 rounded-2xl border-2 text-left
              transition-all duration-300
              transform hover:scale-[1.02] active:scale-95
              ${
                specialRules[rule.key]
                  ? 'bg-gradient-to-r from-primary-600/30 to-primary-700/30 border-primary-500 shadow-lg shadow-primary-500/20'
                  : 'bg-dark-700/50 border-dark-600 hover:border-dark-500'
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* Emoji et Checkbox */}
              <div className="flex-shrink-0 flex items-center gap-3">
                <span className="text-3xl">{rule.emoji}</span>
                <div
                  className={`
                    flex items-center justify-center w-6 h-6 rounded-full border-2
                    transition-all duration-200
                    ${
                      specialRules[rule.key]
                        ? 'bg-primary-500 border-primary-400 scale-110'
                        : 'bg-transparent border-dark-400'
                    }
                  `}
                >
                  {specialRules[rule.key] && (
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

              {/* Texte */}
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-1">
                  {rule.label}
                </h4>
                <p className="text-sm text-dark-300">{rule.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Info supplémentaire */}
      <div className="p-3 bg-dark-800/50 rounded-xl border border-dark-700 mt-4">
        <p className="text-xs text-dark-400 text-center">
          💡 Ces règles rendent le jeu plus intense et imprévisible
        </p>
      </div>
    </div>
  );
};
