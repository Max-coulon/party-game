import React from "react";
import { UndercoverSummary, UndercoverWinner } from "@/types";

interface UndercoverGameEndProps {
  summary: UndercoverSummary;
  mrWhiteGuessCorrect: boolean | null;
  onReplay: () => void;
  onNewGame: () => void;
  onBackToMenu: () => void;
}

/**
 * Écran de fin de partie
 */
export const UndercoverGameEnd: React.FC<UndercoverGameEndProps> = ({
  summary,
  mrWhiteGuessCorrect,
  onReplay,
  onNewGame,
  onBackToMenu,
}) => {
  const { winner, players, eliminationHistory, wordPair, totalRounds } = summary;

  const getWinnerInfo = (winner: UndercoverWinner) => {
    switch (winner) {
      case "civils":
        return {
          emoji: "👥",
          title: "Victoire des Civils !",
          subtitle: "Les imposteurs ont été démasqués",
          color: "blue",
          bgGradient: "from-blue-900/80 to-blue-950/80",
          borderColor: "border-blue-500/50",
        };
      case "undercover":
        return {
          emoji: "🕵️",
          title: "Victoire des Undercovers !",
          subtitle: "L'infiltration a réussi",
          color: "red",
          bgGradient: "from-red-900/80 to-red-950/80",
          borderColor: "border-red-500/50",
        };
      case "mrwhite":
        return {
          emoji: "👻",
          title: "Victoire de Mr White !",
          subtitle: "Il a deviné le mot des Civils",
          color: "purple",
          bgGradient: "from-purple-900/80 to-purple-950/80",
          borderColor: "border-purple-500/50",
        };
      default:
        return {
          emoji: "🤷",
          title: "Partie terminée",
          subtitle: "",
          color: "gray",
          bgGradient: "from-dark-800 to-dark-900",
          borderColor: "border-dark-700",
        };
    }
  };

  const winnerInfo = getWinnerInfo(winner);

  // Grouper les joueurs par rôle
  const civils = players.filter((p) => p.role === "civil");
  const undercovers = players.filter((p) => p.role === "undercover");
  const mrWhite = players.find((p) => p.role === "mrwhite");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header avec animation */}
      <div
        className={`p-8 rounded-3xl bg-gradient-to-br ${winnerInfo.bgGradient} border-2 ${winnerInfo.borderColor} text-center animate-scale-in`}
      >
        <span className="text-8xl block mb-4 animate-bounce-slow">
          {winnerInfo.emoji}
        </span>
        <h1
          className={`text-4xl font-bold mb-2 ${
            winnerInfo.color === "blue"
              ? "text-blue-400"
              : winnerInfo.color === "red"
              ? "text-red-400"
              : winnerInfo.color === "purple"
              ? "text-purple-400"
              : "text-white"
          }`}
        >
          {winnerInfo.title}
        </h1>
        <p className="text-dark-300">{winnerInfo.subtitle}</p>
      </div>

      {/* Mr White guess result (si applicable) */}
      {mrWhiteGuessCorrect !== null && (
        <div
          className={`p-4 rounded-xl ${
            mrWhiteGuessCorrect
              ? "bg-purple-500/20 border border-purple-500/30"
              : "bg-red-500/20 border border-red-500/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {mrWhiteGuessCorrect ? "✅" : "❌"}
            </span>
            <p
              className={
                mrWhiteGuessCorrect ? "text-purple-400" : "text-red-400"
              }
            >
              {mrWhiteGuessCorrect
                ? `Mr White a correctement deviné "${wordPair.civilWord}" !`
                : "Mr White n'a pas trouvé le bon mot..."}
            </p>
          </div>
        </div>
      )}

      {/* Révélation des mots */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-dark-700">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📝</span>
          <span className="text-white font-bold">Les mots de la partie</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-500/20 rounded-xl text-center">
            <p className="text-blue-400 text-sm mb-1">Mot Civil</p>
            <p className="text-white text-xl font-bold">{wordPair.civilWord}</p>
          </div>
          <div className="p-4 bg-red-500/20 rounded-xl text-center">
            <p className="text-red-400 text-sm mb-1">Mot Undercover</p>
            <p className="text-white text-xl font-bold">
              {wordPair.undercoverWord}
            </p>
          </div>
        </div>
      </div>

      {/* Révélation des rôles */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-dark-700">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🎭</span>
          <span className="text-white font-bold">Qui était qui ?</span>
        </div>

        <div className="space-y-4">
          {/* Civils */}
          <div>
            <p className="text-blue-400 text-sm mb-2 flex items-center gap-2">
              <span>👤</span> Civils ({civils.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {civils.map((player) => (
                <span
                  key={player.id}
                  className={`px-3 py-1 rounded-full text-sm ${
                    player.isEliminated
                      ? "bg-dark-700 text-dark-400 line-through"
                      : "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  {player.name}
                </span>
              ))}
            </div>
          </div>

          {/* Undercovers */}
          <div>
            <p className="text-red-400 text-sm mb-2 flex items-center gap-2">
              <span>🕵️</span> Undercover{undercovers.length > 1 ? "s" : ""} (
              {undercovers.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {undercovers.map((player) => (
                <span
                  key={player.id}
                  className={`px-3 py-1 rounded-full text-sm ${
                    player.isEliminated
                      ? "bg-dark-700 text-dark-400 line-through"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {player.name}
                </span>
              ))}
            </div>
          </div>

          {/* Mr White */}
          {mrWhite && (
            <div>
              <p className="text-purple-400 text-sm mb-2 flex items-center gap-2">
                <span>👻</span> Mr White
              </p>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  mrWhite.isEliminated
                    ? "bg-dark-700 text-dark-400 line-through"
                    : "bg-purple-500/20 text-purple-300"
                }`}
              >
                {mrWhite.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-dark-700">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📊</span>
          <span className="text-white font-bold">Statistiques</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-dark-700/50 rounded-xl">
            <p className="text-3xl font-bold text-primary-400">{totalRounds}</p>
            <p className="text-dark-400 text-sm">Manches</p>
          </div>
          <div className="text-center p-3 bg-dark-700/50 rounded-xl">
            <p className="text-3xl font-bold text-red-400">
              {eliminationHistory.length}
            </p>
            <p className="text-dark-400 text-sm">Éliminations</p>
          </div>
        </div>
      </div>

      {/* Historique des éliminations */}
      {eliminationHistory.length > 0 && (
        <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-dark-700">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📜</span>
            <span className="text-white font-bold">Chronologie</span>
          </div>

          <div className="space-y-2">
            {eliminationHistory.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-dark-700/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-dark-500 text-sm w-8">M{entry.round}</span>
                  <span className="text-dark-300">{entry.playerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-dark-500 text-xs">
                    {entry.votesReceived} vote{entry.votesReceived > 1 ? "s" : ""}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      entry.role === "civil"
                        ? "bg-blue-500/20 text-blue-400"
                        : entry.role === "undercover"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {entry.role === "civil"
                      ? "Civil"
                      : entry.role === "undercover"
                      ? "UC"
                      : "MW"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onReplay}
          className="w-full py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🔄</span>
          <span>Rejouer (mêmes joueurs)</span>
        </button>

        <button
          onClick={onNewGame}
          className="w-full py-4 bg-dark-700 hover:bg-dark-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <span>⚙️</span>
          <span>Nouvelle configuration</span>
        </button>

        <button
          onClick={onBackToMenu}
          className="w-full py-3 bg-transparent hover:bg-dark-700/50 text-dark-400 font-semibold rounded-xl border border-dark-700 transition-all"
        >
          ← Retour au menu
        </button>
      </div>
    </div>
  );
};
