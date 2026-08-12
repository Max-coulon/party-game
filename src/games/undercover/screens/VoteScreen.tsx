import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { PassGate } from '@/shared/ui/PassGate'
import { Screen } from '@/shared/layout/Screen'
import { alivePlayers, voteTargets, votingOrder } from '../engine'
import type { UndercoverState } from '../engine'

interface VoteScreenProps {
  state: UndercoverState
  onCastVote: (voterId: string, targetId: string) => void
  onGroupVote: (targetId: string) => void
  onUndo: () => void
}

export function VoteScreen(props: VoteScreenProps) {
  return props.state.rules.voteMode === 'group' ? <GroupVote {...props} /> : <SecretVote {...props} />
}

function RevoteBanner({ state }: { state: UndercoverState }) {
  if (!state.isRevote) return null
  return (
    <p className="bg-accent/12 border-accent/30 text-accent rounded-2xl border px-4 py-3 text-center text-sm">
      Égalité au premier tour. Second tour entre les joueurs à égalité.
    </p>
  )
}

function GroupVote({ state, onGroupVote }: VoteScreenProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const candidates = alivePlayers(state).filter(
    (player) => state.candidateIds === null || state.candidateIds.includes(player.id),
  )

  return (
    <Screen
      footer={
        <Button full disabled={selected === null} onClick={() => selected && onGroupVote(selected)}>
          Éliminer
        </Button>
      }
    >
      <header className="px-1 pt-2">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
          Manche {state.round}
        </p>
        <h2 className="mt-2 text-3xl">Qui sort ?</h2>
        <p className="text-muted mt-2 text-sm">
          Décidez à voix haute, puis désignez le joueur sur ce téléphone.
        </p>
      </header>

      <RevoteBanner state={state} />

      <ul className="flex flex-col gap-2">
        {candidates.map((player) => (
          <li key={player.id}>
            <button
              type="button"
              aria-pressed={selected === player.id}
              onClick={() => setSelected(player.id)}
              className={
                selected === player.id
                  ? 'bg-accent text-ink flex min-h-14 w-full items-center rounded-2xl px-4 text-left font-semibold'
                  : 'surface text-chalk flex min-h-14 w-full items-center rounded-2xl px-4 text-left'
              }
            >
              {player.name}
            </button>
          </li>
        ))}
      </ul>
    </Screen>
  )
}

function SecretVote(props: VoteScreenProps) {
  const { state } = props
  // Le `key` fait repartir le bulletin de zéro à chaque changement de main :
  // rien de secret ne reste affiché quand le téléphone passe au votant suivant.
  return <SecretBallot key={`${state.voterIndex}-${state.isRevote}`} {...props} />
}

function SecretBallot({ state, onCastVote, onUndo }: VoteScreenProps) {
  const order = votingOrder(state)
  const voter = order[state.voterIndex]
  const [armed, setArmed] = useState(false)

  if (!voter) return null

  const targets = voteTargets(state, voter.id)

  if (!armed) {
    return (
      <Screen className="justify-center">
        <PassGate
          holder={voter.name}
          step={`Vote ${state.voterIndex + 1} / ${order.length}`}
          instruction="Personne d'autre ne doit voir ton vote."
          onReady={() => setArmed(true)}
        />
        {state.voterIndex > 0 && (
          <Button variant="ghost" size="sm" onClick={onUndo}>
            Corriger le vote précédent
          </Button>
        )}
      </Screen>
    )
  }

  return (
    <Screen>
      <header className="px-1 pt-2">
        <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
          {voter.name}, à toi
        </p>
        <h2 className="mt-2 text-3xl">Qui est l'imposteur ?</h2>
      </header>

      <RevoteBanner state={state} />

      <ul className="flex flex-col gap-2">
        {targets.map((target) => (
          <li key={target.id}>
            <button
              type="button"
              onClick={() => onCastVote(voter.id, target.id)}
              className="surface text-chalk flex min-h-14 w-full items-center rounded-2xl px-4 text-left transition-transform active:scale-[0.99]"
            >
              {target.name}
            </button>
          </li>
        ))}
      </ul>
    </Screen>
  )
}
