import { useState } from 'react'
import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { PassGate } from '@/shared/ui/PassGate'
import { cn } from '@/shared/lib/cn'
import { SUIT_LABELS, SUIT_SYMBOLS, isRed, rankName } from '../cards'
import type { Suit } from '../cards'
import {
  DEAL_KINDS,
  HAND_SIZE,
  currentDealPlayer,
  dealKind,
  dealPrompt,
} from '../engine'
import type { DealGuess, PyramidState } from '../engine'
import { CardFace } from './PlayingCard'

interface DealScreenProps {
  state: PyramidState
  onGuess: (guess: DealGuess) => void
  onAck: () => void
  onGive: (targetId: string) => void
}

export function DealScreen({ state, onGuess, onAck, onGive }: DealScreenProps) {
  return <DealTurn key={state.dealIndex} state={state} onGuess={onGuess} onAck={onAck} onGive={onGive} />
}

function DealTurn({ state, onGuess, onAck, onGive }: DealScreenProps) {
  const [opened, setOpened] = useState(false)
  const player = currentDealPlayer(state)
  if (!player) return null

  const step = `${state.dealIndex + 1} / ${state.players.length}`
  const kind = dealKind(state.dealCardIndex)

  if (!opened) {
    return (
      <Screen className="justify-center">
        <PassGate
          holder={player.name}
          step={step}
          instruction="Quatre cartes, quatre paris. Personne d'autre ne doit voir ce qui tombe."
          onReady={() => setOpened(true)}
        />
      </Screen>
    )
  }

  return (
    <Screen
      footer={
        state.dealStep === 'reveal' ? (
          <Button full onClick={onAck}>
            {state.pendingCorrect ? 'Je désigne' : 'Je bois'}
          </Button>
        ) : undefined
      }
    >
      <header className="px-1 pt-1">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
          {player.name} · carte {state.dealCardIndex + 1} / {HAND_SIZE}
        </p>
        <h2 className="mt-1.5 text-3xl">
          {state.dealStep === 'guess' && dealPrompt(kind, player.hand)}
          {state.dealStep === 'reveal' && (state.pendingCorrect ? 'Trouvé.' : 'Raté.')}
          {state.dealStep === 'give' && 'À qui tu fais boire ?'}
        </h2>
        <p className="text-muted mt-1.5 text-sm text-balance">
          {state.dealStep === 'guess' && 'Une gorgée en jeu. Bonne réponse, tu la donnes.'}
          {state.dealStep === 'reveal' &&
            (state.pendingCorrect
              ? 'La gorgée est pour quelqu’un d’autre.'
              : 'Une gorgée pour toi. La carte reste dans ta main.')}
          {state.dealStep === 'give' && 'Une gorgée. Choisis.'}
        </p>
      </header>

      {player.hand.length > 0 && (
        <ul className="flex justify-center gap-2">
          {player.hand.map((held) => (
            <li key={held.id} className="w-14">
              <CardFace card={held} size="sm" />
            </li>
          ))}
        </ul>
      )}

      {state.dealStep === 'guess' && <GuessPad kind={kind} onGuess={onGuess} />}

      {state.dealStep === 'reveal' && state.pendingCard && (
        <div className="animate-deal-in flex flex-col items-center gap-3">
          <CardFace card={state.pendingCard} size="lg" className="w-32" />
          <p className="text-muted text-center text-sm text-balance">
            {isRed(state.pendingCard) ? 'Rouge' : 'Noir'}
            {' · '}
            {rankName(state.pendingCard.rank)} de {SUIT_LABELS[state.pendingCard.suit]}
          </p>
        </div>
      )}

      {state.dealStep === 'give' && (
        <ul className="flex flex-col gap-2">
          {state.players
            .filter((other) => other.id !== player.id)
            .map((other) => (
              <li key={other.id}>
                <button
                  type="button"
                  onClick={() => onGive(other.id)}
                  className="surface flex min-h-14 w-full items-center rounded-2xl px-4 text-left font-semibold transition-transform active:scale-[0.99]"
                >
                  {other.name}
                </button>
              </li>
            ))}
        </ul>
      )}
    </Screen>
  )
}

function GuessPad({
  kind,
  onGuess,
}: {
  kind: (typeof DEAL_KINDS)[number]
  onGuess: (guess: DealGuess) => void
}) {
  if (kind === 'couleur') {
    return (
      <div className="grid grid-cols-2 gap-3">
        <GuessButton label="Rouge" hint="cœur ou carreau" onClick={() => onGuess({ kind: 'couleur', value: 'rouge' })} />
        <GuessButton label="Noir" hint="pique ou trèfle" onClick={() => onGuess({ kind: 'couleur', value: 'noir' })} />
      </div>
    )
  }

  if (kind === 'plusMoins') {
    return (
      <div className="grid grid-cols-2 gap-3">
        <GuessButton label="Plus" hint="plus haute" onClick={() => onGuess({ kind: 'plusMoins', value: 'plus' })} />
        <GuessButton label="Moins" hint="plus basse" onClick={() => onGuess({ kind: 'plusMoins', value: 'moins' })} />
      </div>
    )
  }

  if (kind === 'interExter') {
    return (
      <div className="grid grid-cols-2 gap-3">
        <GuessButton label="Inter" hint="entre les deux" onClick={() => onGuess({ kind: 'interExter', value: 'inter' })} />
        <GuessButton label="Exter" hint="à l’extérieur" onClick={() => onGuess({ kind: 'interExter', value: 'exter' })} />
      </div>
    )
  }

  const suits: Suit[] = ['pique', 'coeur', 'carreau', 'trefle']
  return (
    <div className="grid grid-cols-2 gap-3">
      {suits.map((suit) => (
        <GuessButton
          key={suit}
          label={`${SUIT_SYMBOLS[suit]} ${SUIT_LABELS[suit]}`}
          onClick={() => onGuess({ kind: 'signe', value: suit })}
        />
      ))}
    </div>
  )
}

function GuessButton({
  label,
  hint,
  onClick,
}: {
  label: string
  hint?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'surface flex min-h-24 flex-col items-center justify-center rounded-3xl px-3 text-center transition-transform active:scale-[0.98]',
      )}
    >
      <span className="font-display text-2xl font-extrabold">{label}</span>
      {hint && <span className="text-muted mt-1 text-xs">{hint}</span>}
    </button>
  )
}
