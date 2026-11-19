import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from './auth.store'

export function useLogout() {
  const queryClient = useQueryClient()
  const clearSession = useAuthStore((state) => state.clearSession)
  const navigate = useNavigate()

  return useCallback(() => {
    clearSession()
    queryClient.clear()
    navigate('/', { replace: true })
  }, [clearSession, navigate, queryClient])
}