import React from 'react';
import { QUESTION_COUNT_OPTIONS } from '@/hooks/useNeverHaveIEverGame';

interface NheQuestionCountSelectorProps {
  questionCount: number;
  onQuestionCountChange: (count: number) => void;
  totalAvailable: number; // Nombre total de questions disponibles
}

/**
 * Composant pour sélectionner le nombre de questions
 * 
 * Permet de choisir parmi des options prédéfinies ou "Toutes"
 * Design moderne avec boutons toggle
 */
export const NheQuestionCountSelector: React.FC<NheQuestionCountSelectorProps> = ({
  questionCount,
  onQuestionCountChange,
  totalAvailable,
}) => {
  return (
    <div className="space-y-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Nombre de questions
        </h3>
        <span className="text-sm text-dark-400">
          {totalAvailable} disponibles
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Options prédéfinies */}
        {QUESTION_COUNT_OPTIONS.map((count) => (
          <button
            key={count}
            onClick={() => onQuestionCountChange(count)}
            disabled={count > totalAvailable}
            className={`
              py-4 px-6 rounded-xl font-bold text-lg
              transition-all duration-300 transform
              ${
                questionCount === count
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105'
                  : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
              }
              ${
                count > totalAvailable
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:scale-105 active:scale-95 cursor-pointer'
              }
              border-2 ${
                questionCount === count
                  ? 'border-primary-500'
                  : 'border-dark-600 hover:border-dark-500'
              }
            `}
          >
            <div className="flex flex-col items-center gap-1">
              <span>{count}</span>
              <span className="text-xs font-normal opacity-75">questions</span>
            </div>
          </button>
        ))}

        {/* Option "Toutes" */}
        <button
          onClick={() => onQuestionCountChange(totalAvailable)}
          className={`
            col-span-2 py-4 px-6 rounded-xl font-bold text-lg
            transition-all duration-300 transform
            ${
              questionCount === totalAvailable
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
            }
            hover:scale-105 active:scale-95
            border-2 ${
              questionCount === totalAvailable
                ? 'border-purple-500'
                : 'border-dark-600 hover:border-dark-500'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <span>🔥</span>
            <span>Toutes les questions ({totalAvailable})</span>
          </div>
        </button>
      </div>

      {/* Info visuelle */}
      <div className="p-4 bg-dark-800/50 rounded-lg border border-dark-700">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1 text-sm text-dark-300">
            <p className="font-medium text-white mb-1">Conseil</p>
            <p>
              Pour une soirée rapide : <strong className="text-primary-400">10-20 questions</strong>
              <br />
              Pour s'amuser longtemps : <strong className="text-purple-400">30+ questions</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
