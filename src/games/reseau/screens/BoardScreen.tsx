import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { TEAM_LABELS, other } from '../engine'
import type { ReseauState } from '../engine'
import { ROLE_COLORS, TEAM_COLORS } from '../palette'
import { Board } from './Board'
import { ClueBanner } from './ClueBanner'
import { ScoreBar } from './ScoreBar'

interface BoardScreenProps {
  state: ReseauState
  onSelect: (index: number) => void
  onConfirm: () => void
  onPass: () => void
  onNextTurn: () => void
}

function turnEndMessage(state: ReseauState): string {
  const revealed = state.lastReveal ? state.cards[state.lastReveal.index]?.word : undefined
  switch (state.turnEndReason) {
    case 'adversaire':
      return `${revealed?.toUpperCase()} était à ${TEAM_LABELS[other(state.turn)]}. Un agent de moins à leur faire trouver.`
    case 'neutre':
      return `${revealed?.toUpperCase()} n'était à personne.`
    case 'quota':
      return 'Plus de proposition sur cet indice.'
    default:
      return `${TEAM_LABELS[state.turn]} s'arrête là.`
  }
}

/** La table : la grille, l'indice en cours, et ce qui vient de se passer. */
export function BoardScreen({
  state,
  onSelect,
  onConfirm,
  onPass,
  onNextTurn,
}: BoardScreenProps) {
  const guessing = state.phase === 'guess'
  const selectedCard = state.selected === null ? null : state.cards[state.selected]
  const endColor = state.lastReveal ? ROLE_COLORS[state.lastReveal.role] : TEAM_COLORS[state.turn]

  return (
    <Screen
      footer={
        guessing ? (
          <>
            <Button full disabled={!selectedCard} onClick={onConfirm}>
              {selectedCard ? (
                <>
                  Retourner <span className="uppercase">« {selectedCard.word} »</span>
                </>
              ) : (
                'Choisis une carte'
              )}
            </Button>
            <Button
              full
              variant="ghost"
              size="md"
              disabled={state.guessesMade === 0}
              onClick={onPass}
            >
              {state.guessesMade === 0 ? 'Une proposition au minimum' : 'On s’arrête là'}
            </Button>
          </>
        ) : (
          <Button full onClick={onNextTurn}>
            Au tour de {TEAM_LABELS[other(state.turn)]}
          </Button>
        )
      }
    >
      <ScoreBar state={state} />

      {guessing && state.clue ? (
        <ClueBanner clue={state.clue} guessesLeft={state.guessesLeft} />
      ) : (
        <div
          role="status"
          className="animate-rise rounded-2xl border px-4 py-3"
          style={{
            borderColor: `color-mix(in oklab, ${endColor} 45%, transparent)`,
            background: `linear-gradient(150deg, color-mix(in oklab, ${endColor} 18%, var(--color-ink-raised)), var(--color-ink))`,
          }}
        >
          <p className="text-muted text-[0.6rem] tracking-[0.25em] uppercase">Fin du tour</p>
          <p className="mt-1 text-sm text-balance">{turnEndMessage(state)}</p>
        </div>
      )}

      <Board
        cards={state.cards}
        selected={state.selected}
        highlight={state.lastReveal?.index ?? null}
        showKey={false}
        onSelect={guessing ? onSelect : undefined}
      />

      <p className="text-muted/60 px-1 text-center text-[0.7rem] text-balance">
        {guessing
          ? 'Touchez une carte pour la viser, validez pour la retourner. Le chef de réseau ne dit plus rien.'
          : 'Passez le téléphone au chef de réseau adverse.'}
      </p>
    </Screen>
  )
}
