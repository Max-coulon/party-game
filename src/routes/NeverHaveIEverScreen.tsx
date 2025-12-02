import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { NheModeSelector } from '@/components/neverHaveIEver/NheModeSelector';
import { NheQuestionCountSelector } from '@/components/neverHaveIEver/NheQuestionCountSelector';
import { NheQuestionView } from '@/components/neverHaveIEver/NheQuestionView';
import { NhePlayerAnswerListV2 } from '@/components/neverHaveIEver/NhePlayerAnswerListV2';
import { NheSummaryV2 } from '@/components/neverHaveIEver/NheSummaryV2';
import { SpecialRulesConfig } from '@/components/neverHaveIEver/SpecialRulesConfig';
import { ThemeSelector } from '@/components/neverHaveIEver/ThemeSelector';
import { CustomQuestions } from '@/components/neverHaveIEver/CustomQuestions';
import { GameHistory } from '@/components/neverHaveIEver/GameHistory';
import { StatsDisplay } from '@/components/neverHaveIEver/StatsDisplay';
import { useNeverHaveIEverGameV2 } from '@/hooks/useNeverHaveIEverGameV2';
import { usePlayers } from '@/context/PlayerContext';
import { getQuestionsByModes } from '@/data/neverHaveIEverQuestions';

/**
 * Écran du jeu "Je n'ai jamais" - Version 2.0
 * 
 * Nouvelles fonctionnalités :
 * - 2 règles spéciales activables (Double Shot, Mute)
 * - 5 thèmes de questions (Soirées, Amour, Vacances, Travail, Général)
 * - Questions personnalisées
 * - Historique de la partie en temps réel
 * - Statistiques globales
 * - Options de rejeu avancées
 * 
 * Gère les 3 phases :
 * 1. Configuration : Modes, Thèmes, Règles, Questions custom, Stats
 * 2. Jeu : Questions, Historique
 * 3. Fin : Classement, Statistiques, Rejeu
 */
export const NeverHaveIEverScreen: React.FC = () => {
  const navigate = useNavigate();
  const { players: globalPlayers } = usePlayers();
  
  const {
    config,
    currentQuestionIndex,
    currentQuestion,
    questions,
    isGameStarted,
    isGameFinished,
    players,
    history,
    customQuestions,
    toggleMode,
    toggleTheme,
    setQuestionCount,
    toggleSpecialRule,
    addCustomQuestion,
    removeCustomQuestion,
    startGame,
    submitAnswers,
    nextQuestion,
    restartGame,
    replayWithSameSettings,
    resetGame,
  } = useNeverHaveIEverGameV2();

  // Calculer le nombre total de questions disponibles selon les modes et thèmes sélectionnés
  const totalAvailableQuestions = useMemo(() => {
    let availableQuestions = getQuestionsByModes(config.selectedModes);
    
    if (config.selectedThemes.length > 0) {
      availableQuestions = availableQuestions.filter(
        (q) => q.theme && config.selectedThemes.includes(q.theme)
      );
    }
    
    availableQuestions = [...availableQuestions, ...customQuestions];
    return availableQuestions.length;
  }, [config.selectedModes, config.selectedThemes, customQuestions]);

  // Vérifier qu'il y a au moins un joueur
  React.useEffect(() => {
    if (globalPlayers.length === 0 && !isGameStarted) {
      navigate('/');
    }
  }, [globalPlayers, navigate, isGameStarted]);

  const handleStartGame = () => {
    if (globalPlayers.length === 0) {
      alert('Ajoutez des joueurs avant de commencer !');
      navigate('/');
      return;
    }
    startGame(globalPlayers);
  };

  const handleBackToMenu = () => {
    resetGame();
    navigate('/');
  };

  return (
    <PageContainer>
      <TopBar 
        title="Je n'ai jamais" 
        onBack={handleBackToMenu}
      />

      <div className="p-6 space-y-6">
        {/* Phase 1 : Configuration enrichie */}
        {!isGameStarted && (
          <div className="space-y-6 animate-fade-in">
            {/* Header avec animation */}
            <div className="text-center space-y-2 py-4 animate-slide-down">
              <div className="flex items-center justify-center gap-3">
                <span className="text-6xl animate-wiggle">🍺</span>
                <span className="text-6xl animate-wiggle" style={{ animationDelay: '0.2s' }}>🍷</span>
              </div>
              <h2 className="text-3xl font-bold text-white">
                Préparez-vous !
              </h2>
              <p className="text-dark-300 text-lg">
                Configurez votre partie
              </p>
            </div>

            {/* Bouton Statistiques en haut à droite */}
            <div className="flex justify-end">
              <StatsDisplay players={globalPlayers} />
            </div>

            {/* Sélection des modes */}
            <div className="animate-slide-up">
              <NheModeSelector
                selectedModes={config.selectedModes}
                onToggleMode={toggleMode}
              />
            </div>

            {/* Sélection des thèmes */}
            <ThemeSelector
              selectedThemes={config.selectedThemes}
              onToggleTheme={toggleTheme}
            />

            {/* Règles spéciales */}
            <SpecialRulesConfig
              specialRules={config.specialRules}
              onToggleRule={toggleSpecialRule}
            />

            {/* Questions personnalisées */}
            <CustomQuestions
              customQuestions={customQuestions}
              onAddQuestion={addCustomQuestion}
              onRemoveQuestion={removeCustomQuestion}
            />

            {/* Divider visuel */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-dark-900 text-dark-400 text-sm font-medium">
                  Puis
                </span>
              </div>
            </div>

            {/* Sélection du nombre de questions */}
            <NheQuestionCountSelector
              questionCount={config.questionCount}
              onQuestionCountChange={setQuestionCount}
              totalAvailable={totalAvailableQuestions}
            />

            {/* Bouton de démarrage avec animation */}
            <button
              onClick={handleStartGame}
              disabled={config.selectedModes.length === 0}
              className="w-full py-5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 active:from-primary-800 active:to-primary-900 disabled:from-dark-600 disabled:to-dark-700 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:opacity-50 animate-scale-in"
            >
              <div className="flex items-center justify-center gap-3">
                <span>🎮</span>
                <span>Commencer la partie</span>
              </div>
            </button>
          </div>
        )}

        {/* Phase 2 : Questions avec historique */}
        {isGameStarted && !isGameFinished && currentQuestion && (
          <div className="space-y-6 question-enter">
            <NheQuestionView
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
            />

            {/* Liste des joueurs avec support Mute */}
            <NhePlayerAnswerListV2
              players={players}
              muteRuleActive={config.specialRules.muteRule}
              onSubmit={submitAnswers}
              onNext={nextQuestion}
            />

            {/* Bouton historique flottant */}
            <GameHistory history={history} players={players} />
          </div>
        )}

        {/* Phase 3 : Résumé de fin avec options avancées */}
        {isGameFinished && (
          <NheSummaryV2
            players={players}
            onReplayWithSameSettings={replayWithSameSettings}
            onRestart={restartGame}
            onBackToMenu={handleBackToMenu}
          />
        )}
      </div>
    </PageContainer>
  );
};
