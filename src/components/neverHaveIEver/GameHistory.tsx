import React, { useState } from 'react';
import { NheHistoryEntry, Player } from '@/types';

interface GameHistoryProps {
  history: NheHistoryEntry[];
  players: Player[];
}

/**
 * Composant pour afficher l'historique de la partie
 */
export const GameHistory: React.FC<GameHistoryProps> = ({ history, players }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPlayerName = (playerId: string): string => {
    return players.find((p) => p.id === playerId)?.name || 'Inconnu';
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <>
      {/* Bouton flottant pour ouvrir l'historique */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          fixed bottom-6 right-6 z-40
          w-14 h-14
          bg-gradient-to-br from-primary-600 to-primary-700
          hover:from-primary-700 hover:to-primary-800
          text-white rounded-full
          shadow-2xl shadow-primary-500/30
          transition-all duration-300
          transform hover:scale-110 active:scale-95
          border-2 border-primary-500/50
          flex items-center justify-center
        "
        aria-label="Voir l'historique"
      >
        <span className="text-2xl">📜</span>
      </button>

      {/* Modal de l'historique */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="
            relative z-10 w-full max-w-2xl max-h-[80vh]
            bg-dark-800 rounded-3xl
            shadow-2xl border border-dark-700
            overflow-hidden
            animate-scale-in
          ">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 p-6 border-b-2 border-primary-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📜</span>
                  <h2 className="text-2xl font-bold text-white">Historique</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-all"
                  aria-label="Fermer"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Liste de l'historique */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)] custom-scrollbar">
              <div className="space-y-4">
                {[...history].reverse().map((entry, index) => (
                  <div
                    key={`${entry.questionId}-${entry.timestamp}`}
                    className="
                      p-4 bg-dark-700/50 rounded-2xl
                      border border-dark-600
                      hover:border-dark-500
                      transition-all duration-200
                    "
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {/* Question */}
                    <div className="mb-3">
                      <p className="text-white font-medium leading-relaxed">
                        {entry.questionText}
                      </p>
                    </div>

                    {/* Joueurs qui ont bu */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {entry.playerIds.map((playerId) => {
                        const player = players.find((p) => p.id === playerId);
                        return (
                          <div
                            key={playerId}
                            className="
                              flex items-center gap-2
                              px-3 py-1
                              bg-primary-600/20
                              border border-primary-500/30
                              rounded-full
                            "
                          >
                            <span className="text-lg">{player?.avatar}</span>
                            <span className="text-sm text-white font-medium">
                              {getPlayerName(playerId)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Info gorgées et règle spéciale */}
                    <div className="flex items-center gap-3 text-xs text-dark-300">
                      <span>🍺 {entry.sipsPerPlayer} gorgée{entry.sipsPerPlayer > 1 ? 's' : ''}</span>
                      {entry.specialRuleTriggered && (
                        <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 font-semibold">
                          ⚡ {entry.specialRuleTriggered}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
