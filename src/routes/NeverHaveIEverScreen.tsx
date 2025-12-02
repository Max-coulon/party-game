import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { NheModeSelector } from '@/components/neverHaveIEver/NheModeSelector';
import { NheQuestionCountSelector } from '@/components/neverHaveIEver/NheQuestionCountSelector';
import { NheQuestionView } from '@/components/neverHaveIEver/NheQuestionView';
import { NhePlayerAnswerList } from '@/components/neverHaveIEver/NhePlayerAnswerList';
import { NheSummary } from '@/components/neverHaveIEver/NheSummary';
import { useNeverHaveIEverGame } from '@/hooks/useNeverHaveIEverGame';
import { usePlayers } from '@/context/PlayerContext';
import { getQuestionsByModes } from '@/data/neverHaveIEverQuestions';

/**
 * Écran du jeu "Je n'ai jamais"
 * Gère les différentes phases :
 * 1. Configuration : Sélection des modes + nombre de questions
 * 2. Déroulé des questions avec animations
 * 3. Écran de fin avec classement
 */
export const NeverHaveIEverScreen: React.FC = () => {
  const navigate = useNavigate();
  const { players } = usePlayers();
  const game = useNeverHaveIEverGame();

  // Calculer le nombre total de questions disponibles selon les modes sélectionnés
  const totalAvailableQuestions = getQuestionsByModes(game.selectedModes).length;

  // Vérifier qu'il y a au moins un joueur
  React.useEffect(() => {
    if (players.length === 0) {
      alert('Ajoutez des joueurs avant de commencer !');
      navigate('/');
    }
  }, [players, navigate]);

  const handleStartGame = () => {
    game.startGame(players);
  };

  const handleBackToMenu = () => {
    game.resetGame();
    navigate('/');
  };

  const handleRestart = () => {
    game.restartGame();
  };

  return (
    <PageContainer>
      <TopBar 
        title="Je n'ai jamais" 
        onBack={handleBackToMenu}
      />

      <div className="p-6 space-y-6">
        {/* Phase 1 : Configuration (Modes + Nombre de questions) */}
        {!game.isGameStarted && (
          <div className="space-y-6 animate-fade-in">
            {/* Header avec animation */}
            <div className="text-center space-y-2 py-4 animate-slide-down">
              <div className="text-6xl mb-4 animate-bounce-slow">🍺</div>
              <h2 className="text-3xl font-bold text-white">
                Préparez-vous !
              </h2>
              <p className="text-dark-300 text-lg">
                Configurez votre partie
              </p>
            </div>

            {/* Sélection des modes */}
            <div className="animate-slide-up">
              <NheModeSelector
                selectedModes={game.selectedModes}
                onToggleMode={game.toggleMode}
              />
            </div>

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
              questionCount={game.questionCount}
              onQuestionCountChange={game.setQuestionCount}
              totalAvailable={totalAvailableQuestions}
            />

            {/* Bouton de démarrage avec animation */}
            <button
              onClick={handleStartGame}
              disabled={game.selectedModes.length === 0}
              className="w-full py-5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 active:from-primary-800 active:to-primary-900 disabled:from-dark-600 disabled:to-dark-700 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:opacity-50 animate-scale-in"
            >
              <div className="flex items-center justify-center gap-3">
                <span>🎮</span>
                <span>Commencer la partie</span>
              </div>
            </button>
          </div>
        )}

        {/* Phase 2 : Questions avec animation de transition */}
        {game.isGameStarted && !game.isGameFinished && game.currentQuestion && (
          <div className="space-y-6 question-enter">
            <NheQuestionView
              question={game.currentQuestion}
              questionNumber={game.currentQuestionIndex + 1}
              totalQuestions={game.questions.length}
            />

            <NhePlayerAnswerList
              players={game.players}
              onSubmit={game.submitAnswers}
              onNext={game.nextQuestion}
            />
          </div>
        )}

        {/* Phase 3 : Résumé de fin */}
        {game.isGameFinished && (
          <NheSummary
            players={game.players}
            onRestart={handleRestart}
            onBackToMenu={handleBackToMenu}
          />
        )}
      </div>
    </PageContainer>
  );
};
