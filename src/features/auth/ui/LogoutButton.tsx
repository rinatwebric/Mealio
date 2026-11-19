import { LogoutIcon } from '@/shared/ui'
import { cn } from '@/shared/lib'
import { useLogout } from '../model/use-logout'

export function LogoutButton({ className }: { className?: string }) {
  const logout = useLogout()

  return (
    <button
      type="button"
      onClick={logout}
      className={cn(
        'inline-flex items-center gap-2 rounded-control px-3 py-2 text-sm text-muted hover:bg-raised hover:text-ink',
        className,
      )}
    >
      <LogoutIcon size={16} />
      Выйти
    </button>
  )
}