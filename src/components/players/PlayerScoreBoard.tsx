import React from 'react';
import { Player } from '@/types';

interface PlayerScoreBoardProps {
  players: Player[];
}

/**
 * Composant affichant le classement des joueurs
 * Utilisé en fin de partie
 */
export const PlayerScoreBoard: React.FC<PlayerScoreBoardProps> = ({ players }) => {
  // Trier les joueurs par score décroissant
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getMedalEmoji = (index: number): string => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  const getPositionClass = (index: number): string => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500';
    if (index === 1) return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400';
    if (index === 2) return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500';
    return 'bg-dark-700 border-dark-600';
  };

  return (
    <div className="space-y-3">
      {sortedPlayers.map((player, index) => (
        <div
          key={player.id}
          className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all ${getPositionClass(index)}`}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10">
              {getMedalEmoji(index) ? (
                <span className="text-3xl">{getMedalEmoji(index)}</span>
              ) : (
                <span className="text-xl font-bold text-dark-400">#{index + 1}</span>
              )}
            </div>
            
            {/* Avatar animé */}
            <div className="text-3xl transform hover:scale-125 hover:rotate-12 transition-all duration-300">
              {player.avatar}
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white">{player.name}</h3>
              {index === 0 && (
                <p className="text-sm text-yellow-400 font-semibold">Champion(ne) !</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{player.score}</p>
            <p className="text-sm text-dark-400">
              {player.score > 1 ? 'gorgées' : 'gorgée'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
