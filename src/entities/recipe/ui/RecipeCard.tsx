import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { formatMinutes, pluralize } from '@/shared/lib'
import { Card } from '@/shared/ui'
import { Badge } from '@/shared/ui'
import { ClockIcon } from '@/shared/ui'
import { getDifficultyLabel, getMealTypeLabel } from '../lib/recipe-format'
import type { Recipe } from '../model/types'
import { StarRating } from './StarRating'

export interface RecipeCardProps {
  recipe: Recipe
  action?: ReactNode
}

export function RecipeCard({ recipe, action }: RecipeCardProps) {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes

  return (
    <Card padded={false} className="group relative flex h-full flex-col overflow-hidden">
      <Link
        to={`/recipes/${recipe.id}`}
        className="block overflow-hidden bg-raised"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={recipe.image}
          alt=""
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>

      {action ? <div className="absolute top-3 right-3">{action}</div> : null}

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Badge variant="accent">{getMealTypeLabel(recipe.mealType[0] ?? '')}</Badge>
          <Badge>{getDifficultyLabel(recipe.difficulty)}</Badge>
        </div>

        <h3 className="text-base leading-snug font-semibold text-ink">
          <Link
            to={`/recipes/${recipe.id}`}
            className="underline-offset-4 hover:underline focus-visible:underline"
          >
            {recipe.name}
          </Link>
        </h3>

        <p className="mt-1 text-sm text-muted">{recipe.cuisine}</p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon size={14} />
            {formatMinutes(totalTime)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            {recipe.servings} {pluralize(recipe.servings, 'порция', 'порции', 'порций')}
          </span>
          <StarRating rating={recipe.rating} reviewCount={recipe.reviewCount} />
        </div>
      </div>
    </Card>
  )
}