import React from 'react';
import { Player } from '@/types';

interface TodPlayerTurnProps {
  player: Player;
  roundNumber: number;
  totalRounds?: number;
}

/**
 * Composant pour afficher le joueur dont c'est le tour
 */
export const TodPlayerTurn: React.FC<TodPlayerTurnProps> = ({
  player,
  roundNumber,
  totalRounds,
}) => {
  return (
    <div className="text-center space-y-4 animate-slide-down">
      {/* Tour indicator */}
      <div className="inline-block bg-dark-800 px-6 py-2 rounded-full border-2 border-primary-500">
        <span className="text-primary-300 font-semibold">
          {totalRounds ? `Tour ${roundNumber} / ${totalRounds}` : `Tour ${roundNumber}`}
        </span>
      </div>

      {/* Player info */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 rounded-3xl border-4 border-primary-400 shadow-2xl">
        <p className="text-white/80 text-lg mb-2">C'est au tour de :</p>
        <div className="flex items-center justify-center gap-4">
          <span className="text-6xl animate-bounce-slow">{player.avatar}</span>
          <h2 className="text-white text-4xl font-bold">{player.name}</h2>
        </div>
      </div>

      {/* Instruction */}
      <p className="text-dark-300 text-lg animate-pulse">
        ⬇️ Choisis Action ou Vérité ⬇️
      </p>
    </div>
  );
};
