import { useState, type FormEvent } from 'react'
import { getErrorMessage } from '@/shared/api'
import { Button } from '@/shared/ui'
import { Input } from '@/shared/ui'
import { required } from '@/shared/lib'
import { useLogin } from '../model/use-login'

export interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const login = useLogin()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    const usernameError = required(username, 'Введите логин')
    const passwordError = required(password, 'Введите пароль')

    if (usernameError) {
      nextErrors.username = usernameError
    }
    if (passwordError) {
      nextErrors.password = passwordError
    }
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    login.mutate(
      { username: username.trim(), password },
      { onSuccess },
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input
        label="Логин"
        name="username"
        autoComplete="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        error={errors.username}
        placeholder="emilys"
      />
      <Input
        label="Пароль"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={errors.password}
        placeholder="emilyspass"
      />

      {login.isError ? (
        <p role="alert" className="rounded-control bg-[#ffedea] px-3 py-2 text-sm text-[#831c1e]">
          {getErrorMessage(login.error)}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" isLoading={login.isPending}>
        Войти
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={() => {
          setUsername('emilys')
          setPassword('emilyspass')
          setErrors({})
        }}
      >
        Подставить тестового пользователя
      </Button>
    </form>
  )
}