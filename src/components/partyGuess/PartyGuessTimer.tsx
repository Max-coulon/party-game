import React from "react";

interface PartyGuessTimerProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
}

/**
 * Timer circulaire pour Party Guess
 */
export const PartyGuessTimer: React.FC<PartyGuessTimerProps> = ({
  timeLeft,
  totalTime,
  isActive,
}) => {
  const percentage = (timeLeft / totalTime) * 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (timeLeft <= 5) return "#ef4444";
    if (timeLeft <= 10) return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
        />
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

      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-3xl font-bold transition-colors duration-300 ${
            timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-white"
          }`}
        >
          {timeLeft}
        </span>
      </div>

      {isActive && timeLeft <= 5 && (
        <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-30" />
      )}
    </div>
  );
};
