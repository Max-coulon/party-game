import { UndercoverWordPair } from "@/types";

/**
 * Paires de mots par défaut pour le jeu Undercover
 * Le mot civil est toujours proche du mot undercover pour créer de la confusion
 */
export const DEFAULT_WORD_PAIRS: UndercoverWordPair[] = [
  // 🍽️ Nourriture & Boissons
  {
    id: "food-1",
    civilWord: "Pizza",
    undercoverWord: "Salade",
    category: "Nourriture",
  },
  {
    id: "food-2",
    civilWord: "Coca-Cola",
    undercoverWord: "Eau",
    category: "Boissons",
  },
  {
    id: "food-3",
    civilWord: "Croissant",
    undercoverWord: "Baguette",
    category: "Nourriture",
  },
  {
    id: "food-4",
    civilWord: "Café",
    undercoverWord: "Thé",
    category: "Boissons",
  },
  {
    id: "food-5",
    civilWord: "Bière",
    undercoverWord: "Jus",
    category: "Boissons",
  },
  {
    id: "food-6",
    civilWord: "Hamburger",
    undercoverWord: "Soupe",
    category: "Nourriture",
  },
  {
    id: "food-7",
    civilWord: "Sushi",
    undercoverWord: "Steak",
    category: "Nourriture",
  },
  {
    id: "food-8",
    civilWord: "Glace",
    undercoverWord: "Fromage",
    category: "Desserts",
  },
  {
    id: "food-9",
    civilWord: "Vin",
    undercoverWord: "Jus de raisin",
    category: "Boissons",
  },
  {
    id: "food-10",
    civilWord: "Chocolat",
    undercoverWord: "Sel",
    category: "Confiseries",
  },
  {
    id: "food-11",
    civilWord: "Fromage",
    undercoverWord: "Beurre",
    category: "Produits laitiers",
  },
  {
    id: "food-12",
    civilWord: "Pâtes",
    undercoverWord: "Riz",
    category: "Nourriture",
  },
  {
    id: "food-13",
    civilWord: "Pomme",
    undercoverWord: "Banane",
    category: "Fruits",
  },
  {
    id: "food-14",
    civilWord: "Tomate",
    undercoverWord: "Salade",
    category: "Légumes",
  },
  {
    id: "food-15",
    civilWord: "Gâteau",
    undercoverWord: "Crème brûlée",
    category: "Desserts",
  },

  // 🏠 Objets du quotidien
  {
    id: "obj-1",
    civilWord: "Téléphone",
    undercoverWord: "Courrier",
    category: "Technologie",
  },
  {
    id: "obj-2",
    civilWord: "Vélo",
    undercoverWord: "Bateau",
    category: "Transport",
  },
  {
    id: "obj-3",
    civilWord: "Chaise",
    undercoverWord: "Coussin",
    category: "Mobilier",
  },
  {
    id: "obj-4",
    civilWord: "Stylo",
    undercoverWord: "Doigt",
    category: "Écriture",
  },
  {
    id: "obj-5",
    civilWord: "Lunettes",
    undercoverWord: "Télescope",
    category: "Accessoires",
  },
  {
    id: "obj-6",
    civilWord: "Montre",
    undercoverWord: "Soleil",
    category: "Accessoires",
  },
  {
    id: "obj-7",
    civilWord: "Ordinateur",
    undercoverWord: "Boulier",
    category: "Technologie",
  },
  {
    id: "obj-8",
    civilWord: "Livre",
    undercoverWord: "Émission TV",
    category: "Lecture",
  },
  {
    id: "obj-9",
    civilWord: "Voiture",
    undercoverWord: "Cheval",
    category: "Transport",
  },
  {
    id: "obj-10",
    civilWord: "Lampe",
    undercoverWord: "Étoile",
    category: "Éclairage",
  },
  {
    id: "obj-11",
    civilWord: "Canapé",
    undercoverWord: "Mur",
    category: "Mobilier",
  },
  {
    id: "obj-12",
    civilWord: "Miroir",
    undercoverWord: "Eau",
    category: "Objets",
  },
  {
    id: "obj-13",
    civilWord: "Sac à dos",
    undercoverWord: "Bras",
    category: "Bagages",
  },
  {
    id: "obj-14",
    civilWord: "Parapluie",
    undercoverWord: "Arbre",
    category: "Accessoires",
  },
  {
    id: "obj-15",
    civilWord: "Télévision",
    undercoverWord: "Fenêtre",
    category: "Technologie",
  },

  // 🎬 Divertissement & Culture
  {
    id: "ent-1",
    civilWord: "Cinéma",
    undercoverWord: "Théâtre",
    category: "Divertissement",
  },
  {
    id: "ent-2",
    civilWord: "Football",
    undercoverWord: "Golf",
    category: "Sport",
  },
  {
    id: "ent-3",
    civilWord: "Concert",
    undercoverWord: "Conférence",
    category: "Musique",
  },
  {
    id: "ent-4",
    civilWord: "Netflix",
    undercoverWord: "Livre audio",
    category: "Streaming",
  },
  {
    id: "ent-5",
    civilWord: "Instagram",
    undercoverWord: "Carte postale",
    category: "Réseaux sociaux",
  },
  {
    id: "ent-6",
    civilWord: "Guitare",
    undercoverWord: "Sifflet",
    category: "Musique",
  },
  {
    id: "ent-7",
    civilWord: "Piano",
    undercoverWord: "Trompette",
    category: "Musique",
  },
  {
    id: "ent-8",
    civilWord: "Karaoké",
    undercoverWord: "Théâtre",
    category: "Jeux",
  },
  {
    id: "ent-9",
    civilWord: "Poker",
    undercoverWord: "Billes",
    category: "Jeux",
  },
  {
    id: "ent-10",
    civilWord: "Monopoly",
    undercoverWord: "Cache-cache",
    category: "Jeux de société",
  },
  {
    id: "ent-11",
    civilWord: "PlayStation",
    undercoverWord: "Game Boy",
    category: "Jeux vidéo",
  },
  {
    id: "ent-12",
    civilWord: "Mario",
    undercoverWord: "Pikachu",
    category: "Jeux vidéo",
  },
  {
    id: "ent-13",
    civilWord: "Harry Potter",
    undercoverWord: "Merlin",
    category: "Films",
  },
  {
    id: "ent-14",
    civilWord: "Batman",
    undercoverWord: "Zorro",
    category: "Super-héros",
  },
  {
    id: "ent-15",
    civilWord: "Star Wars",
    undercoverWord: "E.T.",
    category: "Science-fiction",
  },

  // 🏢 Lieux & Voyages
  {
    id: "place-1",
    civilWord: "Plage",
    undercoverWord: "Désert",
    category: "Vacances",
  },
  {
    id: "place-2",
    civilWord: "Montagne",
    undercoverWord: "Grotte",
    category: "Nature",
  },
  {
    id: "place-3",
    civilWord: "Restaurant",
    undercoverWord: "Pique-nique",
    category: "Sorties",
  },
  {
    id: "place-4",
    civilWord: "Hôtel",
    undercoverWord: "Tente",
    category: "Hébergement",
  },
  {
    id: "place-5",
    civilWord: "Paris",
    undercoverWord: "Tokyo",
    category: "Villes",
  },
  {
    id: "place-6",
    civilWord: "Japon",
    undercoverWord: "Mexique",
    category: "Pays",
  },
  {
    id: "place-7",
    civilWord: "Aéroport",
    undercoverWord: "Station spatiale",
    category: "Transport",
  },
  {
    id: "place-8",
    civilWord: "Bibliothèque",
    undercoverWord: "Musée",
    category: "Culture",
  },
  {
    id: "place-9",
    civilWord: "Zoo",
    undercoverWord: "Ferme",
    category: "Attractions",
  },
  {
    id: "place-10",
    civilWord: "Camping",
    undercoverWord: "Cabane",
    category: "Vacances",
  },
  {
    id: "place-11",
    civilWord: "Musée",
    undercoverWord: "Château",
    category: "Culture",
  },
  {
    id: "place-12",
    civilWord: "Supermarché",
    undercoverWord: "Potager",
    category: "Commerces",
  },
  {
    id: "place-13",
    civilWord: "Gymnase",
    undercoverWord: "Spa",
    category: "Sport",
  },
  {
    id: "place-14",
    civilWord: "Église",
    undercoverWord: "Pyramide",
    category: "Religion",
  },
  {
    id: "place-15",
    civilWord: "École",
    undercoverWord: "Prison",
    category: "Éducation",
  },

  // 👔 Mode & Vêtements
  {
    id: "fashion-1",
    civilWord: "Jean",
    undercoverWord: "Short",
    category: "Vêtements",
  },
  {
    id: "fashion-2",
    civilWord: "Baskets",
    undercoverWord: "Bottes",
    category: "Chaussures",
  },
  {
    id: "fashion-3",
    civilWord: "Pull",
    undercoverWord: "Manteau",
    category: "Vêtements",
  },
  {
    id: "fashion-4",
    civilWord: "Chapeau",
    undercoverWord: "Couronne",
    category: "Accessoires",
  },
  {
    id: "fashion-5",
    civilWord: "Robe",
    undercoverWord: "Pyjama",
    category: "Vêtements",
  },
  {
    id: "fashion-6",
    civilWord: "Costume",
    undercoverWord: "Déguisement",
    category: "Vêtements",
  },
  {
    id: "fashion-7",
    civilWord: "Écharpe",
    undercoverWord: "Corde",
    category: "Accessoires",
  },
  {
    id: "fashion-8",
    civilWord: "Maillot de bain",
    undercoverWord: "Serviette",
    category: "Vêtements",
  },
  {
    id: "fashion-9",
    civilWord: "Pyjama",
    undercoverWord: "Armure",
    category: "Vêtements",
  },
  {
    id: "fashion-10",
    civilWord: "Cravate",
    undercoverWord: "Bretelles",
    category: "Accessoires",
  },

  // 🐾 Animaux
  {
    id: "animal-1",
    civilWord: "Chien",
    undercoverWord: "Loup",
    category: "Animaux",
  },
  {
    id: "animal-2",
    civilWord: "Lion",
    undercoverWord: "Aigle",
    category: "Animaux",
  },
  {
    id: "animal-3",
    civilWord: "Dauphin",
    undercoverWord: "Pieuvre",
    category: "Animaux marins",
  },
  {
    id: "animal-4",
    civilWord: "Aigle",
    undercoverWord: "Chauve-souris",
    category: "Oiseaux",
  },
  {
    id: "animal-5",
    civilWord: "Cheval",
    undercoverWord: "Licorne",
    category: "Animaux",
  },
  {
    id: "animal-6",
    civilWord: "Serpent",
    undercoverWord: "Dragon",
    category: "Reptiles",
  },
  {
    id: "animal-7",
    civilWord: "Abeille",
    undercoverWord: "Fourmi",
    category: "Insectes",
  },
  {
    id: "animal-8",
    civilWord: "Singe",
    undercoverWord: "Koala",
    category: "Animaux",
  },
  {
    id: "animal-9",
    civilWord: "Lapin",
    undercoverWord: "Écureuil",
    category: "Animaux",
  },
  {
    id: "animal-10",
    civilWord: "Mouton",
    undercoverWord: "Alpaga",
    category: "Animaux",
  },

  // 💼 Métiers & Professions
  {
    id: "job-1",
    civilWord: "Médecin",
    undercoverWord: "Sorcier",
    category: "Métiers",
  },
  {
    id: "job-2",
    civilWord: "Avocat",
    undercoverWord: "Politicien",
    category: "Métiers",
  },
  {
    id: "job-3",
    civilWord: "Professeur",
    undercoverWord: "Coach",
    category: "Métiers",
  },
  {
    id: "job-4",
    civilWord: "Chef cuisinier",
    undercoverWord: "Critique gastronomique",
    category: "Métiers",
  },
  {
    id: "job-5",
    civilWord: "Acteur",
    undercoverWord: "Cascadeur",
    category: "Métiers",
  },
  {
    id: "job-6",
    civilWord: "Pilote",
    undercoverWord: "Astronaute",
    category: "Métiers",
  },
  {
    id: "job-7",
    civilWord: "Policier",
    undercoverWord: "Espion",
    category: "Métiers",
  },
  {
    id: "job-8",
    civilWord: "Journaliste",
    undercoverWord: "Blogueur",
    category: "Métiers",
  },
  {
    id: "job-9",
    civilWord: "Architecte",
    undercoverWord: "Sculpteur",
    category: "Métiers",
  },
  {
    id: "job-10",
    civilWord: "Photographe",
    undercoverWord: "Paparazzi",
    category: "Métiers",
  },

  // 🎉 Fêtes & Événements
  {
    id: "event-1",
    civilWord: "Anniversaire",
    undercoverWord: "Retraite",
    category: "Événements",
  },
  {
    id: "event-2",
    civilWord: "Noël",
    undercoverWord: "Halloween",
    category: "Fêtes",
  },
  {
    id: "event-3",
    civilWord: "Mariage",
    undercoverWord: "Enterrement de vie de garçon",
    category: "Événements",
  },
  {
    id: "event-4",
    civilWord: "Halloween",
    undercoverWord: "Fête foraine",
    category: "Fêtes",
  },
  {
    id: "event-5",
    civilWord: "Pâques",
    undercoverWord: "Chasse au trésor",
    category: "Fêtes",
  },

  // 🔧 Divers
  {
    id: "misc-1",
    civilWord: "Rêve",
    undercoverWord: "Cauchemar",
    category: "Sommeil",
  },
  {
    id: "misc-2",
    civilWord: "Soleil",
    undercoverWord: "Lune",
    category: "Espace",
  },
  {
    id: "misc-3",
    civilWord: "Été",
    undercoverWord: "Printemps",
    category: "Saisons",
  },
  {
    id: "misc-4",
    civilWord: "Matin",
    undercoverWord: "Soir",
    category: "Temps",
  },
  {
    id: "misc-5",
    civilWord: "Amour",
    undercoverWord: "Amitié",
    category: "Sentiments",
  },
  {
    id: "misc-6",
    civilWord: "Stress",
    undercoverWord: "Anxiété",
    category: "Émotions",
  },
  {
    id: "misc-7",
    civilWord: "Yoga",
    undercoverWord: "Pilates",
    category: "Bien-être",
  },
  {
    id: "misc-8",
    civilWord: "Tatouage",
    undercoverWord: "Piercing",
    category: "Body art",
  },
  {
    id: "misc-9",
    civilWord: "Parfum",
    undercoverWord: "Eau de toilette",
    category: "Cosmétiques",
  },
  {
    id: "misc-10",
    civilWord: "Dictionnaire",
    undercoverWord: "Encyclopédie",
    category: "Livres",
  },
];

/**
 * Catégories disponibles
 */
export const WORD_CATEGORIES = [
  "Nourriture",
  "Boissons",
  "Desserts",
  "Produits laitiers",
  "Fruits",
  "Légumes",
  "Confiseries",
  "Technologie",
  "Transport",
  "Mobilier",
  "Accessoires",
  "Écriture",
  "Lecture",
  "Éclairage",
  "Objets",
  "Bagages",
  "Divertissement",
  "Sport",
  "Musique",
  "Streaming",
  "Réseaux sociaux",
  "Jeux",
  "Jeux de société",
  "Jeux vidéo",
  "Films",
  "Super-héros",
  "Science-fiction",
  "Vacances",
  "Nature",
  "Sorties",
  "Hébergement",
  "Villes",
  "Pays",
  "Culture",
  "Attractions",
  "Commerces",
  "Éducation",
  "Religion",
  "Vêtements",
  "Chaussures",
  "Animaux",
  "Animaux marins",
  "Oiseaux",
  "Reptiles",
  "Insectes",
  "Métiers",
  "Événements",
  "Fêtes",
  "Sommeil",
  "Espace",
  "Saisons",
  "Temps",
  "Sentiments",
  "Émotions",
  "Bien-être",
  "Body art",
  "Cosmétiques",
  "Livres",
] as const;

/**
 * Sélectionne une paire de mots aléatoire
 */
export const getRandomWordPair = (
  excludeIds: string[] = [],
  category?: string
): UndercoverWordPair => {
  let availablePairs = DEFAULT_WORD_PAIRS.filter(
    (pair) => !excludeIds.includes(pair.id)
  );

  if (category) {
    availablePairs = availablePairs.filter(
      (pair) => pair.category === category
    );
  }

  if (availablePairs.length === 0) {
    // Si toutes les paires sont exclues, on recommence
    availablePairs = category
      ? DEFAULT_WORD_PAIRS.filter((pair) => pair.category === category)
      : DEFAULT_WORD_PAIRS;
  }

  const randomIndex = Math.floor(Math.random() * availablePairs.length);
  return availablePairs[randomIndex];
};

/**
 * Parse les mots personnalisés importés par l'utilisateur
 * Format: "motCivil | motUndercover" par ligne
 */
export const parseCustomWordPairs = (text: string): UndercoverWordPair[] => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const pairs: UndercoverWordPair[] = [];

  lines.forEach((line, index) => {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length >= 2 && parts[0] && parts[1]) {
      pairs.push({
        id: `custom-${index}-${Date.now()}`,
        civilWord: parts[0],
        undercoverWord: parts[1],
        category: "Personnalisé",
      });
    }
  });

  return pairs;
};

/**
 * Mélange un tableau (Fisher-Yates)
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
 * Calcule le nombre max d'undercovers selon le nombre de joueurs
 */
export const getMaxUndercoverCount = (playerCount: number): number => {
  // Règle: les civils doivent toujours être majoritaires
  // Formule: undercovers + mrWhite < civils
  // Donc max undercovers = floor((playerCount - 1) / 2) - mrWhiteSlot
  return Math.max(1, Math.floor((playerCount - 1) / 2));
};

/**
 * Vérifie si Mr White est autorisé avec cette configuration
 */
export const canHaveMrWhite = (
  playerCount: number,
  undercoverCount: number
): boolean => {
  // Mr White ne peut être activé que s'il reste assez de civils
  // civils = playerCount - undercoverCount - 1 (mr white)
  // civils doit être > undercovers + 1
  const civils = playerCount - undercoverCount - 1;
  return civils > undercoverCount + 1 && playerCount >= 4;
};

/**
 * Génère les noms de joueurs par défaut
 */
export const generateDefaultPlayerNames = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) => `Joueur ${i + 1}`);
};

/**
 * Couleurs pour les joueurs
 */
export const PLAYER_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f43f5e", // rose
  "#14b8a6", // teal
  "#84cc16", // lime
  "#a855f7", // purple
];

/**
 * Retourne une couleur pour un joueur
 */
export const getPlayerColor = (index: number): string => {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
};
