import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { TopBar } from '@/components/layout/TopBar';
import { TruthOrDareSetup } from './TruthOrDareSetup';
import { TruthOrDareGame } from './TruthOrDareGame';
import { TruthOrDareSummary } from './TruthOrDareSummary';
import { useTruthOrDareGame } from '@/hooks/useTruthOrDareGame';
import { TodGameConfig } from '@/types';

/**
 * Écran principal "Action ou Vérité"
 * Orchestre les 3 phases : Setup, Game, Summary
 */
export const TruthOrDareScreen: React.FC = () => {
  const navigate = useNavigate();
  const game = useTruthOrDareGame();

  const handleStartGame = (config: TodGameConfig) => {
    game.startGame(config);
  };

  const handleComplete = () => {
    game.resolveCurrentCard({ completed: true });
    // Petite pause avant de passer au joueur suivant
    setTimeout(() => {
      game.nextPlayer();
    }, 500);
  };

  const handleRefuse = () => {
    game.resolveCurrentCard({ completed: false });
    // Petite pause avant de passer au joueur suivant
    setTimeout(() => {
      game.nextPlayer();
    }, 500);
  };

  const handleBackToMenu = () => {
    game.resetGame();
    navigate('/');
  };

  const handleNewGame = () => {
    game.resetGame();
  };

  // Phase 1: Configuration
  if (!game.state.isGameStarted) {
    return <TruthOrDareSetup onStartGame={handleStartGame} />;
  }

  // Phase 3: Summary
  if (game.state.isGameFinished) {
    const summary = game.getSummary();
    return (
      <PageContainer>
        <TopBar title="Action ou Vérité" onBack={handleBackToMenu} />
        <div className="p-6">
          <TruthOrDareSummary
            playerStats={summary.playerStats}
            totalRounds={summary.totalRounds}
            completionRate={summary.completionRate}
            onReplayWithSameSettings={game.replayWithSameSettings}
            onNewGame={handleNewGame}
            onBackToMenu={handleBackToMenu}
          />
        </div>
      </PageContainer>
    );
  }

  // Phase 2: Game
  return (
    <PageContainer>
      <TopBar title="Action ou Vérité" onBack={handleBackToMenu} />
      <div className="p-6">
        <TruthOrDareGame
          currentPlayer={game.currentPlayer!}
          currentRound={game.state.currentRound}
          totalRounds={game.state.config.maxRounds}
          currentCard={game.state.currentCard}
          onChoose={game.chooseTruthOrDare}
          onComplete={handleComplete}
          onRefuse={handleRefuse}
          onEndGame={game.endGame}
        />
      </div>
    </PageContainer>
  );
};
