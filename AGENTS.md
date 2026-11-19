# Mealio — правила работы агента

## Что это за проект

Учебный SPA-каталог рецептов на React + Vite + TypeScript. Данные — публичный DummyJSON API. Мутации POST, PUT и PATCH симулируются сервером и не сохраняются; источник правды после мутации — кэш TanStack Query.

Перед изменением кода прочитай этот файл и профильный skill `.omp/skills/new-fsd-slice/SKILL.md`, если работа касается слайса.

## Разрешённый стек

- React 19, Vite 8, TypeScript strict.
- react-router-dom: data router, loader, useSearchParams.
- TanStack Query: useQuery, useMutation, setQueryData.
- Zustand + persist: только токен и избранное.
- Tailwind CSS v4, mobile-first.
- Storybook для ui-kit.
- Нативный fetch через `shared/api/client.ts`.

Запрещено: Redux, axios, MUI, Chakra, shadcn, любые UI-библиотеки вне списка, эмодзи в UI, коде, комментариях, README и коммитах.

Иконки — только инлайн-SVG в `shared/ui/icons`, цвет через `currentColor`, декоративные иконки с `aria-hidden`.

## Команды

```bash
npm run dev
npm run typecheck
npm run lint
npm run lint:fsd
npm run build
npm run build-storybook
npm run storybook
```

Перед завершением задачи обязательны `typecheck`, `lint`, `lint:fsd`, `build` и `build-storybook`. Для UI-изменений — проверка в браузере на 360, 768 и 1280 px.

## FSD: слои и импорты

Слои сверху вниз: `app`, `pages`, `widgets`, `features`, `entities`, `shared`.

- Слой импортирует только слои ниже.
- Внутри слоя нет кросс-импортов между слайсами.
- Любой импорт из слайса — только через его `index.ts` (public API).
- Сегменты слайса: `ui`, `model`, `api`, `lib`, `config`.
- `shared` не импортирует другие слои и не знает о домене.
- `app` может импортировать всё, но не наоборот.
- `entities` не импортируют `features`, `widgets`, `pages` или `app`.

Проверка: `npm run lint:fsd` (steiger). Правило `fsd/insignificant-slice` отключено осознанно: маленькие фичи и виджеты, используемые одной страницей, остаются отдельными слайсами.

## Сегменты и нейминг

- Компоненты: `PascalCase.tsx`, один компонент на файл, экспорт через `index.ts` слайса.
- Хуки: `use-kebab-case.ts`, экспорт `useCamelCase`.
- Сторы: `*.store.ts`, имя `useXStore`.
- Типы: `entities/<name>/model/types.ts`; `interface` для объектов, `type` для объединений, generic-обёрток и утилит.
- Утилиты: `kebab-case.ts` в `lib`.
- CSS-классы — Tailwind; общие токены только в `app/styles/index.css`.
- Русский текст интерфейса, английские идентификаторы и код.

## TypeScript

- `strict: true`, без `any`, без `as any`, без `@ts-ignore`.
- Неизвестные ошибки сужать через `instanceof` / type guard.
- Публичные функции и хуки типизировать явно.
- Типы DummyJSON писать вручную; схемы и генерация типов не используются.
- Для списков использовать generic `ApiListResponse<T, ListKey>`.

## Данные и кэш

- Каталог: один запрос `GET /recipes?limit=0`; поиск, фильтры, сортировка и пагинация — на клиенте.
- Состояние каталога только в URL: `q`, `mealType`, `tag`, `cuisine`, `difficulty`, `sort`, `order`, `page`.
- Серверные данные — TanStack Query. Клиентское состояние — Zustand. Дублирование запрещено.
- После мутации обновлять и список, и деталь через `setQueryData`. Не полагаться на `invalidateQueries`: сервер вернёт старые данные.
- Локально созданный рецепт имеет id `Date.now()`. Сервер о нём не знает, поэтому PUT/PATCH для него не отправляются; изменения живут только в кэше.
- Детальная страница открывается через loader, который сначала смотрит detail-кэш, затем список, затем сеть.

## Коммиты

Conventional Commits, один коммит на логический шаг:

```text
chore: scaffold vite react ts tailwind fsd linters storybook
docs: add agents guide and new-fsd-slice skill
feat(shared): add api client ui kit icons and stories
feat(app): configure router layouts and not-found
feat(entities): add recipe and user models with typed api
feat(catalog): add url-driven search filters sorting and pagination
feat(recipe): add cache-aware detail loader
feat(auth): add persisted session login guards and 401 handling
feat(favorites): add persisted favorites and page
feat(recipes): add create and update mutations with cache sync
feat(rating): add patch rating with aggregate cache update
feat(register): add simulated signup flow
feat(seo-a11y): add metadata robots sitemap and focus states
docs: add readme postman collection limitations and project tree
```

Без эмодзи. В теле коммита — что изменено и как проверено.

## Чек-лист перед завершением

- [ ] `npm run typecheck` без ошибок.
- [ ] `npm run lint` без ошибок.
- [ ] `npm run lint:fsd` без ошибок.
- [ ] `npm run build` без ошибок.
- [ ] `npm run build-storybook` без ошибок.
- [ ] Проверены 360, 768 и 1280 px; нет горизонтального скролла.
- [ ] Проверены loading, empty, error и disabled состояния.
- [ ] У каждого изображения есть alt, у иконочных кнопок — aria-label.
- [ ] Работает клавиатурная навигация, виден focus, Modal закрывается по Escape.
- [ ] Обновлены README и таблица применённых тем.
- [ ] В UI и README есть пометка о демонстрационных данных.