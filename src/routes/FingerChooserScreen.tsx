import React from "react";
import { useNavigate } from "react-router-dom";
import { FingerChooserGame } from "@/components/fingerChooser";

/**
 * Écran principal du jeu "Finger Chooser" (type Chwazi)
 *
 * Jeu multi-touch où plusieurs joueurs posent leurs doigts sur l'écran.
 * Après un décompte de 5 secondes, un doigt est choisi au hasard.
 *
 * Fonctionnement :
 * 1. Les joueurs posent leurs doigts sur l'écran
 * 2. Dès que 2+ doigts sont détectés, le décompte démarre (5s)
 * 3. Si un doigt est retiré et qu'il reste moins de 2 doigts, le décompte s'annule
 * 4. À la fin du décompte, un doigt est choisi aléatoirement
 * 5. Le gagnant est mis en évidence avec des effets visuels
 */
export const FingerChooserScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return <FingerChooserGame onBack={handleBack} />;
};
