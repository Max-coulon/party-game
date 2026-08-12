import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  full?: boolean
  children: ReactNode
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-accent text-ink font-semibold shadow-[0_0.75rem_2rem_-0.75rem_var(--accent)] active:brightness-95',
  secondary: 'surface text-chalk font-medium active:brightness-110',
  ghost: 'bg-transparent text-muted font-medium active:text-chalk',
  danger: 'bg-danger/15 text-danger font-semibold border border-danger/30 active:bg-danger/25',
}

const SIZES: Record<Size, string> = {
  sm: 'min-h-10 px-4 text-sm rounded-xl',
  md: 'min-h-12 px-5 text-base rounded-2xl',
  lg: 'min-h-14 px-6 text-lg rounded-2xl',
}

export function Button({
  variant = 'primary',
  size = 'lg',
  full = false,
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-[transform,filter,background-color] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40',
        VARIANTS[variant],
        SIZES[size],
        full && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
