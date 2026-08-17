import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { plural } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { rankName, rankPhrase } from '../cards'
import { currentSlot, playerById, sipsFor, unrevealedCount } from '../engine'
import type { Gift, PyramidState } from '../engine'
import { CardFace } from './PlayingCard'
import { PyramidBoard } from './PyramidBoard'

interface TableScreenProps {
  state: PyramidState
  failedId: string | null
  onFlip: () => void
  onClaim: (playerId: string) => void
  onPeek: () => void
}

export function TableScreen({ state, failedId, onFlip, onClaim, onPeek }: TableScreenProps) {
  const slot = currentSlot(state)
  const revealed = Boolean(slot?.revealed)
  const remaining = unrevealedCount(state)
  const nextIndex = state.slots.findIndex((item) => !item.revealed)
  const sips = slot?.revealed ? sipsFor(slot) : 0
  const last = remaining === 0

  return (
    <Screen
      footer={
        <>
          {revealed ? (
            <Button full onClick={onFlip}>
              {last ? 'On dévoile les mains' : 'Carte suivante'}
            </Button>
          ) : (
            <Button full onClick={onFlip}>
              {state.cursor < 0 ? 'Retourner la première carte' : 'Retourner'}
            </Button>
          )}
          <Button full variant="ghost" size="md" onClick={onPeek}>
            Voir ma main
          </Button>
        </>
      }
    >
      <header className="px-1 pt-1">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
          {remaining === state.slots.length
            ? `${state.slots.length} cartes face cachée`
            : last
              ? 'Dernière carte'
              : `Plus que ${plural(remaining, 'carte')}`}
        </p>
        <h2 className="mt-1.5 text-3xl">
          {revealed && slot
            ? `${rankName(slot.card.rank).replace(/^./, (letter) => letter.toUpperCase())}. ${plural(sips, 'gorgée')}.`
            : 'La pyramide.'}
        </h2>
        <p className="text-muted mt-1.5 text-sm text-balance">
          {revealed && slot
            ? `Qui a ${rankPhrase(slot.card.rank)} ? Tape ton nom.`
            : 'On commence au sommet. Une carte, autant de gorgées que le rang.'}
        </p>
      </header>

      <PyramidBoard
        slots={state.slots}
        rows={state.rules.rows}
        nextIndex={nextIndex}
        currentIndex={state.cursor}
        onFlip={onFlip}
      />

      {state.lastGift && <GiftBanner gift={state.lastGift} state={state} />}

      {revealed && (
        <ul className="grid grid-cols-2 gap-2">
          {state.players.map((player) => {
            const shook = failedId === player.id
            return (
              <li key={player.id}>
                <button
                  type="button"
                  onClick={() => onClaim(player.id)}
                  className={cn(
                    'surface flex min-h-14 w-full items-center justify-center rounded-2xl px-3 text-center text-sm font-semibold transition-transform active:scale-[0.99]',
                    shook && 'animate-shake',
                  )}
                >
                  {player.name}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Screen>
  )
}

function GiftBanner({ gift, state }: { gift: Gift; state: PyramidState }) {
  const from = playerById(state, gift.fromId)?.name
  const to = playerById(state, gift.toId)?.name
  if (!from || !to) return null

  return (
    <div className="bg-accent/12 border-accent/30 animate-deal-in flex items-center gap-3 rounded-2xl border px-3 py-2.5">
      <CardFace card={gift.card} size="sm" className="w-9 shrink-0" />
      <p className="min-w-0 text-sm text-balance">
        <span className="font-semibold">{from}</span>
        {' → '}
        <span className="font-semibold">{to}</span>
        <span className="text-muted">
          {' · '}
          {plural(gift.sips, 'gorgée')}
        </span>
      </p>
    </div>
  )
}
