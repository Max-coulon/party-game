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
  hot: 'ça déshabille',
  hardcore: 'plus de retour',
}

const SOFT_TRUTHS = [
  'Quel film as-tu vu le plus de fois ?',
  'Quelle est la chose la plus gênante de ton historique de recherche ?',
  'Quel talent parfaitement inutile as-tu ?',
  'Quelle est ta peur la plus irrationnelle ?',
  'Qui, dans cette pièce, appellerais-tu en cas de panne à minuit ?',
  'Quel surnom détestes-tu ?',
  'Quelle est la dernière chose qui t’a fait pleurer ?',
  'Combien de temps as-tu passé sur ton téléphone hier ?',
  'Quelle mode as-tu suivie et amèrement regrettée ?',
  'Quel est le pire cadeau que tu aies reçu ?',
  'Quelle chanson connais-tu par cœur sans jamais l’assumer ?',
  'Quel est ton plus vieux souvenir ?',
  'Quel plat te dégoûte et te régale en même temps ?',
  'Quelle est ta plus grosse manie ?',
  'Quel personnage de fiction te ressemble le plus ?',
  'Quel mensonge racontes-tu le plus souvent ?',
  'Qu’est-ce qui t’agace chez les autres et que tu fais toi-même ?',
  'Quel compliment t’a le plus marqué ?',
  'Si tu pouvais effacer un souvenir, lequel ?',
  'Quel est le pire achat impulsif de ta vie ?',
  'Quel est ton plus gros échec sportif ?',
  'Quelle habitude aimerais-tu perdre demain ?',
  'Qui, dans cette pièce, connais-tu le moins bien ?',
  'Lis à voix haute le dernier message que tu as envoyé.',
  'Quelle question redoutes-tu ce soir ?',
]

const SOFT_DARES = [
  'Imite quelqu’un de la table jusqu’à ce qu’on devine qui.',
  'Chante le refrain de la dernière chanson que tu as écoutée.',
  'Parle avec un accent pendant les trois prochains tours.',
  'Montre la dernière photo de ta galerie.',
  'Fais dix pompes.',
  'Envoie un emoji au hasard à la troisième conversation de ta liste.',
  'Danse quinze secondes sans musique.',
  'Fais rire quelqu’un de la table en moins d’une minute.',
  'Parle sans utiliser la lettre « e » pendant un tour.',
  'Décris la personne à ta gauche en trois mots, devant elle.',
  'Tiens-toi en équilibre sur un pied pendant une minute.',
  'Traverse la pièce en marchant comme un crabe.',
  'Prends la pose la plus dramatique possible pour une photo.',
  'Raconte une blague. Si personne ne rit, bois.',
  'Mange une cuillère de ce que la table aura choisi.',
  'Appelle quelqu’un pour lui souhaiter une bonne année.',
  'Fais un compliment sincère à chaque personne de la table.',
  'Échange un vêtement avec la personne à ta droite.',
  'Chuchote tout ce que tu dis jusqu’à ton prochain tour.',
  'Fais deviner un film en le mimant, sans un mot.',
  'Laisse la table choisir ta photo de profil pour dix minutes.',
  'Récite l’alphabet à l’envers.',
  'Monte sur ta chaise et improvise un discours de dix secondes.',
  'Fais boire une gorgée à la personne de ton choix.',
  'Tiens une conversation d’une minute sans dire « oui » ni « non ».',
]

const HOT_TRUTHS = [
  'Quel est ton fantasme le plus fou ?',
  'Avec qui, dans cette pièce, coucherais-tu si personne ne devait jamais le savoir ?',
  'Quel est ton plus gros turn-on ?',
  'Quelle est ta position préférée ?',
  'Quelle est ta zone érogène préférée ?',
  'As-tu déjà couché le premier soir ?',
  'As-tu déjà fait l’amour dans un lieu public ? Où ?',
  'As-tu déjà envoyé une photo osée ? À combien de personnes ?',
  'As-tu déjà fantasmé sur quelqu’un de cette table ?',
  'Raconte ton meilleur souvenir au lit.',
  'Quel est ton body count, honnêtement ?',
  'As-tu déjà simulé ?',
  'Quelle est la chose la plus bizarre qui t’ait excité ?',
  'As-tu déjà été surpris en pleine action ? Par qui ?',
  'Quelle est ta plus grosse turn-off au lit ?',
  'As-tu déjà eu un rapport dans une voiture ?',
  'As-tu déjà trompé quelqu’un ?',
  'Quelle est la chose la plus scandaleuse de ton historique de recherche ?',
  'As-tu déjà été attiré par l’ex d’un ami ?',
  'Quelle célébrité te ferait dire oui sans réfléchir une seconde ?',
  'As-tu déjà menti sur ton nombre de partenaires ? Dans quel sens ?',
  'Lis à voix haute le message le plus chaud que tu aies envoyé.',
  'As-tu déjà été dans une relation ouverte, ou seulement y penser ?',
  'Quelle est la pire chose que tu aies faite en étant ivre ?',
  'Quelle partie du corps te fait craquer à tous les coups ?',
  'As-tu déjà fait l’amour en pleine nature ?',
  'Quel est ton sex-toy préféré ?',
  'À quand remonte ta dernière fois ? Sois précis.',
  'Qui, dans cette pièce, embrasserais-tu là, maintenant ?',
  'Quelle est la chose la plus folle que tu aies faite pour finir la nuit avec quelqu’un ?',
]

const HOT_DARES = [
  'Embrasse le cou de la personne de ton choix pendant dix secondes.',
  'Enlève un vêtement de ton choix.',
  'Fais un lap dance de trente secondes à la personne de ton choix.',
  'Montre la photo la plus osée de ton téléphone.',
  'Simule un orgasme, de façon convaincante.',
  'Fais un body shot sur la personne de ton choix.',
  'Embrasse sur la bouche la personne que la table désigne, ou bois cinq gorgées.',
  'Raconte ton fantasme le plus fou, en détail.',
  'Laisse quelqu’un te masser pendant deux minutes.',
  'Suce le doigt de la personne en face de toi, sans rire.',
  'Fais un strip-tease sur une chanson entière.',
  'Enlève ton haut pendant trois tours.',
  'Assieds-toi sur les genoux de quelqu’un pendant deux tours.',
  'Montre tes sous-vêtements à la table.',
  'Chuchote quelque chose de très chaud à l’oreille de ton voisin.',
  'Envoie un message brûlant à la personne de ton choix dans ton répertoire.',
  'Danse collé-serré avec quelqu’un pendant une chanson entière.',
  'Mime ta position préférée, la table doit deviner.',
  'Lèche de la chantilly sur le bras de la personne de ton choix.',
  'Laisse quelqu’un te faire un suçon, à l’endroit de son choix.',
  'Fais un French kiss de dix secondes avec la personne de ton choix.',
  'Caresse le bras de ton voisin pendant une minute sans le lâcher des yeux.',
  'Prends une pose du Kama Sutra avec quelqu’un, habillés.',
  'Retire ton pantalon ou ta jupe pour deux tours.',
  'Embrasse l’oreille de la personne en face de toi.',
  'Fais deviner ce que tu préfères au lit, en le mimant.',
  'Fais semblant de faire l’amour à un coussin pendant quinze secondes.',
  'Choisis quelqu’un et décris à voix haute ce que tu lui ferais.',
  'Déshabille du regard chaque personne de la table, une par une, sans un mot.',
  'Laisse la table écrire un message à ton crush, et envoie-le.',
]

const HARDCORE_TRUTHS = [
  'Quel est ton kink le plus extrême ?',
  'As-tu déjà participé à un plan à trois ?',
  'Raconte ton expérience la plus hard.',
  'As-tu déjà couché avec deux personnes le même jour ?',
  'Quelle est la personne la plus inappropriée avec qui tu as couché ?',
  'As-tu déjà filmé, ou été filmé, pendant l’acte ?',
  'As-tu déjà couché avec quelqu’un qui était en couple ?',
  'As-tu déjà mis les pieds dans un club libertin ?',
  'Quelle est la chose la plus taboue que tu aies essayée au lit ?',
  'As-tu déjà trompé ton partenaire avec plusieurs personnes ?',
  'As-tu déjà touché au BDSM ? Jusqu’où ?',
  'Quelle est ta plus grosse déviance assumée ?',
  'As-tu déjà couché avec quelqu’un pour obtenir quelque chose ?',
  'Quel est le secret le plus sale que personne ici ne connaît ?',
  'As-tu déjà eu une aventure avec un collègue ? Qui a commencé ?',
  'As-tu déjà envoyé une photo que tu regrettes encore aujourd’hui ?',
  'Quel est ton pire souvenir sexuel ?',
  'As-tu déjà pensé à quelqu’un d’autre au mauvais moment ? À qui ?',
  'As-tu déjà mené deux histoires en même temps ?',
  'Y a-t-il quelqu’un ici avec qui il s’est passé quelque chose que personne ne sait ?',
  'Quelle limite as-tu franchie en te promettant de ne jamais le refaire ?',
  'As-tu déjà payé, ou été payé, pour du sexe ?',
  'Combien de personnes de ton entourage proche as-tu embrassées ?',
  'As-tu déjà couché avec l’ex, ou l’ami, de quelqu’un de cette table ?',
  'Quel est le lieu le plus risqué où tu es allé jusqu’au bout ?',
  'Décris ce à quoi tu penses quand tu es seul. Précisément.',
]

const HARDCORE_DARES = [
  'French kiss de trente secondes avec la personne que la table désigne.',
  'Reste en sous-vêtements jusqu’à la fin de la partie.',
  'Sept minutes dans une autre pièce avec la personne de ton choix.',
  'Fais un strip-tease complet.',
  'Laisse quelqu’un te lécher le ventre.',
  'Embrasse les trois personnes que tu trouves les plus attirantes ici.',
  'Fais un massage sensuel de cinq minutes à la personne de ton choix.',
  'Laisse la table te bander les yeux : quelqu’un t’embrasse, tu dois deviner qui.',
  'Laisse quelqu’un te donner une fessée devant tout le monde.',
  'Simule une scène de film pour adultes avec quelqu’un pendant une minute.',
  'Laisse la personne de ton choix te toucher où elle veut pendant trente secondes.',
  'Fais un body shot à la langue sur quelqu’un de la table.',
  'Reste collé à quelqu’un pendant les trois prochains tours.',
  'Laisse deux personnes t’embrasser en même temps.',
  'Embrasse l’intérieur de la cuisse de quelqu’un, habillé.',
  'Déverrouille ton téléphone et laisse la table lire tes trois dernières conversations.',
  'Montre la photo la plus intime que tu aies gardée.',
  'Fais un lap dance complet, sur une chanson entière.',
  'Enlève ton haut et garde-le enlevé pendant cinq tours.',
  'Décris précisément, à voix haute, ce que tu ferais à la personne en face.',
  'Envoie « viens » à la dernière personne avec qui tu as flirté.',
  'Laisse quelqu’un t’écrire au feutre le mot de son choix, à l’endroit de son choix.',
  'Mets-toi à genoux et fais une déclaration franchement explicite à quelqu’un.',
  'Laisse la table choisir qui tu embrasses, et pendant combien de temps.',
  'Refais avec quelqu’un, habillés, ta position préférée.',
  'Choisis : avouer le plus sale de tes secrets, ou finir la partie en sous-vêtements.',
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
