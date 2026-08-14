import { PlayerListEditor } from '@/players/PlayerListEditor'
import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { SegmentedControl } from '@/shared/ui/SegmentedControl'
import { Stepper } from '@/shared/ui/Stepper'
import { plural } from '@/shared/lib/format'
import { MAX_PLAYERS, MIN_PLAYERS, isSetupValid } from '../engine'
import type { Direction, PuantRules } from '../engine'
import { deckCount } from '../cards'
import type { DeckSize, PairingRule } from '../cards'

interface SetupScreenProps {
  names: string[]
  onNamesChange: (names: string[]) => void
  rules: PuantRules
  onRulesChange: (rules: PuantRules) => void
  onStart: () => void
}

export function SetupScreen({
  names,
  onNamesChange,
  rules,
  onRulesChange,
  onStart,
}: SetupScreenProps) {
  const ready = isSetupValid(names.length)
  const cards = deckCount(rules.deckSize, rules.pairing)
  const perPlayer = names.length > 0 ? Math.floor(cards / names.length) : 0

  return (
    <Screen
      footer={
        <>
          {names.length > MAX_PLAYERS && (
            <p className="text-danger text-center text-xs">
              Au-delà de {MAX_PLAYERS} joueurs, chacun n'a plus que deux cartes : la partie n'a plus
              d'intérêt.
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
          orderable
        />
        <p className="text-muted/70 mt-3 text-xs text-balance">
          L'ordre est celui de la table : chacun pioche chez son voisin. Fais glisser pour le faire
          coller à la vraie table.
        </p>
      </Panel>

      <Panel title="Les paires" hint={`${cards} cartes`}>
        <div className="flex flex-col gap-4">
          <SegmentedControl<PairingRule>
            label="Règle des paires"
            value={rules.pairing}
            onChange={(pairing) => onRulesChange({ ...rules, pairing })}
            options={[
              { value: 'color', label: 'Valeur + couleur', hint: 'la vraie règle' },
              { value: 'rank', label: 'Valeur seule', hint: 'pour les enfants' },
            ]}
          />
          <p className="text-muted text-xs text-balance">
            {rules.pairing === 'color'
              ? 'Le 7 de cœur ne se marie qu’avec le 7 de carreau. Seul le valet de trèfle est retiré du paquet.'
              : 'Deux cartes de même valeur suffisent. Trois valets sont retirés pour que le pique reste seul.'}
          </p>
        </div>
      </Panel>

      <Panel title="La table">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-muted text-xs">Longueur de partie</span>
            <SegmentedControl<DeckSize>
              label="Longueur de partie"
              value={rules.deckSize}
              onChange={(deckSize) => onRulesChange({ ...rules, deckSize })}
              options={[
                { value: 52, label: 'Complète', hint: '52 cartes' },
                { value: 32, label: 'Express', hint: '32 cartes' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-muted text-xs">On pioche chez</span>
            <SegmentedControl<Direction>
              label="Sens de la pioche"
              value={rules.direction}
              onChange={(direction) => onRulesChange({ ...rules, direction })}
              options={[
                { value: 'left', label: 'Le précédent' },
                { value: 'right', label: 'Le suivant' },
              ]}
            />
          </div>

          <Stepper
            label="Gorgées pour le puant"
            value={rules.forfeitSips}
            min={0}
            max={6}
            onChange={(forfeitSips) => onRulesChange({ ...rules, forfeitSips })}
          />
        </div>
      </Panel>

      {ready && (
        <p className="text-muted/70 px-1 text-center text-xs text-balance">
          {plural(perPlayer, 'carte')} chacun à la distribution. Le dernier à tenir le valet de
          pique a perdu.
        </p>
      )}
    </Screen>
  )
}
