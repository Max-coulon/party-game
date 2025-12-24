import { TimesUpCard } from "@/types";

/**
 * Paquet de mots par défaut pour le jeu Time's Up
 * Mots variés : personnalités, objets, lieux, expressions, etc.
 */

const DEFAULT_WORDS: string[] = [
  // Personnalités / Célébrités
  "Barack Obama",
  "Beyoncé",
  "Albert Einstein",
  "Cléopâtre",
  "Harry Potter",
  "Marilyn Monroe",
  "Napoleon",
  "Michael Jackson",
  "Madonna",
  "James Bond",
  "Astérix",
  "Tintin",
  "Zinedine Zidane",
  "Mona Lisa",
  "Superman",
  "Batman",
  "Sherlock Holmes",
  "Dracula",
  "Mickey Mouse",
  "Pikachu",
  
  // Objets / Concepts
  "Parapluie",
  "Machine à laver",
  "Télévision",
  "Aspirateur",
  "Grille-pain",
  "Oreiller",
  "Chaussette",
  "Lunettes de soleil",
  "Brosse à dents",
  "Réveil matin",
  
  // Lieux
  "Tour Eiffel",
  "Statue de la Liberté",
  "Pyramides d'Égypte",
  "Colisée de Rome",
  "Muraille de Chine",
  "Mont Everest",
  "Grand Canyon",
  "Venise",
  "Las Vegas",
  "Disneyland",
  
  // Animaux
  "Éléphant",
  "Kangourou",
  "Pingouin",
  "Girafe",
  "Dauphin",
  "Tortue",
  "Papillon",
  "Crocodile",
  "Flamant rose",
  "Paresseux",
  
  // Films / Séries
  "Titanic",
  "Star Wars",
  "Le Roi Lion",
  "Game of Thrones",
  "Breaking Bad",
  "Friends",
  "La Joconde",
  "Jurassic Park",
  "Matrix",
  "Avatar",
  
  // Sports / Activités
  "Football",
  "Yoga",
  "Surf",
  "Escalade",
  "Parachutisme",
  "Bowling",
  "Patinage artistique",
  "Plongée sous-marine",
  "Marathon",
  "Équitation",
  
  // Nourriture
  "Pizza",
  "Sushi",
  "Croissant",
  "Hamburger",
  "Spaghetti",
  "Chocolat",
  "Champagne",
  "Crêpe",
  "Fondue",
  "Macaron",
  
  // Métiers
  "Pompier",
  "Astronaute",
  "Magicien",
  "Clown",
  "Détective",
  "Chef cuisinier",
  "Pilote d'avion",
  "Plombier",
  "Coiffeur",
  "Photographe",
  
  // Expressions / Actions
  "Ronfler",
  "Éternuer",
  "Danser la salsa",
  "Faire du stop",
  "Avoir le hoquet",
  "Marcher sur la Lune",
  "Gagner au loto",
  "Se marier",
  "Avoir peur du noir",
  "Tomber amoureux",
];

/**
 * Génère le paquet de cartes à partir des mots par défaut
 */
export const generateDefaultDeck = (): TimesUpCard[] => {
  return DEFAULT_WORDS.map((word, index) => ({
    id: `default-${index}`,
    word,
    isCustom: false,
  }));
};

/**
 * Génère un paquet de cartes à partir d'une liste de mots personnalisés
 */
export const generateCustomDeck = (words: string[]): TimesUpCard[] => {
  return words
    .filter((word) => word.trim().length > 0)
    .map((word, index) => ({
      id: `custom-${index}-${Date.now()}`,
      word: word.trim(),
      isCustom: true,
    }));
};

/**
 * Mélange un tableau (Fisher-Yates shuffle)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Couleurs disponibles pour les équipes
 */
export const TEAM_COLORS = [
  "#ef4444", // Rouge
  "#3b82f6", // Bleu
  "#22c55e", // Vert
  "#f59e0b", // Orange
  "#8b5cf6", // Violet
  "#ec4899", // Rose
  "#14b8a6", // Teal
  "#f97316", // Orange foncé
];

/**
 * Noms d'équipes par défaut
 */
export const DEFAULT_TEAM_NAMES = [
  "Équipe Rouge",
  "Équipe Bleue",
  "Équipe Verte",
  "Équipe Orange",
  "Équipe Violette",
  "Équipe Rose",
];
