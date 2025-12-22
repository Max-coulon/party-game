import React from "react";

interface CountdownDisplayProps {
  timeLeft: number;
  isVisible: boolean;
}

/**
 * Composant CountdownDisplay
 * Affiche le décompte 5 → 0 avec animation
 */
export const CountdownDisplay: React.FC<CountdownDisplayProps> = ({
  timeLeft,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      <div
        className={`
          relative
          w-40 h-40 md:w-48 md:h-48
          rounded-full
          bg-dark-900/80
          backdrop-blur-md
          border-4 border-primary-500/50
          flex items-center justify-center
          shadow-2xl
          animate-pulse
        `}
      >
        {/* Cercle de progression */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(14, 165, 233, 0.2)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(timeLeft / 5) * 283} 283`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Nombre */}
        <span
          className="text-7xl md:text-8xl font-black text-white drop-shadow-lg"
          style={{
            textShadow: "0 0 20px rgba(14, 165, 233, 0.8)",
          }}
        >
          {timeLeft}
        </span>
      </div>
    </div>
  );
};
