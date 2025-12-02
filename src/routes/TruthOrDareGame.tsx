import React from 'react';
import { TodPlayerTurn } from '@/components/truthOrDare/TodPlayerTurn';
import { TodChoiceButtons } from '@/components/truthOrDare/TodChoiceButtons';
import { TodCard } from '@/components/truthOrDare/TodCard';
import { Player, TruthOrDareType, TodItem } from '@/types';

interface TruthOrDareGameProps {
  currentPlayer: Player;
  currentRound: number;
  totalRounds?: number;
  currentCard: TodItem | null;
  onChoose: (choice: TruthOrDareType) => void;
  onComplete: () => void;
  onRefuse: () => void;
  onEndGame: () => void;
}

/**
 * Écran principal du jeu Action ou Vérité
 */
export const TruthOrDareGame: React.FC<TruthOrDareGameProps> = ({
  currentPlayer,
  currentRound,
  totalRounds,
  currentCard,
  onChoose,
  onComplete,
  onRefuse,
  onEndGame,
}) => {
  return (
    <div className="space-y-4">
      {/* Nombre de tours et bouton terminer */}
      <div className="flex justify-between items-center">
        {/* Tour indicator */}
        <div className="inline-block bg-dark-800 px-6 py-2 rounded-full border-2 border-primary-500">
            <span className="text-primary-300 font-semibold">
                {totalRounds ? `Tour ${currentRound} / ${totalRounds}` : `Tour ${currentRound}`}
            </span>
        </div>
        <button
          onClick={onEndGame}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 rounded-xl font-semibold transition-all duration-200"
        >
          ⏹️ Terminer la partie
        </button>
      </div>

      {/* Affichage du joueur actuel */}
      <TodPlayerTurn
        player={currentPlayer}
        roundNumber={currentRound}
        totalRounds={totalRounds}
      />

      {/* Affichage de la carte OU des boutons de choix */}
      <div className="min-h-[300px] flex items-center justify-center">
        {currentCard ? (
          // Une carte est tirée → afficher la carte avec boutons de résolution
          <div className="w-full max-w-2xl">
            <TodCard
              card={currentCard}
              onComplete={onComplete}
              onRefuse={onRefuse}
            />
          </div>
        ) : (
          // Pas de carte → afficher les boutons Action / Vérité
          <div className="w-full">
            <TodChoiceButtons onChoose={onChoose} />
          </div>
        )}
      </div>

      {/* Astuce en bas */}
      {!currentCard && (
        <div className="text-center animate-pulse">
          <p className="text-dark-400 text-sm">
            💡 Le joueur choisit entre Action ou Vérité
          </p>
        </div>
      )}
    </div>
  );
};
