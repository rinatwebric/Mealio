import type { ApiErrorPayload } from './types'

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'https://dummyjson.com'

type TokenProvider = () => string | null
type UnauthorizedHandler = () => void

let getToken: TokenProvider = () => null
let onUnauthorized: UnauthorizedHandler | null = null

export function configureApiClient(config: {
  tokenProvider?: TokenProvider
  unauthorizedHandler?: UnauthorizedHandler
}) {
  if (config.tokenProvider) {
    getToken = config.tokenProvider
  }
  if (config.unauthorizedHandler) {
    onUnauthorized = config.unauthorizedHandler
  }
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorPayload
    return payload.message ?? `Request failed with status ${response.status}`
  } catch {
    return `Request failed with status ${response.status}`
  }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const token = getToken()

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })

  if (response.status === 401) {
    onUnauthorized?.()
    throw new ApiError(401, 'Сессия истекла. Войдите снова.')
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Неизвестная ошибка'
}