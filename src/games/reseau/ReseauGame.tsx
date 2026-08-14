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
import { TEAM_LABELS, createGame, isSetupValid, remaining, reseauReducer } from './engine'
import type { ReseauAction, ReseauState, Team } from './engine'
import { TEAM_COLORS } from './palette'
import { RESEAU_WORDS } from './words'
import { SetupScreen } from './screens/SetupScreen'
import { BriefScreen } from './screens/BriefScreen'
import { ClueScreen } from './screens/ClueScreen'
import { BoardScreen } from './screens/BoardScreen'
import { EndScreen } from './screens/EndScreen'

const GAME = gameById('reseau')
const SAVE_ID = 'reseau'
const EMPTY_SPYMASTERS: Record<Team, string> = { rouge: '', bleu: '' }

export default function ReseauGame() {
  const navigate = useNavigate()

  const [spymasters, setSpymasters] = usePersistentState<Record<Team, string>>(
    'reseau:spymasters',
    EMPTY_SPYMASTERS,
  )

  const [state, setState] = useState<ReseauState | null>(null)
  const [resumable, setResumable] = useState<ReseauState | null>(() =>
    readGameSave<ReseauState>(SAVE_ID),
  )
  const [confirmQuit, setConfirmQuit] = useState(false)

  const finished = state?.phase === 'end'

  // L'accent suit le camp qui a la main, et la nappe de lumière du fond avec
  // lui : la couleur dit à qui est le tour avant même qu'on lise l'écran.
  const focus: Team | null = state ? (finished && state.winner ? state.winner : state.turn) : null
  useAccent(focus ? TEAM_COLORS[focus] : GAME.accent)

  useGameSave(SAVE_ID, state, Boolean(finished))
  useWakeLock(state !== null && !finished)

  const dispatch = useCallback((action: ReseauAction) => {
    setState((current) => (current ? reseauReducer(current, action) : current))
  }, [])

  const startGame = useCallback(() => {
    if (!isSetupValid(spymasters)) return
    setState(createGame({ rouge: spymasters.rouge.trim(), bleu: spymasters.bleu.trim() }, RESEAU_WORDS))
    setResumable(null)
  }, [spymasters])

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
            title="Une grille est en cours"
            description={`Tour ${resumable.round} — ${TEAM_LABELS.rouge} ${remaining(resumable, 'rouge')}, ${TEAM_LABELS.bleu} ${remaining(resumable, 'bleu')}.`}
            action={
              <div className="flex w-full flex-col gap-2">
                <Button full onClick={() => setState(resumable)}>
                  Reprendre
                </Button>
                <Button full variant="ghost" size="md" onClick={quitToSetup}>
                  Nouvelle grille
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
        <SetupScreen spymasters={spymasters} onChange={setSpymasters} onStart={startGame} />
      </>
    )
  }

  return (
    <>
      <TopBar
        title={GAME.name}
        subtitle={finished ? 'Partie terminée' : `Tour ${state.round} · ${TEAM_LABELS[state.turn]}`}
        onBack={() => (finished ? quitToSetup() : setConfirmQuit(true))}
      />

      {state.phase === 'brief' && (
        <BriefScreen state={state} onTake={() => dispatch({ type: 'takePhone' })} />
      )}

      {state.phase === 'clue' && (
        <ClueScreen
          state={state}
          onSubmit={(word, count) => dispatch({ type: 'submitClue', word, count })}
        />
      )}

      {(state.phase === 'guess' || state.phase === 'turnEnd') && (
        <BoardScreen
          state={state}
          onSelect={(index) => dispatch({ type: 'selectCard', index })}
          onConfirm={() => dispatch({ type: 'confirmSelection' })}
          onPass={() => dispatch({ type: 'pass' })}
          onNextTurn={() => dispatch({ type: 'nextTurn' })}
        />
      )}

      {state.phase === 'end' && (
        <EndScreen state={state} onReplay={startGame} onNewSetup={quitToSetup} />
      )}

      <ConfirmDialog
        open={confirmQuit}
        title="Quitter la partie ?"
        description="La grille et les deux réseaux seront perdus."
        confirmLabel="Quitter"
        cancelLabel="Continuer à jouer"
        onConfirm={quitToSetup}
        onCancel={() => setConfirmQuit(false)}
      />
    </>
  )
}
