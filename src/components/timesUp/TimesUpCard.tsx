import React from "react";
import { TimesUpCard as TimesUpCardType } from "@/types";

interface TimesUpCardProps {
  card: TimesUpCardType;
  roundNumber: number;
  onFound: () => void;
  onSkip: () => void;
  canSkip: boolean;
  skipsRemaining: number | null; // null = illimité
}

/**
 * Composant pour afficher une carte Time's Up pendant un tour
 */
export const TimesUpCard: React.FC<TimesUpCardProps> = ({
  card,
  roundNumber,
  onFound,
  onSkip,
  canSkip,
  skipsRemaining,
}) => {
  // Couleurs selon la manche
  const getRoundStyle = () => {
    switch (roundNumber) {
      case 1:
        return {
          gradient: "from-blue-600 to-blue-800",
          border: "border-blue-400",
          icon: "🗣️",
          label: "Description libre",
        };
      case 2:
        return {
          gradient: "from-orange-600 to-orange-800",
          border: "border-orange-400",
          icon: "☝️",
          label: "Un seul mot",
        };
      case 3:
        return {
          gradient: "from-purple-600 to-purple-800",
          border: "border-purple-400",
          icon: "🎭",
          label: "Mime",
        };
      default:
        return {
          gradient: "from-primary-600 to-primary-800",
          border: "border-primary-400",
          icon: "🎯",
          label: "Manche",
        };
    }
  };

  const style = getRoundStyle();

  return (
    <div className="animate-scale-in">
      <div
        className={`relative p-6 rounded-3xl border-4 ${style.border} bg-gradient-to-br ${style.gradient} shadow-2xl`}
      >
        {/* Badge manche */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-dark-800 px-4 py-2 rounded-full shadow-lg border-2 border-white/20 flex items-center gap-2">
            <span className="text-2xl">{style.icon}</span>
            <span className="text-white font-bold text-sm">{style.label}</span>
          </div>
        </div>

        {/* Mot à deviner */}
        <div className="mt-8 mb-8 min-h-[120px] flex items-center justify-center">
          <p className="text-white text-3xl md:text-4xl font-extrabold text-center leading-tight px-4">
            {card.word}
          </p>
        </div>

        {/* Indicateur carte personnalisée */}
        {card.isCustom && (
          <div className="absolute top-3 right-3">
            <span className="bg-purple-500/80 text-white text-xs px-2 py-1 rounded-full">
              🎨 Perso
            </span>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={onFound}
            className="flex-1 py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold text-xl rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2"
          >
            <span className="text-2xl">✅</span>
            <span>Trouvé !</span>
          </button>

          {canSkip && (
            <button
              onClick={onSkip}
              disabled={skipsRemaining === 0}
              className={`
                flex-1 py-4 font-bold text-xl rounded-2xl transition-all duration-200 
                transform hover:scale-105 active:scale-95 shadow-xl
                flex items-center justify-center gap-2
                ${
                  skipsRemaining === 0
                    ? "bg-dark-700 text-dark-500 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-dark-900"
                }
              `}
            >
              <span className="text-2xl">⏭️</span>
              <span>Passer</span>
              {skipsRemaining !== null && skipsRemaining > 0 && (
                <span className="text-sm bg-dark-900/30 px-2 py-0.5 rounded-full">
                  {skipsRemaining}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
