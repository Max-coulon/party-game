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
import { DEFAULT_RULES, activePlayers, createGame, isSetupValid, puantReducer } from './engine'
import type { PuantAction, PuantRules, PuantState } from './engine'
import { SetupScreen } from './screens/SetupScreen'
import { HandScreen } from './screens/HandScreen'
import { DrawScreen } from './screens/DrawScreen'
import { DrawnScreen } from './screens/DrawnScreen'
import { EndScreen } from './screens/EndScreen'

const GAME = gameById('puant')
const SAVE_ID = 'puant'

export default function PuantGame() {
  useAccent(GAME.accent)
  const navigate = useNavigate()

  const [names, setNames] = usePersistentState<string[]>('puant:names', [])
  const [rules, setRules] = usePersistentState<PuantRules>('puant:rules', DEFAULT_RULES)

  const [state, setState] = useState<PuantState | null>(null)
  const [resumable, setResumable] = useState<PuantState | null>(() =>
    readGameSave<PuantState>(SAVE_ID),
  )
  const [confirmQuit, setConfirmQuit] = useState(false)

  const finished = state?.phase === 'end'
  useGameSave(SAVE_ID, state, finished)
  useWakeLock(state !== null && !finished)

  const dispatch = useCallback((action: PuantAction) => {
    setState((current) => (current ? puantReducer(current, action) : current))
  }, [])

  const startGame = useCallback(
    (nextRules: PuantRules) => {
      if (!isSetupValid(names.length)) return
      setState(createGame(names, nextRules))
      setResumable(null)
    },
    [names],
  )

  const quitToSetup = useCallback(() => {
    setState(null)
    setResumable(null)
    clearGameSave(SAVE_ID)
    setConfirmQuit(false)
  }, [])

  // — Reprise d'une partie interrompue ——————————————————————————————
  if (!state && resumable) {
    return (
      <>
        <TopBar title={GAME.name} onBack={() => navigate('/')} />
        <Screen className="justify-center">
          <EmptyState
            title="Une partie est en cours"
            description={`Tour ${resumable.turn}, ${plural(activePlayers(resumable).length, 'joueur')} encore en jeu.`}
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

  // — Configuration ————————————————————————————————————————————————
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

  return (
    <>
      <TopBar
        title={GAME.name}
        subtitle={finished ? 'Partie terminée' : `Tour ${state.turn}`}
        onBack={() => (finished ? quitToSetup() : setConfirmQuit(true))}
      />

      {(state.phase === 'pass' || state.phase === 'hand') && (
        <HandScreen
          state={state}
          onTake={() => dispatch({ type: 'takePhone' })}
          onOpenFan={() => dispatch({ type: 'openFan' })}
        />
      )}

      {state.phase === 'draw' && (
        <DrawScreen
          state={state}
          onDraw={(position) => dispatch({ type: 'drawAt', position })}
        />
      )}

      {state.phase === 'drawn' && (
        <DrawnScreen state={state} onEndTurn={() => dispatch({ type: 'endTurn' })} />
      )}

      {state.phase === 'end' && (
        <EndScreen state={state} onReplay={() => startGame(rules)} onNewSetup={quitToSetup} />
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
