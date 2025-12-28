import React from "react";
import { UndercoverPlayer } from "@/types";

interface UndercoverEliminationProps {
  eliminatedPlayer: UndercoverPlayer;
  revealRole: boolean;
  onConfirm: () => void;
}

/**
 * Écran d'annonce de l'élimination
 */
export const UndercoverElimination: React.FC<UndercoverEliminationProps> = ({
  eliminatedPlayer,
  revealRole,
  onConfirm,
}) => {
  const getRoleInfo = () => {
    switch (eliminatedPlayer.role) {
      case "civil":
        return {
          emoji: "👤",
          label: "CIVIL",
          color: "blue",
          message: "Le groupe a éliminé un innocent...",
        };
      case "undercover":
        return {
          emoji: "🕵️",
          label: "UNDERCOVER",
          color: "red",
          message: "Bien joué ! Un Undercover a été démasqué !",
        };
      case "mrwhite":
        return {
          emoji: "👻",
          label: "MR WHITE",
          color: "purple",
          message: "Mr White a été découvert ! Mais il peut encore gagner...",
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Animation dramatique */}
      <div className="text-center py-8">
        <div className="relative inline-block">
          <span className="text-9xl block animate-bounce-slow">💀</span>
          {/* Effet de halo */}
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
        </div>
      </div>

      {/* Nom de l'éliminé */}
      <div className="text-center space-y-2">
        <p className="text-dark-400 text-lg">A été éliminé(e)...</p>
        <h2 className="text-4xl font-bold text-white">
          {eliminatedPlayer.name}
        </h2>
      </div>

      {/* Révélation du rôle (si activé) */}
      {revealRole ? (
        <div
          className={`p-6 rounded-2xl border-2 text-center animate-scale-in ${
            roleInfo.color === "blue"
              ? "bg-blue-500/20 border-blue-500/50"
              : roleInfo.color === "red"
              ? "bg-red-500/20 border-red-500/50"
              : "bg-purple-500/20 border-purple-500/50"
          }`}
        >
          <span className="text-6xl block mb-3">{roleInfo.emoji}</span>
          <h3
            className={`text-3xl font-bold mb-2 ${
              roleInfo.color === "blue"
                ? "text-blue-400"
                : roleInfo.color === "red"
                ? "text-red-400"
                : "text-purple-400"
            }`}
          >
            {roleInfo.label}
          </h3>
          <p className="text-dark-300">{roleInfo.message}</p>

          {/* Afficher le mot si c'était un undercover */}
          {eliminatedPlayer.word && (
            <div className="mt-4 p-3 bg-black/30 rounded-xl">
              <p className="text-dark-400 text-sm">Son mot était :</p>
              <p className="text-white text-xl font-semibold">
                {eliminatedPlayer.word}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 bg-dark-800/80 rounded-2xl border border-dark-700 text-center">
          <span className="text-4xl block mb-3">🤫</span>
          <p className="text-dark-400">
            Le rôle de {eliminatedPlayer.name} reste secret...
          </p>
        </div>
      )}

      {/* Message selon le résultat */}
      {revealRole && (
        <div
          className={`p-4 rounded-xl ${
            eliminatedPlayer.role === "undercover"
              ? "bg-green-500/20 border border-green-500/30"
              : eliminatedPlayer.role === "mrwhite"
              ? "bg-yellow-500/20 border border-yellow-500/30"
              : "bg-red-500/20 border border-red-500/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {eliminatedPlayer.role === "undercover"
                ? "🎉"
                : eliminatedPlayer.role === "mrwhite"
                ? "⚠️"
                : "😰"}
            </span>
            <p
              className={`text-sm ${
                eliminatedPlayer.role === "undercover"
                  ? "text-green-400"
                  : eliminatedPlayer.role === "mrwhite"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {eliminatedPlayer.role === "undercover"
                ? "Les Civils ont bien joué ! Continue comme ça !"
                : eliminatedPlayer.role === "mrwhite"
                ? "Mr White va tenter de deviner le mot des Civils..."
                : "Mauvaise élimination ! L'Undercover est toujours parmi vous..."}
            </p>
          </div>
        </div>
      )}

      {/* Bouton continuer */}
      <button
        onClick={onConfirm}
        className="w-full py-5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3"
      >
        <span className="text-2xl">▶️</span>
        <span>
          {eliminatedPlayer.role === "mrwhite"
            ? "Mr White devine !"
            : "Continuer"}
        </span>
      </button>
    </div>
  );
};
