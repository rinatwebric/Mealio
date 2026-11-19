import { useAuthStore } from '@/features/auth'
import { configureApiClient, queryClient } from '@/shared/api'
import { router } from '../routes/router'

configureApiClient({
  tokenProvider: () => useAuthStore.getState().accessToken,
  unauthorizedHandler: () => {
    const currentPath = window.location.pathname
    const from = `${window.location.pathname}${window.location.search}`

    useAuthStore.getState().clearSession()
    queryClient.clear()

    if (currentPath !== '/login') {
      void router.navigate('/login', {
        replace: true,
        state: { from },
      })
    }
  },
})