import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/shared/layout/AppShell'
import { RosterProvider } from '@/players/RosterProvider'
import { MenuScreen } from './MenuScreen'
import { NotFoundScreen } from './NotFoundScreen'

const UndercoverGame = lazy(() => import('@/games/undercover/UndercoverGame'))
const NeverHaveIEverGame = lazy(() => import('@/games/never-have-i-ever/NeverHaveIEverGame'))
const TruthOrDareGame = lazy(() => import('@/games/truth-or-dare/TruthOrDareGame'))
const GuessGame = lazy(() => import('@/games/guess/GuessGame'))
const FingerPickerGame = lazy(() => import('@/games/finger-picker/FingerPickerGame'))

function Loading() {
  return (
    <div className="text-muted flex min-h-dvh items-center justify-center text-sm">Chargement…</div>
  )
}

export function App() {
  return (
    <RosterProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<MenuScreen />} />
              <Route path="/undercover" element={<UndercoverGame />} />
              <Route path="/je-n-ai-jamais" element={<NeverHaveIEverGame />} />
              <Route path="/action-ou-verite" element={<TruthOrDareGame />} />
              <Route path="/fais-deviner" element={<GuessGame />} />
              <Route path="/tirage" element={<FingerPickerGame />} />
              <Route path="*" element={<NotFoundScreen />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </RosterProvider>
  )
}
