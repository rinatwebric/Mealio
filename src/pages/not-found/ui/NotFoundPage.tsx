import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { useDocumentMeta } from '@/shared/lib'

function NotFoundContent({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center px-4 py-10">
      <div className="max-w-lg text-center">
        <p className="font-mono text-sm text-muted">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-muted">{description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            to="/"
            className="inline-flex h-10 items-center rounded-control bg-ink px-4 text-sm font-medium text-white hover:bg-ink/90"
          >
            На главную
          </Link>
          <Link
            to="/recipes"
            className="inline-flex h-10 items-center rounded-control border border-control px-4 text-sm font-medium text-ink hover:bg-raised"
          >
            В каталог
          </Link>
        </div>
      </div>
    </div>
  )
}

export function NotFoundPage() {
  useDocumentMeta({
    title: 'Страница не найдена — Mealio',
    description: 'Такой страницы нет. Вернитесь в каталог рецептов.',
  })

  return (
    <NotFoundContent
      title="Страница не найдена"
      description="Проверьте адрес или начните с каталога рецептов."
    />
  )
}

export function RouteErrorPage() {
  const error = useRouteError()
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  useDocumentMeta({
    title: isNotFound ? 'Рецепт не найден — Mealio' : 'Ошибка загрузки — Mealio',
    description: isNotFound
      ? 'Рецепт не найден на сервере. Возможно, он существовал только в кэше другой сессии.'
      : 'Не удалось загрузить страницу.',
  })

  return (
    <NotFoundContent
      title={isNotFound ? 'Рецепт не найден' : 'Не удалось загрузить страницу'}
      description={
        isNotFound
          ? 'DummyJSON не знает такой рецепт. Локально созданные записи доступны только пока лежат в кэше текущей сессии.'
          : 'Проверьте подключение и попробуйте открыть страницу снова.'
      }
    />
  )
}