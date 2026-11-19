import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CUISINES, useRecipes } from '@/entities/recipe'
import { useCreateRecipe, RecipeForm } from '@/features/manage-recipe'
import { getErrorMessage } from '@/shared/api'
import { useDocumentMeta } from '@/shared/lib'
import { DemoNotice } from '@/shared/ui'
import { PageHeader } from '@/shared/ui'

export function RecipeCreatePage() {
  const navigate = useNavigate()
  const recipesQuery = useRecipes()
  const createRecipe = useCreateRecipe()

  const cuisines = useMemo(
    () =>
      [...new Set([...CUISINES, ...(recipesQuery.data ?? []).map((recipe) => recipe.cuisine)])].sort(
        (a, b) => a.localeCompare(b),
      ),
    [recipesQuery.data],
  )

  useDocumentMeta({
    title: 'Новый рецепт — Mealio',
    description: 'Добавьте рецепт в каталог: ингредиенты, шаги, время приготовления и сложность.',
  })

  return (
    <div className="page-wrap">
      <PageHeader
        title="Новый рецепт"
        description="Форма отправляет POST /recipes/add. DummyJSON возвращает созданную запись, но не сохраняет её на сервере."
      />

      <div className="mb-5">
        <DemoNotice>
          После отправки рецепт попадёт в кэш каталога и откроется по своему URL. После полной
          перезагрузки без кэша сервер его уже не отдаст.
        </DemoNotice>
      </div>

      <RecipeForm
        cuisineOptions={cuisines}
        submitLabel="Создать рецепт"
        cancelTo="/recipes"
        isPending={createRecipe.isPending}
        serverError={createRecipe.isError ? getErrorMessage(createRecipe.error) : undefined}
        onSubmit={(input) => {
          createRecipe.mutate(input, {
            onSuccess: (recipe) => {
              navigate(`/recipes/${recipe.id}`, { state: { created: true } })
            },
          })
        }}
      />
    </div>
  )
}