import { useState } from 'react'
import type { Recipe } from '@/entities/recipe'
import { getErrorMessage } from '@/shared/api'
import { formatRating } from '@/shared/lib'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui'
import { Modal } from '@/shared/ui'
import { StarIcon } from '@/shared/ui'
import { useRateRecipe } from '../model/use-rate-recipe'

export interface RateRecipeModalProps {
  recipe: Recipe
  open: boolean
  onClose: () => void
}

export function RateRecipeModal({ recipe, open, onClose }: RateRecipeModalProps) {
  const [value, setValue] = useState(0)
  const rateRecipe = useRateRecipe(recipe.id)

  function handleClose() {
    if (rateRecipe.isPending) {
      return
    }
    setValue(0)
    rateRecipe.reset()
    onClose()
  }

  function handleSubmit() {
    if (value < 1) {
      return
    }
    rateRecipe.mutate(value, {
      onSuccess: () => {
        setValue(0)
        onClose()
      },
    })
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Оценить рецепт"
      description={`${recipe.name} — текущий рейтинг ${formatRating(recipe.rating)} из 5.`}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={rateRecipe.isPending}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={rateRecipe.isPending}
            disabled={value < 1}
          >
            Отправить оценку
          </Button>
        </>
      }
    >
      <div className="flex items-center justify-center gap-2 py-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`Оценка ${star} из 5`}
            aria-pressed={value === star}
            onClick={() => setValue(star)}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-control hover:bg-raised',
              star <= value ? 'text-[#a86f0c]' : 'text-muted',
            )}
          >
            <StarIcon size={28} filled={star <= value} />
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted">
        DummyJSON хранит только общий рейтинг. Оценка пересчитывается как среднее по числу
        отзывов и сохраняется в кэше этой сессии.
      </p>

      {rateRecipe.isError ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {getErrorMessage(rateRecipe.error)}
        </p>
      ) : null}
    </Modal>
  )
}