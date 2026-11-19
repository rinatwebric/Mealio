import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface FavoritesState {
  favoriteIds: number[]
  toggleFavorite: (recipeId: number) => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favoriteIds: [],
      toggleFavorite: (recipeId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(recipeId)
            ? state.favoriteIds.filter((id) => id !== recipeId)
            : [...state.favoriteIds, recipeId],
        })),
    }),
    {
      name: 'mealio-favorites',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    },
  ),
)