import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { WordCard } from '@/shared/ui/WordCard'
import { cn } from '@/shared/lib/cn'
import { avatarForIndex } from '@/players/roster'
import { currentQuestion } from '../engine'
import type { NheState } from '../engine'
import { INTENSITY_LABELS } from '../questions'

interface QuestionScreenProps {
  state: NheState
  onToggle: (playerIndex: number) => void
  onSelectAll: () => void
  onClear: () => void
  onConfirm: () => void
}

export function QuestionScreen({
  state,
  onToggle,
  onSelectAll,
  onClear,
  onConfirm,
}: QuestionScreenProps) {
  const question = currentQuestion(state)
  if (!question) return null

  const selectedCount = state.selection.filter(Boolean).length
  const allSelected = selectedCount === state.selection.length

  return (
    <Screen
      footer={
        <Button full onClick={onConfirm}>
          {selectedCount === 0 && 'Personne n’a bu'}
          {selectedCount === 1 && 'Valider — 1 boit'}
          {selectedCount > 1 && `Valider — ${selectedCount} boivent`}
        </Button>
      }
    >
      <p className="text-muted px-1 text-xs tracking-[0.2em] uppercase">
        Question {state.index + 1} / {state.deck.length} · {INTENSITY_LABELS[question.intensity]}
      </p>

      <WordCard cardKey={question.id} eyebrow="Je n'ai jamais">
        {question.text}
      </WordCard>

      <div className="flex items-center justify-between px-1">
        <span className="text-muted text-sm">Qui l'a déjà fait ?</span>
        <button
          type="button"
          onClick={allSelected ? onClear : onSelectAll}
          className="text-accent text-sm font-medium"
        >
          {allSelected ? 'Tout décocher' : 'Tout le monde'}
        </button>
      </div>

      <ul className="grid grid-cols-2 gap-2">
        {state.config.players.map((name, index) => {
          const selected = state.selection[index] ?? false
          return (
            <li key={`${name}-${index}`}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onToggle(index)}
                className={cn(
                  'flex min-h-14 w-full items-center gap-2 rounded-2xl px-3 text-left transition-transform active:scale-[0.98]',
                  selected ? 'bg-accent text-ink font-semibold' : 'surface text-chalk',
                )}
              >
                <span aria-hidden className="text-lg">
                  {avatarForIndex(index)}
                </span>
                <span className="truncate">{name}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </Screen>
  )
}
