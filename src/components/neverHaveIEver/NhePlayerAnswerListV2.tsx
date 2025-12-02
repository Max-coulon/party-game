import React, { useState } from 'react';
import { Player } from '@/types';

interface NhePlayerAnswerListV2Props {
  players: Player[];
  muteRuleActive: boolean;
  onSubmit: (selectedPlayerIds: string[], mutedPlayerIds: string[]) => void;
  onNext: () => void;
}

/**
 * Version améliorée avec support de la règle Mute
 */
export const NhePlayerAnswerListV2: React.FC<NhePlayerAnswerListV2Props> = ({
  players,
  muteRuleActive,
  onSubmit,
  onNext,
}) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());
  const [mutedPlayers, setMutedPlayers] = useState<Set<string>>(new Set());

  const togglePlayer = (playerId: string) => {
    // Si le joueur est muted, on le démute d'abord
    if (mutedPlayers.has(playerId)) {
      setMutedPlayers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(playerId);
        return newSet;
      });
    }

    setSelectedPlayers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });
  };

  const toggleMute = (playerId: string) => {
    // Si le joueur est sélectionné, on le désélectionne d'abord
    if (selectedPlayers.has(playerId)) {
      setSelectedPlayers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(playerId);
        return newSet;
      });
    }

    setMutedPlayers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    onSubmit(Array.from(selectedPlayers), Array.from(mutedPlayers));
    setSelectedPlayers(new Set());
    setMutedPlayers(new Set());
    onNext();
  };

  return (
    <div className="space-y-3 animate-fade-in">
      {/* En-tête */}
      <div className="text-center space-y-1 animate-slide-down">
        <span className="text-3xl animate-bounce-slow inline-block">🤔</span>
        <h3 className="text-base font-bold text-white">Qui a déjà fait ça ?</h3>
        {muteRuleActive && (
          <p className="text-xs text-yellow-400">🤐 Appui long = mute (2 gorgées)</p>
        )}
      </div>

      {/* Liste des joueurs */}
      <div className="grid grid-cols-2 gap-2">
        {players.map((player, index) => {
          const isSelected = selectedPlayers.has(player.id);
          const isMuted = mutedPlayers.has(player.id);

          return (
            <div key={player.id} className="relative" style={{ animationDelay: `${index * 50}ms` }}>
              <button
                onClick={() => togglePlayer(player.id)}
                className={`
                  w-full p-2 rounded-lg border-2
                  transition-all duration-300
                  transform hover:scale-[1.02] active:scale-95
                  animate-slide-up
                  flex flex-col items-center gap-1.5
                  ${
                    isSelected
                      ? 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 border-primary-400 shadow-xl shadow-primary-500/40'
                      : isMuted
                      ? 'bg-gradient-to-br from-yellow-600/30 to-orange-600/30 border-yellow-500 shadow-lg shadow-yellow-500/30'
                      : 'bg-dark-700/70 backdrop-blur-sm border-dark-600 hover:border-dark-500 hover:bg-dark-700'
                  }
                `}
              >
                {/* Avatar */}
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-lg text-2xl
                    transition-all duration-300
                    ${
                      isSelected
                        ? 'bg-white/25 shadow-lg scale-110 animate-bounce-slow'
                        : isMuted
                        ? 'bg-yellow-500/30 scale-110'
                        : 'bg-gradient-to-br from-dark-600 to-dark-700'
                    }
                  `}
                >
                  {isMuted ? '🤐' : player.avatar}
                </div>

                {/* Nom */}
                <span
                  className={`
                    text-xs font-bold text-center
                    ${isSelected || isMuted ? 'text-white' : 'text-white/90'}
                  `}
                >
                  {player.name}
                </span>

                {/* Feedback mute */}
                {isMuted && (
                  <span className="text-xs text-yellow-300 animate-fade-in">
                    2 gorgées
                  </span>
                )}

                {/* Checkbox */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-white border-2 border-white shadow-lg">
                    <svg
                      className="w-3 h-3 text-primary-600 animate-scale-in"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Bouton Mute (si la règle est active) */}
              {muteRuleActive && !isSelected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute(player.id);
                  }}
                  className={`
                    absolute top-1.5 right-1.5
                    px-2 py-0.5 rounded-full
                    text-xs font-semibold
                    transition-all duration-200
                    z-10
                    ${
                      isMuted
                        ? 'bg-yellow-500 text-dark-900'
                        : 'bg-dark-600/80 text-dark-300 hover:bg-yellow-500/30 hover:text-yellow-400'
                    }
                  `}
                >
                  {isMuted ? '✓' : '🤐'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bouton de validation */}
      <div className="pt-1 animate-fade-in">
        <button
          onClick={handleSubmit}
          className="
            w-full py-3
            bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800
            hover:from-primary-700 hover:via-primary-800 hover:to-primary-900
            active:from-primary-800 active:to-primary-900
            text-white text-base font-bold rounded-xl
            shadow-xl shadow-primary-500/30
            transition-all duration-300
            transform hover:scale-[1.02] active:scale-95
            border-2 border-primary-500/50
            relative overflow-hidden
            group
          "
        >
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

          <span className="relative flex items-center justify-center gap-2">
            {selectedPlayers.size === 0 && mutedPlayers.size === 0 ? (
              <>
                <span>Personne</span>
                <span className="text-xl">→</span>
              </>
            ) : (
              <>
                <span className="text-xl">✓</span>
                <span>
                  Valider ({selectedPlayers.size + mutedPlayers.size})
                </span>
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};