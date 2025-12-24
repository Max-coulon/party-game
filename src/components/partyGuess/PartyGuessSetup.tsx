import React, { useState } from "react";
import {
  PartyGuessTeam,
  PartyGuessVariant,
  PartyGuessGameConfig,
  PartyGuessCard,
  PartyGuessRoundConfig,
  PARTY_GUESS_VARIANTS,
} from "@/types";
import {
  getDefaultDeck,
  parseCustomImport,
  PARTY_GUESS_TEAM_COLORS,
  PARTY_GUESS_DEFAULT_TEAM_NAMES,
} from "@/data/partyGuessData";

interface PartyGuessSetupProps {
  initialVariant: PartyGuessVariant;
  onStartGame: (config: PartyGuessGameConfig) => void;
  onBack: () => void;
  hasSavedGame: boolean;
  onResumeSavedGame: () => void;
}

/**
 * Écran de configuration du jeu
 */
export const PartyGuessSetup: React.FC<PartyGuessSetupProps> = ({
  initialVariant,
  onStartGame,
  onBack,
  hasSavedGame,
  onResumeSavedGame,
}) => {
  // Variantes sélectionnées (plusieurs modes = plusieurs manches)
  const [selectedVariants, setSelectedVariants] = useState<PartyGuessVariant[]>([initialVariant]);

  // État des équipes
  const [teams, setTeams] = useState<PartyGuessTeam[]>([
    { id: "team-1", name: PARTY_GUESS_DEFAULT_TEAM_NAMES[0], color: PARTY_GUESS_TEAM_COLORS[0], score: 0 },
    { id: "team-2", name: PARTY_GUESS_DEFAULT_TEAM_NAMES[1], color: PARTY_GUESS_TEAM_COLORS[1], score: 0 },
  ]);

  const [turnDuration, setTurnDuration] = useState(30);
  const [allowSkip, setAllowSkip] = useState(true);
  const [maxSkipsPerTurn, setMaxSkipsPerTurn] = useState(3);
  const [cardsPerRound, setCardsPerRound] = useState(0); // 0 = toutes les cartes
  const [useDefaultWords, setUseDefaultWords] = useState(true);
  const [customWordsText, setCustomWordsText] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [showVariantSelector, setShowVariantSelector] = useState(false);

  const handleAddTeam = () => {
    if (teams.length >= 6) return;
    const newTeam: PartyGuessTeam = {
      id: `team-${Date.now()}`,
      name: PARTY_GUESS_DEFAULT_TEAM_NAMES[teams.length] || `Équipe ${teams.length + 1}`,
      color: PARTY_GUESS_TEAM_COLORS[teams.length % PARTY_GUESS_TEAM_COLORS.length],
      score: 0,
    };
    setTeams([...teams, newTeam]);
  };

  const handleRemoveTeam = (teamId: string) => {
    if (teams.length <= 2) return;
    setTeams(teams.filter((t) => t.id !== teamId));
  };

  const handleUpdateTeamName = (teamId: string, name: string) => {
    setTeams(teams.map((t) => (t.id === teamId ? { ...t, name } : t)));
  };

  const toggleVariant = (variant: PartyGuessVariant) => {
    setSelectedVariants(prev => {
      if (prev.includes(variant)) {
        // Ne pas permettre de désélectionner la dernière variante
        if (prev.length <= 1) return prev;
        return prev.filter(v => v !== variant);
      }
      return [...prev, variant];
    });
  };

  const handleStartGame = () => {
    if (teams.length < 2) {
      alert("Il faut au moins 2 équipes !");
      return;
    }

    if (selectedVariants.length === 0) {
      alert("Il faut au moins un mode de jeu !");
      return;
    }

    // Créer la configuration de chaque manche
    const rounds: PartyGuessRoundConfig[] = selectedVariants.map(variant => {
      let cards: PartyGuessCard[] = [];

      if (useDefaultWords) {
        cards = getDefaultDeck(variant);
      }

      if (customWordsText.trim()) {
        const customCards = parseCustomImport(customWordsText, variant);
        cards = [...cards, ...customCards];
      }

      return {
        variant,
        cards,
        cardsPerRound,
      };
    });

    // Vérifier qu'on a assez de cartes
    const minCards = cardsPerRound > 0 ? cardsPerRound : 5;
    const invalidRound = rounds.find(r => r.cards.length < minCards);
    if (invalidRound) {
      const variantName = PARTY_GUESS_VARIANTS[invalidRound.variant].name;
      alert(`Il faut au moins ${minCards} cartes pour le mode "${variantName}" !`);
      return;
    }

    const config: PartyGuessGameConfig = {
      variants: selectedVariants,
      rounds,
      teams,
      turnDuration,
      allowSkip,
      maxSkipsPerTurn: allowSkip ? maxSkipsPerTurn : 0,
      totalRounds: selectedVariants.length,
      cardsPerRound,
    };

    onStartGame(config);
  };

  // Placeholder pour l'input selon la variante
  const getPlaceholder = () => {
    if (selectedVariants.includes("lyrics")) {
      return "Debut des paroles || Suite attendue\nAutre debut || Suite\n...";
    }
    if (selectedVariants.includes("singIt")) {
      return "Titre de la chanson - Artiste\nAutre titre - Autre artiste\n...";
    }
    return "Un mot par ligne\nAutre mot\n...";
  };

  const allVariants = Object.entries(PARTY_GUESS_VARIANTS) as [
    PartyGuessVariant,
    typeof PARTY_GUESS_VARIANTS[PartyGuessVariant]
  ][];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header - Modes sélectionnés */}
      <div className="text-center space-y-2 py-4 animate-slide-down">
        <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
          {selectedVariants.map(v => (
            <span key={v} className="text-3xl">{PARTY_GUESS_VARIANTS[v].icon}</span>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white">
          {selectedVariants.length === 1 
            ? PARTY_GUESS_VARIANTS[selectedVariants[0]].name
            : `${selectedVariants.length} modes sélectionnés`}
        </h2>
        <p className="text-dark-400 text-sm">
          {selectedVariants.length === 1 
            ? PARTY_GUESS_VARIANTS[selectedVariants[0]].description
            : `${selectedVariants.length} manche${selectedVariants.length > 1 ? 's' : ''} avec des modes différents`}
        </p>
      </div>

      {/* Reprendre partie */}
      {hasSavedGame && (
        <button
          onClick={onResumeSavedGame}
          className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-dark-900 font-bold text-lg rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-3 animate-scale-in"
        >
          <span className="text-2xl">▶️</span>
          <span>Reprendre la partie</span>
        </button>
      )}

      {/* Sélection des modes (manches) */}
      <div className="space-y-3 animate-slide-up">
        <button
          onClick={() => setShowVariantSelector(!showVariantSelector)}
          className="w-full flex items-center justify-between p-4 bg-dark-700/50 rounded-xl border border-dark-600 hover:border-primary-500 transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="text-white font-bold">Modes de jeu (manches)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary-400 font-semibold">{selectedVariants.length} mode{selectedVariants.length > 1 ? 's' : ''}</span>
            <svg
              className={`w-5 h-5 text-dark-400 transition-transform ${showVariantSelector ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {showVariantSelector && (
          <div className="space-y-2 animate-slide-down">
            <p className="text-dark-400 text-sm px-1">Sélectionnez un ou plusieurs modes. Chaque mode = une manche !</p>
            <div className="grid grid-cols-2 gap-2">
              {allVariants.map(([key, variant]) => {
                const isSelected = selectedVariants.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleVariant(key)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? "bg-primary-600/30 border-primary-500"
                        : "bg-dark-700/50 border-dark-600 hover:border-dark-500"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{variant.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{variant.name}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedVariants.length > 1 && (
              <div className="p-3 bg-primary-500/10 rounded-lg border border-primary-500/30">
                <p className="text-primary-300 text-sm font-medium">
                  📋 Ordre des manches : {selectedVariants.map(v => PARTY_GUESS_VARIANTS[v].icon).join(' → ')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Équipes */}
      <div className="space-y-3 animate-slide-up">
        <div className="flex items-center gap-2">
          <span className="text-xl">👥</span>
          <h3 className="text-lg font-bold text-white">Équipes</h3>
          <span className="text-dark-400 text-sm ml-auto">{teams.length}/6</span>
        </div>

        {teams.map((team, index) => (
          <div
            key={team.id}
            className="bg-dark-700/50 rounded-xl p-3 border border-dark-600 flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: team.color }}
            >
              {index + 1}
            </div>

            {editingTeamId === team.id ? (
              <input
                type="text"
                value={team.name}
                onChange={(e) => handleUpdateTeamName(team.id, e.target.value)}
                onBlur={() => setEditingTeamId(null)}
                onKeyDown={(e) => e.key === "Enter" && setEditingTeamId(null)}
                autoFocus
                className="flex-1 bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                maxLength={20}
              />
            ) : (
              <button
                onClick={() => setEditingTeamId(team.id)}
                className="flex-1 text-left text-white font-semibold hover:text-primary-300"
              >
                {team.name} <span className="text-dark-500 text-xs">✏️</span>
              </button>
            )}

            {teams.length > 2 && (
              <button
                onClick={() => handleRemoveTeam(team.id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {teams.length < 6 && (
          <button
            onClick={handleAddTeam}
            className="w-full py-3 border-2 border-dashed border-dark-600 hover:border-primary-500 rounded-xl text-dark-400 hover:text-primary-400 font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>➕</span> Ajouter une équipe
          </button>
        )}
      </div>

      {/* Durée du tour */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">⏱️</span>
          <h3 className="text-lg font-bold text-white">Durée d'un tour</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[30, 45, 60].map((duration) => (
            <button
              key={duration}
              onClick={() => setTurnDuration(duration)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                turnDuration === duration
                  ? "bg-primary-600 border-primary-400"
                  : "bg-dark-700 border-dark-600 hover:border-dark-500"
              }`}
            >
              <div className="text-2xl font-bold text-white">{duration}</div>
              <p className="text-xs text-dark-300">sec</p>
            </button>
          ))}
        </div>
      </div>

      {/* Option passer */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.15s" }}>
        <div className="flex items-center justify-between bg-dark-700/50 rounded-xl p-4 border border-dark-600">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏭️</span>
            <span className="text-white font-medium">Autoriser "Passer"</span>
          </div>
          <button
            onClick={() => setAllowSkip(!allowSkip)}
            className={`w-14 h-8 rounded-full transition-all relative ${
              allowSkip ? "bg-green-500" : "bg-dark-600"
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${
                allowSkip ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        {allowSkip && (
          <div className="animate-slide-down">
            <p className="text-dark-400 text-sm mb-2">Max passes par tour :</p>
            <div className="flex gap-2">
              {[1, 2, 3, 5, 0].map((val) => (
                <button
                  key={val}
                  onClick={() => setMaxSkipsPerTurn(val)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                    maxSkipsPerTurn === val
                      ? "bg-primary-600 text-white"
                      : "bg-dark-700 text-dark-300 hover:bg-dark-600"
                  }`}
                >
                  {val === 0 ? "∞" : val}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Nombre de cartes par manche */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🃏</span>
          <h3 className="text-lg font-bold text-white">Cartes par manche</h3>
        </div>
        <div className="flex gap-2">
          {[0, 10, 15, 20, 30].map((count) => (
            <button
              key={count}
              onClick={() => setCardsPerRound(count)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                cardsPerRound === count
                  ? "bg-primary-600 text-white"
                  : "bg-dark-700 text-dark-300 hover:bg-dark-600"
              }`}
            >
              {count === 0 ? "∞" : count}
            </button>
          ))}
        </div>
        <p className="text-dark-400 text-xs px-1">
          {cardsPerRound === 0 ? "Toutes les cartes seront utilisées" : `${cardsPerRound} cartes seront tirées au hasard`}
        </p>
      </div>

      {/* Paquet de cartes */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.25s" }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">📝</span>
          <h3 className="text-lg font-bold text-white">Cartes</h3>
        </div>

        <div className="flex items-center justify-between bg-dark-700/50 rounded-xl p-4 border border-dark-600">
          <span className="text-white font-medium">Cartes par défaut</span>
          <button
            onClick={() => setUseDefaultWords(!useDefaultWords)}
            className={`w-14 h-8 rounded-full transition-all relative ${
              useDefaultWords ? "bg-green-500" : "bg-dark-600"
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${
                useDefaultWords ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="w-full flex items-center justify-between p-4 bg-dark-700/50 rounded-xl border border-dark-600 hover:border-dark-500"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">✏️</span>
            <span className="text-white font-medium">Ajouter des cartes</span>
          </div>
          <svg
            className={`w-5 h-5 text-dark-400 transition-transform ${
              showCustomInput ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showCustomInput && (
          <div className="animate-slide-down">
            <textarea
              value={customWordsText}
              onChange={(e) => setCustomWordsText(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full h-36 bg-dark-700 border border-dark-600 rounded-xl p-4 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
            />
          </div>
        )}
      </div>

      {/* Boutons action */}
      <div className="space-y-3 pt-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <button
          onClick={handleStartGame}
          disabled={teams.length < 2}
          className={`w-full py-5 font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3 ${
            teams.length >= 2
              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              : "bg-dark-700 text-dark-500 cursor-not-allowed"
          }`}
        >
          <span className="text-3xl">🎮</span>
          <span>Lancer la partie !</span>
        </button>

        <button
          onClick={onBack}
          className="w-full py-3 bg-transparent hover:bg-dark-800 text-dark-300 hover:text-white font-semibold rounded-xl border-2 border-dark-700 transition-all"
        >
          ← Changer de mode
        </button>
      </div>
    </div>
  );
};
