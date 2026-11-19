import { Button } from './Button'

export interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-card border border-line bg-raised p-5">
      <p className="text-sm font-medium text-ink">Не удалось загрузить данные</p>
      <p className="mt-1 text-sm text-muted">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Повторить
        </Button>
      ) : null}
    </div>
  )
}