# Guide d'Intégration des Nouvelles Fonctionnalités

Ce guide explique comment intégrer toutes les nouvelles fonctionnalités dans l'application existante.

## 📋 Table des Matières

1. [Mise à jour de l'écran de configuration](#1-écran-de-configuration)
2. [Mise à jour de l'écran de jeu](#2-écran-de-jeu)
3. [Mise à jour de l'écran de fin](#3-écran-de-fin)
4. [Exemple d'intégration complète](#4-exemple-complet)

---

## 1. Écran de Configuration

### Imports nécessaires

```typescript
import { useNeverHaveIEverGameV2 } from "@/hooks/useNeverHaveIEverGameV2";
import { SpecialRulesConfig } from "@/components/neverHaveIEver/SpecialRulesConfig";
import { ThemeSelector } from "@/components/neverHaveIEver/ThemeSelector";
import { CustomQuestions } from "@/components/neverHaveIEver/CustomQuestions";
import { StatsDisplay } from "@/components/neverHaveIEver/StatsDisplay";
```

### Utilisation du nouveau hook

```typescript
const {
  config,
  customQuestions,
  toggleMode,
  toggleTheme,
  setQuestionCount,
  toggleSpecialRule,
  addCustomQuestion,
  removeCustomQuestion,
  startGame,
  // ... autres propriétés
} = useNeverHaveIEverGameV2();
```

### Ajout des nouveaux composants

```typescript
{
  /* Dans la phase de configuration, ajouter : */
}

{
  /* 1. Sélection des modes (existant, garder tel quel) */
}
<NheModeSelector selectedModes={config.selectedModes} onToggle={toggleMode} />;

{
  /* 2. NOUVEAU : Sélection des thèmes */
}
<ThemeSelector
  selectedThemes={config.selectedThemes}
  onToggleTheme={toggleTheme}
/>;

{
  /* 3. Choix du nombre de questions (existant, adapter) */
}
<NheQuestionCountSelector
  count={config.questionCount}
  totalAvailable={totalAvailableQuestions}
  onSelect={setQuestionCount}
/>;

{
  /* 4. NOUVEAU : Configuration des règles spéciales */
}
<SpecialRulesConfig
  specialRules={config.specialRules}
  onToggleRule={toggleSpecialRule}
/>;

{
  /* 5. NOUVEAU : Questions personnalisées */
}
<CustomQuestions
  customQuestions={customQuestions}
  onAddQuestion={addCustomQuestion}
  onRemoveQuestion={removeCustomQuestion}
/>;

{
  /* 6. NOUVEAU : Affichage des statistiques */
}
<StatsDisplay players={players} />;
```

---

## 2. Écran de Jeu

### Imports nécessaires

```typescript
import { NhePlayerAnswerListV2 } from "@/components/neverHaveIEver/NhePlayerAnswerListV2";
import { ChallengeDisplay } from "@/components/neverHaveIEver/ChallengeDisplay";
import { GameHistory } from "@/components/neverHaveIEver/GameHistory";
```

### Affichage du défi (si actif)

```typescript
{
  /* Après l'affichage de la question */
}
<NheQuestionView
  question={currentQuestion}
  questionNumber={currentQuestionIndex + 1}
  totalQuestions={questions.length}
/>;

{
  /* NOUVEAU : Affichage du défi si présent */
}
{
  currentChallenge && <ChallengeDisplay challenge={currentChallenge} />;
}
```

### Liste des joueurs avec support Mute

```typescript
{
  /* Remplacer NhePlayerAnswerList par NhePlayerAnswerListV2 */
}
<NhePlayerAnswerListV2
  players={players}
  muteRuleActive={config.specialRules.muteRule}
  onSubmit={(selectedIds, mutedIds) => {
    submitAnswers(selectedIds, mutedIds);
  }}
  onNext={nextQuestion}
/>;
```

### Bouton d'historique flottant

```typescript
{
  /* Ajouter en fin de composant, en dehors des autres conteneurs */
}
<GameHistory history={history} players={players} />;
```

---

## 3. Écran de Fin

### Imports nécessaires

```typescript
import { NheSummaryV2 } from "@/components/neverHaveIEver/NheSummaryV2";
```

### Utilisation

```typescript
{
  /* Remplacer NheSummary par NheSummaryV2 */
}
<NheSummaryV2
  players={players}
  onRestart={restartGame}
  onReplayWithSameSettings={replayWithSameSettings}
  onBackToMenu={() => navigate("/menu")}
/>;
```

---

## 4. Exemple Complet

### Structure de NeverHaveIEverScreen.tsx (version V2)

```typescript
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayers } from "@/context/PlayerContext";
import { useNeverHaveIEverGameV2 } from "@/hooks/useNeverHaveIEverGameV2";
import { getQuestionsByModes } from "@/data/neverHaveIEverQuestions";

// Layout
import { TopBar } from "@/components/layout/TopBar";
import { PageContainer } from "@/components/layout/PageContainer";

// Composants de configuration
import { NheModeSelector } from "@/components/neverHaveIEver/NheModeSelector";
import { ThemeSelector } from "@/components/neverHaveIEver/ThemeSelector";
import { NheQuestionCountSelector } from "@/components/neverHaveIEver/NheQuestionCountSelector";
import { SpecialRulesConfig } from "@/components/neverHaveIEver/SpecialRulesConfig";
import { CustomQuestions } from "@/components/neverHaveIEver/CustomQuestions";
import { StatsDisplay } from "@/components/neverHaveIEver/StatsDisplay";

// Composants de jeu
import { NheQuestionView } from "@/components/neverHaveIEver/NheQuestionView";
import { ChallengeDisplay } from "@/components/neverHaveIEver/ChallengeDisplay";
import { NhePlayerAnswerListV2 } from "@/components/neverHaveIEver/NhePlayerAnswerListV2";
import { GameHistory } from "@/components/neverHaveIEver/GameHistory";

// Composants de fin
import { NheSummaryV2 } from "@/components/neverHaveIEver/NheSummaryV2";

export const NeverHaveIEverScreenV2: React.FC = () => {
  const navigate = useNavigate();
  const { players: globalPlayers } = usePlayers();

  const {
    config,
    currentQuestionIndex,
    currentQuestion,
    currentChallenge,
    questions,
    isGameStarted,
    isGameFinished,
    players,
    history,
    customQuestions,
    toggleMode,
    toggleTheme,
    setQuestionCount,
    toggleSpecialRule,
    addCustomQuestion,
    removeCustomQuestion,
    startGame,
    submitAnswers,
    nextQuestion,
    restartGame,
    replayWithSameSettings,
    resetGame,
  } = useNeverHaveIEverGameV2();

  // Calcul du nombre total de questions disponibles
  const totalAvailableQuestions = useMemo(() => {
    let questions = getQuestionsByModes(config.selectedModes);

    if (config.selectedThemes.length > 0) {
      questions = questions.filter(
        (q) => q.theme && config.selectedThemes.includes(q.theme)
      );
    }

    questions = [...questions, ...customQuestions];
    return questions.length;
  }, [config.selectedModes, config.selectedThemes, customQuestions]);

  const handleStartGame = () => {
    if (globalPlayers.length === 0) {
      alert("Ajoutez au moins un joueur !");
      return;
    }
    startGame(globalPlayers);
  };

  const handleBackToMenu = () => {
    resetGame();
    navigate("/menu");
  };

  return (
    <PageContainer>
      <TopBar
        title="Je n'ai jamais"
        onBack={isGameStarted ? resetGame : () => navigate("/menu")}
        showBackButton={true}
      />

      <div className="p-6 space-y-6">
        {/* PHASE DE CONFIGURATION */}
        {!isGameStarted && !isGameFinished && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-white text-center">
              Configuration de la partie
            </h2>

            {/* Statistiques */}
            <StatsDisplay players={globalPlayers} />

            {/* Sélection des modes */}
            <NheModeSelector
              selectedModes={config.selectedModes}
              onToggle={toggleMode}
            />

            {/* Sélection des thèmes */}
            <ThemeSelector
              selectedThemes={config.selectedThemes}
              onToggleTheme={toggleTheme}
            />

            {/* Nombre de questions */}
            <NheQuestionCountSelector
              count={config.questionCount}
              totalAvailable={totalAvailableQuestions}
              onSelect={setQuestionCount}
            />

            {/* Règles spéciales */}
            <SpecialRulesConfig
              specialRules={config.specialRules}
              onToggleRule={toggleSpecialRule}
            />

            {/* Questions personnalisées */}
            <CustomQuestions
              customQuestions={customQuestions}
              onAddQuestion={addCustomQuestion}
              onRemoveQuestion={removeCustomQuestion}
            />

            {/* Bouton de démarrage */}
            <button
              onClick={handleStartGame}
              className="w-full py-5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xl font-bold rounded-2xl shadow-2xl"
            >
              Commencer la partie
            </button>
          </div>
        )}

        {/* PHASE DE JEU */}
        {isGameStarted && !isGameFinished && currentQuestion && (
          <div className="space-y-6">
            {/* Question */}
            <NheQuestionView
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
            />

            {/* Défi (si actif) */}
            {currentChallenge && (
              <ChallengeDisplay challenge={currentChallenge} />
            )}

            {/* Liste des joueurs */}
            <NhePlayerAnswerListV2
              players={players}
              muteRuleActive={config.specialRules.muteRule}
              onSubmit={submitAnswers}
              onNext={nextQuestion}
            />

            {/* Historique flottant */}
            <GameHistory history={history} players={players} />
          </div>
        )}

        {/* PHASE DE FIN */}
        {isGameFinished && (
          <NheSummaryV2
            players={players}
            onRestart={restartGame}
            onReplayWithSameSettings={replayWithSameSettings}
            onBackToMenu={handleBackToMenu}
          />
        )}
      </div>
    </PageContainer>
  );
};
```

---

## 5. Points d'Attention

### ✅ À faire

1. **Tester progressivement** : Intégrer les composants un par un
2. **Conserver les anciens composants** : Ne pas supprimer l'ancien code tout de suite
3. **Vérifier les imports** : S'assurer que tous les chemins sont corrects
4. **Tester avec différentes configurations** : Modes, thèmes, règles spéciales
5. **Vérifier le localStorage** : Les stats fonctionnent correctement

### ❌ À éviter

1. **Ne pas mixer** l'ancien et le nouveau hook dans le même composant
2. **Ne pas oublier** d'enregistrer les stats en fin de partie
3. **Ne pas supprimer** les questions custom après chaque partie (elles sont temporaires par design)

---

## 6. Migration Progressive

### Option 1 : Créer une nouvelle route

```typescript
// Dans App.tsx
<Route path="/game/never-have-i-ever-v2" element={<NeverHaveIEverScreenV2 />} />
```

### Option 2 : Remplacer directement

Remplacer le contenu de `NeverHaveIEverScreen.tsx` par la nouvelle version.

### Option 3 : Feature flag

```typescript
const USE_V2 = true; // ou depuis un contexte/config

return USE_V2 ? <NeverHaveIEverScreenV2 /> : <NeverHaveIEverScreen />;
```

---

## 7. Checklist de Migration

- [ ] Hook V2 importé et utilisé
- [ ] SpecialRulesConfig ajouté
- [ ] ThemeSelector ajouté
- [ ] CustomQuestions ajouté
- [ ] StatsDisplay ajouté
- [ ] ChallengeDisplay conditionnel ajouté
- [ ] NhePlayerAnswerListV2 avec support Mute
- [ ] GameHistory flottant ajouté
- [ ] NheSummaryV2 avec options de rejeu
- [ ] Stats enregistrées en fin de partie
- [ ] Tests effectués avec toutes les combinaisons

---

## 8. Ressources Supplémentaires

- **IMPROVEMENTS.md** : Liste complète des fonctionnalités
- **questionsWithThemes.example.ts** : Exemples de questions avec thèmes
- **Architecture existante préservée** : Tous les anciens composants fonctionnent toujours

## 9. Support

En cas de problème :

1. Vérifier que tous les imports sont corrects
2. S'assurer que les types sont à jour
3. Consulter la console pour les erreurs
4. Tester avec le hook V1 pour identifier les différences
