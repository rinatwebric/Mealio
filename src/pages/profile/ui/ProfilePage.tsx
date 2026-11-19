import { Link } from 'react-router-dom'
import { useCurrentUser, UserAvatar } from '@/entities/user'
import { LogoutButton } from '@/features/auth'
import { useFavoritesStore } from '@/features/favorite-recipe'
import { useDocumentMeta } from '@/shared/lib'
import { Card } from '@/shared/ui'
import { ErrorState } from '@/shared/ui'
import { PageHeader } from '@/shared/ui'
import { Skeleton } from '@/shared/ui'

export function ProfilePage() {
  const currentUser = useCurrentUser(true)
  const favoriteCount = useFavoritesStore((state) => state.favoriteIds.length)

  useDocumentMeta({
    title: 'Профиль — Mealio',
    description: 'Данные текущего пользователя и сохранённые рецепты.',
  })

  return (
    <div className="page-wrap">
      <PageHeader
        title="Профиль"
        description="Данные приходят из GET /auth/me по Bearer-токену."
        actions={<LogoutButton className="border border-line" />}
      />

      {currentUser.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : currentUser.isError || !currentUser.data ? (
        <ErrorState
          message="Не удалось получить профиль. Токен мог истечь."
          onRetry={() => void currentUser.refetch()}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <UserAvatar
                firstName={currentUser.data.firstName}
                lastName={currentUser.data.lastName}
                size={80}
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {currentUser.data.firstName} {currentUser.data.lastName}
                </h2>
                <p className="mt-1 text-sm text-muted">@{currentUser.data.username}</p>
                <p className="text-sm text-muted">{currentUser.data.email}</p>
              </div>
            </div>

            <dl className="mt-6 divide-y divide-line border-t border-line">
              <div className="flex justify-between gap-4 py-3 text-sm">
                <dt className="text-muted">Роль</dt>
                <dd className="font-medium text-ink">{currentUser.data.role ?? 'user'}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3 text-sm">
                <dt className="text-muted">Город</dt>
                <dd className="font-medium text-ink">{currentUser.data.address?.city ?? '—'}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3 text-sm">
                <dt className="text-muted">Страна</dt>
                <dd className="font-medium text-ink">{currentUser.data.address?.country ?? '—'}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="text-base font-semibold">Избранное</h2>
            <p className="mt-2 text-3xl font-normal text-ink">{favoriteCount}</p>
            <p className="mt-1 text-sm text-muted">
              Рецептов сохранено локально. Избранное не привязано к аккаунту DummyJSON.
            </p>
            <Link
              to="/favorites"
              className="mt-5 inline-flex h-10 items-center rounded-control border border-control px-4 text-sm font-medium text-ink hover:bg-raised"
            >
              Открыть избранное
            </Link>
          </Card>
        </div>
      )}
    </div>
  )
}