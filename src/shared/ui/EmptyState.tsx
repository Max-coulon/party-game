import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="surface rounded-3xl px-6 py-10 text-center">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-muted mx-auto mt-2 max-w-64 text-sm text-balance">{description}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}
