import {
  PartyGuessVariant,
  PartyGuessCard,
  PartyGuessCardWord,
  PartyGuessCardLyrics,
  PartyGuessCardSong,
} from "@/types";

// ============================================
// Dataset: INTERDIT (Taboo-like) - Mots classiques
// ============================================
const INTERDIT_WORDS: string[] = [
  "Astronaute",
  "Bibliothèque",
  "Caméléon",
  "Dinosaure",
  "Éléphant",
  "Festival",
  "Guitare",
  "Hélicoptère",
  "Igloo",
  "Jardinier",
  "Kangourou",
  "Lampadaire",
  "Montgolfière",
  "Nénuphar",
  "Ordinateur",
  "Parachute",
  "Restaurant",
  "Saxophone",
  "Téléphone",
  "Uniforme",
  "Vampire",
  "Xylophone",
  "Yourte",
  "Zèbre",
  "Aquarium",
  "Boulangerie",
  "Chocolat",
  "Dentiste",
  "Escalier",
  "Football",
  "Galaxie",
  "Harmonica",
  "Internet",
  "Journaliste",
  "Koala",
  "Locomotive",
  "Microscope",
  "Naufrage",
  "Orchestre",
  "Pyramide",
];

// ============================================
// Dataset: MIME - Mots faciles à mimer
// ============================================
const MIME_WORDS: string[] = [
  "Dormir",
  "Manger",
  "Danser",
  "Pleurer",
  "Rire",
  "Nager",
  "Voler",
  "Conduire",
  "Cuisiner",
  "Boxeur",
  "Bébé",
  "Robot",
  "Singe",
  "Serpent",
  "Oiseau",
  "Chien",
  "Chat",
  "Éléphant",
  "Araignée",
  "Papillon",
  "Photographe",
  "Surfeur",
  "Skieur",
  "Guitariste",
  "Magicien",
  "Jongleur",
  "Clown",
  "Cowboy",
  "Ninja",
  "Zombie",
  "Fantôme",
  "Superhéros",
  "Princesse",
  "Pirate",
  "Astronaute",
  "Plongeur",
  "Pompier",
  "Policier",
  "Docteur",
  "Coiffeur",
];

// ============================================
// Dataset: UN SEUL MOT - Mots avec indices simples
// ============================================
const ONE_WORD_WORDS: string[] = [
  "Soleil",
  "Lune",
  "Étoile",
  "Océan",
  "Montagne",
  "Forêt",
  "Désert",
  "Île",
  "Volcan",
  "Cascade",
  "Arc-en-ciel",
  "Orage",
  "Neige",
  "Plage",
  "Jungle",
  "Château",
  "Pyramide",
  "Temple",
  "Pont",
  "Tour",
  "Avion",
  "Bateau",
  "Train",
  "Vélo",
  "Moto",
  "Pizza",
  "Hamburger",
  "Sushi",
  "Croissant",
  "Chocolat",
  "Glace",
  "Café",
  "Thé",
  "Bière",
  "Vin",
  "Mariage",
  "Anniversaire",
  "Noël",
  "Halloween",
  "Vacances",
];

// ============================================
// Dataset: FINIS LES PAROLES - Débuts de chansons (placeholders neutres)
// Note: Ces textes sont des exemples fictifs pour éviter les problèmes de droits d'auteur.
// L'utilisateur peut importer ses propres paroles.
// ============================================
const LYRICS_DATA: Array<{ promptStart: string; expectedContinuation?: string }> = [
  { promptStart: "Joyeux anniversaire...", expectedContinuation: "...joyeux anniversaire" },
  { promptStart: "Frère Jacques, frère Jacques...", expectedContinuation: "...dormez-vous ?" },
  { promptStart: "Une souris verte...", expectedContinuation: "...qui courait dans l'herbe" },
  { promptStart: "Au clair de la lune...", expectedContinuation: "...mon ami Pierrot" },
  { promptStart: "Alouette, gentille alouette...", expectedContinuation: "...alouette, je te plumerai" },
  { promptStart: "Il était un petit navire...", expectedContinuation: "...qui n'avait ja-ja-jamais navigué" },
  { promptStart: "Promenons-nous dans les bois...", expectedContinuation: "...pendant que le loup n'y est pas" },
  { promptStart: "À la claire fontaine...", expectedContinuation: "...m'en allant promener" },
  { promptStart: "Sur le pont d'Avignon...", expectedContinuation: "...on y danse, on y danse" },
  { promptStart: "Ainsi font, font, font...", expectedContinuation: "...les petites marionnettes" },
  { promptStart: "Meunier tu dors...", expectedContinuation: "...ton moulin va trop vite" },
  { promptStart: "Savez-vous planter les choux...", expectedContinuation: "...à la mode de chez nous" },
  { promptStart: "Vive le vent, vive le vent...", expectedContinuation: "...vive le vent d'hiver" },
  { promptStart: "Petit Papa Noël...", expectedContinuation: "...quand tu descendras du ciel" },
  { promptStart: "Mon beau sapin...", expectedContinuation: "...roi des forêts" },
  { promptStart: "La Marseillaise commence par...", expectedContinuation: "Allons enfants de la Patrie" },
  { promptStart: "Do ré mi fa sol...", expectedContinuation: "...la si do" },
  { promptStart: "Ah les crocodiles...", expectedContinuation: "...les crocodiles sur les bords du Nil" },
  { promptStart: "Un éléphant qui se balançait...", expectedContinuation: "...sur une toile d'araignée" },
  { promptStart: "Pirouette cacahuète...", expectedContinuation: "...il était un petit homme" },
];

// ============================================
// Dataset: CHANTE-LE - Titres + Artistes (exemples neutres/fictifs)
// ============================================
const SONGS_DATA: Array<{ title: string; artist: string }> = [
  { title: "La Vie en Rose", artist: "Édith Piaf" },
  { title: "Ne me quitte pas", artist: "Jacques Brel" },
  { title: "Comme d'habitude", artist: "Claude François" },
  { title: "La Bohème", artist: "Charles Aznavour" },
  { title: "Je t'aime moi non plus", artist: "Serge Gainsbourg" },
  { title: "Non, je ne regrette rien", artist: "Édith Piaf" },
  { title: "Les Champs-Élysées", artist: "Joe Dassin" },
  { title: "La Mer", artist: "Charles Trenet" },
  { title: "Papaoutai", artist: "Stromae" },
  { title: "Formidable", artist: "Stromae" },
  { title: "Je veux", artist: "Zaz" },
  { title: "Dernière danse", artist: "Indila" },
  { title: "Tous les mêmes", artist: "Stromae" },
  { title: "Alors on danse", artist: "Stromae" },
  { title: "Chandelier", artist: "Sia" },
  { title: "Shape of You", artist: "Ed Sheeran" },
  { title: "Despacito", artist: "Luis Fonsi" },
  { title: "Bohemian Rhapsody", artist: "Queen" },
  { title: "Thriller", artist: "Michael Jackson" },
  { title: "Billie Jean", artist: "Michael Jackson" },
  { title: "Imagine", artist: "John Lennon" },
  { title: "Let It Be", artist: "The Beatles" },
  { title: "Hey Jude", artist: "The Beatles" },
  { title: "I Will Always Love You", artist: "Whitney Houston" },
  { title: "My Heart Will Go On", artist: "Céline Dion" },
];

// ============================================
// Dataset: CÉLÉBRITÉS
// ============================================
const CELEBRITIES: string[] = [
  // Acteurs/Actrices
  "Brad Pitt",
  "Angelina Jolie",
  "Leonardo DiCaprio",
  "Meryl Streep",
  "Tom Hanks",
  "Julia Roberts",
  "Denzel Washington",
  "Scarlett Johansson",
  "Marion Cotillard",
  "Jean Dujardin",
  "Omar Sy",
  "Gérard Depardieu",
  "Sophie Marceau",
  "Jean-Paul Belmondo",
  "Alain Delon",
  
  // Chanteurs/Chanteuses
  "Michael Jackson",
  "Madonna",
  "Beyoncé",
  "Taylor Swift",
  "Lady Gaga",
  "Rihanna",
  "Stromae",
  "Céline Dion",
  "Édith Piaf",
  "Johnny Hallyday",
  
  // Sportifs
  "Lionel Messi",
  "Cristiano Ronaldo",
  "Zinedine Zidane",
  "Kylian Mbappé",
  "Serena Williams",
  "Rafael Nadal",
  "Roger Federer",
  "LeBron James",
  "Usain Bolt",
  "Michael Jordan",
  
  // Personnalités historiques
  "Napoléon Bonaparte",
  "Marie Curie",
  "Albert Einstein",
  "Charles de Gaulle",
  "Martin Luther King",
  "Nelson Mandela",
  "Cléopâtre",
  "Léonard de Vinci",
  "Mozart",
  "Shakespeare",
];

// ============================================
// Dataset: SPORT
// ============================================
const SPORTS_TERMS: string[] = [
  // Sports
  "Football",
  "Basketball",
  "Tennis",
  "Rugby",
  "Natation",
  "Athlétisme",
  "Cyclisme",
  "Boxe",
  "Judo",
  "Ski",
  "Surf",
  "Golf",
  "Hockey",
  "Volleyball",
  "Handball",
  
  // Termes techniques
  "But",
  "Penalty",
  "Corner",
  "Hors-jeu",
  "Carton rouge",
  "Mi-temps",
  "Prolongations",
  "Tir au but",
  "Coup franc",
  "Touche",
  
  // Compétitions
  "Coupe du Monde",
  "Jeux Olympiques",
  "Champions League",
  "Roland-Garros",
  "Tour de France",
  "Super Bowl",
  "Wimbledon",
  "NBA Finals",
  "Ligue 1",
  "Premier League",
  
  // Équipes/Clubs célèbres
  "Real Madrid",
  "FC Barcelona",
  "Manchester United",
  "Paris Saint-Germain",
  "Liverpool",
  "Bayern Munich",
  "Juventus",
  "Chelsea",
  "AC Milan",
  "Olympique de Marseille",
];

// ============================================
// Fonctions de génération de decks
// ============================================

/**
 * Génère un deck de cartes "mot" à partir d'une liste
 */
export const generateWordDeck = (
  words: string[],
  prefix: string
): PartyGuessCardWord[] => {
  return words.map((word, index) => ({
    id: `${prefix}-${index}`,
    type: "word" as const,
    word,
    isCustom: false,
  }));
};

/**
 * Génère un deck de cartes "lyrics"
 */
export const generateLyricsDeck = (
  data: Array<{ promptStart: string; expectedContinuation?: string }>,
  prefix: string
): PartyGuessCardLyrics[] => {
  return data.map((item, index) => ({
    id: `${prefix}-${index}`,
    type: "lyrics" as const,
    promptStart: item.promptStart,
    expectedContinuation: item.expectedContinuation,
    isCustom: false,
  }));
};

/**
 * Génère un deck de cartes "song"
 */
export const generateSongDeck = (
  data: Array<{ title: string; artist: string }>,
  prefix: string
): PartyGuessCardSong[] => {
  return data.map((item, index) => ({
    id: `${prefix}-${index}`,
    type: "song" as const,
    title: item.title,
    artist: item.artist,
    isCustom: false,
  }));
};

/**
 * Récupère le deck par défaut pour une variante
 */
export const getDefaultDeck = (variant: PartyGuessVariant): PartyGuessCard[] => {
  switch (variant) {
    case "interdit":
      return generateWordDeck(INTERDIT_WORDS, "interdit");
    case "mime":
      return generateWordDeck(MIME_WORDS, "mime");
    case "oneWord":
      return generateWordDeck(ONE_WORD_WORDS, "oneword");
    case "lyrics":
      return generateLyricsDeck(LYRICS_DATA, "lyrics");
    case "singIt":
      return generateSongDeck(SONGS_DATA, "song");
    case "celebrities":
      return generateWordDeck(CELEBRITIES, "celeb");
    case "sports":
      return generateWordDeck(SPORTS_TERMS, "sport");
    default:
      return [];
  }
};

/**
 * Parse l'import textarea selon le format de la variante
 */
export const parseCustomImport = (
  text: string,
  variant: PartyGuessVariant
): PartyGuessCard[] => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const timestamp = Date.now();

  switch (variant) {
    case "lyrics":
      // Format: "debut || suite" (suite optionnelle)
      return lines.map((line, index) => {
        const parts = line.split("||").map((p) => p.trim());
        return {
          id: `custom-lyrics-${timestamp}-${index}`,
          type: "lyrics" as const,
          promptStart: parts[0],
          expectedContinuation: parts[1] || undefined,
          isCustom: true,
        };
      });

    case "singIt":
      // Format: "titre - artiste"
      return lines.map((line, index) => {
        const parts = line.split(" - ").map((p) => p.trim());
        return {
          id: `custom-song-${timestamp}-${index}`,
          type: "song" as const,
          title: parts[0] || line,
          artist: parts[1] || "Artiste inconnu",
          isCustom: true,
        };
      });

    default:
      // Mots simples
      return lines.map((word, index) => ({
        id: `custom-word-${timestamp}-${index}`,
        type: "word" as const,
        word,
        isCustom: true,
      }));
  }
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
 * Couleurs pour les équipes
 */
export const PARTY_GUESS_TEAM_COLORS = [
  "#ef4444", // Rouge
  "#3b82f6", // Bleu
  "#22c55e", // Vert
  "#f59e0b", // Orange
  "#8b5cf6", // Violet
  "#ec4899", // Rose
];

/**
 * Noms d'équipes par défaut
 */
export const PARTY_GUESS_DEFAULT_TEAM_NAMES = [
  "Équipe Rouge",
  "Équipe Bleue",
  "Équipe Verte",
  "Équipe Orange",
  "Équipe Violette",
  "Équipe Rose",
];
