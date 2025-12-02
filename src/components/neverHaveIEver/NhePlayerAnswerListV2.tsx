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
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div className="text-center space-y-2 animate-slide-down">
        <span className="text-5xl animate-bounce-slow inline-block">🤔</span>
        <h3 className="text-xl font-bold text-white">Qui a déjà fait ça ?</h3>
        <p className="text-sm text-dark-300">Sélectionnez les joueurs concernés</p>
        {muteRuleActive && (
          <p className="text-xs text-yellow-400 mt-2">
            🤐 Appuyez longtemps pour "muter" (2 gorgées)
          </p>
        )}
      </div>

      {/* Liste des joueurs */}
      <div className="space-y-3">
        {players.map((player, index) => {
          const isSelected = selectedPlayers.has(player.id);
          const isMuted = mutedPlayers.has(player.id);

          return (
            <div key={player.id} className="relative" style={{ animationDelay: `${index * 50}ms` }}>
              <button
                onClick={() => togglePlayer(player.id)}
                className={`
                  w-full p-5 rounded-2xl border-2
                  transition-all duration-300
                  transform hover:scale-[1.03] active:scale-95
                  animate-slide-up
                  ${
                    isSelected
                      ? 'bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 border-primary-400 shadow-2xl shadow-primary-500/50'
                      : isMuted
                      ? 'bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-yellow-500 shadow-lg shadow-yellow-500/30'
                      : 'bg-dark-700/70 backdrop-blur-sm border-dark-600 hover:border-dark-500 hover:bg-dark-700'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className={`
                        flex items-center justify-center w-14 h-14 rounded-full text-3xl
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

                    {/* Nom et feedback */}
                    <div className="text-left">
                      <span
                        className={`
                          text-lg font-bold block
                          ${isSelected || isMuted ? 'text-white' : 'text-white/90'}
                        `}
                      >
                        {player.name}
                      </span>
                      {isSelected && (
                        <span className="text-xs text-white/70 animate-fade-in">✓ Sélectionné</span>
                      )}
                      {isMuted && (
                        <span className="text-xs text-yellow-300 animate-fade-in">
                          🤐 Refuse de répondre (2 gorgées)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={`
                      flex items-center justify-center w-9 h-9 rounded-full border-3
                      transition-all duration-300
                      ${
                        isSelected
                          ? 'bg-white border-white scale-110 shadow-lg'
                          : isMuted
                          ? 'bg-yellow-400 border-yellow-300 scale-110'
                          : 'bg-transparent border-dark-400 scale-100'
                      }
                    `}
                  >
                    {isSelected && (
                      <svg
                        className="w-6 h-6 text-primary-600 animate-scale-in"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {isMuted && <span className="text-lg">🤐</span>}
                  </div>
                </div>
              </button>

              {/* Bouton Mute (si la règle est active) */}
              {muteRuleActive && !isSelected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute(player.id);
                  }}
                  className={`
                    absolute top-2 right-2
                    px-3 py-1 rounded-full
                    text-xs font-semibold
                    transition-all duration-200
                    ${
                      isMuted
                        ? 'bg-yellow-500 text-dark-900'
                        : 'bg-dark-600/80 text-dark-300 hover:bg-yellow-500/30 hover:text-yellow-400'
                    }
                  `}
                >
                  {isMuted ? 'Démuté' : 'Mute'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bouton de validation */}
      <div className="pt-2 animate-fade-in">
        <button
          onClick={handleSubmit}
          className="
            w-full py-5
            bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800
            hover:from-primary-700 hover:via-primary-800 hover:to-primary-900
            active:from-primary-800 active:to-primary-900
            text-white text-lg font-bold rounded-2xl
            shadow-2xl shadow-primary-500/30
            transition-all duration-300
            transform hover:scale-[1.02] active:scale-95
            border-2 border-primary-500/50
            relative overflow-hidden
            group
          "
        >
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

          <span className="relative flex items-center justify-center gap-3">
            {selectedPlayers.size === 0 && mutedPlayers.size === 0 ? (
              <>
                <span>Personne</span>
                <span className="text-2xl">→</span>
                <span>Question suivante</span>
              </>
            ) : (
              <>
                <span className="text-2xl">✓</span>
                <span>
                  Valider ({selectedPlayers.size + mutedPlayers.size}) et continuer
                </span>
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};
