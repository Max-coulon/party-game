import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player } from '@/types';

/**
 * Interface du contexte des joueurs
 */
interface PlayerContextType {
  players: Player[];
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updatePlayerName: (id: string, name: string) => void;
  updatePlayerScore: (id: string, scoreToAdd: number) => void;
  resetScores: () => void;
  clearPlayers: () => void;
}

/**
 * Contexte pour gérer les joueurs de manière globale
 */
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

/**
 * Provider pour le contexte des joueurs
 */
export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);

  // Liste d'avatars animés variés
  const avatars = [
    '🦊', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🦄', '🐉', '🦖', '🦕', '🐙', '🦀', '🐠', '🐡', '🦈', '🐬',
    '🦋', '🐝', '🐞', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦘',
    '🎃', '👻', '👽', '🤖', '💀', '🎭', '🎪', '🎨', '🎯', '🎲',
    '⚡', '🔥', '💎', '🌟', '✨', '🎵', '🎸', '🎮', '🏆', '🍕'
  ];

  /**
   * Sélectionne un avatar aléatoire qui n'est pas déjà utilisé
   */
  const getRandomAvatar = (): string => {
    const usedAvatars = players.map(p => p.avatar);
    const availableAvatars = avatars.filter(a => !usedAvatars.includes(a));
    
    // Si tous les avatars sont utilisés, en prendre un au hasard
    const pool = availableAvatars.length > 0 ? availableAvatars : avatars;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  /**
   * Ajoute un nouveau joueur
   */
  const addPlayer = (name: string) => {
    const newPlayer: Player = {
      id: `player-${Date.now()}-${Math.random()}`,
      name,
      score: 0,
      avatar: getRandomAvatar(),
    };
    setPlayers(prev => [...prev, newPlayer]);
  };

  /**
   * Supprime un joueur par son ID
   */
  const removePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  /**
   * Met à jour le nom d'un joueur
   */
  const updatePlayerName = (id: string, name: string) => {
    setPlayers(prev =>
      prev.map(p => (p.id === id ? { ...p, name } : p))
    );
  };

  /**
   * Ajoute des points/gorgées au score d'un joueur
   */
  const updatePlayerScore = (id: string, scoreToAdd: number) => {
    setPlayers(prev =>
      prev.map(p => (p.id === id ? { ...p, score: p.score + scoreToAdd } : p))
    );
  };

  /**
   * Réinitialise les scores de tous les joueurs
   */
  const resetScores = () => {
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
  };

  /**
   * Supprime tous les joueurs
   */
  const clearPlayers = () => {
    setPlayers([]);
  };

  return (
    <PlayerContext.Provider
      value={{
        players,
        addPlayer,
        removePlayer,
        updatePlayerName,
        updatePlayerScore,
        resetScores,
        clearPlayers,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le contexte des joueurs
 */
export const usePlayers = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayers must be used within a PlayerProvider');
  }
  return context;
};
