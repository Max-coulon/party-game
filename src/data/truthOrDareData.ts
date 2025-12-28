import { TodItem, TodLevel, TruthOrDareType } from "@/types";

/**
 * Base de données des actions et vérités pour le jeu "Action ou Vérité"
 * Organisées par niveau d'intensité
 */

// ============================================
// VÉRITÉS
// ============================================

const TRUTHS_SOFT: Omit<TodItem, "id">[] = [
  { type: "truth", level: "soft", text: "Quel est ton crush secret actuel ?" },
  {
    type: "truth",
    level: "soft",
    text: "Quelle est la chose la plus embarrassante que tu aies faite devant tes parents ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "As-tu déjà menti à ton meilleur ami ? Sur quoi ?",
  },
  { type: "truth", level: "soft", text: "Quelle est ta plus grande peur ?" },
  {
    type: "truth",
    level: "soft",
    text: "Qui dans cette pièce trouve-tu le/la plus attirant(e) ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "Quel est ton secret le plus honteux ?",
  },
  { type: "truth", level: "soft", text: "As-tu déjà triché à un examen ?" },
  {
    type: "truth",
    level: "soft",
    text: "Quelle est la dernière personne que tu as embrassée ?",
  },
  { type: "truth", level: "soft", text: "Quel est ton plus gros regret ?" },
  { type: "truth", level: "soft", text: "As-tu déjà volé quelque chose ?" },
  {
    type: "truth",
    level: "soft",
    text: "Quelle est la chose la plus bizarre que tu aies mangée ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "Qui est la personne la plus ennuyeuse que tu connaisses ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "As-tu déjà fait semblant d'être malade pour ne pas aller quelque part ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "Quelle est ta chanson préférée que tu n'oserais jamais avouer ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "Quel est le pire cadeau que tu aies jamais reçu ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "Quelle est ta plus grosse honte sur les réseaux sociaux ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "As-tu déjà stalké quelqu'un sur Instagram ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "Quelle est la dernière fois que tu as pleuré et pourquoi ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "As-tu déjà eu des sentiments pour deux personnes en même temps ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "Quel est ton péché mignon alimentaire ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "As-tu déjà ghosté quelqu'un ? Pourquoi ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "Quelle est la pire rumeur que tu aies entendue sur toi ?",
  },
  { type: "truth", level: "soft", text: "As-tu déjà menti sur ton âge ?" },
  {
    type: "truth",
    level: "soft",
    text: "Quelle est la chose la plus stupide pour laquelle tu as dépensé de l'argent ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "As-tu déjà fait croire à tes parents que tu étais quelque part alors que tu étais ailleurs ?",
  },
  { type: "truth", level: "soft", text: "Quel est ton guilty pleasure télé ?" },
  {
    type: "truth",
    level: "soft",
    text: "As-tu déjà eu une crush sur quelqu'un de ta famille (cousin/cousine éloigné(e)) ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "Quelle est la chose la plus enfantine que tu fais encore ?",
  },
  {
    type: "truth",
    level: "soft",
    text: "As-tu déjà raté volontairement un rendez-vous ?",
  },
];

const TRUTHS_HOT: Omit<TodItem, "id">[] = [
  { type: "truth", level: "hot", text: "Quel est ton fantasme le plus fou ?" },
  { type: "truth", level: "hot", text: "As-tu déjà trompé quelqu'un ?" },
  {
    type: "truth",
    level: "hot",
    text: "Quelle est la pire chose que tu aies faite en étant ivre ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "Avec qui dans cette pièce aimerais-tu coucher ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "Quel est le mensonge le plus gros que tu aies raconté ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "As-tu déjà eu un coup d'un soir ? Raconte.",
  },
  {
    type: "truth",
    level: "hot",
    text: "Quelle est la chose la plus scandaleuse dans ton historique de recherche ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "As-tu déjà envoyé des photos osées à quelqu'un ?",
  },
  { type: "truth", level: "hot", text: "Quelle est ta position préférée ?" },
  {
    type: "truth",
    level: "hot",
    text: "As-tu déjà fait l'amour dans un lieu public ?",
  },
  { type: "truth", level: "hot", text: "Quel est ton plus gros turn-on ?" },
  {
    type: "truth",
    level: "hot",
    text: "As-tu déjà fantasmé sur quelqu'un dans cette pièce ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "Quelle est ta zone érogène préférée ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "As-tu déjà été dans une relation ouverte ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "Raconte ton expérience sexuelle la plus mémorable.",
  },
  {
    type: "truth",
    level: "hot",
    text: "As-tu déjà été attiré(e) par l'ex de ton ami(e) ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "Quel est ton body count honnêtement ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "As-tu déjà couché avec quelqu'un le premier soir ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "Quelle est la personne la plus célèbre avec qui tu voudrais passer une nuit ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "As-tu déjà menti sur ton nombre de partenaires ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "Quelle est la chose la plus bizarre qui t'a excité(e) ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "As-tu déjà été surpris(e) en pleine action ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "Quelle est ta plus grosse turn-off au lit ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "As-tu déjà eu un rapport dans la voiture ?",
  },
  { type: "truth", level: "hot", text: "Quel est ton sex-toy préféré ?" },
  {
    type: "truth",
    level: "hot",
    text: "As-tu déjà fait l'amour dans la nature ?",
  },
  {
    type: "truth",
    level: "hot",
    text: "Quelle est la partie du corps que tu préfères chez un(e) partenaire ?",
  },
  { type: "truth", level: "hot", text: "As-tu déjà eu un orgasme multiple ?" },
  {
    type: "truth",
    level: "hot",
    text: "Quel est ton porn préféré (catégorie) ?",
  },
  { type: "truth", level: "hot", text: "As-tu déjà essayé le sexting ?" },
];

const TRUTHS_HARDCORE: Omit<TodItem, "id">[] = [
  {
    type: "truth",
    level: "hardcore",
    text: "Quel est ton kink le plus extrême ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "As-tu déjà participé à un plan à trois ou plus ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "Quelle est la chose la plus illégale que tu aies faite ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "As-tu déjà couché avec deux personnes dans la même journée ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "Raconte ton expérience la plus hard niveau sexe.",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "As-tu déjà été payé(e) ou as-tu payé pour du sexe ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "Quelle est la personne la plus inappropriée avec qui tu as couché ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "As-tu déjà filmé ou été filmé(e) pendant l'acte ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "Quel est le secret le plus dark que personne ne connaît sur toi ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "As-tu déjà couché avec quelqu'un en couple dans cette pièce ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "As-tu déjà été dans un club libertin ou une partouze ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "Quelle est la chose la plus tabou que tu aies essayée au lit ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "As-tu déjà trompé ton partenaire avec plusieurs personnes ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "As-tu déjà été dans une relation toxique et manipulatrice ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "Quel est le truc le plus dégueulasse que tu aies fait sexuellement ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "As-tu déjà couché avec quelqu'un pour obtenir quelque chose en retour ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "As-tu déjà fait du BDSM hardcore ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "Quelle est ta plus grande déviance sexuelle ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "As-tu déjà eu des rapports sous influence de drogues ?",
  },
  {
    type: "truth",
    level: "hardcore",
    text: "As-tu déjà couché avec un membre de ta famille par alliance ?",
  },
];

const TRUTHS_FUN: Omit<TodItem, "id">[] = [
  {
    type: "truth",
    level: "fun",
    text: "Si tu pouvais être invisible pendant 24h, que ferais-tu ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Quelle est la chose la plus drôle que tu aies vue quelqu'un faire ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Si tu devais manger un seul aliment pour le reste de ta vie, ce serait quoi ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Quel est ton talent caché le plus bizarre ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Si tu pouvais échanger de vie avec quelqu'un ici, qui ce serait ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Quelle célébrité ressemble le plus à ton type idéal ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Quel est ton surnom le plus ridicule ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Si tu devais supprimer une app de ton téléphone, laquelle ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Quelle est la chose la plus bizarre que tu collectionnes ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Si tu pouvais avoir un super-pouvoir, lequel choisirais-tu ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Quelle est ta pire habitude en secret ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Si tu pouvais rencontrer n'importe quelle personne morte, qui ?",
  },
  { type: "truth", level: "fun", text: "Quel est ton animal spirit ?" },
  {
    type: "truth",
    level: "fun",
    text: "Si tu gagnais 1 million d'euros, quelle serait la première chose que tu achètes ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Quelle est la chose la plus embarrassante dans ton téléphone ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Si tu pouvais vivre dans n'importe quel univers fictif, lequel ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Quelle est ta danse signature en soirée ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Si tu devais changer de prénom, tu choisirais quoi ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Quelle est la chose la plus random que tu aies dans ta chambre ?",
  },
  {
    type: "truth",
    level: "fun",
    text: "Si tu pouvais être un objet pendant 24h, ce serait quoi ?",
  },
];

const TRUTHS_SEXUAL: Omit<TodItem, "id">[] = [
  {
    type: "truth",
    level: "sexual",
    text: "Quelle est ta zone érogène préférée que je ne connais pas encore ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Quel est ton fantasme secret que tu aimerais réaliser avec moi ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Quelle position aimerais-tu essayer ce soir ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Qu'est-ce qui t'excite le plus chez moi physiquement ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "As-tu déjà fantasmé sur moi dans un lieu public ? Où ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Quelle est la chose la plus coquine que tu aimerais que je te fasse ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Préfères-tu le sexe doux ou rough ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Quel est ton souvenir le plus hot avec moi ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Quelle partie de mon corps te rend le plus fou/folle ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "As-tu un kink que tu n'as jamais osé me dire ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Dans quelle pièce de la maison aimerais-tu faire l'amour maintenant ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Quel type de préliminaires préfères-tu ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Aimerais-tu essayer les sex-toys ensemble ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Quelle est ta lingerie/tenue préférée sur moi ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Qu'est-ce qui te fait le plus plaisir au lit ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Aimerais-tu qu'on regarde un film X ensemble ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Quelle est ta plus grande turn-on avec moi ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "As-tu déjà pensé à moi en te masturbant ? Quand ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Aimerais-tu essayer le sexe dans un lieu risqué ? Où ?",
  },
  {
    type: "truth",
    level: "sexual",
    text: "Quelle est ta plus grosse fantaisie à réaliser avec moi ce mois-ci ?",
  },
];

const TRUTHS_DEEP: Omit<TodItem, "id">[] = [
  {
    type: "truth",
    level: "deep",
    text: "Quel est ton plus grand regret dans la vie ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Quelle est la chose que tu changerais dans ta personnalité ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Qui a le plus influencé la personne que tu es aujourd'hui ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Quelle est ta plus grande peur pour l'avenir ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "De quoi es-tu le plus fier dans ta vie ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Si tu mourais demain, quel serait ton plus grand regret ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Quelle est la chose la plus difficile que tu aies surmontée ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "À quel moment de ta vie t'es-tu senti(e) le plus perdu(e) ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Quelle relation as-tu le plus regretté d'avoir gâchée ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Qu'est-ce qui te fait pleurer à coup sûr ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Quelle est ta plus grande insécurité ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "À quel moment t'es-tu senti(e) le plus seul(e) ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Quelle est la décision la plus difficile que tu aies prise ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Si tu pouvais parler à ton toi du passé, que lui dirais-tu ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Quelle est ta plus grande déception amoureuse ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Quel traumatisme d'enfance te hante encore ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Quelle est la chose que tu n'as jamais pardonnée à quelqu'un ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "À quel moment t'es-tu senti(e) le plus vivant(e) ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Quelle partie de toi aimerais-tu que les gens comprennent mieux ?",
  },
  {
    type: "truth",
    level: "deep",
    text: "Quelle est la chose dont tu as le plus honte dans ton passé ?",
  },
];

// ============================================
// ACTIONS
// ============================================

const DARES_SOFT: Omit<TodItem, "id">[] = [
  { type: "dare", level: "soft", text: "Fais 10 pompes." },
  {
    type: "dare",
    level: "soft",
    text: "Danse pendant 30 secondes sans musique.",
  },
  {
    type: "dare",
    level: "soft",
    text: "Parle avec un accent étranger pendant les 3 prochains tours.",
  },
  {
    type: "dare",
    level: "soft",
    text: 'Envoie un message à ton ex en disant "Je pense à toi".',
  },
  {
    type: "dare",
    level: "soft",
    text: "Laisse quelqu'un d'autre publier un post sur ton réseau social.",
  },
  {
    type: "dare",
    level: "soft",
    text: "Mange une cuillère de quelque chose choisi par le groupe.",
  },
  {
    type: "dare",
    level: "soft",
    text: "Fais le tour de la pièce en marchant comme un crabe.",
  },
  {
    type: "dare",
    level: "soft",
    text: 'Appelle quelqu\'un et chante-lui "Joyeux anniversaire".',
  },
  {
    type: "dare",
    level: "soft",
    text: "Imite la personne à ta gauche pendant 2 minutes.",
  },
  {
    type: "dare",
    level: "soft",
    text: "Laisse le groupe lire tes 5 derniers messages.",
  },
  {
    type: "dare",
    level: "soft",
    text: "Fais un compliment à chaque personne dans la pièce.",
  },
  {
    type: "dare",
    level: "soft",
    text: "Mets de la glace dans ton t-shirt pendant 1 minute.",
  },
  { type: "dare", level: "soft", text: "Raconte ta blague la plus nulle." },
  { type: "dare", level: "soft", text: "Fais 20 squats." },
  { type: "dare", level: "soft", text: "Parle en rap pendant 1 minute." },
  {
    type: "dare",
    level: "soft",
    text: "Envoie un vocal de 30 secondes à ton crush.",
  },
  {
    type: "dare",
    level: "soft",
    text: "Fais une déclaration d'amour théâtrale à un objet.",
  },
  {
    type: "dare",
    level: "soft",
    text: "Poste une story embarrassante (choisi par le groupe).",
  },
  {
    type: "dare",
    level: "soft",
    text: "Essaie de lécher ton coude pendant 30 secondes.",
  },
  {
    type: "dare",
    level: "soft",
    text: "Laisse quelqu'un te maquiller les yeux fermés.",
  },
  { type: "dare", level: "soft", text: "Fais 30 jumping jacks." },
  {
    type: "dare",
    level: "soft",
    text: "Envoie un message à 5 personnes random avec juste un emoji.",
  },
  {
    type: "dare",
    level: "soft",
    text: "Parle uniquement en questions pendant 5 minutes.",
  },
  {
    type: "dare",
    level: "soft",
    text: "Fais le poirier contre un mur pendant 20 secondes.",
  },
  {
    type: "dare",
    level: "soft",
    text: "Échange de vêtement avec la personne à ta droite.",
  },
  {
    type: "dare",
    level: "soft",
    text: "Appelle tes parents et dis-leur que tu les aimes.",
  },
  {
    type: "dare",
    level: "soft",
    text: "Fais un selfie avec tout le monde et poste-le.",
  },
  { type: "dare", level: "soft", text: "Bois ton verre d'un coup." },
  {
    type: "dare",
    level: "soft",
    text: "Raconte ton moment le plus gênant en détails.",
  },
  { type: "dare", level: "soft", text: "Fais une planche pendant 1 minute." },
];

const DARES_HOT: Omit<TodItem, "id">[] = [
  {
    type: "dare",
    level: "hot",
    text: "Embrasse la personne à ta droite sur la joue.",
  },
  { type: "dare", level: "hot", text: "Enlève un vêtement de ton choix." },
  {
    type: "dare",
    level: "hot",
    text: "Fais un lap dance de 30 secondes à quelqu'un du groupe.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Lèche le coude de la personne à ta gauche.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Montre ta photo la plus osée sur ton téléphone.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Fais un body shot sur quelqu'un du groupe.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Embrasse quelqu'un sur la bouche (choisi par le groupe).",
  },
  {
    type: "dare",
    level: "hot",
    text: "Simule un orgasme de manière convaincante.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Laisse quelqu'un te masser pendant 2 minutes.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Raconte ton fantasme le plus fou en détails.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Suce le doigt de la personne en face de toi de manière suggestive.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Fais un strip-tease sur une chanson complète.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Caresse sensuellement le bras de ton voisin pendant 1 minute.",
  },
  { type: "dare", level: "hot", text: "Enlève ton haut pendant 3 tours." },
  {
    type: "dare",
    level: "hot",
    text: "Embrasse le cou de quelqu'un pendant 10 secondes.",
  },
  { type: "dare", level: "hot", text: "Fais un bisou papillon à quelqu'un." },
  {
    type: "dare",
    level: "hot",
    text: "Assieds-toi sur les genoux de quelqu'un pendant 2 tours.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Lèche de la chantilly sur le ventre de quelqu'un.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Montre ton sexting game en envoyant un message chaud à quelqu'un.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Fais un cunnilingus ou une fellation sur une banane devant tout le monde.",
  },
  { type: "dare", level: "hot", text: "Laisse quelqu'un te donner un suçon." },
  {
    type: "dare",
    level: "hot",
    text: "Fais une danse sensuelle contre quelqu'un.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Embrasse l'oreille de quelqu'un de manière suggestive.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Enlève ton pantalon/jupe pendant 2 tours.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Laisse quelqu'un te caresser les cheveux de manière sensuelle.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Fais une position du Kama Sutra avec quelqu'un (habillés).",
  },
  { type: "dare", level: "hot", text: "Montre tes sous-vêtements au groupe." },
  {
    type: "dare",
    level: "hot",
    text: "Fais un French kiss de 10 secondes avec quelqu'un.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Whisper quelque chose de sexy à l'oreille de ton voisin.",
  },
  {
    type: "dare",
    level: "hot",
    text: "Fais semblant de faire l'amour avec un coussin.",
  },
];

const DARES_HARDCORE: Omit<TodItem, "id">[] = [
  {
    type: "dare",
    level: "hardcore",
    text: "French kiss la personne choisie par le groupe pendant 30 secondes.",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Reste en sous-vêtements jusqu'à la fin de la partie.",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Va dans une autre pièce seul(e) avec quelqu'un pendant 7 minutes.",
  },
  { type: "dare", level: "hardcore", text: "Fais un strip-tease complet." },
  {
    type: "dare",
    level: "hardcore",
    text: "Laisse quelqu'un te lécher le ventre du nombril jusqu'au cou.",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Embrasse les 3 personnes les plus sexy de la pièce.",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Fais un massage sensuel à quelqu'un pendant 5 minutes.",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Laisse le groupe te bander les yeux et t'embrasser (tu dois deviner qui).",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Sors dehors en sous-vêtements pendant 2 minutes.",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Laisse quelqu'un te donner une fessée devant tout le monde.",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Embrasse quelqu'un entre les cuisses (avec les vêtements).",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Fais un truc avec la langue à quelqu'un de ton choix.",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Simule une scène de porno avec quelqu'un pendant 1 minute.",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Laisse quelqu'un toucher n'importe quelle partie de ton corps pendant 30 secondes.",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Enlève tous tes vêtements sauf les sous-vêtements et reste comme ça 5 tours.",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Fais un câlin très serré et suggestif avec quelqu'un pendant 1 minute.",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Laisse deux personnes t'embrasser en même temps.",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Fais un body shot avec ta langue sur quelqu'un.",
  },
  {
    type: "dare",
    level: "hardcore",
    text: "Reste attaché(e) à quelqu'un pendant les 3 prochains tours.",
  },
];

const DARES_FUN: Omit<TodItem, "id">[] = [
  { type: "dare", level: "fun", text: "Fais ton meilleur cri de Tarzan." },
  { type: "dare", level: "fun", text: "Parle comme un bébé pendant 3 tours." },
  { type: "dare", level: "fun", text: "Fais le moonwalk de Michael Jackson." },
  {
    type: "dare",
    level: "fun",
    text: "Imite 5 animaux différents (le groupe devine).",
  },
  { type: "dare", level: "fun", text: "Chante une chanson Disney en entier." },
  {
    type: "dare",
    level: "fun",
    text: "Fais une bataille d'oreiller avec quelqu'un.",
  },
  {
    type: "dare",
    level: "fun",
    text: "Raconte une blague à papa vraiment nulle.",
  },
  {
    type: "dare",
    level: "fun",
    text: "Fais semblant d'être un robot pendant 2 minutes.",
  },
  { type: "dare", level: "fun", text: "Danse la Macarena en entier." },
  { type: "dare", level: "fun", text: "Fais 10 burpees." },
  {
    type: "dare",
    level: "fun",
    text: "Imite quelqu'un du groupe (les autres doivent deviner qui).",
  },
  {
    type: "dare",
    level: "fun",
    text: 'Parle sans utiliser la lettre "E" pendant 2 minutes.',
  },
  { type: "dare", level: "fun", text: "Fais le poirier pendant 10 secondes." },
  {
    type: "dare",
    level: "fun",
    text: "Raconte ton meilleur souvenir d'enfance en 30 secondes.",
  },
  {
    type: "dare",
    level: "fun",
    text: "Fais ton meilleur rugissement de lion.",
  },
  {
    type: "dare",
    level: "fun",
    text: "Fais un combat de regard avec quelqu'un pendant 1 minute.",
  },
  {
    type: "dare",
    level: "fun",
    text: "Parle comme un pirate pendant les 3 prochains tours.",
  },
  {
    type: "dare",
    level: "fun",
    text: "Fais la danse du robot pendant 1 minute.",
  },
  {
    type: "dare",
    level: "fun",
    text: "Imite une célébrité (le groupe doit deviner).",
  },
  {
    type: "dare",
    level: "fun",
    text: "Fais 5 tours sur toi-même puis essaie de marcher droit.",
  },
  {
    type: "dare",
    level: "fun",
    text: "Parle en langage Shakespeare pendant 2 minutes.",
  },
  {
    type: "dare",
    level: "fun",
    text: "Fais le yoga du rire pendant 30 secondes.",
  },
  {
    type: "dare",
    level: "fun",
    text: "Essaie de toucher ton nez avec ta langue.",
  },
  { type: "dare", level: "fun", text: "Fais ton meilleur TikTok dance." },
  {
    type: "dare",
    level: "fun",
    text: "Parle uniquement en posant des questions pendant 3 tours.",
  },
];

const DARES_SEXUAL: Omit<TodItem, "id">[] = [
  {
    type: "dare",
    level: "sexual",
    text: "Embrasse-moi passionnément pendant 1 minute sans t'arrêter.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Fais-moi un massage sensuel pendant 3 minutes.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Embrasse mon cou et mes oreilles de manière suggestive.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Enlève un de mes vêtements lentement et sensuellement.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Fais-moi un lap dance sur une chanson de ton choix.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Caresse-moi partout sauf mes parties intimes pendant 2 minutes.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Whisper ton fantasme le plus chaud à mon oreille.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Lèche de la chantilly sur une partie de mon corps.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Déshabille-toi lentement devant moi.",
  },
  { type: "dare", level: "sexual", text: "Fais-moi un strip-tease complet." },
  {
    type: "dare",
    level: "sexual",
    text: "Embrasse ma zone érogène préférée pendant 30 secondes.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Utilise seulement ta langue sur mon ventre pendant 1 minute.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Laisse-moi te caresser où je veux pendant 2 minutes.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Fais-moi un massage complet du corps en sous-vêtements.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Prends une douche sensuelle avec moi maintenant.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Embrasse-moi partout sauf sur la bouche pendant 2 minutes.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Fais-moi des bisous papillons sur tout le corps.",
  },
  { type: "dare", level: "sexual", text: "Donne-moi un suçon où je veux." },
  {
    type: "dare",
    level: "sexual",
    text: "Laisse-moi te bander les yeux et t'embrasser partout.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Va chercher quelque chose de coquin et montre-moi ce que tu veux faire avec.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Fais-moi un massage érotique de 5 minutes avec de l'huile.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Embrasse l'intérieur de mes cuisses lentement.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Allonge-toi et laisse-moi te faire ce que je veux pendant 3 minutes.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Montre-moi comment tu te touches quand tu penses à moi.",
  },
  {
    type: "dare",
    level: "sexual",
    text: "Choisis une position du Kama Sutra et prenons cette pose ensemble.",
  },
];

const DARES_DEEP: Omit<TodItem, "id">[] = [
  {
    type: "dare",
    level: "deep",
    text: "Partage quelque chose que tu n'as jamais dit à personne.",
  },
  {
    type: "dare",
    level: "deep",
    text: "Appelle quelqu'un d'important et dis-lui que tu l'aimes.",
  },
  {
    type: "dare",
    level: "deep",
    text: "Écris un poème sur ton plus grand regret et lis-le.",
  },
  {
    type: "dare",
    level: "deep",
    text: "Raconte une expérience qui t'a vraiment changé.",
  },
  { type: "dare", level: "deep", text: "Révèle ton secret le plus lourd." },
  {
    type: "dare",
    level: "deep",
    text: "Fais des excuses sincères à quelqu'un que tu as blessé.",
  },
  {
    type: "dare",
    level: "deep",
    text: "Partage ton plus grand échec et ce que tu en as appris.",
  },
  {
    type: "dare",
    level: "deep",
    text: "Dis à chaque personne ce que tu admires le plus chez elle.",
  },
  {
    type: "dare",
    level: "deep",
    text: "Raconte le moment où tu t'es senti le plus vulnérable.",
  },
  {
    type: "dare",
    level: "deep",
    text: "Révèle tes vraies intentions envers quelqu'un dans cette pièce.",
  },
  {
    type: "dare",
    level: "deep",
    text: "Partage ton plus grand traumatisme et comment tu l'as surmonté.",
  },
  {
    type: "dare",
    level: "deep",
    text: "Dis à chaque personne ce que tu ne leur as jamais osé dire.",
  },
  {
    type: "dare",
    level: "deep",
    text: "Révèle quelque chose dont tu as honte et demande pardon.",
  },
  {
    type: "dare",
    level: "deep",
    text: "Raconte comment tu te sens vraiment en ce moment, sans filtre.",
  },
  {
    type: "dare",
    level: "deep",
    text: "Exprime tes regrets envers quelqu'un dans cette pièce.",
  },
];

// ============================================
// ASSEMBLY & EXPORT
// ============================================

/**
 * Génère un ID unique pour chaque item
 */
let idCounter = 0;
const generateId = (): string => {
  idCounter++;
  return `tod-${Date.now()}-${idCounter}`;
};

/**
 * Assemble tous les items avec des IDs
 */
const assembleItems = (items: Omit<TodItem, "id">[]): TodItem[] => {
  return items.map((item) => ({
    ...item,
    id: generateId(),
  }));
};

// Assemblage de toutes les vérités
const ALL_TRUTHS: TodItem[] = [
  ...assembleItems(TRUTHS_SOFT),
  ...assembleItems(TRUTHS_HOT),
  ...assembleItems(TRUTHS_HARDCORE),
  ...assembleItems(TRUTHS_FUN),
  ...assembleItems(TRUTHS_DEEP),
  ...assembleItems(TRUTHS_SEXUAL),
];

// Assemblage de toutes les actions
const ALL_DARES: TodItem[] = [
  ...assembleItems(DARES_SOFT),
  ...assembleItems(DARES_HOT),
  ...assembleItems(DARES_HARDCORE),
  ...assembleItems(DARES_FUN),
  ...assembleItems(DARES_DEEP),
  ...assembleItems(DARES_SEXUAL),
];

// Toutes les cartes combinées
const ALL_ITEMS: TodItem[] = [...ALL_TRUTHS, ...ALL_DARES];

/**
 * Récupère les items filtrés par type et niveaux
 */
export const getItemsByTypeAndLevels = (
  type: TruthOrDareType,
  levels: TodLevel[]
): TodItem[] => {
  const sourceArray = type === "truth" ? ALL_TRUTHS : ALL_DARES;

  if (levels.length === 0) {
    return sourceArray;
  }

  return sourceArray.filter((item) => levels.includes(item.level));
};

/**
 * Récupère un item aléatoire selon le type et les niveaux
 */
export const getRandomItem = (
  type: TruthOrDareType,
  levels: TodLevel[],
  excludeIds: string[] = []
): TodItem | null => {
  const availableItems = getItemsByTypeAndLevels(type, levels).filter(
    (item) => !excludeIds.includes(item.id)
  );

  if (availableItems.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableItems.length);
  return availableItems[randomIndex];
};

/**
 * Mélange un tableau (Fisher-Yates)
 */
export const shuffleItems = (items: TodItem[]): TodItem[] => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Exports
export { ALL_TRUTHS, ALL_DARES, ALL_ITEMS };
