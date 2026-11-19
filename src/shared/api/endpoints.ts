export const endpoints = {
  recipes: '/recipes',
  recipeById: (id: number) => `/recipes/${id}`,
  recipeAdd: '/recipes/add',
  recipesTags: '/recipes/tags',
  userById: (id: number) => `/users/${id}`,
  userAdd: '/users/add',
  authLogin: '/auth/login',
  authMe: '/auth/me',
} as const