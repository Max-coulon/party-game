/**
 * iOS tient la pile d'annulation de la saisie au niveau du document, pas du
 * champ : après avoir tapé des prénoms, secouer le téléphone en pleine partie
 * propose encore « Annuler la saisie » alors qu'aucun champ n'est à l'écran.
 * Rien ne permet de refuser le geste, on vide donc la pile quand le dernier
 * champ disparaît — plus rien à annuler, plus de fenêtre.
 */
export function flushTypingUndo(): void {
  // Après le retrait du champ du DOM : appelé pendant qu'il est encore là, on
  // annulerait une saisie visible sans que React le sache.
  setTimeout(() => {
    for (let i = 0; i < 50; i += 1) {
      if (!document.queryCommandEnabled('undo')) return
      document.execCommand('undo')
    }
  }, 0)
}
