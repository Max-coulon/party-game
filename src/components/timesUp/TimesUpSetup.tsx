import React, { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { PageContainer } from "@/components/layout/PageContainer";
import { TimesUpTeamSelector } from "./TimesUpTeamSelector";
import { TimesUpWordInput } from "./TimesUpWordInput";
import {
  TimesUpTeam,
  TimesUpCard,
  TimesUpGameConfig,
} from "@/types";
import {
  generateDefaultDeck,
  generateCustomDeck,
  TEAM_COLORS,
  DEFAULT_TEAM_NAMES,
} from "@/data/timesUpWords";

interface TimesUpSetupProps {
  onStartGame: (config: TimesUpGameConfig) => void;
  onBack: () => void;
  hasSavedGame: boolean;
  onResumeSavedGame: () => void;
}

/**
 * Écran de configuration pour Time's Up
 */
export const TimesUpSetup: React.FC<TimesUpSetupProps> = ({
  onStartGame,
  onBack,
  hasSavedGame,
  onResumeSavedGame,
}) => {
  // État initial : 2 équipes
  const [teams, setTeams] = useState<TimesUpTeam[]>([
    {
      id: "team-1",
      name: DEFAULT_TEAM_NAMES[0],
      color: TEAM_COLORS[0],
      scores: [0, 0, 0],
    },
    {
      id: "team-2",
      name: DEFAULT_TEAM_NAMES[1],
      color: TEAM_COLORS[1],
      scores: [0, 0, 0],
    },
  ]);

  const [turnDuration, setTurnDuration] = useState(30);
  const [allowSkip, setAllowSkip] = useState(true);
  const [maxSkipsPerTurn, setMaxSkipsPerTurn] = useState(3);
  const [useDefaultWords, setUseDefaultWords] = useState(true);
  const [customWords, setCustomWords] = useState<string[]>([]);

  const handleStartGame = () => {
    if (teams.length < 2) {
      alert("Il faut au moins 2 équipes pour jouer !");
      return;
    }

    // Générer le deck
    let cards: TimesUpCard[] = [];

    if (useDefaultWords) {
      cards = generateDefaultDeck();
    }

    if (customWords.length > 0) {
      const customCards = generateCustomDeck(customWords);
      cards = [...cards, ...customCards];
    }

    if (cards.length < 10) {
      alert("Il faut au moins 10 mots pour jouer !");
      return;
    }

    const config: TimesUpGameConfig = {
      teams,
      turnDuration,
      allowSkip,
      maxSkipsPerTurn: allowSkip ? maxSkipsPerTurn : 0,
      cards,
    };

    onStartGame(config);
  };

  return (
    <PageContainer>
      <TopBar title="Time's Up" onBack={onBack} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-4 animate-slide-down">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-6xl animate-bounce-slow">⏱️</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Préparez-vous !</h2>
          <p className="text-dark-300 text-lg">
            Configurez votre partie Time's Up
          </p>
        </div>

        {/* Reprendre partie sauvegardée */}
        {hasSavedGame && (
          <div className="animate-scale-in">
            <button
              onClick={onResumeSavedGame}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-dark-900 font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-3"
            >
              <span className="text-2xl">▶️</span>
              <span>Reprendre la partie en cours</span>
            </button>
          </div>
        )}

        {/* Sélection des équipes */}
        <div className="animate-slide-up">
          <TimesUpTeamSelector teams={teams} onTeamsChange={setTeams} />
        </div>

        {/* Durée du tour */}
        <div
          className="animate-slide-up space-y-4"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏱️</span>
            <h3 className="text-xl font-bold text-white">Durée d'un tour</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[30, 45, 60].map((duration) => (
              <button
                key={duration}
                onClick={() => setTurnDuration(duration)}
                className={`
                  p-4 rounded-xl border-2 text-center transition-all duration-300
                  transform hover:scale-105 active:scale-95
                  ${
                    turnDuration === duration
                      ? "bg-primary-600 border-primary-400 shadow-lg"
                      : "bg-dark-700 border-dark-600 hover:border-dark-500"
                  }
                `}
              >
                <div className="text-3xl mb-1">{duration}</div>
                <p className="text-sm text-dark-300">secondes</p>
              </button>
            ))}
          </div>
        </div>

        {/* Option passer */}
        <div
          className="animate-slide-up space-y-4"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏭️</span>
            <h3 className="text-xl font-bold text-white">Bouton "Passer"</h3>
          </div>

          <div className="flex items-center justify-between bg-dark-700/50 rounded-xl p-4 border border-dark-600">
            <span className="text-white font-medium">
              Autoriser à passer une carte
            </span>
            <button
              onClick={() => setAllowSkip(!allowSkip)}
              className={`
                w-14 h-8 rounded-full transition-all duration-300 relative
                ${allowSkip ? "bg-green-500" : "bg-dark-600"}
              `}
            >
              <div
                className={`
                  absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md
                  ${allowSkip ? "left-7" : "left-1"}
                `}
              />
            </button>
          </div>

          {allowSkip && (
            <div className="animate-slide-down">
              <p className="text-dark-400 text-sm mb-2">
                Nombre max de passes par tour :
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 5, 0].map((val) => (
                  <button
                    key={val}
                    onClick={() => setMaxSkipsPerTurn(val)}
                    className={`
                      flex-1 py-2 rounded-lg text-center font-semibold transition-all
                      ${
                        maxSkipsPerTurn === val
                          ? "bg-primary-600 text-white"
                          : "bg-dark-700 text-dark-300 hover:bg-dark-600"
                      }
                    `}
                  >
                    {val === 0 ? "∞" : val}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Source des mots */}
        <div
          className="animate-slide-up space-y-4"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <h3 className="text-xl font-bold text-white">Paquet de mots</h3>
          </div>

          <div className="flex items-center justify-between bg-dark-700/50 rounded-xl p-4 border border-dark-600">
            <div>
              <span className="text-white font-medium">Mots par défaut</span>
              <p className="text-dark-400 text-sm">~100 mots variés</p>
            </div>
            <button
              onClick={() => setUseDefaultWords(!useDefaultWords)}
              className={`
                w-14 h-8 rounded-full transition-all duration-300 relative
                ${useDefaultWords ? "bg-green-500" : "bg-dark-600"}
              `}
            >
              <div
                className={`
                  absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md
                  ${useDefaultWords ? "left-7" : "left-1"}
                `}
              />
            </button>
          </div>

          <TimesUpWordInput onWordsChange={setCustomWords} />
        </div>

        {/* Bouton lancer */}
        <div
          className="pt-4 animate-slide-up"
          style={{ animationDelay: "0.25s" }}
        >
          <button
            onClick={handleStartGame}
            disabled={teams.length < 2}
            className={`
              w-full py-5 font-bold text-xl rounded-2xl transition-all duration-300 
              transform hover:scale-105 active:scale-95 shadow-xl
              flex items-center justify-center gap-3
              ${
                teams.length >= 2
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  : "bg-dark-700 text-dark-500 cursor-not-allowed"
              }
            `}
          >
            <span className="text-3xl">🎮</span>
            <span>Lancer la partie !</span>
          </button>
        </div>
      </div>
    </PageContainer>
  );
};
