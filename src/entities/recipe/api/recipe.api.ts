import { endpoints, request } from '@/shared/api'
import type {
  Recipe,
  RecipeInput,
  RecipeListResponse,
  RecipeRatingPayload,
} from '../model/types'

export function fetchRecipes(): Promise<RecipeListResponse> {
  return request<RecipeListResponse>(`${endpoints.recipes}?limit=0`)
}

export function fetchRecipe(id: number): Promise<Recipe> {
  return request<Recipe>(endpoints.recipeById(id))
}

export function fetchRecipeTags(): Promise<string[]> {
  return request<string[]>(endpoints.recipesTags)
}

export function createRecipe(input: RecipeInput): Promise<Recipe> {
  return request<Recipe>(endpoints.recipeAdd, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function replaceRecipe(id: number, input: RecipeInput): Promise<Recipe> {
  return request<Recipe>(endpoints.recipeById(id), {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function patchRecipeRating(
  id: number,
  payload: RecipeRatingPayload,
): Promise<Recipe> {
  return request<Recipe>(endpoints.recipeById(id), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}