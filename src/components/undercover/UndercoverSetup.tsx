import React, { useState, useMemo } from "react";
import {
  UndercoverGameConfig,
  UndercoverRulesOptions,
  UndercoverWordPair,
} from "@/types";
import {
  DEFAULT_WORD_PAIRS,
  getRandomWordPair,
  getMaxUndercoverCount,
  canHaveMrWhite,
  parseCustomWordPairs,
} from "@/data/undercoverData";

interface UndercoverSetupProps {
  onStartGame: (config: UndercoverGameConfig) => void;
  onBack: () => void;
  hasSavedGame: boolean;
  onResumeSavedGame: () => void;
}

/**
 * Écran de configuration du jeu Undercover
 */
export const UndercoverSetup: React.FC<UndercoverSetupProps> = ({
  onStartGame,
  onBack,
  hasSavedGame,
  onResumeSavedGame,
}) => {
  // Configuration des joueurs
  const [playerCount, setPlayerCount] = useState(4);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(4).fill(""));

  // Configuration des rôles
  const [undercoverCount, setUndercoverCount] = useState(1);
  const [hasMrWhite, setHasMrWhite] = useState(false);

  // Configuration des mots
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [customWordsText, setCustomWordsText] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Règles
  const [discussionDuration, setDiscussionDuration] = useState(0);
  const [allowSelfVote] = useState(false);
  const [revealRoleOnElimination, setRevealRoleOnElimination] = useState(true);
  const [showEliminationHistory, setShowEliminationHistory] = useState(true);
  const [tieBreakMode, setTieBreakMode] = useState<"random" | "revote">("random");

  // Calculs dynamiques
  const maxUndercovers = useMemo(
    () => getMaxUndercoverCount(playerCount),
    [playerCount]
  );

  const mrWhiteAllowed = useMemo(
    () => canHaveMrWhite(playerCount, undercoverCount),
    [playerCount, undercoverCount]
  );

  // Catégories uniques
  const categories = useMemo(() => {
    const cats = new Set(DEFAULT_WORD_PAIRS.map((p) => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, []);

  // Mise à jour du nombre de joueurs
  const handlePlayerCountChange = (newCount: number) => {
    setPlayerCount(newCount);
    
    // Ajuster les noms
    if (newCount > playerNames.length) {
      const additionalNames = Array(newCount - playerNames.length).fill("");
      setPlayerNames([...playerNames, ...additionalNames]);
    } else {
      setPlayerNames(playerNames.slice(0, newCount));
    }

    // Ajuster le nombre d'undercovers si nécessaire
    const newMax = getMaxUndercoverCount(newCount);
    if (undercoverCount > newMax) {
      setUndercoverCount(newMax);
    }

    // Désactiver Mr White si plus autorisé
    if (!canHaveMrWhite(newCount, undercoverCount)) {
      setHasMrWhite(false);
    }
  };

  // Mise à jour du nombre d'undercovers
  const handleUndercoverCountChange = (newCount: number) => {
    setUndercoverCount(newCount);
    
    // Désactiver Mr White si plus autorisé
    if (!canHaveMrWhite(playerCount, newCount)) {
      setHasMrWhite(false);
    }
  };

  // Mise à jour du nom d'un joueur
  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  // Vérifier si tous les noms sont renseignés
  const allNamesEntered = playerNames.every(n => n.trim().length > 0);

  // Démarrer la partie
  const handleStartGame = () => {
    // Vérifier que tous les noms sont renseignés
    if (!allNamesEntered) {
      alert("Veuillez renseigner le nom de tous les joueurs !");
      return;
    }
    
    // Valider les noms
    const validNames = playerNames.map((n) => n.trim());

    // Sélectionner une paire de mots
    let wordPair: UndercoverWordPair;

    if (customWordsText.trim()) {
      const customPairs = parseCustomWordPairs(customWordsText);
      if (customPairs.length > 0) {
        wordPair = customPairs[Math.floor(Math.random() * customPairs.length)];
      } else {
        wordPair = getRandomWordPair([], selectedCategory === "all" ? undefined : selectedCategory);
      }
    } else {
      wordPair = getRandomWordPair([], selectedCategory === "all" ? undefined : selectedCategory);
    }

    const rules: UndercoverRulesOptions = {
      discussionDuration,
      allowSelfVote,
      revealRoleOnElimination,
      showEliminationHistory,
      tieBreakMode,
    };

    const config: UndercoverGameConfig = {
      playerNames: validNames,
      undercoverCount,
      hasMrWhite,
      wordPair,
      rules,
    };

    onStartGame(config);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2 py-4 animate-slide-down">
        <span className="text-6xl block">🕵️</span>
        <h2 className="text-2xl font-bold text-white">Undercover</h2>
        <p className="text-dark-400 text-sm">
          Trouvez l'imposteur parmi vous !
        </p>
      </div>

      {/* Reprendre partie sauvegardée */}
      {hasSavedGame && (
        <button
          onClick={onResumeSavedGame}
          className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-dark-900 font-bold text-lg rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-3 animate-scale-in"
        >
          <span className="text-2xl">▶️</span>
          <span>Reprendre la partie</span>
        </button>
      )}

      {/* Nombre de joueurs */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-dark-700 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">👥</span>
            <span className="text-white font-bold">Joueurs</span>
          </div>
          <span className="text-primary-400 font-semibold">{playerCount}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePlayerCountChange(Math.max(3, playerCount - 1))}
            disabled={playerCount <= 3}
            className="w-12 h-12 rounded-xl bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xl transition-all"
          >
            -
          </button>
          <input
            type="range"
            min={3}
            max={12}
            value={playerCount}
            onChange={(e) => handlePlayerCountChange(Number(e.target.value))}
            className="flex-1 h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <button
            onClick={() => handlePlayerCountChange(Math.min(12, playerCount + 1))}
            disabled={playerCount >= 12}
            className="w-12 h-12 rounded-xl bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xl transition-all"
          >
            +
          </button>
        </div>

        {/* Liste des noms des joueurs */}
        <div className="mt-4 space-y-2">
          <p className="text-dark-400 text-sm mb-3">Entrez le nom de chaque joueur :</p>
          {playerNames.map((name, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-primary-400 font-bold w-6 text-center">{index + 1}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                placeholder={`Nom du joueur ${index + 1}`}
                className={`flex-1 px-4 py-3 bg-dark-700 border rounded-xl text-white placeholder-dark-500 focus:outline-none transition-colors ${
                  name.trim() ? "border-green-500/50" : "border-dark-600 focus:border-primary-500"
                }`}
              />
              {name.trim() && <span className="text-green-500">✓</span>}
            </div>
          ))}
          
          {/* Indicateur de progression */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-700">
            <span className="text-dark-500 text-sm">
              {playerNames.filter(n => n.trim()).length} / {playerCount} joueurs
            </span>
            {playerNames.filter(n => n.trim()).length === playerCount && (
              <span className="text-green-400 text-sm flex items-center gap-1">
                <span>✓</span> Tous les noms sont renseignés
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Configuration des rôles */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-dark-700 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🎭</span>
          <span className="text-white font-bold">Rôles</span>
        </div>

        {/* Nombre d'Undercovers */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-dark-300">Undercover(s)</span>
            <span className="text-red-400 font-semibold">{undercoverCount}</span>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: maxUndercovers }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => handleUndercoverCountChange(num)}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                  undercoverCount === num
                    ? "bg-red-500 text-white"
                    : "bg-dark-700 text-dark-300 hover:bg-dark-600"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Mr White */}
        <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👻</span>
            <div>
              <span className="text-white font-medium">Mr White</span>
              <p className="text-dark-400 text-xs">N'a pas de mot, doit deviner</p>
            </div>
          </div>
          <button
            onClick={() => setHasMrWhite(!hasMrWhite)}
            disabled={!mrWhiteAllowed}
            className={`w-14 h-8 rounded-full transition-all relative ${
              hasMrWhite ? "bg-purple-500" : "bg-dark-600"
            } ${!mrWhiteAllowed ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${
                hasMrWhite ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        {!mrWhiteAllowed && playerCount >= 4 && (
          <p className="text-yellow-500 text-xs mt-2">
            ⚠️ Réduisez le nombre d'Undercovers pour activer Mr White
          </p>
        )}
      </div>

      {/* Pack de mots */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-dark-700 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📝</span>
          <span className="text-white font-bold">Pack de mots</span>
        </div>

        {/* Catégorie */}
        <div className="mb-4">
          <label className="text-dark-300 text-sm block mb-2">Catégorie</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-colors"
          >
            <option value="all">🎲 Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Mots personnalisés */}
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="w-full py-2 text-dark-400 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <span>{showCustomInput ? "▼" : "▶"}</span>
          <span>Ajouter des mots personnalisés</span>
        </button>

        {showCustomInput && (
          <div className="mt-3 animate-fade-in">
            <textarea
              value={customWordsText}
              onChange={(e) => setCustomWordsText(e.target.value)}
              placeholder="motCivil | motUndercover&#10;pizza | tarte&#10;..."
              rows={4}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors resize-none text-sm"
            />
            <p className="text-dark-500 text-xs mt-1">
              Format: un mot civil | un mot undercover par ligne
            </p>
          </div>
        )}
      </div>

      {/* Règles optionnelles */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-5 border border-dark-700 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⚙️</span>
          <span className="text-white font-bold">Règles</span>
        </div>

        {/* Timer discussion */}
        <div className="mb-4">
          <label className="text-dark-300 text-sm block mb-2">
            Durée de discussion
          </label>
          <div className="flex gap-2">
            {[0, 60, 90, 120].map((duration) => (
              <button
                key={duration}
                onClick={() => setDiscussionDuration(duration)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  discussionDuration === duration
                    ? "bg-primary-500 text-white"
                    : "bg-dark-700 text-dark-300 hover:bg-dark-600"
                }`}
              >
                {duration === 0 ? "Sans" : `${duration}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Options toggles */}
        <div className="space-y-3">
          {/* Révéler rôle */}
          <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-xl">
            <span className="text-dark-300 text-sm">Révéler le rôle à l'élimination</span>
            <button
              onClick={() => setRevealRoleOnElimination(!revealRoleOnElimination)}
              className={`w-12 h-6 rounded-full transition-all relative ${
                revealRoleOnElimination ? "bg-green-500" : "bg-dark-600"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                  revealRoleOnElimination ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Historique */}
          <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-xl">
            <span className="text-dark-300 text-sm">Afficher l'historique</span>
            <button
              onClick={() => setShowEliminationHistory(!showEliminationHistory)}
              className={`w-12 h-6 rounded-full transition-all relative ${
                showEliminationHistory ? "bg-green-500" : "bg-dark-600"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                  showEliminationHistory ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Égalité */}
          <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-xl">
            <span className="text-dark-300 text-sm">En cas d'égalité</span>
            <div className="flex gap-1">
              <button
                onClick={() => setTieBreakMode("random")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  tieBreakMode === "random"
                    ? "bg-primary-500 text-white"
                    : "bg-dark-600 text-dark-300"
                }`}
              >
                Hasard
              </button>
              <button
                onClick={() => setTieBreakMode("revote")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  tieBreakMode === "revote"
                    ? "bg-primary-500 text-white"
                    : "bg-dark-600 text-dark-300"
                }`}
              >
                Revote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Résumé */}
      <div className="bg-dark-700/50 rounded-xl p-4 border border-dark-600">
        <div className="text-center text-sm">
          <span className="text-dark-400">Configuration: </span>
          <span className="text-white">
            {playerCount - undercoverCount - (hasMrWhite ? 1 : 0)} Civils
          </span>
          <span className="text-dark-400"> • </span>
          <span className="text-red-400">{undercoverCount} Undercover{undercoverCount > 1 ? "s" : ""}</span>
          {hasMrWhite && (
            <>
              <span className="text-dark-400"> • </span>
              <span className="text-purple-400">1 Mr White</span>
            </>
          )}
        </div>
      </div>

      {/* Boutons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleStartGame}
          disabled={!allNamesEntered}
          className={`w-full py-5 font-bold text-xl rounded-2xl transition-all transform shadow-xl flex items-center justify-center gap-3 ${
            allNamesEntered
              ? "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white hover:scale-105 active:scale-95"
              : "bg-dark-700 text-dark-500 cursor-not-allowed"
          }`}
        >
          <span className="text-3xl">{allNamesEntered ? "🚀" : "✏️"}</span>
          <span>{allNamesEntered ? "Commencer !" : "Renseignez tous les noms"}</span>
        </button>

        <button
          onClick={onBack}
          className="w-full py-3 bg-transparent hover:bg-dark-700/50 text-dark-400 font-semibold rounded-xl border border-dark-700 transition-all"
        >
          ← Retour au menu
        </button>
      </div>
    </div>
  );
};
