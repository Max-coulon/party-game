import { useState } from 'react'
import type { FormEvent } from 'react'
import { PlayerListEditor } from '@/players/PlayerListEditor'
import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { ChipToggle } from '@/shared/ui/ChipToggle'
import { Panel } from '@/shared/ui/Panel'
import { SegmentedControl } from '@/shared/ui/SegmentedControl'
import { Stepper } from '@/shared/ui/Stepper'
import { uid } from '@/shared/lib/id'
import type { CustomContent } from '@/shared/hooks/useCustomContent'
import { MIN_PLAYERS, TURN_COUNTS } from '../engine'
import type { SelectionMode, TodConfig } from '../engine'
import {
  ALL_INTENSITIES,
  INTENSITY_HINTS,
  INTENSITY_LABELS,
  TYPE_LABELS,
  filterCards,
  hasBothTypes,
} from '../cards'
import type { TodCard, TodIntensity, TodType } from '../cards'

interface SetupScreenProps {
  names: string[]
  onNamesChange: (names: string[]) => void
  intensities: TodIntensity[]
  onIntensitiesChange: (intensities: TodIntensity[]) => void
  config: Omit<TodConfig, 'players'>
  onConfigChange: (config: Omit<TodConfig, 'players'>) => void
  custom: CustomContent<TodCard>
  onStart: () => void
}

export function SetupScreen({
  names,
  onNamesChange,
  intensities,
  onIntensitiesChange,
  config,
  onConfigChange,
  custom,
  onStart,
}: SetupScreenProps) {
  const [draft, setDraft] = useState('')
  const [draftType, setDraftType] = useState<TodType>('dare')
  const [draftIntensity, setDraftIntensity] = useState<TodIntensity>('soft')

  const pool = filterCards(intensities, custom.items)
  const bothTypes = hasBothTypes(pool)
  const ready = names.length >= MIN_PLAYERS && bothTypes

  const addCustom = (event: FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (text.length === 0) return
    custom.add({ id: uid('tod-custom'), type: draftType, intensity: draftIntensity, text })
    setDraft('')
  }

  return (
    <Screen
      footer={
        <>
          {names.length >= MIN_PLAYERS && !bothTypes && (
            <p className="text-danger text-center text-xs">
              Cette sélection ne contient pas à la fois des actions et des vérités.
            </p>
          )}
          <Button full disabled={!ready} onClick={onStart}>
            Commencer
          </Button>
        </>
      }
    >
      <Panel title="Joueurs" hint={names.length > 0 ? `${names.length}` : undefined}>
        <PlayerListEditor names={names} onChange={onNamesChange} minPlayers={MIN_PLAYERS} />
      </Panel>

      <Panel title="Intensité" hint={`${pool.length} cartes`}>
        <div className="flex flex-wrap gap-2">
          {ALL_INTENSITIES.map((intensity) => (
            <ChipToggle
              key={intensity}
              label={`${INTENSITY_LABELS[intensity]} · ${INTENSITY_HINTS[intensity]}`}
              selected={intensities.includes(intensity)}
              onToggle={() =>
                onIntensitiesChange(
                  intensities.includes(intensity)
                    ? intensities.filter((item) => item !== intensity)
                    : [...intensities, intensity],
                )
              }
            />
          ))}
        </div>
      </Panel>

      <Panel title="Déroulé">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-muted text-xs">Ordre de passage</span>
            <SegmentedControl<SelectionMode>
              label="Ordre de passage"
              value={config.selectionMode}
              onChange={(value) => onConfigChange({ ...config, selectionMode: value })}
              options={[
                { value: 'rotation', label: 'Chacun son tour' },
                { value: 'random', label: 'Au hasard' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-muted text-xs">Nombre de tours</span>
            <SegmentedControl
              label="Nombre de tours"
              value={config.maxTurns}
              onChange={(value) => onConfigChange({ ...config, maxTurns: value })}
              options={TURN_COUNTS.map((count) => ({
                value: count,
                label: count === 0 ? 'Sans fin' : String(count),
              }))}
            />
          </div>

          <Stepper
            label="Gorgées si on refuse"
            value={config.refusalSips}
            min={0}
            max={6}
            onChange={(value) => onConfigChange({ ...config, refusalSips: value })}
          />
        </div>
      </Panel>

      <Panel title="Vos cartes" hint={custom.items.length > 0 ? `${custom.items.length}` : undefined}>
        <form onSubmit={addCustom} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Fais le tour de la table à cloche-pied"
              aria-label="Nouvelle carte"
              maxLength={140}
              className="bg-ink border-ink-edge text-chalk placeholder:text-muted/60 min-h-11 flex-1 rounded-xl border px-3 text-sm outline-none focus:border-[var(--accent)]"
            />
            <Button type="submit" size="sm" disabled={draft.trim().length === 0}>
              Ajouter
            </Button>
          </div>
          <SegmentedControl<TodType>
            label="Type de carte"
            value={draftType}
            onChange={setDraftType}
            options={[
              { value: 'dare', label: TYPE_LABELS.dare },
              { value: 'truth', label: TYPE_LABELS.truth },
            ]}
          />
          <SegmentedControl<TodIntensity>
            label="Intensité de la carte"
            value={draftIntensity}
            onChange={setDraftIntensity}
            options={ALL_INTENSITIES.map((intensity) => ({
              value: intensity,
              label: INTENSITY_LABELS[intensity],
            }))}
          />
        </form>

        {custom.items.length > 0 && (
          <ul className="mt-3 flex flex-col gap-2">
            {custom.items.map((card) => (
              <li key={card.id} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-muted flex-1">
                  <span className="text-accent">{TYPE_LABELS[card.type]}</span> — {card.text}
                </span>
                <button
                  type="button"
                  onClick={() => custom.remove(card.id)}
                  aria-label={`Supprimer « ${card.text} »`}
                  className="text-muted shrink-0 px-1 text-lg leading-none"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </Screen>
  )
}
