import { Screen } from '@/shared/layout/Screen'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Panel'
import { useRoster } from '@/players/rosterContext'
import { MAX_NAME_LENGTH } from '@/players/roster'
import { cn } from '@/shared/lib/cn'
import { TEAMS, TEAM_LABELS, isSetupValid } from '../engine'
import type { Team } from '../engine'
import { TEAM_COLORS } from '../palette'

interface SetupScreenProps {
  spymasters: Record<Team, string>
  onChange: (spymasters: Record<Team, string>) => void
  onStart: () => void
}

export function SetupScreen({ spymasters, onChange, onStart }: SetupScreenProps) {
  const { players } = useRoster()
  const ready = isSetupValid(spymasters)

  const set = (team: Team, name: string) => onChange({ ...spymasters, [team]: name })

  return (
    <Screen
      footer={
        <>
          {!ready && (
            <p className="text-muted text-center text-xs">
              Deux chefs de réseau, deux prénoms différents.
            </p>
          )}
          <Button full disabled={!ready} onClick={onStart}>
            Poser la grille
          </Button>
        </>
      }
    >
      {TEAMS.map((team) => {
        const color = TEAM_COLORS[team]
        const taken = spymasters[team === 'rouge' ? 'bleu' : 'rouge'].trim().toLowerCase()

        return (
          <Panel key={team} title={`Chef de réseau ${TEAM_LABELS[team]}`}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-9 w-1.5 shrink-0 rounded-full"
                  style={{ background: color }}
                />
                <input
                  value={spymasters[team]}
                  onChange={(event) => set(team, event.target.value)}
                  maxLength={MAX_NAME_LENGTH}
                  placeholder="Prénom"
                  aria-label={`Chef de réseau ${TEAM_LABELS[team]}`}
                  autoComplete="off"
                  autoCapitalize="words"
                  className="bg-ink border-ink-edge text-chalk placeholder:text-muted/60 min-h-12 flex-1 rounded-2xl border px-4 outline-none focus:border-[var(--accent)]"
                />
              </div>

              {players.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {players.map((player) => {
                    const chosen = spymasters[team].trim() === player.name
                    const disabled = player.name.toLowerCase() === taken
                    return (
                      <li key={player.id}>
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => set(team, player.name)}
                          className={cn(
                            'flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors',
                            chosen
                              ? 'text-ink font-semibold'
                              : 'bg-ink border-ink-edge text-chalk',
                            disabled && 'opacity-30',
                          )}
                          style={chosen ? { background: color, borderColor: color } : undefined}
                        >
                          <span aria-hidden>{player.emoji}</span>
                          {player.name}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </Panel>
        )
      })}

      <Panel title="Comment on joue">
        <ol className="text-muted flex flex-col gap-2.5 text-sm">
          <li>
            <span className="text-chalk font-semibold">Vingt-cinq mots</span> sur la table. Neuf
            appartiennent au camp qui commence, huit à l'autre, sept ne sont personne, et un cache
            la taupe.
          </li>
          <li>
            <span className="text-chalk font-semibold">Le chef de réseau</span> est le seul à voir
            qui est à qui. Il donne un mot et un chiffre — « signal, 3 » — puis se tait.
          </li>
          <li>
            <span className="text-chalk font-semibold">Son équipe</span> touche les cartes qu'elle
            croit siennes. Un agent trouvé, on continue. Un passant ou un adversaire, le tour
            s'arrête.
          </li>
          <li>
            <span className="text-chalk font-semibold">La taupe</span> met fin à la partie sur le
            champ, et l'autre camp gagne. Sinon, le premier réseau complet l'emporte.
          </li>
        </ol>
      </Panel>

      <p className="text-muted/70 px-1 text-center text-xs text-balance">
        Le téléphone reste au milieu de la table pendant les propositions, et ne part dans les mains
        d'un chef de réseau que le temps de préparer son indice.
      </p>
    </Screen>
  )
}
