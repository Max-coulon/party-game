import React, { useState } from "react";
import {
  PartyGuessCard,
  PartyGuessCardWord,
  PartyGuessCardLyrics,
  PartyGuessCardSong,
  PartyGuessVariant,
  PARTY_GUESS_VARIANTS,
} from "@/types";

interface PartyGuessCardViewProps {
  card: PartyGuessCard;
  variant: PartyGuessVariant;
  onFound: () => void;
  onSkip: () => void;
  canSkip: boolean;
  skipsRemaining: number | null;
}

/**
 * Affichage d'une carte selon le type et la variante
 */
export const PartyGuessCardView: React.FC<PartyGuessCardViewProps> = ({
  card,
  variant,
  onFound,
  onSkip,
  canSkip,
  skipsRemaining,
}) => {
  const variantInfo = PARTY_GUESS_VARIANTS[variant];
  const [showAnswer, setShowAnswer] = useState(false);

  // Couleurs selon variante
  const getVariantColors = () => {
    switch (variant) {
      case "interdit":
        return { gradient: "from-red-600 to-red-800", border: "border-red-400" };
      case "mime":
        return { gradient: "from-purple-600 to-purple-800", border: "border-purple-400" };
      case "oneWord":
        return { gradient: "from-blue-600 to-blue-800", border: "border-blue-400" };
      case "lyrics":
        return { gradient: "from-pink-600 to-pink-800", border: "border-pink-400" };
      case "singIt":
        return { gradient: "from-green-600 to-green-800", border: "border-green-400" };
      case "celebrities":
        return { gradient: "from-yellow-600 to-yellow-800", border: "border-yellow-400" };
      case "sports":
        return { gradient: "from-orange-600 to-orange-800", border: "border-orange-400" };
      default:
        return { gradient: "from-primary-600 to-primary-800", border: "border-primary-400" };
    }
  };

  const colors = getVariantColors();

  // Rendu du contenu selon le type de carte
  const renderCardContent = () => {
    switch (card.type) {
      case "word":
        return (
          <div className="text-center py-8">
            <p className="text-white text-4xl md:text-5xl font-extrabold leading-tight px-4">
              {(card as PartyGuessCardWord).word}
            </p>
          </div>
        );

      case "lyrics": {
        const lyricsCard = card as PartyGuessCardLyrics;
        return (
          <div className="text-center py-6 space-y-4">
            <div className="text-dark-300 text-sm font-medium uppercase tracking-wider">
              Début des paroles
            </div>
            <p className="text-white text-2xl md:text-3xl font-bold leading-snug px-4 italic">
              "{lyricsCard.promptStart}"
            </p>
            
            {lyricsCard.expectedContinuation && (
              <div className="mt-6">
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="text-sm text-dark-400 hover:text-white underline transition-colors"
                >
                  {showAnswer ? "Masquer la réponse" : "Afficher la réponse"}
                </button>
                {showAnswer && (
                  <p className="mt-3 text-green-400 text-lg font-medium animate-fade-in">
                    {lyricsCard.expectedContinuation}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      }

      case "song": {
        const songCard = card as PartyGuessCardSong;
        return (
          <div className="text-center py-6 space-y-3">
            <div className="text-dark-300 text-sm font-medium uppercase tracking-wider">
              Chante cette chanson
            </div>
            <p className="text-white text-3xl md:text-4xl font-extrabold leading-tight px-4">
              {songCard.title}
            </p>
            <p className="text-dark-300 text-xl font-medium">
              par <span className="text-white">{songCard.artist}</span>
            </p>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="animate-scale-in">
      <div
        className={`relative p-5 rounded-3xl border-4 ${colors.border} bg-gradient-to-br ${colors.gradient} shadow-2xl`}
      >
        {/* Badge variante */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-dark-800 px-4 py-2 rounded-full shadow-lg border-2 border-white/20 flex items-center gap-2">
            <span className="text-xl">{variantInfo.icon}</span>
            <span className="text-white font-bold text-sm">{variantInfo.name}</span>
          </div>
        </div>

        {/* Règle du mode */}
        <div className="mt-6 mb-2 text-center">
          <span className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            {variantInfo.rule}
          </span>
        </div>

        {/* Contenu de la carte */}
        <div className="min-h-[140px] flex items-center justify-center">
          {renderCardContent()}
        </div>

        {/* Badge personnalisé */}
        {card.isCustom && (
          <div className="absolute top-3 right-3">
            <span className="bg-purple-500/80 text-white text-xs px-2 py-1 rounded-full">
              🎨 Perso
            </span>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={onFound}
            className="flex-1 py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2"
          >
            <span className="text-2xl">✅</span>
            <span>Trouvé !</span>
          </button>

          {canSkip && (
            <button
              onClick={onSkip}
              disabled={skipsRemaining === 0}
              className={`flex-1 py-4 font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 ${
                skipsRemaining === 0
                  ? "bg-dark-700 text-dark-500 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-dark-900"
              }`}
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
