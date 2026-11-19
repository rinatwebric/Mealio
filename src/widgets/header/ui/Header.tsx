import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCurrentUser, UserAvatar } from '@/entities/user'
import { useAuthStore, LogoutButton } from '@/features/auth'
import { useFavoritesStore } from '@/features/favorite-recipe'
import { Modal } from '@/shared/ui'
import {
  BookIcon,
  HeartIcon,
  HomeIcon,
  LogoMark,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from '@/shared/ui'
import { cn } from '@/shared/lib'

const navItems = [
  { to: '/', label: 'Главная', icon: HomeIcon, end: true },
  { to: '/recipes', label: 'Рецепты', icon: BookIcon, end: false },
  { to: '/favorites', label: 'Избранное', icon: HeartIcon, end: false },
]

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'flex items-center gap-2.5 rounded-control px-3 py-2 text-sm',
    isActive ? 'bg-active font-medium text-ink' : 'text-muted hover:bg-raised hover:text-ink',
  )
}

function SearchForm({ onDone }: { onDone?: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={(event) => {
        event.preventDefault()
        const trimmed = query.trim()
        navigate(trimmed ? `/recipes?q=${encodeURIComponent(trimmed)}` : '/recipes')
        setQuery('')
        onDone?.()
      }}
    >
      <SearchIcon
        size={16}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
      />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Найти рецепт"
        aria-label="Поиск рецептов"
        className="h-9 w-full rounded-control border border-line bg-surface pr-3 pl-9 text-sm text-ink placeholder:text-muted/70"
      />
    </form>
  )
}

function AccountBlock({ compact = false }: { compact?: boolean }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const currentUser = useCurrentUser(Boolean(accessToken))

  if (!accessToken) {
    return (
      <div className={cn('flex gap-2', compact ? 'flex-col' : 'flex-col')}>
        <Link
          to="/login"
          className="flex h-9 items-center justify-center rounded-control border border-control px-3 text-sm font-medium text-ink hover:bg-raised"
        >
          Войти
        </Link>
        <Link
          to="/register"
          className="flex h-9 items-center justify-center rounded-control px-3 text-sm text-muted hover:bg-raised hover:text-ink"
        >
          Регистрация
        </Link>
      </div>
    )
  }

  return (
    <div className="min-w-0">
      <Link
        to="/profile"
        className="flex items-center gap-2.5 rounded-control p-2 hover:bg-raised"
      >
        {currentUser.data ? (
          <UserAvatar
            firstName={currentUser.data.firstName}
            lastName={currentUser.data.lastName}
            size={32}
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-active text-muted">
            <UserIcon size={16} />
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-ink">
            {currentUser.data
              ? `${currentUser.data.firstName} ${currentUser.data.lastName}`
              : 'Профиль'}
          </span>
          <span className="block truncate text-xs text-muted">Профиль и избранное</span>
        </span>
      </Link>
      <LogoutButton className="mt-1 w-full justify-start" />
    </div>
  )
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const favoriteCount = useFavoritesStore((state) => state.favoriteIds.length)

  return (
    <>
      <aside className="hidden flex-col gap-6 p-4 lg:flex">
        <Link to="/" className="flex items-center gap-2 px-2 py-1">
          <LogoMark size={30} className="text-accent" />
          <span className="text-lg font-semibold tracking-tight">Mealio</span>
        </Link>

        <nav aria-label="Основная навигация" className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.to === '/favorites' && favoriteCount > 0 ? (
                <span className="ml-auto rounded-[4px] bg-surface px-1.5 py-0.5 font-mono text-xs text-muted">
                  {favoriteCount}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/recipes/new"
          className="flex h-10 items-center justify-center gap-2 rounded-control bg-ink px-3 text-sm font-medium text-white hover:bg-ink/90"
        >
          <PlusIcon size={16} />
          Добавить рецепт
        </Link>

        <div className="mt-auto border-t border-line pt-4">
          <AccountBlock />
        </div>
      </aside>

      <header className="flex h-12 items-center gap-2 px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          className="flex h-11 w-11 items-center justify-center rounded-control text-ink hover:bg-active"
        >
          <MenuIcon size={20} />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <LogoMark size={24} className="text-accent" />
          <span className="text-base font-semibold tracking-tight">Mealio</span>
        </Link>
        <Link
          to="/favorites"
          aria-label={`Избранное: ${favoriteCount}`}
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-control text-ink hover:bg-active"
        >
          <HeartIcon size={18} />
        </Link>
      </header>

      <Modal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Навигация"
        className="sm:max-w-sm"
      >
        <div className="space-y-4">
          <SearchForm onDone={() => setMenuOpen(false)} />
          <nav aria-label="Мобильная навигация" className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.to === '/favorites' && favoriteCount > 0 ? (
                  <span className="ml-auto rounded-[4px] bg-surface px-1.5 py-0.5 font-mono text-xs text-muted">
                    {favoriteCount}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/recipes/new"
            onClick={() => setMenuOpen(false)}
            className="flex h-10 items-center justify-center gap-2 rounded-control bg-ink px-3 text-sm font-medium text-white hover:bg-ink/90"
          >
            <PlusIcon size={16} />
            Добавить рецепт
          </Link>
          <div className="border-t border-line pt-4">
            <AccountBlock compact />
          </div>
        </div>
      </Modal>
    </>
  )
}

export function TopBar() {
  return (
    <div className="hidden h-12 items-center gap-4 px-4 lg:flex">
      <div className="ml-auto w-full max-w-md">
        <SearchForm />
      </div>
      <Link
        to="/favorites"
        className="flex h-9 items-center gap-2 rounded-control px-3 text-sm text-muted hover:bg-active hover:text-ink"
      >
        <HeartIcon size={16} />
        Избранное
      </Link>
    </div>
  )
}