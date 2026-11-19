---
name: new-fsd-slice
description: Use when adding a new slice to the Mealio FSD project — creates the layers, segments, public API, Storybook stories and runs the architecture checks.
---

# new-fsd-slice

Создание нового слайса в Mealio без нарушения границ FSD.

## Когда применять

- Новая сущность, фича, виджет или страница.
- Перенос логики из страницы в нижний слой.
- Добавление API-запросов, стора или UI-компонента, у которых ещё нет слайса.

## Решение до создания файлов

1. Определи слой: `entities` — данные и их отображение; `features` — действие пользователя; `widgets` — композиция для страницы; `pages` — маршрут и сборка; `shared` — инфраструктура без домена.
2. Проверь, не существует ли уже подходящий слайс: `src/entities`, `src/features`, `src/widgets`.
3. Определи сегменты: `ui`, `model`, `api`, `lib`, `config`. Создавай только нужные.
4. Проверь импорты: слайс может брать только слои ниже. Внутри слоя — без кросс-импортов.
5. Продумай public API: что именно увидят страницы и другие слои.

## Структура

```text
src/<layer>/<slice>/
├─ ui/            компоненты и их stories
├─ model/         типы, стор, схемы формы, константы
├─ api/           fetch-функции и query options
├─ lib/           чистые функции и адаптеры
├─ config/        константы конфигурации слайса
└─ index.ts       публичный API
```

Пример для фичи:

```text
src/features/toggle-favorite/
├─ model/favorites.store.ts
├─ ui/FavoriteButton.tsx
└─ index.ts
```

## Правила реализации

- `index.ts` экспортирует только то, что нужно снаружи. Внутренние файлы не импортируют друг друга через `..`.
- API-функции — типизированные, через `request<T>()` из `@/shared/api`.
- Query keys — стабильные, в `api/<name>.queries.ts`.
- Мутации обновляют кэш через `setQueryData`; не полагайся на `invalidateQueries` для DummyJSON.
- UI-компоненты берут примитивы из `@/shared/ui`, иконки — из `@/shared/ui`.
- Новый ui-kit компонент в `shared/ui` получает story с состояниями default, hover, disabled, error/loading, где применимо.
- Тексты интерфейса — русские, без эмодзи. Alt у изображений, aria-label у иконочных кнопок.
- Стор создаётся только для клиентского состояния. Серверные данные и параметры URL в стор не дублируются.

## Проверка

```bash
npm run typecheck
npm run lint
npm run lint:fsd
npm run build
npm run build-storybook
```

Ошибка `no-public-api-sidestep` — добавь экспорт в `index.ts` и импортируй слайс целиком. Ошибка `forbidden-imports` — перенеси код вниз по слоям. Ошибка `insignificant-slice` отключена в `steiger.config.ts`; не включай её ради нового слайса.

## Чек-лист

- [ ] Слой и сегменты выбраны осознанно.
- [ ] Все внешние импорты идут через `index.ts`.
- [ ] Нет импортов из слоёв выше.
- [ ] Типы без `any`, публичные сигнатуры типизированы.
- [ ] Нет эмодзи и запрещённых библиотек.
- [ ] Обновлён public API и, если нужно, README.
- [ ] Пройдены typecheck, lint, lint:fsd, build, build-storybook.