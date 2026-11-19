import { cn } from '@/shared/lib'
import { useId, type ComponentPropsWithoutRef } from 'react'

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label: string
  error?: string
  hint?: string
  containerClassName?: string
}

export function Textarea({ label, error, hint, id, className, containerClassName, ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const hintId = hint ? `${textareaId}-hint` : undefined
  const errorId = error ? `${textareaId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      <label htmlFor={textareaId} className="text-sm font-medium text-ink">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={cn(
          'min-h-28 w-full resize-y rounded-control border bg-surface px-3 py-2 text-sm text-ink',
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