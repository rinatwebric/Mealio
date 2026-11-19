import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CUISINES, useRecipe, useRecipes } from '@/entities/recipe'
import { RecipeForm, useUpdateRecipe } from '@/features/manage-recipe'
import { getErrorMessage } from '@/shared/api'
import { useDocumentMeta } from '@/shared/lib'
import { DemoNotice } from '@/shared/ui'
import { ErrorState } from '@/shared/ui'
import { PageHeader } from '@/shared/ui'
import { Skeleton } from '@/shared/ui'

export function RecipeEditPage() {
  const params = useParams()
  const recipeId = Number(params.recipeId)
  const navigate = useNavigate()
  const recipesQuery = useRecipes()
  const recipeQuery = useRecipe(recipeId)
  const updateRecipe = useUpdateRecipe(recipeId)

  const cuisines = useMemo(
    () =>
      [...new Set([...CUISINES, ...(recipesQuery.data ?? []).map((recipe) => recipe.cuisine)])].sort(
        (a, b) => a.localeCompare(b),
      ),
    [recipesQuery.data],
  )

  useDocumentMeta({
    title: 'Редактирование рецепта — Mealio',
    description: 'Измените ингредиенты, шаги и параметры рецепта.',
  })

  if (!Number.isInteger(recipeId)) {
    return (
      <div className="page-wrap">
        <ErrorState message="Некорректный идентификатор рецепта." />
      </div>
    )
  }

  if (recipeQuery.isLoading) {
    return (
      <div className="page-wrap space-y-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (recipeQuery.isError || !recipeQuery.data) {
    return (
      <div className="page-wrap space-y-4">
        <ErrorState
          message="Рецепт недоступен. Возможно, он был создан в другой сессии и не сохранился на сервере."
          onRetry={() => void recipeQuery.refetch()}
        />
        <Link to="/recipes" className="text-sm font-medium text-accent hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="page-wrap">
      <PageHeader
        title="Редактирование"
        description={`PUT /recipes/${recipeId}. Изменения обновляют список и детальную страницу в кэше.`}
      />

      <div className="mb-5">
        <DemoNotice>
          DummyJSON симулирует PUT и возвращает изменённый объект, но не хранит его. После
          перезагрузки страницы вернутся исходные данные.
        </DemoNotice>
      </div>

      <RecipeForm
        key={recipeQuery.data.id}
        initialRecipe={recipeQuery.data}
        cuisineOptions={cuisines}
        submitLabel="Сохранить изменения"
        cancelTo={`/recipes/${recipeId}`}
        isPending={updateRecipe.isPending}
        serverError={updateRecipe.isError ? getErrorMessage(updateRecipe.error) : undefined}
        onSubmit={(input) => {
          updateRecipe.mutate(input, {
            onSuccess: () => {
              navigate(`/recipes/${recipeId}`, { state: { updated: true } })
            },
          })
        }}
      />
    </div>
  )
}