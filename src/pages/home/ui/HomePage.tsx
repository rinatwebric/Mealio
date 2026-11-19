import { Link } from 'react-router-dom'
import { RecipeCard, useRecipes, useRecipeTags } from '@/entities/recipe'
import { FavoriteButton } from '@/features/favorite-recipe'
import { useDocumentMeta } from '@/shared/lib'
import { SITE_DESCRIPTION } from '@/shared/config'
import { Card } from '@/shared/ui'
import { EmptyState } from '@/shared/ui'
import { ErrorState } from '@/shared/ui'
import { Skeleton } from '@/shared/ui'
import { ArrowRightIcon, PlusIcon } from '@/shared/ui'

export function HomePage() {
  const recipesQuery = useRecipes()
  const tagsQuery = useRecipeTags()

  useDocumentMeta({
    title: 'Mealio — рецепты на каждый день',
    description: SITE_DESCRIPTION,
  })

  const recipes = recipesQuery.data ?? []
  const popular = [...recipes].sort((a, b) => b.rating - a.rating).slice(0, 6)
  const hero = popular[0]
  const tags = (tagsQuery.data ?? []).slice(0, 14)

  if (recipesQuery.isLoading) {
    return (
      <div className="page-wrap space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <Skeleton className="h-16 w-4/5" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-11 w-48" />
          </div>
          <Skeleton className="aspect-[4/3] w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-80" />
          ))}
        </div>
      </div>
    )
  }

  if (recipesQuery.isError) {
    return (
      <div className="page-wrap">
        <ErrorState
          message="Проверьте подключение к DummyJSON и повторите запрос."
          onRetry={() => void recipesQuery.refetch()}
        />
      </div>
    )
  }

  return (
    <div className="page-wrap">
      <section className="grid gap-8 border-b border-line pb-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
        <div>
          <h1 className="max-w-[16ch] text-4xl leading-[1.02] font-semibold tracking-[-0.035em] text-ink sm:text-5xl lg:text-[64px]">
            Готовьте то, что любите
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
            {recipes.length} рецептов: ищите по названию, тегу и сложности, сохраняйте любимое и
            добавляйте свои блюда.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/recipes"
              className="inline-flex h-11 items-center gap-2 rounded-control bg-ink px-5 text-sm font-medium text-white hover:bg-ink/90"
            >
              Смотреть рецепты
              <ArrowRightIcon size={16} />
            </Link>
            <Link
              to="/recipes/new"
              className="inline-flex h-11 items-center gap-2 rounded-control border border-control px-5 text-sm font-medium text-ink hover:bg-raised"
            >
              <PlusIcon size={16} />
              Добавить рецепт
            </Link>
          </div>

          <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-muted">Рецептов</dt>
              <dd className="mt-0.5 text-xl font-medium text-ink">{recipes.length}</dd>
            </div>
            <div>
              <dt className="text-muted">Кухонь</dt>
              <dd className="mt-0.5 text-xl font-medium text-ink">
                {new Set(recipes.map((recipe) => recipe.cuisine)).size}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Средний рейтинг</dt>
              <dd className="mt-0.5 text-xl font-medium text-ink">
                {(
                  recipes.reduce((sum, recipe) => sum + recipe.rating, 0) / recipes.length
                ).toFixed(1)}
              </dd>
            </div>
          </dl>
        </div>

        {hero ? (
          <figure>
            <Link to={`/recipes/${hero.id}`} className="block overflow-hidden rounded-card bg-raised">
              <img
                src={hero.image}
                alt={hero.name}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            </Link>
            <figcaption className="mt-2 flex items-center justify-between gap-3 text-sm text-muted">
              <span>
                {hero.name} · {hero.cuisine}
              </span>
              <span className="font-mono text-xs">Рейтинг {hero.rating.toFixed(1)}</span>
            </figcaption>
          </figure>
        ) : null}
      </section>

      <section className="mt-10" aria-labelledby="popular-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="popular-heading" className="text-xl font-semibold tracking-tight">
              Популярные рецепты
            </h2>
            <p className="mt-1 text-sm text-muted">Самые высокие оценки в каталоге.</p>
          </div>
          <Link
            to="/recipes"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            Все рецепты
            <ArrowRightIcon size={15} />
          </Link>
        </div>

        {popular.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                action={<FavoriteButton recipeId={recipe.id} />}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Рецептов пока нет"
            description="DummyJSON вернул пустой список. Попробуйте обновить страницу."
          />
        )}
      </section>

      <section className="mt-10" aria-labelledby="tags-heading">
        <div className="mb-5">
          <h2 id="tags-heading" className="text-xl font-semibold tracking-tight">
            Что приготовить сегодня
          </h2>
          <p className="mt-1 text-sm text-muted">Начните с тега, который подходит настроению.</p>
        </div>

        {tagsQuery.isError ? (
          <Card className="p-4 text-sm text-muted">Теги временно недоступны.</Card>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                to={`/recipes?tag=${encodeURIComponent(tag)}`}
                className="inline-flex h-9 items-center rounded-control border border-line px-3 text-sm text-ink hover:border-control hover:bg-raised"
              >
                {tag}
              </Link>
            ))}
            <Link
              to="/recipes"
              className="inline-flex h-9 items-center rounded-control bg-accent-soft px-3 text-sm font-medium text-accent hover:bg-accent-soft/80"
            >
              Все теги
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}