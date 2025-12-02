import { NheQuestion } from "@/types";

/**
 * Exemples de questions avec thèmes
 *
 * Pour mettre à jour les questions existantes, il suffit d'ajouter la propriété `theme`
 */

export const questionsWithThemes: NheQuestion[] = [
  // SOIRÉES
  {
    id: "soft-soiree-1",
    text: "Je n'ai jamais dansé sur une table en soirée",
    mode: "soft",
    sips: 2,
    points: 2,
    theme: "soirees",
  },
  {
    id: "hot-soiree-1",
    text: "Je n'ai jamais embrassé quelqu'un lors d'une soirée",
    mode: "hot",
    sips: 2,
    points: 2,
    theme: "soirees",
  },
  {
    id: "hardcore-soiree-1",
    text: "Je n'ai jamais été viré d'une soirée",
    mode: "hardcore",
    sips: 3,
    points: 3,
    theme: "soirees",
  },

  // AMOUR & EX
  {
    id: "soft-amour-1",
    text: "Je n'ai jamais stalké mon ex sur les réseaux sociaux",
    mode: "soft",
    sips: 2,
    points: 2,
    theme: "amour",
  },
  {
    id: "hot-amour-1",
    text: "Je n'ai jamais trompé quelqu'un",
    mode: "hot",
    sips: 4,
    points: 4,
    theme: "amour",
  },
  {
    id: "hardcore-amour-1",
    text: "Je n'ai jamais couché avec un(e) ex",
    mode: "hardcore",
    sips: 2,
    points: 2,
    theme: "amour",
  },

  // VACANCES
  {
    id: "soft-vacances-1",
    text: "Je n'ai jamais raté mon vol/train",
    mode: "soft",
    sips: 2,
    points: 2,
    theme: "vacances",
  },
  {
    id: "hot-vacances-1",
    text: "Je n'ai jamais eu une aventure d'été",
    mode: "hot",
    sips: 2,
    points: 2,
    theme: "vacances",
  },
  {
    id: "hardcore-vacances-1",
    text: "Je n'ai jamais fait du naturisme en vacances",
    mode: "hardcore",
    sips: 3,
    points: 3,
    theme: "vacances",
  },

  // TRAVAIL / ÉTUDES
  {
    id: "soft-travail-1",
    text: "Je n'ai jamais dormi pendant une réunion/cours",
    mode: "soft",
    sips: 2,
    points: 2,
    theme: "travail",
  },
  {
    id: "hot-travail-1",
    text: "Je n'ai jamais eu un crush sur un collègue/professeur",
    mode: "hot",
    sips: 2,
    points: 2,
    theme: "travail",
  },
  {
    id: "hardcore-travail-1",
    text: "Je n'ai jamais eu une relation avec un collègue/professeur",
    mode: "hardcore",
    sips: 4,
    points: 4,
    theme: "travail",
  },

  // GÉNÉRAL (questions sans thème spécifique)
  {
    id: "soft-general-1",
    text: "Je n'ai jamais parlé tout seul",
    mode: "soft",
    sips: 1,
    points: 1,
    theme: "general",
  },
  {
    id: "hot-general-1",
    text: "Je n'ai jamais simulé un orgasme",
    mode: "hot",
    sips: 2,
    points: 2,
    theme: "general",
  },
  {
    id: "hardcore-general-1",
    text: "Je n'ai jamais consommé de drogues",
    mode: "hardcore",
    sips: 4,
    points: 4,
    theme: "general",
  },
];

/**
 * Note d'implémentation :
 *
 * Pour mettre à jour le fichier neverHaveIEverQuestions.ts existant,
 * il suffit d'ajouter la propriété `theme` à chaque question :
 *
 * {
 *   id: "soft-1",
 *   text: "Je n'ai jamais menti sur mon âge",
 *   mode: "soft",
 *   sips: 1,
 *   points: 1,
 *   theme: "general", // <- Ajouter cette ligne
 * }
 *
 * Les thèmes disponibles :
 * - "soirees" : Moments en soirée
 * - "amour" : Relations amoureuses
 * - "vacances" : Expériences de voyage
 * - "travail" : Vie professionnelle/études
 * - "general" : Thème par défaut
 */
