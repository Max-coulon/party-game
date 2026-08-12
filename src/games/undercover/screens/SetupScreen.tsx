import { PlayerListEditor } from '@/players/PlayerListEditor'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { SegmentedControl } from '@/shared/ui/SegmentedControl'
import { Stepper } from '@/shared/ui/Stepper'
import { Toggle } from '@/shared/ui/Toggle'
import { ChipToggle } from '@/shared/ui/ChipToggle'
import { formatDuration } from '@/shared/lib/format'
import { Screen } from '@/shared/layout/Screen'
import { DISCUSSION_DURATIONS, MIN_PLAYERS, isSetupValid, maxImpostors } from '../engine'
import type { UndercoverRules } from '../engine'
import { ALL_THEMES, THEME_LABELS, countByTheme, pairsForThemes } from '../words'
import type { WordTheme } from '../words'

interface SetupScreenProps {
  names: string[]
  onNamesChange: (names: string[]) => void
  rules: UndercoverRules
  onRulesChange: (rules: UndercoverRules) => void
  themes: WordTheme[]
  onThemesChange: (themes: WordTheme[]) => void
  onStart: () => void
}

export function SetupScreen({
  names,
  onNamesChange,
  rules,
  onRulesChange,
  themes,
  onThemesChange,
  onStart,
}: SetupScreenProps) {
  const impostorBudget = maxImpostors(names.length)
  const poolSize = pairsForThemes(themes).length
  const ready = isSetupValid(names.length, rules) && poolSize > 0

  const setRule = <K extends keyof UndercoverRules>(key: K, value: UndercoverRules[K]) => {
    onRulesChange({ ...rules, [key]: value })
  }

  const toggleTheme = (theme: WordTheme) => {
    onThemesChange(
      themes.includes(theme) ? themes.filter((t) => t !== theme) : [...themes, theme],
    )
  }

  const civilCount = names.length - rules.undercoverCount - rules.mrWhiteCount

  return (
    <Screen
      footer={
        <>
          {!ready && names.length >= MIN_PLAYERS && poolSize === 0 && (
            <p className="text-danger text-center text-xs">Choisis au moins un thème de mots.</p>
          )}
          <Button full disabled={!ready} onClick={onStart}>
            Distribuer les mots
          </Button>
        </>
      }
    >
      <Panel title="Joueurs" hint={names.length > 0 ? `${names.length}` : undefined}>
        <PlayerListEditor names={names} onChange={onNamesChange} minPlayers={MIN_PLAYERS} />
      </Panel>

      <Panel title="Rôles">
        <div className="flex flex-col gap-3">
          <Stepper
            label="Undercover"
            value={rules.undercoverCount}
            min={1}
            max={Math.max(1, impostorBudget - rules.mrWhiteCount)}
            onChange={(value) => setRule('undercoverCount', value)}
          />
          <Stepper
            label="Mr White"
            value={rules.mrWhiteCount}
            min={0}
            max={Math.max(0, impostorBudget - rules.undercoverCount)}
            onChange={(value) => setRule('mrWhiteCount', value)}
          />
          <p className="text-muted border-ink-edge border-t pt-3 text-xs">
            {names.length < MIN_PLAYERS
              ? `Il faut ${MIN_PLAYERS} joueurs minimum.`
              : `${civilCount} civils face à ${rules.undercoverCount + rules.mrWhiteCount} imposteur${
                  rules.undercoverCount + rules.mrWhiteCount > 1 ? 's' : ''
                }. Mr White ne reçoit aucun mot : il doit deviner celui des civils en écoutant.`}
          </p>
        </div>
      </Panel>

      <Panel title="Thèmes des mots" hint={`${poolSize} paires`}>
        <div className="flex flex-wrap gap-2">
          {ALL_THEMES.map((theme) => (
            <ChipToggle
              key={theme}
              label={THEME_LABELS[theme]}
              count={countByTheme(theme)}
              selected={themes.includes(theme)}
              onToggle={() => toggleTheme(theme)}
            />
          ))}
        </div>
        {themes.length === 0 && (
          <p className="text-muted mt-3 text-xs">Aucun thème coché : tous les mots sont en jeu.</p>
        )}
      </Panel>

      <Panel title="Règles">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-muted text-xs">Discussion</span>
            <SegmentedControl
              label="Durée de la discussion"
              columns={5}
              value={rules.discussionSeconds}
              onChange={(value) => setRule('discussionSeconds', value)}
              options={DISCUSSION_DURATIONS.map((seconds) => ({
                value: seconds,
                label: seconds === 0 ? 'Libre' : formatDuration(seconds),
              }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-muted text-xs">Vote</span>
            <SegmentedControl
              label="Mode de vote"
              value={rules.voteMode}
              onChange={(value) => setRule('voteMode', value)}
              options={[
                { value: 'secret', label: 'Secret', hint: 'chacun son tour' },
                { value: 'group', label: 'À main levée', hint: 'un seul écran' },
              ]}
            />
          </div>

          {rules.voteMode === 'secret' && (
            <div className="flex flex-col gap-2">
              <span className="text-muted text-xs">En cas d'égalité</span>
              <SegmentedControl
                label="Règle d'égalité"
                value={rules.tieBreak}
                onChange={(value) => setRule('tieBreak', value)}
                options={[
                  { value: 'revote', label: 'Second tour' },
                  { value: 'random', label: 'Au sort' },
                ]}
              />
            </div>
          )}

          <Toggle
            label="Révéler le rôle des éliminés"
            description="Sinon, on ne saura qu'à la fin de la partie."
            checked={rules.revealRoleOnElimination}
            onChange={(value) => setRule('revealRoleOnElimination', value)}
          />
        </div>
      </Panel>
    </Screen>
  )
}
