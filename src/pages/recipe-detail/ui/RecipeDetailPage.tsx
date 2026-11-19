import { useState } from 'react'
import { Link, useLoaderData, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  getCookingTime,
  getDifficultyLabel,
  getMealTypeLabel,
  recipeQueryOptions,
  StarRating,
  type Recipe,
} from '@/entities/recipe'
import { useUser, UserBadge } from '@/entities/user'
import { FavoriteButton } from '@/features/favorite-recipe'
import { RateRecipeModal } from '@/features/rate-recipe'
import { useAuthStore } from '@/features/auth'
import { formatMinutes } from '@/shared/lib'
import { useDocumentMeta } from '@/shared/lib'
import { Badge } from '@/shared/ui'
import { Card } from '@/shared/ui'
import { DemoNotice } from '@/shared/ui'
import { Button } from '@/shared/ui'
import {
  ArrowRightIcon,
  ClockIcon,
  EditIcon,
  StarIcon,
  UsersIcon,
} from '@/shared/ui'
import type { RecipeLoaderData } from '../api/recipe.loader'

interface DetailLocationState {
  created?: boolean
  updated?: boolean
}

export function RecipeDetailPage() {
  const loaderData = useLoaderData() as RecipeLoaderData
  const location = useLocation()
  const locationState = (location.state ?? {}) as DetailLocationState
  const hasToken = useAuthStore((state) => Boolean(state.accessToken))
  const [ratingOpen, setRatingOpen] = useState(false)

  const recipeQuery = useQuery({
    ...recipeQueryOptions(loaderData.recipe.id),
    initialData: loaderData.recipe,
  })
  const recipe: Recipe = recipeQuery.data
  const authorQuery = useUser(recipe.userId, recipe.userId > 0)

  useDocumentMeta({
    title: `${recipe.name} — рецепт | Mealio`,
    description: `${recipe.cuisine}, ${recipe.difficulty}, ${getCookingTime(recipe)} минут. Ингредиенты, шаги приготовления и оценка рецепта.`,
    image: recipe.image,
    type: 'article',
  })

  const facts = [
    { label: 'Подготовка', value: formatMinutes(recipe.prepTimeMinutes) },
    { label: 'Готовка', value: formatMinutes(recipe.cookTimeMinutes) },
    { label: 'Всего', value: formatMinutes(getCookingTime(recipe)) },
    { label: 'Порции', value: String(recipe.servings) },
    { label: 'Калории', value: `${recipe.caloriesPerServing} на порцию` },
  ]

  return (
    <div className="page-wrap">
      <nav aria-label="Хлебные крошки" className="mb-5 text-sm text-muted">
        <Link to="/recipes" className="hover:text-ink">
          Рецепты
        </Link>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <span className="text-ink">{recipe.name}</span>
      </nav>

      {locationState.created || locationState.updated ? (
        <p
          role="status"
          className="mb-5 rounded-card bg-accent-soft px-4 py-3 text-sm text-accent"
        >
          {locationState.created
            ? 'Рецепт создан в демо-кэше. Он появится в каталоге до перезагрузки страницы.'
            : 'Изменения сохранены в демо-кэше. Сервер DummyJSON их не удерживает.'}
        </p>
      ) : null}

      <article>
        <header className="grid gap-6 border-b border-line pb-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="aspect-[4/3] w-full rounded-card border border-line object-cover"
          />

          <div className="flex flex-col">
            <div className="mb-3 flex flex-wrap gap-1.5">
              <Badge variant="accent">{getMealTypeLabel(recipe.mealType[0] ?? '')}</Badge>
              <Badge>{getDifficultyLabel(recipe.difficulty)}</Badge>
              <Badge variant="neutral">{recipe.cuisine}</Badge>
            </div>

            <h1 className="max-w-[24ch] text-3xl leading-tight font-semibold tracking-[-0.025em] sm:text-4xl">
              {recipe.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              <StarRating rating={recipe.rating} reviewCount={recipe.reviewCount} size={16} />
              <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                <ClockIcon size={16} />
                {formatMinutes(getCookingTime(recipe))}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                <UsersIcon size={16} />
                {recipe.servings}{' '}
                {recipe.servings === 1 ? 'порция' : recipe.servings < 5 ? 'порции' : 'порций'}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <FavoriteButton
                recipeId={recipe.id}
                className="h-10 w-auto gap-2 rounded-control px-3"
              />
              <Button
                variant="secondary"
                leftIcon={<StarIcon size={16} />}
                onClick={() => setRatingOpen(true)}
              >
                Оценить
              </Button>
              {hasToken ? (
                <Link
                  to={`/recipes/${recipe.id}/edit`}
                  className="inline-flex h-9 items-center gap-2 rounded-control border border-control px-4 text-sm font-medium text-ink hover:bg-raised"
                >
                  <EditIcon size={16} />
                  Редактировать
                </Link>
              ) : null}
            </div>

            {authorQuery.data ? (
              <div className="mt-6 border-t border-line pt-4">
                <UserBadge user={authorQuery.data} caption="Автор рецепта" />
              </div>
            ) : null}
          </div>
        </header>

        <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
          <div className="space-y-8">
            <section aria-labelledby="ingredients-heading">
              <h2 id="ingredients-heading" className="text-xl font-semibold tracking-tight">
                Ингредиенты
              </h2>
              <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {recipe.ingredients.map((ingredient) => (
                  <li
                    key={ingredient}
                    className="flex gap-2 border-b border-line py-2 text-sm text-ink"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="instructions-heading">
              <h2 id="instructions-heading" className="text-xl font-semibold tracking-tight">
                Приготовление
              </h2>
              <ol className="mt-4 space-y-4">
                {recipe.instructions.map((step, index) => (
                  <li key={step} className="flex gap-4 text-sm leading-relaxed text-ink">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-raised font-mono text-xs text-muted">
                      {index + 1}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="space-y-4">
            <Card>
              <h2 className="text-base font-semibold">Коротко о рецепте</h2>
              <dl className="mt-4 divide-y divide-line">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-center justify-between gap-4 py-2.5">
                    <dt className="text-sm text-muted">{fact.label}</dt>
                    <dd className="text-sm font-medium text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            {recipe.tags.length > 0 ? (
              <Card>
                <h2 className="text-base font-semibold">Теги</h2>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {recipe.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/recipes?tag=${encodeURIComponent(tag)}`}
                      className="inline-flex h-8 items-center rounded-control border border-line px-2.5 text-xs text-ink hover:bg-raised"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </Card>
            ) : null}

            <DemoNotice />
          </aside>
        </div>
      </article>

      <div className="border-t border-line pt-6">
        <Link
          to="/recipes"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
        >
          <ArrowRightIcon size={16} className="rotate-180" />
          Вернуться в каталог
        </Link>
      </div>

      <RateRecipeModal
        recipe={recipe}
        open={ratingOpen}
        onClose={() => setRatingOpen(false)}
      />
    </div>
  )
}