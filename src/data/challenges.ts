/**
 * Liste des défis/gages pour le mode challenge
 */
export const challenges = [
  "Chante les 30 premières secondes de ta chanson préférée 🎤",
  "Raconte ton moment le plus gênant en 30 secondes 😳",
  "Fais 10 pompes maintenant 💪",
  "Imite un animal pendant 20 secondes 🐒",
  "Parle avec un accent pendant les 2 prochaines questions 🗣️",
  "Danse pendant 30 secondes 💃",
  "Complimente chaque joueur 💝",
  "Fais rire tout le monde en 30 secondes 😂",
  "Partage un secret que personne ne connaît 🤫",
  "Appelle quelqu'un au hasard et dis-lui que tu l'aimes 📱",
  "Fais le moonwalk 🌙",
  "Rap ton excuse pour ne pas faire la vaisselle 🎵",
  "Joue la scène la plus dramatique de ta vie 🎭",
  "Prends une photo ridicule et envoie-la au groupe 📸",
  "Invente un surnom pour chaque joueur 🏷️",
  "Fais une grimace et garde-la pendant 1 minute 😝",
  "Récite l'alphabet à l'envers ⏪",
  "Mime ta matinée de ce matin 🌅",
  "Parle de toi à la 3ème personne pendant 1 minute 👤",
  "Fais semblant d'être un robot pendant 30 secondes 🤖",
];

/**
 * Fonction pour obtenir un défi aléatoire
 */
export const getRandomChallenge = (): string => {
  return challenges[Math.floor(Math.random() * challenges.length)];
};
