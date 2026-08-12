import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface ScreenProps {
  children: ReactNode
  className?: string
  /** Barre d'actions collée en bas, toujours atteignable au pouce. */
  footer?: ReactNode
}

export function Screen({ children, className, footer }: ScreenProps) {
  return (
    <>
      <main className={cn('mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 pb-6', className)}>
        {children}
      </main>
      {footer && (
        <div className="safe-bottom bg-ink/80 border-ink-edge sticky bottom-0 border-t px-4 pt-3 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-md flex-col gap-2">{footer}</div>
        </div>
      )}
    </>
  )
}
