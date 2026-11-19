import { endpoints, request } from '@/shared/api'
import type { AuthUser, LoginCredentials, RegisterInput, User } from '../model/types'

export function loginUser(credentials: LoginCredentials): Promise<AuthUser> {
  return request<AuthUser>(endpoints.authLogin, {
    method: 'POST',
    body: JSON.stringify({ ...credentials, expiresInMins: 60 }),
  })
}

export function fetchCurrentUser(): Promise<User> {
  return request<User>(endpoints.authMe)
}

export function fetchUser(id: number): Promise<User> {
  return request<User>(endpoints.userById(id))
}

export function registerUser(input: RegisterInput): Promise<User> {
  return request<User>(endpoints.userAdd, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}