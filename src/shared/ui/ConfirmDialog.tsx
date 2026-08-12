import { useEffect } from 'react'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="bg-ink/80 fixed inset-0 z-50 flex items-end justify-center p-4 backdrop-blur-sm sm:items-center"
    >
      <button
        type="button"
        aria-label="Fermer"
        onClick={onCancel}
        className="absolute inset-0 cursor-default"
      />
      <div className="surface animate-rise relative w-full max-w-sm rounded-3xl p-5">
        <h2 className="text-xl">{title}</h2>
        {description && <p className="text-muted mt-2 text-sm text-balance">{description}</p>}
        <div className="mt-5 flex flex-col gap-2">
          <Button variant="danger" size="md" full onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="ghost" size="md" full onClick={onCancel}>
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
