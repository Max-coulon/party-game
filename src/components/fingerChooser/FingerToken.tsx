import React from "react";
import { FingerToken as FingerTokenType } from "@/types";

interface FingerTokenProps {
  finger: FingerTokenType;
  isWinner: boolean;
  isChosen: boolean; // Le jeu a choisi un gagnant
}

/**
 * Composant FingerToken
 * Affiche un cercle coloré à la position d'un doigt
 * Avec effets visuels pour le gagnant
 */
export const FingerToken: React.FC<FingerTokenProps> = ({
  finger,
  isWinner,
  isChosen,
}) => {
  const size = isWinner ? 120 : 80; // Taille plus grande pour le gagnant
  const halfSize = size / 2;

  return (
    <div
      className={`
        absolute pointer-events-none
        rounded-full
        flex items-center justify-center
        transition-all duration-300
        ${isChosen && !isWinner ? "opacity-30 scale-75" : "opacity-100"}
        ${isWinner ? "z-50" : "z-40"}
      `}
      style={{
        left: finger.x - halfSize,
        top: finger.y - halfSize,
        width: size,
        height: size,
        backgroundColor: finger.color,
        boxShadow: isWinner
          ? `0 0 40px 15px ${finger.color}80, 0 0 80px 30px ${finger.color}40, inset 0 0 20px rgba(255,255,255,0.3)`
          : `0 0 20px 5px ${finger.color}60, inset 0 0 15px rgba(255,255,255,0.2)`,
        border: isWinner
          ? "4px solid white"
          : "3px solid rgba(255,255,255,0.5)",
        transform: isWinner ? "scale(1.2)" : "scale(1)",
      }}
    >
      {/* Icône centrale */}
      <span
        className={`
          text-white font-bold select-none
          transition-all duration-300
          ${isWinner ? "text-4xl animate-bounce" : "text-2xl"}
        `}
        style={{
          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        {isWinner ? "👆" : "✋"}
      </span>

      {/* Ring animé pour le gagnant */}
      {isWinner && (
        <>
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              backgroundColor: finger.color,
              opacity: 0.4,
            }}
          />
          <div
            className="absolute rounded-full animate-pulse"
            style={{
              inset: -10,
              border: `3px solid ${finger.color}`,
              opacity: 0.6,
            }}
          />
        </>
      )}
    </div>
  );
};
