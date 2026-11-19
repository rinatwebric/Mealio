import { Link } from 'react-router-dom'
import { LogoMark } from '@/shared/ui'

export function Footer() {
  return (
    <footer className="mt-12 border-t border-line px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-2">
            <LogoMark size={26} className="text-accent" />
            <span className="text-lg font-semibold tracking-tight">Mealio</span>
          </Link>
          <p className="mt-2 max-w-md text-sm text-muted">
            Учебный проект каталога рецептов. Данные и мутации демонстрационные: DummyJSON
            отвечает на запросы, но ничего не сохраняет на сервере.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          <Link to="/recipes" className="hover:text-ink">
            Рецепты
          </Link>
          <Link to="/favorites" className="hover:text-ink">
            Избранное
          </Link>
          <a
            href="https://dummyjson.com/docs"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            DummyJSON API
          </a>
          <span className="font-mono text-xs">2026</span>
        </div>
      </div>
    </footer>
  )
}