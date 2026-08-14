import { plural } from '@/shared/lib/format'
import type { Clue } from '../engine'
import { TEAM_COLORS } from '../palette'

interface ClueBannerProps {
  clue: Clue
  /** `null` = indice donné à zéro, autant de propositions qu'on veut. */
  guessesLeft: number | null
}

/** L'indice reste sous les yeux de l'équipe pendant qu'elle cherche. */
export function ClueBanner({ clue, guessesLeft }: ClueBannerProps) {
  const color = TEAM_COLORS[clue.team]

  return (
    <div
      className="animate-rise relative overflow-hidden rounded-2xl border px-4 py-3"
      style={{
        borderColor: `color-mix(in oklab, ${color} 45%, transparent)`,
        background: `linear-gradient(150deg, color-mix(in oklab, ${color} 18%, var(--color-ink-raised)), var(--color-ink))`,
      }}
    >
      {/* Le balayage de lumière : la bannière reste vivante pendant qu'on cherche. */}
      <span
        aria-hidden
        className="animate-sweep pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/12 to-transparent"
      />

      <div className="relative flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-muted text-[0.6rem] tracking-[0.25em] uppercase">Indice</p>
          <p className="font-display truncate text-2xl leading-tight font-extrabold uppercase">
            {clue.word}
          </p>
        </div>

        <span
          className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-extrabold"
          style={{ background: color, color: '#12101c' }}
        >
          {clue.count === 0 ? '∞' : clue.count}
        </span>
      </div>

      <div className="relative mt-2 flex items-center gap-2">
        {guessesLeft === null ? (
          <p className="text-muted text-xs">Autant de propositions que vous voulez.</p>
        ) : (
          <>
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: clue.count + 1 }, (_, index) => (
                <span
                  key={index}
                  className="h-1.5 w-4 rounded-full transition-colors duration-300"
                  style={{
                    background: index < guessesLeft ? color : 'var(--color-ink-edge)',
                  }}
                />
              ))}
            </div>
            <p className="text-muted text-xs">
              {plural(guessesLeft, 'proposition')} {guessesLeft > 1 ? 'restantes' : 'restante'}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
