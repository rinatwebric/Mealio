import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean
}

export function Card({ padded = true, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card border border-line bg-surface',
        padded && 'p-5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}