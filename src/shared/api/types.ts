export type ApiListResponse<T, ListKey extends string> = {
  total: number
  skip: number
  limit: number
} & Record<ListKey, T[]>

export type ApiErrorPayload = {
  message?: string
}