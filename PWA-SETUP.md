# Party Game - Configuration PWA pour iPhone

## 🚀 Installation des dépendances

Avant tout, installez les dépendances nécessaires :

```bash
npm install -D vite-plugin-pwa@^0.17.4
```

## 📱 Génération des icônes

1. Ouvrez le fichier `public/icon-generator.html` dans votre navigateur
2. Cliquez sur chaque bouton pour télécharger les icônes nécessaires :

   - **64x64** → `pwa-64x64.png`
   - **192x192** → `pwa-192x192.png`
   - **512x512** → `pwa-512x512.png`
   - **Apple Touch Icon** → `apple-touch-icon.png`
   - **Maskable Icon** → `maskable-icon-512x512.png`

3. Placez toutes les icônes téléchargées dans le dossier `public/`

## 🖼️ Génération des Splash Screens (optionnel mais recommandé)

Pour une meilleure expérience sur iOS, créez des splash screens avec votre logo centré sur fond `#0f172a` :

### Tailles requises :

- `apple-splash-640-1136.png` (iPhone SE)
- `apple-splash-750-1334.png` (iPhone 8)
- `apple-splash-828-1792.png` (iPhone 11)
- `apple-splash-1125-2436.png` (iPhone X/XS)
- `apple-splash-1179-2556.png` (iPhone 14 Pro)
- `apple-splash-1242-2208.png` (iPhone 8 Plus)
- `apple-splash-1242-2688.png` (iPhone XS Max)
- `apple-splash-1290-2796.png` (iPhone 14 Pro Max)
- `apple-splash-1536-2048.png` (iPad)
- `apple-splash-1668-2388.png` (iPad Pro 11")
- `apple-splash-2048-2732.png` (iPad Pro 12.9")

### Outil recommandé pour générer les splash screens :

- **PWA Asset Generator** : https://www.pwabuilder.com/imageGenerator
- Ou utilisez Figma/Photoshop avec le template suivant :
  - Fond : `#0f172a`
  - Logo : centré, environ 40% de la hauteur
  - Sauvegardez en PNG

Placez tous les splash screens dans le dossier `public/`

## 🏗️ Build pour la production

```bash
npm run build
```

Le plugin PWA générera automatiquement :

- Le `manifest.webmanifest`
- Le service worker pour le cache
- Les configurations nécessaires

## 📲 Installation sur iPhone

### Méthode 1 : Via Safari (recommandé)

1. Ouvrez l'application dans Safari
2. Appuyez sur le bouton "Partager" (icône avec flèche vers le haut)
3. Faites défiler et sélectionnez "Sur l'écran d'accueil"
4. Appuyez sur "Ajouter"

### Méthode 2 : Prompt automatique

L'application affichera automatiquement un prompt d'installation après 3 secondes sur iOS avec des instructions détaillées.

## ✅ Fonctionnalités PWA activées

- ✅ Installation sur l'écran d'accueil
- ✅ Mode standalone (plein écran sans barre Safari)
- ✅ Cache offline avec Service Worker
- ✅ Thème iOS adapté (`black-translucent`)
- ✅ Icônes optimisées pour iOS
- ✅ Splash screens pour tous les iPhone/iPad
- ✅ Orientation portrait verrouillée
- ✅ Viewport optimisé pour iPhone (avec notch support)
- ✅ Prompt d'installation intelligent

## 🧪 Test en développement

Le plugin PWA est activé même en mode développement :

```bash
npm run dev
```

Ouvrez http://localhost:5173 sur votre iPhone via Safari pour tester l'installation.

## 📦 Déploiement

Déployez le contenu du dossier `dist/` sur votre hébergeur :

- Vercel : `vercel --prod`
- Netlify : `netlify deploy --prod`
- GitHub Pages : configurez GitHub Actions

## 🔧 Personnalisation

### Modifier les couleurs du thème :

Éditez `vite.config.ts` :

```typescript
theme_color: "#0ea5e9",  // Couleur de la barre d'état
background_color: "#0f172a",  // Couleur de fond au lancement
```

### Modifier le nom de l'app :

Éditez `vite.config.ts` :

```typescript
name: "Party Game - Jeux de soirée",
short_name: "Party Game",
```

## 🐛 Dépannage

### L'icône ne s'affiche pas sur iOS

- Vérifiez que `apple-touch-icon.png` est bien dans `public/`
- Videz le cache Safari : Réglages > Safari > Effacer historique

### Le prompt d'installation ne s'affiche pas

- Sur iOS, le prompt s'affiche après 3 secondes
- Assurez-vous de ne pas être en mode standalone
- Vérifiez localStorage (le prompt peut avoir été dismissé)

### L'app ne fonctionne pas offline

- Vérifiez que le service worker est enregistré (DevTools > Application > Service Workers)
- Rechargez la page pour activer le service worker

## 📚 Ressources

- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Apple PWA Guidelines](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [PWA Builder](https://www.pwabuilder.com/)
