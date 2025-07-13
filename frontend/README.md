# Postcard Fullstack App

## Переменные окружения

- Для **production** используйте один файл `.env` в корне проекта (рядом с `compose.yaml`).  
  Docker Compose автоматически подхватит переменные из этого файла и пробросит их в контейнеры.

- Для **локальной разработки** вы можете использовать отдельные `.env` файлы в папках `api/` и `frontend/` (они добавлены в `.gitignore` и не попадут в репозиторий).

### Пример содержимого корневого `.env`:
```
NEXT_PUBLIC_API_URL=http://your-domain.ru/api
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
DATABASE_URL="postgresql://postgres:postgres@db:5432/postgres?schema=public"
JWT_SECRET=your-secret-key
NODE_ENV=production
```

## Запуск в production

```bash
docker-compose build
docker-compose up -d
```

- После первого запуска выполните миграции Prisma:
  ```bash
  docker exec -it api npx prisma migrate deploy
  ```

## Запуск для локальной разработки

- Используйте свои `.env` файлы в `api/` и `frontend/`.
- Запускайте сервисы через `npm run dev` или `npm start` в соответствующих папках:

```bash
cd api && npm install && npm start
cd frontend && npm install && npm run dev
```

## Примечания

- Для production не требуется копировать `.env` в папки сервисов — используйте только корневой `.env`.
- Для локальной разработки можно использовать разные `.env` для каждого сервиса.
- Все секреты и пароли держите вне репозитория!
