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
    undercoverWord: "Tarte",
    category: "Nourriture",
  },
  {
    id: "food-2",
    civilWord: "Coca-Cola",
    undercoverWord: "Pepsi",
    category: "Boissons",
  },
  {
    id: "food-3",
    civilWord: "Croissant",
    undercoverWord: "Pain au chocolat",
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
    undercoverWord: "Cidre",
    category: "Boissons",
  },
  {
    id: "food-6",
    civilWord: "Hamburger",
    undercoverWord: "Sandwich",
    category: "Nourriture",
  },
  {
    id: "food-7",
    civilWord: "Sushi",
    undercoverWord: "Maki",
    category: "Nourriture",
  },
  {
    id: "food-8",
    civilWord: "Glace",
    undercoverWord: "Sorbet",
    category: "Desserts",
  },
  {
    id: "food-9",
    civilWord: "Champagne",
    undercoverWord: "Vin mousseux",
    category: "Boissons",
  },
  {
    id: "food-10",
    civilWord: "Chocolat",
    undercoverWord: "Nutella",
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
    undercoverWord: "Poire",
    category: "Fruits",
  },
  {
    id: "food-14",
    civilWord: "Tomate",
    undercoverWord: "Poivron",
    category: "Légumes",
  },
  {
    id: "food-15",
    civilWord: "Gâteau",
    undercoverWord: "Muffin",
    category: "Desserts",
  },

  // 🏠 Objets du quotidien
  {
    id: "obj-1",
    civilWord: "Téléphone",
    undercoverWord: "Tablette",
    category: "Technologie",
  },
  {
    id: "obj-2",
    civilWord: "Vélo",
    undercoverWord: "Trottinette",
    category: "Transport",
  },
  {
    id: "obj-3",
    civilWord: "Chaise",
    undercoverWord: "Tabouret",
    category: "Mobilier",
  },
  {
    id: "obj-4",
    civilWord: "Stylo",
    undercoverWord: "Crayon",
    category: "Écriture",
  },
  {
    id: "obj-5",
    civilWord: "Lunettes",
    undercoverWord: "Lentilles",
    category: "Accessoires",
  },
  {
    id: "obj-6",
    civilWord: "Montre",
    undercoverWord: "Bracelet",
    category: "Accessoires",
  },
  {
    id: "obj-7",
    civilWord: "Ordinateur",
    undercoverWord: "Laptop",
    category: "Technologie",
  },
  {
    id: "obj-8",
    civilWord: "Livre",
    undercoverWord: "Magazine",
    category: "Lecture",
  },
  {
    id: "obj-9",
    civilWord: "Voiture",
    undercoverWord: "Moto",
    category: "Transport",
  },
  {
    id: "obj-10",
    civilWord: "Lampe",
    undercoverWord: "Bougie",
    category: "Éclairage",
  },
  {
    id: "obj-11",
    civilWord: "Canapé",
    undercoverWord: "Fauteuil",
    category: "Mobilier",
  },
  {
    id: "obj-12",
    civilWord: "Miroir",
    undercoverWord: "Vitre",
    category: "Objets",
  },
  {
    id: "obj-13",
    civilWord: "Sac à dos",
    undercoverWord: "Valise",
    category: "Bagages",
  },
  {
    id: "obj-14",
    civilWord: "Parapluie",
    undercoverWord: "Parasol",
    category: "Accessoires",
  },
  {
    id: "obj-15",
    civilWord: "Télévision",
    undercoverWord: "Écran",
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
    undercoverWord: "Rugby",
    category: "Sport",
  },
  {
    id: "ent-3",
    civilWord: "Concert",
    undercoverWord: "Festival",
    category: "Musique",
  },
  {
    id: "ent-4",
    civilWord: "Netflix",
    undercoverWord: "YouTube",
    category: "Streaming",
  },
  {
    id: "ent-5",
    civilWord: "Instagram",
    undercoverWord: "TikTok",
    category: "Réseaux sociaux",
  },
  {
    id: "ent-6",
    civilWord: "Guitare",
    undercoverWord: "Ukulélé",
    category: "Musique",
  },
  {
    id: "ent-7",
    civilWord: "Piano",
    undercoverWord: "Clavier",
    category: "Musique",
  },
  {
    id: "ent-8",
    civilWord: "Karaoké",
    undercoverWord: "Blind test",
    category: "Jeux",
  },
  {
    id: "ent-9",
    civilWord: "Poker",
    undercoverWord: "Blackjack",
    category: "Jeux",
  },
  {
    id: "ent-10",
    civilWord: "Monopoly",
    undercoverWord: "Risk",
    category: "Jeux de société",
  },
  {
    id: "ent-11",
    civilWord: "PlayStation",
    undercoverWord: "Xbox",
    category: "Jeux vidéo",
  },
  {
    id: "ent-12",
    civilWord: "Mario",
    undercoverWord: "Sonic",
    category: "Jeux vidéo",
  },
  {
    id: "ent-13",
    civilWord: "Harry Potter",
    undercoverWord: "Seigneur des Anneaux",
    category: "Films",
  },
  {
    id: "ent-14",
    civilWord: "Batman",
    undercoverWord: "Spider-Man",
    category: "Super-héros",
  },
  {
    id: "ent-15",
    civilWord: "Star Wars",
    undercoverWord: "Star Trek",
    category: "Science-fiction",
  },

  // 🏢 Lieux & Voyages
  {
    id: "place-1",
    civilWord: "Plage",
    undercoverWord: "Piscine",
    category: "Vacances",
  },
  {
    id: "place-2",
    civilWord: "Montagne",
    undercoverWord: "Colline",
    category: "Nature",
  },
  {
    id: "place-3",
    civilWord: "Restaurant",
    undercoverWord: "Bar",
    category: "Sorties",
  },
  {
    id: "place-4",
    civilWord: "Hôtel",
    undercoverWord: "Airbnb",
    category: "Hébergement",
  },
  {
    id: "place-5",
    civilWord: "Paris",
    undercoverWord: "Lyon",
    category: "Villes",
  },
  {
    id: "place-6",
    civilWord: "Japon",
    undercoverWord: "Chine",
    category: "Pays",
  },
  {
    id: "place-7",
    civilWord: "Aéroport",
    undercoverWord: "Gare",
    category: "Transport",
  },
  {
    id: "place-8",
    civilWord: "Bibliothèque",
    undercoverWord: "Librairie",
    category: "Culture",
  },
  {
    id: "place-9",
    civilWord: "Zoo",
    undercoverWord: "Aquarium",
    category: "Attractions",
  },
  {
    id: "place-10",
    civilWord: "Camping",
    undercoverWord: "Glamping",
    category: "Vacances",
  },
  {
    id: "place-11",
    civilWord: "Musée",
    undercoverWord: "Galerie",
    category: "Culture",
  },
  {
    id: "place-12",
    civilWord: "Supermarché",
    undercoverWord: "Épicerie",
    category: "Commerces",
  },
  {
    id: "place-13",
    civilWord: "Gymnase",
    undercoverWord: "Stade",
    category: "Sport",
  },
  {
    id: "place-14",
    civilWord: "Église",
    undercoverWord: "Cathédrale",
    category: "Religion",
  },
  {
    id: "place-15",
    civilWord: "École",
    undercoverWord: "Université",
    category: "Éducation",
  },

  // 👔 Mode & Vêtements
  {
    id: "fashion-1",
    civilWord: "Jean",
    undercoverWord: "Pantalon",
    category: "Vêtements",
  },
  {
    id: "fashion-2",
    civilWord: "Baskets",
    undercoverWord: "Chaussures",
    category: "Chaussures",
  },
  {
    id: "fashion-3",
    civilWord: "Pull",
    undercoverWord: "Gilet",
    category: "Vêtements",
  },
  {
    id: "fashion-4",
    civilWord: "Chapeau",
    undercoverWord: "Casquette",
    category: "Accessoires",
  },
  {
    id: "fashion-5",
    civilWord: "Robe",
    undercoverWord: "Jupe",
    category: "Vêtements",
  },
  {
    id: "fashion-6",
    civilWord: "Costume",
    undercoverWord: "Smoking",
    category: "Vêtements",
  },
  {
    id: "fashion-7",
    civilWord: "Écharpe",
    undercoverWord: "Foulard",
    category: "Accessoires",
  },
  {
    id: "fashion-8",
    civilWord: "Maillot de bain",
    undercoverWord: "Bikini",
    category: "Vêtements",
  },
  {
    id: "fashion-9",
    civilWord: "Pyjama",
    undercoverWord: "Robe de chambre",
    category: "Vêtements",
  },
  {
    id: "fashion-10",
    civilWord: "Cravate",
    undercoverWord: "Nœud papillon",
    category: "Accessoires",
  },

  // 🐾 Animaux
  {
    id: "animal-1",
    civilWord: "Chien",
    undercoverWord: "Chat",
    category: "Animaux",
  },
  {
    id: "animal-2",
    civilWord: "Lion",
    undercoverWord: "Tigre",
    category: "Animaux",
  },
  {
    id: "animal-3",
    civilWord: "Dauphin",
    undercoverWord: "Baleine",
    category: "Animaux marins",
  },
  {
    id: "animal-4",
    civilWord: "Aigle",
    undercoverWord: "Faucon",
    category: "Oiseaux",
  },
  {
    id: "animal-5",
    civilWord: "Cheval",
    undercoverWord: "Âne",
    category: "Animaux",
  },
  {
    id: "animal-6",
    civilWord: "Serpent",
    undercoverWord: "Lézard",
    category: "Reptiles",
  },
  {
    id: "animal-7",
    civilWord: "Abeille",
    undercoverWord: "Guêpe",
    category: "Insectes",
  },
  {
    id: "animal-8",
    civilWord: "Singe",
    undercoverWord: "Gorille",
    category: "Animaux",
  },
  {
    id: "animal-9",
    civilWord: "Lapin",
    undercoverWord: "Hamster",
    category: "Animaux",
  },
  {
    id: "animal-10",
    civilWord: "Mouton",
    undercoverWord: "Chèvre",
    category: "Animaux",
  },

  // 💼 Métiers & Professions
  {
    id: "job-1",
    civilWord: "Médecin",
    undercoverWord: "Infirmier",
    category: "Métiers",
  },
  {
    id: "job-2",
    civilWord: "Avocat",
    undercoverWord: "Juge",
    category: "Métiers",
  },
  {
    id: "job-3",
    civilWord: "Professeur",
    undercoverWord: "Formateur",
    category: "Métiers",
  },
  {
    id: "job-4",
    civilWord: "Chef cuisinier",
    undercoverWord: "Pâtissier",
    category: "Métiers",
  },
  {
    id: "job-5",
    civilWord: "Acteur",
    undercoverWord: "Comédien",
    category: "Métiers",
  },
  {
    id: "job-6",
    civilWord: "Pilote",
    undercoverWord: "Steward",
    category: "Métiers",
  },
  {
    id: "job-7",
    civilWord: "Policier",
    undercoverWord: "Gendarme",
    category: "Métiers",
  },
  {
    id: "job-8",
    civilWord: "Journaliste",
    undercoverWord: "Présentateur",
    category: "Métiers",
  },
  {
    id: "job-9",
    civilWord: "Architecte",
    undercoverWord: "Ingénieur",
    category: "Métiers",
  },
  {
    id: "job-10",
    civilWord: "Photographe",
    undercoverWord: "Vidéaste",
    category: "Métiers",
  },

  // 🎉 Fêtes & Événements
  {
    id: "event-1",
    civilWord: "Anniversaire",
    undercoverWord: "Fête",
    category: "Événements",
  },
  {
    id: "event-2",
    civilWord: "Noël",
    undercoverWord: "Nouvel An",
    category: "Fêtes",
  },
  {
    id: "event-3",
    civilWord: "Mariage",
    undercoverWord: "Fiançailles",
    category: "Événements",
  },
  {
    id: "event-4",
    civilWord: "Halloween",
    undercoverWord: "Carnaval",
    category: "Fêtes",
  },
  {
    id: "event-5",
    civilWord: "Pâques",
    undercoverWord: "Chandeleur",
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
