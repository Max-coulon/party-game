/**
 * Les mots de la grille. Écrits pour ce dépôt, pas repris d'un jeu du
 * commerce : que des noms communs concrets, courts (la grille fait cinq
 * colonnes sur un téléphone) et assez riches pour se laisser relier entre eux.
 */
export const RESEAU_WORDS: readonly string[] = [
  // Nature
  'arbre', 'forêt', 'rivière', 'montagne', 'désert', 'plage', 'océan', 'île',
  'volcan', 'glacier', 'tempête', 'orage', 'neige', 'pluie', 'vent', 'feu',
  'lune', 'soleil', 'étoile', 'comète', 'planète', 'nuage', 'racine', 'feuille',
  'fleur', 'rose', 'cactus', 'bambou', 'palmier', 'sable', 'caillou', 'cristal',
  'diamant', 'perle', 'corail', 'marée', 'vague', 'source', 'cascade', 'canyon',
  'prairie', 'jungle', 'savane', 'banquise', 'écorce',

  // Animaux
  'chat', 'chien', 'cheval', 'souris', 'lion', 'tigre', 'ours', 'loup',
  'renard', 'singe', 'éléphant', 'girafe', 'zèbre', 'requin', 'baleine', 'dauphin',
  'pieuvre', 'crabe', 'poisson', 'oiseau', 'aigle', 'corbeau', 'pigeon', 'paon',
  'canard', 'poule', 'coq', 'mouton', 'vache', 'cochon', 'lapin', 'tortue',
  'serpent', 'grenouille', 'araignée', 'abeille', 'fourmi', 'papillon', 'mouche', 'hibou',
  'pingouin', 'kangourou', 'chameau', 'dragon', 'licorne', 'mammouth', 'escargot', 'hérisson',
  'castor', 'sanglier',

  // Objets
  'table', 'chaise', 'lampe', 'miroir', 'horloge', 'montre', 'clé', 'porte',
  'fenêtre', 'échelle', 'marteau', 'clou', 'scie', 'corde', 'chaîne', 'aiguille',
  'bouton', 'ciseaux', 'couteau', 'fourchette', 'cuillère', 'assiette', 'verre', 'bouteille',
  'panier', 'boîte', 'valise', 'parapluie', 'chapeau', 'gant', 'botte', 'écharpe',
  'manteau', 'bague', 'couronne', 'masque', 'lunettes', 'brosse', 'savon', 'serviette',
  'bougie', 'allumette', 'pile', 'ampoule', 'ressort', 'aimant', 'loupe', 'boussole',
  'tambour', 'trompette', 'piano', 'guitare', 'violon', 'flûte', 'cloche', 'sifflet',
  'ancre', 'filet', 'hameçon', 'éventail',

  // Lieux
  'ville', 'village', 'château', 'tour', 'pont', 'tunnel', 'gare', 'port',
  'hôpital', 'école', 'église', 'temple', 'musée', 'théâtre', 'cinéma', 'banque',
  'prison', 'usine', 'ferme', 'moulin', 'phare', 'grotte', 'mine', 'marché',
  'stade', 'piscine', 'hôtel', 'cabane', 'igloo', 'pyramide', 'labyrinthe', 'frontière',
  'colonie', 'quartier', 'ruelle', 'place', 'jardin', 'serre', 'cave', 'grenier',

  // Transports
  'voiture', 'camion', 'train', 'métro', 'autobus', 'vélo', 'moto', 'avion',
  'fusée', 'bateau', 'voilier', 'canot', 'traîneau', 'ballon', 'parachute', 'roue',
  'moteur', 'essence', 'rail', 'voile', 'hélice', 'radeau', 'ascenseur', 'tracteur',
  'char',

  // Personnages
  'docteur', 'pilote', 'soldat', 'espion', 'pirate', 'voleur', 'juge', 'roi',
  'reine', 'prince', 'chevalier', 'sorcière', 'fantôme', 'géant', 'nain', 'ange',
  'robot', 'savant', 'artiste', 'danseur', 'clown', 'pêcheur', 'chasseur', 'berger',
  'cuisinier', 'facteur', 'gardien', 'capitaine', 'marin', 'cowboy', 'ninja', 'vampire',
  'momie', 'sirène', 'ogre', 'jumeau', 'voisin', 'témoin', 'otage', 'pompier',
  'complice', 'gourou', 'plombier', 'plongeur', 'arbitre',

  // Nourriture
  'pain', 'beurre', 'fromage', 'lait', 'miel', 'sucre', 'sel', 'poivre',
  'citron', 'orange', 'pomme', 'poire', 'banane', 'fraise', 'cerise', 'raisin',
  'melon', 'noix', 'amande', 'café', 'thé', 'chocolat', 'gâteau', 'glace',
  'bonbon', 'pizza', 'soupe', 'riz', 'viande', 'poulet', 'jambon', 'salade',
  'tomate', 'carotte', 'oignon', 'piment', 'champagne', 'bière', 'vin', 'farine',
  'crêpe', 'moutarde', 'olive', 'noisette', 'sirop',

  // Idées, jeux, intrigue
  'temps', 'rêve', 'secret', 'mensonge', 'silence', 'ombre', 'lumière', 'chance',
  'piège', 'code', 'signal', 'alarme', 'message', 'lettre', 'journal', 'livre',
  'page', 'encre', 'crayon', 'gomme', 'règle', 'cahier', 'timbre', 'trésor',
  'fortune', 'course', 'match', 'dé', 'échecs', 'domino', 'puzzle', 'énigme',
  'magie', 'potion', 'baguette', 'balai', 'chaudron', 'poison', 'remède', 'virus',
  'bombe', 'mission', 'alibi', 'empreinte', 'indice', 'rumeur', 'festival', 'carnaval',
  'parade', 'tournoi',

  // Corps
  'main', 'pied', 'tête', 'cœur', 'œil', 'dent', 'langue', 'doigt',
  'cheveu', 'os', 'sang', 'cerveau', 'muscle', 'larme', 'sourire', 'voix',
  'souffle', 'épaule', 'genou', 'pouce',
] as const

/** Comparaison tolérante aux accents et à la casse : « FORÊT » vaut « foret ». */
export function normalizeWord(word: string): string {
  return word
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}
