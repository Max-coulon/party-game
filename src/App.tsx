import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from '@/context/PlayerContext';
import { GameMenu } from '@/routes/GameMenu';
import { NeverHaveIEverScreen } from '@/routes/NeverHaveIEverScreen';
import { TruthOrDareScreen } from '@/routes/TruthOrDareScreen';

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
        </Routes>
      </BrowserRouter>
    </PlayerProvider>
  );
}

export default App;
