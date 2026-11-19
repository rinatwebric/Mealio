import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  patchRecipeRating,
  readRecipeFromCache,
  replaceRecipeInCache,
  type Recipe,
} from '@/entities/recipe'
import { calculateAggregateRating } from '../lib/calculate-rating'

export function useRateRecipe(recipeId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userRating: number): Promise<Recipe> => {
      const current = readRecipeFromCache(queryClient, recipeId)
      if (!current) {
        throw new Error('Рецепт не загружен. Обновите страницу.')
      }

      const aggregate = calculateAggregateRating(
        current.rating,
        current.reviewCount,
        userRating,
      )

      if (recipeId > 10_000) {
        return {
          ...current,
          rating: aggregate.rating,
          reviewCount: aggregate.reviewCount,
        }
      }

      const updated = await patchRecipeRating(recipeId, aggregate)

      return {
        ...current,
        ...updated,
        id: recipeId,
        rating: aggregate.rating,
        reviewCount: aggregate.reviewCount,
      }
    },
    onSuccess: (recipe) => {
      replaceRecipeInCache(queryClient, recipe)
    },
  })
}