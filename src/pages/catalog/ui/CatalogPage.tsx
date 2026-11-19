import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { RecipeCard, useRecipes, useRecipeTags } from '@/entities/recipe'
import { FavoriteButton } from '@/features/favorite-recipe'
import { RecipeFilters } from '@/widgets/recipe-filters'
import { useDocumentMeta } from '@/shared/lib'
import { PageHeader } from '@/shared/ui'
import { Skeleton } from '@/shared/ui'
import { ErrorState } from '@/shared/ui'
import { EmptyState } from '@/shared/ui'
import { Pagination } from '@/shared/ui'
import { PlusIcon } from '@/shared/ui'
import { useCatalogParams, type CatalogOrder, type CatalogSort } from '../model/catalog-params'
import {
  applyCatalog,
  getCuisines,
  getMealTypeCounts,
  getRecipeTags,
} from '../lib/filter-recipes'

export function CatalogPage() {
  const recipesQuery = useRecipes()
  const tagsQuery = useRecipeTags()
  const { params, updateParams, resetParams } = useCatalogParams()

  const recipes = useMemo(() => recipesQuery.data ?? [], [recipesQuery.data])
  const result = useMemo(() => applyCatalog(recipes, params), [recipes, params])
  const cuisines = useMemo(() => getCuisines(recipes), [recipes])
  const mealTypeCounts = useMemo(() => getMealTypeCounts(recipes), [recipes])
  const tags = useMemo(
    () => [...new Set([...(tagsQuery.data ?? []), ...getRecipeTags(recipes)])].sort(),
    [recipes, tagsQuery.data],
  )

  const title = params.q ? `Рецепты по запросу «${params.q}» — Mealio` : 'Каталог рецептов — Mealio'

  useDocumentMeta({
    title,
    description:
      'Поиск рецептов по названию, кухне, тегу, типу блюда и сложности. Сортировка по рейтингу и времени приготовления.',
  })

  return (
    <div className="page-wrap">
      <PageHeader
        title="Рецепты"
        description="Фильтры, поиск и страница хранятся в URL: ссылку можно скопировать и открыть с тем же набором рецептов."
        actions={
          <Link
            to="/recipes/new"
            className="inline-flex h-9 items-center gap-2 rounded-control bg-ink px-4 text-sm font-medium text-white hover:bg-ink/90"
          >
            <PlusIcon size={16} />
            Добавить рецепт
          </Link>
        }
      />

      {recipesQuery.isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-80" />
            ))}
          </div>
        </div>
      ) : recipesQuery.isError ? (
        <ErrorState
          message="Не удалось получить список рецептов."
          onRetry={() => void recipesQuery.refetch()}
        />
      ) : (
        <div className="space-y-6">
          <RecipeFilters
            value={{
              q: params.q,
              mealType: params.mealType,
              tag: params.tag,
              cuisine: params.cuisine,
              difficulty: params.difficulty,
              sort: params.sort,
              order: params.order,
            }}
            mealTypeCounts={mealTypeCounts}
            cuisines={cuisines}
            tags={tags}
            resultCount={result.filteredTotal}
            onSearchChange={(value) => updateParams({ q: value })}
            onSelectChange={(field, value) => updateParams({ [field]: value })}
            onSortChange={(value) => {
              const [sort, order] = value.split('-') as [CatalogSort, CatalogOrder]
              updateParams({ sort, order })
            }}
            onReset={resetParams}
          />

          {result.items.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.items.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    action={<FavoriteButton recipeId={recipe.id} />}
                  />
                ))}
              </div>

              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                onPageChange={(page) => updateParams({ page })}
                className="pt-2"
              />
            </>
          ) : (
            <EmptyState
              title="Ничего не нашлось"
              description="Измените запрос или сбросьте фильтры. В DummyJSON 50 рецептов, поэтому узкий набор условий может дать пустую выдачу."
              action={
                <button
                  type="button"
                  onClick={resetParams}
                  className="inline-flex h-10 items-center rounded-control bg-ink px-4 text-sm font-medium text-white hover:bg-ink/90"
                >
                  Сбросить фильтры
                </button>
              }
            />
          )}
        </div>
      )}
    </div>
  )
}