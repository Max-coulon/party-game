import { useCallback, useState } from 'react'
import type { ComponentProps } from 'react'
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
import { TEAM_COLORS, buildPool, createGame, currentMode, guessReducer } from './engine'
import type { GuessAction, GuessState } from './engine'
import { filterCards } from './cards'
import type { GuessCard, GuessCategory } from './cards'
import { MODES, TIMES_UP_MODES } from './modes'
import { SetupScreen } from './screens/SetupScreen'
import type { Preset } from './screens/SetupScreen'
import { ReadyScreen } from './screens/ReadyScreen'
import { PlayScreen } from './screens/PlayScreen'
import { TurnEndScreen } from './screens/TurnEndScreen'
import { RoundEndScreen } from './screens/RoundEndScreen'
import { EndScreen } from './screens/EndScreen'

const GAME = gameById('guess')
const SAVE_ID = 'guess'

type SetupConfig = ComponentProps<typeof SetupScreen>['config']

const DEFAULT_SETUP: SetupConfig = {
  teamCount: 2,
  teamNames: ['Équipe 1', 'Équipe 2'],
  modes: [...TIMES_UP_MODES],
  turnSeconds: 45,
  cardsPerRound: 30,
  allowSkip: true,
  maxSkips: 2,
  sameDeck: true,
}

export default function GuessGame() {
  useAccent(GAME.accent)
  const navigate = useNavigate()

  const [setup, setSetup] = usePersistentState<SetupConfig>('guess:setup', DEFAULT_SETUP)
  const [categories, setCategories] = usePersistentState<GuessCategory[]>('guess:categories', [])
  const [preset, setPreset] = usePersistentState<Preset>('guess:preset', 'timesup')
  const custom = useCustomContent<GuessCard>('guess:custom')

  const [state, setState] = useState<GuessState | null>(null)
  const [resumable, setResumable] = useState<GuessState | null>(() =>
    readGameSave<GuessState>(SAVE_ID),
  )
  const [confirmQuit, setConfirmQuit] = useState(false)

  const finished = state?.phase === 'end'
  useGameSave(SAVE_ID, state, finished)
  useWakeLock(state !== null && !finished)

  const dispatch = useCallback((action: GuessAction) => {
    setState((current) => (current ? guessReducer(current, action) : current))
  }, [])

  const startGame = useCallback(() => {
    const pool = buildPool(filterCards(categories, custom.items), setup.modes)
    if (setup.modes.length === 0 || pool.length === 0) return
    const teams = setup.teamNames.slice(0, setup.teamCount).map((name, index) => ({
      id: `team-${index}`,
      name: name.trim() || `Équipe ${index + 1}`,
      color: TEAM_COLORS[index % TEAM_COLORS.length] as string,
    }))
    setState(
      createGame(
        {
          teams,
          modes: setup.modes,
          turnSeconds: setup.turnSeconds,
          cardsPerRound: setup.cardsPerRound,
          allowSkip: setup.allowSkip,
          maxSkips: setup.maxSkips,
          sameDeck: setup.sameDeck,
        },
        pool,
      ),
    )
    setResumable(null)
  }, [categories, custom.items, setup])

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
            description={`Manche ${resumable.round + 1} sur ${resumable.config.modes.length}.`}
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
          config={setup}
          onConfigChange={setSetup}
          categories={categories}
          onCategoriesChange={setCategories}
          preset={preset}
          onPresetChange={setPreset}
          custom={custom}
          onStart={startGame}
        />
      </>
    )
  }

  const subtitle = finished
    ? 'Partie terminée'
    : `Manche ${state.round + 1} · ${MODES[currentMode(state)].name}`

  return (
    <>
      <TopBar
        title={GAME.name}
        subtitle={subtitle}
        onBack={() => (finished ? quitToSetup() : setConfirmQuit(true))}
      />

      {state.phase === 'ready' && (
        <ReadyScreen state={state} onStart={() => dispatch({ type: 'startTurn' })} />
      )}

      {state.phase === 'playing' && (
        <PlayScreen
          state={state}
          onFound={() => dispatch({ type: 'found' })}
          onSkip={() => dispatch({ type: 'skip' })}
          onTimeUp={() => dispatch({ type: 'endTurn' })}
        />
      )}

      {state.phase === 'turnEnd' && (
        <TurnEndScreen state={state} onContinue={() => dispatch({ type: 'nextTurn' })} />
      )}

      {state.phase === 'roundEnd' && (
        <RoundEndScreen state={state} onContinue={() => dispatch({ type: 'nextRound' })} />
      )}

      {state.phase === 'end' && (
        <EndScreen state={state} onReplay={startGame} onNewSetup={quitToSetup} />
      )}

      <ConfirmDialog
        open={confirmQuit}
        title="Quitter la partie ?"
        description="Les scores des manches seront perdus."
        confirmLabel="Quitter"
        cancelLabel="Continuer à jouer"
        onConfirm={quitToSetup}
        onCancel={() => setConfirmQuit(false)}
      />
    </>
  )
}
