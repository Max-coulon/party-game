import React, { useState } from 'react';
import { usePlayers } from '@/context/PlayerContext';

interface PlayerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal de gestion des joueurs avec animations modernes
 * Permet d'ajouter, renommer et supprimer des joueurs
 * Utilise les classes CSS personnalisées pour les animations
 */
export const PlayerSelectionModal: React.FC<PlayerSelectionModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { players, addPlayer, removePlayer, updatePlayerName } = usePlayers();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  if (!isOpen) return null;

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      updatePlayerName(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md modal-backdrop">
      <div className="w-full max-w-md bg-dark-800 rounded-3xl shadow-2xl overflow-hidden border border-dark-700 modal-content">
        {/* Header avec dégradé amélioré */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 p-6 border-b-2 border-primary-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👥</span>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">Joueurs</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-white/10 active:bg-white/20 transition-all duration-200 transform hover:scale-110 active:scale-95"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body avec meilleur design */}
        <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
          {/* Formulaire d'ajout amélioré */}
          <div className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
                placeholder="Nom du joueur"
                className="flex-1 px-4 py-3 bg-dark-700 text-white rounded-xl border-2 border-dark-600 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 placeholder:text-dark-400"
              />
              <button
                onClick={handleAddPlayer}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 active:from-primary-800 active:to-primary-900 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <span className="text-lg">+</span>
              </button>
            </div>
          </div>

          {/* Liste des joueurs avec animations */}
          <div className="space-y-3">
            {players.length === 0 ? (
              <div className="text-center text-dark-400 py-12 animate-fade-in">
                <div className="text-5xl mb-3 opacity-50">👤</div>
                <p className="font-medium">Aucun joueur ajouté</p>
                <p className="text-sm mt-2">Ajoutez votre premier joueur ci-dessus</p>
              </div>
            ) : (
              players.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-4 bg-dark-700/70 backdrop-blur-sm rounded-xl border border-dark-600 hover:border-dark-500 transition-all duration-200 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {editingId === player.id ? (
                    <>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                        className="flex-1 px-3 py-2 bg-dark-600 text-white rounded-lg border-2 border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-all duration-200 transform hover:scale-110"
                        aria-label="Valider"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200 transform hover:scale-110"
                        aria-label="Annuler"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 flex-1">
                        {/* Avatar animé */}
                        <div className="
                          w-12 h-12 
                          rounded-full 
                          flex items-center justify-center 
                          text-2xl
                          bg-gradient-to-br from-primary-500/20 to-primary-600/20
                          backdrop-blur-sm
                          border-2 border-primary-500/30
                          shadow-lg
                          transform hover:scale-110 hover:rotate-12
                          transition-all duration-300
                        ">
                          <span className="animate-bounce-slow">{player.avatar}</span>
                        </div>
                        <span className="text-white font-medium">{player.name}</span>
                      </div>
                      <button
                        onClick={() => handleStartEdit(player.id, player.name)}
                        className="p-2 text-primary-400 hover:bg-primary-400/10 rounded-lg transition-all duration-200 transform hover:scale-110"
                        aria-label="Éditer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200 transform hover:scale-110"
                        aria-label="Supprimer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer amélioré */}
        <div className="p-6 bg-dark-800/80 backdrop-blur-sm border-t-2 border-dark-700">
          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 active:from-primary-800 active:to-primary-900 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
