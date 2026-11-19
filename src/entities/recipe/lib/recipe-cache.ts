import type { QueryClient } from '@tanstack/react-query'
import { recipeKeys } from '../api/recipe.queries'
import type { Recipe, RecipeListResponse } from '../model/types'

export function readRecipeFromCache(
  client: QueryClient,
  id: number,
): Recipe | undefined {
  const detail = client.getQueryData<Recipe>(recipeKeys.detail(id))
  if (detail) {
    return detail
  }

  const list = client.getQueryData<RecipeListResponse>(recipeKeys.list())
  return list?.recipes.find((recipe) => recipe.id === id)
}

export function prependRecipeToCache(client: QueryClient, recipe: Recipe): void {
  const list = client.getQueryData<RecipeListResponse>(recipeKeys.list())

  if (list) {
    client.setQueryData<RecipeListResponse>(recipeKeys.list(), {
      ...list,
      recipes: [recipe, ...list.recipes.filter((item) => item.id !== recipe.id)],
      total: list.total + 1,
    })
  }

  client.setQueryData(recipeKeys.detail(recipe.id), recipe)
}

export function replaceRecipeInCache(client: QueryClient, recipe: Recipe): void {
  const list = client.getQueryData<RecipeListResponse>(recipeKeys.list())

  if (list) {
    client.setQueryData<RecipeListResponse>(recipeKeys.list(), {
      ...list,
      recipes: list.recipes.map((item) => (item.id === recipe.id ? recipe : item)),
    })
  }

  client.setQueryData(recipeKeys.detail(recipe.id), recipe)
}