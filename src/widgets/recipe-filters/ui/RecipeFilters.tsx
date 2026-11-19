import { useState } from 'react'
import {
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  MEAL_TYPES,
  MEAL_TYPE_LABELS,
} from '@/entities/recipe'
import { Button } from '@/shared/ui'
import { Select } from '@/shared/ui'
import { FilterIcon, SearchIcon } from '@/shared/ui'
import { cn } from '@/shared/lib'

export interface RecipeFiltersValue {
  q: string
  mealType: string
  tag: string
  cuisine: string
  difficulty: string
  sort: string
  order: string
}

export interface RecipeFiltersProps {
  value: RecipeFiltersValue
  mealTypeCounts: Record<string, number>
  cuisines: string[]
  tags: string[]
  resultCount: number
  onSearchChange: (value: string) => void
  onSelectChange: (field: 'mealType' | 'tag' | 'cuisine' | 'difficulty', value: string) => void
  onSortChange: (value: string) => void
  onReset: () => void
}

const sortOptions = [
  { value: 'rating-desc', label: 'Рейтинг: высокий' },
  { value: 'rating-asc', label: 'Рейтинг: низкий' },
  { value: 'cookingTime-asc', label: 'Быстрые сначала' },
  { value: 'cookingTime-desc', label: 'Долгие сначала' },
  { value: 'name-asc', label: 'Название: А–Я' },
  { value: 'name-desc', label: 'Название: Я–А' },
]

export function RecipeFilters({
  value,
  mealTypeCounts,
  cuisines,
  tags,
  resultCount,
  onSearchChange,
  onSelectChange,
  onSortChange,
  onReset,
}: RecipeFiltersProps) {
  const [query, setQuery] = useState(value.q)
  const [lastQuery, setLastQuery] = useState(value.q)
  const [filtersOpen, setFiltersOpen] = useState(false)

  if (value.q !== lastQuery) {
    setLastQuery(value.q)
    setQuery(value.q)
  }

  const hasFilters =
    value.q !== '' ||
    value.mealType !== '' ||
    value.tag !== '' ||
    value.cuisine !== '' ||
    value.difficulty !== '' ||
    value.sort !== 'rating' ||
    value.order !== 'desc'

  return (
    <section aria-label="Фильтры каталога" className="space-y-4">
      <form
        role="search"
        className="relative"
        onSubmit={(event) => {
          event.preventDefault()
          onSearchChange(query.trim())
        }}
      >
        <label htmlFor="catalog-search" className="mb-1.5 block text-sm font-medium text-ink">
          Поиск по названию
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
            />
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Например, pasta или chicken"
              className="h-10 w-full rounded-control border border-line bg-surface pr-3 pl-9 text-sm text-ink placeholder:text-muted/70 hover:border-control"
            />
          </div>
          <Button type="submit" variant="secondary">
            Найти
          </Button>
          {query ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setQuery('')
                onSearchChange('')
              }}
            >
              Очистить
            </Button>
          ) : null}
        </div>
      </form>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-2">
          <button
            type="button"
            onClick={() => onSelectChange('mealType', '')}
            aria-pressed={value.mealType === ''}
            className={cn(
              'h-9 rounded-control border px-3 text-sm',
              value.mealType === ''
                ? 'border-control bg-active font-medium text-ink'
                : 'border-line text-muted hover:bg-raised hover:text-ink',
            )}
          >
            Все блюда
          </button>
          {MEAL_TYPES.map((mealType) => (
            <button
              key={mealType}
              type="button"
              onClick={() => onSelectChange('mealType', mealType)}
              aria-pressed={value.mealType === mealType}
              className={cn(
                'h-9 rounded-control border px-3 text-sm',
                value.mealType === mealType
                  ? 'border-accent bg-accent-soft font-medium text-accent'
                  : 'border-line text-muted hover:bg-raised hover:text-ink',
              )}
            >
              {MEAL_TYPE_LABELS[mealType] ?? mealType}
              <span className="ml-1.5 font-mono text-xs opacity-70">
                {mealTypeCounts[mealType] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          className="inline-flex h-10 items-center gap-2 rounded-control border border-line px-3 text-sm text-ink hover:bg-raised"
        >
          <FilterIcon size={16} />
          {filtersOpen ? 'Скрыть фильтры' : 'Фильтры'}
        </button>
        <p className="text-sm text-muted" aria-live="polite">
          Найдено: <span className="font-medium text-ink">{resultCount}</span>
        </p>
      </div>

      <div
        className={cn(
          'grid gap-3 sm:grid-cols-2 lg:grid-cols-5',
          filtersOpen ? 'grid' : 'hidden lg:grid',
        )}
      >
        <Select
          label="Кухня"
          name="cuisine"
          value={value.cuisine}
          onChange={(event) => onSelectChange('cuisine', event.target.value)}
          options={[
            { value: '', label: 'Любая кухня' },
            ...cuisines.map((cuisine) => ({ value: cuisine, label: cuisine })),
          ]}
        />
        <Select
          label="Тег"
          name="tag"
          value={value.tag}
          onChange={(event) => onSelectChange('tag', event.target.value)}
          options={[
            { value: '', label: 'Любой тег' },
            ...tags.map((tag) => ({ value: tag, label: tag })),
          ]}
        />
        <Select
          label="Сложность"
          name="difficulty"
          value={value.difficulty}
          onChange={(event) => onSelectChange('difficulty', event.target.value)}
          options={[
            { value: '', label: 'Любая' },
            ...DIFFICULTIES.map((difficulty) => ({
              value: difficulty,
              label: DIFFICULTY_LABELS[difficulty],
            })),
          ]}
        />
        <Select
          label="Сортировка"
          name="sort"
          value={`${value.sort}-${value.order}`}
          onChange={(event) => onSortChange(event.target.value)}
          options={sortOptions}
        />
        <div className="flex items-end">
          <Button variant="secondary" className="w-full" onClick={onReset} disabled={!hasFilters}>
            Сбросить фильтры
          </Button>
        </div>
      </div>

      <p className="hidden text-sm text-muted lg:block" aria-live="polite">
        Найдено: <span className="font-medium text-ink">{resultCount}</span>
      </p>
    </section>
  )
}