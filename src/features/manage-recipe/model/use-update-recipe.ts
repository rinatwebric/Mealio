import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  readRecipeFromCache,
  replaceRecipe,
  replaceRecipeInCache,
  type Recipe,
  type RecipeInput,
} from '@/entities/recipe'

const LOCAL_RECIPE_ID_THRESHOLD = 10_000

export function useUpdateRecipe(recipeId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: RecipeInput): Promise<Recipe> => {
      if (recipeId > LOCAL_RECIPE_ID_THRESHOLD) {
        const current = readRecipeFromCache(queryClient, recipeId)
        if (!current) {
          throw new Error('Локальный рецепт больше не лежит в кэше.')
        }
        return { ...current, ...input, id: recipeId }
      }

      const current = readRecipeFromCache(queryClient, recipeId)
      const updated = await replaceRecipe(recipeId, input)

      return {
        ...updated,
        ...input,
        id: recipeId,
        rating: current?.rating ?? updated.rating,
        reviewCount: current?.reviewCount ?? updated.reviewCount,
        userId: current?.userId ?? updated.userId,
      }
    },
    onSuccess: (recipe) => {
      replaceRecipeInCache(queryClient, recipe)
    },
  })
}