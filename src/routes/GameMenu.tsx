import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { GameCard } from '@/components/menu/GameCard';
import { PlayerSelectorButton } from '@/components/menu/PlayerSelectorButton';
import { PlayerSelectionModal } from '@/components/players/PlayerSelectionModal';
import { usePlayers } from '@/context/PlayerContext';
import { Game } from '@/types';

/**
 * Liste des jeux disponibles
 */
const availableGames: Game[] = [
  {
    id: 'never-have-i-ever',
    name: 'Je n\'ai jamais',
    description: 'Le classique des soirées !',
    minPlayers: 2,
    icon: '🍺',
  },
  {
    id: 'truth-or-dare',
    name: 'Action ou Vérité',
    description: 'Oses-tu relever le défi ?',
    minPlayers: 2,
    icon: '🎭',
  },
];

/**
 * Écran du menu principal
 */
export const GameMenu: React.FC = () => {
  const navigate = useNavigate();
  const { players } = usePlayers();
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [showNoPlayerWarning, setShowNoPlayerWarning] = useState(false);

  const handleGameSelect = (gameId: string) => {
    if (players.length === 0) {
      setShowNoPlayerWarning(true);
      setIsPlayerModalOpen(true);
      return;
    }

    // Navigation vers le jeu sélectionné
    navigate(`/game/${gameId}`);
  };

  return (
    <PageContainer>
      <TopBar 
        title="Party Game" 
        showBackButton={false}
      />

      <div className="p-6 space-y-8">
        {/* Section joueurs avec animation */}
        <div className="animate-fade-in">
          <PlayerSelectorButton
            playerCount={players.length}
            onClick={() => setIsPlayerModalOpen(true)}
          />
        </div>

        {/* Section jeux avec animation */}
        <div className="space-y-5 animate-slide-up">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600">
              Choisis ton jeu
            </h2>
            <span className="text-5xl inline-block animate-bounce-slow">🎮</span>
          </div>
          
          <div className="space-y-4">
            {availableGames.map((game, index) => (
              <div 
                key={game.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-scale-in"
              >
                <GameCard
                  game={game}
                  onClick={() => handleGameSelect(game.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info améliorée */}
        <div className="text-center text-dark-400 text-sm pt-8 space-y-3 animate-fade-in">
          <div className="p-4 bg-dark-800/50 backdrop-blur-sm rounded-2xl border border-dark-700">
            <p className="font-medium text-dark-300">🎉 Party Game</p>
            <p className="mt-2 text-yellow-400/80 font-semibold">⚠️ Buvez responsablement !</p>
          </div>
        </div>
      </div>

      {/* Modal de sélection des joueurs */}
      <PlayerSelectionModal
        isOpen={isPlayerModalOpen}
        onClose={() => {
          setIsPlayerModalOpen(false);
          setShowNoPlayerWarning(false);
        }}
      />

      {/* Popup d'avertissement - pas de joueurs */}
      {showNoPlayerWarning && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowNoPlayerWarning(false)}
          />
          <div className="relative z-10 w-full max-w-sm bg-gradient-to-br from-dark-800 to-dark-900 rounded-3xl shadow-2xl border-2 border-yellow-500/50 p-6 animate-scale-in">
            {/* Icône d'avertissement */}
            <div className="text-center mb-4">
              <div className="inline-block p-4 bg-yellow-500/20 rounded-full mb-4">
                <span className="text-6xl animate-bounce-slow">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Attention !
              </h3>
              <p className="text-dark-300 text-lg">
                Ajoutez au moins un joueur avant de commencer !
              </p>
            </div>

            {/* Bouton de fermeture */}
            <button
              onClick={() => setShowNoPlayerWarning(false)}
              className="
                w-full py-3 mt-4
                bg-gradient-to-r from-yellow-500 to-yellow-600 
                hover:from-yellow-600 hover:to-yellow-700
                active:from-yellow-700 active:to-yellow-800
                text-dark-900 font-bold rounded-xl
                shadow-lg shadow-yellow-500/30
                transition-all duration-300
                transform hover:scale-[1.02] active:scale-95
              "
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
