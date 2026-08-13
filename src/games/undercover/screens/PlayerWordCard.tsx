import type { UndercoverPlayer } from '../engine'

interface PlayerWordCardProps {
  player: UndercoverPlayer
}

/** La carte secrète d'un joueur — distribution comme rappel en cours de partie. */
export function PlayerWordCard({ player }: PlayerWordCardProps) {
  return (
    <div className="surface rounded-card animate-deal-in flex min-h-[22rem] flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-muted text-xs tracking-[0.2em] uppercase">{player.name}</p>
      {player.word === null ? (
        <>
          <p className="font-display text-accent text-4xl font-extrabold">Mr White</p>
          <p className="text-muted max-w-60 text-sm text-balance">
            Tu n'as pas de mot. Écoute les autres, devine-le, et fais comme si tu le savais depuis
            le début.
          </p>
        </>
      ) : (
        <>
          <p className="text-muted text-xs tracking-[0.2em] uppercase">Ton mot</p>
          <p className="font-display text-5xl font-extrabold text-balance">{player.word}</p>
          <p className="text-muted max-w-60 text-sm text-balance">
            Tout le monde n'a pas le même. Décris-le sans le dire.
          </p>
        </>
      )}
    </div>
  )
}
