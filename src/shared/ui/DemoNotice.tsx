import { cn } from '@/shared/lib/cn'

export function DemoNotice({ className, children }: { className?: string; children?: string }) {
  return (
    <p className={cn('rounded-card bg-raised px-3 py-2 text-xs text-muted', className)}>
      {children ??
        'Демонстрационные данные DummyJSON: изменения и новые рецепты живут только в этой сессии.'}
    </p>
  )
}