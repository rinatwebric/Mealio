import { queryOptions, useQuery } from '@tanstack/react-query'
import { fetchCurrentUser, fetchUser } from './user.api'

export const userKeys = {
  all: ['users'] as const,
  current: () => [...userKeys.all, 'current'] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
}

export const currentUserQueryOptions = queryOptions({
  queryKey: userKeys.current(),
  queryFn: fetchCurrentUser,
  staleTime: 5 * 60_000,
  retry: false,
})

export function userQueryOptions(id: number) {
  return queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
    staleTime: 30 * 60_000,
  })
}

export function useCurrentUser(enabled: boolean) {
  return useQuery({
    ...currentUserQueryOptions,
    enabled,
  })
}

export function useUser(id: number, enabled = true) {
  return useQuery({
    ...userQueryOptions(id),
    enabled: enabled && Number.isFinite(id),
  })
}