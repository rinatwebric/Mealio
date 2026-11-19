import { cn } from '@/shared/lib'
import { useId, type ComponentPropsWithoutRef } from 'react'

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string
  error?: string
  hint?: string
  containerClassName?: string
}

export function Input({ label, error, hint, id, className, containerClassName, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      <label htmlFor={inputId} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          'h-10 w-full rounded-control border bg-surface px-3 text-sm text-ink',
          'placeholder:text-muted/70 hover:border-control',
          'disabled:cursor-not-allowed disabled:bg-raised disabled:text-muted',
          error ? 'border-danger' : 'border-line',
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}