import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface ScreenProps {
  children: ReactNode
  className?: string
  /** Barre d'actions collée en bas, toujours atteignable au pouce. */
  footer?: ReactNode
  /**
   * À activer sur un écran sans `TopBar` : c'est elle qui dégage l'encoche
   * d'habitude, et sans elle le contenu passe sous la barre de statut.
   */
  safeTop?: boolean
}

export function Screen({ children, className, footer, safeTop = false }: ScreenProps) {
  return (
    <>
      <main
        className={cn(
          'mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4',
          safeTop && 'safe-page-top',
          // Sans barre d'actions, c'est le contenu lui-même qui doit dégager
          // l'indicateur d'accueil en bas d'écran.
          footer ? 'pb-6' : 'safe-page-bottom',
          className,
        )}
      >
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
