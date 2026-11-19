import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loginUser, userKeys, type AuthUser, type LoginCredentials, type User } from '@/entities/user'
import { useAuthStore } from './auth.store'

function toUser(authUser: AuthUser): User {
  return {
    id: authUser.id,
    firstName: authUser.firstName,
    lastName: authUser.lastName,
    username: authUser.username,
    email: authUser.email,
    image: authUser.image,
    age: authUser.age,
    gender: authUser.gender,
    role: authUser.role,
    address: authUser.address,
  }
}

export function useLogin() {
  const queryClient = useQueryClient()
  const setToken = useAuthStore((state) => state.setToken)

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    onSuccess: (authUser) => {
      setToken(authUser.accessToken)
      queryClient.setQueryData(userKeys.current(), toUser(authUser))
    },
  })
}