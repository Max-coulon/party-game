import React from "react";
import {
  TimesUpTeam,
  TimesUpCard as TimesUpCardType,
  TimesUpRoundNumber,
  TIMES_UP_ROUND_LABELS,
} from "@/types";
import { TimesUpTimer } from "./TimesUpTimer";
import { TimesUpCard } from "./TimesUpCard";
import { TimesUpScoreboard } from "./TimesUpScoreboard";

interface TimesUpTurnProps {
  team: TimesUpTeam;
  teams: TimesUpTeam[];
  currentTeamIndex: number;
  currentRound: TimesUpRoundNumber;
  card: TimesUpCardType | null;
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
  cardsRemaining: number;
  skipsUsed: number;
  maxSkips: number;
  allowSkip: boolean;
  cardsFoundThisTurn: number;
  onFound: () => void;
  onSkip: () => void;
}

/**
 * Écran de tour actif - affiche la carte, le timer et les contrôles
 */
export const TimesUpTurn: React.FC<TimesUpTurnProps> = ({
  team,
  teams,
  currentTeamIndex,
  currentRound,
  card,
  timeLeft,
  totalTime,
  isActive,
  cardsRemaining,
  skipsUsed,
  maxSkips,
  allowSkip,
  cardsFoundThisTurn,
  onFound,
  onSkip,
}) => {
  const roundInfo = TIMES_UP_ROUND_LABELS[currentRound];

  // Calcul des skips restants
  const skipsRemaining = maxSkips > 0 ? maxSkips - skipsUsed : null;

  // On ne peut pas passer s'il ne reste qu'une carte
  const canSkip = allowSkip && cardsRemaining > 1;

  return (
    <div className="space-y-4">
      {/* Header avec équipe et manche */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
          style={{ backgroundColor: team.color }}
        >
          <span className="text-white font-bold">{team.name}</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-800 rounded-full border border-dark-700">
          <span>{roundInfo.icon}</span>
          <span className="text-dark-300 text-sm font-medium">
            M{currentRound}
          </span>
        </div>
      </div>

      {/* Timer et stats */}
      <div className="flex items-center justify-center gap-8">
        {/* Cartes trouvées ce tour */}
        <div className="text-center">
          <div className="text-4xl font-bold text-green-400">
            {cardsFoundThisTurn}
          </div>
          <div className="text-dark-400 text-sm">Trouvées</div>
        </div>

        {/* Timer central */}
        <TimesUpTimer
          timeLeft={timeLeft}
          totalTime={totalTime}
          isActive={isActive}
        />

        {/* Cartes restantes */}
        <div className="text-center">
          <div className="text-4xl font-bold text-primary-400">
            {cardsRemaining}
          </div>
          <div className="text-dark-400 text-sm">Restantes</div>
        </div>
      </div>

      {/* Carte actuelle */}
      {card ? (
        <div className="py-4">
          <TimesUpCard
            card={card}
            roundNumber={currentRound}
            onFound={onFound}
            onSkip={onSkip}
            canSkip={canSkip}
            skipsRemaining={skipsRemaining}
          />
        </div>
      ) : (
        <div className="py-8 text-center">
          <span className="text-6xl animate-bounce">🎉</span>
          <p className="text-white text-xl font-bold mt-4">
            Plus de cartes !
          </p>
          <p className="text-dark-400">La manche est terminée</p>
        </div>
      )}

      {/* Mini scoreboard */}
      <div className="pt-2">
        <TimesUpScoreboard
          teams={teams}
          currentTeamIndex={currentTeamIndex}
          currentRound={currentRound}
          compact
        />
      </div>

      {/* Instruction manche */}
      <div className="text-center py-2">
        <p className="text-dark-400 text-sm bg-dark-800/50 inline-block px-4 py-2 rounded-full">
          {roundInfo.icon} {roundInfo.description}
        </p>
      </div>
    </div>
  );
};
