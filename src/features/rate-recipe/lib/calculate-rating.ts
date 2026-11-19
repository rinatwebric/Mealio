export interface RatingResult {
  rating: number
  reviewCount: number
}

export function calculateAggregateRating(
  currentRating: number,
  currentReviewCount: number,
  userRating: number,
): RatingResult {
  const reviewCount = currentReviewCount + 1
  const rating = Number(
    ((currentRating * currentReviewCount + userRating) / reviewCount).toFixed(2),
  )

  return { rating, reviewCount }
}