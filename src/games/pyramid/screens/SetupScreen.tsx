import { PlayerListEditor } from '@/players/PlayerListEditor'
import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { SegmentedControl } from '@/shared/ui/SegmentedControl'
import { plural } from '@/shared/lib/format'
import {
  HAND_SIZE,
  MAX_PLAYERS,
  MIN_PLAYERS,
  ROW_OPTIONS,
  cardsNeeded,
  isSetupValid,
  pyramidCount,
} from '../engine'
import type { PyramidRows, PyramidRules } from '../engine'
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
  const needed = cardsNeeded(names.length, rules)

  return (
    <Screen
      footer={
        <>
          {names.length >= MIN_PLAYERS && !ready && (
            <p className="text-danger text-center text-xs text-balance">
              {needed} cartes nécessaires, {rules.deckSize} dans le paquet. Réduis la pyramide, ou
              prends le jeu de 52.
            </p>
          )}
          <Button full disabled={!ready} onClick={onStart}>
            Distribuer
          </Button>
        </>
      }
    >
      <Panel title="Joueurs" hint={names.length > 0 ? `${names.length}` : undefined}>
        <PlayerListEditor names={names} onChange={onNamesChange} minPlayers={MIN_PLAYERS} />
        <p className="text-muted/70 mt-3 text-xs text-balance">
          Deux suffisent. Chacun reçoit {HAND_SIZE} cartes, une par une, avant la pyramide. Au-delà
          de {MAX_PLAYERS} joueurs, le paquet n'y suffit plus.
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
            On commence au sommet : une gorgée. La base en vaut {rules.rows}. Accuser un menteur
            double la mise.
          </p>
        </div>
      </Panel>

      <Panel title="Le paquet">
        <SegmentedControl<DeckSize>
          label="Jeu de cartes"
          value={rules.deckSize}
          onChange={(deckSize) => onRulesChange({ ...rules, deckSize })}
          options={[
            { value: 52, label: 'Complète', hint: '52 cartes' },
            { value: 32, label: 'Express', hint: '32 cartes' },
          ]}
        />
      </Panel>

      {ready && (
        <p className="text-muted/70 px-1 text-center text-xs text-balance">
          {HAND_SIZE} cartes chacun à deviner — couleur, plus ou moins, inter ou exter, puis le
          signe — ensuite un triangle de {plural(triangle, 'carte')}.
        </p>
      )}
    </Screen>
  )
}
