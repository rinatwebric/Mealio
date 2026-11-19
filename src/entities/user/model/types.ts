export interface UserAddress {
  city?: string
  country?: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
  image: string
  age?: number
  gender?: string
  role?: string
  address?: UserAddress
}

export interface AuthUser extends User {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  username: string
  password: string
  expiresInMins?: number
}

export interface RegisterInput {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
}