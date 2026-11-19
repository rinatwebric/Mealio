import { cn } from '@/shared/lib'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

export interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

type PageItem = number | 'ellipsis'

function buildPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items: PageItem[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)

  if (start > 2) {
    items.push('ellipsis')
  }
  for (let value = start; value <= end; value += 1) {
    items.push(value)
  }
  if (end < totalPages - 1) {
    items.push('ellipsis')
  }
  items.push(totalPages)
  return items
}

const arrowClass =
  'flex h-11 w-11 items-center justify-center rounded-control border border-line text-ink hover:bg-raised disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10'

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const items = buildPageItems(page, totalPages)

  return (
    <nav
      aria-label="Пагинация"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <div className="flex items-center gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Предыдущая страница"
          className={arrowClass}
        >
          <ChevronLeftIcon size={18} />
        </button>
        <span className="min-w-32 text-center text-sm text-muted">
          Страница <span className="font-medium text-ink">{page}</span> из {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Следующая страница"
          className={arrowClass}
        >
          <ChevronRightIcon size={18} />
        </button>
      </div>

      <div className="hidden items-center gap-1 sm:flex">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Предыдущая страница"
          className={arrowClass}
        >
          <ChevronLeftIcon size={18} />
        </button>

        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="flex h-10 w-8 items-center justify-center text-sm text-muted"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? 'page' : undefined}
              aria-label={`Страница ${item}`}
              className={cn(
                'flex h-10 min-w-10 items-center justify-center rounded-control px-2 text-sm font-medium',
                item === page
                  ? 'bg-ink text-white'
                  : 'border border-line text-ink hover:bg-raised',
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Следующая страница"
          className={arrowClass}
        >
          <ChevronRightIcon size={18} />
        </button>
      </div>
    </nav>
  )
}