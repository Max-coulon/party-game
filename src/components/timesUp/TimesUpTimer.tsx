import React from "react";

interface TimesUpTimerProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
}

/**
 * Composant Timer circulaire pour Time's Up
 */
export const TimesUpTimer: React.FC<TimesUpTimerProps> = ({
  timeLeft,
  totalTime,
  isActive,
}) => {
  const percentage = (timeLeft / totalTime) * 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Couleur selon le temps restant
  const getColor = () => {
    if (timeLeft <= 5) return "#ef4444"; // Rouge
    if (timeLeft <= 10) return "#f59e0b"; // Orange
    return "#22c55e"; // Vert
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* SVG Circle */}
      <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>

      {/* Timer text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-4xl font-bold transition-colors duration-300 ${
            timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-white"
          }`}
        >
          {timeLeft}
        </span>
      </div>

      {/* Pulse effect when active and low time */}
      {isActive && timeLeft <= 5 && (
        <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-30" />
      )}
    </div>
  );
};
