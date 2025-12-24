import React from "react";
import { PartyGuessVariant, PARTY_GUESS_VARIANTS } from "@/types";

interface PartyGuessVariantPickerProps {
  onSelectVariant: (variant: PartyGuessVariant) => void;
  onBack: () => void;
}

/**
 * Écran de sélection du sous-mode
 */
export const PartyGuessVariantPicker: React.FC<PartyGuessVariantPickerProps> = ({
  onSelectVariant,
  onBack,
}) => {
  const variants = Object.entries(PARTY_GUESS_VARIANTS) as [
    PartyGuessVariant,
    typeof PARTY_GUESS_VARIANTS[PartyGuessVariant]
  ][];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4 py-4 animate-slide-down">
        <span className="text-6xl block animate-bounce-slow">🎯</span>
        <h2 className="text-3xl font-bold text-white">Party Guess</h2>
        <p className="text-dark-300 text-lg">Choisissez votre mode de jeu</p>
      </div>

      {/* Liste des variantes */}
      <div className="space-y-3">
        {variants.map(([key, variant], index) => (
          <button
            key={key}
            onClick={() => onSelectVariant(key)}
            className="w-full p-4 bg-gradient-to-br from-dark-700/70 to-dark-800/70 hover:from-primary-600/30 hover:to-primary-700/30 border-2 border-dark-600 hover:border-primary-500 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-left group animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                {variant.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">
                  {variant.name}
                </h3>
                <p className="text-dark-400 text-sm">{variant.description}</p>
              </div>
              <svg
                className="w-6 h-6 text-primary-400 transform group-hover:translate-x-2 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Bouton retour */}
      <div className="pt-4">
        <button
          onClick={onBack}
          className="w-full py-3 bg-transparent hover:bg-dark-800 text-dark-300 hover:text-white font-semibold rounded-xl border-2 border-dark-700 transition-all"
        >
          <div className="flex items-center justify-center gap-2">
            <span>🏠</span>
            <span>Retour au menu</span>
          </div>
        </button>
      </div>
    </div>
  );
};
