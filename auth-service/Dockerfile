# Используем официальный образ Go для сборки
FROM golang:1.23-alpine AS builder

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем go mod и go sum файлы
COPY go.mod go.sum ./

# Загружаем зависимости
RUN go mod tidy

# Копируем весь исходный код в контейнер
COPY . .

# Переходим в директорию с исходным кодом main.go
WORKDIR /app/cmd/auth-service

# Собираем приложение
RUN go build -o /auth-service .

# Используем минимальный образ для выполнения
FROM alpine:latest

# Устанавливаем рабочую директорию в контейнере
WORKDIR /root/

# Устанавливаем необходимые пакеты
RUN apk add --no-cache bash curl

# Копируем скомпилированный файл из стадии сборки
COPY --from=builder /auth-service .

# Загружаем wait-for-it.sh
RUN curl -o /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x /usr/local/bin/wait-for-it.sh

# Указываем порт, на котором будет работать сервис
EXPOSE 8081

# Запускаем приложение с использованием wait-for-it для ожидания базы данных
CMD ["/usr/local/bin/wait-for-it.sh", "auth-db:5432", "--timeout=60", "--strict", "--", "./auth-service"]
