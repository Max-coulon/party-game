import React from "react";
import { TimesUpTeam, TimesUpRoundNumber, TIMES_UP_ROUND_LABELS } from "@/types";
import { TimesUpScoreboard } from "./TimesUpScoreboard";

interface TimesUpRoundProps {
  teams: TimesUpTeam[];
  currentTeamIndex: number;
  currentRound: TimesUpRoundNumber;
  cardsRemaining: number;
  onStartTurn: () => void;
  onEndGame: () => void;
}

/**
 * Écran entre les tours - affiche les infos de manche et permet de démarrer
 */
export const TimesUpRound: React.FC<TimesUpRoundProps> = ({
  teams,
  currentTeamIndex,
  currentRound,
  cardsRemaining,
  onStartTurn,
  onEndGame,
}) => {
  const currentTeam = teams[currentTeamIndex];
  const roundInfo = TIMES_UP_ROUND_LABELS[currentRound];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Info manche */}
      <div className="text-center space-y-4 py-6">
        <div className="inline-block px-6 py-2 bg-dark-800 rounded-full border border-dark-600">
          <span className="text-dark-300 font-medium">
            Manche {currentRound} / 3
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-6xl block animate-bounce-slow">
            {roundInfo.icon}
          </span>
          <h2 className="text-3xl font-bold text-white">{roundInfo.name}</h2>
          <p className="text-dark-300 text-lg">{roundInfo.description}</p>
        </div>

        {/* Cartes restantes */}
        <div className="inline-flex items-center gap-2 bg-primary-500/20 px-4 py-2 rounded-full">
          <span className="text-2xl">🃏</span>
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
          <span className="text-white text-2xl font-bold">
            {currentTeam.name}
          </span>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <TimesUpScoreboard
          teams={teams}
          currentTeamIndex={currentTeamIndex}
          currentRound={currentRound}
        />
      </div>

      {/* Bouton démarrer */}
      <div
        className="pt-4 space-y-3 animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <button
          onClick={onStartTurn}
          className="w-full py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 text-white font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3"
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
