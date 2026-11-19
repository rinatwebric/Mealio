import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LoginForm, useAuthStore } from '@/features/auth'
import { useDocumentMeta } from '@/shared/lib'
import { Card } from '@/shared/ui'

interface LoginLocationState {
  from?: string
}

export function LoginPage() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const location = useLocation()
  const navigate = useNavigate()
  const state = (location.state ?? {}) as LoginLocationState
  const redirectTo = state.from?.startsWith('/') ? state.from : '/'

  useDocumentMeta({
    title: 'Вход — Mealio',
    description: 'Войдите, чтобы добавлять и редактировать рецепты.',
  })

  if (accessToken) {
    return <Navigate to={redirectTo} replace />
  }

  return (
    <Card className="p-5 sm:p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Вход</h1>
      <p className="mt-2 text-sm text-muted">
        После входа вы вернётесь на страницу, с которой открыли форму.
      </p>

      <div className="mt-6">
        <LoginForm onSuccess={() => navigate(redirectTo, { replace: true })} />
      </div>

      <p className="mt-5 border-t border-line pt-4 text-sm text-muted">
        Нет аккаунта?{' '}
        <Link to="/register" state={{ from: redirectTo }} className="font-medium text-accent hover:underline">
          Зарегистрироваться
        </Link>
      </p>

      <p className="mt-3 text-xs text-muted">
        Тестовые пользователи DummyJSON: emilys / emilyspass, michaelw / michaelwpass.
      </p>
    </Card>
  )
}