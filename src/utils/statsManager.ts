import { GameStats, NheMode } from "@/types";

const STATS_KEY = "party-game-stats";

/**
 * Récupère les statistiques depuis le localStorage
 */
export const getStats = (): GameStats => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des stats:", error);
  }

  // Statistiques par défaut
  return {
    totalGamesPlayed: 0,
    playerWins: {},
    modePlayCount: {
      soft: 0,
      hot: 0,
      hardcore: 0,
    },
  };
};

/**
 * Sauvegarde les statistiques dans le localStorage
 */
export const saveStats = (stats: GameStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des stats:", error);
  }
};

/**
 * Incrémente le compteur de parties jouées et met à jour les stats
 */
export const recordGamePlayed = (
  winnerId: string,
  winnerName: string,
  modes: NheMode[]
): void => {
  const stats = getStats();

  // Incrémenter le total de parties
  stats.totalGamesPlayed += 1;

  // Enregistrer la victoire
  if (!stats.playerWins[winnerId]) {
    stats.playerWins[winnerId] = 0;
  }
  stats.playerWins[winnerId] += 1;

  // Incrémenter les compteurs de modes
  modes.forEach((mode) => {
    stats.modePlayCount[mode] += 1;
  });

  // Timestamp
  stats.lastPlayed = Date.now();

  saveStats(stats);
};

/**
 * Réinitialise toutes les statistiques
 */
export const resetStats = (): void => {
  saveStats({
    totalGamesPlayed: 0,
    playerWins: {},
    modePlayCount: {
      soft: 0,
      hot: 0,
      hardcore: 0,
    },
  });
};

/**
 * Obtient le joueur avec le plus de victoires
 */
export const getTopPlayer = (): { id: string; wins: number } | null => {
  const stats = getStats();
  const entries = Object.entries(stats.playerWins);

  if (entries.length === 0) {
    return null;
  }

  const [id, wins] = entries.reduce((max, current) =>
    current[1] > max[1] ? current : max
  );

  return { id, wins };
};

/**
 * Obtient le mode le plus joué
 */
export const getMostPlayedMode = (): NheMode | null => {
  const stats = getStats();
  const modes = Object.entries(stats.modePlayCount) as [NheMode, number][];

  if (modes.every(([_, count]) => count === 0)) {
    return null;
  }

  const [mode] = modes.reduce((max, current) =>
    current[1] > max[1] ? current : max
  );

  return mode;
};
