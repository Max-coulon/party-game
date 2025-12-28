import React from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { TopBar } from "@/components/layout/TopBar";
import { useUndercoverGame } from "@/hooks/useUndercoverGame";
import {
  UndercoverSetup,
  UndercoverRoleReveal,
  UndercoverDiscussion,
  UndercoverGroupVote,
  UndercoverElimination,
  UndercoverMrWhiteGuess,
  UndercoverGameEnd,
} from "@/components/undercover";

/**
 * Écran principal Undercover - orchestre toutes les phases du jeu
 */
const UndercoverScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    currentRevealPlayer,
    lastEliminated,
    startGame,
    goBackToSetup,
    confirmRoleSeen,
    skipDiscussionTimer,
    eliminatePlayer,
    confirmElimination,
    submitMrWhiteGuess,
    resetGame,
    replayGame,
    getSummary,
    hasSavedGame,
    loadSavedGame,
  } = useUndercoverGame();

  const handleBack = () => {
    if (state.phase === "setup") {
      navigate("/");
    } else if (state.phase === "gameEnd") {
      navigate("/");
    } else {
      // En cours de partie, demander confirmation
      if (window.confirm("Quitter la partie en cours ?")) {
        resetGame();
        navigate("/");
      }
    }
  };

  const handleBackToMenu = () => {
    resetGame();
    navigate("/");
  };

  const handleNewGame = () => {
    goBackToSetup();
  };

  const handleReplay = () => {
    replayGame();
    // Relancer avec les mêmes joueurs mais on retourne au setup pour changer les mots si besoin
    // Ou on peut directement relancer
  };

  return (
    <PageContainer>
      <TopBar
        title="🕵️ Undercover"
        onBack={
          state.phase !== "roleReveal" &&
          state.phase !== "voting"
            ? handleBack
            : undefined
        }
      />

      <div className="flex-1 overflow-auto px-4 py-6">
        {/* Phase 1: Configuration */}
        {state.phase === "setup" && (
          <UndercoverSetup
            onStartGame={startGame}
            onBack={() => navigate("/")}
            hasSavedGame={hasSavedGame()}
            onResumeSavedGame={loadSavedGame}
          />
        )}

        {/* Phase 2: Distribution des rôles (pass-and-play) */}
        {state.phase === "roleReveal" && currentRevealPlayer && (
          <UndercoverRoleReveal
            key={`reveal-${state.currentRevealIndex}`}
            player={currentRevealPlayer}
            playerIndex={state.currentRevealIndex}
            totalPlayers={state.players.length}
            onConfirm={confirmRoleSeen}
          />
        )}

        {/* Phase 3: Discussion */}
        {state.phase === "discussion" && (
          <UndercoverDiscussion
            players={state.players}
            currentRound={state.currentRound}
            timeLeft={state.discussionTimeLeft}
            hasTimer={state.config.rules.discussionDuration > 0}
            eliminationHistory={state.eliminationHistory}
            showHistory={state.config.rules.showEliminationHistory}
            onSkipTimer={skipDiscussionTimer}
            onStartVote={skipDiscussionTimer}
          />
        )}

        {/* Phase 4: Vote de groupe */}
        {state.phase === "voting" && (
          <UndercoverGroupVote
            players={state.players}
            currentRound={state.currentRound}
            onEliminate={eliminatePlayer}
          />
        )}

        {/* Phase 5: Élimination */}
        {state.phase === "elimination" && lastEliminated && (
          <UndercoverElimination
            eliminatedPlayer={lastEliminated}
            revealRole={state.config.rules.revealRoleOnElimination}
            onConfirm={confirmElimination}
          />
        )}

        {/* Phase 6: Mr White devine */}
        {state.phase === "mrWhiteGuess" && lastEliminated && (
          <UndercoverMrWhiteGuess
            mrWhiteName={lastEliminated.name}
            onGuess={submitMrWhiteGuess}
          />
        )}

        {/* Phase 7: Fin de partie */}
        {state.phase === "gameEnd" && (
          <UndercoverGameEnd
            summary={getSummary()}
            mrWhiteGuessCorrect={state.mrWhiteGuessCorrect}
            onReplay={handleReplay}
            onNewGame={handleNewGame}
            onBackToMenu={handleBackToMenu}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default UndercoverScreen;