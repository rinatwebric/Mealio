import { queryOptions, useQuery } from '@tanstack/react-query'
import { fetchRecipe, fetchRecipes, fetchRecipeTags } from './recipe.api'

export const recipeKeys = {
  all: ['recipes'] as const,
  list: () => [...recipeKeys.all, 'list'] as const,
  detail: (id: number) => [...recipeKeys.all, 'detail', id] as const,
  tags: () => [...recipeKeys.all, 'tags'] as const,
}

const LIST_STALE_TIME = 10 * 60_000

export const recipesQueryOptions = queryOptions({
  queryKey: recipeKeys.list(),
  queryFn: fetchRecipes,
  staleTime: LIST_STALE_TIME,
})

export function recipeQueryOptions(id: number) {
  return queryOptions({
    queryKey: recipeKeys.detail(id),
    queryFn: () => fetchRecipe(id),
    staleTime: 5 * 60_000,
  })
}

export const recipeTagsQueryOptions = queryOptions({
  queryKey: recipeKeys.tags(),
  queryFn: fetchRecipeTags,
  staleTime: 60 * 60_000,
})

export function useRecipes() {
  return useQuery({
    ...recipesQueryOptions,
    select: (data) => data.recipes,
  })
}

export function useRecipe(id: number) {
  return useQuery({
    ...recipeQueryOptions(id),
    enabled: Number.isFinite(id),
  })
}

export function useRecipeTags() {
  return useQuery(recipeTagsQueryOptions)
}