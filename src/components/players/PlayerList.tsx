import React from 'react';
import { Player } from '@/types';

interface PlayerListProps {
  players: Player[];
  showScores?: boolean;
}

/**
 * Composant simple pour afficher une liste de joueurs
 */
export const PlayerList: React.FC<PlayerListProps> = ({ 
  players, 
  showScores = false 
}) => {
  if (players.length === 0) {
    return (
      <div className="text-center py-8 text-dark-400">
        Aucun joueur
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {players.map((player) => (
        <div
          key={player.id}
          className="flex items-center justify-between p-4 bg-dark-700 rounded-lg"
        >
          <span className="text-white font-medium">{player.name}</span>
          {showScores && (
            <span className="text-primary-400 font-bold">
              {player.score} {player.score > 1 ? 'gorgées' : 'gorgée'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
