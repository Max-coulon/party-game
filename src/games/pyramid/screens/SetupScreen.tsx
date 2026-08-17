import { PlayerListEditor } from '@/players/PlayerListEditor'
import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { SegmentedControl } from '@/shared/ui/SegmentedControl'
import { Toggle } from '@/shared/ui/Toggle'
import { plural } from '@/shared/lib/format'
import { MAX_PLAYERS, MIN_PLAYERS, ROW_OPTIONS, isSetupValid, pyramidCount } from '../engine'
import type { PyramidRows, PyramidRules } from '../engine'
import { deckCount } from '../cards'
import type { DeckSize } from '../cards'

interface SetupScreenProps {
  names: string[]
  onNamesChange: (names: string[]) => void
  rules: PyramidRules
  onRulesChange: (rules: PyramidRules) => void
  onStart: () => void
}

export function SetupScreen({
  names,
  onNamesChange,
  rules,
  onRulesChange,
  onStart,
}: SetupScreenProps) {
  const ready = isSetupValid(names.length, rules)
  const triangle = pyramidCount(rules.rows)
  const rest = deckCount(rules.deckSize) - triangle
  const perPlayer = names.length > 0 ? Math.floor(rest / names.length) : 0
  const leftover = names.length > 0 ? rest % names.length : 0

  return (
    <Screen
      footer={
        <>
          {names.length >= MIN_PLAYERS && !ready && (
            <p className="text-danger text-center text-xs text-balance">
              Trop de joueurs pour ce triangle : il ne resterait plus une carte chacun. Réduis la
              pyramide, ou prends le jeu de 52.
            </p>
          )}
          <Button full disabled={!ready} onClick={onStart}>
            Distribuer
          </Button>
        </>
      }
    >
      <Panel title="Joueurs" hint={names.length > 0 ? `${names.length}` : undefined}>
        <PlayerListEditor
          names={names}
          onChange={onNamesChange}
          minPlayers={MIN_PLAYERS}
        />
        <p className="text-muted/70 mt-3 text-xs text-balance">
          Deux suffisent. Au-delà de {MAX_PLAYERS}, plus personne n'a de main.
        </p>
      </Panel>

      <Panel title="La pyramide" hint={`${triangle} cartes`}>
        <div className="flex flex-col gap-4">
          <SegmentedControl<PyramidRows>
            label="Hauteur"
            value={rules.rows}
            onChange={(rows) => onRulesChange({ ...rules, rows })}
            options={ROW_OPTIONS.map((rows) => ({
              value: rows,
              label: `${rows}`,
              hint: plural(pyramidCount(rows), 'carte'),
            }))}
          />
          <p className="text-muted text-xs text-balance">
            On commence au sommet : une gorgée. La base en vaut {rules.rows}.
          </p>
        </div>
      </Panel>

      <Panel title="Le paquet">
        <div className="flex flex-col gap-4">
          <SegmentedControl<DeckSize>
            label="Jeu de cartes"
            value={rules.deckSize}
            onChange={(deckSize) => onRulesChange({ ...rules, deckSize })}
            options={[
              { value: 52, label: 'Complète', hint: '52 cartes' },
              { value: 32, label: 'Express', hint: '32 cartes' },
            ]}
          />
          <Toggle
            label="Les cartes gardées se paient"
            description="À la fin, une gorgée par carte encore en main."
            checked={rules.leftoverSips}
            onChange={(leftoverSips) => onRulesChange({ ...rules, leftoverSips })}
          />
        </div>
      </Panel>

      {ready && (
        <p className="text-muted/70 px-1 text-center text-xs text-balance">
          {plural(perPlayer, 'carte')} chacun
          {leftover > 0 ? `, ${plural(leftover, 'joueur')} en auront une de plus` : ''}. Le
          téléphone tourne le temps de voir sa main, puis il reste au centre.
        </p>
      )}
    </Screen>
  )
}
