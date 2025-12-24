import React from "react";
import {
  PartyGuessTeam,
  PartyGuessVariant,
  PARTY_GUESS_VARIANTS,
} from "@/types";
import { PartyGuessScoreboard } from "./PartyGuessScoreboard";

interface PartyGuessBetweenTurnsProps {
  teams: PartyGuessTeam[];
  currentTeamIndex: number;
  variant: PartyGuessVariant;
  cardsRemaining: number;
  currentRound: number;
  totalRounds: number;
  onStartTurn: () => void;
  onEndGame: () => void;
}

/**
 * Écran entre les tours
 */
export const PartyGuessBetweenTurns: React.FC<PartyGuessBetweenTurnsProps> = ({
  teams,
  currentTeamIndex,
  variant,
  cardsRemaining,
  currentRound,
  totalRounds,
  onStartTurn,
  onEndGame,
}) => {
  const currentTeam = teams[currentTeamIndex];
  const variantInfo = PARTY_GUESS_VARIANTS[variant];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4 py-4">
        <div className="inline-block px-5 py-2 bg-dark-800 rounded-full border border-dark-600">
          <span className="text-dark-300 font-medium">
            {totalRounds > 1 ? `Manche ${currentRound} / ${totalRounds}` : variantInfo.name}
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-5xl block">{variantInfo.icon}</span>
          <p className="text-dark-300 text-lg">{variantInfo.rule}</p>
        </div>

        <div className="inline-flex items-center gap-2 bg-primary-500/20 px-4 py-2 rounded-full">
          <span className="text-xl">🃏</span>
          <span className="text-primary-300 font-semibold">
            {cardsRemaining} carte{cardsRemaining > 1 ? "s" : ""} restante
            {cardsRemaining > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Équipe active */}
      <div className="text-center animate-slide-up">
        <p className="text-dark-400 mb-2">C'est au tour de</p>
        <div
          className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl"
          style={{ backgroundColor: currentTeam.color }}
        >
          <span className="text-4xl">👥</span>
          <span className="text-white text-2xl font-bold">{currentTeam.name}</span>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <PartyGuessScoreboard
          teams={teams}
          currentTeamIndex={currentTeamIndex}
        />
      </div>

      {/* Boutons */}
      <div className="pt-4 space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <button
          onClick={onStartTurn}
          className="w-full py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3"
        >
          <span className="text-3xl">▶️</span>
          <span>Commencer le tour !</span>
        </button>

        <button
          onClick={onEndGame}
          className="w-full py-3 bg-transparent hover:bg-red-500/20 text-red-400 font-semibold rounded-xl border border-red-500/30 transition-all"
        >
          ⏹️ Terminer la partie
        </button>
      </div>
    </div>
  );
};
