import React, { useState } from "react";

interface UndercoverMrWhiteGuessProps {
  mrWhiteName: string;
  onGuess: (guess: string) => void;
}

/**
 * Écran où Mr White tente de deviner le mot des Civils
 */
export const UndercoverMrWhiteGuess: React.FC<UndercoverMrWhiteGuessProps> = ({
  mrWhiteName,
  onGuess,
}) => {
  const [guess, setGuess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!guess.trim()) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      onGuess(guess.trim());
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header dramatique */}
      <div className="text-center py-6">
        <span className="text-8xl block mb-4 animate-bounce-slow">👻</span>
        <h2 className="text-3xl font-bold text-purple-400">
          Dernière chance !
        </h2>
        <p className="text-dark-400 mt-2">
          {mrWhiteName} tente de deviner le mot des Civils
        </p>
      </div>

      {/* Explication */}
      <div className="bg-purple-500/20 border border-purple-500/30 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-purple-300 font-semibold mb-2">
              Comment ça marche ?
            </p>
            <p className="text-dark-300 text-sm">
              Mr White a écouté les descriptions des autres joueurs pendant la partie.
              S'il devine correctement le mot des Civils, il gagne la partie !
            </p>
          </div>
        </div>
      </div>

      {/* Zone de saisie */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 border border-dark-700">
        <label className="text-white font-semibold block mb-4">
          Quel est le mot des Civils ?
        </label>
        
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Entre ta supposition..."
          disabled={isSubmitting}
          autoFocus
          className="w-full px-5 py-4 bg-dark-700 border-2 border-dark-600 rounded-xl text-white text-xl text-center placeholder-dark-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === "Enter" && guess.trim()) {
              handleSubmit();
            }
          }}
        />

        <p className="text-dark-500 text-xs text-center mt-3">
          Une seule tentative autorisée !
        </p>
      </div>

      {/* Bouton valider */}
      <button
        onClick={handleSubmit}
        disabled={!guess.trim() || isSubmitting}
        className={`w-full py-5 font-bold text-xl rounded-2xl transition-all transform shadow-xl flex items-center justify-center gap-3 ${
          guess.trim() && !isSubmitting
            ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:scale-105 active:scale-95"
            : "bg-dark-700 text-dark-500 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? (
          <>
            <span className="text-2xl animate-spin">⏳</span>
            <span>Vérification...</span>
          </>
        ) : (
          <>
            <span className="text-2xl">🎯</span>
            <span>Valider ma réponse</span>
          </>
        )}
      </button>

      {/* Avertissement */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-red-400 text-sm">
            Si tu te trompes, les Civils gagnent la partie !
          </p>
        </div>
      </div>
    </div>
  );
};
