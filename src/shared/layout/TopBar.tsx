import type { ReactNode } from 'react'

interface TopBarProps {
  title: string
  subtitle?: string
  onBack?: () => void
  action?: ReactNode
}

export function TopBar({ title, subtitle, onBack, action }: TopBarProps) {
  return (
    <header className="safe-top mx-auto flex w-full max-w-md items-center gap-3 px-4 pb-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Revenir en arrière"
          className="bg-ink-raised border-ink-edge text-chalk -ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg"
        >
          ←
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold">{title}</h1>
        {subtitle && <p className="text-muted truncate text-xs">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}
