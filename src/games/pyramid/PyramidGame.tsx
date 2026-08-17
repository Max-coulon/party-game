import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gameById } from '@/games/registry'
import { Screen } from '@/shared/layout/Screen'
import { TopBar } from '@/shared/layout/TopBar'
import { useAccent } from '@/shared/layout/useAccent'
import { usePersistentState } from '@/shared/hooks/usePersistentState'
import { clearGameSave, readGameSave, useGameSave } from '@/shared/hooks/useGameSave'
import { useWakeLock } from '@/shared/hooks/useWakeLock'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { EmptyState } from '@/shared/ui/EmptyState'
import { plural } from '@/shared/lib/format'
import {
  DEFAULT_RULES,
  HAND_SIZE,
  createGame,
  currentDealPlayer,
  currentSlot,
  isSetupValid,
  pyramidReducer,
  unrevealedCount,
} from './engine'
import type { DealGuess, PyramidAction, PyramidRules, PyramidState } from './engine'
import { SetupScreen } from './screens/SetupScreen'
import { DealScreen } from './screens/DealScreen'
import { TableScreen } from './screens/TableScreen'
import { GiveScreen } from './screens/GiveScreen'
import { ChallengeScreen } from './screens/ChallengeScreen'
import { PeekHandDialog } from './screens/PeekHandDialog'
import { EndScreen } from './screens/EndScreen'

const GAME = gameById('pyramid')
const SAVE_ID = 'pyramid'

function readSave(): PyramidState | null {
  const stored = readGameSave<PyramidState>(SAVE_ID)
  if (!stored || !Array.isArray(stored.drawPile) || !stored.dealStep) return null
  return stored
}

export default function PyramidGame() {
  useAccent(GAME.accent)
  const navigate = useNavigate()

  const [names, setNames] = usePersistentState<string[]>('pyramid:names', [])
  const [rules, setRules] = usePersistentState<PyramidRules>('pyramid:rules', DEFAULT_RULES)

  const [state, setState] = useState<PyramidState | null>(null)
  const [resumable, setResumable] = useState<PyramidState | null>(readSave)
  const [confirmQuit, setConfirmQuit] = useState(false)
  const [peeking, setPeeking] = useState(false)

  const finished = state?.phase === 'end'
  useGameSave(SAVE_ID, state, Boolean(finished))
  useWakeLock(state !== null && !finished)

  const dispatch = useCallback((action: PyramidAction) => {
    setState((current) => (current ? pyramidReducer(current, action) : current))
  }, [])

  const startGame = useCallback(
    (nextRules: PyramidRules) => {
      if (!isSetupValid(names.length, nextRules)) return
      setState(createGame(names, nextRules))
      setResumable(null)
      setPeeking(false)
    },
    [names],
  )

  const quitToSetup = useCallback(() => {
    setState(null)
    setResumable(null)
    setPeeking(false)
    clearGameSave(SAVE_ID)
    setConfirmQuit(false)
  }, [])

  const onFlip = useCallback(() => {
    navigator.vibrate?.(24)
    dispatch({ type: 'flip' })
  }, [dispatch])

  if (!state && resumable) {
    const dealer = currentDealPlayer(resumable)
    const hidden = unrevealedCount(resumable)
    return (
      <>
        <TopBar title={GAME.name} onBack={() => navigate('/')} />
        <Screen className="justify-center">
          <EmptyState
            title="Une pyramide est en cours"
            description={
              resumable.phase === 'deal' && dealer
                ? `Distribution : ${dealer.name}, carte ${resumable.dealCardIndex + 1} / ${HAND_SIZE}.`
                : hidden === 0
                  ? 'Dernière carte retournée.'
                  : `${plural(hidden, 'carte')} encore face cachée.`
            }
            action={
              <div className="flex w-full flex-col gap-2">
                <Button full onClick={() => setState(resumable)}>
                  Reprendre
                </Button>
                <Button full variant="ghost" size="md" onClick={quitToSetup}>
                  Nouvelle partie
                </Button>
              </div>
            }
          />
        </Screen>
      </>
    )
  }

  if (!state) {
    return (
      <>
        <TopBar title={GAME.name} subtitle={GAME.tagline} onBack={() => navigate('/')} />
        <SetupScreen
          names={names}
          onNamesChange={setNames}
          rules={rules}
          onRulesChange={setRules}
          onStart={() => startGame(rules)}
        />
      </>
    )
  }

  const slot = currentSlot(state)
  const dealer = currentDealPlayer(state)
  const subtitle = finished
    ? 'Partie terminée'
    : state.phase === 'deal' && dealer
      ? `${dealer.name} · carte ${state.dealCardIndex + 1} / ${HAND_SIZE}`
      : slot?.revealed
        ? `Rang ${slot.row} · ${plural(slot.row, 'gorgée')}`
        : `${unrevealedCount(state)} à retourner`

  return (
    <>
      <TopBar
        title={GAME.name}
        subtitle={subtitle}
        onBack={() => (finished ? quitToSetup() : setConfirmQuit(true))}
      />

      {state.phase === 'deal' && (
        <DealScreen
          state={state}
          onGuess={(guess: DealGuess) => dispatch({ type: 'guess', guess })}
          onAck={() => dispatch({ type: 'ackReveal' })}
          onGive={(targetId) => dispatch({ type: 'dealGive', targetId })}
        />
      )}

      {state.phase === 'play' && (
        <TableScreen
          state={state}
          onFlip={onFlip}
          onClaim={(playerId) => dispatch({ type: 'claim', playerId })}
          onPeek={() => setPeeking(true)}
        />
      )}

      {state.phase === 'give' && (
        <GiveScreen
          state={state}
          onGive={(targetId) => dispatch({ type: 'give', targetId })}
          onCancel={() => dispatch({ type: 'cancelGive' })}
        />
      )}

      {state.phase === 'challenge' && (
        <ChallengeScreen
          state={state}
          onAccept={() => dispatch({ type: 'accept' })}
          onCallLiar={() => dispatch({ type: 'callLiar' })}
        />
      )}

      {state.phase === 'end' && (
        <EndScreen state={state} onReplay={() => startGame(rules)} onNewSetup={quitToSetup} />
      )}

      {peeking && state.phase === 'play' && (
        <PeekHandDialog state={state} onClose={() => setPeeking(false)} />
      )}

      <ConfirmDialog
        open={confirmQuit}
        title="Quitter la partie ?"
        description="Les cartes sont déjà distribuées. Tout sera perdu."
        confirmLabel="Quitter"
        cancelLabel="Continuer à jouer"
        onConfirm={quitToSetup}
        onCancel={() => setConfirmQuit(false)}
      />
    </>
  )
}
