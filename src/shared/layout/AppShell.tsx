import { useLayoutEffect } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'

export function AppShell() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  // Le routeur ne touche pas au défilement : sans ça, on ouvre un jeu depuis le
  // bas du menu et on arrive au milieu de son écran. Sur POP en revanche, on
  // laisse le navigateur remettre la page où le joueur l'avait laissée.
  useLayoutEffect(() => {
    if (navigationType === 'POP') return
    window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return (
    <div className="flex min-h-dvh flex-col">
      <Outlet />
    </div>
  )
}
