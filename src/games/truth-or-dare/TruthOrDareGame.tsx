import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gameById } from '@/games/registry'
import { Screen } from '@/shared/layout/Screen'
import { TopBar } from '@/shared/layout/TopBar'
import { useAccent } from '@/shared/layout/useAccent'
import { usePersistentState } from '@/shared/hooks/usePersistentState'
import { useCustomContent } from '@/shared/hooks/useCustomContent'
import { clearGameSave, readGameSave, useGameSave } from '@/shared/hooks/useGameSave'
import { useWakeLock } from '@/shared/hooks/useWakeLock'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { EmptyState } from '@/shared/ui/EmptyState'
import { DEFAULT_CONFIG, MIN_PLAYERS, createGame, todReducer } from './engine'
import type { TodAction, TodConfig, TodState } from './engine'
import { filterCards, hasBothTypes } from './cards'
import type { TodCard, TodIntensity } from './cards'
import { SetupScreen } from './screens/SetupScreen'
import { ChoiceScreen } from './screens/ChoiceScreen'
import { CardScreen } from './screens/CardScreen'
import { EndScreen } from './screens/EndScreen'

const GAME = gameById('truth-or-dare')
const SAVE_ID = 'truth-or-dare'

export default function TruthOrDareGame() {
  useAccent(GAME.accent)
  const navigate = useNavigate()

  const [names, setNames] = usePersistentState<string[]>('tod:names', [])
  const [intensities, setIntensities] = usePersistentState<TodIntensity[]>('tod:intensities', [
    'soft',
  ])
  const [config, setConfig] = usePersistentState<Omit<TodConfig, 'players'>>(
    'tod:config',
    DEFAULT_CONFIG,
  )
  const custom = useCustomContent<TodCard>('tod:custom')

  const [state, setState] = useState<TodState | null>(null)
  const [resumable, setResumable] = useState<TodState | null>(() => readGameSave<TodState>(SAVE_ID))
  const [confirmQuit, setConfirmQuit] = useState(false)

  const finished = state?.phase === 'end'
  useGameSave(SAVE_ID, state, finished)
  useWakeLock(state !== null && !finished)

  const dispatch = useCallback((action: TodAction) => {
    setState((current) => (current ? todReducer(current, action) : current))
  }, [])

  const startGame = useCallback(() => {
    const cards = filterCards(intensities, custom.items)
    if (names.length < MIN_PLAYERS || !hasBothTypes(cards)) return
    setState(createGame({ players: names, ...config }, cards))
    setResumable(null)
  }, [names, intensities, custom.items, config])

  const quitToSetup = useCallback(() => {
    setState(null)
    setResumable(null)
    clearGameSave(SAVE_ID)
    setConfirmQuit(false)
  }, [])

  if (!state && resumable) {
    return (
      <>
        <TopBar title={GAME.name} onBack={() => navigate('/')} />
        <Screen className="justify-center">
          <EmptyState
            title="Une partie est en cours"
            description={`Tour ${resumable.turn}, ${resumable.config.players.length} joueurs.`}
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
          intensities={intensities}
          onIntensitiesChange={setIntensities}
          config={config}
          onConfigChange={setConfig}
          custom={custom}
          onStart={startGame}
        />
      </>
    )
  }

  return (
    <>
      <TopBar
        title={GAME.name}
        subtitle={finished ? 'Partie terminée' : `Tour ${state.turn}`}
        onBack={() => (finished ? quitToSetup() : setConfirmQuit(true))}
        action={
          !finished && state.config.maxTurns === 0 ? (
            <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'stop' })}>
              Terminer
            </Button>
          ) : undefined
        }
      />

      {state.phase === 'choice' && (
        <ChoiceScreen state={state} onChoose={(choice) => dispatch({ type: 'choose', choice })} />
      )}

      {state.phase === 'card' && (
        <CardScreen
          state={state}
          onResolve={(completed) => dispatch({ type: 'resolve', completed })}
          onSkipCard={() => dispatch({ type: 'skipCard' })}
        />
      )}

      {state.phase === 'end' && (
        <EndScreen state={state} onReplay={startGame} onNewSetup={quitToSetup} />
      )}

      <ConfirmDialog
        open={confirmQuit}
        title="Quitter la partie ?"
        description="Les scores en cours seront perdus."
        confirmLabel="Quitter"
        cancelLabel="Continuer à jouer"
        onConfirm={quitToSetup}
        onCancel={() => setConfirmQuit(false)}
      />
    </>
  )
}
