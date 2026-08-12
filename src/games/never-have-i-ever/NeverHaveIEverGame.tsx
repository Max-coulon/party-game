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
import { DEFAULT_RULES, MIN_PLAYERS, createGame, nheReducer } from './engine'
import type { Intensity, NheAction, NheState, SpecialRules } from './engine'
import { filterQuestions } from './questions'
import type { NheQuestion, NheTheme } from './questions'
import { SetupScreen } from './screens/SetupScreen'
import { QuestionScreen } from './screens/QuestionScreen'
import { ResultScreen } from './screens/ResultScreen'
import { EndScreen } from './screens/EndScreen'

const GAME = gameById('never-have-i-ever')
const SAVE_ID = 'never-have-i-ever'

export default function NeverHaveIEverGame() {
  useAccent(GAME.accent)
  const navigate = useNavigate()

  const [names, setNames] = usePersistentState<string[]>('nhe:names', [])
  const [intensities, setIntensities] = usePersistentState<Intensity[]>('nhe:intensities', ['soft'])
  const [themes, setThemes] = usePersistentState<NheTheme[]>('nhe:themes', [])
  const [questionCount, setQuestionCount] = usePersistentState<number>('nhe:count', 20)
  const [rules, setRules] = usePersistentState<SpecialRules>('nhe:rules', DEFAULT_RULES)
  const custom = useCustomContent<NheQuestion>('nhe:custom')

  const [state, setState] = useState<NheState | null>(null)
  const [resumable, setResumable] = useState<NheState | null>(() => readGameSave<NheState>(SAVE_ID))
  const [confirmQuit, setConfirmQuit] = useState(false)

  const finished = state?.phase === 'end'
  useGameSave(SAVE_ID, state, finished)
  useWakeLock(state !== null && !finished)

  const dispatch = useCallback((action: NheAction) => {
    setState((current) => (current ? nheReducer(current, action) : current))
  }, [])

  const startGame = useCallback(() => {
    const pool = filterQuestions(intensities, themes, custom.items)
    if (pool.length === 0 || names.length < MIN_PLAYERS) return
    setState(createGame({ players: names, questionCount, rules }, pool))
    setResumable(null)
  }, [intensities, themes, custom.items, names, questionCount, rules])

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
            title="Une série est en cours"
            description={`Question ${resumable.index + 1} sur ${resumable.deck.length}.`}
            action={
              <div className="flex w-full flex-col gap-2">
                <Button full onClick={() => setState(resumable)}>
                  Reprendre
                </Button>
                <Button full variant="ghost" size="md" onClick={quitToSetup}>
                  Nouvelle série
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
          themes={themes}
          onThemesChange={setThemes}
          questionCount={questionCount}
          onQuestionCountChange={setQuestionCount}
          rules={rules}
          onRulesChange={setRules}
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
        subtitle={finished ? 'Série terminée' : `${state.index + 1} / ${state.deck.length}`}
        onBack={() => (finished ? quitToSetup() : setConfirmQuit(true))}
      />

      {state.phase === 'question' && (
        <QuestionScreen
          state={state}
          onToggle={(playerIndex) => dispatch({ type: 'toggleAnswer', playerIndex })}
          onSelectAll={() => dispatch({ type: 'selectAll' })}
          onClear={() => dispatch({ type: 'clearSelection' })}
          onConfirm={() => dispatch({ type: 'confirmAnswers' })}
        />
      )}

      {state.phase === 'result' && (
        <ResultScreen state={state} onNext={() => dispatch({ type: 'nextQuestion' })} />
      )}

      {state.phase === 'end' && (
        <EndScreen state={state} onReplay={startGame} onNewSetup={quitToSetup} />
      )}

      <ConfirmDialog
        open={confirmQuit}
        title="Arrêter la série ?"
        description="Le classement en cours sera perdu."
        confirmLabel="Arrêter"
        cancelLabel="Continuer à jouer"
        onConfirm={quitToSetup}
        onCancel={() => setConfirmQuit(false)}
      />
    </>
  )
}
