import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createRecipe,
  prependRecipeToCache,
  type Recipe,
  type RecipeInput,
} from '@/entities/recipe'

export function useCreateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: RecipeInput): Promise<Recipe> => {
      const created = await createRecipe(input)

      return {
        ...created,
        ...input,
        id: Date.now(),
        userId: created.userId ?? 0,
        rating: created.rating ?? 0,
        reviewCount: created.reviewCount ?? 0,
      }
    },
    onSuccess: (recipe) => {
      prependRecipeToCache(queryClient, recipe)
    },
  })
}