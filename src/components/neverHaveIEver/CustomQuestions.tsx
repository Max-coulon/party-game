import React, { useState } from 'react';
import { NheMode, NheQuestion } from '@/types';

interface CustomQuestionsProps {
  customQuestions: NheQuestion[];
  onAddQuestion: (text: string, mode: NheMode, sips: number) => void;
  onRemoveQuestion: (id: string) => void;
}

/**
 * Composant pour gérer les questions personnalisées
 */
export const CustomQuestions: React.FC<CustomQuestionsProps> = ({
  customQuestions,
  onAddQuestion,
  onRemoveQuestion,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedMode, setSelectedMode] = useState<NheMode>('soft');
  const [sips, setSips] = useState(2);

  const handleAdd = () => {
    if (newQuestion.trim()) {
      onAddQuestion(newQuestion.trim(), selectedMode, sips);
      setNewQuestion('');
      setSips(2);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header avec toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="
          w-full p-4 
          bg-dark-700/50 hover:bg-dark-700
          border-2 border-dark-600 hover:border-primary-500
          rounded-2xl
          transition-all duration-300
          flex items-center justify-between
        "
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">✍️</span>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white">Questions Personnalisées</h3>
            <p className="text-sm text-dark-400">
              {customQuestions.length} question{customQuestions.length !== 1 ? 's' : ''} ajoutée{customQuestions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <svg
          className={`w-6 h-6 text-primary-400 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Contenu expansible */}
      {isExpanded && (
        <div className="space-y-4 animate-slide-down">
          {/* Formulaire d'ajout */}
          <div className="p-4 bg-dark-800/50 rounded-2xl border border-dark-700 space-y-4">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Je n'ai jamais..."
              className="
                w-full px-4 py-3
                bg-dark-700 text-white
                rounded-xl border-2 border-dark-600
                focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
                transition-all duration-200
                placeholder:text-dark-400
                resize-none
              "
              rows={3}
            />

            {/* Mode et gorgées */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm text-dark-400 mb-2">Mode</label>
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value as NheMode)}
                  className="
                    w-full px-4 py-2
                    bg-dark-700 text-white
                    rounded-xl border-2 border-dark-600
                    focus:border-primary-500 focus:outline-none
                    transition-all duration-200
                  "
                >
                  <option value="soft">😊 Soft</option>
                  <option value="hot">🔥 Hot</option>
                  <option value="hardcore">💀 Hardcore</option>
                </select>
              </div>

              <div className="w-32">
                <label className="block text-sm text-dark-400 mb-2">Gorgées</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={sips}
                  onChange={(e) => setSips(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  className="
                    w-full px-4 py-2
                    bg-dark-700 text-white text-center
                    rounded-xl border-2 border-dark-600
                    focus:border-primary-500 focus:outline-none
                    transition-all duration-200
                  "
                />
              </div>
            </div>

            {/* Bouton d'ajout */}
            <button
              onClick={handleAdd}
              disabled={!newQuestion.trim()}
              className="
                w-full py-3
                bg-gradient-to-r from-primary-600 to-primary-700
                hover:from-primary-700 hover:to-primary-800
                disabled:from-dark-600 disabled:to-dark-700
                disabled:cursor-not-allowed disabled:opacity-50
                text-white font-bold rounded-xl
                shadow-lg
                transition-all duration-300
                transform hover:scale-[1.02] active:scale-95
              "
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-xl">+</span>
                <span>Ajouter la question</span>
              </span>
            </button>
          </div>

          {/* Liste des questions personnalisées */}
          {customQuestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-dark-400 px-2">
                Questions ajoutées ({customQuestions.length})
              </p>
              {customQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="
                    p-3 bg-dark-700/50 rounded-xl
                    border border-dark-600
                    flex items-start gap-3
                    animate-slide-up
                  "
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1">
                    <p className="text-white text-sm mb-1">{question.text}</p>
                    <div className="flex items-center gap-2 text-xs text-dark-400">
                      <span className={`
                        px-2 py-0.5 rounded-full
                        ${question.mode === 'soft' ? 'bg-green-500/20 text-green-400' : ''}
                        ${question.mode === 'hot' ? 'bg-orange-500/20 text-orange-400' : ''}
                        ${question.mode === 'hardcore' ? 'bg-purple-500/20 text-purple-400' : ''}
                      `}>
                        {question.mode}
                      </span>
                      <span>🍺 {question.sips}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveQuestion(question.id)}
                    className="
                      p-1.5 rounded-lg
                      text-red-400 hover:bg-red-400/10
                      transition-all duration-200
                      transform hover:scale-110
                    "
                    aria-label="Supprimer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
