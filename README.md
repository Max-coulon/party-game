# Party Game 🎉

Une application de jeux de soirée inspirée de TOZ, développée avec React, TypeScript et Tailwind CSS.

## 🎮 Jeux disponibles

### Je n'ai jamais 🍺

Le classique des soirées ! Choisissez vos modes (Soft, Hot, Hardcore) et découvrez qui a déjà fait quoi.

**Fonctionnalités :**

- 3 modes de jeu : Soft 😊, Hot 🔥, Hardcore 💀
- Plus de 45 questions variées
- Système de scoring avec gorgées
- Classement en fin de partie avec cul sec pour le champion !

## 🚀 Démarrage rapide

### Installation des dépendances

```bash
npm install
```

### Lancement en mode développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production

```bash
npm run build
```

### Preview du build

```bash
npm run preview
```

## 📁 Structure du projet

```
src/
├── App.tsx                    # Composant principal avec routing
├── main.tsx                   # Point d'entrée
├── index.css                  # Styles globaux
├── types/
│   └── index.ts              # Définitions TypeScript
├── context/
│   └── PlayerContext.tsx     # Context pour gérer les joueurs
├── hooks/
│   └── useNeverHaveIEverGame.ts  # Logique du jeu "Je n'ai jamais"
├── data/
│   └── neverHaveIEverQuestions.ts  # Questions du jeu
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx        # Barre de navigation
│   │   └── PageContainer.tsx # Container responsive
│   ├── menu/
│   │   ├── GameCard.tsx      # Carte de jeu
│   │   └── PlayerSelectorButton.tsx
│   ├── players/
│   │   ├── PlayerSelectionModal.tsx
│   │   ├── PlayerList.tsx
│   │   └── PlayerScoreBoard.tsx
│   └── neverHaveIEver/
│       ├── NheModeSelector.tsx
│       ├── NheQuestionView.tsx
│       ├── NhePlayerAnswerList.tsx
│       └── NheSummary.tsx
└── routes/
    ├── GameMenu.tsx          # Menu principal
    └── NeverHaveIEverScreen.tsx  # Écran du jeu
```

## 🎨 Technologies utilisées

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Navigation
- **React Context** - State management global

## 📱 Design

- **Mobile-first** : optimisé pour les smartphones
- **Responsive** : s'adapte aux tablettes et desktop
- **Dark mode** : interface sombre pour les soirées
- **Animations** : transitions fluides et feedback visuel

## 🔮 Évolution future

### Prochaines fonctionnalités

- [ ] Nouveaux jeux (Action ou Vérité, etc.)
- [ ] Intégration d'une API backend
- [ ] Base de données pour sauvegarder les parties
- [ ] Statistiques des joueurs
- [ ] Questions personnalisées
- [ ] Mode multijoueur en ligne

### Architecture extensible

Le projet est conçu pour faciliter :

- L'ajout de nouveaux jeux (structure modulaire)
- L'intégration d'une API (couche de données séparée)
- La personnalisation des règles et questions

## 🛠️ Développement

### Bonnes pratiques suivies

- ✅ Composants fonctionnels avec hooks
- ✅ Séparation logique/présentation
- ✅ Typage TypeScript strict
- ✅ State management via Context API
- ✅ Code commenté et documenté
- ✅ Structure de fichiers claire

### Ajout d'un nouveau jeu

1. Créer les types dans `src/types/`
2. Créer les données dans `src/data/`
3. Créer le hook de logique dans `src/hooks/`
4. Créer les composants dans `src/components/`
5. Créer la route dans `src/routes/`
6. Ajouter la route dans `App.tsx`
7. Ajouter le jeu dans `GameMenu.tsx`

## ⚠️ Avertissement

Cette application est destinée à un usage récréatif entre adultes majeurs et responsables. Buvez avec modération et ne prenez jamais le volant après avoir consommé de l'alcool.

## 📄 Licence

MIT

---

Créé avec ❤️ pour des soirées inoubliables !
