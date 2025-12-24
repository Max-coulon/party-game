import React, { useState } from "react";

interface TimesUpWordInputProps {
  onWordsChange: (words: string[]) => void;
  initialWords?: string[];
}

/**
 * Composant pour saisir des mots personnalisés
 */
export const TimesUpWordInput: React.FC<TimesUpWordInputProps> = ({
  onWordsChange,
  initialWords = [],
}) => {
  const [textValue, setTextValue] = useState(initialWords.join("\n"));
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextValue(value);

    // Parse les mots (1 par ligne, trim, sans doublons ni lignes vides)
    const words = value
      .split("\n")
      .map((w) => w.trim())
      .filter((w) => w.length > 0);
    const uniqueWords = [...new Set(words)];
    onWordsChange(uniqueWords);
  };

  const wordCount = textValue
    .split("\n")
    .map((w) => w.trim())
    .filter((w) => w.length > 0).length;

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-dark-700/50 rounded-xl border border-dark-600 hover:border-dark-500 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">✏️</span>
          <div className="text-left">
            <p className="text-white font-semibold">Mots personnalisés</p>
            <p className="text-dark-400 text-sm">
              {wordCount > 0
                ? `${wordCount} mot${wordCount > 1 ? "s" : ""} ajouté${
                    wordCount > 1 ? "s" : ""
                  }`
                : "Optionnel - Ajouter vos propres mots"}
            </p>
          </div>
        </div>
        <svg
          className={`w-6 h-6 text-dark-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="animate-slide-down space-y-3">
          <textarea
            value={textValue}
            onChange={handleTextChange}
            placeholder="Entrez un mot par ligne...&#10;Ex:&#10;Tour Eiffel&#10;Barack Obama&#10;Pizza"
            className="w-full h-48 bg-dark-700 border border-dark-600 rounded-xl p-4 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />

          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">
              💡 Un mot ou expression par ligne
            </span>
            <span
              className={`font-semibold ${
                wordCount >= 20 ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {wordCount} mot{wordCount > 1 ? "s" : ""}
            </span>
          </div>

          {wordCount > 0 && wordCount < 20 && (
            <p className="text-yellow-400/80 text-sm text-center">
              ⚠️ Au moins 20 mots recommandés pour une bonne partie
            </p>
          )}
        </div>
      )}
    </div>
  );
};
