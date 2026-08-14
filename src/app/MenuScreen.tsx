import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { GAMES } from '@/games/registry'
import { RosterPanel } from '@/players/RosterPanel'
import { useRoster } from '@/players/rosterContext'
import { Screen } from '@/shared/layout/Screen'
import { useAccent } from '@/shared/layout/useAccent'
import { GameGlyph } from '@/shared/ui/GameGlyph'

export function MenuScreen() {
  const { players } = useRoster()
  useAccent(undefined)

  return (
    <Screen safeTop>
      <header className="px-1">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">Party Game</p>
        <h1 className="mt-2 text-[2.75rem] leading-[0.95]">
          Le téléphone
          <br />
          tourne.
        </h1>
        <p className="text-muted mt-3 max-w-72 text-sm text-balance">
          Six jeux qui se jouent à une seule table, avec un seul appareil qui passe de main en
          main.
        </p>
      </header>

      <nav aria-label="Jeux" className="flex flex-col gap-3">
        {GAMES.map((game) => (
          <Link
            key={game.id}
            to={game.path}
            style={
              // `--color-accent` est résolu là où il est déclaré : le redéfinir
              // ici aussi, sinon les utilitaires `accent` gardent la couleur du :root.
              { '--accent': game.accent, '--color-accent': game.accent } as CSSProperties
            }
            className="surface rounded-card relative flex items-center gap-4 overflow-hidden p-4 transition-transform active:scale-[0.99]"
          >
            {/* L'arête colorée : la couleur du jeu, avant même d'y entrer. */}
            <span aria-hidden className="bg-accent absolute inset-y-0 left-0 w-1" />
            <span
              aria-hidden
              className="bg-accent/12 text-accent border-accent/25 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border"
            >
              <GameGlyph id={game.id} className="h-7 w-7" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-display block text-xl font-extrabold">{game.name}</span>
              <span className="text-muted mt-0.5 block text-sm leading-snug text-balance">
                {game.tagline}
              </span>
              <span className="text-muted/60 mt-1.5 block text-xs">{game.playersLabel}</span>
            </span>
          </Link>
        ))}
      </nav>

      <RosterPanel />

      <p className="text-muted/60 px-1 pb-2 text-center text-xs text-balance">
        Réservé aux majeurs. Buvez avec modération, et jamais avant de conduire.
        {players.length > 0 && ' Vos joueurs restent sur cet appareil.'}
      </p>
    </Screen>
  )
}
