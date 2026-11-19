import { Link } from 'react-router-dom'
import { RecipeCard, useRecipes, type Recipe } from '@/entities/recipe'
import { FavoriteButton, useFavoritesStore } from '@/features/favorite-recipe'
import { useDocumentMeta } from '@/shared/lib'
import { PageHeader } from '@/shared/ui'
import { EmptyState } from '@/shared/ui'
import { ErrorState } from '@/shared/ui'
import { Skeleton } from '@/shared/ui'

export function FavoritesPage() {
  const recipesQuery = useRecipes()
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)

  useDocumentMeta({
    title: 'Избранное — Mealio',
    description: 'Сохранённые рецепты. Список хранится в localStorage браузера.',
  })

  const recipes = (recipesQuery.data ?? []).filter((recipe) =>
    favoriteIds.includes(recipe.id),
  )
  const ordered = favoriteIds
    .map((id) => recipes.find((recipe) => recipe.id === id))
    .filter((recipe): recipe is Recipe => Boolean(recipe))

  return (
    <div className="page-wrap">
      <PageHeader
        title="Избранное"
        description={
          favoriteIds.length > 0
            ? `Сохранено ${favoriteIds.length}. Список живёт в localStorage и не зависит от аккаунта.`
            : 'Здесь появятся рецепты, которые вы отметите сердцем.'
        }
      />

      {recipesQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-80" />
          ))}
        </div>
      ) : recipesQuery.isError ? (
        <ErrorState
          message="Не удалось загрузить рецепты."
          onRetry={() => void recipesQuery.refetch()}
        />
      ) : ordered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              action={<FavoriteButton recipeId={recipe.id} />}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Пока ничего не сохранено"
          description="Откройте каталог и нажмите на сердце на карточке рецепта."
          action={
            <Link
              to="/recipes"
              className="inline-flex h-10 items-center rounded-control bg-ink px-4 text-sm font-medium text-white hover:bg-ink/90"
            >
              Перейти в каталог
            </Link>
          }
        />
      )}
    </div>
  )
}