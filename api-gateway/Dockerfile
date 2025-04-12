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
WORKDIR /app/cmd/api-gateway

# Собираем приложение
RUN go build -o /api-gateway .

# Используем минимальный образ для выполнения
FROM alpine:latest

# Устанавливаем рабочую директорию в контейнере
WORKDIR /root/

# Копируем скомпилированный файл из стадии сборки
COPY --from=builder /api-gateway .

# Указываем порт, на котором будет работать сервис
EXPOSE 8080

# Запускаем приложение
CMD ["./api-gateway"]
