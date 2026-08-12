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
  ['fini une soirée dans un endroit dont je ne me souviens pas', 'soiree'],
  ['été à une soirée sans connaître celui qui l’organisait', 'soiree'],
  ['dansé sur un bar', 'soiree'],
  ['bu directement à la bouteille devant tout le monde', 'soiree'],
  ['envoyé un message que j’ai supprimé le lendemain', 'soiree'],
  ['été mis dehors d’un bar', 'soiree'],
  ['joué à action ou vérité et amèrement regretté', 'soiree'],
  ['tenu un pari stupide jusqu’au bout', 'soiree'],
  ['été le premier à me déshabiller pour me baigner', 'soiree'],
  ['embrassé quelqu’un qui était déjà en couple', 'amour'],
  ['eu un faible pour l’ami de mon meilleur ami', 'amour'],
  ['passé une heure sur le profil d’un ex', 'amour'],
  ['dit oui à un rendez-vous par pitié', 'amour'],
  ['embrassé deux personnes le même soir', 'amour'],
  ['envoyé un message à un ex après quelques verres', 'amour'],
  ['gardé les affaires d’un ex bien trop longtemps', 'amour'],
  ['vécu une relation à distance', 'amour'],
  ['rompu par message', 'amour'],
  ['fait semblant d’adorer un cadeau', 'amour'],
  ['dormi dans une voiture faute de mieux', 'voyage'],
  ['voyagé sans billet', 'voyage'],
  ['raté un vol à cause d’une soirée', 'voyage'],
  ['embrassé quelqu’un rencontré en vacances', 'voyage'],
  ['pris la route sans dire à personne où j’allais', 'voyage'],
  ['démissionné sur un coup de tête', 'boulot'],
  ['dragué un collègue', 'boulot'],
  ['posé un arrêt maladie en pleine forme', 'boulot'],
  ['dit du mal de mon patron devant lui sans qu’il comprenne', 'boulot'],
  ['assisté à une réunion entière sans rien écouter', 'boulot'],
  ['fait semblant d’être quelqu’un d’autre', 'general'],
  ['écouté une conversation qui ne me regardait pas', 'general'],
  ['lu le journal intime de quelqu’un', 'general'],
  ['regardé le téléphone de quelqu’un sans sa permission', 'general'],
  ['menti à mes parents sur l’endroit où j’étais', 'general'],
  ['pris le volant sans avoir le permis', 'general'],
  ['gardé quelque chose qui ne m’appartenait pas', 'general'],
  ['été convoqué par un directeur ou un patron', 'general'],
  ['eu une amende que je n’ai jamais payée', 'general'],
  ['fait un tatouage sur un coup de tête', 'general'],
  ['teint mes cheveux d’une couleur ridicule', 'general'],
  ['fumé une cigarette juste pour l’allure', 'general'],
  ['sauté d’un plongeoir bien trop haut', 'general'],
  ['nagé de nuit dans une piscine fermée', 'general'],
  ['fait le mur', 'enfance'],
  ['cassé quelque chose chez quelqu’un sans jamais l’avouer', 'general'],
  ['menti sur mes goûts pour plaire à quelqu’un', 'general'],
  ['supprimé une photo à cause d’un seul commentaire', 'general'],
  ['bloqué quelqu’un puis débloqué le lendemain', 'general'],
  ['été jaloux d’un ami', 'general'],
  ['inventé une excuse pour annuler à la dernière minute', 'general'],
  ['gardé un secret bien trop lourd pour moi', 'general'],
  ['accepté un défi que je n’aurais jamais dû accepter', 'general'],
  ['dormi ailleurs que chez moi sans prévenir personne', 'general'],
  ['regretté un message à la seconde où je l’ai envoyé', 'general'],
]

const HARDCORE: readonly Entry[] = [
  ['embrassé quelqu’un du même sexe', 'amour'],
  ['couché avec quelqu’un dont j’ai oublié le prénom', 'amour'],
  ['eu une aventure au travail', 'boulot'],
  ['été infidèle', 'amour'],
  ['vécu une histoire qui n’a duré qu’une nuit', 'amour'],
  ['eu un faible pour l’ex d’un ami', 'amour'],
  ['couché le premier soir', 'amour'],
  ['caché une relation à absolument tout le monde', 'amour'],
  ['envoyé une photo que je regrette encore', 'amour'],
  ['reçu une photo que je n’avais pas demandée', 'amour'],
  ['été surpris par quelqu’un au pire moment', 'amour'],
  ['embrassé quelqu’un dans les toilettes d’un bar', 'soiree'],
  ['simulé', 'amour'],
  ['eu une histoire avec quelqu’un de bien plus âgé', 'amour'],
  ['eu une histoire avec quelqu’un de bien plus jeune', 'amour'],
  ['été largué par message', 'amour'],
  ['quitté quelqu’un le jour de son anniversaire', 'amour'],
  ['fait semblant de dormir pour éviter une conversation', 'amour'],
  ['menti sur mon nombre d’histoires passées', 'amour'],
  ['gardé une application de rencontre en étant en couple', 'amour'],
  ['rencontré en vrai quelqu’un croisé sur une application', 'amour'],
  ['eu une histoire avec un ami de très longue date', 'amour'],
  ['été pris en flagrant délit de mensonge par mon partenaire', 'amour'],
  ['caché une relation pendant plus de six mois', 'amour'],
  ['dragué quelqu’un devant son partenaire', 'amour'],
  ['laissé une histoire détruire une amitié', 'amour'],
  ['dit « je t’aime » sans le penser une seconde', 'amour'],
  ['espionné le téléphone de mon partenaire', 'amour'],
  ['bu au point de ne plus me souvenir de la soirée', 'soiree'],
  ['été malade en public après avoir trop bu', 'soiree'],
  ['été raccompagné chez moi par des inconnus', 'soiree'],
  ['perdu mes clés et dormi chez quelqu’un que je ne connaissais pas', 'soiree'],
  ['eu une gueule de bois de deux jours', 'soiree'],
  ['dormi dehors sans l’avoir prévu', 'soiree'],
  ['menti à un policier', 'general'],
  ['passé une nuit au poste', 'general'],
  ['pris part à une bagarre', 'general'],
  ['volé quelque chose dans un magasin', 'general'],
  ['triché à un examen important', 'general'],
  ['détruit quelque chose sous le coup de la colère', 'general'],
  ['envoyé un message anonyme à quelqu’un', 'general'],
  ['créé un faux profil', 'general'],
  ['juré sur quelque chose d’important en mentant', 'general'],
  ['regretté profondément une nuit entière', 'general'],
  ['raconté à mes amis une version très arrangée d’une soirée', 'soiree'],
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
