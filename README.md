# Кошачий Пинтерест

Этот репозиторий содержит полный стек приложения «Кошачий Пинтерест»:

- Back-end на NestJS + TypeORM + PostgreSQL
- Front-end на React + TypeScript + Tailwind CSS

Всё запускается локально одной командой `docker compose up`.

## Быстрый старт

Запустите проект через `docker compose up`

При необходимости измените VITE_API_BASE_URL или ключ Cat API.

Затем откройте http://localhost:8080 в браузере

## Структура проекта

```
.
├── README.md        # Этот файл
├── compose.yaml     # Общий docker-compose
├── ...
├── openapi.yaml     # Описание API
├── api/
│   ├── Dockerfile
│   ├── ...
│   ├── src/
│   │   └── ...
│   └── test/
│       └── ...
├── front/
│   ├── Dockerfile
│   ├── ...
│   └── src/
│       └── ...
└── .github/
    └── CODEOWNERS
```

## Локальная разработка

### Back-end

```
# перейдите в папку api/
cd api

# создайте файл с перемнными окружения
cp .env.example .env

# установите зависимости и запустите локально
npm install
npm run start:dev
```

### Front-end

```
# перейдите в папку front/
cd front

# создайте файл с перемнными окружения
cp .env.example .env

# установите зависимости и запустите локально
npm install
npm run dev

# по умолчанию http://localhost:5173
```

При локальной разработке прокси задаётся в `vite.config.ts`. Все запросы `/api/_` пробрасываются на `http://localhost:3000/_`.

## Тесты

Для Back-end есть тесты (Unit + e2e на Jest + Supertest)

Запуск:

```
cd api
npm run test # unit
npm run test:e2e # e2e
npm run test:cov # unit + coverage
```

## Что было сделано

- Был реализован back-end с использованием `PostgreSQL`, `TypeORM` и `TypeScript`,
- Был немного обновлен `openapi.yaml` (добавлены новые возможные ответы, например с `401 Unathorized` при запросах без токена)
- Был реализован front-end с использованием `React`, `TypeScript`, `Vite`, `React Router`, `Zustand` и `Tailwind CSS`
- На front-end по умолчанию открывается вкладка "все котики"
- Каждого котика можно добавить в "любимые" и убрать из "любимых"
- Данные о "любимых" котиках хранятся на back-end
- На front-end на вкладке "любимые котики" отображаются добавленные в "любимые" котики
- Реализована адаптивность (до `320px`)
- Реализована бесконечная прокрутка с помощью `react-infinite-scroll-component`

---

Если у вас возникают вопросы по проекту, я открыт для обратной связи)

Telegram - https://t.me/geelix6
