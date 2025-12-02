import React, { useState } from 'react';
import { Player } from '@/types';

interface NhePlayerAnswerListProps {
  players: Player[];
  onSubmit: (selectedPlayerIds: string[]) => void;
  onNext: () => void;
}

/**
 * Composant pour sélectionner les joueurs qui "ont déjà fait" l'action
 * Avec animations et feedback visuel amélioré
 */
export const NhePlayerAnswerList: React.FC<NhePlayerAnswerListProps> = ({ 
  players, 
  onSubmit,
  onNext,
}) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());

  const togglePlayer = (playerId: string) => {
    setSelectedPlayers(prev => {
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
    onSubmit(Array.from(selectedPlayers));
    setSelectedPlayers(new Set()); // Reset pour la prochaine question
    onNext();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête avec animation */}
      <div className="text-center space-y-2 animate-slide-down">
        <span className="text-5xl animate-bounce-slow inline-block">🤔</span>
        <h3 className="text-xl font-bold text-white">
          Qui a déjà fait ça ?
        </h3>
        <p className="text-sm text-dark-300">
          Sélectionnez les joueurs concernés
        </p>
      </div>

      {/* Liste des joueurs avec animations échelonnées */}
      <div className="space-y-3">
        {players.map((player, index) => {
          const isSelected = selectedPlayers.has(player.id);
          
          return (
            <button
              key={player.id}
              onClick={() => togglePlayer(player.id)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`
                w-full p-5 rounded-2xl border-2 
                transition-all duration-300 
                transform hover:scale-[1.03] active:scale-95
                animate-slide-up
                ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 border-primary-400 shadow-2xl shadow-primary-500/50'
                    : 'bg-dark-700/70 backdrop-blur-sm border-dark-600 hover:border-dark-500 hover:bg-dark-700'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar animé */}
                  <div className={`
                    flex items-center justify-center w-14 h-14 rounded-full text-3xl
                    transition-all duration-300
                    ${
                      isSelected 
                        ? 'bg-white/25 shadow-lg scale-110 animate-bounce-slow' 
                        : 'bg-gradient-to-br from-dark-600 to-dark-700'
                    }
                  `}>
                    {player.avatar}
                  </div>

                  {/* Nom et feedback */}
                  <div className="text-left">
                    <span className={`
                      text-lg font-bold block
                      ${isSelected ? 'text-white' : 'text-white/90'}
                    `}>
                      {player.name}
                    </span>
                    {isSelected && (
                      <span className="text-xs text-white/70 animate-fade-in">
                        ✓ Sélectionné
                      </span>
                    )}
                  </div>
                </div>

                {/* Checkbox améliorée */}
                <div
                  className={`
                    flex items-center justify-center w-9 h-9 rounded-full border-3
                    transition-all duration-300
                    ${
                      isSelected
                        ? 'bg-white border-white scale-110 shadow-lg'
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
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bouton de validation amélioré */}
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
          {/* Effet de brillance au survol */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          
          <span className="relative flex items-center justify-center gap-3">
            {selectedPlayers.size === 0 ? (
              <>
                <span>Personne</span>
                <span className="text-2xl">→</span>
                <span>Question suivante</span>
              </>
            ) : (
              <>
                <span className="text-2xl">✓</span>
                <span>Valider ({selectedPlayers.size}) et continuer</span>
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};
