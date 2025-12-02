import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { TodLevelSelector } from '@/components/truthOrDare/TodLevelSelector';
import { TodPenaltyConfig } from '@/components/truthOrDare/TodPenaltyConfig';
import { usePlayers } from '@/context/PlayerContext';
import {
  TodLevel,
  TodSelectionMode,
  TodPenaltyType,
  TodGameConfig,
} from '@/types';

interface TruthOrDareSetupProps {
  onStartGame: (config: TodGameConfig) => void;
}

/**
 * Écran de configuration pour Action ou Vérité
 */
export const TruthOrDareSetup: React.FC<TruthOrDareSetupProps> = ({ onStartGame }) => {
  const navigate = useNavigate();
  const { players } = usePlayers();

  // Config states
  const [enabledLevels, setEnabledLevels] = useState<TodLevel[]>(['soft', 'fun']);
  const [selectionMode, setSelectionMode] = useState<TodSelectionMode>('round-robin');
  const [maxRounds, setMaxRounds] = useState<number | undefined>(20);
  const [penaltyType, setPenaltyType] = useState<TodPenaltyType>('drink');
  const [penaltyDrinkValue, setPenaltyDrinkValue] = useState(2);
  const [penaltyPointsValue, setPenaltyPointsValue] = useState(1);

  const handleToggleLevel = (level: TodLevel) => {
    setEnabledLevels((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  const handleStartGame = () => {
    if (players.length === 0) {
      alert('Ajoutez des joueurs avant de commencer !');
      navigate('/');
      return;
    }

    if (enabledLevels.length === 0) {
      alert('Sélectionnez au moins un niveau de jeu !');
      return;
    }

    const config: TodGameConfig = {
      players,
      enabledLevels,
      selectionMode,
      maxRounds: maxRounds === 0 ? undefined : maxRounds,
      penaltyType,
      penaltyDrinkValue,
      penaltyPointsValue,
    };

    onStartGame(config);
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  return (
    <PageContainer>
      <TopBar title="Action ou Vérité" onBack={handleBackToMenu} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-4 animate-slide-down">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-6xl animate-wiggle">🤔</span>
            <span className="text-6xl animate-wiggle" style={{ animationDelay: '0.2s' }}>
              🔥
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white">Préparez-vous !</h2>
          <p className="text-dark-300 text-lg">Configurez votre partie</p>
        </div>

        {/* Nombre de joueurs */}
        <div className="bg-dark-800 p-4 rounded-xl border border-dark-700">
          <p className="text-white font-semibold">
            👥 {players.length} joueur{players.length > 1 ? 's' : ''} prêt{players.length > 1 ? 's' : ''}
          </p>
          {players.length === 0 && (
            <p className="text-secondary-300 text-sm mt-2">
              ⚠️ Ajoutez des joueurs depuis le menu principal
            </p>
          )}
        </div>

        {/* Sélection des niveaux */}
        <div className="animate-slide-up">
          <TodLevelSelector
            enabledLevels={enabledLevels}
            onToggleLevel={handleToggleLevel}
          />
        </div>

        {/* Mode de sélection des joueurs */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔄</span>
            <h3 className="text-xl font-bold text-white">Ordre des joueurs</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectionMode('round-robin')}
              className={`
                p-4 rounded-xl border-2 text-center transition-all duration-300
                transform hover:scale-105 active:scale-95
                ${
                  selectionMode === 'round-robin'
                    ? 'bg-primary-600 border-primary-400 shadow-lg'
                    : 'bg-dark-700 border-dark-600 hover:border-dark-500'
                }
              `}
            >
              <div className="text-3xl mb-2">🔁</div>
              <p className="text-white font-semibold">Tour par tour</p>
              <p className="text-sm text-dark-300 mt-1">Ordre fixe</p>
            </button>

            <button
              onClick={() => setSelectionMode('random')}
              className={`
                p-4 rounded-xl border-2 text-center transition-all duration-300
                transform hover:scale-105 active:scale-95
                ${
                  selectionMode === 'random'
                    ? 'bg-primary-600 border-primary-400 shadow-lg'
                    : 'bg-dark-700 border-dark-600 hover:border-dark-500'
                }
              `}
            >
              <div className="text-3xl mb-2">🎲</div>
              <p className="text-white font-semibold">Aléatoire</p>
              <p className="text-sm text-dark-300 mt-1">Tirage au sort</p>
            </button>
          </div>
        </div>

        {/* Nombre de tours */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎯</span>
            <h3 className="text-xl font-bold text-white">Nombre de tours</h3>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {[10, 20, 30, 50, 0].map((count) => (
              <button
                key={count}
                onClick={() => setMaxRounds(count === 0 ? undefined : count)}
                className={`
                  p-3 rounded-xl transition-all duration-300 border-2
                  transform hover:scale-105 active:scale-95
                  ${
                    (count === 0 && maxRounds === undefined) ||
                    maxRounds === count
                      ? 'bg-accent-500 border-accent-300 shadow-neon-accent scale-105'
                      : 'bg-dark-700 border-dark-600 hover:border-dark-500'
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-white font-semibold">
                    {count === 0 ? 'Infini' : count}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Configuration des pénalités */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <TodPenaltyConfig
            penaltyType={penaltyType}
            drinkValue={penaltyDrinkValue}
            pointsValue={penaltyPointsValue}
            onPenaltyTypeChange={setPenaltyType}
            onDrinkValueChange={setPenaltyDrinkValue}
            onPointsValueChange={setPenaltyPointsValue}
          />
        </div>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-dark-900 text-dark-400 text-sm font-medium">
              Prêt ?
            </span>
          </div>
        </div>

        {/* Bouton de démarrage */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={handleStartGame}
            disabled={players.length === 0 || enabledLevels.length === 0}
            className={`
              w-full py-5 bg-gradient-to-r text-white text-xl font-bold rounded-2xl
              shadow-lg transition-all duration-300 transform
              ${
                players.length === 0 || enabledLevels.length === 0
                  ? 'from-dark-600 to-dark-700 cursor-not-allowed opacity-50'
                  : 'from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 active:from-primary-800 active:to-primary-900 hover:scale-105 active:scale-95'
              }
            `}
          >
            <div className="flex items-center justify-center gap-3">
              <span>🎮</span>
              <span>Commencer la partie</span>
            </div>
          </button>
          
          {(players.length === 0 || enabledLevels.length === 0) && (
            <p className="text-center text-secondary-300 mt-2 text-sm">
              {players.length === 0
                ? 'Ajoutez des joueurs pour commencer'
                : 'Sélectionnez au moins un niveau'}
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
