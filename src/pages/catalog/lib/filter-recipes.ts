import {
  normalizeMealType,
  type Recipe,
} from '@/entities/recipe'
import type { CatalogParams } from '../model/catalog-params'

export const CATALOG_PAGE_SIZE = 9

export interface CatalogResult {
  items: Recipe[]
  filteredTotal: number
  totalPages: number
  page: number
}

export function getCuisines(recipes: Recipe[]): string[] {
  return [...new Set(recipes.map((recipe) => recipe.cuisine))].sort((a, b) => a.localeCompare(b))
}

export function getMealTypeCounts(recipes: Recipe[]): Record<string, number> {
  return recipes.reduce<Record<string, number>>((counts, recipe) => {
    for (const rawMealType of recipe.mealType) {
      const mealType = normalizeMealType(rawMealType)
      counts[mealType] = (counts[mealType] ?? 0) + 1
    }
    return counts
  }, {})
}

export function getRecipeTags(recipes: Recipe[]): string[] {
  return [...new Set(recipes.flatMap((recipe) => recipe.tags))].sort((a, b) => a.localeCompare(b))
}

export function applyCatalog(
  recipes: Recipe[],
  params: CatalogParams,
  pageSize = CATALOG_PAGE_SIZE,
): CatalogResult {
  const query = params.q.toLocaleLowerCase('ru')

  const filtered = recipes.filter((recipe) => {
    if (query && !recipe.name.toLocaleLowerCase('ru').includes(query)) {
      return false
    }
    if (
      params.mealType &&
      !recipe.mealType.map(normalizeMealType).includes(params.mealType)
    ) {
      return false
    }
    if (params.tag && !recipe.tags.includes(params.tag)) {
      return false
    }
    if (params.cuisine && recipe.cuisine !== params.cuisine) {
      return false
    }
    if (params.difficulty && recipe.difficulty !== params.difficulty) {
      return false
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    const direction = params.order === 'asc' ? 1 : -1

    if (params.sort === 'name') {
      return a.name.localeCompare(b.name, 'ru') * direction
    }
    if (params.sort === 'cookingTime') {
      const aTime = a.prepTimeMinutes + a.cookTimeMinutes
      const bTime = b.prepTimeMinutes + b.cookTimeMinutes
      return (aTime - bTime) * direction
    }
    return (a.rating - b.rating) * direction
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const page = Math.min(params.page, totalPages)
  const offset = (page - 1) * pageSize

  return {
    items: sorted.slice(offset, offset + pageSize),
    filteredTotal: sorted.length,
    totalPages,
    page,
  }
}