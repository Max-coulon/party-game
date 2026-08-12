import { Button } from './Button'

interface PassGateProps {
  holder: string
  instruction: string
  onReady: () => void
  step?: string
}

/**
 * L'écran tampon entre deux joueurs : rien de secret n'est affiché tant que le
 * bon joueur n'a pas confirmé qu'il tient le téléphone.
 */
export function PassGate({ holder, instruction, onReady, step }: PassGateProps) {
  return (
    <div className="surface rounded-card animate-deal-in flex min-h-[22rem] flex-col items-center justify-center gap-2 p-6 text-center">
      {step && <p className="text-muted text-xs tracking-[0.2em] uppercase">{step}</p>}
      <p className="text-muted mt-2 text-xs tracking-[0.2em] uppercase">Passe le téléphone à</p>
      <p className="font-display text-5xl font-extrabold">{holder}</p>
      <p className="text-muted mt-3 max-w-56 text-sm text-balance">{instruction}</p>
      <Button className="mt-8" onClick={onReady}>
        C'est moi
      </Button>
    </div>
  )
}
