import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { PassGate } from '@/shared/ui/PassGate'
import { plural } from '@/shared/lib/format'
import { visibleHand } from '../engine'
import type { PyramidPlayer, PyramidState } from '../engine'
import { CardFace } from './PlayingCard'

interface PeekHandDialogProps {
  state: PyramidState
  onClose: () => void
}

/**
 * Le rappel de main en cours de partie. On nomme celui qui tient le téléphone
 * avant d'afficher quoi que ce soit, et l'écran se referme dès qu'il a fini.
 */
export function PeekHandDialog({ state, onClose }: PeekHandDialogProps) {
  const [holder, setHolder] = useState<PyramidPlayer | null>(null)
  const [opened, setOpened] = useState(false)

  const hand = holder ? visibleHand(holder) : []

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Revoir sa main"
      className="bg-ink/95 fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm"
    >
      <div className="safe-page-top safe-page-bottom mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-4 px-4">
        {holder === null && (
          <>
            <header className="px-1 text-center">
              <h2 className="text-3xl">Qui a oublié sa main ?</h2>
              <p className="text-muted mt-2 text-sm text-balance">
                Choisis ton nom, puis garde le téléphone pour toi le temps de relire tes cartes.
              </p>
            </header>

            <ul className="flex flex-col gap-2">
              {state.players.map((player) => (
                <li key={player.id}>
                  <button
                    type="button"
                    onClick={() => setHolder(player)}
                    className="surface text-chalk flex min-h-14 w-full items-center rounded-2xl px-4 text-left transition-transform active:scale-[0.99]"
                  >
                    {player.name}
                  </button>
                </li>
              ))}
            </ul>

            <Button full variant="ghost" size="md" onClick={onClose}>
              Retour à la pyramide
            </Button>
          </>
        )}

        {holder !== null && !opened && (
          <>
            <PassGate
              holder={holder.name}
              instruction="Personne d'autre ne doit voir cet écran."
              onReady={() => setOpened(true)}
            />
            <Button full variant="ghost" size="md" onClick={() => setHolder(null)}>
              Ce n'est pas moi
            </Button>
          </>
        )}

        {holder !== null && opened && (
          <>
            <header className="px-1 text-center">
              <p className="text-muted text-xs tracking-[0.2em] uppercase">{holder.name}</p>
              <h2 className="mt-2 text-3xl">Ta main</h2>
              <p className="text-muted mt-2 text-sm">
                {hand.length === 0
                  ? 'Plus rien. Tu as tout joué.'
                  : plural(hand.length, 'carte')}
              </p>
            </header>

            {hand.length > 0 && (
              <ul className="grid grid-cols-5 gap-2">
                {hand.map((held) => (
                  <li key={held.id} className="animate-deal-in">
                    <CardFace card={held} size="md" />
                  </li>
                ))}
              </ul>
            )}

            <Button full onClick={onClose}>
              C'est bon, je l'ai
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
