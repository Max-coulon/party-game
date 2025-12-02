# Améliorations du Jeu "Je n'ai jamais"

## 📋 Résumé des Nouvelles Fonctionnalités

Cette mise à jour majeure ajoute de nombreuses fonctionnalités pour enrichir l'expérience de jeu tout en préservant l'architecture existante.

## 🎮 1. Règles Spéciales

### Nouvelles Règles Activables

- **Double Shot (🎯)** : Si tous les joueurs sauf un boivent, le survivant doit boire 2 gorgées
- **Retour de Karma (🔄)** : Si le lecteur de la question doit aussi boire, il boit +1 gorgée supplémentaire
- **Règle Mute (🤐)** : Les joueurs peuvent refuser de répondre en buvant automatiquement 2 gorgées
- **Mode Défi (🎭)** : Certaines questions incluent des défis/gages aléatoires (chanter, danser, etc.)

### Composant Associé

- `SpecialRulesConfig.tsx` - Interface pour activer/désactiver les règles

## ✍️ 2. Questions Personnalisées

Les joueurs peuvent maintenant ajouter leurs propres questions pour une session unique :

- Interface de saisie avec mode (soft/hot/hardcore) et nombre de gorgées
- Les questions custom sont marquées avec `isCustom: true`
- Possibilité de supprimer les questions ajoutées avant de commencer

### Composant Associé

- `CustomQuestions.tsx` - Gestion des questions personnalisées

## 🏷️ 3. Système de Thèmes

En plus des modes (soft/hot/hardcore), ajout de thèmes optionnels :

- **Soirées** - Moments embarrassants en soirée
- **Amour & Ex** - Relations amoureuses
- **Vacances** - Expériences de voyage
- **Travail/Études** - Vie professionnelle et académique
- **Général** - Thème par défaut

Les thèmes permettent un filtrage plus fin des questions selon les préférences du groupe.

## 🎭 4. Système de Défis

Quand le mode défi est actif (30% de chance par question) :

- Un défi aléatoire est tiré parmi 20+ gages variés
- S'affiche en plus de la question principale
- Exemples : chanter, danser, raconter une anecdote, faire des pompes, etc.

### Fichier de Données

- `challenges.ts` - Liste des défis disponibles
- Fonction `getRandomChallenge()` pour tirer un défi

### Composant Associé

- `ChallengeDisplay.tsx` - Affichage du défi avec design spécial

## 📜 5. Historique de Partie

Toutes les questions et réponses sont enregistrées pendant la partie :

- Question posée
- Joueurs qui ont bu
- Nombre de gorgées
- Règles spéciales déclenchées
- Timestamp

Accessible via un bouton flottant en bas à droite de l'écran pendant la partie.

### Composant Associé

- `GameHistory.tsx` - Modal avec historique complet

## 📊 6. Statistiques Locales

Système de stats sauvegardées en localStorage :

- Nombre total de parties jouées
- Classement des joueurs par victoires
- Mode le plus joué (soft/hot/hardcore)
- Date de la dernière partie

### Utilitaire

- `statsManager.ts` - Fonctions pour gérer les stats
  - `getStats()` - Récupère les stats
  - `saveStats()` - Sauvegarde les stats
  - `recordGamePlayed()` - Enregistre une partie
  - `resetStats()` - Réinitialise tout

### Composant Associé

- `StatsDisplay.tsx` - Modal d'affichage des statistiques

## 🔄 7. Améliorations de Rejouabilité

### Éviter les Répétitions

- Les questions déjà posées sont marquées dans un Set `usedQuestionIds`
- Lors d'un rejeu, ces questions sont exclues automatiquement
- Reset complet possible via `resetGame()`

### Options de Rejeu

- **"Rejouer"** - Nouvelle partie avec les mêmes joueurs
- **"Rejouer avec les mêmes paramètres"** - Même config exacte
- **"Nouvelle partie"** - Retour à l'écran de configuration

## 🎨 8. Améliorations Visuelles

### Animations Ajoutées

- Transitions fluides entre les questions
- Highlight des joueurs qui doivent boire
- Confettis en fin de partie (déjà présent, amélioré)
- Effets de scale et bounce sur les interactions

### Feedback Visuel

- État "muted" distinct visuellement (jaune/orange)
- Indication claire des règles spéciales déclenchées
- Avatars animés pour chaque joueur
- Badges colorés pour les modes et thèmes

## 🏗️ Architecture Technique

### Nouveaux Types (types/index.ts)

```typescript
NheTheme - Thèmes de questions
NheSpecialRules - Configuration des règles spéciales
NheHistoryEntry - Entrée dans l'historique
NheGameConfig - Configuration complète de la partie
GameStats - Statistiques globales
```

### Nouveau Hook Principal

`useNeverHaveIEverGameV2.ts` - Version améliorée avec :

- Gestion des thèmes
- Gestion des règles spéciales
- Historique de partie
- Questions personnalisées
- Évitement des répétitions

### Nouveaux Composants

```
SpecialRulesConfig.tsx      - Configuration des règles
CustomQuestions.tsx          - Gestion questions custom
ChallengeDisplay.tsx         - Affichage des défis
GameHistory.tsx              - Historique de la partie
StatsDisplay.tsx             - Statistiques
NhePlayerAnswerListV2.tsx    - Liste joueurs avec Mute
```

### Nouveaux Utilitaires

```
statsManager.ts  - Gestion des statistiques
challenges.ts    - Base de données des défis
```

## 🔌 Extensibilité

### Prêt pour une API Backend

L'architecture est conçue pour faciliter la migration vers une API :

```typescript
// Actuellement
const questions = getQuestionsByModes(selectedModes);

// Future implémentation API
const questions = await fetch(
  `/api/questions?modes=${modes}&themes=${themes}`
).then((res) => res.json());
```

### Points d'Extension

1. **Packs de Questions** : Système prêt pour charger des packs additionnels
2. **Thèmes Dynamiques** : Facile d'ajouter de nouveaux thèmes
3. **Règles Custom** : Structure permet d'ajouter facilement de nouvelles règles
4. **Défis Personnalisés** : Liste de défis externalisable en API
5. **Stats Cloud** : `statsManager` peut être adapté pour un backend

## 📦 Fichiers Modifiés

### Nouveaux Fichiers

```
src/hooks/useNeverHaveIEverGameV2.ts
src/utils/statsManager.ts
src/data/challenges.ts
src/components/neverHaveIEver/SpecialRulesConfig.tsx
src/components/neverHaveIEver/CustomQuestions.tsx
src/components/neverHaveIEver/ChallengeDisplay.tsx
src/components/neverHaveIEver/GameHistory.tsx
src/components/neverHaveIEver/StatsDisplay.tsx
src/components/neverHaveIEver/NhePlayerAnswerListV2.tsx
```

### Fichiers Modifiés

```
src/types/index.ts - Ajout de nouveaux types
```

### Fichiers Originaux Préservés

```
src/hooks/useNeverHaveIEverGame.ts - Toujours disponible
src/components/neverHaveIEver/NhePlayerAnswerList.tsx - Toujours disponible
```

## 🚀 Prochaines Étapes

Pour utiliser toutes ces nouvelles fonctionnalités, il faudra :

1. **Mettre à jour l'écran de configuration** (`NeverHaveIEverScreen.tsx`) pour intégrer :

   - `SpecialRulesConfig`
   - `CustomQuestions`
   - Sélection des thèmes
   - `StatsDisplay`

2. **Mettre à jour l'écran de jeu** pour utiliser :

   - `useNeverHaveIEverGameV2` au lieu de l'ancien hook
   - `NhePlayerAnswerListV2` avec support du Mute
   - `ChallengeDisplay` quand un défi est actif
   - `GameHistory` pendant la partie

3. **Mettre à jour l'écran de fin** pour :
   - Enregistrer les stats via `recordGamePlayed()`
   - Proposer les nouvelles options de rejeu

## 🎯 Avantages

✅ **Rejouabilité** : Questions non répétées, défis variés, statistiques motivantes
✅ **Personnalisation** : Questions custom, règles spéciales, thèmes
✅ **Immersion** : Historique, challenges, feedback visuel amélioré
✅ **Extensibilité** : Architecture prête pour l'API, nouveaux contenus
✅ **Non-Breaking** : Anciens composants préservés, migration progressive possible

## 📝 Notes d'Implémentation

- Toutes les nouvelles fonctionnalités sont **opt-in** (désactivées par défaut)
- L'ancien hook `useNeverHaveIEverGame` reste fonctionnel
- Les stats sont en **localStorage** uniquement (pas de backend requis)
- Les questions custom sont **temporaires** (session uniquement)
- Architecture **100% compatible** avec le code existant
