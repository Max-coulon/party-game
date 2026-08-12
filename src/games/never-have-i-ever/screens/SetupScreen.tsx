import { useState } from 'react'
import type { FormEvent } from 'react'
import { PlayerListEditor } from '@/players/PlayerListEditor'
import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { ChipToggle } from '@/shared/ui/ChipToggle'
import { Panel } from '@/shared/ui/Panel'
import { SegmentedControl } from '@/shared/ui/SegmentedControl'
import { Toggle } from '@/shared/ui/Toggle'
import { uid } from '@/shared/lib/id'
import type { CustomContent } from '@/shared/hooks/useCustomContent'
import { MIN_PLAYERS, QUESTION_COUNTS } from '../engine'
import type { Intensity, SpecialRules } from '../engine'
import {
  ALL_INTENSITIES,
  ALL_THEMES,
  INTENSITY_HINTS,
  INTENSITY_LABELS,
  THEME_LABELS,
  filterQuestions,
} from '../questions'
import type { NheQuestion, NheTheme } from '../questions'

interface SetupScreenProps {
  names: string[]
  onNamesChange: (names: string[]) => void
  intensities: Intensity[]
  onIntensitiesChange: (intensities: Intensity[]) => void
  themes: NheTheme[]
  onThemesChange: (themes: NheTheme[]) => void
  questionCount: number
  onQuestionCountChange: (count: number) => void
  rules: SpecialRules
  onRulesChange: (rules: SpecialRules) => void
  custom: CustomContent<NheQuestion>
  onStart: () => void
}

export function SetupScreen({
  names,
  onNamesChange,
  intensities,
  onIntensitiesChange,
  themes,
  onThemesChange,
  questionCount,
  onQuestionCountChange,
  rules,
  onRulesChange,
  custom,
  onStart,
}: SetupScreenProps) {
  const [draft, setDraft] = useState('')
  const [draftIntensity, setDraftIntensity] = useState<Intensity>('soft')

  const pool = filterQuestions(intensities, themes, custom.items)
  const ready = names.length >= MIN_PLAYERS && intensities.length > 0 && pool.length > 0

  const toggle = <T,>(list: T[], value: T, onChange: (next: T[]) => void) => {
    onChange(list.includes(value) ? list.filter((item) => item !== value) : [...list, value])
  }

  const addCustom = (event: FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (text.length === 0) return
    custom.add({
      id: uid('nhe-custom'),
      text: text.replace(/^je n['’]ai jamais\s*/i, ''),
      intensity: draftIntensity,
      theme: 'general',
    })
    setDraft('')
  }

  return (
    <Screen
      footer={
        <>
          {intensities.length === 0 && (
            <p className="text-danger text-center text-xs">Choisis au moins une intensité.</p>
          )}
          <Button full disabled={!ready} onClick={onStart}>
            Lancer — {Math.min(questionCount, pool.length)} questions
          </Button>
        </>
      }
    >
      <Panel title="Joueurs" hint={names.length > 0 ? `${names.length}` : undefined}>
        <PlayerListEditor names={names} onChange={onNamesChange} minPlayers={MIN_PLAYERS} />
      </Panel>

      <Panel title="Intensité">
        <div className="flex flex-wrap gap-2">
          {ALL_INTENSITIES.map((intensity) => (
            <ChipToggle
              key={intensity}
              label={`${INTENSITY_LABELS[intensity]} · ${INTENSITY_HINTS[intensity]}`}
              selected={intensities.includes(intensity)}
              onToggle={() => toggle(intensities, intensity, onIntensitiesChange)}
            />
          ))}
        </div>
      </Panel>

      <Panel title="Thèmes" hint={`${pool.length} questions`}>
        <div className="flex flex-wrap gap-2">
          {ALL_THEMES.map((theme) => (
            <ChipToggle
              key={theme}
              label={THEME_LABELS[theme]}
              selected={themes.includes(theme)}
              onToggle={() => toggle(themes, theme, onThemesChange)}
            />
          ))}
        </div>
        {themes.length === 0 && (
          <p className="text-muted mt-3 text-xs">Aucun thème coché : tous les thèmes sont en jeu.</p>
        )}
      </Panel>

      <Panel title="Longueur">
        <SegmentedControl
          label="Nombre de questions"
          value={questionCount}
          onChange={onQuestionCountChange}
          options={QUESTION_COUNTS.map((count) => ({ value: count, label: String(count) }))}
        />
      </Panel>

      <Panel title="Règles spéciales">
        <Toggle
          label="Cavalier seul"
          description="Seul à boire : la dose est doublée."
          checked={rules.loneWolf}
          onChange={(value) => onRulesChange({ ...rules, loneWolf: value })}
        />
        <Toggle
          label="Le survivant"
          description="Seul à ne pas boire : il boit double, il rate trop de choses."
          checked={rules.survivor}
          onChange={(value) => onRulesChange({ ...rules, survivor: value })}
        />
      </Panel>

      <Panel title="Vos questions" hint={custom.items.length > 0 ? `${custom.items.length}` : undefined}>
        <form onSubmit={addCustom} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="…dansé sur une table"
              aria-label="Nouvelle question"
              maxLength={120}
              className="bg-ink border-ink-edge text-chalk placeholder:text-muted/60 min-h-11 flex-1 rounded-xl border px-3 text-sm outline-none focus:border-[var(--accent)]"
            />
            <Button type="submit" size="sm" disabled={draft.trim().length === 0}>
              Ajouter
            </Button>
          </div>
          <SegmentedControl
            label="Intensité de la question"
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
            {custom.items.map((question) => (
              <li key={question.id} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-muted flex-1">Je n'ai jamais {question.text}</span>
                <button
                  type="button"
                  onClick={() => custom.remove(question.id)}
                  aria-label={`Supprimer « ${question.text} »`}
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
