import { cn } from '@/shared/lib'
import { useId, type ComponentPropsWithoutRef } from 'react'

export type SelectOption = {
  value: string
  label: string
}

export interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  label: string
  options: SelectOption[]
  error?: string
  hint?: string
  containerClassName?: string
}

export function Select({
  label,
  options,
  error,
  hint,
  id,
  className,
  containerClassName,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const hintId = hint ? `${selectId}-hint` : undefined
  const errorId = error ? `${selectId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      <label htmlFor={selectId} className="text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={selectId}
        className={cn(
          'h-10 w-full rounded-control border bg-surface px-3 text-sm text-ink',
          'hover:border-control disabled:cursor-not-allowed disabled:bg-raised disabled:text-muted',
          error ? 'border-danger' : 'border-line',
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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