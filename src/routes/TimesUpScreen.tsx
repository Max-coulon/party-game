import React from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { TopBar } from "@/components/layout/TopBar";
import {
  TimesUpSetup,
  TimesUpRound,
  TimesUpTurn,
  TimesUpRoundEnd,
  TimesUpSummaryScreen,
} from "@/components/timesUp";
import { useTimesUpGame } from "@/hooks/useTimesUpGame";
import { TimesUpGameConfig } from "@/types";

/**
 * Écran principal Time's Up
 * Orchestre les différentes phases du jeu : Setup, Round, Turn, RoundEnd, Summary
 */
export const TimesUpScreen: React.FC = () => {
  const navigate = useNavigate();
  const game = useTimesUpGame();

  // Vérifier s'il y a une partie sauvegardée au montage
  const hasSaved = game.hasSavedGame();

  const handleStartGame = (config: TimesUpGameConfig) => {
    game.startGame(config);
  };

  const handleBackToMenu = () => {
    game.resetGame();
    navigate("/");
  };

  const handleResumeSavedGame = () => {
    game.loadSavedGame();
  };

  // Phase 1: Setup
  if (game.state.phase === "setup") {
    return (
      <TimesUpSetup
        onStartGame={handleStartGame}
        onBack={handleBackToMenu}
        hasSavedGame={hasSaved}
        onResumeSavedGame={handleResumeSavedGame}
      />
    );
  }

  // Phase 5: Summary (fin de partie)
  if (game.state.phase === "summary" || game.state.isGameFinished) {
    return (
      <PageContainer>
        <TopBar title="Time's Up" onBack={handleBackToMenu} />
        <div className="p-6">
          <TimesUpSummaryScreen
            summary={game.getSummary()}
            onReplay={game.replayGame}
            onNewGame={game.resetGame}
            onBackToMenu={handleBackToMenu}
          />
        </div>
      </PageContainer>
    );
  }

  // Phase 4: Fin de manche
  if (game.state.phase === "roundEnd") {
    return (
      <PageContainer>
        <TopBar title="Time's Up" onBack={handleBackToMenu} />
        <div className="p-6">
          <TimesUpRoundEnd
            teams={game.state.teams}
            currentRound={game.state.currentRound}
            onNextRound={game.startNextRound}
            isLastRound={game.state.currentRound === 3}
          />
        </div>
      </PageContainer>
    );
  }

  // Phase 3: Tour actif
  if (game.state.phase === "turn" && game.state.turn.isActive) {
    return (
      <PageContainer>
        <TopBar title="Time's Up" showBackButton={false} />
        <div className="p-6">
          <TimesUpTurn
            team={game.currentTeam!}
            teams={game.state.teams}
            currentTeamIndex={game.state.currentTeamIndex}
            currentRound={game.state.currentRound}
            card={game.currentCard}
            timeLeft={game.state.turn.timeLeft}
            totalTime={game.state.config.turnDuration}
            isActive={game.state.turn.isActive}
            cardsRemaining={game.state.currentDeck.length}
            skipsUsed={game.state.turn.skipsUsed}
            maxSkips={game.state.config.maxSkipsPerTurn}
            allowSkip={game.state.config.allowSkip}
            cardsFoundThisTurn={game.state.turn.cardsFoundThisTurn.length}
            onFound={game.cardFound}
            onSkip={game.skipCard}
          />
        </div>
      </PageContainer>
    );
  }

  // Phase 2: Round (entre les tours, en attente de démarrage)
  return (
    <PageContainer>
      <TopBar title="Time's Up" onBack={handleBackToMenu} />
      <div className="p-6">
        <TimesUpRound
          teams={game.state.teams}
          currentTeamIndex={game.state.currentTeamIndex}
          currentRound={game.state.currentRound}
          cardsRemaining={game.state.currentDeck.length}
          onStartTurn={game.startTurn}
          onEndGame={game.endGame}
        />
      </div>
    </PageContainer>
  );
};
