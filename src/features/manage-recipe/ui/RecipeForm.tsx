import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  MEAL_TYPES,
  MEAL_TYPE_LABELS,
  normalizeMealType,
  type Difficulty,
  type Recipe,
  type RecipeInput,
} from '@/entities/recipe'
import { Button } from '@/shared/ui'
import { Input } from '@/shared/ui'
import { Select } from '@/shared/ui'
import { Textarea } from '@/shared/ui'
import {
  minLength,
  required,
  validateLines,
  validatePositiveInteger,
  validateUrl,
} from '@/shared/lib'

interface RecipeFormValues {
  name: string
  cuisine: string
  difficulty: string
  mealType: string
  image: string
  prepTimeMinutes: string
  cookTimeMinutes: string
  servings: string
  caloriesPerServing: string
  tags: string
  ingredients: string
  instructions: string
}

export interface RecipeFormProps {
  initialRecipe?: Recipe
  cuisineOptions: string[]
  submitLabel: string
  cancelTo: string
  isPending: boolean
  serverError?: string
  onSubmit: (input: RecipeInput) => void
}

function isDifficulty(value: string): value is Difficulty {
  return DIFFICULTIES.includes(value as Difficulty)
}

function toFormValues(recipe?: Recipe): RecipeFormValues {
  if (!recipe) {
    return {
      name: '',
      cuisine: 'Italian',
      difficulty: 'Easy',
      mealType: 'Dinner',
      image: '',
      prepTimeMinutes: '15',
      cookTimeMinutes: '20',
      servings: '2',
      caloriesPerServing: '350',
      tags: '',
      ingredients: '',
      instructions: '',
    }
  }

  return {
    name: recipe.name,
    cuisine: recipe.cuisine,
    difficulty: recipe.difficulty,
    mealType: normalizeMealType(recipe.mealType[0] ?? 'Dinner'),
    image: recipe.image,
    prepTimeMinutes: String(recipe.prepTimeMinutes),
    cookTimeMinutes: String(recipe.cookTimeMinutes),
    servings: String(recipe.servings),
    caloriesPerServing: String(recipe.caloriesPerServing),
    tags: recipe.tags.join(', '),
    ingredients: recipe.ingredients.join('\n'),
    instructions: recipe.instructions.join('\n'),
  }
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function RecipeForm({
  initialRecipe,
  cuisineOptions,
  submitLabel,
  cancelTo,
  isPending,
  serverError,
  onSubmit,
}: RecipeFormProps) {
  const [values, setValues] = useState<RecipeFormValues>(() => toFormValues(initialRecipe))
  const [errors, setErrors] = useState<Record<string, string>>({})

  function updateField(field: keyof RecipeFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {}
    const nameError = minLength(values.name, 3, 'Название от 3 символов')
    const cuisineError = required(values.cuisine, 'Укажите кухню')
    const imageError = validateUrl(values.image)
    const prepError = validatePositiveInteger(values.prepTimeMinutes, 'Минуты должны быть больше 0')
    const cookError = validatePositiveInteger(values.cookTimeMinutes, 'Минуты должны быть больше 0')
    const servingsError = validatePositiveInteger(values.servings, 'Порции должны быть больше 0')
    const caloriesError = validatePositiveInteger(
      values.caloriesPerServing,
      'Калории должны быть больше 0',
    )
    const ingredientsError = validateLines(
      values.ingredients,
      2,
      'Добавьте минимум два ингредиента, каждый с новой строки',
    )
    const instructionsError = validateLines(
      values.instructions,
      2,
      'Добавьте минимум два шага, каждый с новой строки',
    )

    const fieldErrors: Array<[string, string | null]> = [
      ['name', nameError],
      ['cuisine', cuisineError],
      ['image', imageError],
      ['prepTimeMinutes', prepError],
      ['cookTimeMinutes', cookError],
      ['servings', servingsError],
      ['caloriesPerServing', caloriesError],
      ['ingredients', ingredientsError],
      ['instructions', instructionsError],
    ]

    for (const [field, error] of fieldErrors) {
      if (error) {
        nextErrors[field] = error
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate()) {
      return
    }

    const difficulty = isDifficulty(values.difficulty) ? values.difficulty : 'Easy'

    onSubmit({
      name: values.name.trim(),
      cuisine: values.cuisine.trim(),
      difficulty,
      mealType: [values.mealType],
      image: values.image.trim(),
      prepTimeMinutes: Number(values.prepTimeMinutes),
      cookTimeMinutes: Number(values.cookTimeMinutes),
      servings: Number(values.servings),
      caloriesPerServing: Number(values.caloriesPerServing),
      tags: values.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      ingredients: splitLines(values.ingredients),
      instructions: splitLines(values.instructions),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          label="Название"
          name="name"
          value={values.name}
          onChange={(event) => updateField('name', event.target.value)}
          error={errors.name}
          placeholder="Например, Tom yum с креветками"
          containerClassName="md:col-span-3"
        />
        <Select
          label="Кухня"
          name="cuisine"
          value={values.cuisine}
          onChange={(event) => updateField('cuisine', event.target.value)}
          options={cuisineOptions.map((cuisine) => ({ value: cuisine, label: cuisine }))}
          error={errors.cuisine}
        />
        <Select
          label="Тип блюда"
          name="mealType"
          value={values.mealType}
          onChange={(event) => updateField('mealType', event.target.value)}
          options={MEAL_TYPES.map((mealType) => ({
            value: mealType,
            label: MEAL_TYPE_LABELS[mealType] ?? mealType,
          }))}
        />
        <Select
          label="Сложность"
          name="difficulty"
          value={values.difficulty}
          onChange={(event) => updateField('difficulty', event.target.value)}
          options={DIFFICULTIES.map((difficulty) => ({
            value: difficulty,
            label: DIFFICULTY_LABELS[difficulty],
          }))}
        />
        <Input
          label="Время подготовки, мин"
          name="prepTimeMinutes"
          type="number"
          min="1"
          inputMode="numeric"
          value={values.prepTimeMinutes}
          onChange={(event) => updateField('prepTimeMinutes', event.target.value)}
          error={errors.prepTimeMinutes}
        />
        <Input
          label="Время приготовления, мин"
          name="cookTimeMinutes"
          type="number"
          min="1"
          inputMode="numeric"
          value={values.cookTimeMinutes}
          onChange={(event) => updateField('cookTimeMinutes', event.target.value)}
          error={errors.cookTimeMinutes}
        />
        <Input
          label="Порции"
          name="servings"
          type="number"
          min="1"
          inputMode="numeric"
          value={values.servings}
          onChange={(event) => updateField('servings', event.target.value)}
          error={errors.servings}
        />
        <Input
          label="Калории на порцию"
          name="caloriesPerServing"
          type="number"
          min="1"
          inputMode="numeric"
          value={values.caloriesPerServing}
          onChange={(event) => updateField('caloriesPerServing', event.target.value)}
          error={errors.caloriesPerServing}
        />
        <Input
          label="Ссылка на изображение"
          name="image"
          type="url"
          value={values.image}
          onChange={(event) => updateField('image', event.target.value)}
          error={errors.image}
          placeholder="https://cdn.dummyjson.com/recipe-images/1.webp"
          containerClassName="md:col-span-2"
        />
        <Input
          label="Теги"
          name="tags"
          value={values.tags}
          onChange={(event) => updateField('tags', event.target.value)}
          hint="Через запятую: Thai, Soup, Seafood"
          containerClassName="md:col-span-3"
        />
      </div>

      <Textarea
        label="Ингредиенты"
        name="ingredients"
        value={values.ingredients}
        onChange={(event) => updateField('ingredients', event.target.value)}
        error={errors.ingredients}
        hint="Один ингредиент на строку"
        rows={7}
      />
      <Textarea
        label="Инструкция"
        name="instructions"
        value={values.instructions}
        onChange={(event) => updateField('instructions', event.target.value)}
        error={errors.instructions}
        hint="Один шаг на строку"
        rows={9}
      />

      {serverError ? (
        <p role="alert" className="rounded-control bg-[#ffedea] px-3 py-2 text-sm text-[#831c1e]">
          {serverError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <Link
          to={cancelTo}
          className="flex h-11 items-center justify-center rounded-control border border-control px-5 text-sm font-medium text-ink hover:bg-raised"
        >
          Отмена
        </Link>
        <Button type="submit" size="lg" isLoading={isPending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}