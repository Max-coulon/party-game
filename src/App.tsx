import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from '@/context/PlayerContext';
import { GameMenu } from '@/routes/GameMenu';
import { NeverHaveIEverScreen } from '@/routes/NeverHaveIEverScreen';
import { TruthOrDareScreen } from '@/routes/TruthOrDareScreen';
import { FingerChooserScreen } from '@/routes/FingerChooserScreen';
import { TimesUpScreen } from '@/routes/TimesUpScreen';
import PartyGuessScreen from '@/routes/PartyGuessScreen';
import UndercoverScreen from '@/routes/UndercoverScreen';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';

/**
 * Composant principal de l'application
 * Configure le routing et les providers globaux
 */
function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameMenu />} />
          <Route path="/game/never-have-i-ever" element={<NeverHaveIEverScreen />} />
          <Route path="/game/truth-or-dare" element={<TruthOrDareScreen />} />
          <Route path="/game/finger-chooser" element={<FingerChooserScreen />} />
          <Route path="/game/times-up" element={<TimesUpScreen />} />
          <Route path="/game/party-guess" element={<PartyGuessScreen />} />
          <Route path="/game/undercover" element={<UndercoverScreen />} />
        </Routes>
        <PwaInstallPrompt />
      </BrowserRouter>
    </PlayerProvider>
  );
}

export default App;
