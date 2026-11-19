export type ValidationError = string | null

export function required(value: string, message = 'Поле обязательно'): ValidationError {
  return value.trim().length === 0 ? message : null
}

export function minLength(value: string, min: number, message: string): ValidationError {
  return value.trim().length < min ? message : null
}

export function validateEmail(value: string): ValidationError {
  if (!value.trim()) {
    return 'Введите email'
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? null : 'Некорректный email'
}

export function validatePassword(value: string): ValidationError {
  if (!value) {
    return 'Введите пароль'
  }
  return value.length >= 6 ? null : 'Минимум 6 символов'
}

export function validateUsername(value: string): ValidationError {
  if (!value.trim()) {
    return 'Введите логин'
  }
  return /^[a-zA-Z0-9._-]{3,20}$/.test(value.trim())
    ? null
    : '3–20 символов: латиница, цифры, точка, дефис или подчёркивание'
}

export function validatePositiveInteger(value: string, message: string): ValidationError {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? null : message
}

export function validateUrl(value: string): ValidationError {
  if (!value.trim()) {
    return 'Укажите ссылку на изображение'
  }
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? null : 'Нужна ссылка http(s)'
  } catch {
    return 'Некорректная ссылка'
  }
}

export function validateLines(value: string, minCount: number, message: string): ValidationError {
  const lines = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  return lines.length >= minCount ? null : message
}

