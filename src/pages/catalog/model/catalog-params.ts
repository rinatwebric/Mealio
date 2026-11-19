import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export type CatalogSort = 'rating' | 'cookingTime' | 'name'
export type CatalogOrder = 'asc' | 'desc'

export interface CatalogParams {
  q: string
  mealType: string
  tag: string
  cuisine: string
  difficulty: string
  sort: CatalogSort
  order: CatalogOrder
  page: number
}

export const DEFAULT_CATALOG_PARAMS: CatalogParams = {
  q: '',
  mealType: '',
  tag: '',
  cuisine: '',
  difficulty: '',
  sort: 'rating',
  order: 'desc',
  page: 1,
}

const SORT_FIELDS: CatalogSort[] = ['rating', 'cookingTime', 'name']

function parseSort(value: string | null): CatalogSort {
  return SORT_FIELDS.includes(value as CatalogSort) ? (value as CatalogSort) : 'rating'
}

function parseOrder(value: string | null): CatalogOrder {
  return value === 'asc' || value === 'desc' ? value : 'desc'
}

function parsePage(value: string | null): number {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export function parseCatalogParams(searchParams: URLSearchParams): CatalogParams {
  return {
    q: searchParams.get('q')?.trim() ?? '',
    mealType: searchParams.get('mealType') ?? '',
    tag: searchParams.get('tag') ?? '',
    cuisine: searchParams.get('cuisine') ?? '',
    difficulty: searchParams.get('difficulty') ?? '',
    sort: parseSort(searchParams.get('sort')),
    order: parseOrder(searchParams.get('order')),
    page: parsePage(searchParams.get('page')),
  }
}

export function toSearchParams(params: CatalogParams): URLSearchParams {
  const searchParams = new URLSearchParams()

  if (params.q) {
    searchParams.set('q', params.q)
  }
  if (params.mealType) {
    searchParams.set('mealType', params.mealType)
  }
  if (params.tag) {
    searchParams.set('tag', params.tag)
  }
  if (params.cuisine) {
    searchParams.set('cuisine', params.cuisine)
  }
  if (params.difficulty) {
    searchParams.set('difficulty', params.difficulty)
  }
  if (params.sort !== DEFAULT_CATALOG_PARAMS.sort) {
    searchParams.set('sort', params.sort)
  }
  if (params.order !== DEFAULT_CATALOG_PARAMS.order) {
    searchParams.set('order', params.order)
  }
  if (params.page > 1) {
    searchParams.set('page', String(params.page))
  }

  return searchParams
}

export function useCatalogParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const params = useMemo(() => parseCatalogParams(searchParams), [searchParams])

  const updateParams = useCallback(
    (patch: Partial<CatalogParams>) => {
      const next: CatalogParams = {
        ...params,
        ...patch,
      }

      if (patch.page === undefined) {
        next.page = 1
      }

      setSearchParams(toSearchParams(next))
    },
    [params, setSearchParams],
  )

  const resetParams = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  return { params, updateParams, resetParams }
}