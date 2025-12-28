import React from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { TopBar } from "@/components/layout/TopBar";
import { useUndercoverGame } from "@/hooks/useUndercoverGame";
import {
  UndercoverSetup,
  UndercoverRoleReveal,
  UndercoverDiscussion,
  UndercoverVote,
  UndercoverVoteResult,
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
    currentVoter,
    alivePlayers,
    lastEliminated,
    startGame,
    goBackToSetup,
    confirmRoleSeen,
    skipDiscussionTimer,
    submitVote,
    confirmVoteResult,
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

  // Joueurs à égalité pour le résultat du vote
  const tiedPlayers = state.tiedPlayerIds
    .map((id) => state.players.find((p) => p.id === id))
    .filter(Boolean) as typeof state.players;

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

        {/* Phase 4: Vote (pass-and-play) */}
        {state.phase === "voting" && currentVoter && (
          <UndercoverVote
            voter={currentVoter}
            voterIndex={state.currentVoterIndex}
            totalVoters={alivePlayers.length}
            candidates={alivePlayers}
            allowSelfVote={state.config.rules.allowSelfVote}
            tiedPlayerIds={state.tiedPlayerIds}
            isRevote={state.isRevote}
            onVote={submitVote}
          />
        )}

        {/* Phase 5: Résultat du vote */}
        {state.phase === "voteResult" && (
          <UndercoverVoteResult
            players={state.players}
            eliminatedPlayer={lastEliminated}
            tiedPlayers={tiedPlayers}
            isRevote={state.isRevote && state.tiedPlayerIds.length > 1}
            onConfirm={confirmVoteResult}
          />
        )}

        {/* Phase 6: Élimination */}
        {state.phase === "elimination" && lastEliminated && (
          <UndercoverElimination
            eliminatedPlayer={lastEliminated}
            revealRole={state.config.rules.revealRoleOnElimination}
            onConfirm={confirmElimination}
          />
        )}

        {/* Phase 7: Mr White devine */}
        {state.phase === "mrWhiteGuess" && lastEliminated && (
          <UndercoverMrWhiteGuess
            mrWhiteName={lastEliminated.name}
            onGuess={submitMrWhiteGuess}
          />
        )}

        {/* Phase 8: Fin de partie */}
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
