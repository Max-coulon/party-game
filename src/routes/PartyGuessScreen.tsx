import React from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { TopBar } from "@/components/layout/TopBar";
import { usePartyGuessGame } from "@/hooks/usePartyGuessGame";
import {
  PartyGuessVariantPicker,
  PartyGuessSetup,
  PartyGuessPlay,
  PartyGuessBetweenTurns,
  PartyGuessRoundEnd,
  PartyGuessGameEnd,
} from "@/components/partyGuess";

/**
 * Écran principal PartyGuess - orchestre toutes les phases du jeu
 */
const PartyGuessScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    currentTeam,
    currentCard,
    selectVariant,
    startGame,
    goBackToVariantPicker,
    startTurn,
    cardFound,
    skipCard,
    startNextRound,
    endGame,
    resetGame,
    replayGame,
    getSummary,
    hasSavedGame,
    loadSavedGame,
  } = usePartyGuessGame();

  const handleBack = () => {
    if (state.phase === "pickVariant") {
      navigate("/");
    } else if (state.phase === "setup") {
      goBackToVariantPicker();
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

  const handleReplay = () => {
    replayGame();
  };

  const handleChangeMode = () => {
    goBackToVariantPicker();
  };

  const handleEndGame = () => {
    if (window.confirm("Terminer la partie maintenant ?")) {
      endGame();
    }
  };

  return (
    <PageContainer>
      <TopBar
        title="🎯 PartyGuess"
        onBack={state.phase !== "playing" ? handleBack : undefined}
      />

      <div className="flex-1 overflow-auto px-4 py-6">
        {/* Phase 1: Sélection de la variante */}
        {state.phase === "pickVariant" && (
          <PartyGuessVariantPicker
            onSelectVariant={selectVariant}
            onBack={() => navigate("/")}
          />
        )}

        {/* Phase 2: Configuration */}
        {state.phase === "setup" && state.config.variants.length > 0 && (
          <PartyGuessSetup
            initialVariant={state.config.variants[0]}
            onStartGame={startGame}
            onBack={goBackToVariantPicker}
            hasSavedGame={hasSavedGame()}
            onResumeSavedGame={loadSavedGame}
          />
        )}

        {/* Phase 3: Entre les tours */}
        {state.phase === "betweenTurns" && (
          <PartyGuessBetweenTurns
            teams={state.teams}
            currentTeamIndex={state.currentTeamIndex}
            variant={state.currentRoundVariant}
            cardsRemaining={state.currentDeck.length}
            currentRound={state.currentRound}
            totalRounds={state.config.totalRounds}
            onStartTurn={startTurn}
            onEndGame={handleEndGame}
          />
        )}

        {/* Phase 4: Jeu actif */}
        {state.phase === "playing" && currentTeam && (
          <PartyGuessPlay
            team={currentTeam}
            teams={state.teams}
            currentTeamIndex={state.currentTeamIndex}
            variant={state.currentRoundVariant}
            card={currentCard}
            timeLeft={state.turn.timeLeft}
            totalTime={state.config.turnDuration}
            isActive={state.turn.isActive}
            cardsRemaining={state.currentDeck.length}
            skipsUsed={state.turn.skipsUsed}
            maxSkips={state.config.maxSkipsPerTurn}
            allowSkip={state.config.allowSkip}
            cardsFoundThisTurn={state.turn.cardsFoundThisTurn.length}
            currentRound={state.currentRound}
            totalRounds={state.config.totalRounds}
            onFound={cardFound}
            onSkip={skipCard}
          />
        )}

        {/* Phase 5: Fin de manche */}
        {state.phase === "roundEnd" && (
          <PartyGuessRoundEnd
            teams={state.teams}
            currentRound={state.currentRound}
            totalRounds={state.config.totalRounds}
            onNextRound={startNextRound}
            isLastRound={state.currentRound >= state.config.totalRounds}
            nextVariant={state.currentRound < state.config.totalRounds ? state.config.rounds[state.currentRound]?.variant : undefined}
          />
        )}

        {/* Phase 6: Fin de partie */}
        {state.phase === "gameEnd" && (
          <PartyGuessGameEnd
            summary={getSummary()}
            variants={state.config.variants}
            onReplay={handleReplay}
            onChangeMode={handleChangeMode}
            onBackToMenu={handleBackToMenu}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default PartyGuessScreen;
