# Этап 1: сборка проекта
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Этап 2: сервировка через Nginx
FROM nginx:stable-alpine

# Удалим дефолтный конфиг и добавим свой
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранные файлы Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Экспонируем порт
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
