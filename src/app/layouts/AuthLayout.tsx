import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-[70dvh] justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}