import { Link, useLocation } from 'react-router-dom'
import { RegisterForm } from '@/features/auth'
import { useDocumentMeta } from '@/shared/lib'
import { Card } from '@/shared/ui'

interface RegisterLocationState {
  from?: string
}

export function RegisterPage() {
  const location = useLocation()
  const state = (location.state ?? {}) as RegisterLocationState
  const from = state.from?.startsWith('/') ? state.from : '/'

  useDocumentMeta({
    title: 'Регистрация — Mealio',
    description: 'Демонстрационная регистрация: DummyJSON принимает запрос, но не создаёт пользователя.',
  })

  return (
    <Card className="p-5 sm:p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Регистрация</h1>
      <p className="mt-2 text-sm text-muted">
        DummyJSON не создаёт реальных пользователей. После успешного ответа войдите тестовыми
        данными из документации.
      </p>

      <div className="mt-6">
        <RegisterForm />
      </div>

      <p className="mt-5 border-t border-line pt-4 text-sm text-muted">
        Уже есть аккаунт?{' '}
        <Link to="/login" state={{ from }} className="font-medium text-accent hover:underline">
          Войти
        </Link>
      </p>
    </Card>
  )
}