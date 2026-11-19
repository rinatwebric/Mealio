import type { Difficulty } from './types'

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard']

export const CUISINES = [
  'American',
  'Asian',
  'Brazilian',
  'Greek',
  'Hawaiian',
  'Indian',
  'Italian',
  'Japanese',
  'Korean',
  'Lebanese',
  'Mediterranean',
  'Mexican',
  'Moroccan',
  'Pakistani',
  'Russian',
  'Spanish',
  'Thai',
  'Turkish',
  'Vietnamese',
] as const

export const MEAL_TYPES = [
  'Appetizer',
  'Beverage',
  'Breakfast',
  'Dessert',
  'Dinner',
  'Lunch',
  'Side Dish',
  'Snack',
] as const

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  Easy: 'Просто',
  Medium: 'Средне',
  Hard: 'Сложно',
}

export const MEAL_TYPE_LABELS: Record<string, string> = {
  Appetizer: 'Закуска',
  Beverage: 'Напиток',
  Breakfast: 'Завтрак',
  Dessert: 'Десерт',
  Dinner: 'Ужин',
  Lunch: 'Обед',
  'Side Dish': 'Гарнир',
  Snack: 'Перекус',
  Snacks: 'Перекус',
}