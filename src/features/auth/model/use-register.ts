import { useMutation } from '@tanstack/react-query'
import { registerUser, type RegisterInput } from '@/entities/user'

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) => registerUser(input),
  })
}