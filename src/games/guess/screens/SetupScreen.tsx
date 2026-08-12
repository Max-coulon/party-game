import { useState } from 'react'
import type { FormEvent } from 'react'
import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { ChipToggle } from '@/shared/ui/ChipToggle'
import { Panel } from '@/shared/ui/Panel'
import { SegmentedControl } from '@/shared/ui/SegmentedControl'
import { Stepper } from '@/shared/ui/Stepper'
import { Toggle } from '@/shared/ui/Toggle'
import { uid } from '@/shared/lib/id'
import type { CustomContent } from '@/shared/hooks/useCustomContent'
import {
  CARDS_PER_ROUND,
  MAX_TEAMS,
  MIN_TEAMS,
  TEAM_COLORS,
  TURN_DURATIONS,
  buildPool,
} from '../engine'
import type { GuessConfig } from '../engine'
import { ALL_CATEGORIES, CATEGORY_LABELS, countByCategory, filterCards } from '../cards'
import type { GuessCard, GuessCategory } from '../cards'
import { ALL_MODES, MODES, TIMES_UP_MODES } from '../modes'
import type { GuessMode } from '../modes'

export type Preset = 'timesup' | 'custom'

interface SetupScreenProps {
  config: Omit<GuessConfig, 'teams'> & { teamCount: number; teamNames: string[] }
  onConfigChange: (config: SetupScreenProps['config']) => void
  categories: GuessCategory[]
  onCategoriesChange: (categories: GuessCategory[]) => void
  preset: Preset
  onPresetChange: (preset: Preset) => void
  custom: CustomContent<GuessCard>
  onStart: () => void
}

export function SetupScreen({
  config,
  onConfigChange,
  categories,
  onCategoriesChange,
  preset,
  onPresetChange,
  custom,
  onStart,
}: SetupScreenProps) {
  const [draft, setDraft] = useState('')

  const pool = buildPool(filterCards(categories, custom.items), config.modes)
  const cardsNeeded = config.cardsPerRound > 0 ? config.cardsPerRound : 1
  const ready = config.modes.length > 0 && pool.length >= cardsNeeded

  const set = <K extends keyof SetupScreenProps['config']>(
    key: K,
    value: SetupScreenProps['config'][K],
  ) => onConfigChange({ ...config, [key]: value })

  const applyPreset = (next: Preset) => {
    onPresetChange(next)
    if (next === 'timesup') {
      onConfigChange({ ...config, modes: [...TIMES_UP_MODES], sameDeck: true })
    } else {
      onConfigChange({ ...config, sameDeck: false })
    }
  }

  const toggleMode = (mode: GuessMode) => {
    const next = config.modes.includes(mode)
      ? config.modes.filter((item) => item !== mode)
      : [...config.modes, mode]
    onConfigChange({ ...config, modes: next })
  }

  const setTeamCount = (count: number) => {
    const teamNames = Array.from(
      { length: count },
      (_, index) => config.teamNames[index] ?? `Équipe ${index + 1}`,
    )
    onConfigChange({ ...config, teamCount: count, teamNames })
  }

  const addCustom = (event: FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (text.length === 0) return
    custom.add({ id: uid('guess-custom'), text, category: 'general' })
    setDraft('')
  }

  return (
    <Screen
      footer={
        <>
          {config.modes.length === 0 && (
            <p className="text-danger text-center text-xs">Choisis au moins une manche.</p>
          )}
          {config.modes.length > 0 && pool.length < cardsNeeded && (
            <p className="text-danger text-center text-xs">
              Seulement {pool.length} cartes disponibles pour ces réglages.
            </p>
          )}
          <Button full disabled={!ready} onClick={onStart}>
            Lancer — {config.modes.length} manche{config.modes.length > 1 ? 's' : ''}
          </Button>
        </>
      }
    >
      <Panel title="Format">
        <SegmentedControl<Preset>
          label="Format de partie"
          value={preset}
          onChange={applyPreset}
          options={[
            { value: 'timesup', label: "Time's Up", hint: '3 manches, même paquet' },
            { value: 'custom', label: 'Mix', hint: 'manches au choix' },
          ]}
        />
        <p className="text-muted mt-3 text-xs text-balance">
          {preset === 'timesup'
            ? 'Les mêmes cartes reviennent aux trois manches : description libre, puis un seul mot, puis mime. Plus on avance, moins on a le droit d’en dire.'
            : 'Chaque manche a sa contrainte et son propre paquet.'}
        </p>
      </Panel>

      <Panel title="Équipes">
        <Stepper
          label="Nombre d'équipes"
          value={config.teamCount}
          min={MIN_TEAMS}
          max={MAX_TEAMS}
          onChange={setTeamCount}
        />
        <ul className="mt-3 flex flex-col gap-2">
          {config.teamNames.map((name, index) => (
            <li key={index} className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: TEAM_COLORS[index % TEAM_COLORS.length] }}
              />
              <input
                value={name}
                onChange={(event) => {
                  const teamNames = config.teamNames.map((current, i) =>
                    i === index ? event.target.value.slice(0, 18) : current,
                  )
                  set('teamNames', teamNames)
                }}
                aria-label={`Nom de l'équipe ${index + 1}`}
                className="bg-ink border-ink-edge text-chalk min-h-11 flex-1 rounded-xl border px-3 text-sm outline-none focus:border-[var(--accent)]"
              />
            </li>
          ))}
        </ul>
      </Panel>

      {preset === 'custom' && (
        <Panel title="Manches" hint={`${config.modes.length} sélectionnées`}>
          <div className="flex flex-wrap gap-2">
            {ALL_MODES.map((mode) => (
              <ChipToggle
                key={mode}
                label={MODES[mode].name}
                selected={config.modes.includes(mode)}
                onToggle={() => toggleMode(mode)}
              />
            ))}
          </div>
          {config.modes.length > 0 && (
            <ol className="text-muted mt-3 flex flex-col gap-1 text-xs">
              {config.modes.map((mode, index) => (
                <li key={mode}>
                  Manche {index + 1} — <span className="text-chalk">{MODES[mode].name}</span> :{' '}
                  {MODES[mode].rule}
                </li>
              ))}
            </ol>
          )}
          <div className="border-ink-edge mt-4 border-t pt-3">
            <Toggle
              label="Rejouer le même paquet"
              description="Les cartes de la manche 1 reviennent aux manches suivantes."
              checked={config.sameDeck}
              onChange={(value) => set('sameDeck', value)}
            />
          </div>
        </Panel>
      )}

      <Panel title="Cartes" hint={`${pool.length} disponibles`}>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((category) => (
            <ChipToggle
              key={category}
              label={CATEGORY_LABELS[category]}
              count={countByCategory(category)}
              selected={categories.includes(category)}
              onToggle={() =>
                onCategoriesChange(
                  categories.includes(category)
                    ? categories.filter((item) => item !== category)
                    : [...categories, category],
                )
              }
            />
          ))}
        </div>
        {categories.length === 0 && (
          <p className="text-muted mt-3 text-xs">
            Aucune catégorie cochée : tout le paquet est en jeu.
          </p>
        )}
        {config.modes.some((mode) => MODES[mode].needsTaboo) && (
          <p className="text-muted mt-3 text-xs text-balance">
            La manche « Interdit » ne peut utiliser que les cartes portant des mots interdits.
          </p>
        )}
      </Panel>

      <Panel title="Chrono et paquet">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-muted text-xs">Durée d'un tour</span>
            <SegmentedControl
              label="Durée d'un tour"
              value={config.turnSeconds}
              onChange={(value) => set('turnSeconds', value)}
              options={TURN_DURATIONS.map((seconds) => ({
                value: seconds,
                label: `${seconds} s`,
              }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-muted text-xs">Cartes par manche</span>
            <SegmentedControl
              label="Cartes par manche"
              value={config.cardsPerRound}
              onChange={(value) => set('cardsPerRound', value)}
              options={CARDS_PER_ROUND.map((count) => ({
                value: count,
                label: count === 0 ? 'Tout' : String(count),
              }))}
            />
          </div>

          <Toggle
            label="Autoriser à passer"
            description="Une carte passée revient plus tard dans le paquet."
            checked={config.allowSkip}
            onChange={(value) => set('allowSkip', value)}
          />

          {config.allowSkip && (
            <Stepper
              label="Passes par tour"
              value={config.maxSkips}
              min={0}
              max={5}
              suffix={config.maxSkips === 0 ? '∞' : undefined}
              onChange={(value) => set('maxSkips', value)}
            />
          )}
        </div>
      </Panel>

      <Panel title="Vos cartes" hint={custom.items.length > 0 ? `${custom.items.length}` : undefined}>
        <form onSubmit={addCustom} className="flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Un mot à faire deviner"
            aria-label="Nouvelle carte"
            maxLength={60}
            className="bg-ink border-ink-edge text-chalk placeholder:text-muted/60 min-h-11 flex-1 rounded-xl border px-3 text-sm outline-none focus:border-[var(--accent)]"
          />
          <Button type="submit" size="sm" disabled={draft.trim().length === 0}>
            Ajouter
          </Button>
        </form>
        {custom.items.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {custom.items.map((card) => (
              <li key={card.id}>
                <button
                  type="button"
                  onClick={() => custom.remove(card.id)}
                  aria-label={`Supprimer ${card.text}`}
                  className="bg-ink border-ink-edge text-chalk flex min-h-9 items-center gap-1 rounded-full border pr-2 pl-3 text-sm"
                >
                  {card.text}
                  <span aria-hidden className="text-muted px-1 leading-none">
                    ×
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </Screen>
  )
}
