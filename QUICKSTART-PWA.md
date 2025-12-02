# 🚀 Guide de démarrage rapide - PWA iPhone

## ⏱️ Installation en 5 minutes

### 1. Installer les dépendances (si pas déjà fait)

```bash
npm install
```

### 2. Générer les icônes

1. Ouvrez `public/icon-generator.html` dans votre navigateur
2. Cliquez sur tous les boutons pour télécharger :
   - pwa-64x64.png
   - pwa-192x192.png
   - pwa-512x512.png
   - apple-touch-icon.png
   - maskable-icon-512x512.png
3. Placez tous les fichiers dans le dossier `public/`

### 3. Générer les splash screens

1. Ouvrez `public/splash-generator.html` dans votre navigateur
2. Cliquez sur "📥 Télécharger TOUS les splash screens"
3. Placez tous les fichiers dans le dossier `public/`

### 4. Tester

```bash
npm run dev
```

Ouvrez http://localhost:5173 sur votre iPhone avec Safari :

- L'app affichera un prompt d'installation après 3 secondes
- Suivez les instructions pour ajouter l'icône sur l'écran d'accueil

### 5. Build production

```bash
npm run build
```

Le dossier `dist/` contiendra votre PWA prête à déployer !

## 📱 Test sur iPhone

### Méthode manuelle (si le prompt ne s'affiche pas) :

1. Ouvrez Safari sur iPhone
2. Allez sur votre site
3. Appuyez sur le bouton Partager (⬆️)
4. Sélectionnez "Sur l'écran d'accueil"
5. Appuyez sur "Ajouter"

### Vérification :

- ✅ L'icône apparaît sur l'écran d'accueil
- ✅ L'app s'ouvre en plein écran (sans barre Safari)
- ✅ Le splash screen s'affiche au lancement
- ✅ L'app fonctionne même hors ligne (après 1ère visite)

## 🎨 Personnalisation rapide

### Changer les couleurs :

Éditez `vite.config.ts` ligne 14-15 :

```typescript
theme_color: "#0ea5e9",        // Couleur de la barre d'état iOS
background_color: "#0f172a",   // Couleur de fond au lancement
```

### Changer le nom :

Éditez `vite.config.ts` ligne 12-13 :

```typescript
name: "Votre Nom d'App",
short_name: "VotreApp",
```

## ❓ Problèmes ?

### L'icône ne s'affiche pas

→ Vérifiez que `apple-touch-icon.png` est dans `public/`

### Le prompt ne s'affiche pas

→ Normal sur iOS, il faut installer manuellement via Safari

### Ça ne marche pas offline

→ Rechargez la page une fois pour activer le service worker

## 📚 Documentation complète

Voir `PWA-SETUP.md` pour plus de détails.

---

**C'est tout ! Votre app est maintenant une PWA iPhone-ready ! 🎉**
