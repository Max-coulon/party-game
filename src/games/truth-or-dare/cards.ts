export type TodType = 'truth' | 'dare'
export type TodIntensity = 'soft' | 'hot' | 'hardcore'

export interface TodCard {
  id: string
  type: TodType
  intensity: TodIntensity
  text: string
}

export const TYPE_LABELS: Record<TodType, string> = {
  truth: 'Vérité',
  dare: 'Action',
}

export const INTENSITY_LABELS: Record<TodIntensity, string> = {
  soft: 'Soft',
  hot: 'Chaud',
  hardcore: 'Sans filtre',
}

export const INTENSITY_HINTS: Record<TodIntensity, string> = {
  soft: 'pour commencer',
  hot: 'ça pique',
  hardcore: 'plus de retour',
}

const SOFT_TRUTHS = [
  'Quel film as-tu vu le plus de fois ?',
  'Quelle est la chose la plus gênante de ton historique de recherche ?',
  'Quel talent parfaitement inutile as-tu ?',
  'Quelle est ta peur la plus irrationnelle ?',
  'Qui, dans cette pièce, appellerais-tu en cas de panne à minuit ?',
  'Quel surnom détestes-tu ?',
  "Quelle est la dernière chose qui t'a fait pleurer ?",
  'Combien de temps as-tu passé sur ton téléphone hier ?',
  'Quelle mode as-tu suivie et amèrement regrettée ?',
  'Quel est le pire cadeau que tu aies reçu ?',
  "Quelle chanson connais-tu par cœur sans jamais l'assumer ?",
  'Quel est ton plus vieux souvenir ?',
  'Quel plat te dégoûte et te régale en même temps ?',
  'Quelle est ta plus grosse manie ?',
  'Quel personnage de fiction te ressemble le plus ?',
  'Quel mensonge racontes-tu le plus souvent ?',
  "Qu'est-ce qui t'agace chez les autres et que tu fais toi-même ?",
  "Quel compliment t'a le plus marqué ?",
  'Si tu pouvais effacer un souvenir, lequel ?',
  'Quel est le pire achat impulsif de ta vie ?',
  'Quel est ton plus gros échec sportif ?',
  'Quelle habitude aimerais-tu perdre demain ?',
  'Qui, dans cette pièce, connais-tu le moins bien ?',
  'Lis à voix haute le dernier message que tu as envoyé.',
  'Quelle question redoutes-tu ce soir ?',
]

const SOFT_DARES = [
  "Imite quelqu'un de la table jusqu'à ce qu'on devine qui.",
  'Chante le refrain de la dernière chanson que tu as écoutée.',
  'Parle avec un accent pendant les trois prochains tours.',
  'Montre la dernière photo de ta galerie.',
  'Fais dix pompes.',
  'Envoie un emoji au hasard à la troisième conversation de ta liste.',
  'Danse quinze secondes sans musique.',
  "Fais rire quelqu'un de la table en moins d'une minute.",
  'Parle sans utiliser la lettre « e » pendant un tour.',
  'Décris la personne à ta gauche en trois mots, devant elle.',
  'Tiens-toi en équilibre sur un pied pendant une minute.',
  'Traverse la pièce en marchant comme un crabe.',
  'Prends la pose la plus dramatique possible pour une photo.',
  'Raconte une blague. Si personne ne rit, bois.',
  'Mange une cuillère de ce que la table aura choisi.',
  "Appelle quelqu'un pour lui souhaiter une bonne année.",
  'Fais un compliment sincère à chaque personne de la table.',
  'Échange un vêtement avec la personne à ta droite.',
  'Chuchote tout ce que tu dis jusqu’à ton prochain tour.',
  'Fais deviner un film en le mimant, sans un mot.',
  'Laisse la table choisir ta photo de profil pour dix minutes.',
  "Récite l'alphabet à l'envers.",
  'Monte sur ta chaise et improvise un discours de dix secondes.',
  'Fais boire une gorgée à la personne de ton choix.',
  "Tiens une conversation d'une minute sans dire « oui » ni « non ».",
]

const HOT_TRUTHS = [
  'Quel est le pire message que tu aies envoyé après quelques verres ?',
  'Qui, dans cette pièce, embrasserais-tu si tu devais absolument choisir ?',
  'Quelle est la chose la plus folle que tu aies faite par amour ?',
  'As-tu déjà menti à quelqu’un de cette table ? À propos de quoi ?',
  'Raconte ton pire rendez-vous.',
  'Quelle rumeur gênante a déjà circulé sur toi ?',
  "Qu'as-tu fait que tes parents ignorent encore ?",
  'Quel est ton plus grand regret amoureux ?',
  'Combien de personnes as-tu bloquées, et pourquoi la dernière ?',
  'Quelle est la chose la plus malhonnête que tu aies faite au travail ?',
  "Quel secret d'un ami as-tu déjà répété ?",
  'Qui as-tu regardé sur les réseaux cette semaine sans oser liker ?',
  'Quelle est ta pire habitude en couple ?',
  "As-tu déjà fait semblant d'aimer quelqu'un ? Combien de temps ?",
  'Quelle est la chose que tu ne pardonnerais jamais ?',
  "Qu'est-ce qui te rend vraiment jaloux ?",
  'À qui, ici, confierais-tu le plus un secret ? Et le moins ?',
  'Quel est le plus gros mensonge que tu aies dit à un ex ?',
  'Quelle est ta plus grosse honte de soirée ?',
  "Combien as-tu dépensé pour impressionner quelqu'un ?",
  "Quel message regrettes-tu le plus d'avoir envoyé ?",
  'As-tu déjà été attiré par quelqu’un que tu n’aurais pas dû ?',
  "Qu'est-ce qui te ferait quitter quelqu'un sur le champ ?",
  "Quelle est la chose la plus embarrassante que quelqu'un ait vue de toi ?",
  'Si tu pouvais dire une vérité anonymement à la table, laquelle ?',
]

const HOT_DARES = [
  'Laisse la table lire à voix haute ton dernier message envoyé.',
  'Appelle la troisième personne de ta liste et dis-lui que tu penses à elle.',
  'Fais un compliment très gênant à la personne en face.',
  'Montre la photo la plus embarrassante de ton téléphone.',
  "Chante une chanson d'amour à quelqu'un de la table, à genoux.",
  'Laisse la table choisir ton prochain gage.',
  'Imite la personne à ta gauche jusqu’à ce qu’elle craque.',
  'Raconte ton pire souvenir de soirée, en détail.',
  'Danse un slow avec quelqu’un de la table.',
  'Laisse quelqu’un fouiller ta galerie photo pendant trente secondes.',
  'Écris un message à ton ex sans l’envoyer, puis lis-le à voix haute.',
  'Bois une gorgée par personne de la table que tu trouves attirante, sans dire qui.',
  'Laisse ton voisin de droite te coiffer comme il veut.',
  'Lance un morceau et fais le playback en entier.',
  'Confie ton téléphone à quelqu’un pour un tour entier.',
  'Appelle un proche et dis-lui simplement que tu l’aimes.',
  'Fais un massage des épaules de trente secondes à ton voisin.',
  'Révèle le contact que tu as le plus appelé ce mois-ci.',
  'Fais le tour de la table et murmure un secret différent à chacun.',
  'Prends une photo ridicule et garde-la en fond d’écran jusqu’à la fin.',
  'Choisis quelqu’un : vous devez répondre honnêtement à une question de l’autre.',
  'Raconte la dernière fois où tu as menti et à qui.',
  'Laisse la table poser une question à laquelle tu ne peux pas refuser de répondre.',
  'Décris ton crush actuel sans donner son prénom.',
  'Donne une note sur dix à ta soirée, et justifie devant tout le monde.',
]

const HARDCORE_TRUTHS = [
  'Quelle est la chose la plus folle que tu aies faite au lit ?',
  'Quel est le lieu le plus improbable où tu es allé trop loin ?',
  'As-tu déjà été infidèle ? Raconte.',
  'Qui, dans cette pièce, te tenterait le plus ?',
  'Quel est ton fantasme le plus inavouable ?',
  'Combien de personnes as-tu embrassées cette année ?',
  'As-tu déjà couché avec quelqu’un par vengeance ?',
  'Quelle est la pire chose que tu aies faite à un ex ?',
  'As-tu déjà eu une aventure au travail ? Qui a commencé ?',
  'Quel est ton moment intime le plus gênant ?',
  'As-tu déjà simulé ? Combien de fois ?',
  'Raconte ton pire premier soir.',
  'As-tu déjà menti sur ton nombre de partenaires ? De combien ?',
  'As-tu déjà envoyé une photo que tu regrettes ?',
  'Quelle est la relation la plus courte que tu aies eue ?',
  'As-tu déjà été surpris en plein moment gênant ? Par qui ?',
  'Quel est le mensonge le plus grave dit à un partenaire ?',
  'As-tu déjà été attiré par un ami de ton partenaire ?',
  'Quelle est la limite que tu ne franchirais jamais ?',
  'As-tu déjà quitté quelqu’un pour quelqu’un d’autre ?',
  'Quel est ton plus grand regret d’une seule nuit ?',
  'Quelle est la chose la plus extrême que tu aies faite pour séduire ?',
  'As-tu déjà mené deux histoires en même temps ?',
  'Quelle question espérais-tu éviter ce soir ? Réponds-y.',
  'Y a-t-il quelqu’un ici avec qui il s’est passé quelque chose que personne ne sait ?',
]

const HARDCORE_DARES = [
  'Embrasse la joue de la personne de ton choix.',
  'Laisse la table lire tes trois dernières conversations.',
  'Confie ton téléphone déverrouillé à ton voisin pendant une minute.',
  'Enlève un vêtement de ton choix.',
  'Fais une déclaration enflammée à la personne en face, avec conviction.',
  'Assieds-toi sur les genoux de quelqu’un pendant un tour.',
  'Raconte ton fantasme le plus assumé.',
  'Laisse quelqu’un t’écrire un mot au feutre sur le bras.',
  'Fais un compliment très personnel à la personne de ton choix.',
  'Danse seul au milieu de la pièce pendant une chanson entière.',
  'Bois autant de gorgées que de personnes embrassées ce mois-ci.',
  'Réponds honnêtement à trois questions d’affilée, sans droit de refus.',
  'Échange de haut avec quelqu’un de la table.',
  'Mime ce que tu préfères au lit, la table doit deviner.',
  'Laisse ton voisin choisir la personne que tu embrasses sur la joue.',
  'Raconte ta pire performance, en détail.',
  'Fais deviner le prénom de ton dernier crush, lettre par lettre.',
  'Assieds-toi dos à dos avec quelqu’un et répondez ensemble à une question intime.',
  'Choisis : révéler un secret, ou boire cinq gorgées.',
  'Regarde quelqu’un dans les yeux pendant une minute, sans parler.',
  'Laisse la table fixer le gage final de la partie.',
  'Classe les personnes de la table par ordre de séduction, sans expliquer.',
  'Avoue à voix haute la pensée la moins avouable que tu as eue ce soir.',
  'Envoie « je pense à toi » à la personne de ton choix dans ton répertoire.',
  'Laisse la table décider de ta prochaine vérité, sans limite.',
]

function build(
  texts: readonly string[],
  type: TodType,
  intensity: TodIntensity,
): TodCard[] {
  return texts.map((text, index) => ({
    id: `${type}-${intensity}-${index}`,
    type,
    intensity,
    text,
  }))
}

export const TOD_CARDS: readonly TodCard[] = [
  ...build(SOFT_TRUTHS, 'truth', 'soft'),
  ...build(SOFT_DARES, 'dare', 'soft'),
  ...build(HOT_TRUTHS, 'truth', 'hot'),
  ...build(HOT_DARES, 'dare', 'hot'),
  ...build(HARDCORE_TRUTHS, 'truth', 'hardcore'),
  ...build(HARDCORE_DARES, 'dare', 'hardcore'),
]

export const ALL_INTENSITIES: TodIntensity[] = ['soft', 'hot', 'hardcore']

export function filterCards(
  intensities: readonly TodIntensity[],
  custom: readonly TodCard[] = [],
): TodCard[] {
  return [...TOD_CARDS, ...custom].filter(
    (card) => intensities.length === 0 || intensities.includes(card.intensity),
  )
}

/** Les deux types doivent être servis : un choix sans carte est un cul-de-sac. */
export function hasBothTypes(cards: readonly TodCard[]): boolean {
  return cards.some((card) => card.type === 'truth') && cards.some((card) => card.type === 'dare')
}
