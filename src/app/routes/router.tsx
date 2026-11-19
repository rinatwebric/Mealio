import { createBrowserRouter } from 'react-router-dom'
import { RequireAuth } from '@/features/auth'
import { CatalogPage } from '@/pages/catalog'
import { FavoritesPage } from '@/pages/favorites'
import { HomePage } from '@/pages/home'
import { LoginPage } from '@/pages/login'
import { NotFoundPage, RouteErrorPage } from '@/pages/not-found'
import { ProfilePage } from '@/pages/profile'
import { RecipeCreatePage } from '@/pages/recipe-create'
import { RecipeDetailPage, recipeLoader } from '@/pages/recipe-detail'
import { RecipeEditPage } from '@/pages/recipe-edit'
import { RegisterPage } from '@/pages/register'
import { AuthLayout } from '../layouts/AuthLayout'
import { RootLayout } from '../layouts/RootLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'recipes',
        element: <CatalogPage />,
      },
      {
        path: 'recipes/:recipeId',
        element: <RecipeDetailPage />,
        loader: recipeLoader,
        errorElement: <RouteErrorPage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'register',
            element: <RegisterPage />,
          },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'recipes/new',
            element: <RecipeCreatePage />,
          },
          {
            path: 'recipes/:recipeId/edit',
            element: <RecipeEditPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])