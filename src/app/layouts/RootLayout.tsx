import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header, TopBar } from '@/widgets/header'
import { Footer } from '@/widgets/footer'

export function RootLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="min-h-dvh bg-ground lg:grid lg:grid-cols-[228px_minmax(0,1fr)]">
      <a href="#main" className="skip-link">
        Перейти к содержимому
      </a>
      <Header />
      <div className="min-w-0 lg:pr-2 lg:pb-2">
        <TopBar />
        <main
          id="main"
          className="app-sheet max-lg:rounded-none max-lg:border-x-0 max-lg:border-t-0"
        >
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  )
}