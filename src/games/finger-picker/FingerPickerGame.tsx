import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { gameById } from '@/games/registry'
import { TopBar } from '@/shared/layout/TopBar'
import { useAccent } from '@/shared/layout/useAccent'
import { usePersistentState } from '@/shared/hooks/usePersistentState'
import { useWakeLock } from '@/shared/hooks/useWakeLock'
import { Button } from '@/shared/ui/Button'
import { SegmentedControl } from '@/shared/ui/SegmentedControl'
import { Stepper } from '@/shared/ui/Stepper'
import { cn } from '@/shared/lib/cn'
import { plural } from '@/shared/lib/format'
import {
  COUNTDOWN_SECONDS,
  MAX_TEAMS,
  MIN_FINGERS,
  colorFor,
  pickWinner,
  splitIntoTeams,
  teamOf,
} from './engine'
import type { Finger, FingerMode } from './engine'

const GAME = gameById('finger-picker')

type Status = 'waiting' | 'counting' | 'result'

interface Result {
  fingers: Finger[]
  winnerId: number | null
  teamByFinger: Map<number, number>
  teamCount: number
}

export default function FingerPickerGame() {
  useAccent(GAME.accent)
  useWakeLock(true)
  const navigate = useNavigate()

  const [mode, setMode] = usePersistentState<FingerMode>('finger:mode', 'pick')
  const [teamCount, setTeamCount] = usePersistentState<number>('finger:teams', 2)

  const [fingers, setFingers] = useState<Finger[]>([])
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS)
  const [result, setResult] = useState<Result | null>(null)

  // Le statut se déduit des doigts posés et de la présence d'un tirage : le
  // stocker en plus créerait deux sources de vérité à garder synchronisées.
  const status: Status = result
    ? 'result'
    : fingers.length >= MIN_FINGERS
      ? 'counting'
      : 'waiting'

  // Les positions arrivent à la fréquence du doigt, pas à celle du rendu :
  // on accumule dans une ref et on ne publie qu'une fois par frame.
  const pointersRef = useRef(new Map<number, Finger>())
  const frameRef = useRef<number | null>(null)

  const publish = useCallback(() => {
    if (frameRef.current !== null) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null
      setFingers([...pointersRef.current.values()])
    })
  }, [])

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    },
    [],
  )

  const reset = useCallback(() => {
    setResult(null)
    setSecondsLeft(COUNTDOWN_SECONDS)
  }, [])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (status === 'result') return
    event.currentTarget.setPointerCapture(event.pointerId)
    pointersRef.current.set(event.pointerId, {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    })
    publish()
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const finger = pointersRef.current.get(event.pointerId)
    if (!finger) return
    pointersRef.current.set(event.pointerId, {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    })
    publish()
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.delete(event.pointerId)) return
    publish()
  }

  // Le compte à rebours tourne tant que le statut vaut « counting ». Poser ou
  // retirer un doigt change `fingers.length` : l'effet est relancé et le compte
  // repart de zéro, ce qui laisse aux retardataires le temps de se poser.
  const counting = status === 'counting'
  const fingerCount = fingers.length
  useEffect(() => {
    if (!counting) return

    const deadline = Date.now() + COUNTDOWN_SECONDS * 1000

    const interval = window.setInterval(() => {
      const left = deadline - Date.now()
      if (left > 0) {
        setSecondsLeft(Math.ceil(left / 1000))
        return
      }

      window.clearInterval(interval)
      const current = [...pointersRef.current.values()]
      // Doigts retirés entre deux battements : rien à tirer, on laisse repartir.
      if (current.length < MIN_FINGERS) return

      const ids = current.map((finger) => finger.id)
      const teams = mode === 'teams' ? splitIntoTeams(ids, teamCount) : []
      setResult({
        fingers: current,
        winnerId: mode === 'pick' ? pickWinner(ids) : null,
        teamByFinger: teamOf(teams),
        teamCount: teams.length,
      })
    }, 100)

    return () => {
      window.clearInterval(interval)
      setSecondsLeft(COUNTDOWN_SECONDS)
    }
  }, [counting, fingerCount, mode, teamCount])

  const displayed = status === 'result' && result ? result.fingers : fingers

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar title={GAME.name} onBack={() => navigate('/')} />

      <div className="mx-auto w-full max-w-md px-4">
        <div className="surface flex flex-col gap-3 rounded-3xl p-3">
          <SegmentedControl<FingerMode>
            label="Que faire du tirage"
            value={mode}
            onChange={(value) => {
              setMode(value)
              reset()
            }}
            options={[
              { value: 'pick', label: 'Désigner', hint: 'un seul doigt' },
              { value: 'teams', label: 'Équipes', hint: 'répartir tout le monde' },
            ]}
          />
          {mode === 'teams' && (
            <Stepper
              label="Nombre d'équipes"
              value={teamCount}
              min={2}
              max={MAX_TEAMS}
              onChange={(value) => {
                setTeamCount(value)
                reset()
              }}
            />
          )}
        </div>
      </div>

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onContextMenu={(event) => event.preventDefault()}
        className="relative mt-4 flex-1 touch-none overflow-hidden select-none"
      >
        {displayed.map((finger, index) => {
          const teamIndex = result?.teamByFinger.get(finger.id)
          const color =
            status === 'result' && mode === 'teams' && teamIndex !== undefined
              ? colorFor(teamIndex)
              : colorFor(index)
          const isWinner = result?.winnerId === finger.id
          const dimmed = status === 'result' && mode === 'pick' && !isWinner

          return (
            <div
              key={finger.id}
              aria-hidden
              className={cn(
                'pointer-events-none absolute flex items-center justify-center rounded-full border-4 transition-opacity duration-300',
                dimmed ? 'opacity-20' : 'opacity-100',
              )}
              style={{
                left: finger.x,
                top: finger.y,
                width: isWinner ? 160 : 96,
                height: isWinner ? 160 : 96,
                transform: 'translate(-50%, -50%)',
                borderColor: color,
                backgroundColor: `${color}22`,
                boxShadow: isWinner ? `0 0 3rem ${color}` : undefined,
                transition: 'width 250ms var(--ease-spring), height 250ms var(--ease-spring)',
              }}
            >
              {status === 'result' && mode === 'teams' && teamIndex !== undefined && (
                <span className="font-display text-2xl font-extrabold" style={{ color }}>
                  {teamIndex + 1}
                </span>
              )}
            </div>
          )
        })}

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          {status === 'waiting' && (
            <>
              <p className="font-display text-3xl font-extrabold text-balance">
                Posez vos doigts sur l'écran
              </p>
              <p className="text-muted mt-3 max-w-64 text-sm text-balance">
                {fingers.length === 0
                  ? `${MIN_FINGERS} doigts minimum. Le tirage part tout seul.`
                  : `${fingers.length} doigt${fingers.length > 1 ? 's' : ''} — il en manque ${
                      MIN_FINGERS - fingers.length
                    }.`}
              </p>
            </>
          )}

          {status === 'counting' && (
            <p
              className="font-display text-accent text-[8rem] leading-none font-extrabold tabular-nums"
              aria-live="polite"
            >
              {secondsLeft}
            </p>
          )}

          {status === 'result' && (
            <div className="animate-rise">
              <p className="font-display text-4xl font-extrabold text-balance">
                {mode === 'pick'
                  ? 'Le sort a tranché.'
                  : plural(result?.teamCount ?? 0, 'équipe') + '.'}
              </p>
              <p className="text-muted mt-2 text-sm text-balance">
                {mode === 'pick'
                  ? 'Le doigt encore éclairé, c’est toi.'
                  : 'Chaque doigt porte le numéro de son équipe.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {status === 'result' && (
        <div className="safe-bottom mx-auto w-full max-w-md px-4 pt-3">
          <Button full onClick={reset}>
            Recommencer
          </Button>
        </div>
      )}
    </div>
  )
}
