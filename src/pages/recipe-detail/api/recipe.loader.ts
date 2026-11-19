import type { LoaderFunctionArgs } from 'react-router-dom'
import {
  readRecipeFromCache,
  recipeQueryOptions,
  type Recipe,
} from '@/entities/recipe'
import { ApiError, queryClient } from '@/shared/api'

export interface RecipeLoaderData {
  recipe: Recipe
}

export async function recipeLoader({
  params,
}: LoaderFunctionArgs): Promise<RecipeLoaderData> {
  const recipeId = Number(params.recipeId)

  if (!Number.isInteger(recipeId)) {
    throw new Response('Not Found', { status: 404 })
  }

  const cached = readRecipeFromCache(queryClient, recipeId)
  if (cached) {
    return { recipe: cached }
  }

  try {
    const recipe = await queryClient.fetchQuery(recipeQueryOptions(recipeId))
    return { recipe }
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Response('Not Found', { status: 404 })
    }
    throw error
  }
}