import { useNavigate } from 'react-router-dom'
import { Screen } from '@/shared/layout/Screen'
import { TopBar } from '@/shared/layout/TopBar'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Button } from '@/shared/ui/Button'

export function NotFoundScreen() {
  const navigate = useNavigate()
  return (
    <>
      <TopBar title="Page introuvable" />
      <Screen className="justify-center">
        <EmptyState
          title="Rien à cette adresse"
          description="Le lien mène à un écran qui n'existe pas."
          action={<Button onClick={() => navigate('/')}>Retour aux jeux</Button>}
        />
      </Screen>
    </>
  )
}
