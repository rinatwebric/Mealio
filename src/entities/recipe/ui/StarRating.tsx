import { formatRating, pluralize } from '@/shared/lib'
import { StarIcon } from '@/shared/ui'
import { cn } from '@/shared/lib'

export interface StarRatingProps {
  rating: number
  reviewCount: number
  size?: number
  className?: string
}

export function StarRating({ rating, reviewCount, size = 14, className }: StarRatingProps) {
  const filledStars = Math.round(rating)

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-xs text-muted', className)}
      aria-label={`Рейтинг ${formatRating(rating)} из 5, ${reviewCount} ${pluralize(
        reviewCount,
        'отзыв',
        'отзыва',
        'отзывов',
      )}`}
    >
      <span className="flex text-[#a86f0c]" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <StarIcon key={index} size={size} filled={index < filledStars} />
        ))}
      </span>
      <span className="font-medium text-ink">{formatRating(rating)}</span>
      <span aria-hidden="true">({reviewCount})</span>
    </span>
  )
}