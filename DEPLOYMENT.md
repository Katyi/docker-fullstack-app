# DEPLOYMENT.md

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

## 1. Локальный запуск (без Docker)

1. Установите зависимости:
   ```bash
   cd api && npm install
   cd ../frontend && npm install
   ```
2. Запустите backend:
   ```bash
   cd api && npm start
   ```
3. Запустите frontend:
   ```bash
   cd frontend && npm run dev
   ```
4. Проверьте работу по адресу http://localhost:3000 (или 3001)

## 2. Запуск через Docker Compose (продакшен или staging)

1. Убедитесь, что установлены Docker и Docker Compose.
2. Проверьте/создайте `.env` с нужными переменными.
3. Соберите и запустите контейнеры:
   ```bash
   docker-compose build
   docker-compose up -d
   ```
4. Проверьте статус:
   ```bash
   docker-compose ps
   ```
5. После первого запуска выполните миграции Prisma:
   ```bash
   docker exec -it api npx prisma migrate deploy
   ```

## 3. Работа с медиа-файлами

- В продакшене папка `/var/www/fileUpload/uploaded_files/media` создаётся автоматически через Docker volume.
- В локальной разработке используется папка `api/uploads` (создайте вручную, если её нет).
- Проверьте права доступа, если возникают ошибки при загрузке файлов.

## 4. Проверка работоспособности

- API: `curl http://localhost:4000/test`
- Загрузка файла: `curl -X POST -F "file=@test.jpg" http://localhost:4000/upload/image-upload`
- Доступ к файлу: `curl http://localhost:4000/media/имя_файла.jpg`

## 5. Обновление проекта

1. Остановите контейнеры:
   ```bash
   docker-compose down
   ```
2. Получите новые изменения:
   ```bash
   git pull
   ```
3. Пересоберите и запустите:
   ```bash
   docker-compose build
   docker-compose up -d
   ```
4. Выполните миграции, если были изменения в базе:
   ```bash
   docker exec -it api npx prisma migrate deploy
   ```

## 6. Типовые проблемы

- **Права на папки:**
  - Проверьте права на папку с медиа-файлами (`uploads` или volume Docker)
- **Порты заняты:**
  - Измените порты в `compose.yaml` или остановите другие сервисы
- **Ошибка с переменными окружения:**
  - Проверьте, что `.env` корректно заполнен и доступен контейнерам

---

**Документ поддерживайте в актуальном состоянии при изменениях в инфраструктуре!** 