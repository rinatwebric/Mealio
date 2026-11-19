# Mealio

Учебный SPA-каталог рецептов: поиск и фильтры через URL, детальная страница на data-router loader, авторизация, избранное, создание и редактирование рецептов, оценка блюда.

Данные и мутации демонстрационные. DummyJSON отвечает на POST, PUT и PATCH, но не сохраняет изменения на сервере. После мутации источник правды — кэш TanStack Query. После полной перезагрузки без кэша сервер вернёт исходные данные.

## Стек

- React 19 + Vite 8 + TypeScript strict.
- react-router-dom 7, data router (`createBrowserRouter`), loader, `useSearchParams`.
- TanStack Query 5.
- Zustand 5 + persist.
- Tailwind CSS 4.
- Storybook 10.
- Нативный `fetch`, общий клиент в `shared/api`.

Запрещённые библиотеки (Redux, axios, MUI/Chakra/shadcn и другие UI-наборы) не используются. Эмодзи отсутствуют в UI, коде, README и коммитах. Иконки — инлайн-SVG в `shared/ui/icons`, цвет через `currentColor`.

## Запуск

```bash
npm install
npm run dev
```

Приложение: `http://localhost:5173`.

Тестовый пользователь DummyJSON:

```text
логин: emilys
пароль: emilyspass
```

Другие пользователи перечислены в документации DummyJSON. Регистрация через приложение не создаёт реального пользователя — см. раздел об API.

## Скрипты

| Команда | Что делает |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run typecheck` | `tsc -b` |
| `npm run lint` | oxlint |
| `npm run lint:fsd` | steiger, проверка границ FSD |
| `npm run build` | typecheck + production build |
| `npm run preview` | предпросмотр production build |
| `npm run storybook` | Storybook на порту 6006 |
| `npm run build-storybook` | статическая сборка Storybook |

## Архитектура: почему FSD

Сравнение подходов:

| Подход | Плюсы | Минусы |
| --- | --- | --- |
| Компонентная | Быстрый старт, минимум файлов, удобно для маленького приложения | Бизнес-логика расползается по страницам и компонентам, импорты не ограничены, API-код дублируется |
| Модульная | Домены сгруппированы, у модуля может быть свой API | Нет общего стандарта границ, сущности дублируются между модулями, правила импортов приходится изобретать |
| FSD | Явные слои, public API, предсказуемое направление импортов, проверка линтером, проще масштабировать | Больше файлов и церемоний, нужна дисциплина, для маленького проекта избыточна |

Проект использует FSD, потому что курс оценивает архитектуру и границы слоёв, а каталог естественно делится на `entities/recipe`, `features/auth`, `features/manage-recipe`, `widgets/recipe-filters` и страницы.

### Слои

Сверху вниз: `app`, `pages`, `widgets`, `features`, `entities`, `shared`.

| Слой | Ответственность |
| --- | --- |
| `app` | router, layouts, setup провайдеров, глобальные стили |
| `pages` | маршруты, сборка виджетов и фич, URL-состояние каталога |
| `widgets` | Header, Footer, панель фильтров |
| `features` | auth, favorite-recipe, manage-recipe, rate-recipe |
| `entities` | Recipe, User: типы, API, query options, карточки |
| `shared` | fetch-клиент, ui-kit, валидаторы, форматтеры, SEO |

Правила:

- Слой импортирует только слои ниже.
- Кросс-импорты между слайсами одного слоя отсутствуют.
- Импорт из слайса — только через `index.ts`.
- `entities` не знают о `features` и `pages`.
- Границы проверяет steiger: `npm run lint:fsd`.

Правило `fsd/insignificant-slice` отключено в `steiger.config.ts` осознанно: `rate-recipe`, `favorite-recipe` и `recipe-filters` используются одной страницей, но остаются отдельными слайсами с собственным public API и зоной ответственности. Включать его — значит либо дробить функциональность искусственно, либо смешивать её со страницей.

### Дерево

```text
Mealio/
├─ .omp/skills/new-fsd-slice/SKILL.md
├─ .storybook/
├─ public/                      robots.txt, sitemap.xml, favicon.svg
├─ docs/                        Mealio.postman_collection.json
├─ src/
│  ├─ app/
│  │  ├─ layouts/               RootLayout, AuthLayout
│  │  ├─ routes/router.tsx
│  │  ├─ setup/                 AppProviders, bootstrap API client
│  │  └─ styles/index.css
│  ├─ pages/
│  │  ├─ home/
│  │  ├─ catalog/               model/catalog-params, lib/filter-recipes
│  │  ├─ recipe-detail/         api/recipe.loader, ui/RecipeDetailPage
│  │  ├─ recipe-create/
│  │  ├─ recipe-edit/
│  │  ├─ favorites/
│  │  ├─ login/
│  │  ├─ register/
│  │  ├─ profile/
│  │  └─ not-found/
│  ├─ widgets/
│  │  ├─ header/
│  │  ├─ footer/
│  │  └─ recipe-filters/
│  ├─ features/
│  │  ├─ auth/
│  │  ├─ favorite-recipe/
│  │  ├─ manage-recipe/
│  │  └─ rate-recipe/
│  ├─ entities/
│  │  ├─ recipe/
│  │  └─ user/
│  └─ shared/
│     ├─ api/
│     ├─ ui/                     ui-kit, icons, stories
│     ├─ lib/
│     └─ config/
├─ AGENTS.md
├─ CLAUDE.md
├─ steiger.config.ts
├─ vite.config.ts
├─ tsconfig*.json
└─ package.json
```

## Где какое состояние

| Место | Что хранится | Почему |
| --- | --- | --- |
| URL (`useSearchParams`) | `q`, `mealType`, `tag`, `cuisine`, `difficulty`, `sort`, `order`, `page` | Ссылку можно скопировать, back/forward восстанавливает каталог, Zustand не дублирует фильтры |
| TanStack Query | список 50 рецептов, деталь рецепта, теги, автор, `auth/me` | Серверные данные, кэш, состояния загрузки и ошибок |
| Zustand + persist | `accessToken`; `favoriteIds` | Клиентское состояние между перезагрузками. Другие поля не сохраняются |
| Локальный `useState` | поля форм, открытие Modal, раскрытие фильтров на телефоне | Эфемерное UI-состояние |

`accessToken` хранится только в Zustand. Профиль пользователя не дублируется в сторе — он живёт в React Query (`GET /auth/me`). Избранное не привязано к аккаунту DummyJSON и переживает выход.

## API

Используемые ресурсы и эндпоинты:

| Метод и путь | Назначение |
| --- | --- |
| `GET /recipes?limit=0` | все 50 рецептов для клиентской фильтрации |
| `GET /recipes/:id` | детальная страница |
| `GET /recipes/search?q=` | проверен; в приложении не используется, поиск клиентский |
| `GET /recipes/tags` | облако тегов на главной и опции фильтра |
| `GET /recipes/tag/:tag` | проверен; в приложении не используется |
| `GET /recipes/meal-type/:type` | проверен; в приложении не используется |
| `POST /recipes/add` | создание рецепта |
| `PUT /recipes/:id` | полное редактирование |
| `PATCH /recipes/:id` | оценка рецепта |
| `POST /auth/login` | вход, JWT |
| `GET /auth/me` | текущий пользователь, Bearer |
| `GET /users/:id` | автор рецепта |
| `POST /users/add` | симуляция регистрации |

Ресурс — `recipes`. Пользователи нужны для автора и авторизации.

### Почему фильтры клиентские

DummyJSON умеет `search`, `sortBy` и `limit/skip`, а также `tag/:tag` и `meal-type/:type`, но не умеет сочетать поиск, тег, кухню, сложность и сортировку в одном запросе. Отдельного `filter` нет. `limit=0` возвращает все 50 записей.

Поэтому приложение один раз загружает набор, а поиск, фильтры, сортировку и пагинацию делает на клиенте. URL остаётся единственным источником состояния. Ключ кэша стабилен: `['recipes', 'list']`; параметры URL не создают лишних сетевых запросов. Это осознанный компромисс для 50 записей, а не серверная пагинация.

### Мутации и кэш

| Действие | Запрос | Обновление кэша |
| --- | --- | --- |
| Создать рецепт | `POST /recipes/add` | `setQueryData` списка (prepend) + detail |
| Редактировать | `PUT /recipes/:id` | `setQueryData` списка (replace) + detail |
| Поставить оценку | `PATCH /recipes/:id` | пересчёт `rating`/`reviewCount`, `setQueryData` обоих кэшей |

`invalidateQueries` для списков не используется: DummyJSON вернул бы старые данные и затёр бы локальные изменения.

### Локально созданные рецепты

DummyJSON возвращает созданному рецепту `id: 51`, но не хранит его. Чтобы несколько созданий в одной сессии не конфликтовали, приложение присваивает локальный id `Date.now()` (13 цифр). Детальная страница открывается, пока запись лежит в кэше: loader сначала читает detail-кэш, затем список.

Для локального id PUT и PATCH не отправляются: сервер отвечает `404` (проверено). Редактирование и оценка такого рецепта обновляют только кэш. Для серверных рецептов `1–50` PUT и PATCH выполняются реальными запросами.

### Оценка

Отдельной оценки пользователя в DummyJSON нет. PATCH обновляет агрегированный рейтинг:

```text
newRating = (rating * reviewCount + userRating) / (reviewCount + 1)
reviewCount = reviewCount + 1
```

Модальное окно и README честно называют это демонстрационной симуляцией. Повторная оценка снова увеличивает `reviewCount`; сервер это не сохраняет.

### Авторизация

- `POST /auth/login` с `expiresInMins: 60`.
- `accessToken` кладётся в Zustand persist, другие поля — нет.
- Все запросы идут через `shared/api/client.ts`, который подставляет `Authorization: Bearer`.
- `GET /auth/me` восстанавливает профиль после перезагрузки.
- При `401` клиент вызывает обработчик: очищает токен и кэш, редиректит на `/login`, сохраняя `state.from`; после входа пользователь возвращается на исходный путь.
- Защищённые маршруты: `/recipes/new`, `/recipes/:id/edit`, `/profile`.
- Refresh-токен не используется: истёкший access token приводит к выходу.

### Регистрация

`POST /users/add` отвечает `201` и возвращает объект с новым id, но пользователь не создаётся и пароль не сохраняется. Форма показывает успех и ведёт на логин, где используются тестовые пользователи DummyJSON. Это ограничение API, а не приложения.

### Swagger и генерация типов

В DummyJSON нет Swagger UI в проекте, а генерация типов не применялась. Типы написаны вручную в `entities/*/model/types.ts`. Generic-обёртка списка — `ApiListResponse<T, ListKey>` в `shared/api/types.ts`, типизированный клиент — `request<T>()` в `shared/api/client.ts`.

## Маршруты

| Путь | Страница | Доступ |
| --- | --- | --- |
| `/` | главная: популярные рецепты и теги | публичный |
| `/recipes` | каталог с URL-фильтрами | публичный |
| `/recipes/:recipeId` | деталь через loader | публичный |
| `/favorites` | избранное | публичный |
| `/recipes/new` | создание рецепта | защищённый |
| `/recipes/:recipeId/edit` | редактирование | защищённый |
| `/login` | вход | гость |
| `/register` | регистрация | гость |
| `/profile` | профиль | защищённый |
| `*` | 404 | публичный |

Вложенные layout: `RootLayout` (Header/TopBar/Footer/Outlet) и `AuthLayout` (центрированная карточка/Outlet). Loader детали учитывает кэш, поэтому локально созданная запись открывается по своему URL.

## Применение тем курса

| Тема | Где применено |
| --- | --- |
| Data router, 10 маршрутов, вложенные layout, loader, 404, guards | `app/routes/router.tsx`, `app/layouts/*`, `pages/recipe-detail/api/recipe.loader.ts`, `features/auth/ui/RequireAuth.tsx` |
| `useSearchParams`, копируемый URL | `pages/catalog/model/catalog-params.ts`, `pages/catalog/ui/CatalogPage.tsx` |
| React Query: `useQuery`, queryKey, staleTime, skeleton, error | `entities/recipe/api/recipe.queries.ts`, `entities/user/api/user.queries.ts`, страницы |
| Мутации POST/PUT/PATCH, pending/error, `setQueryData` | `features/manage-recipe/model/*`, `features/rate-recipe/model/*`, `shared/ui/Skeleton`, формы |
| Zustand auth + persist только токена | `features/auth/model/auth.store.ts`, `app/setup/bootstrap.ts` |
| Zustand избранное + persist | `features/favorite-recipe/model/favorites.store.ts`, `ui/FavoriteButton.tsx` |
| Формы, валидация, ошибки под полями, disabled при pending | `features/auth/ui/*`, `features/manage-recipe/ui/RecipeForm.tsx`, `shared/lib/validation.ts` |
| TypeScript strict, interface/type, generic | `tsconfig.app.json`, `shared/api/types.ts`, `entities/*/model/types.ts` |
| Tailwind mobile-first, 360/768/1280, hover/focus | `app/styles/index.css`, все страницы и `shared/ui` |
| Storybook ui-kit | `shared/ui/*.stories.tsx`, `.storybook/*` |
| SEO: title/description/OG, h1, alt, lang, robots, sitemap | `shared/lib/use-document-meta.ts`, `shared/config/seo.ts`, `index.html`, `public/*` |
| Доступность: focus, aria, контраст, focus trap | `shared/ui/Button.tsx`, `Modal.tsx`, `Pagination.tsx`, `shared/ui/icons`, формы |
| fetch-клиент с Bearer | `shared/api/client.ts` |
| FSD и границы импортов | `steiger.config.ts`, `AGENTS.md`, `.omp/skills/new-fsd-slice/SKILL.md` |

## Проверенные запросы

Все запросы ниже проверены `curl`; импортируемая коллекция для Postman — `docs/Mealio.postman_collection.json`. Ручной запуск внутри Postman в этой среде не выполнялся: приложение проверено через curl и браузер.

| Запрос | Статус | Результат |
| --- | --- | --- |
| `GET /recipes?limit=0` | 200 | 50 рецептов, `total: 50` |
| `GET /recipes/1` | 200 | Classic Margherita Pizza |
| `GET /recipes/search?q=chicken&limit=0` | 200 | поиск работает |
| `GET /recipes/tags` | 200 | массив тегов |
| `GET /recipes/tag/Italian?limit=0` | 200 | 6 рецептов |
| `POST /auth/login` | 200 | accessToken, refreshToken, профиль |
| `GET /auth/me` с Bearer | 200 | emilys |
| `GET /auth/me` с неверным токеном | 401 | обработчик выхода |
| `GET /users/45` | 200 | автор рецепта |
| `POST /users/add` | 201 | id 209, пользователь не сохраняется |
| `POST /recipes/add` | 201 | id 51, рецепт не сохраняется |
| `PUT /recipes/1` | 200 | изменённый объект, сервер не сохраняет |
| `PATCH /recipes/1` | 200 | изменённый рейтинг, сервер не сохраняет |
| `PUT /recipes/<локальный id>` | 404 | ожидаемо; приложение не отправляет такой запрос |

## Storybook

В `shared/ui` есть stories для Button, Input, Select, Badge, Card, Modal, Skeleton, Pagination и Textarea. Показаны default, hover/focus, disabled, error и loading там, где состояние применимо. Hover проверяется через `play` и `userEvent`.

```bash
npm run storybook
npm run build-storybook
```

## SEO

- Уникальные `title` и `description` на каждой странице через `useDocumentMeta`.
- Open Graph и Twitter meta, canonical, `og:url`, `og:image`; для детали — изображение рецепта.
- Один `h1` на страницу, семантические `header/main/section/article/aside/footer`, `alt` у изображений, `lang="ru"`.
- `public/robots.txt` и `public/sitemap.xml`.

Ограничения SPA: мета меняется после выполнения JS. Краулер без JavaScript видит только статический `index.html`; предрендера и SSR нет. `sitemap.xml` статический и не содержит 50 карточек рецептов. Домен `https://mealio.example` — замените на реальный перед публикацией. `og:image` для детали — внешняя ссылка DummyJSON.

## Доступность и адаптив

- Skip link, `:focus-visible`, клавиатурная навигация.
- Modal: `role="dialog"`, `aria-modal`, focus trap, Escape, возврат фокуса, блокировка скролла.
- Иконочные кнопки имеют `aria-label`; избранное — `aria-pressed`.
- Пагинация: `aria-current="page"`, подписи страниц.
- Поля связаны с label, ошибки — `aria-invalid` и `aria-describedby`, сообщение об ошибке с `role="alert"`.
- Счётчик результатов — `aria-live="polite"`.
- Проверены 360, 768 и 1280 px; горизонтального скролла нет. На телефоне фильтры сворачиваются в кнопку, пагинация показывает «Страница N из M», меню открывается в Modal.

Скриншоты не хранятся в репозитории; проверка выполнялась в браузере на живом dev-сервере и production build.

## Ограничения API и демо-режима

- DummyJSON не сохраняет POST, PUT, PATCH и DELETE.
- Созданные рецепты живут только в кэше текущей сессии; после перезагрузки без кэша их нет.
- PUT/PATCH для локальных id не отправляются: сервер их не знает и отвечает 404.
- Регистрация не создаёт пользователя; вход — тестовыми данными.
- Оценка — агрегированный рейтинг, не персональный отзыв. Повторная оценка увеличивает число отзывов.
- В наборе 50 рецептов; сложность `Hard` в данных не встречается, хотя форма её допускает.
- Нет серверной фильтрации и пагинации; всё считается на клиенте.
- Токен живёт 60 минут; refresh-flow нет, при 401 выполняется выход.
- Нет загрузки изображений: форма принимает URL.

## Что не сделано

- Нет DELETE: по финальному объёму проекта удаление не входило в мутации.
- Нет корзины: клиентское состояние ограничено избранным.
- Нет персональных оценок и отзывов: API не хранит их.
- Нет refresh-токена и продления сессии.
- Нет SSR/предрендера и серверной генерации OG-страниц.
- Нет unit/e2e тестов: проверка ручная через браузер, curl, typecheck, lint, steiger, build и Storybook.
- Нет Swagger и генерации типов.
- Нет динамического sitemap для карточек рецептов.
- Нет ручного прогона коллекции в Postman (только curl + импортируемая коллекция).

## Отклонения от первоначального плана

- Удалён DELETE и `DeleteRecipeModal` по финальному ТЗ.
- Для локально созданных рецептов PUT/PATCH заменены обновлением кэша: сервер отвечает 404 (проверено).
- Вместо DummyJSON-иконок пользователей используются инициалы: исходные identicon-картинки нечитаемы в маленьком размере.
- Сегмент `app/providers` переименован в `app/setup`, чтобы пройти правило steiger о назначении сегмента.
- Правило steiger `fsd/insignificant-slice` отключено с обоснованием выше.
- Фильтры на телефоне сворачиваются по кнопке, чтобы список начинался в первом экране.
- Postman заменён коллекцией + проверкой curl; ручной GUI-прогон не выполнялся.

## Проверка

На момент сдачи:

```text
npm run typecheck      ok
npm run lint           ok
npm run lint:fsd       ok
npm run build          ok
npm run build-storybook ok
```

Дополнительно проверено в браузере: главная, каталог с URL-фильтрами, деталь, 404, вход, выход, защита маршрута, возврат после логина, 401, регистрация, избранное с persist, создание и редактирование рецепта, PATCH-оценка, мобильное меню и пагинация.

Данные демонстрационные. Для реального продукта нужен backend, сохраняющий рецепты, пользователей и оценки.
Проверка выполнена 19 ноября 2026 года.
