import React, { useState } from "react";
import { UndercoverPlayer } from "@/types";

interface UndercoverVoteProps {
  voter: UndercoverPlayer;
  voterIndex: number;
  totalVoters: number;
  candidates: UndercoverPlayer[];
  allowSelfVote: boolean;
  tiedPlayerIds: string[];
  isRevote: boolean;
  onVote: (targetId: string) => void;
}

/**
 * Écran de vote pass-and-play
 */
export const UndercoverVote: React.FC<UndercoverVoteProps> = ({
  voter,
  voterIndex,
  totalVoters,
  candidates,
  allowSelfVote,
  tiedPlayerIds,
  isRevote,
  onVote,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Filtrer les candidats (exclure soi-même si pas autorisé, ou limiter aux égalités)
  const votableCandidates = candidates.filter((c) => {
    // En cas de revote, limiter aux joueurs à égalité
    if (isRevote && tiedPlayerIds.length > 0) {
      if (!tiedPlayerIds.includes(c.id)) return false;
    }
    // Exclure soi-même si pas autorisé
    if (!allowSelfVote && c.id === voter.id) return false;
    return true;
  });

  const handleConfirmVote = () => {
    if (!selectedTarget) return;
    setHasVoted(true);
    
    setTimeout(() => {
      onVote(selectedTarget);
      // Reset pour le prochain votant
      setSelectedTarget(null);
      setIsReady(false);
      setHasVoted(false);
    }, 300);
  };

  // Écran "Passe le téléphone"
  if (hasVoted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center space-y-6">
          <span className="text-8xl block animate-bounce-slow">📱</span>
          <h2 className="text-3xl font-bold text-white">Vote enregistré !</h2>
          <p className="text-dark-400 text-lg">Passe le téléphone...</p>
        </div>
      </div>
    );
  }

  // Écran "C'est à ton tour"
  if (!isReady) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Progression */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalVoters }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < voterIndex
                  ? "bg-green-500"
                  : i === voterIndex
                  ? "bg-primary-500 scale-125"
                  : "bg-dark-600"
              }`}
            />
          ))}
        </div>

        {/* Message */}
        <div className="text-center py-12">
          {isRevote && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full border border-yellow-500/30 mb-6">
              <span className="text-yellow-400">⚠️ Revote - Égalité !</span>
            </div>
          )}

          <span className="text-7xl block mb-6">🗳️</span>
          <p className="text-dark-400 text-lg mb-2">C'est au tour de</p>
          <h2 className="text-4xl font-bold text-white mb-8">{voter.name}</h2>

          <button
            onClick={() => setIsReady(true)}
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl"
          >
            Je suis prêt à voter
          </button>

          <p className="text-dark-500 text-sm mt-6">
            ⚠️ Les autres ne doivent pas regarder
          </p>
        </div>
      </div>
    );
  }

  // Écran de vote
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-dark-400">Vote de</p>
        <h2 className="text-2xl font-bold text-white">{voter.name}</h2>
        {isRevote && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
            <span className="text-yellow-400 text-sm">⚠️ Revote entre égalités</span>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="text-center py-4">
        <span className="text-4xl block mb-2">🤔</span>
        <p className="text-xl text-white font-semibold">
          Qui veux-tu éliminer ?
        </p>
      </div>

      {/* Liste des candidats */}
      <div className="space-y-3">
        {votableCandidates.map((candidate) => (
          <button
            key={candidate.id}
            onClick={() => setSelectedTarget(candidate.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all transform active:scale-98 ${
              selectedTarget === candidate.id
                ? "bg-red-500/20 border-red-500 scale-102"
                : "bg-dark-800/80 border-dark-700 hover:border-dark-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    selectedTarget === candidate.id
                      ? "bg-red-500"
                      : "bg-dark-700"
                  }`}
                >
                  {selectedTarget === candidate.id ? "❌" : "👤"}
                </div>
                <span
                  className={`font-semibold ${
                    selectedTarget === candidate.id
                      ? "text-red-400"
                      : "text-white"
                  }`}
                >
                  {candidate.name}
                </span>
              </div>

              {selectedTarget === candidate.id && (
                <span className="text-red-400 text-sm">Sélectionné</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Bouton confirmer */}
      <div className="pt-4">
        <button
          onClick={handleConfirmVote}
          disabled={!selectedTarget}
          className={`w-full py-5 font-bold text-xl rounded-2xl transition-all transform shadow-xl flex items-center justify-center gap-3 ${
            selectedTarget
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:scale-105 active:scale-95"
              : "bg-dark-700 text-dark-500 cursor-not-allowed"
          }`}
        >
          <span className="text-2xl">🗳️</span>
          <span>Confirmer mon vote</span>
        </button>
      </div>

      {/* Info */}
      <p className="text-dark-500 text-xs text-center">
        Ton vote est secret et définitif
      </p>
    </div>
  );
};
