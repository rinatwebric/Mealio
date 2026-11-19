import { cn } from '@/shared/lib'
import { HeartIcon } from '@/shared/ui'
import { useFavoritesStore } from '../model/favorites.store'

export interface FavoriteButtonProps {
  recipeId: number
  className?: string
  size?: number
}

export function FavoriteButton({ recipeId, className, size = 18 }: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore((state) => state.favoriteIds.includes(recipeId))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
      onClick={() => toggleFavorite(recipeId)}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/95 text-muted transition-colors hover:text-accent',
        isFavorite && 'text-accent',
        className,
      )}
    >
      <HeartIcon size={size} filled={isFavorite} />
    </button>
  )
}