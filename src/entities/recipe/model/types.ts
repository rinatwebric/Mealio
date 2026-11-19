import type { ApiListResponse } from '@/shared/api'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface Recipe {
  id: number
  name: string
  ingredients: string[]
  instructions: string[]
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
  difficulty: Difficulty
  cuisine: string
  caloriesPerServing: number
  tags: string[]
  userId: number
  image: string
  rating: number
  reviewCount: number
  mealType: string[]
}

export type RecipeListResponse = ApiListResponse<Recipe, 'recipes'>

export interface RecipeInput {
  name: string
  ingredients: string[]
  instructions: string[]
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
  difficulty: Difficulty
  cuisine: string
  caloriesPerServing: number
  tags: string[]
  image: string
  mealType: string[]
}

export interface RecipeRatingPayload {
  rating: number
  reviewCount: number
}