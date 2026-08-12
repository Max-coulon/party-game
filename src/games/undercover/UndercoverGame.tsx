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
import { DEFAULT_RULES, createGame, isSetupValid, undercoverReducer } from './engine'
import type { UndercoverAction, UndercoverRules, UndercoverState } from './engine'
import { drawPair, pairsForThemes } from './words'
import type { WordTheme } from './words'
import { SetupScreen } from './screens/SetupScreen'
import { RevealScreen } from './screens/RevealScreen'
import { DiscussionScreen } from './screens/DiscussionScreen'
import { VoteScreen } from './screens/VoteScreen'
import { VoteResultScreen } from './screens/VoteResultScreen'
import { MrWhiteScreen } from './screens/MrWhiteScreen'
import { EndScreen } from './screens/EndScreen'

const GAME = gameById('undercover')
const SAVE_ID = 'undercover'
/** Mémorise les paires déjà sorties pour ne pas rejouer deux fois la même. */
const USED_PAIRS_KEY = 'undercover:used-pairs'
const HISTORY_LIMIT = 120

export default function UndercoverGame() {
  useAccent(GAME.accent)
  const navigate = useNavigate()

  const [names, setNames] = usePersistentState<string[]>('undercover:names', [])
  const [rules, setRules] = usePersistentState<UndercoverRules>('undercover:rules', DEFAULT_RULES)
  const [themes, setThemes] = usePersistentState<WordTheme[]>('undercover:themes', [])
  const [usedPairIds, setUsedPairIds] = usePersistentState<string[]>(USED_PAIRS_KEY, [])

  const [state, setState] = useState<UndercoverState | null>(null)
  const [resumable, setResumable] = useState<UndercoverState | null>(() =>
    readGameSave<UndercoverState>(SAVE_ID),
  )
  const [confirmQuit, setConfirmQuit] = useState(false)

  const finished = state?.phase === 'end'
  useGameSave(SAVE_ID, state, finished)
  useWakeLock(state !== null && !finished)

  const dispatch = useCallback((action: UndercoverAction) => {
    setState((current) => (current ? undercoverReducer(current, action) : current))
  }, [])

  const startGame = useCallback(
    (nextRules: UndercoverRules) => {
      const pool = pairsForThemes(themes)
      const pair = drawPair(pool, usedPairIds)
      if (!pair) return
      setUsedPairIds((current) => [...current, pair.id].slice(-HISTORY_LIMIT))
      setState(createGame(names, pair, nextRules))
      setResumable(null)
    },
    [names, themes, usedPairIds, setUsedPairIds],
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
            description={`Manche ${resumable.round}, ${resumable.players.filter((p) => !p.eliminated).length} joueurs encore en jeu.`}
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
          themes={themes}
          onThemesChange={setThemes}
          onStart={() => startGame(rules)}
        />
      </>
    )
  }

  const subtitle = finished ? 'Partie terminée' : `Manche ${state.round}`

  return (
    <>
      <TopBar
        title={GAME.name}
        subtitle={subtitle}
        onBack={() => (finished ? quitToSetup() : setConfirmQuit(true))}
      />

      {state.phase === 'reveal' && (
        <RevealScreen state={state} onNext={() => dispatch({ type: 'nextReveal' })} />
      )}

      {state.phase === 'discussion' && (
        <DiscussionScreen state={state} onVote={() => dispatch({ type: 'startVote' })} />
      )}

      {state.phase === 'vote' && (
        <VoteScreen
          state={state}
          onCastVote={(voterId, targetId) => dispatch({ type: 'castVote', voterId, targetId })}
          onGroupVote={(targetId) => dispatch({ type: 'groupVote', targetId })}
          onUndo={() => dispatch({ type: 'undoVote' })}
        />
      )}

      {state.phase === 'voteResult' && (
        <VoteResultScreen
          state={state}
          onContinue={() => dispatch({ type: 'confirmElimination' })}
        />
      )}

      {state.phase === 'mrWhiteGuess' && (
        <MrWhiteScreen
          state={state}
          onGuess={(guess) => dispatch({ type: 'submitMrWhiteGuess', guess })}
          onContinue={() => dispatch({ type: 'continueAfterGuess' })}
        />
      )}

      {state.phase === 'end' && (
        <EndScreen
          state={state}
          onReplay={() => {
            if (isSetupValid(names.length, rules)) startGame(rules)
          }}
          onNewSetup={quitToSetup}
        />
      )}

      <ConfirmDialog
        open={confirmQuit}
        title="Quitter la partie ?"
        description="Les rôles sont déjà distribués. Tout sera perdu."
        confirmLabel="Quitter"
        cancelLabel="Continuer à jouer"
        onConfirm={quitToSetup}
        onCancel={() => setConfirmQuit(false)}
      />
    </>
  )
}
