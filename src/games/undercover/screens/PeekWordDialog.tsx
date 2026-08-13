import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { PassGate } from '@/shared/ui/PassGate'
import { alivePlayers } from '../engine'
import type { UndercoverPlayer, UndercoverState } from '../engine'
import { PlayerWordCard } from './PlayerWordCard'

interface PeekWordDialogProps {
  state: UndercoverState
  onClose: () => void
}

/**
 * Le rappel de mot en cours de partie. Même précaution qu'à la distribution :
 * on nomme celui qui doit tenir le téléphone avant d'afficher quoi que ce soit,
 * et la carte se referme dès qu'il a fini.
 */
export function PeekWordDialog({ state, onClose }: PeekWordDialogProps) {
  const [holder, setHolder] = useState<UndercoverPlayer | null>(null)
  const [opened, setOpened] = useState(false)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Revoir son mot"
      className="bg-ink/95 fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm"
    >
      <div className="safe-page-top safe-page-bottom mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-4 px-4">
        {holder === null && (
          <>
            <header className="px-1 text-center">
              <h2 className="text-3xl">Qui a oublié son mot ?</h2>
              <p className="text-muted mt-2 text-sm text-balance">
                Choisis ton nom, puis garde le téléphone pour toi le temps de le relire.
              </p>
            </header>

            <ul className="flex flex-col gap-2">
              {alivePlayers(state).map((player) => (
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
              Retour à la discussion
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
            <PlayerWordCard player={holder} />
            <Button full onClick={onClose}>
              C'est bon, je l'ai
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
