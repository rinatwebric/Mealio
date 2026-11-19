import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AppProviders } from '@/app/setup/AppProviders'
import '@/app/setup/bootstrap'
import { router } from '@/app/routes/router'
import '@/app/styles/index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root container not found')
}

createRoot(container).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)