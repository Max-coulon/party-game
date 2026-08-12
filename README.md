# Party Game

Cinq jeux de soirée qui se jouent autour d'une table, avec un seul téléphone qui passe de main
en main. Application web installable (PWA), mobile-first, hors ligne, sans compte ni serveur.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
```

| Commande            | Effet                                       |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Serveur de développement                    |
| `npm run build`     | Vérification des types puis build production |
| `npm run preview`   | Sert le build                               |
| `npm run typecheck` | Vérification des types seule                |
| `npm run lint`      | ESLint (règles React Hooks incluses)        |
| `npm test`          | Tests des moteurs de jeu                    |

## Les jeux

| Jeu                 | Ce qu'on y fait                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Undercover**      | Chacun reçoit un mot, sauf les imposteurs qui en ont un autre — et Mr White qui n'en a aucun. On décrit, on vote, on élimine. 468 paires sur 15 thèmes. |
| **Je n'ai jamais**  | Trois intensités, six thèmes. Ceux qui l'ont fait boivent. Deux règles spéciales doublent la mise.                                            |
| **Action ou Vérité** | Trois intensités, 150 cartes. Refuser coûte des gorgées.                                                                                     |
| **Fais deviner**    | En équipes, au chrono. Preset **Time's Up** (3 manches sur le même paquet) ou **Mix** (manches et paquets au choix), 6 façons de faire deviner. |
| **Tirage au doigt** | Tout le monde pose un doigt, le sort désigne — ou répartit tout le monde en équipes.                                                          |

## Architecture

```
src/
├── shared/          lib · hooks · ui · layout      (aucune logique de jeu)
├── players/         trombinoscope réutilisé par tous les jeux
├── games/
│   ├── registry.ts  source unique du menu et des routes
│   └── <jeu>/       engine.ts · engine.test.ts · données · screens/ · <Jeu>Game.tsx
└── app/             routes, menu
```

**Un jeu = un reducer pur.** `engine.ts` est une fonction `(state, action) => state` sans React,
sans effet de bord et sans accès au temps ni au hasard non injecté : le générateur aléatoire est
un paramètre (`Rng`), ce qui rend chaque règle testable de façon déterministe. Le composant
`<Jeu>Game.tsx` ne fait qu'appeler ce reducer et brancher les écrans, qui sont purement
présentationnels.

Conséquences directes : l'état d'une partie est sérialisable, donc la reprise après fermeture de
l'onglet est gratuite ; et les 99 tests couvrent les règles là où elles vivent réellement.

## Parti pris d'interface

Fond encre-violet et **une couleur par jeu**, qui suit le joueur du menu jusqu'à l'écran final :
la couleur dit où l'on est, elle ne décore pas.

Le **sceau** est l'élément signature : tous les moments secrets (rôle Undercover, vote individuel)
passent par une carte qu'il faut maintenir appuyée pour lire, et qui se referme au relâchement.
Un téléphone posé sur la table n'affiche jamais le rôle de personne.

## Ce qui est conservé sur l'appareil

Rien ne sort du navigateur. `localStorage` conserve la liste des joueurs, les réglages de chaque
jeu, les contenus ajoutés à la main, et la partie en cours (effacée dès qu'elle se termine).

## Icônes

`public/icon.svg` est la source. Les PNG (`icon-192`, `icon-512`, `apple-touch-icon`) en sont
dérivés ; pour les régénérer après modification du SVG, rendre celui-ci à 512 × 512 puis :

```bash
sips -z 512 512 icon-512.png
sips -z 192 192 icon-192.png
sips -z 180 180 apple-touch-icon.png
```

## Écart avec la version précédente

Time's Up et Party Guess ont fusionné en **Fais deviner** : les deux jeux partageaient équipes,
chrono, paquet et manches mime/un-mot. Ils sont désormais deux presets d'un même moteur, ce qui
rend jouable toute combinaison manche × catégorie — « Célébrités » et « Sport » étaient des
variantes figées, ce sont maintenant des paquets utilisables avec n'importe quelle contrainte.

La variante « Finis les paroles » est couverte par la manche **Chante-le** sur le paquet
Chansons : reproduire des paroles sous copyright n'a pas sa place dans le dépôt.

## Avertissement

Application destinée à des adultes. Buvez avec modération, et jamais avant de conduire.
