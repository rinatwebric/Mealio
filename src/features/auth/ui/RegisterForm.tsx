import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getErrorMessage } from '@/shared/api'
import { Button } from '@/shared/ui'
import { Input } from '@/shared/ui'
import { minLength, validateEmail, validatePassword, validateUsername } from '@/shared/lib'
import { useRegister } from '../model/use-register'

interface RegisterValues {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
}

const initialValues: RegisterValues = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
}

export function RegisterForm() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [registered, setRegistered] = useState(false)
  const register = useRegister()

  function updateField(field: keyof RegisterValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {}
    const firstNameError = minLength(values.firstName, 2, 'Минимум 2 символа')
    const lastNameError = minLength(values.lastName, 2, 'Минимум 2 символа')
    const emailError = validateEmail(values.email)
    const usernameError = validateUsername(values.username)
    const passwordError = validatePassword(values.password)

    if (firstNameError) {
      nextErrors.firstName = firstNameError
    }
    if (lastNameError) {
      nextErrors.lastName = lastNameError
    }
    if (emailError) {
      nextErrors.email = emailError
    }
    if (usernameError) {
      nextErrors.username = usernameError
    }
    if (passwordError) {
      nextErrors.password = passwordError
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate()) {
      return
    }

    register.mutate(
      {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        username: values.username.trim(),
        password: values.password,
      },
      { onSuccess: () => setRegistered(true) },
    )
  }

  if (registered) {
    return (
      <div className="space-y-4" role="status">
        <p className="rounded-card bg-accent-soft p-4 text-sm text-accent">
          Аккаунт создан в демо-режиме. DummyJSON не сохраняет пользователя на сервере и не
          возвращает пароль. Войдите тестовыми данными из документации.
        </p>
        <Link
          to="/login"
          className="flex h-11 w-full items-center justify-center rounded-control bg-ink px-5 text-sm font-medium text-white hover:bg-ink/90"
        >
          Перейти к входу
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Имя"
          name="firstName"
          autoComplete="given-name"
          value={values.firstName}
          onChange={(event) => updateField('firstName', event.target.value)}
          error={errors.firstName}
        />
        <Input
          label="Фамилия"
          name="lastName"
          autoComplete="family-name"
          value={values.lastName}
          onChange={(event) => updateField('lastName', event.target.value)}
          error={errors.lastName}
        />
      </div>

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(event) => updateField('email', event.target.value)}
        error={errors.email}
      />
      <Input
        label="Логин"
        name="username"
        autoComplete="username"
        value={values.username}
        onChange={(event) => updateField('username', event.target.value)}
        error={errors.username}
      />
      <Input
        label="Пароль"
        name="password"
        type="password"
        autoComplete="new-password"
        value={values.password}
        onChange={(event) => updateField('password', event.target.value)}
        error={errors.password}
        hint="Минимум 6 символов. Пароль не сохраняется на сервере."
      />

      {register.isError ? (
        <p role="alert" className="rounded-control bg-[#ffedea] px-3 py-2 text-sm text-[#831c1e]">
          {getErrorMessage(register.error)}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" isLoading={register.isPending}>
        Создать аккаунт
      </Button>
    </form>
  )
}