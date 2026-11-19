import { DIFFICULTY_LABELS, MEAL_TYPE_LABELS } from '../model/constants'
import type { Difficulty, Recipe } from '../model/types'

export function getCookingTime(recipe: Pick<Recipe, 'prepTimeMinutes' | 'cookTimeMinutes'>): number {
  return recipe.prepTimeMinutes + recipe.cookTimeMinutes
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  return DIFFICULTY_LABELS[difficulty] ?? difficulty
}

export function getMealTypeLabel(mealType: string): string {
  return MEAL_TYPE_LABELS[mealType] ?? mealType
}

export function normalizeMealType(mealType: string): string {
  return mealType === 'Snacks' ? 'Snack' : mealType
}