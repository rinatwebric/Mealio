import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-active text-ink',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-[#dcfae5] text-[#04250e]',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-[#ffedea] text-[#831c1e]',
}

export function Badge({ variant = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[4px] px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}