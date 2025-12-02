import React from 'react';
import { NheQuestion } from '@/types';

interface NheQuestionViewProps {
  question: NheQuestion;
  questionNumber: number;
  totalQuestions: number;
}

const modeStyles = {
  soft: {
    bg: 'from-mode-soft/20 via-mode-soft/15 to-mode-soft/10',
    border: 'border-mode-soft',
    text: 'text-mode-soft-light',
    emoji: '😊',
    glow: 'shadow-mode-soft/50',
  },
  hot: {
    bg: 'from-mode-hot/20 via-mode-hot/15 to-mode-hot/10',
    border: 'border-mode-hot',
    text: 'text-mode-hot-light',
    emoji: '🔥',
    glow: 'shadow-mode-hot/50',
  },
  hardcore: {
    bg: 'from-mode-hardcore/20 via-mode-hardcore/15 to-mode-hardcore/10',
    border: 'border-mode-hardcore',
    text: 'text-mode-hardcore-light',
    emoji: '💀',
    glow: 'shadow-mode-hardcore/50',
  },
};

/**
 * Composant pour afficher une question du jeu "Je n'ai jamais"
 * Avec animations et design moderne amélioré
 */
export const NheQuestionView: React.FC<NheQuestionViewProps> = ({ 
  question, 
  questionNumber, 
  totalQuestions 
}) => {
  const style = modeStyles[question.mode];
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress bar améliorée */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-primary-400">Question {questionNumber}</span>
          <span className="text-dark-400">{questionNumber} / {totalQuestions}</span>
        </div>
        <div className="relative w-full h-3 bg-dark-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-dark-600">
          {/* Barre de progression avec animation */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          >
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Carte de question avec effet 3D */}
      <div className={`
        p-8 bg-gradient-to-br ${style.bg} 
        border-2 ${style.border} rounded-3xl 
        shadow-2xl ${style.glow}
        backdrop-blur-lg
        transform transition-all duration-300
        hover:scale-[1.02] hover:shadow-3xl
        relative overflow-hidden
      `}>
        {/* Effet de particules en arrière-plan */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full blur-3xl" />
        </div>

        {/* Contenu de la carte */}
        <div className="relative z-10">
          {/* Badge du mode avec animation */}
          <div className="flex items-center justify-center gap-3 mb-6 animate-scale-in">
            <span className="text-3xl animate-bounce-slow">{style.emoji}</span>
            <span className={`text-base font-bold uppercase tracking-widest ${style.text} drop-shadow-lg`}>
              {question.mode}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 leading-relaxed animate-slide-up drop-shadow-lg">
            {question.text}
          </h2>

          {/* Gorgées avec design amélioré */}
          <div className="flex items-center justify-center gap-4 p-5 bg-dark-800/70 backdrop-blur-md rounded-2xl border border-dark-600 shadow-inner">
            <span className="text-4xl animate-pulse-slow">🍺</span>
            <div className="text-center">
              <p className="text-4xl font-extrabold text-white drop-shadow-lg">{question.sips}</p>
              <p className="text-sm text-dark-300 font-medium uppercase tracking-wide">
                {question.sips > 1 ? 'gorgées' : 'gorgée'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
