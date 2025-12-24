import React from "react";
import {
  PartyGuessTeam,
  PartyGuessCard,
  PartyGuessVariant,
  PARTY_GUESS_VARIANTS,
} from "@/types";
import { PartyGuessTimer } from "./PartyGuessTimer";
import { PartyGuessCardView } from "./PartyGuessCardView";
import { PartyGuessScoreboard } from "./PartyGuessScoreboard";

interface PartyGuessPlayProps {
  team: PartyGuessTeam;
  teams: PartyGuessTeam[];
  currentTeamIndex: number;
  variant: PartyGuessVariant;
  card: PartyGuessCard | null;
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
  cardsRemaining: number;
  skipsUsed: number;
  maxSkips: number;
  allowSkip: boolean;
  cardsFoundThisTurn: number;
  currentRound: number;
  totalRounds: number;
  onFound: () => void;
  onSkip: () => void;
}

/**
 * Écran de jeu actif
 */
export const PartyGuessPlay: React.FC<PartyGuessPlayProps> = ({
  team,
  teams,
  currentTeamIndex,
  variant,
  card,
  timeLeft,
  totalTime,
  isActive,
  cardsRemaining,
  skipsUsed,
  maxSkips,
  allowSkip,
  cardsFoundThisTurn,
  currentRound,
  totalRounds,
  onFound,
  onSkip,
}) => {
  const variantInfo = PARTY_GUESS_VARIANTS[variant];
  const skipsRemaining = maxSkips > 0 ? maxSkips - skipsUsed : null;
  const canSkip = allowSkip && cardsRemaining > 1;

  return (
    <div className="space-y-4">
      {/* Header équipe + manche */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
          style={{ backgroundColor: team.color }}
        >
          <span className="text-white font-bold">{team.name}</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-800 rounded-full border border-dark-700">
          <span>{variantInfo.icon}</span>
          <span className="text-dark-300 text-sm font-medium">
            {totalRounds > 1 ? `M${currentRound}/${totalRounds}` : variantInfo.name}
          </span>
        </div>
      </div>

      {/* Timer + stats */}
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">{cardsFoundThisTurn}</div>
          <div className="text-dark-400 text-xs">Trouvées</div>
        </div>

        <PartyGuessTimer
          timeLeft={timeLeft}
          totalTime={totalTime}
          isActive={isActive}
        />

        <div className="text-center">
          <div className="text-3xl font-bold text-primary-400">{cardsRemaining}</div>
          <div className="text-dark-400 text-xs">Restantes</div>
        </div>
      </div>

      {/* Carte actuelle */}
      {card ? (
        <div className="py-2">
          <PartyGuessCardView
            card={card}
            variant={variant}
            onFound={onFound}
            onSkip={onSkip}
            canSkip={canSkip}
            skipsRemaining={skipsRemaining}
          />
        </div>
      ) : (
        <div className="py-8 text-center">
          <span className="text-6xl animate-bounce">🎉</span>
          <p className="text-white text-xl font-bold mt-4">Plus de cartes !</p>
          <p className="text-dark-400">La manche est terminée</p>
        </div>
      )}

      {/* Mini scoreboard */}
      <div className="pt-2">
        <PartyGuessScoreboard
          teams={teams}
          currentTeamIndex={currentTeamIndex}
          compact
        />
      </div>
    </div>
  );
};
