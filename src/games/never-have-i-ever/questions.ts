import type { Intensity } from './engine'

export type NheTheme = 'soiree' | 'amour' | 'voyage' | 'boulot' | 'enfance' | 'general'

export interface NheQuestion {
  id: string
  /** Suite de la phrase : la carte affiche « Je n'ai jamais » au-dessus. */
  text: string
  intensity: Intensity
  theme: NheTheme
}

export const INTENSITY_LABELS: Record<Intensity, string> = {
  soft: 'Soft',
  hot: 'Chaud',
  hardcore: 'Sans filtre',
}

export const INTENSITY_HINTS: Record<Intensity, string> = {
  soft: '1 gorgée',
  hot: '2 gorgées',
  hardcore: '3 gorgées',
}

export const THEME_LABELS: Record<NheTheme, string> = {
  soiree: 'Soirées',
  amour: 'Amour',
  voyage: 'Voyages',
  boulot: 'Boulot',
  enfance: 'Enfance',
  general: 'Au quotidien',
}

type Entry = readonly [string, NheTheme]

const SOFT: readonly Entry[] = [
  ['fini une soirée en dansant sur une table', 'soiree'],
  ['été le dernier à quitter une soirée', 'soiree'],
  ['chanté au karaoké devant des inconnus', 'soiree'],
  ['renversé un verre entier sur quelqu’un', 'soiree'],
  ['dormi chez quelqu’un que je connaissais à peine', 'soiree'],
  ['perdu mon téléphone pendant une soirée', 'soiree'],
  ['mangé un kebab à quatre heures du matin', 'soiree'],
  ['organisé une soirée que j’ai regrettée dès le lendemain', 'soiree'],
  ['fait semblant d’aimer un cocktail immonde', 'soiree'],
  ['dansé alors qu’il n’y avait aucune musique', 'soiree'],
  ['eu le coup de foudre en une seconde', 'amour'],
  ['écrit un poème à quelqu’un', 'amour'],
  ['relu une conversation dix fois avant de répondre', 'amour'],
  ['été amoureux d’un professeur', 'amour'],
  ['offert un cadeau que j’avais fabriqué moi-même', 'amour'],
  ['dit « je t’aime » en premier', 'amour'],
  ['raté un avion ou un train', 'voyage'],
  ['voyagé complètement seul', 'voyage'],
  ['dormi dans un aéroport', 'voyage'],
  ['mangé un plat sans savoir ce qu’il y avait dedans', 'voyage'],
  ['oublié mon passeport chez moi', 'voyage'],
  ['fait du stop', 'voyage'],
  ['menti sur mon CV', 'boulot'],
  ['fait semblant de travailler pendant une réunion', 'boulot'],
  ['envoyé un message au mauvais destinataire', 'boulot'],
  ['dormi au bureau', 'boulot'],
  ['appelé mon responsable par un autre prénom', 'boulot'],
  ['cassé quelque chose et accusé quelqu’un d’autre', 'enfance'],
  ['fait semblant d’être malade pour rater l’école', 'enfance'],
  ['eu un ami imaginaire', 'enfance'],
  ['mangé la pâte à gâteau crue', 'enfance'],
  ['cru au Père Noël bien trop longtemps', 'enfance'],
  ['gagné une compétition sportive', 'enfance'],
  ['couru après un bus et l’avoir raté quand même', 'general'],
  ['parlé tout seul à voix haute', 'general'],
  ['mangé à moi seul un plat prévu pour deux', 'general'],
  ['regardé une série entière en une nuit', 'general'],
  ['pleuré devant un film d’animation', 'general'],
  ['oublié l’anniversaire de quelqu’un de proche', 'general'],
  ['gardé un vêtement avec l’étiquette pendant des mois', 'general'],
  ['fait semblant de connaître une chanson', 'general'],
  ['cassé un téléphone en le faisant tomber', 'general'],
  ['répondu « toi aussi » à quelqu’un qui ne le méritait pas', 'general'],
  ['dormi plus de douze heures d’affilée', 'general'],
  ['mangé quelque chose qui était tombé par terre', 'general'],
  ['été bloqué dans un ascenseur', 'general'],
  ['eu peur du noir à l’âge adulte', 'general'],
  ['chanté sous la douche à plein volume', 'general'],
  ['menti sur mon âge', 'general'],
  ['raté une marche devant tout le monde', 'general'],
]

const HOT: readonly Entry[] = [
  ['embrassé quelqu’un le soir même de la rencontre', 'soiree'],
  ['fini la nuit chez quelqu’un que je connaissais depuis deux heures', 'soiree'],
  ['couché le premier soir', 'amour'],
  ['fait l’amour dans une voiture', 'amour'],
  ['envoyé une photo osée', 'amour'],
  ['reçu une photo que je n’avais pas demandée', 'amour'],
  ['embrassé deux personnes le même soir', 'soiree'],
  ['embrassé quelqu’un qui était déjà en couple', 'amour'],
  ['eu un faible pour l’ami de mon meilleur ami', 'amour'],
  ['envoyé un message très chaud à un ex après quelques verres', 'amour'],
  ['dragué un collègue', 'boulot'],
  ['flirté au bureau devant tout le monde', 'boulot'],
  ['fait du sexting pendant une réunion', 'boulot'],
  ['embrassé quelqu’un rencontré en vacances', 'voyage'],
  ['fait l’amour à l’hôtel en essayant de ne pas faire de bruit', 'voyage'],
  ['fait semblant d’avoir aimé', 'amour'],
  ['pensé à quelqu’un d’autre au mauvais moment', 'amour'],
  ['installé une application de rencontre', 'amour'],
  ['dit oui à un rendez-vous pour une seule raison, très physique', 'amour'],
  ['dansé de façon franchement indécente', 'soiree'],
  ['été le premier à me déshabiller pour me baigner', 'soiree'],
  ['fini une soirée dans un endroit dont je ne me souviens pas', 'soiree'],
  ['acheté de la lingerie pour quelqu’un', 'amour'],
  ['regardé un film pour adultes à plusieurs', 'general'],
  ['menti sur mon nombre de partenaires', 'amour'],
  ['embrassé quelqu’un dans les toilettes d’un bar', 'soiree'],
  ['dormi contre quelqu’un sans qu’il se passe rien, à mon grand regret', 'amour'],
  ['eu un coup de foudre purement physique', 'amour'],
  ['gardé une application de rencontre en étant en couple', 'amour'],
  ['passé une heure sur le profil d’un ex', 'amour'],
  ['rompu par message', 'amour'],
  ['démissionné sur un coup de tête', 'boulot'],
  ['posé un arrêt maladie en pleine forme', 'boulot'],
  ['lu le journal intime de quelqu’un', 'general'],
  ['regardé le téléphone de quelqu’un sans sa permission', 'general'],
  ['fait le mur', 'enfance'],
  ['pris le volant sans avoir le permis', 'general'],
  ['fait un tatouage sur un coup de tête', 'general'],
  ['nagé nu de nuit', 'voyage'],
  ['inventé une excuse pour annuler à la dernière minute', 'general'],
  ['bloqué quelqu’un puis débloqué le lendemain', 'general'],
  ['regretté un message à la seconde où je l’ai envoyé', 'general'],
]

const HARDCORE: readonly Entry[] = [
  ['couché avec quelqu’un dont j’ai oublié le prénom', 'amour'],
  ['été infidèle', 'amour'],
  ['fait l’amour dans un lieu public', 'general'],
  ['participé à un plan à trois', 'amour'],
  ['embrassé quelqu’un du même sexe', 'amour'],
  ['couché avec quelqu’un du même sexe', 'amour'],
  ['simulé', 'amour'],
  ['filmé un moment intime', 'amour'],
  ['eu une aventure avec un collègue', 'boulot'],
  ['fait l’amour au travail', 'boulot'],
  ['fantasmé sur quelqu’un de cette table', 'amour'],
  ['couché avec quelqu’un de cette table', 'amour'],
  ['couché avec deux personnes le même jour', 'amour'],
  ['essayé les jouets à deux', 'amour'],
  ['touché au BDSM', 'amour'],
  ['mis les pieds dans un club libertin', 'soiree'],
  ['couché avec l’ex d’un ami', 'amour'],
  ['couché avec un ami de très longue date', 'amour'],
  ['été surpris en pleine action', 'amour'],
  ['fait l’amour dans un train ou dans un avion', 'voyage'],
  ['eu une aventure en voyage sans jamais en parler à personne', 'voyage'],
  ['payé, ou été payé, pour du sexe', 'general'],
  ['menti à mon partenaire sur l’endroit où j’avais passé la nuit', 'amour'],
  ['envoyé une photo intime à la mauvaise personne', 'amour'],
  ['couché avec quelqu’un par pure vengeance', 'amour'],
  ['mené deux histoires en même temps', 'amour'],
  ['embrassé quelqu’un devant son partenaire', 'soiree'],
  ['couché avec quelqu’un de bien plus âgé', 'amour'],
  ['espionné le téléphone de mon partenaire', 'amour'],
  ['raconté une version très arrangée de ma vie intime', 'general'],
  ['bu au point de ne plus me souvenir de la nuit', 'soiree'],
  ['été malade en public après avoir trop bu', 'soiree'],
  ['passé une nuit au poste', 'general'],
  ['pris part à une bagarre', 'general'],
  ['volé quelque chose dans un magasin', 'general'],
  ['pris une drogue', 'general'],
  ['triché à un examen important', 'general'],
  ['menti à un policier', 'general'],
  ['créé un faux profil', 'general'],
  ['regretté quelqu’un dès le lendemain matin', 'amour'],
]

function build(entries: readonly Entry[], intensity: Intensity): NheQuestion[] {
  return entries.map(([text, theme], index) => ({
    id: `${intensity}-${index}`,
    text,
    intensity,
    theme,
  }))
}

export const NHE_QUESTIONS: readonly NheQuestion[] = [
  ...build(SOFT, 'soft'),
  ...build(HOT, 'hot'),
  ...build(HARDCORE, 'hardcore'),
]

export const ALL_THEMES = Object.keys(THEME_LABELS) as NheTheme[]
export const ALL_INTENSITIES: Intensity[] = ['soft', 'hot', 'hardcore']

export function filterQuestions(
  intensities: readonly Intensity[],
  themes: readonly NheTheme[],
  custom: readonly NheQuestion[] = [],
): NheQuestion[] {
  return [...NHE_QUESTIONS, ...custom].filter((question) => {
    const intensityOk = intensities.length === 0 || intensities.includes(question.intensity)
    const themeOk = themes.length === 0 || themes.includes(question.theme)
    return intensityOk && themeOk
  })
}
