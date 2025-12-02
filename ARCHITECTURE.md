# Architecture de l'application Party Game

## Vue d'ensemble

Cette application suit une architecture React moderne avec séparation claire des responsabilités.

## Principes architecturaux

### 1. Séparation des préoccupations

- **Composants de présentation** : Composants "dumb" qui reçoivent des props et affichent l'UI
- **Logique métier** : Isolée dans des hooks personnalisés
- **Données** : Séparées dans des modules de configuration (prêt pour API)
- **Context** : Pour le state global partagé (joueurs)

### 2. Structure modulaire par fonctionnalité

```
src/
├── types/              # Types TypeScript partagés
├── context/            # Context providers (state global)
├── hooks/              # Logique métier réutilisable
├── data/               # Données statiques / configuration
├── components/         # Composants réutilisables par domaine
│   ├── layout/        # Composants de mise en page
│   ├── players/       # Composants liés aux joueurs
│   ├── menu/          # Composants du menu
│   └── neverHaveIEver/ # Composants spécifiques au jeu
└── routes/            # Pages / Écrans de l'app
```

### 3. Flux de données

```
Context (PlayerProvider)
    ↓
Routes (GameMenu, NeverHaveIEverScreen)
    ↓
Hooks personnalisés (useNeverHaveIEverGame)
    ↓
Composants de présentation
```

## Points d'extension

### Ajouter un nouveau jeu

1. **Types** : Définir les interfaces dans `src/types/`

   ```typescript
   export interface NewGameQuestion { ... }
   export interface NewGameState { ... }
   ```

2. **Données** : Créer `src/data/newGameQuestions.ts`

   ```typescript
   export const newGameQuestions = [...]
   ```

3. **Hook** : Créer `src/hooks/useNewGame.ts`

   ```typescript
   export const useNewGame = () => { ... }
   ```

4. **Composants** : Créer `src/components/newGame/`

   - Composants spécifiques au jeu

5. **Route** : Créer `src/routes/NewGameScreen.tsx`

6. **Navigation** : Ajouter dans `App.tsx`

   ```typescript
   <Route path="/game/new-game" element={<NewGameScreen />} />
   ```

7. **Menu** : Ajouter dans `GameMenu.tsx`
   ```typescript
   const availableGames = [
     ...,
     { id: 'new-game', name: 'Nouveau Jeu', ... }
   ]
   ```

### Intégration d'une API

Pour brancher une API backend :

1. Créer un dossier `src/services/`
2. Créer des services API :

   ```typescript
   // src/services/api.ts
   export const api = {
     async getQuestions(mode: NheMode): Promise<NheQuestion[]> {
       const response = await fetch(`/api/questions?mode=${mode}`);
       return response.json();
     },
   };
   ```

3. Modifier les hooks pour utiliser les services :

   ```typescript
   const [questions, setQuestions] = useState<NheQuestion[]>([]);

   useEffect(() => {
     api.getQuestions(selectedModes).then(setQuestions);
   }, [selectedModes]);
   ```

4. Pas besoin de modifier les composants (découplage réussi !)

### Ajouter un nouveau Context

```typescript
// src/context/ThemeContext.tsx
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Bonnes pratiques suivies

### TypeScript

- Types stricts activés
- Interfaces pour toutes les entités
- Pas de `any`

### React

- Composants fonctionnels uniquement
- Hooks pour la logique
- Props typées
- Context pour state global
- Mémoïsation avec `useCallback` dans les hooks

### Styling

- Tailwind utility-first
- Classes conditionnelles avec template strings
- Design tokens dans `tailwind.config.js`
- Animations CSS natives

### Organisation du code

- Un composant = un fichier
- Exports nommés
- Imports groupés et ordonnés
- Commentaires JSDoc pour les fonctions publiques

## Patterns utilisés

### Custom Hooks

Les hooks encapsulent la logique métier :

- État local
- Side effects
- Fonctions de manipulation
- Retournent un objet avec état + actions

```typescript
export const useNeverHaveIEverGame = () => {
  const [state, setState] = useState(...);
  const action = useCallback(() => {...}, []);
  return { state, action };
};
```

### Composition de composants

Composants petits et réutilisables :

```typescript
<PageContainer>
  <TopBar />
  <Content />
</PageContainer>
```

### Controlled Components

Tous les formulaires sont contrôlés :

```typescript
<input value={state} onChange={(e) => setState(e.target.value)} />
```

## Performance

### Optimisations actuelles

- `useCallback` pour les fonctions dans les hooks
- Lazy evaluation où possible
- CSS Tailwind purgé en production

### Optimisations futures possibles

- `React.memo` pour les composants coûteux
- `useMemo` pour les calculs lourds
- Code splitting avec `React.lazy`
- Virtualisation des longues listes

## Tests (à implémenter)

Structure recommandée :

```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   └── utils/
```

Outils suggérés :

- Vitest (test runner)
- React Testing Library (composants)
- MSW (mock API)

## Déploiement

### Build de production

```bash
npm run build
```

### Preview du build

```bash
npm run preview
```

### Hébergement recommandé

- Vercel (recommandé pour Vite)
- Netlify
- GitHub Pages
- AWS Amplify

### Variables d'environnement

Créer `.env` pour la config :

```
VITE_API_URL=https://api.example.com
```

Accès dans le code :

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Sécurité

### Actuellement

- Pas de données sensibles
- Tout en client-side
- Pas d'authentification nécessaire

### Avec backend (futur)

- HTTPS obligatoire
- CORS configuré correctement
- Rate limiting sur l'API
- Validation côté serveur
- Authentification JWT ou session

## Accessibilité

### Implémenté

- Aria labels sur les boutons
- Focus visible
- Contraste suffisant
- Touch targets > 44px

### À améliorer

- Navigation au clavier complète
- Screen reader support
- Reduced motion support

## Mobile-first

### Breakpoints Tailwind

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Optimisations mobile

- Max-width 480px pour le contenu
- Touch-friendly (44px min)
- Pas de hover states critiques
- Viewport meta tag configuré
